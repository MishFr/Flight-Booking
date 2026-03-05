"""
Comprehensive IATA Airport Code Mapping Utility

This module provides comprehensive city-to-IATA and IATA-to-city mappings
for flight search functionality. It covers major airports worldwide.
"""

import math

# Comprehensive city to IATA code mapping
CITY_TO_IATA = {
    # United States - Major Cities
    'new york': 'JFK', 'nyc': 'JFK', 'ny': 'JFK',
    'los angeles': 'LAX', 'la': 'LAX', 'lax': 'LAX',
    'chicago': 'ORD', 'chi': 'ORD',
    'miami': 'MIA', 'mia': 'MIA',
    'san francisco': 'SFO', 'sf': 'SFO', 'sfo': 'SFO',
    'dallas': 'DFW', 'dfw': 'DFW',
    'atlanta': 'ATL', 'atl': 'ATL',
    'denver': 'DEN', 'den': 'DEN',
    'seattle': 'SEA', 'sea': 'SEA',
    'boston': 'BOS', 'bos': 'BOS',
    'las vegas': 'LAS', 'las': 'LAS',
    'phoenix': 'PHX', 'phx': 'PHX',
    'houston': 'IAH', 'iah': 'IAH',
    'washington': 'DCA', 'dc': 'DCA', 'dca': 'DCA',
    'orlando': 'MCO', 'mco': 'MCO',
    'charlotte': 'CLT', 'clt': 'CLT',
    'salt lake city': 'SLC', 'slc': 'SLC',
    'detroit': 'DTW', 'dtw': 'DTW',
    'minneapolis': 'MSP', 'msp': 'MSP',
    'tampa': 'TPA', 'tpa': 'TPA',
    'philadelphia': 'PHL', 'phl': 'PHL',
    'newark': 'EWR', 'ewr': 'EWR',
    'portland': 'PDX', 'pdx': 'PDX',
    'san diego': 'SAN', 'san': 'SAN',
    'austin': 'AUS', 'aus': 'AUS',
    'nashville': 'BNA', 'bna': 'BNA',
    'baltimore': 'BWI', 'bwi': 'BWI',
    'fort lauderdale': 'FLL', 'fll': 'FLL',
    'oakland': 'OAK', 'oak': 'OAK',
    'pittsburgh': 'PIT', 'pit': 'PIT',
    'raleigh': 'RDU', 'rdu': 'RDU',
    'indianapolis': 'IND', 'ind': 'IND',
    'cincinnati': 'CVG', 'cvg': 'CVG',
    'columbus': 'CMH', 'cmh': 'CMH',
    'cleveland': 'CLE', 'cle': 'CLE',
    'milwaukee': 'MKE', 'mke': 'MKE',
    'kansas city': 'MCI', 'mci': 'MCI',
    'omaha': 'OMA', 'oma': 'OMA',
    'wichita': 'ICT', 'ict': 'ICT',
    'tulsa': 'TUL', 'tul': 'TUL',
    'oklahoma city': 'OKC', 'okc': 'OKC',
    'albuquerque': 'ABQ', 'abq': 'ABQ',
    'reno': 'RNO', 'rno': 'RNO',
    'boise': 'BOI', 'boi': 'BOI',
    'spokane': 'GEG', 'geg': 'GEG',
    'anchorage': 'ANC', 'anc': 'ANC',
    'honolulu': 'HNL', 'hnl': 'HNL',
    'london': 'LHR', 'london heathrow': 'LHR', 'lhr': 'LHR',
    'london gatwick': 'LGW', 'lgw': 'LGW',
    'manchester': 'MAN', 'man': 'MAN',
    'paris': 'CDG', 'paris charles de gaulle': 'CDG', 'cdg': 'CDG',
    'berlin': 'BER', 'ber': 'BER',
    'frankfurt': 'FRA', 'fra': 'FRA',
    'munich': 'MUC', 'muc': 'MUC',
    'rome': 'FCO', 'fco': 'FCO',
    'milan': 'MXP', 'milan malpensa': 'MXP', 'mxp': 'MXP',
    'madrid': 'MAD', 'mad': 'MAD',
    'barcelona': 'BCN', 'bcn': 'BCN',
    'amsterdam': 'AMS', 'ams': 'AMS',
    'zurich': 'ZRH', 'zrh': 'ZRH',
    'vienna': 'VIE', 'vie': 'VIE',
    'brussels': 'BRU', 'bru': 'BRU',
    'copenhagen': 'CPH', 'cph': 'CPH',
    'stockholm': 'ARN', 'arn': 'ARN',
    'oslo': 'OSL', 'osl': 'OSL',
    'helsinki': 'HEL', 'hel': 'HEL',
    'warsaw': 'WAW', 'waw': 'WAW',
    'prague': 'PRG', 'prg': 'PRG',
    'budapest': 'BUD', 'bud': 'BUD',
    'athens': 'ATH', 'ath': 'ATH',
    'istanbul': 'IST', 'ist': 'IST',
    'tokyo': 'NRT', 'tokyo narita': 'NRT', 'nrt': 'NRT',
    'tokyo haneda': 'HND', 'hnd': 'HND',
    'osaka': 'KIX', 'kix': 'KIX',
    'beijing': 'PEK', 'pek': 'PEK',
    'shanghai': 'PVG', 'pvg': 'PVG',
    'hong kong': 'HKG', 'hkg': 'HKG',
    'singapore': 'SIN', 'sin': 'SIN',
    'bangkok': 'BKK', 'bkk': 'BKK',
    'dubai': 'DXB', 'dxb': 'DXB',
    'delhi': 'DEL', 'del': 'DEL',
    'mumbai': 'BOM', 'bom': 'BOM',
    'bangalore': 'BLR', 'blr': 'BLR',
    'sydney': 'SYD', 'syd': 'SYD',
    'melbourne': 'MEL', 'mel': 'MEL',
    'brisbane': 'BNE', 'bne': 'BNE',
    'perth': 'PER', 'per': 'PER',
    'auckland': 'AKL', 'akl': 'AKL',
    'toronto': 'YYZ', 'yyz': 'YYZ',
    'montreal': 'YUL', 'yul': 'YUL',
    'vancouver': 'YVR', 'yvr': 'YVR',
    'calgary': 'YYC', 'yyc': 'YYC',
    'mexico city': 'MEX', 'mex': 'MEX',
    'cancun': 'CUN', 'cun': 'CUN',
    'lisbon': 'LIS', 'lis': 'LIS',
    'dublin': 'DUB', 'dub': 'DUB',
}


