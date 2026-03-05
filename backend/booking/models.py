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
    is_vendor = models.BooleanField(default=False, help_text="Designates whether the user is a vendor.")

    def __str__(self):
        return self.username


class Vendor(models.Model):
    """
    Vendor model for business profiles in Vendors Corner.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='vendor_profile', help_text="User who owns this vendor profile.")
    business_name = models.CharField(max_length=200, help_text="Name of the business.")
    description = models.TextField(blank=True, help_text="Description of the business.")
    contact_email = models.EmailField(blank=True, help_text="Contact email for the business.")
    contact_phone = models.CharField(max_length=20, blank=True, help_text="Contact phone number.")
    address = models.TextField(blank=True, help_text="Business address.")
    logo_url = models.URLField(blank=True, help_text="URL to business logo.")
    website = models.URLField(blank=True, help_text="Business website URL.")
    is_approved = models.BooleanField(default=False, help_text="Whether the vendor is approved to display products.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.business_name


class VendorProduct(models.Model):
    """
    Product model for vendors to market their products/services.
    """
    CATEGORY_CHOICES = [
        ('transportation', 'Transportation'),
        ('accommodation', 'Accommodation'),
        ('tourism', 'Tourism'),
        ('food', 'Food & Dining'),
        ('equipment', 'Travel Equipment'),
        ('insurance', 'Travel Insurance'),
        ('other', 'Other'),
    ]
    
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='products', help_text="Vendor who owns this product.")
    name = models.CharField(max_length=200, help_text="Product or service name.")
    description = models.TextField(blank=True, help_text="Description of the product/service.")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other', help_text="Product category.")
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Price of the product/service.")
    price_unit = models.CharField(max_length=50, blank=True, help_text="Unit for price (e.g., per night, per person).")
    image_url = models.URLField(blank=True, help_text="URL to product image.")
    is_active = models.BooleanField(default=True, help_text="Whether the product is active and visible.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.vendor.business_name}"

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
    Booking model with relationships to user and flight, including payment status and booking status.
    """
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings', help_text="User who made the booking.")
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='bookings', help_text="Flight being booked.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', help_text="Booking status.")
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
