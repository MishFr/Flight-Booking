#!/usr/bin/env python
import os
import sys

# Set working directory
os.chdir('c:/Users/user/Documents/MIni-Project Files/Flight Booking/backend')
sys.path.insert(0, '.')

# Direct import
from booking.iata_utils import get_iata_code

# Simple test
result = get_iata_code('New York')
print(f"Result: '{result}'")
print(f"Type: {type(result)}")
print(f"Length: {len(result) if result else 0}")
