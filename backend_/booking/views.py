from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from django.db import models
from django.db.models import Q
from .models import CustomUser, Flight, Booking
from .serializers import CustomUserSerializer, FlightSerializer, BookingSerializer, AdminUserSerializer, AdminFlightSerializer
from .amadeus_client import AmadeusClient
import logging

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            if user.status != 'approved':
                return Response({'error': 'Account is pending approval'}, status=status.HTTP_403_FORBIDDEN)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': CustomUserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class FlightListView(generics.ListCreateAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]

class FlightDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]

class BookingListView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.status != 'approved':
            raise PermissionDenied('Account is pending approval. You cannot make bookings until approved.')
        serializer.save(user=self.request.user)

class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

# Admin Views
class AdminUserListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(status='pending')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = CustomUser.objects.filter(status='pending')
        status = self.request.query_params.get('status')
        if status is not None:
            queryset = queryset.filter(status=status)
        return queryset

class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

class AdminFlightListView(generics.ListCreateAPIView):
    queryset = Flight.objects.all()
    serializer_class = AdminFlightSerializer
    permission_classes = [IsAdminUser]

class AdminFlightDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flight.objects.all()
    serializer_class = AdminFlightSerializer
    permission_classes = [IsAdminUser]

class AdminBookingStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_bookings = Booking.objects.count()
        paid_bookings = Booking.objects.filter(payment_status='paid').count()
        pending_bookings = Booking.objects.filter(payment_status='pending').count()
        failed_bookings = Booking.objects.filter(payment_status='failed').count()
        total_revenue = Booking.objects.filter(payment_status='paid').aggregate(
            total=models.Sum('flight__price')
        )['total'] or 0

        stats = {
            'total_bookings': total_bookings,
            'paid_bookings': paid_bookings,
            'pending_bookings': pending_bookings,
            'failed_bookings': failed_bookings,
            'total_revenue': total_revenue,
        }
        return Response(stats)

# Additional Views for API Specifications
class TokenRefreshView(TokenRefreshView):
    permission_classes = [IsAuthenticated]

class FlightSearchView(generics.ListAPIView):
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Flight.objects.all()
        departure = self.request.query_params.get('departure')
        arrival = self.request.query_params.get('arrival')
        date = self.request.query_params.get('date')

        if departure:
            queryset = queryset.filter(departure__icontains=departure)
        if arrival:
            queryset = queryset.filter(arrival__icontains=arrival)
        if date:
            queryset = queryset.filter(date__date=date)

        return queryset

class FlightStatusView(generics.RetrieveAPIView):
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'flight_number'
    lookup_url_kwarg = 'flight_number'

    def get_queryset(self):
        return Flight.objects.all()

class AdminUserApproveView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            user.status = 'approved'
            user.save()
            # Trigger email notification
            from .tasks import send_approval_email_task
            send_approval_email_task.delay(user.id)
            serializer = AdminUserSerializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminFlightStatusUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            flight = Flight.objects.get(pk=pk)
            status = request.data.get('status')
            if status in ['on-time', 'delayed']:
                flight.status = status
                flight.save()
                serializer = AdminFlightSerializer(flight)
                return Response(serializer.data)
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)
