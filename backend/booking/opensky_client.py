import requests
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class OpenSkyClient:
    def __init__(self):
        self.base_url = 'https://opensky-network.org/api'
        # OpenSky Network is free and doesn't require API keys
        # But we'll add proper validation and error handling

    def search_flights(self, origin, destination, departure_date, from_country=None, to_country=None, return_date=None, adults=1):
        """
        Search for flights using OpenSky Network API.
        Note: OpenSky provides real-time flight tracking data, not booking information.
        We'll simulate flight search by getting departures from origin airport.
        """
        if not origin or not destination or not departure_date:
            logger.warning("Missing required parameters for flight search")
            return None

        try:
            # Validate and parse departure_date
            try:
                dep_datetime = datetime.fromisoformat(departure_date.replace('Z', '+00:00'))
            except ValueError as e:
                logger.error(f"Invalid departure date format: {departure_date} - {e}")
                return None

            # Check if departure date is not too far in the past or future
            now = datetime.now()
            if dep_datetime < now - timedelta(days=1):
                logger.warning(f"Departure date {departure_date} is too far in the past")
                return None
            if dep_datetime > now + timedelta(days=30):
                logger.warning(f"Departure date {departure_date} is too far in the future")
                return None

            begin_time = int(dep_datetime.timestamp())
            end_time = int((dep_datetime + timedelta(days=1)).timestamp())

            url = f"{self.base_url}/flights/departure"
            params = {
                'airport': origin.upper(),  # Assume ICAO code
                'begin': begin_time,
                'end': end_time
            }

            logger.info(f"OpenSky API request: {url} with params: {params}")

            # Add timeout and proper error handling
            response = requests.get(url, params=params, timeout=15)

            logger.info(f"OpenSky API response status: {response.status_code}")

            if response.status_code == 200:
                try:
                    data = response.json()
                except ValueError as e:
                    logger.error(f"Invalid JSON response from OpenSky: {e}")
                    return None

                if not isinstance(data, list):
                    logger.error(f"Unexpected response format from OpenSky: {type(data)}")
                    return None

                # Map to our expected format
                flights = []
                for flight in data[:10]:  # Limit to 10 results
                    if not isinstance(flight, dict):
                        logger.warning(f"Skipping invalid flight data: {flight}")
                        continue

                    try:
                        first_seen = flight.get('firstSeen', 0)
                        last_seen = flight.get('lastSeen', 0)

                        if first_seen == 0 or last_seen == 0 or last_seen <= first_seen:
                            logger.warning(f"Invalid flight timing data: {flight}")
                            continue

                        duration_seconds = last_seen - first_seen
                        hours = int(duration_seconds / 3600)
                        minutes = int((duration_seconds % 3600) / 60)

                        mapped_flight = {
                            'id': flight.get('icao24', ''),
                            'flightNumber': flight.get('callsign', 'Unknown'),
                            'from': origin,
                            'to': destination,  # This is the searched destination, not from API
                            'departureTime': datetime.fromtimestamp(first_seen).strftime('%Y-%m-%d %H:%M:%S'),
                            'arrivalTime': datetime.fromtimestamp(last_seen).strftime('%Y-%m-%d %H:%M:%S'),
                            'duration': f"{hours}h {minutes}m",
                            'stops': 0,  # OpenSky doesn't provide stop info
                            'price': 'N/A'  # OpenSky doesn't provide pricing
                        }
                        flights.append(mapped_flight)
                    except Exception as e:
                        logger.error(f"Error processing flight data: {flight} - {e}")
                        continue

                logger.info(f"Successfully processed {len(flights)} flights from OpenSky")
                return flights

            elif response.status_code == 404:
                logger.warning(f"No flight data found for airport {origin} on {departure_date}")
                return []
            elif response.status_code == 429:
                logger.warning("OpenSky API rate limit exceeded")
                return None
            else:
                logger.error(f"OpenSky API error: HTTP {response.status_code} - {response.text}")
                return None

        except requests.exceptions.Timeout:
            logger.error("OpenSky API request timed out")
            return None
        except requests.exceptions.ConnectionError:
            logger.error("Connection error while accessing OpenSky API")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"OpenSky API request failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in OpenSky flight search: {e}")
            return None

    def search_airports(self, keyword):
        """
        OpenSky doesn't have airport search functionality.
        This method exists for API consistency but always returns None.
        """
        logger.info("Airport search requested but OpenSky doesn't support airport search")
        return None

    def get_states(self, icao24=None, time=None):
        """
        Get current flight states from OpenSky Network.
        This is a more advanced method for real-time flight tracking.
        """
        try:
            url = f"{self.base_url}/states/all"
            params = {}

            if icao24:
                params['icao24'] = icao24
            if time:
                params['time'] = time

            logger.info(f"OpenSky states request: {url} with params: {params}")

            response = requests.get(url, params=params, timeout=10)

            if response.status_code == 200:
                data = response.json()
                logger.info(f"Successfully retrieved flight states from OpenSky")
                return data
            else:
                logger.error(f"OpenSky states API error: HTTP {response.status_code}")
                return None

        except requests.exceptions.RequestException as e:
            logger.error(f"OpenSky states API request failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in OpenSky states request: {e}")
            return None
