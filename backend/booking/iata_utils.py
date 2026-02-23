"""
Comprehensive IATA Airport Code Mapping Utility

This module provides comprehensive city-to-IATA and IATA-to-city mappings
for flight search functionality. It covers major airports worldwide.
"""

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
    
    # Hawaii
    'honolulu': 'HNL', 'hnl': 'HNL',
    'kailua': 'HNL',
    'lihue': 'LIH', 'kahului': 'OGG', 'kona': 'KOA',
    
    # United Kingdom
    'london': 'LHR', 'london heathrow': 'LHR', 'lhr': 'LHR',
    'london gatwick': 'LGW', 'lgw': 'LGW',
    'london stansted': 'STN', 'stansted': 'STN',
    'london luton': 'LTN', 'luton': 'LTN',
    'london city': 'LCY', 'city airport': 'LCY',
    'manchester': 'MAN', 'man': 'MAN',
    'birmingham': 'BHX', 'bhx': 'BHX',
    'edinburgh': 'EDI', 'edi': 'EDI',
    'glasgow': 'GLA', 'gla': 'GLA',
    'liverpool': 'LPL', 'lpl': 'LPL',
    'bristol': 'BRS', 'brs': 'BRS',
    'newcastle': 'NCL', 'ncl': 'NCL',
    'belfast': 'BFS', 'bfs': 'BFS',
    
    # France
    'paris': 'CDG', 'paris charles de gaulle': 'CDG', 'cdg': 'CDG',
    'paris orly': 'ORY', 'ory': 'ORY',
    'nice': 'NCE', 'nce': 'NCE',
    'lyon': 'LYS', 'lys': 'LYS',
    'marseille': 'MRS', 'mrs': 'MRS',
    'toulouse': 'TLS', 'tls': 'TLS',
    'bordeaux': 'BDX', 'bdx': 'BDX',
    
    # Germany
    'berlin': 'BER', 'ber': 'BER',
    'frankfurt': 'FRA', 'fra': 'FRA',
    'munich': 'MUC', 'muc': 'MUC',
    'hamburg': 'HAM', 'ham': 'HAM',
    'dusseldorf': 'DUS', 'dus': 'DUS',
    'cologne': 'CGN', 'cgn': 'CGN',
    'stuttgart': 'STR', 'str': 'STR',
    
    # Italy
    'rome': 'FCO', 'fco': 'FCO', 'rome fiumicino': 'FCO',
    'milan': 'MXP', 'milan malpensa': 'MXP', 'mxp': 'MXP',
    'milan linate': 'LIN', 'lin': 'LIN',
    'venice': 'VCE', 'vce': 'VCE',
    'naples': 'NAP', 'nap': 'NAP',
    'florence': 'FLR', 'flr': 'FLR',
    'bologna': 'BLQ', 'blq': 'BLQ',
    'palermo': 'PMO', 'pmo': 'PMO',
    
    # Spain
    'madrid': 'MAD', 'mad': 'MAD',
    'barcelona': 'BCN', 'bcn': 'BCN',
    'valencia': 'VLC', 'vlc': 'VLC',
    'seville': 'SVQ', 'svq': 'SVQ',
    'malaga': 'AGP', 'agp': 'AGP',
    'bilbao': 'BIO', 'bio': 'BIO',
    'palma de mallorca': 'PMI', 'pbi': 'PMI',
    
    # Netherlands
    'amsterdam': 'AMS', 'ams': 'AMS',
    'rotterdam': 'RTM', 'rtm': 'RTM',
    
    # Switzerland
    'zurich': 'ZRH', 'zrh': 'ZRH',
    'geneva': 'GVA', 'gva': 'GVA',
    'basel': 'BSL', 'bsl': 'BSL',
    
    # Austria
    'vienna': 'VIE', 'vie': 'VIE',
    'salzburg': 'SZG', 'szg': 'SZG',
    
    # Belgium
    'brussels': 'BRU', 'bru': 'BRU',
    
    # Scandinavia
    'copenhagen': 'CPH', 'cph': 'CPH',
    'stockholm': 'ARN', 'arn': 'ARN',
    'oslo': 'OSL', 'osl': 'OSL',
    'helsinki': 'HEL', 'hel': 'HEL',
    'bergen': 'BGO', 'bgo': 'BGO',
    'gothenburg': 'GOT', 'got': 'GOT',
    
    # Eastern Europe
    'warsaw': 'WAW', 'waw': 'WAW',
    'prague': 'PRG', 'prg': 'PRG',
    'budapest': 'BUD', 'bud': 'BUD',
    'bucharest': 'OTP', 'otp': 'OTP',
    'sofia': 'SOF', 'sof': 'SOF',
    'athens': 'ATH', 'ath': 'ATH',
    'istanbul': 'IST', 'ist': 'IST',
    'moscow': 'SVO', 'svo': 'SVO',
    'saint petersburg': 'LED', 'led': 'LED',
    'kiev': 'KBP', 'kbp': 'KBP',
    'moscow sheremetyevo': 'SVO',
    'moscow domodedovo': 'DME',
    
    # Asia - Japan
    'tokyo': 'NRT', 'tokyo narita': 'NRT', 'nrt': 'NRT',
    'tokyo haneda': 'HND', 'hnd': 'HND',
    'osaka': 'KIX', 'kix': 'KIX',
    'kyoto': 'KIX',
    'yokohama': 'HND',
    'nagoya': 'NGO', 'ngo': 'NGO',
    'sapporo': 'CTS', 'cts': 'CTS',
    'fukuoka': 'FUK', 'fuk': 'FUK',
    'kobe': 'UKB', 'ukb': 'UKB',
    'okinawa': 'OKA', 'oka': 'OKA',
    
    # Asia - China
    'beijing': 'PEK', 'pek': 'PEK',
    'shanghai': 'PVG', 'pvg': 'PVG',
    'shanghai pudong': 'PVG',
    'hong kong': 'HKG', 'hkg': 'HKG',
    'guangzhou': 'CAN', 'can': 'CAN',
    'shenzhen': 'SZX', 'szx': 'SZX',
    'chengdu': 'CTU', 'ctu': 'CTU',
    'xian': 'XIY', 'xiy': 'XIY',
    'beijing capital': 'PEK',
    'shanghai hongqiao': 'SHA',
    
    # Asia - Southeast Asia
    'singapore': 'SIN', 'sin': 'SIN',
    'bangkok': 'BKK', 'bkk': 'BKK',
    'bangkok suvarnabhumi': 'BKK',
    'phuket': 'HKT', 'hkt': 'HKT',
    'kuala lumpur': 'KUL', 'kul': 'KUL',
    'jakarta': 'CGK', 'cgk': 'CGK',
    'bali': 'DPS', 'dps': 'DPS',
    'denpasar': 'DPS',
    'manila': 'MNL', 'mnl': 'MNL',
    'ho chi minh city': 'SGN', 'sgn': 'SGN',
    'saigon': 'SGN',
    'hanoi': 'HAN', 'han': 'HAN',
    'phnom penh': 'PNH', 'pnh': 'PNH',
    'siem reap': 'SAI', 'sai': 'SAI',
    'yangon': 'RGN', 'rgn': 'RGN',
    
    # Asia - South Korea & Taiwan
    'seoul': 'ICN', 'icn': 'ICN',
    'seoul incheon': 'ICN',
    'busan': 'PUS', 'pus': 'PUS',
    'taipei': 'TPE', 'tpe': 'TPE',
    'taichung': 'RMQ', 'rmq': 'RMQ',
    'kaohsiung': 'KHH', 'khh': 'KHH',
    
    # Asia - India & Middle East
    'delhi': 'DEL', 'del': 'DEL',
    'mumbai': 'BOM', 'bom': 'BOM',
    'bangalore': 'BLR', 'blr': 'BLR',
    'chennai': 'MAA', 'maa': 'MAA',
    'kolkata': 'CCU', 'ccu': 'CCU',
    'hyderabad': 'HYD', 'hyd': 'HYD',
    'dubai': 'DXB', 'dxb': 'DXB',
    'abu dhabi': 'AUH', 'auh': 'AUH',
    'doha': 'DOH', 'doh': 'DOH',
    'kuwait': 'KWI', 'kwi': 'KWI',
    'riyadh': 'RUH', 'ruh': 'RUH',
    'jeddah': 'JED', 'jed': 'JED',
    'muscat': 'MCT', 'mct': 'MCT',
    'bahrain': 'BAH', 'bah': 'BAH',
    
    # Africa
    'cairo': 'CAI', 'cai': 'CAI',
    'johannesburg': 'JNB', 'jnb': 'JNB',
    'cape town': 'CPT', 'cpt': 'CPT',
    'durban': 'DUR', 'dur': 'DUR',
    'lagos': 'LOS', 'los': 'LOS',
    'nairobi': 'NBO', 'nbo': 'NBO',
    'addis ababa': 'ADD', 'add': 'ADD',
    'casablanca': 'CMN', 'cmn': 'CMN',
    'marrakech': 'RAK', 'rak': 'RAK',
    'tunis': 'TUN', 'tun': 'TUN',
    'algiers': 'ALG', 'alg': 'ALG',
    
    # Australia & New Zealand
    'sydney': 'SYD', 'syd': 'SYD',
    'melbourne': 'MEL', 'mel': 'MEL',
    'brisbane': 'BNE', 'bne': 'BNE',
    'perth': 'PER', 'per': 'PER',
    'adelaide': 'ADL', 'adl': 'ADL',
    'gold coast': 'OOL', 'ool': 'OOL',
    'auckland': 'AKL', 'akl': 'AKL',
    'wellington': 'WLG', 'wlg': 'WLG',
    'christchurch': 'CHC', 'chc': 'CHC',
    'queenstown': 'ZQN', 'zqn': 'ZQN',
    
    # Canada
    'toronto': 'YYZ', 'yyz': 'YYZ',
    'toronto pearson': 'YYZ',
    'montreal': 'YUL', 'yul': 'YUL',
    'vancouver': 'YVR', 'yvr': 'YVR',
    'calgary': 'YYC', 'yyc': 'YYC',
    'edmonton': 'YEG', 'yeg': 'YEG',
    'ottawa': 'YOW', 'yow': 'YOW',
    'winnipeg': 'YWG', 'ywg': 'YWG',
    'quebec city': 'YQB', 'yqb': 'YQB',
    'halifax': 'YHZ', 'yhz': 'YHZ',
    'victoria': 'YYJ', 'yyj': 'YYJ',
    
    # Mexico & Caribbean
    'mexico city': 'MEX', 'mex': 'MEX',
    'cancun': 'CUN', 'cun': 'CUN',
    'guadalajara': 'GDL', 'gdl': 'GDL',
    'puerto vallarta': 'PVR', 'pvr': 'PVR',
    'los cabos': 'SJD', 'sjd': 'SJD',
    'monterrey': 'MTY', 'mty': 'MTY',
    
    # Central America
    'panama city': 'PTY', 'pty': 'PTY',
    'san jose': 'SJO', 'sjo': 'SJO',
    'guatemala city': 'GUA', 'gua': 'GUA',
    
    # South America
    'rio de janeiro': 'GIG', 'gig': 'GIG',
    'sao paulo': 'GRU', 'gru': 'GRU',
    'buenos aires': 'EZE', 'eze': 'EZE',
    'buenos aires Ministro Pistarini': 'EZE',
    'lima': 'LIM', 'lim': 'LIM',
    'santiago': 'SCL', 'scl': 'SCL',
    'bogota': 'BOG', 'bog': 'BOG',
    'medellin': 'MDE', 'mde': 'MDE',
    'cartagena': 'CTG', 'ctg': 'CTG',
    'quito': 'UIO', 'uio': 'UIO',
    'caracas': 'CCS', 'ccs': 'CCS',
    'montevideo': 'MVD', 'mvd': 'MVD',
    'asuncion': 'ASU', 'asu': 'ASU',
    'la paz': 'LPB', 'lpb': 'LPB',
    
    # Portugal & Ireland
    'lisbon': 'LIS', 'lis': 'LIS',
    'porto': 'OPO', 'opo': 'OPO',
    'dublin': 'DUB', 'dub': 'DUB',
    'cork': 'ORK', 'ork': 'ORK',
    
    # Greece & Turkey
    'athens': 'ATH', 'ath': 'ATH',
    'santorini': 'JTR', 'jtr': 'JTR',
    'mykonos': 'JMK', 'jmk': 'JMK',
    'heraklion': 'HER', 'her': 'HER',
    'istanbul': 'IST', 'ist': 'IST',
    'istanbul airport': 'IST',
    'antalya': 'AYT', 'ayt': 'AYT',
    'izmir': 'ADB', 'adb': 'ADB',
    
    # Poland & Nordic
    'warsaw': 'WAW', 'waw': 'WAW',
    'krakow': 'KRK', 'krk': 'KRK',
    'gdansk': 'GDN', 'gdn': 'GDN',
    'wroclaw': 'WRO', 'wro': 'WRO',
}


