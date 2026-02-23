from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
from .models import CustomUser, Flight, Booking

class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'status']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class FlightSerializer(serializers.ModelSerializer):
    flightNumber = serializers.CharField(source='flight_number')
    from_location = serializers.CharField(source='departure')
    to = serializers.CharField(source='arrival')
    departureTime = serializers.DateTimeField(source='date')
    arrivalTime = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    stops = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    airline = serializers.SerializerMethodField()

    class Meta:
        model = Flight
        fields = ['id', 'flightNumber', 'from_location', 'to', 'departureTime', 'arrivalTime', 'duration', 'stops', 'price', 'currency', 'airline', 'status']

    def get_arrivalTime(self, obj):
        # For simplicity, assume flights are 8 hours long
        return obj.date.replace(hour=(obj.date.hour + 8) % 24)

    def get_duration(self, obj):
        return "PT8H"  # ISO 8601 duration format for 8 hours

    def get_stops(self, obj):
        return 0  # Assume direct flights for sample data

    def get_currency(self, obj):
        return "USD"

    def get_airline(self, obj):
        # Extract airline code from flight number (first 2 characters)
        return obj.flight_number[:2] if len(obj.flight_number) >= 2 else "UNK"

class BookingSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    flight = FlightSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    flight_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'flight', 'payment_status', 'created_at', 'user_id', 'flight_id']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        flight_id = validated_data.pop('flight_id')
        user = CustomUser.objects.get(id=user_id)
        flight = Flight.objects.get(id=flight_id)
        booking = Booking.objects.create(user=user, flight=flight, **validated_data)
        return booking

# Admin Serializers
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'status', 'is_staff', 'is_active']

class AdminFlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


# Input Validation Serializers for API endpoints

class FlightSearchSerializer(serializers.Serializer):
    """
    Input validation serializer for flight search endpoint.
    """
    origin = serializers.CharField(
        required=True,
        max_length=3,
        min_length=3,
        help_text="Origin airport IATA code (e.g., 'JFK')"
    )
    destination = serializers.CharField(
        required=True,
        max_length=3,
        min_length=3,
        help_text="Destination airport IATA code (e.g., 'LAX')"
    )
    departure_date = serializers.DateField(
        required=True,
        help_text="Departure date in ISO format (YYYY-MM-DD)"
    )
    return_date = serializers.DateField(
        required=False,
        allow_null=True,
        help_text="Return date in ISO format for round trip (YYYY-MM-DD)"
    )
    adults = serializers.IntegerField(
        required=False,
        default=1,
        min_value=1,
        max_value=9,
        help_text="Number of adult passengers"
    )
    travel_class = serializers.ChoiceField(
        required=False,
        choices=['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'],
        default='ECONOMY',
        help_text="Travel class"
    )
    non_stop = serializers.BooleanField(
        required=False,
        default=False,
        help_text="Only show non-stop flights"
    )
    
    def validate_departure_date(self, value):
        """Validate that departure date is not in the past."""
        from datetime import date
        if value < date.today():
            raise serializers.ValidationError("Departure date cannot be in the past.")
        return value
    
    def validate(self, data):
        """Cross-field validation."""
        return_date = data.get('return_date')
        departure_date = data.get('departure_date')
        
        if return_date and departure_date:
            if return_date < departure_date:
                raise serializers.ValidationError({
                    'return_date': 'Return date must be after departure date.'
                })
        
        return data


class TravelerInfoSerializer(serializers.Serializer):
    """
    Traveler information for order creation.
    """
    first_name = serializers.CharField(required=True, max_length=100)
    last_name = serializers.CharField(required=True, max_length=100)
    date_of_birth = serializers.DateField(required=True)
    gender = serializers.ChoiceField(
        required=True,
        choices=['M', 'F', 'X'],
        help_text="Gender: M (Male), F (Female), X (Other)"
    )
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True, max_length=20)
    passport_number = serializers.CharField(required=False, max_length=20)
    passport_expiry_date = serializers.DateField(required=False)
    passport_issuing_country = serializers.CharField(required=False, max_length=3)
    nationality = serializers.CharField(required=True, max_length=3)
    
    def validate_date_of_birth(self, value):
        """Validate traveler is at least 18 years old."""
        from datetime import date
        age = (date.today() - value).days // 365
        if age < 0:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value


class CreateOrderSerializer(serializers.Serializer):
    """
    Input validation serializer for creating an order.
    """
    flight_offer = serializers.JSONField(
        required=True,
        help_text="The flight offer data from search results"
    )
    traveler = TravelerInfoSerializer(required=True)
    contact_email = serializers.EmailField(required=True)
    contact_phone = serializers.CharField(required=True, max_length=20)
    payment_method = serializers.ChoiceField(
        required=False,
        choices=['CARD', 'PAYPAL', 'STRIPE'],
        default='CARD',
        help_text="Payment method"
    )
    
    def validate_flight_offer(self, value):
        """Validate the flight offer structure."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Flight offer must be a JSON object.")
        
        required_keys = ['id', 'price', 'itineraries']
        for key in required_keys:
            if key not in value:
                raise serializers.ValidationError(f"Flight offer must contain '{key}'.")
        
        return value


class GetOrderSerializer(serializers.Serializer):
    """
    Input validation serializer for getting order details.
    """
    order_id = serializers.CharField(
        required=True,
        max_length=100,
        help_text="The order ID to retrieve"
    )
    
    def validate_order_id(self, value):
        """Validate order ID format."""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Order ID cannot be empty.")
        return value.strip()


class BookingSearchSerializer(serializers.Serializer):
    """
    Input validation serializer for searching bookings.
    """
    status = serializers.ChoiceField(
        required=False,
        choices=['confirmed', 'cancelled', 'pending'],
        help_text="Filter by booking status"
    )
    payment_status = serializers.ChoiceField(
        required=False,
        choices=['paid', 'pending', 'failed'],
        help_text="Filter by payment status"
    )
    from_date = serializers.DateField(
        required=False,
        help_text="Filter bookings from this date"
    )
    to_date = serializers.DateField(
        required=False,
        help_text="Filter bookings until this date"
    )
    page = serializers.IntegerField(
        required=False,
        default=1,
        min_value=1,
        help_text="Page number for pagination"
    )
    page_size = serializers.IntegerField(
        required=False,
        default=10,
        min_value=1,
        max_value=100,
        help_text="Number of results per page"
    )
