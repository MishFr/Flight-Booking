#!/usr/bin/env python3
"""
Test script for Aviation Stack API integration
Run this script to test the flight search functionality with real API data.
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Add the backend directory to the Python path
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flight_booking.settings')

# Setup Django
django.setup()

from booking.aviationstack_client import AviationStackClient
from booking.airlabs_client import AirLabsClient

def test_api_keys():
    """Test if API keys are configured"""
    print("🔍 Testing API Key Configuration...")

    try:
        aviation_client = AviationStackClient()
        print("✅ Aviation Stack API key is configured")
    except ValueError as e:
        print(f"❌ Aviation Stack API key not configured: {e}")
        return False

    try:
        airlabs_client = AirLabsClient()
        print("✅ AirLabs API key is configured")
    except ValueError as e:
        print(f"❌ AirLabs API key not configured: {e}")
        return False

    return True

def test_airport_search():
    """Test airport search functionality"""
    print("\n🏙️  Testing Airport Search...")

    try:
        airlabs_client = AirLabsClient()

        # Test searching for New York airports
        print("Searching for 'New York' airports...")
        ny_airports = airlabs_client.search_airports('New York', country='United States')
        if ny_airports and 'data' in ny_airports:
            print(f"✅ Found {len(ny_airports['data'])} New York airports")
            for airport in ny_airports['data'][:3]:  # Show first 3
                print(f"   - {airport.get('name')} ({airport.get('iataCode')})")
        else:
            print("❌ No New York airports found")
            return False

        # Test searching for London airports
        print("Searching for 'London' airports...")
        london_airports = airlabs_client.search_airports('London', country='United Kingdom')
        if london_airports and 'data' in london_airports:
            print(f"✅ Found {len(london_airports['data'])} London airports")
            for airport in london_airports['data'][:3]:  # Show first 3
                print(f"   - {airport.get('name')} ({airport.get('iataCode')})")
        else:
            print("❌ No London airports found")
            return False

    except Exception as e:
        print(f"❌ Airport search test failed: {e}")
        return False

    return True

def test_flight_search():
    """Test flight search functionality"""
    print("\n✈️  Testing Flight Search...")

    try:
        aviation_client = AviationStackClient()
        airlabs_client = AirLabsClient()

        # Get airport codes for a popular route
        print("Getting airport codes for New York to London...")
        ny_airports = airlabs_client.search_airports('New York', country='United States')
        london_airports = airlabs_client.search_airports('London', country='United Kingdom')

        if not ny_airports or not london_airports:
            print("❌ Could not get airport codes for testing")
            return False

        # Use first airport from each
        origin_iata = ny_airports['data'][0]['iataCode']
        destination_iata = london_airports['data'][0]['iataCode']

        print(f"Searching flights from {origin_iata} to {destination_iata}...")

        # Search for flights tomorrow
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

        flights = aviation_client.search_flights(origin_iata, destination_iata, tomorrow)

        if flights:
            print(f"✅ Found {len(flights)} flights")
            for flight in flights[:5]:  # Show first 5
                print(f"   - {flight.get('flightNumber')} by {flight.get('airline')}")
                print(f"     Departs: {flight.get('departureTime')}")
                print(f"     Status: {flight.get('status')}")
        else:
            print("❌ No flights found (this might be normal for some routes/dates)")
            print("   Note: Aviation Stack provides real-time flight tracking data,")
            print("   so results depend on actual flights operating on the test date.")

    except Exception as e:
        print(f"❌ Flight search test failed: {e}")
        return False

    return True

def main():
    """Run all tests"""
    print("🚀 Aviation Stack API Integration Test")
    print("=" * 50)

    # Test API key configuration
    if not test_api_keys():
        print("\n❌ API keys not properly configured. Please:")
        print("   1. Get an Aviation Stack API key from: https://aviationstack.com/")
        print("   2. Update AVIATIONSTACK_API_KEY in backend/flight_booking/settings.py")
        print("   3. Run this test again")
        return

    # Test airport search
    if not test_airport_search():
        print("\n❌ Airport search failed. Check AirLabs API key and internet connection.")
        return

    # Test flight search
    if not test_flight_search():
        print("\n❌ Flight search failed. Check Aviation Stack API key and internet connection.")
        return

    print("\n🎉 All tests passed! Aviation Stack API integration is working correctly.")
    print("\n📝 Next steps:")
    print("   1. Start the Django server: cd backend && python manage.py runserver")
    print("   2. Start the React frontend: cd frontend && npm start")
    print("   3. Test flight search in the web application")

if __name__ == '__main__':
    main()
