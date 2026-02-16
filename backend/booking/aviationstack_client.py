import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class AviationStackClient:
    def __init__(self):
        self.api_key = getattr(settings, 'AVIATIONSTACK_API_KEY', None)
        self.base_url = 'http://api.aviationstack.com/v1'

        if not self.api_key:
            logger.error("Aviation Stack API key not configured")
            raise ValueError("Aviation Stack API key is required")

    def search_flights(self, origin, destination, departure_date, return_date=None, adults=1):
        """
        Search for flights using Aviation Stack API.
        Note: Aviation Stack provides real-time flight tracking data, not booking information.
        We'll simulate flight search by getting flights between airports.
        """
        if not origin or not destination or not departure_date:
            logger.warning("Missing required parameters for flight search")
            return None

        try:
            # Aviation Stack uses IATA codes directly
            params = {
                'access_key': self.api_key,
                'dep_iata': origin.upper(),
                'arr_iata': destination.upper(),
                'flight_date': departure_date,
                'limit': 10
            }

            url = f"{self.base_url}/flights"

            logger.info(f"Aviation Stack API request: {url} with params: {params}")

            response = requests.get(url, params=params, timeout=15)

            logger.info(f"Aviation Stack API response status: {response.status_code}")

            if response.status_code == 200:
                try:
                    data = response.json()
                except ValueError as e:
                    logger.error(f"Invalid JSON response from Aviation Stack: {e}")
                    return None

                if not isinstance(data, dict) or 'data' not in data:
                    logger.error(f"Unexpected response format from Aviation Stack: {type(data)}")
                    return None

                flights = []
                for flight in data['data'][:10]:  # Limit to 10 results
                    if not isinstance(flight, dict):
                        logger.warning(f"Skipping invalid flight data: {flight}")
                        continue

                    try:
                        # Extract flight information
                        flight_info = flight.get('flight', {})
                        departure = flight.get('departure', {})
                        arrival = flight.get('arrival', {})
                        airline = flight.get('airline', {})

                        # Skip if essential data is missing
                        if not all([departure, arrival, flight_info]):
                            continue

                        mapped_flight = {
                            'id': flight.get('flight_date', '') + '_' + flight_info.get('iata', ''),
                            'flightNumber': flight_info.get('iata', 'Unknown'),
                            'from': departure.get('iata', origin),
                            'to': arrival.get('iata', destination),
                            'departureTime': departure.get('scheduled', ''),
                            'arrivalTime': arrival.get('scheduled', ''),
                            'duration': 'N/A',  # Aviation Stack doesn't provide duration
                            'stops': 0,  # Assume direct flights
                            'price': 'N/A',  # Aviation Stack doesn't provide pricing
                            'airline': airline.get('name', 'Unknown Airline'),
                            'status': flight.get('flight_status', 'Unknown')
                        }
                        flights.append(mapped_flight)
                    except Exception as e:
                        logger.error(f"Error processing flight data: {flight} - {e}")
                        continue

                logger.info(f"Successfully processed {len(flights)} flights from Aviation Stack")
                return flights

            elif response.status_code == 401:
                logger.error("Aviation Stack API authentication failed - check API key")
                return None
            elif response.status_code == 429:
                logger.warning("Aviation Stack API rate limit exceeded")
                return None
            else:
                logger.error(f"Aviation Stack API error: HTTP {response.status_code} - {response.text}")
                return None

        except requests.exceptions.Timeout:
            logger.error("Aviation Stack API request timed out")
            return None
        except requests.exceptions.ConnectionError:
            logger.error("Connection error while accessing Aviation Stack API")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"Aviation Stack API request failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in Aviation Stack flight search: {e}")
            return None

    def search_airports(self, keyword):
        """
        Aviation Stack doesn't have airport search functionality.
        This method exists for API consistency but always returns None.
        """
        logger.info("Airport search requested but Aviation Stack doesn't support airport search")
        return None
