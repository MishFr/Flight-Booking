from rest_framework import serializers
from .models import CustomUser, Flight, Booking

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'status']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'

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
