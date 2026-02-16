#!/usr/bin/env python3
"""
Test script for Amadeus API integration
Run this script to test the flight search functionality with Amadeus API.
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

from booking.amadeus_client import AmadeusClient

def test_amadeus_access_token():
    """Test if Amadeus access token can be obtained"""
    print("🔑 Testing Amadeus Access Token...")

    try:
        client = AmadeusClient()
        token = client.get_access_token()
        if token:
            print("✅ Amadeus access token obtained successfully")
            return True
        else:
            print("❌ Failed to obtain access token")
            return False
    except Exception as e:
        print(f"❌ Error obtaining access token: {e}")
        return False

def test_airport_search():
    """Test airport search functionality with Amadeus"""
    print("\n🏙️  Testing Airport Search with Amadeus...")

    try:
        client = AmadeusClient()

        # Test searching for New York airports
        print("Searching for 'New York' airports...")
        ny_airports = client.search_airports('New York')
        if ny_airports and 'data' in ny_airports:
            print(f"✅ Found {len(ny_airports['data'])} New York airports")
            for airport in ny_airports['data'][:3]:  # Show first 3
                print(f"   - {airport.get('name')} ({airport.get('iataCode')}) - {airport.get('address', {}).get('cityName')}")
        else:
            print("❌ No New York airports found")
            print(f"Response: {ny_airports}")
            return False

        # Test searching for London airports
        print("Searching for 'London' airports...")
        london_airports = client.search_airports('London')
        if london_airports and 'data' in london_airports:
            print(f"✅ Found {len(london_airports['data'])} London airports")
            for airport in london_airports['data'][:3]:  # Show first 3
                print(f"   - {airport.get('name')} ({airport.get('iataCode')}) - {airport.get('address', {}).get('cityName')}")
        else:
            print("❌ No London airports found")
            print(f"Response: {london_airports}")
            return False

    except Exception as e:
        print(f"❌ Airport search test failed: {e}")
        return False

    return True

def test_flight_search():
    """Test flight search functionality with Amadeus"""
    print("\n✈️  Testing Flight Search with Amadeus...")

    try:
        client = AmadeusClient()

        # Use IATA codes for a popular route: JFK to LHR
        origin = 'JFK'
        destination = 'LHR'
        departure_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')  # 7 days from now

        print(f"Searching flights from {origin} to {destination} on {departure_date}...")

        flights_data = client.search_flights(origin, destination, departure_date)

        if flights_data and 'data' in flights_data:
            print(f"✅ Found {len(flights_data['data'])} flight offers")
            for offer in flights_data['data'][:3]:  # Show first 3
                try:
                    itinerary = offer['itineraries'][0]
                    segment = itinerary['segments'][0]
                    price = offer['price']['total']
                    currency = offer['price']['currency']
                    print(f"   - Flight {segment['carrierCode']}{segment['number']}: {segment['departure']['iataCode']} -> {segment['arrival']['iataCode']}")
                    print(f"     Departure: {segment['departure']['at']}, Price: {price} {currency}")
                except KeyError as e:
                    print(f"   - Error parsing offer: {e}")
        else:
            print("❌ No flight offers found")
            print(f"Response: {flights_data}")
            return False

    except Exception as e:
        print(f"❌ Flight search test failed: {e}")
        return False

    return True

def main():
    """Run all Amadeus API tests"""
    print("🚀 Amadeus API Integration Test")
    print("=" * 50)

    # Test access token
    if not test_amadeus_access_token():
        print("\n❌ Amadeus API access failed. Please check:")
        print("   1. AMADEUS_API_KEY and AMADEUS_API_SECRET in backend/flight_booking/settings.py")
        print("   2. Internet connection")
        print("   3. Amadeus API credentials validity")
        return

    # Test airport search
    if not test_airport_search():
        print("\n❌ Airport search failed. Check Amadeus API and credentials.")
        return

    # Test flight search
    if not test_flight_search():
        print("\n❌ Flight search failed. Check Amadeus API and credentials.")
        return

    print("\n🎉 All Amadeus API tests passed! Integration is working correctly.")
    print("\n📝 Next steps:")
    print("   1. Start the Django server: cd backend && python manage.py runserver")
    print("   2. Start the React frontend: cd frontend && npm start")
    print("   3. Test flight search in the web application")

if __name__ == '__main__':
    main()