def get_iata_code(city_name):
    """
    Convert city name to IATA code.
    
    Args:
        city_name (str): City name or IATA code
        
    Returns:
        str: IATA code or None if not found
    """
    if not city_name:
        return None
    
    # First check if input is already a valid IATA code (3 uppercase letters)
    normalized = str(city_name).strip().upper()
    if len(normalized) == 3 and normalized.isalpha():
        return normalized
    
    # Try to find in mapping (case-insensitive)
    normalized_lower = str(city_name).strip().lower()
    
    # Direct match
    if normalized_lower in CITY_TO_IATA:
        return CITY_TO_IATA[normalized_lower]
    
    # Try with "international" suffix removed
    if 'international' in normalized_lower:
        city_without_intl = normalized_lower.replace(' international', '').strip()
        if city_without_intl in CITY_TO_IATA:
            return CITY_TO_IATA[city_without_intl]
    
    return None


def get_city_from_iata(iata_code):
    """
    Convert IATA code to city name.
    
    Args:
        iata_code (str): IATA code
        
    Returns:
        str: City name or None if not found
    """
    if not iata_code:
        return None
    
    # Create reverse mapping on first call
    if not hasattr(get_city_from_iata, '_reverse_map'):
        get_city_from_iata._reverse_map = {v: k.title() for k, v in CITY_TO_IATA.items()}
    
    normalized = str(iata_code).strip().upper()
    return get_city_from_iata._reverse_map.get(normalized)


