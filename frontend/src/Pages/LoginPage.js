import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
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
      navigate('/dashboard');
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
          
          .login-container {
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
          
          .input-field {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
          }
          
          .input-field:focus {
            border-color: #DD2476 !important;
            box-shadow: 0 0 0 3px rgba(221, 36, 118, 0.2) !important;
            background: #ffffff;
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
              filter: 'brightness(0.7)'
            }}
          >
            <source src="https://videos.pexels.com/video-files/854188/854188-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="login-container" style={{
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
            }}>Welcome Back</h2>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #ffcdd2'
                }}>
                  {error}
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                className="submit-btn"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '20px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '10px' }}>
                Don't have an account? <Link to="/register" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'underline' }}>Register here</Link>
              </p>
            </div>
          </div>
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
              © 2026 Flight Booking System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