def get_iata_code(city_name):
    """
    Convert city name to IATA code.
    """
    if not city_name:
        return None
    
    normalized = str(city_name).strip().upper()
    if len(normalized) == 3 and normalized.isalpha():
        return normalized
    
    normalized_lower = str(city_name).strip().lower()
    
    if normalized_lower in CITY_TO_IATA:
        return CITY_TO_IATA[normalized_lower]
    
    if 'international' in normalized_lower:
        city_without_intl = normalized_lower.replace(' international', '').strip()
        if city_without_intl in CITY_TO_IATA:
            return CITY_TO_IATA[city_without_intl]
    
    return None


def get_city_from_iata(iata_code):
    """
    Convert IATA code to city name.
    """
    if not iata_code:
        return None
    
    if not hasattr(get_city_from_iata, '_reverse_map'):
        get_city_from_iata._reverse_map = {v: k.title() for k, v in CITY_TO_IATA.items()}
    
    normalized = str(iata_code).strip().upper()
    return get_city_from_iata._reverse_map.get(normalized)


def is_valid_iata(iata_code):
    """
    Check if a string is a valid IATA code.
    """
    if not iata_code:
        return False
    
    normalized = str(iata_code).strip().upper()
    return len(normalized) == 3 and normalized.isalpha()


# Comprehensive IATA to city/airport name mapping with coordinates
IATA_INFO = {
    'JFK': {'city': 'New York', 'country': 'USA', 'name': 'John F. Kennedy International', 'lat': 40.6413, 'lon': -73.7781},
    'LAX': {'city': 'Los Angeles', 'country': 'USA', 'name': 'Los Angeles International', 'lat': 33.9416, 'lon': -118.4085},
    'ORD': {'city': 'Chicago', 'country': 'USA', 'name': "O'Hare International", 'lat': 41.9742, 'lon': -87.9073},
    'MIA': {'city': 'Miami', 'country': 'USA', 'name': 'Miami International', 'lat': 25.7959, 'lon': -80.2870},
    'SFO': {'city': 'San Francisco', 'country': 'USA', 'name': 'San Francisco International', 'lat': 37.6213, 'lon': -122.3790},
    'DFW': {'city': 'Dallas', 'country': 'USA', 'name': 'Dallas/Fort Worth International', 'lat': 32.8998, 'lon': -97.0403},
    'ATL': {'city': 'Atlanta', 'country': 'USA', 'name': 'Hartsfield-Jackson Atlanta International', 'lat': 33.6407, 'lon': -84.4277},
    'DEN': {'city': 'Denver', 'country': 'USA', 'name': 'Denver International', 'lat': 39.8561, 'lon': -104.6737},
    'SEA': {'city': 'Seattle', 'country': 'USA', 'name': 'Seattle-Tacoma International', 'lat': 47.4502, 'lon': -122.3088},
    'BOS': {'city': 'Boston', 'country': 'USA', 'name': 'Logan International', 'lat': 42.3656, 'lon': -71.0096},
    'LAS': {'city': 'Las Vegas', 'country': 'USA', 'name': 'Harry Reid International', 'lat': 36.0840, 'lon': -115.1537},
    'PHX': {'city': 'Phoenix', 'country': 'USA', 'name': 'Phoenix Sky Harbor International', 'lat': 33.4352, 'lon': -112.0101},
    'IAH': {'city': 'Houston', 'country': 'USA', 'name': 'George Bush Intercontinental', 'lat': 29.9902, 'lon': -95.3368},
    'DCA': {'city': 'Washington', 'country': 'USA', 'name': 'Ronald Reagan Washington National', 'lat': 38.8512, 'lon': -77.0402},
    'MCO': {'city': 'Orlando', 'country': 'USA', 'name': 'Orlando International', 'lat': 28.4312, 'lon': -81.3081},
    'CLT': {'city': 'Charlotte', 'country': 'USA', 'name': 'Charlotte Douglas International', 'lat': 35.2144, 'lon': -80.9473},
    'SLC': {'city': 'Salt Lake City', 'country': 'USA', 'name': 'Salt Lake City International', 'lat': 40.7899, 'lon': -111.9791},
    'DTW': {'city': 'Detroit', 'country': 'USA', 'name': 'Detroit Metropolitan Wayne County', 'lat': 42.2162, 'lon': -83.3554},
    'MSP': {'city': 'Minneapolis', 'country': 'USA', 'name': 'Minneapolis-St Paul International', 'lat': 44.8848, 'lon': -93.2223},
    'TPA': {'city': 'Tampa', 'country': 'USA', 'name': 'Tampa International', 'lat': 27.9755, 'lon': -82.5332},
    'PHL': {'city': 'Philadelphia', 'country': 'USA', 'name': 'Philadelphia International', 'lat': 39.8729, 'lon': -75.2437},
    'EWR': {'city': 'Newark', 'country': 'USA', 'name': 'Newark Liberty International', 'lat': 40.6895, 'lon': -74.1745},
    'PDX': {'city': 'Portland', 'country': 'USA', 'name': 'Portland International', 'lat': 45.5898, 'lon': -122.5951},
    'SAN': {'city': 'San Diego', 'country': 'USA', 'name': 'San Diego International', 'lat': 32.7338, 'lon': -117.1933},
    'AUS': {'city': 'Austin', 'country': 'USA', 'name': 'Austin-Bergstrom International', 'lat': 30.1945, 'lon': -97.6699},
    'BNA': {'city': 'Nashville', 'country': 'USA', 'name': 'Nashville International', 'lat': 36.1263, 'lon': -86.6774},
    'BWI': {'city': 'Baltimore', 'country': 'USA', 'name': 'Baltimore/Washington International', 'lat': 39.1774, 'lon': -76.6684},
    'FLL': {'city': 'Fort Lauderdale', 'country': 'USA', 'name': 'Fort Lauderdale-Hollywood International', 'lat': 26.0742, 'lon': -80.1506},
    'HNL': {'city': 'Honolulu', 'country': 'USA', 'name': 'Daniel K. Inouye International', 'lat': 21.3187, 'lon': -157.9225},
    'SJU': {'city': 'San Juan', 'country': 'USA', 'name': 'Luis Muñoz Marín International', 'lat': 18.4394, 'lon': -66.0028},
    'RDU': {'city': 'Raleigh', 'country': 'USA', 'name': 'Raleigh-Durham International', 'lat': 35.8801, 'lon': -78.7880},
    'IND': {'city': 'Indianapolis', 'country': 'USA', 'name': 'Indianapolis International', 'lat': 39.7173, 'lon': -86.2944},
    'CMH': {'city': 'Columbus', 'country': 'USA', 'name': 'John Glenn Columbus International', 'lat': 39.9980, 'lon': -82.8919},
    'CVG': {'city': 'Cincinnati', 'country': 'USA', 'name': 'Cincinnati/Northern Kentucky International', 'lat': 39.0534, 'lon': -84.6630},
    'PIT': {'city': 'Pittsburgh', 'country': 'USA', 'name': 'Pittsburgh International', 'lat': 40.4915, 'lon': -80.2329},
    'MCI': {'city': 'Kansas City', 'country': 'USA', 'name': 'Kansas City International', 'lat': 39.2976, 'lon': -94.7139},
    'OMA': {'city': 'Omaha', 'country': 'USA', 'name': 'Eppley Airfield', 'lat': 41.3032, 'lon': -95.8941},
    'MKE': {'city': 'Milwaukee', 'country': 'USA', 'name': 'Milwaukee Mitchell International', 'lat': 42.9472, 'lon': -87.8966},
    'CLE': {'city': 'Cleveland', 'country': 'USA', 'name': 'Cleveland Hopkins International', 'lat': 41.4117, 'lon': -81.8498},
    'BDL': {'city': 'Hartford', 'country': 'USA', 'name': 'Bradley International', 'lat': 41.9389, 'lon': -72.6832},
    'BUF': {'city': 'Buffalo', 'country': 'USA', 'name': 'Buffalo Niagara International', 'lat': 42.9405, 'lon': -78.7322},
    'RIC': {'city': 'Richmond', 'country': 'USA', 'name': 'Richmond International', 'lat': 37.5052, 'lon': -77.3197},
    'JAX': {'city': 'Jacksonville', 'country': 'USA', 'name': 'Jacksonville International', 'lat': 30.4941, 'lon': -81.6879},
    'SNA': {'city': 'Santa Ana', 'country': 'USA', 'name': 'John Wayne Airport', 'lat': 33.6762, 'lon': -117.8682},
    'SMF': {'city': 'Sacramento', 'country': 'USA', 'name': 'Sacramento International', 'lat': 38.6954, 'lon': -121.5908},
    'TUS': {'city': 'Tucson', 'country': 'USA', 'name': 'Tucson International', 'lat': 32.1168, 'lon': -110.9410},
    'ABQ': {'city': 'Albuquerque', 'country': 'USA', 'name': 'Albuquerque International Sunport', 'lat': 35.0402, 'lon': -106.6092},
    'OKC': {'city': 'Oklahoma City', 'country': 'USA', 'name': 'Will Rogers World', 'lat': 35.3931, 'lon': -97.6007},
    'TUL': {'city': 'Tulsa', 'country': 'USA', 'name': 'Tulsa International', 'lat': 36.1989, 'lon': -95.8881},
    'LHR': {'city': 'London', 'country': 'UK', 'name': 'Heathrow', 'lat': 51.4700, 'lon': -0.4543},
    'LGW': {'city': 'London', 'country': 'UK', 'name': 'Gatwick', 'lat': 51.1537, 'lon': -0.1821},
    'STN': {'city': 'London', 'country': 'UK', 'name': 'Stansted', 'lat': 51.8850, 'lon': 0.2400},
    'LTN': {'city': 'London', 'country': 'UK', 'name': 'Luton', 'lat': 51.8747, 'lon': -0.3683},
    'LCY': {'city': 'London', 'country': 'UK', 'name': 'London City', 'lat': 51.5049, 'lon': 0.0519},
    'MAN': {'city': 'Manchester', 'country': 'UK', 'name': 'Manchester', 'lat': 53.3537, 'lon': -2.2800},
    'BHX': {'city': 'Birmingham', 'country': 'UK', 'name': 'Birmingham', 'lat': 52.4539, 'lon': -1.7443},
    'EDI': {'city': 'Edinburgh', 'country': 'UK', 'name': 'Edinburgh', 'lat': 55.9500, 'lon': -3.3500},
    'GLA': {'city': 'Glasgow', 'country': 'UK', 'name': 'Glasgow', 'lat': 55.8650, 'lon': -4.4300},
    'LPL': {'city': 'Liverpool', 'country': 'UK', 'name': 'Liverpool John Lennon', 'lat': 53.3336, 'lon': -2.8497},
    'BRS': {'city': 'Bristol', 'country': 'UK', 'name': 'Bristol', 'lat': 51.3827, 'lon': -2.5949},
    'NCL': {'city': 'Newcastle', 'country': 'UK', 'name': 'Newcastle', 'lat': 55.0375, 'lon': -1.6115},
    'BFS': {'city': 'Belfast', 'country': 'UK', 'name': 'Belfast International', 'lat': 54.6575, 'lon': -6.2158},
    'CDG': {'city': 'Paris', 'country': 'France', 'name': 'Charles de Gaulle', 'lat': 49.0097, 'lon': 2.5479},
    'ORY': {'city': 'Paris', 'country': 'France', 'name': 'Orly', 'lat': 48.7233, 'lon': 2.3794},
    'NCE': {'city': 'Nice', 'country': 'France', 'name': 'Nice Côte d\'Azur', 'lat': 43.6584, 'lon': 7.2158},
    'LYS': {'city': 'Lyon', 'country': 'France', 'name': 'Lyon-Saint Exupéry', 'lat': 45.7256, 'lon': 5.0811},
    'MRS': {'city': 'Marseille', 'country': 'France', 'name': 'Marseille Provence', 'lat': 43.4367, 'lon': 5.2150},
    'TLS': {'city': 'Toulouse', 'country': 'France', 'name': 'Toulouse-Blagnac', 'lat': 43.6295, 'lon': 1.3638},
    'BDX': {'city': 'Bordeaux', 'country': 'France', 'name': 'Bordeaux-Mérignac', 'lat': 44.8283, 'lon': -0.7153},
    'BER': {'city': 'Berlin', 'country': 'Germany', 'name': 'Berlin Brandenburg', 'lat': 52.3667, 'lon': 13.5033},
    'FRA': {'city': 'Frankfurt', 'country': 'Germany', 'name': 'Frankfurt am Main', 'lat': 50.0379, 'lon': 8.5622},
    'MUC': {'city': 'Munich', 'country': 'Germany', 'name': 'Munich', 'lat': 48.3538, 'lon': 11.7861},
    'HAM': {'city': 'Hamburg', 'country': 'Germany', 'name': 'Hamburg', 'lat': 53.6303, 'lon': 9.9882},
    'DUS': {'city': 'Düsseldorf', 'country': 'Germany', 'name': 'Düsseldorf', 'lat': 51.2784, 'lon': 6.7665},
    'CGN': {'city': 'Cologne', 'country': 'Germany', 'name': 'Cologne Bonn', 'lat': 50.8789, 'lon': 7.0829},
    'STR': {'city': 'Stuttgart', 'country': 'Germany', 'name': 'Stuttgart', 'lat': 48.6899, 'lon': 9.2219},
    'FCO': {'city': 'Rome', 'country': 'Italy', 'name': 'Leonardo da Vinci-Fiumicino', 'lat': 41.8003, 'lon': 12.2389},
    'MXP': {'city': 'Milan', 'country': 'Italy', 'name': 'Malpensa', 'lat': 45.6306, 'lon': 8.7281},
    'LIN': {'city': 'Milan', 'country': 'Italy', 'name': 'Linate', 'lat': 45.4521, 'lon': 9.2767},
    'VCE': {'city': 'Venice', 'country': 'Italy', 'name': 'Venice Marco Polo', 'lat': 45.5053, 'lon': 12.3519},
    'NAP': {'city': 'Naples', 'country': 'Italy', 'name': 'Naples International', 'lat': 40.8862, 'lon': 14.2908},
    'FLR': {'city': 'Florence', 'country': 'Italy', 'name': 'Florence Peretola', 'lat': 43.8098, 'lon': 11.2050},
    'BLQ': {'city': 'Bologna', 'country': 'Italy', 'name': 'Bologna Guglielmo Marconi', 'lat': 44.5305, 'lon': 11.2888},
    'PMO': {'city': 'Palermo', 'country': 'Italy', 'name': 'Palermo Falcone Borsellino', 'lat': 38.1764, 'lon': 13.0910},
    'MAD': {'city': 'Madrid', 'country': 'Spain', 'name': 'Adolfo Suárez Madrid-Barajas', 'lat': 40.4983, 'lon': -3.5676},
    'BCN': {'city': 'Barcelona', 'country': 'Spain', 'name': 'Josep Tarradellas Barcelona-El Prat', 'lat': 41.2974, 'lon': 2.0833},
    'AGP': {'city': 'Malaga', 'country': 'Spain', 'name': 'Málaga-Costa del Sol', 'lat': 36.6752, 'lon': -4.5701},
    'VLC': {'city': 'Valencia', 'country': 'Spain', 'name': 'Valencia', 'lat': 39.4899, 'lon': -0.6246},
    'SVQ': {'city': 'Seville', 'country': 'Spain', 'name': 'Seville', 'lat': 37.4180, 'lon': -5.8931},
    'PMI': {'city': 'Palma de Mallorca', 'country': 'Spain', 'name': 'Palma de Mallorca', 'lat': 39.5517, 'lon': 2.7388},
    'BIO': {'city': 'Bilbao', 'country': 'Spain', 'name': 'Bilbao', 'lat': 43.3014, 'lon': -2.9070},
    'AMS': {'city': 'Amsterdam', 'country': 'Netherlands', 'name': 'Amsterdam Schiphol', 'lat': 52.3105, 'lon': 4.7683},
    'RTM': {'city': 'Rotterdam', 'country': 'Netherlands', 'name': 'Rotterdam The Hague', 'lat': 51.9523, 'lon': 4.4903},
    'ZRH': {'city': 'Zurich', 'country': 'Switzerland', 'name': 'Zurich', 'lat': 47.4647, 'lon': 8.5492},
    'GVA': {'city': 'Geneva', 'country': 'Switzerland', 'name': 'Geneva', 'lat': 46.2381, 'lon': 6.1089},
    'BSL': {'city': 'Basel', 'country': 'Switzerland', 'name': 'EuroAirport Basel-Mulhouse-Freiburg', 'lat': 47.5952, 'lon': 7.5303},
    'VIE': {'city': 'Vienna', 'country': 'Austria', 'name': 'Vienna International', 'lat': 48.1103, 'lon': 16.5697},
    'SZG': {'city': 'Salzburg', 'country': 'Austria', 'name': 'Salzburg', 'lat': 47.7952, 'lon': 13.0036},
    'BRU': {'city': 'Brussels', 'country': 'Belgium', 'name': 'Brussels', 'lat': 50.9014, 'lon': 4.4844},
    'CPH': {'city': 'Copenhagen', 'country': 'Denmark', 'name': 'Copenhagen Kastrup', 'lat': 55.6180, 'lon': 12.6508},
    'ARN': {'city': 'Stockholm', 'country': 'Sweden', 'name': 'Stockholm Arlanda', 'lat': 59.6519, 'lon': 17.9186},
    'OSL': {'city': 'Oslo', 'country': 'Norway', 'name': 'Oslo Gardermoen', 'lat': 60.1939, 'lon': 11.1004},
    'HEL': {'city': 'Helsinki', 'country': 'Finland', 'name': 'Helsinki-Vantaa', 'lat': 60.3172, 'lon': 24.9633},
    'BGO': {'city': 'Bergen', 'country': 'Norway', 'name': 'Bergen Flesland', 'lat': 60.2834, 'lon': 5.2181},
    'GOT': {'city': 'Gothenburg', 'country': 'Sweden', 'name': 'Gothenburg Landvetter', 'lat': 57.6628, 'lon': 12.2788},
    'WAW': {'city': 'Warsaw', 'country': 'Poland', 'name': 'Warsaw Chopin', 'lat': 52.1657, 'lon': 20.9671},
    'KRK': {'city': 'Krakow', 'country': 'Poland', 'name': 'Kraków John Paul II International', 'lat': 50.0777, 'lon': 19.7848},
    'GDN': {'city': 'Gdansk', 'country': 'Poland', 'name': 'Gdańsk Lech Wałęsa', 'lat': 54.3776, 'lon': 18.4662},
    'WRO': {'city': 'Wroclaw', 'country': 'Poland', 'name': 'Wrocław Copernicus', 'lat': 51.1027, 'lon': 16.8858},
    'PRG': {'city': 'Prague', 'country': 'Czech Republic', 'name': 'Václav Havel Prague', 'lat': 50.0758, 'lon': 14.4378},
    'BUD': {'city': 'Budapest', 'country': 'Hungary', 'name': 'Budapest Ferenc Liszt', 'lat': 47.4367, 'lon': 19.2556},
    'ATH': {'city': 'Athens', 'country': 'Greece', 'name': 'Athens International', 'lat': 37.9364, 'lon': 23.9475},
    'IST': {'city': 'Istanbul', 'country': 'Turkey', 'name': 'Istanbul Airport', 'lat': 41.2753, 'lon': 28.7519},
    'AYT': {'city': 'Antalya', 'country': 'Turkey', 'name': 'Antalya', 'lat': 36.9827, 'lon': 30.8014},
    'ADB': {'city': 'Izmir', 'country': 'Turkey', 'name': 'Izmir Adnan Menderes', 'lat': 38.2923, 'lon': 27.1569},
    'JTR': {'city': 'Santorini', 'country': 'Greece', 'name': 'Santorini', 'lat': 36.3992, 'lon': 25.4792},
    'JMK': {'city': 'Mykonos', 'country': 'Greece', 'name': 'Mykonos', 'lat': 37.4352, 'lon': 25.3481},
    'HER': {'city': 'Heraklion', 'country': 'Greece', 'name': 'Heraklion', 'lat': 35.3397, 'lon': 25.1802},
    'NRT': {'city': 'Tokyo', 'country': 'Japan', 'name': 'Narita International', 'lat': 35.7720, 'lon': 140.3929},
    'HND': {'city': 'Tokyo', 'country': 'Japan', 'name': 'Tokyo Haneda', 'lat': 35.5494, 'lon': 139.7798},
    'KIX': {'city': 'Osaka', 'country': 'Japan', 'name': 'Kansai International', 'lat': 34.4273, 'lon': 135.2444},
    'NGO': {'city': 'Nagoya', 'country': 'Japan', 'name': 'Chubu Centrair International', 'lat': 34.8584, 'lon': 136.8131},
    'CTS': {'city': 'Sapporo', 'country': 'Japan', 'name': 'New Chitose', 'lat': 42.7752, 'lon': 141.6922},
    'FUK': {'city': 'Fukuoka', 'country': 'Japan', 'name': 'Fukuoka', 'lat': 33.5859, 'lon': 130.4466},
    'OKA': {'city': 'Okinawa', 'country': 'Japan', 'name': 'Naha', 'lat': 26.1958, 'lon': 127.6458},
    'PEK': {'city': 'Beijing', 'country': 'China', 'name': 'Beijing Capital International', 'lat': 40.0799, 'lon': 116.6031},
    'PVG': {'city': 'Shanghai', 'country': 'China', 'name': 'Shanghai Pudong International', 'lat': 31.1443, 'lon': 121.8083},
    'SHA': {'city': 'Shanghai', 'country': 'China', 'name': 'Shanghai Hongqiao', 'lat': 31.1439, 'lon': 121.8052},
    'HKG': {'city': 'Hong Kong', 'country': 'China', 'name': 'Hong Kong International', 'lat': 22.3080, 'lon': 113.9185},
    'CAN': {'city': 'Guangzhou', 'country': 'China', 'name': 'Guangzhou Baiyun International', 'lat': 23.3924, 'lon': 113.2988},
    'SZX': {'city': 'Shenzhen', 'country': 'China', 'name': 'Shenzhen Bao\'an International', 'lat': 22.6393, 'lon': 113.8108},
    'CTU': {'city': 'Chengdu', 'country': 'China', 'name': 'Chengdu Tianfu International', 'lat': 30.3135, 'lon': 104.0538},
    'XIY': {'city': 'Xi\'an', 'country': 'China', 'name': 'Xi\'an Xianyang International', 'lat': 34.4317, 'lon': 108.7516},
    'SIN': {'city': 'Singapore', 'country': 'Singapore', 'name': 'Singapore Changi', 'lat': 1.3644, 'lon': 103.9915},
    'BKK': {'city': 'Bangkok', 'country': 'Thailand', 'name': 'Suvarnabhumi', 'lat': 13.6900, 'lon': 100.7501},
    'HKT': {'city': 'Phuket', 'country': 'Thailand', 'name': 'Phuket International', 'lat': 8.1119, 'lon': 98.3169},
    'KUL': {'city': 'Kuala Lumpur', 'country': 'Malaysia', 'name': 'Kuala Lumpur International', 'lat': 2.7456, 'lon': 101.7099},
    'CGK': {'city': 'Jakarta', 'country': 'Indonesia', 'name': 'Soekarno-Hatta International', 'lat': -6.1256, 'lon': 106.6559},
    'DPS': {'city': 'Bali', 'country': 'Indonesia', 'name': 'Ngurah Rai International', 'lat': -8.7472, 'lon': 115.1671},
    'MNL': {'city': 'Manila', 'country': 'Philippines', 'name': 'Ninoy Aquino International', 'lat': 14.5086, 'lon': 121.0194},
    'ICN': {'city': 'Seoul', 'country': 'South Korea', 'name': 'Incheon International', 'lat': 37.4602, 'lon': 126.4407},
    'GMP': {'city': 'Seoul', 'country': 'South Korea', 'name': 'Gimpo International', 'lat': 37.5588, 'lon': 126.7906},
    'TPE': {'city': 'Taipei', 'country': 'Taiwan', 'name': 'Taiwan Taoyuan International', 'lat': 25.0797, 'lon': 121.2342},
    'DEL': {'city': 'Delhi', 'country': 'India', 'name': 'Indira Gandhi International', 'lat': 28.5562, 'lon': 77.1000},
    'BOM': {'city': 'Mumbai', 'country': 'India', 'name': 'Chhatrapati Shivaji Maharaj International', 'lat': 19.0896, 'lon': 72.8656},
    'BLR': {'city': 'Bangalore', 'country': 'India', 'name': 'Kempegowda International', 'lat': 13.1979, 'lon': 77.7063},
    'MAA': {'city': 'Chennai', 'country': 'India', 'name': 'Chennai International', 'lat': 12.9944, 'lon': 80.1709},
    'CCU': {'city': 'Kolkata', 'country': 'India', 'name': 'Netaji Subhas Chandra Bose International', 'lat': 22.6556, 'lon': 88.4468},
    'HYD': {'city': 'Hyderabad', 'country': 'India', 'name': 'Rajiv Gandhi International', 'lat': 17.2403, 'lon': 78.4294},
    'GOI': {'city': 'Goa', 'country': 'India', 'name': 'Goa International', 'lat': 15.3808, 'lon': 73.8372},
    'DXB': {'city': 'Dubai', 'country': 'UAE', 'name': 'Dubai International', 'lat': 25.2532, 'lon': 55.3657},
    'AUH': {'city': 'Abu Dhabi', 'country': 'UAE', 'name': 'Abu Dhabi International', 'lat': 24.4330, 'lon': 54.6511},
    'DOH': {'city': 'Doha', 'country': 'Qatar', 'name': 'Hamad International', 'lat': 25.2609, 'lon': 51.6138},
    'KWI': {'city': 'Kuwait', 'country': 'Kuwait', 'name': 'Kuwait International', 'lat': 29.2266, 'lon': 47.9789},
    'RUH': {'city': 'Riyadh', 'country': 'Saudi Arabia', 'name': 'King Khalid International', 'lat': 24.9576, 'lon': 46.6988},
    'JED': {'city': 'Jeddah', 'country': 'Saudi Arabia', 'name': 'King Abdulaziz International', 'lat': 21.6796, 'lon': 39.1565},
    'MCT': {'city': 'Muscat', 'country': 'Oman', 'name': 'Muscat International', 'lat': 23.5933, 'lon': 58.2883},
    'BAH': {'city': 'Bahrain', 'country': 'Bahrain', 'name': 'Bahrain International', 'lat': 26.2708, 'lon': 50.6339},
    'CAI': {'city': 'Cairo', 'country': 'Egypt', 'name': 'Cairo International', 'lat': 30.1219, 'lon': 31.4056},
    'JNB': {'city': 'Johannesburg', 'country': 'South Africa', 'name': 'O.R. Tambo International', 'lat': -26.1367, 'lon': 28.2411},
    'CPT': {'city': 'Cape Town', 'country': 'South Africa', 'name': 'Cape Town International', 'lat': -33.9715, 'lon': 18.6021},
    'DUR': {'city': 'Durban', 'country': 'South Africa', 'name': 'King Shaka International', 'lat': -29.6144, 'lon': 31.1199},
    'LOS': {'city': 'Lagos', 'country': 'Nigeria', 'name': 'Murtala Muhammed International', 'lat': 6.5774, 'lon': 3.3213},
    'NBO': {'city': 'Nairobi', 'country': 'Kenya', 'name': 'Jomo Kenyatta International', 'lat': -1.3192, 'lon': 36.9278},
    'ADD': {'city': 'Addis Ababa', 'country': 'Ethiopia', 'name': 'Addis Ababa Bole International', 'lat': 8.9779, 'lon': 38.7993},
    'CMN': {'city': 'Casablanca', 'country': 'Morocco', 'name': 'Mohammed V International', 'lat': 33.3674, 'lon': -7.5860},
    'RAK': {'city': 'Marrakech', 'country': 'Morocco', 'name': 'Marrakech Menara', 'lat': 31.6069, 'lon': -8.0363},
    'TUN': {'city': 'Tunis', 'country': 'Tunisia', 'name': 'Tunis–Carthage International', 'lat': 36.8510, 'lon': 10.2272},
    'SYD': {'city': 'Sydney', 'country': 'Australia', 'name': 'Sydney Kingsford Smith', 'lat': -33.9399, 'lon': 151.1753},
    'MEL': {'city': 'Melbourne', 'country': 'Australia', 'name': 'Melbourne Airport', 'lat': -37.6690, 'lon': 144.8410},
    'BNE': {'city': 'Brisbane', 'country': 'Australia', 'name': 'Brisbane', 'lat': -27.3942, 'lon': 153.1218},
    'PER': {'city': 'Perth', 'country': 'Australia', 'name': 'Perth', 'lat': -31.9403, 'lon': 115.9672},
    'ADL': {'city': 'Adelaide', 'country': 'Australia', 'name': 'Adelaide', 'lat': -34.9450, 'lon': 138.5306},
    'OOL': {'city': 'Gold Coast', 'country': 'Australia', 'name': 'Gold Coast', 'lat': -28.1644, 'lon': 153.5053},
    'AKL': {'city': 'Auckland', 'country': 'New Zealand', 'name': 'Auckland', 'lat': -37.0082, 'lon': 174.7850},
    'WLG': {'city': 'Wellington', 'country': 'New Zealand', 'name': 'Wellington', 'lat': -41.3272, 'lon': 174.8050},
    'CHC': {'city': 'Christchurch', 'country': 'New Zealand', 'name': 'Christchurch', 'lat': -43.4861, 'lon': 172.5362},
    'ZQN': {'city': 'Queenstown', 'country': 'New Zealand', 'name': 'Queenstown', 'lat': -45.0210, 'lon': 168.7428},
    'YYZ': {'city': 'Toronto', 'country': 'Canada', 'name': 'Toronto Pearson International', 'lat': 43.6777, 'lon': -79.6248},
    'YUL': {'city': 'Montreal', 'country': 'Canada', 'name': 'Montréal-Pierre Elliott Trudeau', 'lat': 45.4706, 'lon': -73.7407},
    'YVR': {'city': 'Vancouver', 'country': 'Canada', 'name': 'Vancouver International', 'lat': 49.1967, 'lon': -123.1815},
    'YYC': {'city': 'Calgary', 'country': 'Canada', 'name': 'Calgary International', 'lat': 51.1215, 'lon': -114.0073},
    'YEG': {'city': 'Edmonton', 'country': 'Canada', 'name': 'Edmonton International', 'lat': 53.3097, 'lon': -113.5801},
    'YOW': {'city': 'Ottawa', 'country': 'Canada', 'name': 'Ottawa Macdonald–Cartier International', 'lat': 45.3225, 'lon': -75.6690},
    'YWG': {'city': 'Winnipeg', 'country': 'Canada', 'name': 'Winnipeg James Armstrong Richardson International', 'lat': 49.9096, 'lon': -97.2399},
    'YQB': {'city': 'Quebec City', 'country': 'Canada', 'name': 'Québec City Jean Lesage International', 'lat': 46.7914, 'lon': -71.3915},
    'YHZ': {'city': 'Halifax', 'country': 'Canada', 'name': 'Halifax Stanfield International', 'lat': 44.8838, 'lon': -63.5086},
    'YYJ': {'city': 'Victoria', 'country': 'Canada', 'name': 'Victoria International', 'lat': 48.6469, 'lon': -123.4257},
    'MEX': {'city': 'Mexico City', 'country': 'Mexico', 'name': 'Benito Juárez International', 'lat': 19.4361, 'lon': -99.0719},
    'CUN': {'city': 'Cancun', 'country': 'Mexico', 'name': 'Cancún International', 'lat': 21.0405, 'lon': -86.6670},
    'GDL': {'city': 'Guadalajara', 'country': 'Mexico', 'name': 'Guadalajara Miguel Hidalgo y Costilla International', 'lat': 20.5218, 'lon': -103.3114},
    'PVR': {'city': 'Puerto Vallarta', 'country': 'Mexico', 'name': 'Licenciado Gustavo Díaz Ordaz International', 'lat': 20.6809, 'lon': -105.2544},
    'SJD': {'city': 'Los Cabos', 'country': 'Mexico', 'name': 'Los Cabos International', 'lat': 23.1577, 'lon': -109.7218},
    'MTY': {'city': 'Monterrey', 'country': 'Mexico', 'name': 'Monterrey Mariano Escobedo International', 'lat': 25.7785, 'lon': -100.1069},
    'PTY': {'city': 'Panama City', 'country': 'Panama', 'name': 'Tocumen International', 'lat': 9.0714, 'lon': -79.4014},
    'SJO': {'city': 'San José', 'country': 'Costa Rica', 'name': 'Juan Santamaría International', 'lat': 9.9935, 'lon': -84.2088},
    'GUA': {'city': 'Guatemala City', 'country': 'Guatemala', 'name': 'La Aurora International', 'lat': 14.5833, 'lon': -90.5275},
    'GIG': {'city': 'Rio de Janeiro', 'country': 'Brazil', 'name': 'Rio de Janeiro/Galeão International', 'lat': -22.8099, 'lon': -43.2505},
    'GRU': {'city': 'São Paulo', 'country': 'Brazil', 'name': 'São Paulo/Guarulhos International', 'lat': -23.4356, 'lon': -46.4731},
    'EZE': {'city': 'Buenos Aires', 'country': 'Argentina', 'name': 'Ministro Pistarini International', 'lat': -34.8222, 'lon': -58.5358},
    'AEP': {'city': 'Buenos Aires', 'country': 'Argentina', 'name': 'Jorge Newbery Airfield', 'lat': -34.5592, 'lon': -58.4156},
    'LIM': {'city': 'Lima', 'country': 'Peru', 'name': 'Jorge Chávez International', 'lat': -12.0219, 'lon': -77.1143},
    'SCL': {'city': 'Santiago', 'country': 'Chile', 'name': 'Arturo Merino Benítez International', 'lat': -33.3930, 'lon': -70.7858},
    'BOG': {'city': 'Bogota', 'country': 'Colombia', 'name': 'El Dorado International', 'lat': 4.7016, 'lon': -74.1469},
    'MDE': {'city': 'Medellin', 'country': 'Colombia', 'name': 'José María Córdova International', 'lat': 6.1645, 'lon': -75.4271},
    'CTG': {'city': 'Cartagena', 'country': 'Colombia', 'name': 'Rafael Núñez International', 'lat': 10.4424, 'lon': -75.5130},
    'UIO': {'city': 'Quito', 'country': 'Ecuador', 'name': 'Mariscal Sucre International', 'lat': -0.1412, 'lon': -78.4882},
    'CCS': {'city': 'Caracas', 'country': 'Venezuela', 'name': 'Simón Bolívar International', 'lat': 10.6032, 'lon': -66.9906},
    'MVD': {'city': 'Montevideo', 'country': 'Uruguay', 'name': 'Carrasco International', 'lat': -34.8384, 'lon': -56.0308},
    'ASU': {'city': 'Asuncion', 'country': 'Paraguay', 'name': 'Silvio Pettirossi International', 'lat': -25.2396, 'lon': -57.5200},
    'LPB': {'city': 'La Paz', 'country': 'Bolivia', 'name': 'El Alto International', 'lat': -16.5134, 'lon': -68.1923},
    'LIS': {'city': 'Lisbon', 'country': 'Portugal', 'name': 'Humberto Delgado', 'lat': 38.7742, 'lon': -9.1342},
    'OPO': {'city': 'Porto', 'country': 'Portugal', 'name': 'Francisco de Sá Carneiro', 'lat': 41.2482, 'lon': -8.6732},
    'DUB': {'city': 'Dublin', 'country': 'Ireland', 'name': 'Dublin', 'lat': 53.4264, 'lon': -6.2499},
    'ORK': {'city': 'Cork', 'country': 'Ireland', 'name': 'Cork', 'lat': 51.8492, 'lon': -8.4861},
}


