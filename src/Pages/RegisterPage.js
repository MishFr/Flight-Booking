import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../Features/authSlice';
import { searchFlights } from '../Features/flightsSlice';

const RegisterPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const { flights, loading: flightsLoading, error: flightsError } = useSelector((state) => state.flights);

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
    dispatch(registerUser(formData));
  };

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
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          .register-container {
            animation: fadeInUp 0.8s ease-out;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          }
          
          .form-group {
            animation: slideIn 0.6s ease-out;
            animation-fill-mode: both;
          }
          .form-group:nth-child(1) { animation-delay: 0.1s; }
          .form-group:nth-child(2) { animation-delay: 0.2s; }
          .form-group:nth-child(3) { animation-delay: 0.3s; }
          .form-group:nth-child(4) { animation-delay: 0.4s; }
          
          .submit-btn {
            animation: fadeInUp 0.8s ease-out 0.5s both;
            background: linear-gradient(45deg, #FF512F 0%, #DD2476 100%);
            transition: all 0.3s ease;
            border: none;
            position: relative;
            overflow: hidden;
            z-index: 1;
          }
          
          .submit-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            height: 100%;
            background: linear-gradient(45deg, #DD2476 0%, #FF512F 100%);
            transition: width 0.3s ease;
            z-index: -1;
          }
          
          .submit-btn:hover::before {
            width: 100%;
          }
          
          .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(221, 36, 118, 0.4);
          }
          
          .message {
            animation: fadeInUp 0.8s ease-out;
            margin-top: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            backdrop-filter: blur(10px);
          }
          
          .success-message {
            background: rgba(40, 167, 69, 0.2);
            color: #d4edda;
            border: 1px solid rgba(40, 167, 69, 0.3);
          }
          
          .error-message {
            background: rgba(220, 53, 69, 0.2);
            color: #f8d7da;
            border: 1px solid rgba(220, 53, 69, 0.3);
          }
          
          .input-field {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
          }
          
          .input-field:focus {
            border-color: #DD2476 !important;
            box-shadow: 0 0 0 3px rgba(221, 36, 118, 0.2) !important;
            background: #ffffff;
          }
          
          .feature-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
          }
          
          .feature-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            z-index: 10;
          }

          .footer-link {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: all 0.3s ease;
            display: block;
            margin-bottom: 8px;
            cursor: pointer;
          }

          .footer-link:hover {
            color: #fff;
            transform: translateX(5px);
            text-shadow: 0 0 10px rgba(255,255,255,0.5);
          }
        `}
      </style>
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
          fontFamily: "'Poppins', sans-serif",
          overflow: 'hidden',
          paddingTop: '80px',
          paddingBottom: '40px'
        }}>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
            alt="Aerial view of Victoria Falls"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: -1,
              filter: 'brightness(0.7)'
            }}
          />

          <div style={{
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '800px',
            width: '90%'
          }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                name="from"
                value={searchData.from}
                onChange={handleSearchInputChange}
                placeholder="From"
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1, minWidth: '120px' }}
              />
              <input
                type="text"
                name="to"
                value={searchData.to}
                onChange={handleSearchInputChange}
                placeholder="To"
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1, minWidth: '120px' }}
              />
              <input
                type="date"
                name="departureDate"
                value={searchData.departureDate}
                onChange={handleSearchInputChange}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1, minWidth: '120px' }}
              />
              <select
                name="passengers"
                value={searchData.passengers}
                onChange={handleSearchInputChange}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1, minWidth: '120px' }}
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
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {flightsLoading ? 'Searching...' : 'Search Flights'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(45deg, #FF512F 0%, #DD2476 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(45deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
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
              gap: '20px',
              padding: '20px',
              maxWidth: '1200px',
              width: '100%'
            }}>
              <h1 style={{ 
                color: 'white', 
                textAlign: 'center', 
                fontSize: '3.5em', 
                fontWeight: '700',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                marginBottom: '10px',
                animation: 'fadeInUp 0.8s ease-out'
              }}>
                Join Our Community
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                textAlign: 'center', 
                fontSize: '1.3em', 
                marginBottom: '50px',
                maxWidth: '800px',
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
                    className="feature-card"
                    onClick={() => handleCardClick(card.link)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      width: '250px',
                      animation: `fadeInUp 0.8s ease-out ${card.delay} both`,
                    }}
                  >
                    <div style={{ overflow: 'hidden', height: '200px' }}>
                      <img 
                        src={card.img} 
                        alt={card.title} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }} 
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    </div>
                    <div style={{ padding: '25px' }}>
                      <h3 style={{ color: '#1a202c', marginBottom: '10px', fontSize: '1.4em' }}>{card.title}</h3>
                      <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '0.95em' }}>{card.desc}</p>
                      <div style={{ 
                        marginTop: '15px', 
                        color: '#DD2476', 
                        fontWeight: 'bold', 
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
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
                  padding: '18px 40px',
                  background: 'linear-gradient(45deg, #FF512F 0%, #DD2476 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.3em',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '60px',
                  boxShadow: '0 10px 20px rgba(221, 36, 118, 0.3)',
                  transition: 'all 0.3s ease',
                  animation: 'fadeInUp 0.8s ease-out 1s both'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 30px rgba(221, 36, 118, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 20px rgba(221, 36, 118, 0.3)';
                }}
              >
                Register Now
              </button>
            </div>
          ) : (
            <div className="register-container" style={{
              maxWidth: '480px',
              width: '100%',
              padding: '40px',
              borderRadius: '24px',
              margin: '20px'
            }}>
              <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '30px', 
                color: 'white',
                fontSize: '2em',
                fontWeight: '700'
              }}>Create Account</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '16px',
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                  style={{
                    width: '100%',
                    padding: '16px',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '20px'
                  }}
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </form>
              
              {error && <div className="message error-message">{error}</div>}
              {successMessage && <div className="message success-message">{successMessage}</div>}
              
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '10px' }}>
                  Already have an account? <Link to="/login" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'underline' }}>Login here</Link>
                </p>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    textDecoration: 'none',
                    padding: '5px'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                >
                  ← Back to Features
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '60px 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
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
              <h4 style={{ fontSize: '1.2em', marginBottom: '20px', color: '#DD2476' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><span className="footer-link">About Us</span></li>
                <li><span className="footer-link">Careers</span></li>
                <li><span className="footer-link">Contact</span></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2em', marginBottom: '20px', color: '#DD2476' }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><span className="footer-link">API</span></li>
                <li><span className="footer-link">Integrations</span></li>
                <li><span className="footer-link">Security</span></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2em', marginBottom: '20px', color: '#DD2476' }}>Features</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link to="/search-flights" className="footer-link">Search Flights</Link></li>
                <li><Link to="/search-flights" className="footer-link">Book Tickets</Link></li>
                <li><Link to="/bookings" className="footer-link">Manage Bookings</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2em', marginBottom: '20px', color: '#DD2476' }}>Discover</h4>
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
            <h4 style={{ marginBottom: '20px', fontWeight: 'normal', color: 'rgba(255,255,255,0.6)' }}>Follow Us</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.1em' }}>TikTok</a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.1em' }}>Facebook</a>
              <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.1em' }}>X</a>
            </div>
            <p style={{ marginTop: '30px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9em' }}>
              © 2024 Flight Booking System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