def is_valid_iata(iata_code):
    """
    Check if a string is a valid IATA code.
    
    Args:
        iata_code (str): String to check
        
    Returns:
        bool: True if valid IATA code format
    """
    if not iata_code:
        return False
    
    normalized = str(iata_code).strip().upper()
    return len(normalized) == 3 and normalized.isalpha()


# Comprehensive IATA to city/airport name mapping
IATA_INFO = {
    'JFK': {'city': 'New York', 'country': 'USA', 'name': 'John F. Kennedy International'},
    'LAX': {'city': 'Los Angeles', 'country': 'USA', 'name': 'Los Angeles International'},
    'ORD': {'city': 'Chicago', 'country': 'USA', 'name': "O'Hare International"},
    'MIA': {'city': 'Miami', 'country': 'USA', 'name': 'Miami International'},
    'SFO': {'city': 'San Francisco', 'country': 'USA', 'name': 'San Francisco International'},
    'DFW': {'city': 'Dallas', 'country': 'USA', 'name': 'Dallas/Fort Worth International'},
    'ATL': {'city': 'Atlanta', 'country': 'USA', 'name': 'Hartsfield-Jackson Atlanta International'},
    'DEN': {'city': 'Denver', 'country': 'USA', 'name': 'Denver International'},
    'SEA': {'city': 'Seattle', 'country': 'USA', 'name': 'Seattle-Tacoma International'},
    'BOS': {'city': 'Boston', 'country': 'USA', 'name': 'Logan International'},
    'LAS': {'city': 'Las Vegas', 'country': 'USA', 'name': 'Harry Reid International'},
    'PHX': {'city': 'Phoenix', 'country': 'USA', 'name': 'Phoenix Sky Harbor International'},
    'IAH': {'city': 'Houston', 'country': 'USA', 'name': 'George Bush Intercontinental'},
    'DCA': {'city': 'Washington', 'country': 'USA', 'name': 'Ronald Reagan Washington National'},
    'MCO': {'city': 'Orlando', 'country': 'USA', 'name': 'Orlando International'},
    'CLT': {'city': 'Charlotte', 'country': 'USA', 'name': 'Charlotte Douglas International'},
    'SLC': {'city': 'Salt Lake City', 'country': 'USA', 'name': 'Salt Lake City International'},
    'DTW': {'city': 'Detroit', 'country': 'USA', 'name': 'Detroit Metropolitan Wayne County'},
    'MSP': {'city': 'Minneapolis', 'country': 'USA', 'name': 'Minneapolis-St Paul International'},
    'TPA': {'city': 'Tampa', 'country': 'USA', 'name': 'Tampa International'},
    'PHL': {'city': 'Philadelphia', 'country': 'USA', 'name': 'Philadelphia International'},
    'EWR': {'city': 'Newark', 'country': 'USA', 'name': 'Newark Liberty International'},
    'PDX': {'city': 'Portland', 'country': 'USA', 'name': 'Portland International'},
    'SAN': {'city': 'San Diego', 'country': 'USA', 'name': 'San Diego International'},
    'AUS': {'city': 'Austin', 'country': 'USA', 'name': 'Austin-Bergstrom International'},
    'BNA': {'city': 'Nashville', 'country': 'USA', 'name': 'Nashville International'},
    'BWI': {'city': 'Baltimore', 'country': 'USA', 'name': 'Baltimore/Washington International'},
    'FLL': {'city': 'Fort Lauderdale', 'country': 'USA', 'name': 'Fort Lauderdale-Hollywood International'},
    'HNL': {'city': 'Honolulu', 'country': 'USA', 'name': 'Daniel K. Inouye International'},
    'LHR': {'city': 'London', 'country': 'UK', 'name': 'Heathrow'},
    'LGW': {'city': 'London', 'country': 'UK', 'name': 'Gatwick'},
    'STN': {'city': 'London', 'country': 'UK', 'name': 'Stansted'},
    'LTN': {'city': 'London', 'country': 'UK', 'name': 'Luton'},
    'LCY': {'city': 'London', 'country': 'UK', 'name': 'London City'},
    'MAN': {'city': 'Manchester', 'country': 'UK', 'name': 'Manchester'},
    'BHX': {'city': 'Birmingham', 'country': 'UK', 'name': 'Birmingham'},
    'EDI': {'city': 'Edinburgh', 'country': 'UK', 'name': 'Edinburgh'},
    'GLA': {'city': 'Glasgow', 'country': 'UK', 'name': 'Glasgow'},
    'CDG': {'city': 'Paris', 'country': 'France', 'name': 'Charles de Gaulle'},
    'ORY': {'city': 'Paris', 'country': 'France', 'name': 'Orly'},
    'NCE': {'city': 'Nice', 'country': 'France', 'name': 'Nice Côte d\'Azur'},
    'LYS': {'city': 'Lyon', 'country': 'France', 'name': 'Lyon-Saint Exupéry'},
    'MRS': {'city': 'Marseille', 'country': 'France', 'name': 'Marseille Provence'},
    'BER': {'city': 'Berlin', 'country': 'Germany', 'name': 'Berlin Brandenburg'},
    'FRA': {'city': 'Frankfurt', 'country': 'Germany', 'name': 'Frankfurt am Main'},
    'MUC': {'city': 'Munich', 'country': 'Germany', 'name': 'Munich'},
    'HAM': {'city': 'Hamburg', 'country': 'Germany', 'name': 'Hamburg'},
    'DUS': {'city': 'Düsseldorf', 'country': 'Germany', 'name': 'Düsseldorf'},
    'FCO': {'city': 'Rome', 'country': 'Italy', 'name': 'Leonardo da Vinci-Fiumicino'},
    'MXP': {'city': 'Milan', 'country': 'Italy', 'name': 'Malpensa'},
    'LIN': {'city': 'Milan', 'country': 'Italy', 'name': 'Linate'},
    'VCE': {'city': 'Venice', 'country': 'Italy', 'name': 'Venice Marco Polo'},
    'NAP': {'city': 'Naples', 'country': 'Italy', 'name': 'Naples International'},
    'FLR': {'city': 'Florence', 'country': 'Italy', 'name': 'Florence Peretola'},
    'MAD': {'city': 'Madrid', 'country': 'Spain', 'name': 'Adolfo Suárez Madrid-Barajas'},
    'BCN': {'city': 'Barcelona', 'country': 'Spain', 'name': 'Josep Tarradellas Barcelona-El Prat'},
    'AGP': {'city': 'Malaga', 'country': 'Spain', 'name': 'Málaga-Costa del Sol'},
    'AMS': {'city': 'Amsterdam', 'country': 'Netherlands', 'name': 'Amsterdam Schiphol'},
    'ZRH': {'city': 'Zurich', 'country': 'Switzerland', 'name': 'Zurich'},
    'GVA': {'city': 'Geneva', 'country': 'Switzerland', 'name': 'Geneva'},
    'VIE': {'city': 'Vienna', 'country': 'Austria', 'name': 'Vienna International'},
    'BRU': {'city': 'Brussels', 'country': 'Belgium', 'name': 'Brussels'},
    'CPH': {'city': 'Copenhagen', 'country': 'Denmark', 'name': 'Copenhagen Kastrup'},
    'ARN': {'city': 'Stockholm', 'country': 'Sweden', 'name': 'Stockholm Arlanda'},
    'OSL': {'city': 'Oslo', 'country': 'Norway', 'name': 'Oslo Gardermoen'},
    'HEL': {'city': 'Helsinki', 'country': 'Finland', 'name': 'Helsinki-Vantaa'},
    'WAW': {'city': 'Warsaw', 'country': 'Poland', 'name': 'Warsaw Chopin'},
    'PRG': {'city': 'Prague', 'country': 'Czech Republic', 'name': 'Václav Havel Prague'},
    'BUD': {'city': 'Budapest', 'country': 'Hungary', 'name': 'Budapest Ferenc Liszt'},
    'ATH': {'city': 'Athens', 'country': 'Greece', 'name': 'Athens International'},
    'IST': {'city': 'Istanbul', 'country': 'Turkey', 'name': 'Istanbul Airport'},
    'NRT': {'city': 'Tokyo', 'country': 'Japan', 'name': 'Narita International'},
    'HND': {'city': 'Tokyo', 'country': 'Japan', 'name': 'Tokyo Haneda'},
    'KIX': {'city': 'Osaka', 'country': 'Japan', 'name': 'Kansai International'},
    'PEK': {'city': 'Beijing', 'country': 'China', 'name': 'Beijing Capital International'},
    'PVG': {'city': 'Shanghai', 'country': 'China', 'name': 'Shanghai Pudong International'},
    'HKG': {'city': 'Hong Kong', 'country': 'China', 'name': 'Hong Kong International'},
    'CAN': {'city': 'Guangzhou', 'country': 'China', 'name': 'Guangzhou Baiyun International'},
    'SZX': {'city': 'Shenzhen', 'country': 'China', 'name': 'Shenzhen Bao\'an International'},
    'SIN': {'city': 'Singapore', 'country': 'Singapore', 'name': 'Singapore Changi'},
    'BKK': {'city': 'Bangkok', 'country': 'Thailand', 'name': 'Suvarnabhumi'},
    'KUL': {'city': 'Kuala Lumpur', 'country': 'Malaysia', 'name': 'Kuala Lumpur International'},
    'CGK': {'city': 'Jakarta', 'country': 'Indonesia', 'name': 'Soekarno-Hatta International'},
    'DPS': {'city': 'Bali', 'country': 'Indonesia', 'name': 'Ngurah Rai International'},
    'MNL': {'city': 'Manila', 'country': 'Philippines', 'name': 'Ninoy Aquino International'},
    'ICN': {'city': 'Seoul', 'country': 'South Korea', 'name': 'Incheon International'},
    'TPE': {'city': 'Taipei', 'country': 'Taiwan', 'name': 'Taiwan Taoyuan International'},
    'DEL': {'city': 'Delhi', 'country': 'India', 'name': 'Indira Gandhi International'},
    'BOM': {'city': 'Mumbai', 'country': 'India', 'name': 'Chhatrapati Shivaji Maharaj International'},
    'BLR': {'city': 'Bangalore', 'country': 'India', 'name': 'Kempegowda International'},
    'DXB': {'city': 'Dubai', 'country': 'UAE', 'name': 'Dubai International'},
    'AUH': {'city': 'Abu Dhabi', 'country': 'UAE', 'name': 'Abu Dhabi International'},
    'DOH': {'city': 'Doha', 'country': 'Qatar', 'name': 'Hamad International'},
    'CAI': {'city': 'Cairo', 'country': 'Egypt', 'name': 'Cairo International'},
    'JNB': {'city': 'Johannesburg', 'country': 'South Africa', 'name': 'O.R. Tambo International'},
    'CPT': {'city': 'Cape Town', 'country': 'South Africa', 'name': 'Cape Town International'},
    'SYD': {'city': 'Sydney', 'country': 'Australia', 'name': 'Sydney Kingsford Smith'},
    'MEL': {'city': 'Melbourne', 'country': 'Australia', 'name': 'Melbourne Airport'},
    'BNE': {'city': 'Brisbane', 'country': 'Australia', 'name': 'Brisbane'},
    'PER': {'city': 'Perth', 'country': 'Australia', 'name': 'Perth'},
    'AKL': {'city': 'Auckland', 'country': 'New Zealand', 'name': 'Auckland'},
    'YYZ': {'city': 'Toronto', 'country': 'Canada', 'name': 'Toronto Pearson International'},
    'YUL': {'city': 'Montreal', 'country': 'Canada', 'name': 'Montréal-Pierre Elliott Trudeau'},
    'YVR': {'city': 'Vancouver', 'country': 'Canada', 'name': 'Vancouver International'},
    'YYC': {'city': 'Calgary', 'country': 'Canada', 'name': 'Calgary International'},
    'MEX': {'city': 'Mexico City', 'country': 'Mexico', 'name': 'Benito Juárez International'},
    'CUN': {'city': 'Cancun', 'country': 'Mexico', 'name': 'Cancún International'},
    'GIG': {'city': 'Rio de Janeiro', 'country': 'Brazil', 'name': 'Rio de Janeiro/Galeão International'},
    'GRU': {'city': 'São Paulo', 'country': 'Brazil', 'name': 'São Paulo/Guarulhos International'},
    'EZE': {'city': 'Buenos Aires', 'country': 'Argentina', 'name': 'Ministro Pistarini International'},
    'LIM': {'city': 'Lima', 'country': 'Peru', 'name': 'Jorge Chávez International'},
    'SCL': {'city': 'Santiago', 'country': 'Chile', 'name': 'Arturo Merino Benítez International'},
    'BOG': {'city': 'Bogota', 'country': 'Colombia', 'name': 'El Dorado International'},
    'LIS': {'city': 'Lisbon', 'country': 'Portugal', 'name': 'Humberto Delgado'},
    'DUB': {'city': 'Dublin', 'country': 'Ireland', 'name': 'Dublin'},
}


def get_airport_info(iata_code):
    """
    Get detailed airport information from IATA code.
    
    Args:
        iata_code (str): IATA code
        
    Returns:
        dict: Airport information or None
    """
    if not iata_code:
        return None
    
    normalized = str(iata_code).strip().upper()
    return IATA_INFO.get(normalized)
