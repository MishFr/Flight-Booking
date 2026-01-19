from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser with an approval status.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', help_text="User approval status.")

    def __str__(self):
        return self.username

class Flight(models.Model):
    """
    Flight model containing details, pricing, and availability.
    """
    STATUS_CHOICES = [
        ('on-time', 'On-time'),
        ('delayed', 'Delayed'),
    ]
    flight_number = models.CharField(max_length=10, unique=True, help_text="Unique flight identifier.")
    departure = models.CharField(max_length=100, help_text="Departure location.")
    arrival = models.CharField(max_length=100, help_text="Arrival location.")
    date = models.DateTimeField(help_text="Flight departure date and time.")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Flight price.")
    availability = models.BooleanField(default=True, help_text="Indicates if the flight is available for booking.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='on-time', help_text="Flight status.")

    def __str__(self):
        return f"{self.flight_number} - {self.departure} to {self.arrival}"

class Booking(models.Model):
    """
    Booking model with relationships to user and flight, including payment status.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings', help_text="User who made the booking.")
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='bookings', help_text="Flight being booked.")
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('failed', 'Failed'),
        ],
        default='pending',
        help_text="Status of the payment for the booking."
    )
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the booking was created.")

    def __str__(self):
        return f"Booking by {self.user.username} for {self.flight.flight_number}"