def get_airport_info(iata_code):
    """
    Get detailed airport information from IATA code.
    """
    if not iata_code:
        return None
    
    normalized = str(iata_code).strip().upper()
    return IATA_INFO.get(normalized)


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates using Haversine formula.
    """
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2) * math.sin(delta_lat/2) + \
        math.cos(lat1_rad) * math.cos(lat2_rad) * \
        math.sin(delta_lon/2) * math.sin(delta_lon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c


def find_nearby_airports(latitude, longitude, limit=5, max_distance=500):
    """
    Find nearby airports based on GPS coordinates.
    """
    if not latitude or not longitude:
        return []
    
    airports_with_distance = []
    
    for iata_code, airport_info in IATA_INFO.items():
        if 'lat' in airport_info and 'lon' in airport_info:
            distance = calculate_distance(
                latitude, longitude,
                airport_info['lat'], airport_info['lon']
            )
            
            if distance <= max_distance:
                airports_with_distance.append({
                    'iataCode': iata_code,
                    'name': airport_info.get('name', ''),
                    'city': airport_info.get('city', ''),
                    'country': airport_info.get('country', ''),
                    'distance': round(distance, 1),
                    'lat': airport_info['lat'],
                    'lon': airport_info['lon']
                })
    
    airports_with_distance.sort(key=lambda x: x['distance'])
    return airports_with_distance[:limit]


def get_nearest_airport(latitude, longitude):
    """
    Get the nearest airport to the given coordinates.
    """
    nearby = find_nearby_airports(latitude, longitude, limit=1)
    return nearby[0] if nearby else None

