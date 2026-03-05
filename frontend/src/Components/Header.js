import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Features/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [region, setRegion] = useState(() => localStorage.getItem('user_region') || 'US');
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const regions = [
    { code: 'US', name: '🇺🇸 United States', lat: 37.0902, lon: -95.7129 },
    { code: 'UK', name: '🇬🇧 United Kingdom', lat: 55.3781, lon: -3.4360 },
    { code: 'CA', name: '🇨🇦 Canada', lat: 56.1304, lon: -106.3468 },
    { code: 'AU', name: '🇦🇺 Australia', lat: -25.2744, lon: 133.7751 },
    { code: 'DE', name: '🇩🇪 Germany', lat: 51.1657, lon: 10.4515 },
    { code: 'FR', name: '🇫🇷 France', lat: 46.2276, lon: 2.2137 },
    { code: 'JP', name: '🇯🇵 Japan', lat: 36.2048, lon: 138.2529 },
    { code: 'IN', name: '🇮🇳 India', lat: 20.5937, lon: 78.9629 },
  ];

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearest region based on coordinates
  const findNearestRegion = (userLat, userLon) => {
    let nearestRegion = regions[0];
    let minDistance = Infinity;

    regions.forEach((r) => {
      const distance = calculateDistance(userLat, userLon, r.lat, r.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestRegion = r;
      }
    });

    return nearestRegion.code;
  };

  // Detect user location using browser Geolocation API
  const detectLocation = async () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const detectedRegion = findNearestRegion(latitude, longitude);
          setRegion(detectedRegion);
          localStorage.setItem('user_region', detectedRegion);
          setIsDetectingLocation(false);
        },
        async (error) => {
          // Fallback to IP-based geolocation if browser geolocation fails
          console.log('Browser geolocation failed, trying IP-based detection...');
          try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data.latitude && data.longitude) {
              const detectedRegion = findNearestRegion(data.latitude, data.longitude);
              setRegion(detectedRegion);
              localStorage.setItem('user_region', detectedRegion);
            }
          } catch (ipError) {
            console.log('IP-based geolocation also failed:', ipError);
            // Keep default region if both methods fail
          }
          setIsDetectingLocation(false);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    } else {
      // Browser doesn't support geolocation, try IP-based
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const detectedRegion = findNearestRegion(data.latitude, data.longitude);
          setRegion(detectedRegion);
          localStorage.setItem('user_region', detectedRegion);
        }
      } catch (ipError) {
        console.log('IP-based geolocation failed:', ipError);
      }
      setIsDetectingLocation(false);
    }
  };

  // Auto-detect location on mount (only if no saved region)
  useEffect(() => {
    const savedRegion = localStorage.getItem('user_region');
    if (!savedRegion) {
      detectLocation();
    }
  }, []);

  const handleSignInClick = () => {
    setShowSignInDropdown(!showSignInDropdown);
  };

  const handleThreeDotsClick = () => {
    setShowThreeDotsMenu(!showThreeDotsMenu);
  };

  const handleLogin = () => {
    navigate('/login');
    setShowSignInDropdown(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setShowSignInDropdown(false);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileSettings = () => {
    navigate('/profile-settings');
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    navigate('/');
    setShowProfileDropdown(false);
  };

  return (
    <header className="header">
        <div className="header-left">
          <div className="company-name" onClick={() => navigate('/')}>
            ✈️ Air<span>Zambia</span>.com
          </div>
          <nav className="nav-links">
            <span className="nav-link" onClick={() => navigate('/search-flights')}>Flights</span>
            <span className="nav-link" onClick={() => navigate('/accommodation')}>Accommodation</span>
            <span className="nav-link" onClick={() => navigate('/magazine')}>Magazine</span>
            <span className="nav-link" onClick={() => navigate('/vendors-corner')}>Vendors Corner</span>
            <span className="nav-link">Deals</span>
          </nav>
        </div>
        <div className="header-right">

          <select
            className="region-select"
            value={region}
            onChange={(e) => {
              if (e.target.value === 'DETECT') {
                detectLocation();
              } else {
                setRegion(e.target.value);
                localStorage.setItem('user_region', e.target.value);
              }
            }}
          >
            <option value="DETECT" disabled={isDetectingLocation}>
              {isDetectingLocation ? '⏳ Detecting location...' : '📍 Detect My Location'}
            </option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
          <span className="help-support">🆘 Help & Support</span>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <span className="user-name" onClick={handleProfileClick}>
                👤 {user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'User'} ▼
              </span>
              {showProfileDropdown && (
                <div className="dropdown">
                  <div className="dropdown-item" onClick={handleProfileSettings}>
                    ⚙️ Profile Settings
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button className="sign-in-btn" onClick={handleSignInClick}>
                👤 Sign In ▼
              </button>
              {showSignInDropdown && (
                <div className="dropdown">
                  <div className="dropdown-item" onClick={handleLogin}>
                    🔐 Login
                  </div>
                  <div className="dropdown-item" onClick={handleRegister}>
                    📝 Register
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <span className="three-dots" onClick={handleThreeDotsClick}>
              ⋮
            </span>
            {showThreeDotsMenu && (
              <div className="three-dots-menu">
                {user && user.is_staff && (
                  <>
                    <div className="menu-item" onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</div>
                    <div className="menu-item" onClick={() => navigate('/admin/users')}>Manage Users</div>
                    <div className="menu-item" onClick={() => navigate('/admin/flights')}>Manage Flights</div>
                  </>
                )}
                <div className="menu-item">Settings</div>
                <div className="menu-item">Privacy Policy</div>
                <div className="menu-item">Terms of Service</div>
              </div>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;

