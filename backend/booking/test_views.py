"""
Unit tests for the booking views
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from booking.models import Flight, Booking
from datetime import datetime, timedelta

CustomUser = get_user_model()

class AuthenticationViewsTest(TestCase):
    """Test cases for authentication views"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            status='approved'
        )
    
    def test_register_view(self):
        """Test user registration"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
    
    def test_login_view_success(self):
        """Test successful login"""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post('/api/auth/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_view_failure(self):
        """Test failed login with wrong credentials"""
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post('/api/auth/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class FlightViewsTest(TestCase):
    """Test cases for flight views"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            status='approved'
        )
        self.flight = Flight.objects.create(
            flight_number='AA123',
            departure='New York',
            arrival='Los Angeles',
            date=datetime.now() + timedelta(days=7),
            price=299.99,
            availability=True,
            status='on-time'
        )
    
    def test_flight_list_view(self):
        """Test flight list view"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/flights/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_flight_search_view(self):
        """Test flight search view"""
        response = self.client.get('/api/flights/search/?departure=New York&arrival=Los Angeles&date=2024-12-01')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_flight_search_view_past_date(self):
        """Test flight search with past date"""
        response = self.client.get('/api/flights/search/?departure=New York&arrival=Los Angeles&date=2020-01-01')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class BookingViewsTest(TestCase):
    """Test cases for booking views"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            status='approved'
        )
        self.flight = Flight.objects.create(
            flight_number='AA123',
            departure='New York',
            arrival='Los Angeles',
            date=datetime.now() + timedelta(days=7),
            price=299.99,
            availability=True,
            status='on-time'
        )
    
    def test_booking_list_view(self):
        """Test booking list view"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/bookings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_booking(self):
        """Test creating a booking"""
        self.client.force_authenticate(user=self.user)
        data = {
            'flight_id': self.flight.id
        }
        response = self.client.post('/api/bookings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_booking_without_approval(self):
        """Test booking with unapproved user"""
        unapproved_user = CustomUser.objects.create_user(
            username='unapproved',
            email='unapproved@example.com',
            password='testpass123',
            status='pending'
        )
        self.client.force_authenticate(user=unapproved_user)
        data = {
            'flight_id': self.flight.id
        }
        response = self.client.post('/api/bookings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class AdminViewsTest(TestCase):
    """Test cases for admin views"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.admin_user = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.regular_user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            status='pending'
        )
    
    def test_admin_user_list(self):
        """Test admin user list view"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/users/pending/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_admin_approve_user(self):
        """Test approving a user"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(f'/api/admin/users/{self.regular_user.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.regular_user.refresh_from_db()
        self.assertEqual(self.regular_user.status, 'approved')
    
    def test_admin_reject_user(self):
        """Test rejecting a user"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(f'/api/admin/users/{self.regular_user.id}/reject/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.regular_user.refresh_from_db()
        self.assertEqual(self.regular_user.status, 'rejected')
    
    def test_booking_stats(self):
        """Test booking stats view"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/booking-stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
