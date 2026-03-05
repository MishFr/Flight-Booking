import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../Features/authSlice';
import { searchFlights } from '../Features/flightsSlice';

const RegisterPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: ''
  });
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  // Image slideshow states
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const [cardImageIndices, setCardImageIndices] = useState([0, 0, 0, 0, 0]);

  // Background images array
  const bgImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
  ];

  // Card images arrays
  const cardImages = useMemo(() => [
    [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400"
    ],
    [
      "https://images.unsplash.com/photo-1489599735734-79b4d4c4b5c?w=400",
      "https://images.unsplash.com/photo-1489599735734-79b4d4c4b5c?w=400",
      "https://images.unsplash.com/photo-1489599735734-79b4d4c4b5c?w=400",
      "https://images.unsplash.com/photo-1489599735734-79b4d4c4b5c?w=400"
    ],
    [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400"
    ],
    [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    ],
    [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
    ]
  ], []);

  // Background slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  // Card images slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCardImageIndices((prevIndices) =>
        prevIndices.map((index, i) => (index + 1) % cardImages[i].length)
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [cardImages]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const { loading: flightsLoading } = useSelector((state) => state.flights);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const { confirmPassword, ...userData } = formData;
    userData.username = formData.email;
    dispatch(registerUser(userData));
  };

  React.useEffect(() => {
    if (successMessage) {
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [successMessage]);

  const handleSearchInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(searchFlights(searchData));
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          overflow: 'hidden',
          paddingTop: '80px',
          paddingBottom: '40px'
        }}>
          {/* Background Image */}
          <img
            src={bgImages[bgImageIndex]}
            alt="Travel destination"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: -1,
              filter: 'brightness(0.6)',
              transition: 'opacity 1s ease-in-out',
            }}
          />

          {/* Luxury Navy Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.75) 0%, rgba(10, 22, 40, 0.9) 100%)',
            zIndex: 0
          }}></div>

          {/* Search Bar */}
          <div style={{
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            maxWidth: '900px',
            width: '92%'
          }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                name="from"
                value={searchData.from}
                onChange={handleSearchInputChange}
                placeholder="From"
                required
                style={{ padding: '12px', border: '2px solid #E9ECEF', borderRadius: '10px', flex: 1, minWidth: '130px', fontSize: '14px' }}
              />
              <input
                type="text"
                name="to"
                value={searchData.to}
                onChange={handleSearchInputChange}
                placeholder="To"
                required
                style={{ padding: '12px', border: '2px solid #E9ECEF', borderRadius: '10px', flex: 1, minWidth: '130px', fontSize: '14px' }}
              />
              <input
                type="date"
                name="departureDate"
                value={searchData.departureDate}
                onChange={handleSearchInputChange}
                required
                style={{ padding: '12px', border: '2px solid #E9ECEF', borderRadius: '10px', flex: 1, minWidth: '130px', fontSize: '14px' }}
              />
              <select
                name="passengers"
                value={searchData.passengers}
                onChange={handleSearchInputChange}
                style={{ padding: '12px', border: '2px solid #E9ECEF', borderRadius: '10px', flex: 1, minWidth: '130px', fontSize: '14px' }}
              >
                <option value={1}>1 Passenger</option>
                <option value={2}>2 Passengers</option>
                <option value={3}>3 Passengers</option>
                <option value={4}>4 Passengers</option>
                <option value={5}>5 Passengers</option>
              </select>
              <button
                type="submit"
                disabled={flightsLoading}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #0A1628 0%, #1a365d 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {flightsLoading ? '...' : 'Search'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  color: '#0A1628',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px'
                }}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#0A1628',
                  border: '2px solid #0A1628',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Login
              </button>
            </form>
          </div>

          {!showForm ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              padding: '20px',
              maxWidth: '1300px',
              width: '100%',
              position: 'relative',
              zIndex: 1
            }}>
              <h1 style={{ 
                color: 'white', 
                textAlign: 'center', 
                fontSize: '3.5em', 
                fontWeight: '700',
                fontFamily: "'Playfair Display', serif",
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                marginBottom: '12px',
                animation: 'fadeInUp 0.8s ease-out'
              }}>
                Join Our <span style={{ color: '#D4AF37' }}>Community</span>
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.85)', 
                textAlign: 'center', 
                fontSize: '1.4em', 
                marginBottom: '50px',
                maxWidth: '800px',
                fontFamily: "'Inter', sans-serif",
                animation: 'fadeInUp 0.8s ease-out 0.2s both'
              }}>
                Discover amazing business and entertainment options for your travels.
              </p>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '30px'
              }}>
                {[
                  {
                    title: "Business Travel",
                    desc: "Elevate your business journeys with premium services, meeting rooms, and executive lounges.",
                    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                    link: "/travel-insights",
                    delay: "0s"
                  },
                  {
                    title: "Entertainment",
                    desc: "Enjoy in-flight entertainment with movies, music, games, and more.",
                    img: "https://images.unsplash.com/photo-1489599735734-79b4d4c4b5c?w=400",
                    link: "/special-offers",
                    delay: "0.2s"
                  },
                  {
                    title: "Family Travel",
                    desc: "Create unforgettable memories with family-friendly services and special packages.",
                    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
                    link: "/search-flights",
                    delay: "0.4s"
                  },
                  {
                    title: "Adventure Journeys",
                    desc: "Embark on thrilling adventures with guided tours and exploration packages.",
                    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                    link: "/travel-insights",
                    delay: "0.6s"
                  },
                  {
                    title: "Luxury Experiences",
                    desc: "Indulge in premium travel with private jets and personalized concierge services.",
                    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
                    link: "/special-offers",
                    delay: "0.8s"
                  }
                ].map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(card.link)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      width: '260px',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.4s ease',
                      animation: `fadeInUp 0.8s ease-out ${card.delay} both`,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 24px 64px rgba(0, 0, 0, 0.4)';
                      e.currentTarget.style.borderColor = '#D4AF37';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    }}
                  >
                    <div style={{ overflow: 'hidden', height: '180px' }}>
                      <img
                        src={cardImages[index][cardImageIndices[index]]}
                        alt={card.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                      />
                    </div>
                    <div style={{ padding: '24px' }}>
                      <h3 style={{ color: '#0A1628', marginBottom: '12px', fontSize: '1.4em', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{card.title}</h3>
                      <p style={{ color: '#495057', lineHeight: '1.6', fontSize: '0.95em' }}>{card.desc}</p>
                      <div style={{ 
                        marginTop: '16px', 
                        color: '#D4AF37', 
                        fontWeight: '700', 
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        Explore More <span>→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '18px 48px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
                  color: '#0A1628',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.2em',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '60px',
                  boxShadow: '0 8px 30px rgba(212, 175, 55, 0.4)',
                  transition: 'all 0.3s ease',
                  animation: 'fadeInUp 0.8s ease-out 1s both',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(212, 175, 55, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.4)';
                }}
              >
                Register Now
              </button>
            </div>
          ) : (
            <div className="register-container" style={{
              maxWidth: '500px',
              width: '100%',
              padding: '48px',
              borderRadius: '28px',
              margin: '20px',
              position: 'relative',
              zIndex: 1,
              background: 'rgba(10, 22, 40, 0.9)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)'
            }}>
              {/* Gold Top Bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                borderRadius: '0 0 4px 4px'
              }}></div>
              
              <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '36px', 
                color: 'white',
                fontSize: '2.2em',
                fontWeight: '700',
                fontFamily: "'Playfair Display', serif"
              }}>Create Account</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'white', fontSize: '14px', letterSpacing: '0.5px' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#D4AF37';
                      e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'white', fontSize: '14px', letterSpacing: '0.5px' }}>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        fontSize: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#D4AF37';
                        e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'white', fontSize: '14px', letterSpacing: '0.5px' }}>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        fontSize: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#D4AF37';
                        e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'white', fontSize: '14px', letterSpacing: '0.5px' }}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#D4AF37';
                      e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'white', fontSize: '14px', letterSpacing: '0.5px' }}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#D4AF37';
                      e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !!successMessage}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
                    color: '#0A1628',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: loading || !!successMessage ? 'not-allowed' : 'pointer',
                    marginBottom: '24px',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    if (!loading && !successMessage) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.5)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.3)';
                  }}
                >
                  {loading ? 'Creating Account...' : successMessage ? 'Registration Submitted' : 'Register'}
                </button>
              </form>
              
              {error && (
                <div style={{
                  backgroundColor: 'rgba(225, 29, 72, 0.15)',
                  color: '#fca5a5',
                  padding: '14px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(225, 29, 72, 0.3)',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              {successMessage && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#86efac',
                  padding: '14px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {successMessage}
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontSize: '15px' }}>
                  Already have an account? <Link to="/login" style={{ color: '#D4AF37', fontWeight: 'bold', textDecoration: 'none', borderBottom: '1px solid #D4AF37' }}>Login here</Link>
                </p>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.95em',
                    textDecoration: 'none',
                    padding: '8px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                >
                  ← Back to Features
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          backgroundColor: 'rgba(10, 22, 40, 0.95)',
          color: 'white',
          padding: '60px 20px',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            flexWrap: 'wrap',
            maxWidth: '1200px',
            margin: '0 auto',
            gap: '40px'
          }}>
            <div>
              <h4 style={{ fontSize: '1.2em', marginBottom: '20px', color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><span className="footer-link">About Us</span></li>
                <li><span className="footer-link">Careers</span></li>
                <li><span className="footer-link">Contact</span></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2em', marginBottom: '20px', color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><span className="footer-link">API</span></li>
                <li><span className="footer-link">Integrations</span></li>
                <li><span className="footer-link">Security</span></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2em', marginBottom: '20px', color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>Features</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link to="/search-flights" className="footer-link">Search Flights</Link></li>
                <li><Link to="/search-flights" className="footer-link">Book Tickets</Link></li>
                <li><Link to="/bookings" className="footer-link">Manage Bookings</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2em', marginBottom: '20px', color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>Discover</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link to="/travel-insights" className="footer-link">Travel Tips</Link></li>
                <li><Link to="/search-flights" className="footer-link">Destinations</Link></li>
                <li><Link to="/special-offers" className="footer-link">Offers</Link></li>
              </ul>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '60px', 
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '30px'
          }}>
            <h4 style={{ marginBottom: '20px', fontWeight: 'normal', color: 'rgba(255,255,255,0.6)', fontFamily: "'Playfair Display', serif" }}>Follow Us</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.1em' }}>TikTok</a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.1em' }}>Facebook</a>
              <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.1em' }}>X</a>
            </div>
            <p style={{ marginTop: '30px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9em' }}>
              © 2026 AirZambia. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

