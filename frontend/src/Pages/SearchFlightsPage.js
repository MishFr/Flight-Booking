// src/Pages/SearchFlightsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchFlights, searchAirports } from '../Features/flightsSlice';

const SearchFlightsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flights, loading, error } = useSelector((state) => state.flights);
  
  // Trip type state
  const [tripType, setTripType] = useState('roundtrip');
  
  // Search form state
  const [searchData, setSearchData] = useState({
    from: '',
    fromCode: '',
    to: '',
    toCode: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    travelClass: 'ECONOMY',
    nonStop: false
  });
  
  // Autocomplete state
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  
  // Refs for click outside
  const fromRef = useRef(null);
  const toRef = useRef(null);
  
  // Popular airports for quick selection
  const popularAirports = [
    { code: 'JFK', name: 'New York John F. Kennedy', city: 'New York', country: 'USA' },
    { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
    { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK' },
    { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France' },
    { code: 'NRT', name: 'Tokyo Narita', city: 'Tokyo', country: 'Japan' },
    { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
    { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
    { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'China' },
    { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
    { code: 'ORD', name: 'Chicago O\'Hare', city: 'Chicago', country: 'USA' },
    { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
    { code: 'ATL', name: 'Atlanta Hartsfield-Jackson', city: 'Atlanta', country: 'USA' }
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search for airports
  const handleAirportSearch = async (keyword, isFrom) => {
    if (keyword.length < 2) {
      if (isFrom) setFromSuggestions([]);
      else setToSuggestions([]);
      return;
    }
    
    try {
      const result = await dispatch(searchAirports(keyword)).unwrap();
      const suggestions = result.data || result || [];
      const mappedSuggestions = suggestions.slice(0, 8).map(airport => ({
        code: airport.code_iata || airport.code || '',
        name: airport.name || airport.name_en || '',
        city: airport.city || airport.city_name || '',
        country: airport.country || ''
      })).filter(s => s.code);
      
      if (isFrom) {
        setFromSuggestions(mappedSuggestions);
        setShowFromSuggestions(true);
      } else {
        setToSuggestions(mappedSuggestions);
        setShowToSuggestions(true);
      }
    } catch (err) {
      const filtered = popularAirports.filter(a => 
        a.city.toLowerCase().includes(keyword.toLowerCase()) ||
        a.code.toLowerCase().includes(keyword.toLowerCase()) ||
        a.name.toLowerCase().includes(keyword.toLowerCase())
      );
      if (isFrom) {
        setFromSuggestions(filtered);
        setShowFromSuggestions(true);
      } else {
        setToSuggestions(filtered);
        setShowToSuggestions(true);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'from') handleAirportSearch(value, true);
    else if (name === 'to') handleAirportSearch(value, false);
  };

  const handleFromSelect = (airport) => {
    setSearchData(prev => ({ ...prev, from: airport.city || airport.name, fromCode: airport.code }));
    setFromSuggestions([]);
    setShowFromSuggestions(false);
  };

  const handleToSelect = (airport) => {
    setSearchData(prev => ({ ...prev, to: airport.city || airport.name, toCode: airport.code }));
    setToSuggestions([]);
    setShowToSuggestions(false);
  };

  const handleSwapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      fromCode: prev.toCode,
      to: prev.from,
      toCode: prev.fromCode
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = {
      from: searchData.fromCode || searchData.from,
      to: searchData.toCode || searchData.to,
      departureDate: searchData.departureDate,
      returnDate: tripType === 'roundtrip' ? searchData.returnDate : '',
      passengers: parseInt(searchData.adults),
      class: searchData.travelClass.toLowerCase(),
      tripType: tripType,
      nonStop: searchData.nonStop
    };
    dispatch(searchFlights(searchParams));
  };

  const handleBookFlight = (flight) => {
    navigate('/payment', { state: { item: flight, type: 'flight' } });
  };

  const formatDuration = (duration) => {
    if (!duration) return '--';
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) return `${match[1]}h ${match[2]}m`;
    return duration;
  };

  const formatTime = (datetime) => {
    if (!datetime) return '--';
    try {
      const date = new Date(datetime);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return datetime; }
  };

  const formatDate = (datetime) => {
    if (!datetime) return '--';
    try {
      const date = new Date(datetime);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch { return datetime; }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .search-container { animation: fadeIn 0.8s ease-out; }
        .search-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; }
        .search-tabs { display: flex; border-bottom: 1px solid #e0e0e0; background: #f8f9fa; }
        .search-tab { flex: 1; padding: 16px 24px; border: none; background: transparent; cursor: pointer; font-size: 15px; font-weight: 600; color: #666; transition: all 0.3s ease; position: relative; }
        .search-tab:hover { background: #fff; color: #002855; }
        .search-tab.active { background: #fff; color: #002855; }
        .search-tab.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #002855; }
        .search-tab-icon { margin-right: 8px; }
        .search-form-container { padding: 24px; background: #fff; }
        .search-row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .search-field { flex: 1; min-width: 200px; position: relative; }
        .search-field label { display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .search-field input, .search-field select { width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; color: #333; transition: all 0.3s ease; background: #fff; }
        .search-field input:focus, .search-field select:focus { outline: none; border-color: #002855; box-shadow: 0 0 0 3px rgba(0, 40, 85, 0.1); }
        .swap-button { width: 40px; height: 40px; border: 1px solid #ddd; border-radius: 50%; background: #f8f9fa; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 24px 8px 0; transition: all 0.3s ease; align-self: flex-start; font-size: 18px; }
        .swap-button:hover { background: #002855; color: #fff; border-color: #002855; }
        .suggestions-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 100; max-height: 280px; overflow-y: auto; margin-top: 4px; }
        .suggestion-item { padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0; transition: background 0.2s ease; }
        .suggestion-item:hover { background: #f8f9fa; }
        .suggestion-code { font-weight: 700; color: #002855; font-size: 14px; }
        .suggestion-city { font-weight: 500; color: #333; font-size: 14px; }
        .suggestion-name { font-size: 12px; color: #666; }
        .passenger-input-group { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .passenger-btn { width: 36px; height: 42px; border: none; background: #f8f9fa; cursor: pointer; font-size: 18px; color: #002855; transition: background 0.2s ease; }
        .passenger-btn:hover { background: #e9ecef; }
        .passenger-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .passenger-value { flex: 1; text-align: center; font-size: 15px; font-weight: 500; color: #333; min-width: 80px; }
        .checkbox-field { display: flex; align-items: center; gap: 8px; padding: 12px 0; }
        .checkbox-field input[type="checkbox"] { width: 18px; height: 18px; accent-color: #002855; cursor: pointer; }
        .checkbox-field label { font-size: 14px; color: #333; cursor: pointer; margin: 0; }
        .search-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        .search-button { background: #002855; color: white; border: none; padding: 14px 40px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; }
        .search-button:hover { background: #003d80; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 40, 85, 0.3); }
        .search-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .flight-results { margin-top: 30px; }
        .results-title { font-size: 20px; font-weight: 700; color: #002855; }
        .results-count { color: #666; font-size: 14px; }
        .flight-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; margin-bottom: 16px; overflow: hidden; transition: all 0.3s ease; }
        .flight-card:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); border-color: #002855; }
        .flight-card-main { display: flex; padding: 20px; align-items: center; }
        .airline-info { display: flex; align-items: center; gap: 12px; min-width: 180px; }
        .airline-logo { width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }
        .airline-name { font-size: 13px; color: #666; }
        .flight-number { font-weight: 600; color: #333; }
        .flight-times { display: flex; align-items: center; flex: 1; gap: 16px; }
        .time-block { text-align: center; min-width: 80px; }
        .time-value { font-size: 20px; font-weight: 700; color: #002855; }
        .time-date { font-size: 12px; color: #666; }
        .flight-duration { flex: 1; text-align: center; padding: 0 20px; }
        .duration-line { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .duration-dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; }
        .duration-line::before, .duration-line::after { content: ''; flex: 1; height: 1px; background: #ddd; }
        .duration-value { font-size: 13px; color: #666; margin-top: 4px; }
        .stops-info { font-size: 12px; color: #666; }
        .stops-info.direct { color: #28a745; }
        .flight-price-section { min-width: 140px; text-align: right; }
        .price-value { font-size: 24px; font-weight: 700; color: #002855; }
        .price-note { font-size: 11px; color: #999; }
        .book-button { background: #002855; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 8px; }
        .book-button:hover { background: #003d80; }
        .flight-card-footer { background: #f8f9fa; padding: 12px 20px; display: flex; gap: 20px; font-size: 12px; color: #666; }
        .back-button { position: fixed; top: 20px; left: 20px; background: #002855; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s ease; z-index: 1000; }
        .back-button:hover { background: #003d80; transform: translateY(-2px); }
        .loading { text-align: center; padding: 60px 20px; }
        .loading-spinner { width: 48px; height: 48px; border: 4px solid #e0e0e0; border-top-color: #002855; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { color: #666; font-size: 16px; }
        .no-results { text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
        .no-results-icon { font-size: 48px; margin-bottom: 16px; }
        .no-results-title { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 8px; }
        .no-results-text { color: #666; font-size: 14px; }
        .error-message { text-align: center; padding: 40px; background: #fff5f5; border: 1px solid #ffcccc; border-radius: 12px; margin-top: 20px; }
        .error-title { color: #d32f2f; font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .error-text { color: #666; font-size: 14px; }
        @media (max-width: 768px) {
          .search-row { flex-direction: column; }
          .search-field { min-width: 100%; }
          .swap-button { align-self: center; margin: 8px; }
          .flight-card-main { flex-direction: column; gap: 16px; }
          .airline-info, .flight-times, .flight-price-section { width: 100%; justify-content: center; }
        }
      `}</style>
      
      <button className="back-button" onClick={() => navigate('/dashboard')}>← Back</button>
      
      <div className="search-container" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
        padding: '80px 20px 40px',
        fontFamily: "'Segoe UI', Arial, sans-serif"
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Amadeus-style Search Card */}
          <div className="search-card">
            {/* Trip Type Tabs */}
            <div className="search-tabs">
              <button className={`search-tab ${tripType === 'roundtrip' ? 'active' : ''}`} onClick={() => setTripType('roundtrip')}>
                <span className="search-tab-icon">🔄</span>Round Trip
              </button>
              <button className={`search-tab ${tripType === 'oneway' ? 'active' : ''}`} onClick={() => setTripType('oneway')}>
                <span className="search-tab-icon">➡️</span>One Way
              </button>
            </div>
            
            {/* Search Form */}
            <form className="search-form-container" onSubmit={handleSearch}>
              {/* Origin and Destination */}
              <div className="search-row">
                <div className="search-field" ref={fromRef}>
                  <label>From</label>
                  <input type="text" name="from" value={searchData.from} onChange={handleInputChange} placeholder="City or airport" required />
                  {showFromSuggestions && fromSuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {fromSuggestions.map((airport, index) => (
                        <div key={index} className="suggestion-item" onClick={() => handleFromSelect(airport)}>
                          <span className="suggestion-code">{airport.code}</span>
                          <span className="suggestion-city"> - {airport.city}</span>
                          <div className="suggestion-name">{airport.name || airport.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button type="button" className="swap-button" onClick={handleSwapLocations} title="Swap locations">⇄</button>
                
                <div className="search-field" ref={toRef}>
                  <label>To</label>
                  <input type="text" name="to" value={searchData.to} onChange={handleInputChange} placeholder="City or airport" required />
                  {showToSuggestions && toSuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {toSuggestions.map((airport, index) => (
                        <div key={index} className="suggestion-item" onClick={() => handleToSelect(airport)}>
                          <span className="suggestion-code">{airport.code}</span>
                          <span className="suggestion-city"> - {airport.city}</span>
                          <div className="suggestion-name">{airport.name || airport.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dates and Passengers */}
              <div className="search-row">
                <div className="search-field">
                  <label>Departure Date</label>
                  <input type="date" name="departureDate" value={searchData.departureDate} onChange={handleInputChange} min={today} required />
                </div>
                
                {tripType === 'roundtrip' && (
                  <div className="search-field">
                    <label>Return Date</label>
                    <input type="date" name="returnDate" value={searchData.returnDate} onChange={handleInputChange} min={searchData.departureDate || today} />
                  </div>
                )}
                
                <div className="search-field">
                  <label>Passengers</label>
                  <div className="passenger-input-group">
                    <button type="button" className="passenger-btn" onClick={() => setSearchData(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} disabled={searchData.adults <= 1}>−</button>
                    <span className="passenger-value">{searchData.adults} Adult{searchData.adults > 1 ? 's' : ''}</span>
                    <button type="button" className="passenger-btn" onClick={() => setSearchData(p => ({ ...p, adults: Math.min(9, p.adults + 1) }))} disabled={searchData.adults >= 9}>+</button>
                  </div>
                </div>
                
                <div className="search-field">
                  <label>Cabin Class</label>
                  <select name="travelClass" value={searchData.travelClass} onChange={handleInputChange}>
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First Class</option>
                  </select>
                </div>
              </div>
              
              {/* Options */}
              <div className="search-row">
                <div className="checkbox-field">
                  <input type="checkbox" id="nonStop" name="nonStop" checked={searchData.nonStop} onChange={(e) => setSearchData(p => ({ ...p, nonStop: e.target.checked }))} />
                  <label htmlFor="nonStop">Direct flights only</label>
                </div>
              </div>
              
              {/* Search Button */}
              <div className="search-actions">
                <div></div>
                <button type="submit" className="search-button" disabled={loading}>
                  {loading ? 'Searching...' : '🔍 Search Flights'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <div className="loading-text">Searching for the best flights...</div>
            </div>
          )}
          
          {/* Flight Results */}
          {!loading && flights.length > 0 && (
            <div className="flight-results">
              <h2 className="results-title">✈️ Available Flights <span className="results-count">({flights.length} flights found)</span></h2>
              
              {flights.map((flight, index) => (
                <div key={flight.id || index} className="flight-card">
                  <div className="flight-card-main">
                    <div className="airline-info">
                      <div className="airline-logo">{flight.airline ? flight.airline.substring(0, 2).toUpperCase() : flight.flightNumber?.substring(0, 2) || 'FL'}</div>
                      <div>
                        <div className="airline-name">{flight.airline || 'Airline'}</div>
                        <div className="flight-number">{flight.flightNumber}</div>
                      </div>
                    </div>
                    
                    <div className="flight-times">
                      <div className="time-block">
                        <div className="time-value">{formatTime(flight.departureTime)}</div>
                        <div className="time-date">{formatDate(flight.departureTime)}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{flight.from_location}</div>
                      </div>
                      
                      <div className="flight-duration">
                        <div className="duration-line"><div className="duration-dot"></div></div>
                        <div className="duration-value">{formatDuration(flight.duration)}</div>
                        <div className={`stops-info ${flight.stops === 0 ? 'direct' : ''}`}>
                          {flight.stops === 0 ? '✓ Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </div>
                      </div>
                      
                      <div className="time-block">
                        <div className="time-value">{formatTime(flight.arrivalTime)}</div>
                        <div className="time-date">{formatDate(flight.arrivalTime)}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{flight.to}</div>
                      </div>
                    </div>
                    
                    <div className="flight-price-section">
                      <div className="price-value">{flight.currency === 'USD' ? '$' : flight.currency}{flight.price}</div>
                      <div className="price-note">per person</div>
                      <button className="book-button" onClick={() => handleBookFlight(flight)}>Select</button>
                    </div>
                  </div>
                  
                  <div className="flight-card-footer">
                    <span>💺 {searchData.travelClass.replace('_', ' ')}</span>
                    {flight.status && <span>📊 {flight.status}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* No Results */}
          {!loading && flights.length === 0 && searchData.from && searchData.to && searchData.departureDate && (
            <div className="no-results">
              <div className="no-results-icon">🛫</div>
              <div className="no-results-title">No flights found</div>
              <div className="no-results-text">Try adjusting your search criteria or check back later for more options.</div>
            </div>
          )}
          
          {/* Error Message */}
          {!loading && error && (
            <div className="error-message">
              <div className="error-title">Error occurred</div>
              <div className="error-text">{error}</div>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default SearchFlightsPage;
