import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class AmadeusClient:
    def __init__(self):
        self.api_key = settings.AMADEUS_API_KEY
        self.api_secret = settings.AMADEUS_API_SECRET
        self.base_url = settings.AMADEUS_BASE_URL
        self.access_token = None

    def get_access_token(self):
        if not self.access_token:
            url = f"{self.base_url}/v1/security/oauth2/token"
            data = {
                'grant_type': 'client_credentials',
                'client_id': self.api_key,
                'client_secret': self.api_secret
            }
            response = requests.post(url, data=data, timeout=10)
            if response.status_code == 200:
                self.access_token = response.json()['access_token']
            else:
                raise Exception(f"Failed to get access token: {response.status_code} - {response.text}")
        return self.access_token

    def search_flights(self, origin, destination, departure_date, return_date=None, adults=1):
        token = self.get_access_token()
        headers = {'Authorization': f'Bearer {token}'}
        params = {
            'originLocationCode': origin,
            'destinationLocationCode': destination,
            'departureDate': departure_date,
            'adults': adults
        }
        if return_date:
            params['returnDate'] = return_date

        url = f"{self.base_url}/v2/shopping/flight-offers"
        response = requests.get(url, headers=headers, params=params, timeout=30)
        return response.json() if response.status_code == 200 else None

    def search_airports(self, keyword):
        token = self.get_access_token()
        headers = {'Authorization': f'Bearer {token}'}
        params = {
            'keyword': keyword,
            'subType': 'AIRPORT,CITY'
        }
        url = f"{self.base_url}/v1/reference-data/locations"
        response = requests.get(url, headers=headers, params=params, timeout=30)
        return response.json() if response.status_code == 200 else None

    def search_hotels(self, city_code, check_in, check_out, guests=1, room_count=1):
        """Search for hotels by city code using Amadeus Hotel Search API"""
        token = self.get_access_token()
        headers = {'Authorization': f'Bearer {token}'}
        params = {
            'cityCode': city_code,
            'checkInDate': check_in,
            'checkOutDate': check_out,
            'adults': guests,
            'roomQuantity': room_count,
            'radius': 50,
            'radiusUnit': 'KM',
            'hotelSource': 'ALL'
        }
        url = f"{self.base_url}/v2/shopping/hotel-offers"
        response = requests.get(url, headers=headers, params=params, timeout=30)
        if response.status_code == 200:
            return response.json()
        return None

    def search_hotels_by_geocode(self, latitude, longitude, check_in, check_out, guests=1, room_count=1):
        """Search for hotels by geolocation (latitude/longitude)"""
        token = self.get_access_token()
        headers = {'Authorization': f'Bearer {token}'}
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'checkInDate': check_in,
            'checkOutDate': check_out,
            'adults': guests,
            'roomQuantity': room_count,
            'radius': 50,
            'radiusUnit': 'KM',
            'hotelSource': 'ALL'
        }
        url = f"{self.base_url}/v2/shopping/hotel-offers"
        response = requests.get(url, headers=headers, params=params, timeout=30)
        if response.status_code == 200:
            return response.json()
        return None

    def get_hotel_details(self, hotel_id):
        """Get detailed information about a specific hotel"""
        token = self.get_access_token()
        headers = {'Authorization': f'Bearer {token}'}
        url = f"{self.base_url}/v1/shopping/hotel-offers/{hotel_id}"
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            return response.json()
        return None
