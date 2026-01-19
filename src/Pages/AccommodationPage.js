import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AccommodationPage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location for localized search
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!location.trim()) return;

    setLoading(true);
    try {
      // Mock API call - replace with actual accommodation API
      const mockAccommodations = [
        {
          id: 1,
          name: 'Luxury Hotel Downtown',
          location: location,
          price: '$150/night',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant']
        },
        {
          id: 2,
          name: 'Cozy Boutique Inn',
          location: location,
          price: '$120/night',
          rating: 4.2,
          image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
          amenities: ['WiFi', 'Breakfast', 'Parking']
        },
        {
          id: 3,
          name: 'Modern City Apartment',
          location: location,
          price: '$180/night',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
          amenities: ['WiFi', 'Kitchen', 'Balcony', 'Gym']
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setAccommodations(mockAccommodations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      setLoading(false);
    }
  };

  const handleNearbySearch = () => {
    if (userLocation) {
      setLocation('Current Location');
      handleSearch();
    } else {
      alert('Please enable location services to find nearby accommodations.');
    }
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
