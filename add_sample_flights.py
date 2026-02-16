#!/usr/bin/env python3
"""
Script to add sample flights to the database for testing purposes
"""

import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flight_booking.settings')

# Override BASE_DIR to point to backend directory
from pathlib import Path
import flight_booking.settings
flight_booking.settings.BASE_DIR = Path('backend').resolve()

# Setup Django
django.setup()

from booking.models import Flight

def add_sample_flights():
    """Add sample flights to the database"""
    print("Adding sample flights to the database...")

    # Clear existing flights
    Flight.objects.all().delete()

    # Sample flights
    flights_data = [
        {
            'flight_number': 'AA101',
            'departure': 'New York',
            'arrival': 'London',
            'date': datetime.now() + timedelta(days=7),
            'price': 450.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'BA202',
            'departure': 'London',
            'arrival': 'New York',
            'date': datetime.now() + timedelta(days=7),
            'price': 380.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'AF303',
            'departure': 'New York',
            'arrival': 'Paris',
            'date': datetime.now() + timedelta(days=10),
            'price': 520.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'DL404',
            'departure': 'Paris',
            'arrival': 'New York',
            'date': datetime.now() + timedelta(days=10),
            'price': 480.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'JL505',
            'departure': 'New York',
            'arrival': 'Tokyo',
            'date': datetime.now() + timedelta(days=14),
            'price': 850.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'UA606',
            'departure': 'Tokyo',
            'arrival': 'New York',
            'date': datetime.now() + timedelta(days=14),
            'price': 780.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'LH707',
            'departure': 'London',
            'arrival': 'Berlin',
            'date': datetime.now() + timedelta(days=5),
            'price': 120.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'EK808',
            'departure': 'New York',
            'arrival': 'Dubai',
            'date': datetime.now() + timedelta(days=12),
            'price': 720.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'SQ909',
            'departure': 'London',
            'arrival': 'Singapore',
            'date': datetime.now() + timedelta(days=16),
            'price': 650.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'QF1010',
            'departure': 'New York',
            'arrival': 'Sydney',
            'date': datetime.now() + timedelta(days=20),
            'price': 950.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'AA102',
            'departure': 'New York',
            'arrival': 'London',
            'date': timezone.make_aware(datetime(2026, 2, 26, 10, 0, 0)),
            'price': 500.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'BA301',
            'departure': 'New York',
            'arrival': 'London',
            'date': timezone.make_aware(datetime(2026, 12, 1, 14, 30, 0)),
            'price': 650.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'LH1111',
            'departure': 'Frankfurt',
            'arrival': 'New York',
            'date': timezone.make_aware(datetime(2026, 3, 15, 16, 45, 0)),
            'price': 720.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'AF2222',
            'departure': 'Paris',
            'arrival': 'Tokyo',
            'date': timezone.make_aware(datetime(2026, 4, 20, 11, 20, 0)),
            'price': 890.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'KL3333',
            'departure': 'Amsterdam',
            'arrival': 'Dubai',
            'date': timezone.make_aware(datetime(2026, 5, 10, 8, 30, 0)),
            'price': 550.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'EK4444',
            'departure': 'Dubai',
            'arrival': 'Singapore',
            'date': timezone.make_aware(datetime(2026, 6, 5, 22, 15, 0)),
            'price': 480.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'SQ5555',
            'departure': 'Singapore',
            'arrival': 'Sydney',
            'date': timezone.make_aware(datetime(2026, 7, 12, 14, 0, 0)),
            'price': 620.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'QF6666',
            'departure': 'Sydney',
            'arrival': 'Los Angeles',
            'date': timezone.make_aware(datetime(2026, 8, 8, 9, 45, 0)),
            'price': 950.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'UA7777',
            'departure': 'Los Angeles',
            'arrival': 'London',
            'date': timezone.make_aware(datetime(2026, 9, 18, 18, 30, 0)),
            'price': 780.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'BA8888',
            'departure': 'London',
            'arrival': 'Cape Town',
            'date': timezone.make_aware(datetime(2026, 10, 25, 20, 15, 0)),
            'price': 850.00,
            'status': 'on-time'
        },
        {
            'flight_number': 'SA9999',
            'departure': 'Cape Town',
            'arrival': 'Rio de Janeiro',
            'date': timezone.make_aware(datetime(2026, 11, 10, 6, 0, 0)),
            'price': 720.00,
            'status': 'on-time'
        }
    ]

    for flight_data in flights_data:
        flight, created = Flight.objects.get_or_create(
            flight_number=flight_data['flight_number'],
            date=flight_data['date'],
            defaults=flight_data
        )
        if created:
            print(f"Created flight: {flight.flight_number} from {flight.departure} to {flight.arrival}")
        else:
            print(f"Flight {flight.flight_number} already exists")

    print(f"\nTotal flights in database: {Flight.objects.count()}")

    # Print all flights for verification
    print("\nAll flights in database:")
    for flight in Flight.objects.all():
        print(f"  {flight.flight_number}: {flight.departure} -> {flight.arrival} on {flight.date.date()} at {flight.date.time()}")

if __name__ == '__main__':
    add_sample_flights()
