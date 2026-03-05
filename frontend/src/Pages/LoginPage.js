import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) {
      const loggedInUser = resultAction.payload.user;
      if (loggedInUser && (loggedInUser.is_staff || loggedInUser.is_superuser)) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      if (user && (user.is_staff || user.is_superuser)) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
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
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: -1,
              filter: 'brightness(0.5)'
            }}
          >
            <source src="https://videos.pexels.com/video-files/854188/854188-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Luxury Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.85) 0%, rgba(10, 22, 40, 0.95) 100%)',
            zIndex: 0
          }}></div>
          
          <div className="login-container" style={{ position: 'relative', zIndex: 1 }}>
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
            }}>Welcome Back</h2>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  backgroundColor: 'rgba(225, 29, 72, 0.15)',
                  color: '#fca5a5',
                  padding: '14px',
                  borderRadius: '10px',
                  marginBottom: '24px',
                  border: '1px solid rgba(225, 29, 72, 0.3)',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'white', fontSize: '14px', letterSpacing: '0.5px' }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'white', fontSize: '14px', letterSpacing: '0.5px' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
                  color: '#0A1628',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '24px',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.3)';
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontSize: '15px' }}>
                Don't have an account? <Link to="/register" style={{ color: '#D4AF37', fontWeight: 'bold', textDecoration: 'none', borderBottom: '1px solid #D4AF37' }}>Register here</Link>
              </p>
            </div>
          </div>
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

export default LoginPage;

