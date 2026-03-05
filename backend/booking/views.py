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
from .iata_utils import get_iata_code, get_city_from_iata, is_valid_iata, get_airport_info, find_nearby_airports, get_nearest_airport
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

        # Safely extract flight offers list from Amadeus API response
        # Amadeus returns {"data": [...], "meta": {...}} or just [...] depending on endpoint
        if amadeus_data is None:
            logger.warning("Amadeus data is None")
            return []
        
        if isinstance(amadeus_data, dict):
            # Standard Amadeus response format: {"data": [...], ...}
            flight_offers = amadeus_data.get('data', [])
            if not isinstance(flight_offers, list):
                logger.error(f"Unexpected 'data' field type from Amadeus API: {type(flight_offers)}")
                return []
        elif isinstance(amadeus_data, list):
            # Direct list response (some Amadeus endpoints return list directly)
            flight_offers = amadeus_data
        else:
            logger.error(f"Unexpected Amadeus response type: {type(amadeus_data)}")
            return []

        flights = []
        for offer in flight_offers[:10]:  # Limit to 10 results
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


# Vendor Views
from .models import Vendor, VendorProduct
from .serializers import (
    VendorSerializer, VendorCreateSerializer,
    VendorProductSerializer, VendorProductCreateSerializer
)


class VendorRegisterView(APIView):
    """APIView for registering as a vendor."""
    permission_classes = [IsAuthenticated, IsApprovedUser]

    def post(self, request):
        # Check if user already has a vendor profile
        if hasattr(request.user, 'vendor_profile'):
            return Response({
                'error': 'You already have a vendor profile'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = VendorCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Create vendor profile and mark user as vendor
        vendor = serializer.save(user=request.user)
        request.user.is_vendor = True
        request.user.save()
        
        return Response({
            'message': 'Vendor profile created successfully',
            'vendor': VendorSerializer(vendor).data
        }, status=status.HTTP_201_CREATED)


class VendorProfileView(APIView):
    """APIView for getting and updating vendor profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'vendor_profile'):
            return Response({
                'error': 'You do not have a vendor profile'
            }, status=status.HTTP_404_NOT_FOUND)
        
        vendor = request.user.vendor_profile
        serializer = VendorSerializer(vendor)
        return Response(serializer.data)

    def put(self, request):
        if not hasattr(request.user, 'vendor_profile'):
            return Response({
                'error': 'You do not have a vendor profile'
            }, status=status.HTTP_404_NOT_FOUND)
        
        vendor = request.user.vendor_profile
        serializer = VendorCreateSerializer(vendor, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response({
            'message': 'Vendor profile updated successfully',
            'vendor': VendorSerializer(vendor).data
        })


class VendorProductListView(generics.ListCreateAPIView):
    """APIView for listing and creating vendor products."""
    serializer_class = VendorProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not hasattr(self.request.user, 'vendor_profile'):
            return VendorProduct.objects.none()
        return VendorProduct.objects.filter(vendor=self.request.user.vendor_profile)

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'vendor_profile'):
            raise PermissionDenied('You do not have a vendor profile')
        serializer.save(vendor=self.request.user.vendor_profile)


class VendorProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """APIView for getting, updating, and deleting vendor products."""
    serializer_class = VendorProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not hasattr(self.request.user, 'vendor_profile'):
            return VendorProduct.objects.none()
        return VendorProduct.objects.filter(vendor=self.request.user.vendor_profile)

    def perform_update(self, serializer):
        serializer.save(vendor=self.request.user.vendor_profile)


class PublicVendorListView(generics.ListAPIView):
    """Public APIView for listing approved vendors and their products."""
    serializer_class = VendorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Vendor.objects.filter(is_approved=True)
        category = self.request.query_params.get('category')
        
        if category:
            # Filter vendors that have products in the specified category
            queryset = queryset.filter(products__category=category).distinct()
        
        return queryset


class PublicVendorProductsView(generics.ListAPIView):
    """Public APIView for listing products from approved vendors."""
    serializer_class = VendorProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = VendorProduct.objects.filter(vendor__is_approved=True, is_active=True)
        
        category = self.request.query_params.get('category')
        vendor_id = self.request.query_params.get('vendor_id')
        
        if category:
            queryset = queryset.filter(category=category)
        
        if vendor_id:
            queryset = queryset.filter(vendor_id=vendor_id)
        
        return queryset


# Hotel/Accommodation Search View
class HotelSearchView(APIView):
    """APIView for searching hotels/accommodations using Amadeus API."""
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    def get(self, request):
        location = request.query_params.get('location')
        check_in = request.query_params.get('check_in')
        check_out = request.query_params.get('check_out')
        guests = request.query_params.get('guests', 1)
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')

        if not check_in or not check_out:
            return Response({
                'error': 'Check-in and check-out dates are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Parse dates to ensure proper format (YYYY-MM-DD)
        try:
            from datetime import datetime
            check_in_date = datetime.strptime(check_in, '%Y-%m-%d').strftime('%Y-%m-%d')
            check_out_date = datetime.strptime(check_out, '%Y-%m-%d').strftime('%Y-%m-%d')
        except ValueError:
            return Response({
                'error': 'Invalid date format. Use YYYY-MM-DD'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            amadeus_client = AmadeusClient()
            
            # If latitude and longitude are provided, search by geolocation
            if latitude and longitude:
                hotel_data = amadeus_client.search_hotels_by_geocode(
                    latitude=latitude,
                    longitude=longitude,
                    check_in=check_in_date,
                    check_out=check_out_date,
                    guests=int(guests)
                )
            # Otherwise search by city name
            elif location:
                # Convert city name to IATA code
                city_iata = get_iata_code(location)
                if not city_iata:
                    # Try to get airport code from iata_utils
                    city_info = get_airport_info(location)
                    if city_info:
                        city_iata = city_info.get('iata')
                
                if not city_iata:
                    # Return fallback with sample hotels for demo
                    return Response(self._get_fallback_hotels(location, check_in_date, check_out_date))
                
                hotel_data = amadeus_client.search_hotels(
                    city_code=city_iata,
                    check_in=check_in_date,
                    check_out=check_out_date,
                    guests=int(guests)
                )
            else:
                return Response({
                    'error': 'Please provide either location or latitude/longitude'
                }, status=status.HTTP_400_BAD_REQUEST)

            if hotel_data:
                mapped_hotels = self._map_amadeus_hotels(hotel_data)
                return Response({
                    'success': True,
                    'data': mapped_hotels,
                    'message': f"Found {len(mapped_hotels)} accommodations"
                })
            else:
                # Return fallback data if API returns nothing
                return Response(self._get_fallback_hotels(location, check_in_date, check_out_date))

        except Exception as e:
            logger.error(f"Error searching hotels: {e}")
            # Return fallback data on error
            fallback_location = location or "your area"
            return Response(self._get_fallback_hotels(fallback_location, check_in_date, check_out_date))

    def _map_amadeus_hotels(self, amadeus_data):
        """Map Amadeus hotel API response to frontend-friendly format"""
        hotels = []
        
        # Handle Amadeus response format
        if isinstance(amadeus_data, dict):
            hotel_offers = amadeus_data.get('data', [])
        elif isinstance(amadeus_data, list):
            hotel_offers = amadeus_data
        else:
            return []

        for offer in hotel_offers[:20]:  # Limit to 20 results
            try:
                hotel = offer.get('hotel', {})
                offers = offer.get('offers', [{}])
                first_offer = offers[0] if offers else {}
                
                # Get price
                price = first_offer.get('price', {})
                price_total = price.get('total', 'N/A')
                price_currency = price.get('currency', 'USD')
                
                # Get room info
                room = first_offer.get('room', {})
                room_type = room.get('type', 'Standard Room')
                room_description = room.get('description', '')
                
                # Get amenities from first offer
                amenities = []
                if first_offer.get('amenities'):
                    amenities = first_offer.get('amenities', [])
                
                # Get rating if available
                rating = hotel.get('rating', 0)
                
                # Get hotel name and address
                name = hotel.get('name', 'Unknown Hotel')
                address = hotel.get('address', {})
                city = address.get('city', '')
                country = address.get('countryCode', '')
                postal_code = address.get('postalCode', '')
                full_location = f"{city}, {country}" if city and country else city or location
                
                # Get contact info
                contact = hotel.get('contact', {})
                phone = contact.get('phone', '')
                email = contact.get('email', '')
                
                # Get images
                images = hotel.get('images', [])
                image_url = ''
                if images and len(images) > 0:
                    image_url = images[0].get('url', '')
                
                mapped_hotel = {
                    'id': offer.get('offerId', offer.get('id', '')),
                    'name': name,
                    'location': full_location,
                    'city': city,
                    'country': country,
                    'price': f"{price_currency} {price_total}" if price_total != 'N/A' else 'Contact for pricing',
                    'price_value': float(price_total) if price_total != 'N/A' else 0,
                    'currency': price_currency,
                    'rating': rating,
                    'room_type': room_type,
                    'description': room_description,
                    'amenities': amenities[:6],  # Limit to 6 amenities
                    'image': image_url or 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
                    'phone': phone,
                    'email': email,
                    'check_in': first_offer.get('checkInDate', ''),
                    'check_out': first_offer.get('checkOutDate', ''),
                }
                hotels.append(mapped_hotel)
            except Exception as e:
                logger.error(f"Error mapping hotel data: {e}")
                continue

        return hotels

    def _get_fallback_hotels(self, location, check_in, check_out):
        """Generate fallback hotel data when API is unavailable"""
        import random
        
        # Sample hotel data for fallback
        fallback_data = [
            {
                'name': 'Grand Plaza Hotel',
                'rating': 4.5,
                'room_type': 'Deluxe King Room',
                'amenities': ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Room Service']
            },
            {
                'name': 'Comfort Inn & Suites',
                'rating': 4.2,
                'room_type': 'Standard Double Room',
                'amenities': ['WiFi', 'Breakfast', 'Parking', 'Fitness Center']
            },
            {
                'name': 'Boutique Hotel Downtown',
                'rating': 4.7,
                'room_type': 'Executive Suite',
                'amenities': ['WiFi', 'Restaurant', 'Bar', 'Concierge', 'Airport Shuttle']
            },
            {
                'name': 'Seaside Resort',
                'rating': 4.4,
                'room_type': 'Ocean View Room',
                'amenities': ['WiFi', 'Pool', 'Beach Access', 'Water Sports', 'Kids Club']
            },
            {
                'name': 'City Center Apartments',
                'rating': 4.1,
                'room_type': 'One-Bedroom Apartment',
                'amenities': ['WiFi', 'Kitchen', 'Washer/Dryer', 'Gym', 'Parking']
            }
        ]
        
        hotels = []
        base_prices = [120, 89, 199, 150, 95]
        
        for i, hotel in enumerate(fallback_data):
            price = base_prices[i] + random.randint(-10, 30)
            hotels.append({
                'id': f'fallback_{i+1}',
                'name': hotel['name'],
                'location': location,
                'city': location,
                'country': '',
                'price': f'USD {price}',
                'price_value': price,
                'currency': 'USD',
                'rating': hotel['rating'],
                'room_type': hotel['room_type'],
                'description': f"Comfortable {hotel['room_type']} with modern amenities",
                'amenities': hotel['amenities'],
                'image': f'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
                'phone': '',
                'email': '',
                'check_in': check_in,
                'check_out': check_out,
                'is_fallback': True
            })
        
        return {
            'success': True,
            'data': hotels,
            'message': f"Found {len(hotels)} accommodations (demo data)",
            'is_demo': True
        }
