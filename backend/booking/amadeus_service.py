"""
Amadeus Service Layer with token caching via Django's cache framework.

This service provides a centralized way to interact with the Amadeus API,
with automatic token caching using Django's cache framework.
"""

import requests
import logging
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

# Cache key for Amadeus access token
AMADEUS_TOKEN_CACHE_KEY = 'amadeus_access_token'
# Default token expiry time in seconds (around 20 minutes for Amadeus)
DEFAULT_TOKEN_EXPIRY = 1800


class AmadeusService:
    """
    Service layer for Amadeus API interactions with token caching.
    
    Uses Django's cache framework to store and retrieve OAuth2 tokens,
    avoiding unnecessary API calls for token generation.
    """
    
    def __init__(self):
        self.api_key = settings.AMADEUS_API_KEY
        self.api_secret = settings.AMADEUS_API_SECRET
        self.base_url = settings.AMADEUS_BASE_URL
        
    def _get_token_from_cache(self):
        """
        Retrieve the access token from Django cache.
        
        Returns:
            str or None: The cached access token if available, None otherwise.
        """
        return cache.get(AMADEUS_TOKEN_CACHE_KEY)
    
    def _set_token_in_cache(self, token, expiry=DEFAULT_TOKEN_EXPIRY):
        """
        Store the access token in Django cache.
        
        Args:
            token (str): The access token to cache.
            expiry (int): Time in seconds until the token expires.
        """
        cache.set(AMADEUS_TOKEN_CACHE_KEY, token, expiry)
        logger.info("Amadeus access token cached successfully")
    
    def _fetch_new_token(self):
        """
        Fetch a new access token from Amadeus OAuth2 API.
        
        Returns:
            str: The new access token.
            
        Raises:
            Exception: If the token request fails.
        """
        url = f"{self.base_url}/v1/security/oauth2/token"
        data = {
            'grant_type': 'client_credentials',
            'client_id': self.api_key,
            'client_secret': self.api_secret
        }
        
        try:
            response = requests.post(url, data=data, timeout=10)
            if response.status_code == 200:
                token_data = response.json()
                access_token = token_data['access_token']
                # Cache the token with a slightly shorter expiry to be safe
                expires_in = token_data.get('expires_in', DEFAULT_TOKEN_EXPIRY)
                # Subtract 60 seconds buffer to avoid token expiration issues
                cache_expiry = max(expires_in - 60, 300)
                self._set_token_in_cache(access_token, cache_expiry)
                return access_token
            else:
                error_msg = f"Failed to get access token: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
        except requests.RequestException as e:
            logger.error(f"Request error while fetching token: {e}")
            raise
    
    def get_access_token(self):
        """
        Get a valid access token, using cache if available.
        
        Returns:
            str: A valid access token for Amadeus API calls.
        """
        # Try to get token from cache first
        token = self._get_token_from_cache()
        if token:
            logger.debug("Using cached Amadeus access token")
            return token
        
        # If not in cache, fetch a new token
        logger.info("No cached token found, fetching new token")
        return self._fetch_new_token()
    
    def invalidate_token(self):
        """
        Invalidate the cached token, forcing a new token fetch on next request.
        """
        cache.delete(AMADEUS_TOKEN_CACHE_KEY)
        logger.info("Amadeus access token invalidated")
    
    def search_flights(self, origin, destination, departure_date, return_date=None, adults=1):
        """
        Search for flights using the Amadeus Flight Offers Search API.
        
        Args:
            origin (str): IATA code of origin airport (e.g., 'JFK').
            destination (str): IATA code of destination airport (e.g., 'LAX').
            departure_date (str): Departure date in ISO format (YYYY-MM-DD).
            return_date (str, optional): Return date in ISO format for round trip.
            adults (int): Number of adult passengers.
            
        Returns:
            dict: API response containing flight offers, or None if request fails.
        """
        token = self.get_access_token()
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        params = {
            'originLocationCode': origin,
            'destinationLocationCode': destination,
            'departureDate': departure_date,
            'adults': adults,
            'max': 20  # Limit results
        }
        if return_date:
            params['returnDate'] = return_date
        
        url = f"{self.base_url}/v2/shopping/flight-offers"
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 401:
                # Token might be expired, invalidate and retry
                logger.warning("Token expired, invalidating and retrying")
                self.invalidate_token()
                token = self.get_access_token()
                headers['Authorization'] = f'Bearer {token}'
                response = requests.get(url, headers=headers, params=params, timeout=30)
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Flight search failed after retry: {response.status_code}")
                    return None
            else:
                logger.error(f"Flight search failed: {response.status_code} - {response.text}")
                return None
        except requests.RequestException as e:
            logger.error(f"Request error during flight search: {e}")
            return None
    
    def search_airports(self, keyword, sub_type='AIRPORT,CITY'):
        """
        Search for airports and cities using the Amadeus API.
        
        Args:
            keyword (str): Search keyword (city name, airport code, etc.).
            sub_type (str): Type of locations to search for.
            
        Returns:
            dict: API response containing airport/city data, or None if request fails.
        """
        token = self.get_access_token()
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        params = {
            'keyword': keyword,
            'subType': sub_type
        }
        
        url = f"{self.base_url}/v1/reference-data/locations"
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 401:
                logger.warning("Token expired, invalidating and retrying")
                self.invalidate_token()
                token = self.get_access_token()
                headers['Authorization'] = f'Bearer {token}'
                response = requests.get(url, headers=headers, params=params, timeout=30)
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Airport search failed after retry: {response.status_code}")
                    return None
            else:
                logger.error(f"Airport search failed: {response.status_code} - {response.text}")
                return None
        except requests.RequestException as e:
            logger.error(f"Request error during airport search: {e}")
            return None
    
    def create_order(self, flight_offer, traveler_info):
        """
        Create a flight order using Amadeus Flight Orders API.
        
        Args:
            flight_offer (dict): The flight offer data from search results.
            traveler_info (dict): Traveler information including contact and documents.
            
        Returns:
            dict: API response containing order details, or None if request fails.
        """
        token = self.get_access_token()
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        url = f"{self.base_url}/v1/booking/flight-orders"
        
        # Build the order payload
        payload = {
            'data': {
                'type': 'flight-order',
                'flightOffers': [flight_offer],
                'travelers': [traveler_info]
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            if response.status_code in [200, 201]:
                return response.json()
            elif response.status_code == 401:
                logger.warning("Token expired, invalidating and retrying")
                self.invalidate_token()
                token = self.get_access_token()
                headers['Authorization'] = f'Bearer {token}'
                response = requests.post(url, headers=headers, json=payload, timeout=30)
                if response.status_code in [200, 201]:
                    return response.json()
                else:
                    logger.error(f"Order creation failed after retry: {response.status_code}")
                    return None
            else:
                logger.error(f"Order creation failed: {response.status_code} - {response.text}")
                return None
        except requests.RequestException as e:
            logger.error(f"Request error during order creation: {e}")
            return None
    
    def get_order(self, order_id):
        """
        Retrieve an existing flight order by ID.
        
        Args:
            order_id (str): The unique order identifier.
            
        Returns:
            dict: API response containing order details, or None if request fails.
        """
        token = self.get_access_token()
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        url = f"{self.base_url}/v1/booking/flight-orders/{order_id}"
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 401:
                logger.warning("Token expired, invalidating and retrying")
                self.invalidate_token()
                token = self.get_access_token()
                headers['Authorization'] = f'Bearer {token}'
                response = requests.get(url, headers=headers, timeout=30)
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Get order failed after retry: {response.status_code}")
                    return None
            else:
                logger.error(f"Get order failed: {response.status_code} - {response.text}")
                return None
        except requests.RequestException as e:
            logger.error(f"Request error during get order: {e}")
            return None


# Singleton instance for reuse across the application
amadeus_service = AmadeusService()
