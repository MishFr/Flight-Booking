import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchFlights, searchAirports } from '../Features/flightsSlice';
import { getNearestAirport } from '../api/api';

// SVG Icons
const PlaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const SwapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const SearchFlightsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flights, loading, error } = useSelector((state) => state.flights);
  
  const [tripType, setTripType] = useState('roundtrip');
  
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
  
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  const fromRef = useRef(null);
  const toRef = useRef(null);
  
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

  const handleFindNearbyAirports = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const result = await getNearestAirport(latitude, longitude);
          
          if (result.success && result.data) {
            const airport = result.data;
            setSearchData(prev => ({
              ...prev,
              from: airport.city || airport.name,
              fromCode: airport.iataCode
            }));
          } else {
            setLocationError('No nearby airport found');
          }
        } catch (err) {
          console.error('Error finding nearby airports:', err);
          setLocationError('Failed to find nearby airports');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
        }
        setIsDetectingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); } 50% { box-shadow: 0 0 20px 10px rgba(20, 184, 166, 0); } }
        
        .neu-card {
          background: linear-gradient(145deg, #ffffff, #f0f5ff);
          border-radius: 24px;
          box-shadow: 20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        
        .neu-button {
          background: linear-gradient(145deg, #3B82F6, #2563EB);
          border-radius: 16px;
          box-shadow: 6px 6px 12px #c5d1e0, -6px -6px 12px #ffffff;
          transition: all 0.3s ease;
          border: none;
        }
        
        .neu-button:hover {
          transform: translateY(-2px);
          box-shadow: 10px 10px 20px #c5d1e0, -10px -10px 20px #ffffff;
        }
        
        .neu-input {
          background: linear-gradient(145deg, #f8faff, #e8eef7);
          border-radius: 16px;
          box-shadow: inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }
        
        .neu-input:focus {
          border-color: #14B8A6;
          box-shadow: inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff, 0 0 0 4px rgba(20, 184, 166, 0.1);
        }
        
        .flight-card {
          background: linear-gradient(145deg, #ffffff, #f8faff);
          border-radius: 20px;
          box-shadow: 10px 10px 30px #d1d9e6, -10px -10px 30px #ffffff;
          transition: all 0.3s ease;
        }
        
        .flight-card:hover {
          transform: translateY(-8px);
          box-shadow: 20px 20px 40px #c5d1e0, -20px -20px 40px #ffffff;
        }
        
        .glow-button {
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          box-shadow: 0 4px 15px rgba(20, 184, 166, 0.4);
          animation: pulse 2s infinite;
        }
        
        .glow-button:hover {
          background: linear-gradient(135deg, #0D9488 0%, #0f766e 100%);
          box-shadow: 0 6px 25px rgba(20, 184, 166, 0.5);
        }
      `}</style>
      
      {/* Back Button */}
      <button 
        className="back-button"
        onClick={() => navigate('/dashboard')}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          background: 'linear-gradient(145deg, #ffffff, #f0f5ff)',
          color: '#0A1628',
          border: 'none',
          padding: '14px 24px',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>
      
      {/* Main Container with Sky Background */}
      <div style={{
        minHeight: '100vh',
        padding: '100px 24px 60px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: 'linear-gradient(120deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 15s ease infinite',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Clouds */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '80px',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '150px',
          height: '60px',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(15px)',
          animation: 'float 8s ease-in-out infinite 1s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '15%',
          width: '180px',
          height: '70px',
          background: 'radial-gradient(ellipse, rgba(20, 184, 166, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(25px)',
          animation: 'float 7s ease-in-out infinite 0.5s'
        }}></div>
        
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeIn 0.8s ease-out' }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #0A1628 0%, #3B82F6 50%, #14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '12px',
              fontFamily: "'Inter', sans-serif"
            }}>
              Where would you like to fly?
            </h1>
            <p style={{ fontSize: '18px', color: '#64748B', fontWeight: '400' }}>
              Discover amazing destinations at the best prices
            </p>
          </div>
          
          {/* Search Card - Neumorphic Design */}
          <div className="neu-card" style={{
            padding: '0',
            overflow: 'hidden',
            animation: 'fadeIn 0.8s ease-out 0.2s both'
          }}>
            {/* Color Accent Bar */}
            <div style={{
              height: '6px',
              background: 'linear-gradient(90deg, #3B82F6, #14B8A6, #3B82F6)',
              backgroundSize: '200% 100%',
              animation: 'gradientMove 3s ease infinite'
            }}></div>
            
            {/* Trip Type Tabs */}
            <div style={{
              display: 'flex',
              padding: '16px 24px',
              gap: '12px',
              background: 'rgba(248, 250, 252, 0.5)'
            }}>
              <button 
                onClick={() => setTripType('roundtrip')}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: tripType === 'roundtrip' 
                    ? 'linear-gradient(145deg, #14B8A6, #0D9488)' 
                    : 'transparent',
                  color: tripType === 'roundtrip' ? 'white' : '#64748B',
                  boxShadow: tripType === 'roundtrip'
                    ? '0 4px 15px rgba(20, 184, 166, 0.3)'
                    : 'none'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                  </svg>
                  Round Trip
                </span>
              </button>
              <button 
                onClick={() => setTripType('oneway')}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: tripType === 'oneway' 
                    ? 'linear-gradient(145deg, #14B8A6, #0D9488)' 
                    : 'transparent',
                  color: tripType === 'oneway' ? 'white' : '#64748B',
                  boxShadow: tripType === 'oneway'
                    ? '0 4px 15px rgba(20, 184, 166, 0.3)'
                    : 'none'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  One Way
                </span>
              </button>
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ padding: '32px', background: 'rgba(255, 255, 255, 0.7)' }}>
              {/* Origin and Destination */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }} ref={fromRef}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: '#64748B', 
                    marginBottom: '10px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <LocationIcon /> From
                  </label>
                  <input 
                    type="text" 
                    name="from" 
                    value={searchData.from} 
                    onChange={handleInputChange} 
                    placeholder="City or airport" 
                    required 
                    className="neu-input"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '15px',
                      color: '#0A1628',
                      outline: 'none',
                      background: 'transparent'
                    }}
                  />
                  {/* GPS Location Button */}
                  <button 
                    type="button"
                    onClick={handleFindNearbyAirports}
                    disabled={isDetectingLocation}
                    title="Find nearby airports"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '42px',
                      background: isDetectingLocation 
                        ? 'rgba(148, 163, 184, 0.2)' 
                        : 'linear-gradient(145deg, #3B82F6, #2563EB)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      color: 'white',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: isDetectingLocation ? 'none' : '0 2px 8px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {isDetectingLocation ? (
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                      </svg>
                    )}
                    {isDetectingLocation ? 'Detecting...' : 'Near Me'}
                  </button>
                  {locationError && (
                    <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '6px', fontWeight: '500' }}>{locationError}</div>
                  )}
                  {showFromSuggestions && fromSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                      zIndex: 100,
                      maxHeight: '300px',
                      overflowY: 'auto',
                      marginTop: '8px',
                      border: '1px solid rgba(20, 184, 166, 0.2)'
                    }}>
                      {fromSuggestions.map((airport, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleFromSelect(airport)}
                          style={{
                            padding: '14px 20px',
                            cursor: 'pointer',
                            borderBottom: index < fromSuggestions.length - 1 ? '1px solid #F1F5F9' : 'none',
                            transition: 'background 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseOver={(e) => e.target.style.background = 'rgba(20, 184, 166, 0.08)'}
                          onMouseOut={(e) => e.target.style.background = 'transparent'}
                        >
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3B82F6, #14B8A6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '12px'
                          }}>
                            {airport.code}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#0A1628', fontSize: '14px' }}>{airport.city}</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{airport.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  type="button" 
                  onClick={handleSwapLocations}
                  title="Swap locations"
                  style={{
                    width: '48px',
                    height: '48px',
                    border: 'none',
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #ffffff, #e8eef7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '32px',
                    transition: 'all 0.3s ease',
                    color: '#14B8A6',
                    boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'rotate(180deg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <SwapIcon />
                </button>
                
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }} ref={toRef}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: '#64748B', 
                    marginBottom: '10px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <LocationIcon /> To
                  </label>
                  <input 
                    type="text" 
                    name="to" 
                    value={searchData.to} 
                    onChange={handleInputChange} 
                    placeholder="City or airport" 
                    required 
                    className="neu-input"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '15px',
                      color: '#0A1628',
                      outline: 'none',
                      background: 'transparent'
                    }}
                  />
                  {showToSuggestions && toSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                      zIndex: 100,
                      maxHeight: '300px',
                      overflowY: 'auto',
                      marginTop: '8px',
                      border: '1px solid rgba(20, 184, 166, 0.2)'
                    }}>
                      {toSuggestions.map((airport, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleToSelect(airport)}
                          style={{
                            padding: '14px 20px',
                            cursor: 'pointer',
                            borderBottom: index < toSuggestions.length - 1 ? '1px solid #F1F5F9' : 'none',
                            transition: 'background 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseOver={(e) => e.target.style.background = 'rgba(20, 184, 166, 0.08)'}
                          onMouseOut={(e) => e.target.style.background = 'transparent'}
                        >
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3B82F6, #14B8A6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '12px'
                          }}>
                            {airport.code}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#0A1628', fontSize: '14px' }}>{airport.city}</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{airport.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dates and Passengers */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: '#64748B', 
                    marginBottom: '10px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CalendarIcon /> Departure
                  </label>
                  <input 
                    type="date" 
                    name="departureDate" 
                    value={searchData.departureDate} 
                    onChange={handleInputChange} 
                    min={today} 
                    required 
                    className="neu-input"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '15px',
                      color: '#0A1628',
                      outline: 'none',
                      background: 'transparent'
                    }}
                  />
                </div>
                
                {tripType === 'roundtrip' && (
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      color: '#64748B', 
                      marginBottom: '10px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <CalendarIcon /> Return
                    </label>
                    <input 
                      type="date" 
                      name="returnDate" 
                      value={searchData.returnDate} 
                      onChange={handleInputChange} 
                      min={searchData.departureDate || today}
                      className="neu-input"
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '15px',
                        color: '#0A1628',
                        outline: 'none',
                        background: 'transparent'
                      }}
                    />
                  </div>
                )}
                
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: '#64748B', 
                    marginBottom: '10px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <UsersIcon /> Travelers
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #f8faff, #e8eef7)',
                    boxShadow: 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
                    overflow: 'hidden'
                  }}>
                    <button 
                      type="button" 
                      onClick={() => setSearchData(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} 
                      disabled={searchData.adults <= 1}
                      style={{
                        width: '50px',
                        height: '52px',
                        border: 'none',
                        background: 'transparent',
                        cursor: searchData.adults <= 1 ? 'not-allowed' : 'pointer',
                        fontSize: '18px',
                        color: searchData.adults <= 1 ? '#CBD5E1' : '#14B8A6',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <MinusIcon />
                    </button>
                    <div style={{ 
                      flex: 1, 
                      textAlign: 'center', 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      color: '#0A1628', 
                      lineHeight: '52px',
                      background: 'transparent'
                    }}>
                      {searchData.adults} {searchData.adults === 1 ? 'Traveler' : 'Travelers'}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSearchData(p => ({ ...p, adults: Math.min(9, p.adults + 1) }))} 
                      disabled={searchData.adults >= 9}
                      style={{
                        width: '50px',
                        height: '52px',
                        border: 'none',
                        background: 'transparent',
                        cursor: searchData.adults >= 9 ? 'not-allowed' : 'pointer',
                        fontSize: '18px',
                        color: searchData.adults >= 9 ? '#CBD5E1' : '#14B8A6',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: '#64748B', 
                    marginBottom: '10px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <PlaneIcon /> Class
                  </label>
                  <select 
                    name="travelClass" 
                    value={searchData.travelClass} 
                    onChange={handleInputChange}
                    className="neu-input"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '15px',
                      color: '#0A1628',
                      outline: 'none',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First Class</option>
                  </select>
                </div>
              </div>
              
              {/* Options */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '16px 20px',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  background: 'linear-gradient(145deg, #f8faff, #e8eef7)',
                  boxShadow: 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff',
                  width: 'fit-content',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!searchData.nonStop) {
                    e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff';
                  }
                }}
                onMouseOut={(e) => {
                  if (!searchData.nonStop) {
                    e.currentTarget.style.boxShadow = 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff';
                  }
                }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '8px',
                    background: searchData.nonStop 
                      ? 'linear-gradient(145deg, #14B8A6, #0D9488)' 
                      : 'linear-gradient(145deg, #ffffff, #f0f5ff)',
                    boxShadow: searchData.nonStop
                      ? '0 2px 8px rgba(20, 184, 166, 0.4)'
                      : '2px 2px 6px #d1d9e6, -2px -2px 6px #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}>
                    {searchData.nonStop && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <input 
                    type="checkbox" 
                    id="nonStop" 
                    name="nonStop" 
                    checked={searchData.nonStop} 
                    onChange={(e) => setSearchData(p => ({ ...p, nonStop: e.target.checked }))}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '14px', color: '#0A1628', fontWeight: '600' }}>Direct flights only</span>
                </label>
              </div>
              
              {/* Search Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                  {searchData.adults} {searchData.adults === 1 ? 'adult' : 'adults'} • {searchData.travelClass.replace('_', ' ')}
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="glow-button"
                  style={{
                    background: loading 
                      ? 'linear-gradient(145deg, #94A3B8, #64748B)' 
                      : 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '18px 56px',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <SearchIcon />
                      Search Flights
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 24px', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{
                width: '64px',
                height: '64px',
                border: '4px solid #E2E8F0',
                borderTopColor: '#14B8A6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 24px'
              }}></div>
              <div style={{ color: '#64748B', fontSize: '18px', fontWeight: '500' }}>Finding the best flights for you...</div>
            </div>
          )}
          
          {/* Flight Results */}
          {!loading && flights.length > 0 && (
            <div style={{ marginTop: '48px', animation: 'fadeIn 0.8s ease-out' }}>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#0A1628', 
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #3B82F6, #14B8A6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <PlaneIcon />
                </span>
                Available Flights 
                <span style={{ fontSize: '14px', fontWeight: '400', color: '#64748B', marginLeft: '8px' }}>
                  ({flights.length} flights found)
                </span>
              </h2>
              
              {flights.map((flight, index) => (
                <div 
                  key={flight.id || index}
                  className="flight-card"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f8faff)',
                    border: '1px solid rgba(20, 184, 166, 0.1)',
                    borderRadius: '20px',
                    marginBottom: '20px',
                    overflow: 'hidden',
                    boxShadow: '10px 10px 30px #d1d9e6, -10px -10px 30px #ffffff'
                  }}
                >
                  <div style={{ display: 'flex', padding: '28px', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    {/* Airline Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '180px' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #3B82F6, #14B8A6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '14px',
                        boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)'
                      }}>
                        {flight.airline ? flight.airline.substring(0, 2).toUpperCase() : flight.flightNumber?.substring(0, 2) || 'FL'}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', color: '#64748B' }}>{flight.airline || 'Airline'}</div>
                        <div style={{ fontWeight: '700', color: '#0A1628', fontSize: '16px' }}>{flight.flightNumber}</div>
                      </div>
                    </div>
                    
                    {/* Flight Times */}
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '24px', minWidth: '300px' }}>
                      <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#0A1628' }}>{formatTime(flight.departureTime)}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{formatDate(flight.departureTime)}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', fontWeight: '500' }}>{flight.from_location}</div>
                      </div>
                      
                      <div style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#14B8A6' }}></div>
                          <div style={{ flex: 1, height: '3px', background: 'linear-gradient(90deg, #14B8A6, #3B82F6, #14B8A6)', borderRadius: '2px' }}></div>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #3B82F6, #14B8A6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}>
                            <PlaneIcon />
                          </div>
                          <div style={{ flex: 1, height: '3px', background: 'linear-gradient(90deg, #14B8A6, #3B82F6, #14B8A6)', borderRadius: '2px' }}></div>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#14B8A6' }}></div>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '8px', fontWeight: '500' }}>{formatDuration(flight.duration)}</div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: flight.stops === 0 ? '#14B8A6' : '#64748B', 
                          fontWeight: flight.stops === 0 ? '600' : '400',
                          marginTop: '4px'
                        }}>
                          {flight.stops === 0 ? '✓ Direct Flight' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#0A1628' }}>{formatTime(flight.arrivalTime)}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{formatDate(flight.arrivalTime)}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', fontWeight: '500' }}>{flight.to}</div>
                      </div>
                    </div>
                    
                    {/* Price & Book */}
                    <div style={{ minWidth: '150px', textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: '700', 
                        color: '#0A1628',
                        background: 'linear-gradient(135deg, #3B82F6, #14B8A6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {flight.currency === 'USD' ? '$' : flight.currency}{flight.price}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>per person</div>
                      <button 
                        onClick={() => handleBookFlight(flight)}
                        style={{
                          background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '14px 28px',
                          borderRadius: '14px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.5)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(20, 184, 166, 0.4)';
                        }}
                      >
                        Select Flight
                      </button>
                    </div>
                  </div>
                  
                  {/* Flight Details Footer */}
                  <div style={{ 
                    background: 'linear-gradient(145deg, #f8faff, #e8eef7)', 
                    padding: '16px 28px', 
                    display: 'flex', 
                    gap: '24px', 
                    fontSize: '13px', 
                    color: '#64748B',
                    borderTop: '1px solid rgba(20, 184, 166, 0.1)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                      {searchData.travelClass.replace('_', ' ')}
                    </span>
                    {flight.status && (
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        color: flight.status === 'On Time' ? '#14B8A6' : '#F59E0B'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {flight.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* No Results */}
          {!loading && flights.length === 0 && searchData.from && searchData.to && searchData.departureDate && (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 24px', 
              background: 'linear-gradient(145deg, #ffffff, #f8faff)',
              borderRadius: '24px', 
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)', 
              marginTop: '40px',
              border: '1px solid rgba(20, 184, 166, 0.1)'
            }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '48px'
              }}>
                🛫
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0A1628', marginBottom: '12px' }}>No flights found</div>
              <div style={{ color: '#64748B', fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
                Try adjusting your search criteria or check back later for more options.
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {!loading && error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px', 
              background: 'rgba(239, 68, 68, 0.05)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: '20px', 
              marginTop: '32px' 
            }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#EF4444',
                fontSize: '24px'
              }}>
                ⚠️
              </div>
              <div style={{ color: '#EF4444', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Error occurred</div>
              <div style={{ color: '#64748B', fontSize: '15px' }}>{error}</div>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default SearchFlightsPage;

