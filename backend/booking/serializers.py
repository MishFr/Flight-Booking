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
