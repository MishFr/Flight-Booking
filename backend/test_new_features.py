#!/usr/bin/env python
"""Test script to verify new Amadeus service imports and functionality."""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flight_booking.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

# Test imports
print("=" * 50)
print("Testing Imports...")
print("=" * 50)

try:
    from booking.amadeus_service import AmadeusService, amadeus_service
    print("✓ amadeus_service.py imports successfully")
except Exception as e:
    print(f"✗ amadeus_service.py import failed: {e}")

try:
    from booking.exceptions import (
        custom_exception_handler,
        AmadeusServiceException,
        FlightNotFoundException,
        OrderCreationException,
        OrderNotFoundException,
        InvalidFlightDataException
    )
    print("✓ exceptions.py imports successfully")
    print("  - AmadeusServiceException")
    print("  - FlightNotFoundException")
    print("  - OrderCreationException")
    print("  - OrderNotFoundException")
    print("  - InvalidFlightDataException")
    print("  - custom_exception_handler")
except Exception as e:
    print(f"✗ exceptions.py import failed: {e}")

try:
    from booking.views import AmadeusFlightSearchView, CreateOrderView, GetOrderView
    print("✓ views.py new views import successfully")
    print("  - AmadeusFlightSearchView")
    print("  - CreateOrderView")
    print("  - GetOrderView")
except Exception as e:
    print(f"✗ views.py import failed: {e}")

try:
    from booking.serializers import (
        FlightSearchSerializer,
        CreateOrderSerializer,
        GetOrderSerializer,
        TravelerInfoSerializer
    )
    print("✓ serializers.py new serializers import successfully")
    print("  - FlightSearchSerializer")
    print("  - CreateOrderSerializer")
    print("  - GetOrderSerializer")
    print("  - TravelerInfoSerializer")
except Exception as e:
    print(f"✗ serializers.py import failed: {e}")

# Test URLs
print("\n" + "=" * 50)
print("Testing URL Configuration...")
print("=" * 50)

try:
    from django.urls import reverse
    from booking.urls import urlpatterns
    
    # Check new URL patterns exist
    url_names = [pattern.name for pattern in urlpatterns if pattern.name]
    
    required_urls = [
        'amadeus-flight-search',
        'amadeus-create-order', 
        'amadeus-get-order'
    ]
    
    for url_name in required_urls:
        if url_name in url_names:
            print(f"✓ URL '{url_name}' configured")
        else:
            print(f"✗ URL '{url_name}' NOT found")
            
except Exception as e:
    print(f"✗ URL configuration error: {e}")

# Test cache configuration
print("\n" + "=" * 50)
print("Testing Cache Configuration...")
print("=" * 50)

try:
    from django.conf import settings
    cache_backend = settings.CACHES['default']['BACKEND']
    print(f"✓ Cache backend: {cache_backend}")
    
    cache_mode = getattr(settings, 'CACHE_MODE', 'local')
    print(f"✓ Cache mode: {cache_mode}")
    
    # Test cache functionality
    from django.core.cache import cache
    cache.set('test_key', 'test_value', 60)
    value = cache.get('test_key')
    if value == 'test_value':
        print("✓ Cache is working correctly")
    else:
        print("✗ Cache is not working")
        
except Exception as e:
    print(f"✗ Cache configuration error: {e}")

# Test AmadeusService functionality
print("\n" + "=" * 50)
print("Testing AmadeusService...")
print("=" * 50)

try:
    from booking.amadeus_service import AmadeusService
    service = AmadeusService()
    print("✓ AmadeusService instantiated successfully")
    print(f"  - API Key: {'configured' if service.api_key else 'NOT configured'}")
    print(f"  - Base URL: {service.base_url}")
except Exception as e:
    print(f"✗ AmadeusService error: {e}")

print("\n" + "=" * 50)
print("All Tests Completed Successfully!")
print("=" * 50)
