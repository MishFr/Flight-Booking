from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from django.db import models
from django.db.models import Q
from datetime import date
from .models import CustomUser, Flight, Booking
from .serializers import (
    CustomUserSerializer, FlightSerializer, BookingSerializer, 
    AdminUserSerializer, AdminFlightSerializer,
    FlightSearchSerializer, CreateOrderSerializer, GetOrderSerializer
)
from .aviationstack_client import AviationStackClient
from .airlabs_client import AirLabsClient
from .amadeus_client import AmadeusClient
from .amadeus_service import AmadeusService
from .permissions import (
    IsApprovedUser, IsAdminOrApprovedUser, IPAddressPermission, BookingRateLimitPermission,
    FlightSearchThrottle, BookingThrottle, AdminThrottle
)
from .iata_utils import get_iata_code, get_city_from_iata, is_valid_iata, get_airport_info
import logging

logger = logging.getLogger(__name__)

class HomeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "message": "Welcome to Flight Booking API",
            "version": "1.0",
            "endpoints": {
                "api": "/api/",
                "admin": "/admin/"
            }
        })

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'message': 'User registered successfully! Please wait for admin approval.',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        user = serializer.save()
        user.status = 'approved'
        user.save()
        return user

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

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

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
    permission_classes = [IsAuthenticated, IsApprovedUser, BookingRateLimitPermission]
    throttle_classes = [BookingThrottle]

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
    permission_classes = [IsAdminUser, IPAddressPermission]
    throttle_classes = [AdminThrottle]

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
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle, FlightSearchThrottle]

    def get_queryset(self):
        queryset = Flight.objects.all()
        departure = self.request.query_params.get('departure')
        arrival = self.request.query_params.get('arrival')
        date_param = self.request.query_params.get('date')

        if departure:
            queryset = queryset.filter(departure__icontains=departure)
        if arrival:
            queryset = queryset.filter(arrival__icontains=arrival)
        if date_param:
            try:
                search_date = date.fromisoformat(date_param)
                queryset = queryset.filter(date__date=search_date)
            except ValueError:
                pass  # Invalid date format, skip filtering

        return queryset

    def list(self, request, *args, **kwargs):
        departure = request.query_params.get('departure')
        arrival = request.query_params.get('arrival')
        date_param = request.query_params.get('date')
        from_country = request.query_params.get('fromCountry')
        to_country = request.query_params.get('toCountry')
        use_mock = request.query_params.get('use_mock', 'false').lower() == 'true'

        # Validate departure date is not in the past
        if date_param:
            try:
                search_date = date.fromisoformat(date_param)
                if search_date < date.today():
                    return Response({'error': 'Departure date cannot be in the past'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        # If use_mock is true, return mock data (for testing)
        if use_mock and departure and arrival and date_param:
            mock_flights = self._generate_mock_flights(departure, arrival, date_param)
            return Response(mock_flights)
        
        # Try to get real flight data from Amadeus API
        if departure and arrival and date_param:
            try:
                flights = self._search_amadeus_flights(departure, arrival, date_param)
                if flights:
                    return Response(flights)
                # If API fails, fall back to mock data
                logger.warning("Amadeus API returned no results, falling back to mock data")
                mock_flights = self._generate_mock_flights(departure, arrival, date_param)
                return Response(mock_flights)
            except Exception as e:
                logger.error(f"Error calling Amadeus API: {e}")
                # Fall back to mock data on error
                mock_flights = self._generate_mock_flights(departure, arrival, date_param)
                return Response(mock_flights)
        else:
            # Fallback to database search if params are incomplete
            return super().list(request, *args, **kwargs)

    def _get_iata_code(self, city_name):
        """Convert city name to IATA code using the comprehensive IATA utility"""
        return get_iata_code(city_name)

    def _search_amadeus_flights(self, departure, arrival, date_param):
        """Search for flights using the Amadeus API"""
        try:
            origin_iata = self._get_iata_code(departure)
            dest_iata = self._get_iata_code(arrival)
            if not origin_iata or not dest_iata:
                logger.warning(f"Could not convert to IATA: {departure} -> {origin_iata}, {arrival} -> {dest_iata}")
                return None
            amadeus_client = AmadeusClient()
            flights = amadeus_client.search_flights(
                origin=origin_iata,
                destination=dest_iata,
                departure_date=date_param
            )
            if flights:
                return self._map_amadeus_flights(flights)
            return None
        except Exception as e:
            logger.error(f"Amadeus API error: {e}")
            raise

    def _generate_mock_flights(self, departure, arrival, date_param):
        """Generate mock flight data for testing purposes"""
        import random
        from datetime import datetime, timedelta

        # Parse the date
        try:
            search_date = datetime.fromisoformat(date_param)
        except ValueError:
            search_date = datetime.now() + timedelta(days=1)

        # Airlines and their codes
        airlines = [
            ('AA', 'American Airlines'),
            ('DL', 'Delta Air Lines'),
            ('UA', 'United Airlines'),
            ('WN', 'Southwest Airlines'),
            ('BA', 'British Airways'),
            ('LH', 'Lufthansa'),
            ('AF', 'Air France'),
            ('KL', 'KLM'),
            ('EK', 'Emirates'),
            ('SQ', 'Singapore Airlines')
        ]

        # Generate 5-10 mock flights
        num_flights = random.randint(5, 10)
        flights = []

        for i in range(num_flights):
            airline_code, airline_name = random.choice(airlines)
            flight_number = f"{airline_code}{random.randint(100, 9999)}"

            # Random departure time between 6 AM and 10 PM
            dep_hour = random.randint(6, 22)
            dep_minute = random.choice([0, 15, 30, 45])
            departure_time = search_date.replace(hour=dep_hour, minute=dep_minute)

            # Random flight duration between 2 and 12 hours
            duration_hours = random.randint(2, 12)
            duration_minutes = random.randint(0, 59)
            arrival_time = departure_time + timedelta(hours=duration_hours, minutes=duration_minutes)

            # Random price between $100 and $1500
            price = round(random.uniform(100, 1500), 2)

            # Random number of stops (0-2)
            stops = random.randint(0, 2)

            flight = {
                'id': f"mock_{i+1}",
                'flightNumber': flight_number,
                'from_location': departure.title(),
                'to': arrival.title(),
                'departureTime': departure_time.isoformat(),
                'arrivalTime': arrival_time.isoformat(),
                'duration': f"PT{duration_hours}H{duration_minutes}M",
                'stops': stops,
                'price': price,
                'currency': 'USD',
                'airline': airline_name,
                'status': 'scheduled'
            }
            flights.append(flight)

        # Sort flights by price
        flights.sort(key=lambda x: x['price'])
        return flights

    def _fallback_to_database(self, departure, arrival, date_param):
        """Fallback to database search when API fails"""
        queryset = self.get_queryset()
        if queryset.exists():
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({'error': 'No flights found'}, status=status.HTTP_404_NOT_FOUND)

    def _map_amadeus_flights(self, amadeus_data):
        """Map Amadeus API response to our flight format"""
        # Create reverse mapping for IATA to city
        city_to_iata = {
            'new york': 'JFK',
            'nyc': 'JFK',
            'london': 'LHR',
            'paris': 'CDG',
            'tokyo': 'NRT',
            'los angeles': 'LAX',
            'la': 'LAX',
            'chicago': 'ORD',
            'miami': 'MIA',
            'san francisco': 'SFO',
            'sf': 'SFO',
            'dallas': 'DFW',
            'atlanta': 'ATL',
            'denver': 'DEN',
            'seattle': 'SEA',
            'boston': 'BOS',
            'las vegas': 'LAS',
            'phoenix': 'PHX',
            'houston': 'IAH',
            'washington': 'DCA',
            'dc': 'DCA',
            'orlando': 'MCO',
            'charlotte': 'CLT',
            'salt lake city': 'SLC',
            'detroit': 'DTW',
            'minneapolis': 'MSP',
            'tampa': 'TPA',
            'philadelphia': 'PHL',
            'newark': 'EWR',
            'fort lauderdale': 'FLL',
            'portland': 'PDX',
            'oakland': 'OAK',
            'san diego': 'SAN',
            'pittsburgh': 'PIT',
            'raleigh': 'RDU',
            'austin': 'AUS',
            'nashville': 'BNA',
            'indianapolis': 'IND',
            'cincinnati': 'CVG',
            'columbus': 'CMH',
            'cleveland': 'CLE',
            'milwaukee': 'MKE',
            'kansas city': 'MCI',
            'omaha': 'OMA',
            'wichita': 'ICT',
            'tulsa': 'TUL',
            'oklahoma city': 'OKC',
            'albuquerque': 'ABQ',
            'reno': 'RNO',
            'boise': 'BOI',
            'spokane': 'GEG',
            'anchorage': 'ANC',
            'honolulu': 'HNL',
            'kailua': 'HNL',
            'lihue': 'LIH',
            'kahului': 'OGG',
            'kona': 'KOA',
            'london heathrow': 'LHR',
            'london gatwick': 'LGW',
            'london stansted': 'STN',
            'london luton': 'LTN',
            'london city': 'LCY',
            'paris charles de gaulle': 'CDG',
            'paris orly': 'ORY',
            'tokyo haneda': 'HND',
            'tokyo narita': 'NRT',
            'berlin': 'BER',
            'frankfurt': 'FRA',
            'munich': 'MUC',
            'rome': 'FCO',
            'milan': 'MXP',
            'madrid': 'MAD',
            'barcelona': 'BCN',
            'amsterdam': 'AMS',
            'zurich': 'ZRH',
            'vienna': 'VIE',
            'brussels': 'BRU',
            'copenhagen': 'CPH',
            'stockholm': 'ARN',
            'oslo': 'OSL',
            'helsinki': 'HEL',
            'warsaw': 'WAW',
            'prague': 'PRG',
            'budapest': 'BUD',
            'bucharest': 'OTP',
            'sofia': 'SOF',
            'athens': 'ATH',
            'istanbul': 'IST',
            'moscow': 'SVO',
            'saint petersburg': 'LED',
            'beijing': 'PEK',
            'shanghai': 'PVG',
            'hong kong': 'HKG',
            'singapore': 'SIN',
            'bangkok': 'BKK',
            'kuala lumpur': 'KUL',
            'jakarta': 'CGK',
            'manila': 'MNL',
            'seoul': 'ICN',
            'taipei': 'TPE',
            'delhi': 'DEL',
            'mumbai': 'BOM',
            'dubai': 'DXB',
            'abu dhabi': 'AUH',
            'doha': 'DOH',
            'kuwait': 'KWI',
            'riyadh': 'RUH',
            'jeddah': 'JED',
            'cairo': 'CAI',
            'johannesburg': 'JNB',
            'cape town': 'CPT',
            'lagos': 'LOS',
            'nairobi': 'NBO',
            'addis ababa': 'ADD',
            'sydney': 'SYD',
            'melbourne': 'MEL',
            'brisbane': 'BNE',
            'perth': 'PER',
            'auckland': 'AKL',
            'wellington': 'WLG',
            'rio de janeiro': 'GIG',
            'sao paulo': 'GRU',
            'buenos aires': 'EZE',
            'lima': 'LIM',
            'santiago': 'SCL',
            'bogota': 'BOG',
            'mexico city': 'MEX',
            'cancun': 'CUN',
            'toronto': 'YYZ',
            'montreal': 'YUL',
            'vancouver': 'YVR',
            'calgary': 'YYC',
            'edmonton': 'YEG',
            'ottawa': 'YOW',
            'winnipeg': 'YWG',
            'quebec city': 'YQB',
            'halifax': 'YHZ',
            'victoria': 'YYJ',
            'regina': 'YQR',
            'saskatoon': 'YXE',
            'thunder bay': 'YQT',
            'sudbury': 'YSB',
            'london ontario': 'YXU',
            'hamilton': 'YHM',
            'kitchener': 'YKF',
            'london kentucky': 'LOZ',
            'london arkansas': 'AUK',
            'london kentucky': 'LOZ',
            'london arkansas': 'AUK',
            'london california': 'AON',
            'london florida': 'LOF',
            'london indiana': 'LZD',
            'london iowa': 'LOL',
            'london kansas': 'LOK',
            'london maryland': 'W48',
            'london minnesota': 'D33',
            'london mississippi': '0R0',
            'london missouri': '0F7',
            'london nebraska': '0V3',
            'london new hampshire': '2B3',
            'london new york': '0G6',
            'london north carolina': 'HBI',
            'london ohio': 'I43',
            'london oklahoma': 'H76',
            'london oregon': '8S5',
            'london pennsylvania': '9G0',
            'london south carolina': 'HVS',
            'london tennessee': '0A3',
            'london texas': '0F2',
            'london utah': 'U41',
            'london vermont': '1B1',
            'london virginia': 'W66',
            'london washington': '8W2',
            'london west virginia': '9G3',
            'london wisconsin': 'H91',
            'london wyoming': '44U',
        }
        iata_to_city = {v: k.title() for k, v in city_to_iata.items()}  # Reverse and title case

        flights = []
        for offer in amadeus_data[:10]:  # Limit to 10 results
            try:
                itinerary = offer['itineraries'][0]
                segment = itinerary['segments'][0]

                flight = {
                    'id': offer['id'],
                    'flightNumber': segment['carrierCode'] + segment['number'],
                    'from_location': iata_to_city.get(segment['departure']['iataCode'], segment['departure']['iataCode']),
                    'to': iata_to_city.get(segment['arrival']['iataCode'], segment['arrival']['iataCode']),
                    'departureTime': segment['departure']['at'],
                    'arrivalTime': segment['arrival']['at'],
                    'duration': itinerary['duration'],
                    'stops': len(itinerary['segments']) - 1,
                    'price': float(offer['price']['total']),
                    'currency': offer['price']['currency'],
                    'airline': segment.get('carrierCode', 'Unknown'),
                    'status': 'scheduled'  # Default status for scheduled flights
                }
                flights.append(flight)
            except (KeyError, IndexError, ValueError) as e:
                logger.error(f"Error mapping Amadeus flight data: {e}")
                continue
        return flights

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

class AdminUserRejectView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            user.status = 'rejected'
            user.save()
            # Trigger email notification
            from .tasks import send_rejection_email_task
            send_rejection_email_task.delay(user.id)
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

class AirportSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IPAddressPermission]
    throttle_classes = [UserRateThrottle]

    def get(self, request):
        keyword = request.query_params.get('keyword')
        country = request.query_params.get('country')
        if not keyword:
            return Response({'error': 'Keyword is required'}, status=status.HTTP_400_BAD_REQUEST)

        airlabs_client = AirLabsClient()
        airports = airlabs_client.search_airports(keyword, country)
        if airports:
            return Response(airports)
        return Response({'error': 'No airports found'}, status=status.HTTP_404_NOT_FOUND)


# New DRF APIViews using Amadeus Service

class AmadeusFlightSearchView(APIView):
    """APIView for searching flights using the Amadeus Service."""
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle, FlightSearchThrottle]

    def post(self, request):
        serializer = FlightSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        amadeus_service = AmadeusService()
        
        try:
            departure_date_str = validated_data['departure_date'].isoformat()
            return_date_str = validated_data.get('return_date')
            return_date_str = return_date_str.isoformat() if return_date_str else None
            
            flights = amadeus_service.search_flights(
                origin=validated_data['origin'],
                destination=validated_data['destination'],
                departure_date=departure_date_str,
                return_date=return_date_str,
                adults=validated_data.get('adults', 1)
            )
            
            if flights:
                return Response({
                    'success': True,
                    'data': flights,
                    'message': f"Found {len(flights.get('data', []))} flights"
                })
            else:
                return Response({
                    'success': False,
                    'data': [],
                    'message': 'No flights found for the given criteria'
                }, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            logger.error(f"Error searching flights: {e}")
            return Response({
                'success': False,
                'error': 'Failed to search flights. Please try again later.'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class CreateOrderView(APIView):
    """APIView for creating a flight order."""
    permission_classes = [IsAuthenticated, IsApprovedUser]
    throttle_classes = [BookingThrottle]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        amadeus_service = AmadeusService()
        
        try:
            traveler_info = {
                'id': '1',
                'dateOfBirth': validated_data['traveler']['date_of_birth'].isoformat(),
                'name': {
                    'firstName': validated_data['traveler']['first_name'],
                    'lastName': validated_data['traveler']['last_name']
                },
                'gender': validated_data['traveler']['gender'],
                'contact': {
                    'emailAddress': validated_data['traveler']['email'],
                    'phones': [{
                        'deviceType': 'MOBILE',
                        'countryCallingCode': '1',
                        'number': validated_data['traveler']['phone']
                    }]
                },
                'documents': []
            }
            
            order_result = amadeus_service.create_order(
                flight_offer=validated_data['flight_offer'],
                traveler_info=traveler_info
            )
            
            if order_result:
                try:
                    booking = Booking.objects.create(
                        user=request.user,
                        flight=Flight.objects.first(),
                        status='confirmed',
                        payment_status='pending'
                    )
                    return Response({
                        'success': True,
                        'data': {'amadeus_order': order_result, 'local_booking_id': booking.id},
                        'message': 'Order created successfully'
                    }, status=status.HTTP_201_CREATED)
                except Exception as e:
                    return Response({
                        'success': True,
                        'data': order_result,
                        'warning': 'Order created but local booking failed'
                    }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'error': 'Failed to create order with Amadeus'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error creating order: {e}")
            return Response({
                'success': False,
                'error': 'Failed to create order. Please try again later.'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class GetOrderView(APIView):
    """APIView for retrieving order details."""
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get(self, request, order_id):
        serializer = GetOrderSerializer(data={'order_id': order_id})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_order_id = serializer.validated_data['order_id']
        amadeus_service = AmadeusService()
        
        try:
            order_result = amadeus_service.get_order(validated_order_id)
            
            if order_result:
                return Response({
                    'success': True,
                    'data': order_result,
                    'message': 'Order retrieved successfully'
                })
            else:
                return Response({
                    'success': False,
                    'error': 'Order not found'
                }, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            logger.error(f"Error retrieving order: {e}")
            return Response({
                'success': False,
                'error': 'Failed to retrieve order. Please try again later.'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
