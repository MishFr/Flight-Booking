import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class AirLabsClient:
    def __init__(self):
        self.api_key = getattr(settings, 'AIRLABS_API_KEY', None)
        self.base_url = 'https://airlabs.co/api/v9'

        if not self.api_key:
            logger.error("AirLabs API key not configured")
            raise ValueError("AirLabs API key is required")

    def search_airports(self, keyword, country=None):
        if not keyword:
            logger.warning("Empty keyword provided for airport search")
            return None

        params = {
            'api_key': self.api_key,
            'search': keyword
        }
        if country:
            params['country'] = country

        url = f"{self.base_url}/airports"

        try:
            response = requests.get(url, params=params, timeout=10)
            logger.info(f"AirLabs API request: {url} - Status: {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                if 'error' in data:
                    logger.error(f"AirLabs API error: {data['error']}")
                    return None

                airports = data.get('response', [])
                # Filter out airports without IATA codes and limit to 10 results
                valid_airports = [airport for airport in airports if airport.get('iata_code')][:10]
                # Map to expected format
                mapped_airports = []
                for airport in valid_airports:
                    mapped_airports.append({
                        'iataCode': airport.get('iata_code'),
                        'name': airport.get('name'),
                        'cityName': airport.get('city'),
                        'countryName': airport.get('country_name')
                    })
                return {'data': mapped_airports}
            elif response.status_code == 401:
                logger.error("AirLabs API authentication failed - check API key")
                return None
            elif response.status_code == 429:
                logger.warning("AirLabs API rate limit exceeded")
                return None
            else:
                logger.error(f"AirLabs API error: HTTP {response.status_code}")
                return None
        except requests.exceptions.Timeout:
            logger.error("AirLabs API request timed out")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"AirLabs API request failed: {e}")
            return None
