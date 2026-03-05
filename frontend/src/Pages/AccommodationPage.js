import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchHotels } from '../api/api';

const AccommodationPage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, detecting, detected, denied

  // Get user's current location for localized search
  useEffect(() => {
    detectUserLocation();
  }, []);

  // Auto-search when location is detected
  useEffect(() => {
    if (userLocation && locationStatus === 'detected') {
      // Auto-search for nearby hotels when location is detected
      handleNearbySearch();
    }
  }, [userLocation, locationStatus]);

  const detectUserLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('detecting');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('detected');
        },
        (error) => {
          console.log('Error getting location:', error);
          setLocationStatus('denied');
        }
      );
    } else {
      setLocationStatus('denied');
    }
  };

  const handleSearch = async () => {
    if (!location.trim()) return;

    setLoading(true);
    setError(null);
    setAccommodations([]);
    setIsDemo(false);

    try {
      // Call the real API
      const response = await searchHotels({
        location: location,
        check_in: checkIn || getDefaultCheckIn(),
        check_out: checkOut || getDefaultCheckOut(),
        guests: guests
      });

      if (response.success && response.data) {
        setAccommodations(response.data);
        // Check if it's demo/fallback data
        setIsDemo(response.is_demo || false);
      } else {
        setError(response.message || 'No accommodations found');
      }
    } catch (err) {
      console.error('Error fetching accommodations:', err);
      setError('Failed to fetch accommodations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNearbySearch = async () => {
    if (userLocation) {
      setLoading(true);
      setError(null);
      setAccommodations([]);
      setIsDemo(false);
      setLocation('Current Location');

      try {
        // Call the API with geolocation
        const response = await searchHotels({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          check_in: checkIn || getDefaultCheckIn(),
          check_out: checkOut || getDefaultCheckOut(),
          guests: guests
        });

        if (response.success && response.data) {
          setAccommodations(response.data);
          setIsDemo(response.is_demo || false);
        } else {
          setError(response.message || 'No accommodations found nearby');
        }
      } catch (err) {
        console.error('Error fetching nearby accommodations:', err);
        setError('Failed to fetch nearby accommodations. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enable location services to find nearby accommodations.');
    }
  };

  // Helper functions for default dates
  const getDefaultCheckIn = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const getDefaultCheckOut = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'url(https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1950&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '80px 20px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>🏨 Find Your Perfect Stay</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>
            Discover amazing accommodations worldwide or find nearby options
          </p>
          {/* Location Status Indicator */}
          {locationStatus === 'detecting' && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              background: '#e3f2fd', 
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🔄</span>
              <span style={{ color: '#1976d2', fontSize: '14px' }}>Detecting your location...</span>
            </div>
          )}
          {locationStatus === 'detected' && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              background: '#e8f5e9', 
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📍</span>
              <span style={{ color: '#388e3c', fontSize: '14px' }}>Location detected! Searching nearby hotels...</span>
            </div>
          )}
          {locationStatus === 'denied' && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              background: '#fff3e0', 
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>ℹ️</span>
              <span style={{ color: '#f57c00', fontSize: '14px' }}>Enable location for personalized results</span>
            </div>
          )}
        </div>

        {/* Search Form */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                📍 Location
              </label>
              <input
                type="text"
                placeholder="Enter city or destination"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                📅 Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                📅 Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                👥 Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={handleSearch}
              disabled={!location.trim() || loading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: (!location.trim() || loading) ? 0.6 : 1
              }}
            >
              {loading ? '🔍 Searching...' : '🔍 Search Accommodations'}
            </button>
            <button
              onClick={handleNearbySearch}
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📍 Find Nearby
            </button>
          </div>
        </div>

        {/* Results */}
        {accommodations.length > 0 && (
          <div>
            <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>
              🏨 Available Accommodations in {location}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {accommodations.map((accommodation) => (
                <div
                  key={accommodation.id}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ color: '#333', marginBottom: '10px' }}>{accommodation.name}</h3>
                    <p style={{ color: '#666', marginBottom: '10px' }}>📍 {accommodation.location}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
                        {accommodation.price}
                      </span>
                      <span style={{ color: '#f39c12' }}>
                        ⭐ {accommodation.rating}
                      </span>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <strong>Amenities:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                        {accommodation.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            style={{
                              background: '#f0f0f0',
                              padding: '4px 8px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              color: '#666'
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                      onClick={() => navigate('/payment', { state: { item: accommodation, type: 'accommodation' } })}
                    >
                      📅 Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {accommodations.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <h3>🏨 Start Your Search</h3>
            <p>Enter a location or use "Find Nearby" to discover amazing accommodations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationPage;
