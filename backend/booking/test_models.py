"""
Unit tests for the booking models
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from booking.models import Flight, Booking

CustomUser = get_user_model()

class CustomUserModelTest(TestCase):
    """Test cases for CustomUser model"""
    
    def test_create_user(self):
        """Test creating a regular user"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertFalse(user.is_staff)
        self.assertTrue(user.is_active)
        self.assertEqual(user.status, 'pending')
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        user = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
    
    def test_user_str(self):
        """Test user string representation"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(str(user), 'testuser')


class FlightModelTest(TestCase):
    """Test cases for Flight model"""
    
    def test_create_flight(self):
        """Test creating a flight"""
        from datetime import datetime, timedelta
        
        flight = Flight.objects.create(
            flight_number='AA123',
            departure='New York',
            arrival='Los Angeles',
            date=datetime.now() + timedelta(days=7),
            price=299.99,
            availability=True,
            status='on-time'
        )
        self.assertEqual(flight.flight_number, 'AA123')
        self.assertEqual(flight.departure, 'New York')
        self.assertEqual(flight.arrival, 'Los Angeles')
        self.assertEqual(flight.price, 299.99)
        self.assertTrue(flight.availability)
        self.assertEqual(flight.status, 'on-time')
    
    def test_flight_str(self):
        """Test flight string representation"""
        from datetime import datetime, timedelta
        
        flight = Flight.objects.create(
            flight_number='DL456',
            departure='Miami',
            arrival='Chicago',
            date=datetime.now() + timedelta(days=3),
            price=199.99
        )
        self.assertEqual(str(flight), 'DL456 - Miami to Chicago')


class BookingModelTest(TestCase):
    """Test cases for Booking model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            status='approved'
        )
        from datetime import datetime, timedelta
        self.flight = Flight.objects.create(
            flight_number='UA789',
            departure='Boston',
            arrival='Seattle',
            date=datetime.now() + timedelta(days=5),
            price=349.99
        )
    
    def test_create_booking(self):
        """Test creating a booking"""
        booking = Booking.objects.create(
            user=self.user,
            flight=self.flight,
            status='pending',
            payment_status='pending'
        )
        self.assertEqual(booking.user, self.user)
        self.assertEqual(booking.flight, self.flight)
        self.assertEqual(booking.status, 'pending')
        self.assertEqual(booking.payment_status, 'pending')
    
    def test_booking_str(self):
        """Test booking string representation"""
        booking = Booking.objects.create(
            user=self.user,
            flight=self.flight,
            status='confirmed',
            payment_status='paid'
        )
        self.assertEqual(str(booking), 'Booking by testuser for UA789')
