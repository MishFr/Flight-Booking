#!/usr/bin/env python
import sys
sys.path.insert(0, 'c:/Users/user/Documents/MIni-Project Files/Flight Booking/backend')

from booking.iata_utils import get_iata_code, get_city_from_iata, is_valid_iata, get_airport_info

# Test city to IATA
print('=== City to IATA ===')
print('New York ->', get_iata_code('New York'))
print('London ->', get_iata_code('London'))
print('Paris ->', get_iata_code('Paris'))
print('Tokyo ->', get_iata_code('Tokyo'))
print('San Francisco ->', get_iata_code('San Francisco'))

# Test direct IATA input
print('\n=== Direct IATA Input ===')
print('JFK ->', get_iata_code('JFK'))
print('LAX ->', get_iata_code('LAX'))

# Test IATA to city
print('\n=== IATA to City ===')
print('JFK ->', get_city_from_iata('JFK'))
print('LHR ->', get_city_from_iata('LHR'))
print('CDG ->', get_city_from_iata('CDG'))

# Test validation
print('\n=== IATA Validation ===')
print('JFK valid:', is_valid_iata('JFK'))
print('XY valid:', is_valid_iata('XY'))
print('123 valid:', is_valid_iata('123'))

# Test airport info
print('\n=== Airport Info ===')
info = get_airport_info('JFK')
print('JFK:', info)
info = get_airport_info('LHR')
print('LHR:', info)
