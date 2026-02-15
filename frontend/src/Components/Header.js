import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Features/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [region, setRegion] = useState('US');
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const regions = [
    { code: 'US', name: '🇺🇸 United States' },
    { code: 'UK', name: '🇬🇧 United Kingdom' },
    { code: 'CA', name: '🇨🇦 Canada' },
    { code: 'AU', name: '🇦🇺 Australia' },
    { code: 'DE', name: '🇩🇪 Germany' },
    { code: 'FR', name: '🇫🇷 France' },
    { code: 'JP', name: '🇯🇵 Japan' },
    { code: 'IN', name: '🇮🇳 India' },
  ];

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
    <>
      <style>
        {`
          .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 1000;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            cursor: pointer;
          }
          .nav-links {
            display: flex;
            gap: 15px;
          }
          .nav-link {
            color: #555;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
            cursor: pointer;
          }
          .nav-link:hover {
            color: #667eea;
          }
          .header-right {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .region-select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: white;
            cursor: pointer;
            font-size: 14px;
          }
          .help-support {
            color: #555;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
            cursor: pointer;
          }
          .help-support:hover {
            color: #667eea;
          }
          .sign-in-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            position: relative;
          }
          .sign-in-btn:hover {
            background: #5a67d8;
          }
          .user-name {
            color: #333;
            font-weight: 500;
            cursor: pointer;
            position: relative;
          }
          .user-name:hover {
            color: #667eea;
          }
          .dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            min-width: 120px;
            z-index: 1001;
          }
          .dropdown-item {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            transition: background 0.3s ease;
          }
          .dropdown-item:last-child {
            border-bottom: none;
          }
          .dropdown-item:hover {
            background: #f5f5f5;
          }
          .three-dots {
            font-size: 20px;
            cursor: pointer;
            color: #555;
            position: relative;
          }
          .three-dots-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            min-width: 150px;
            z-index: 1001;
          }
          .menu-item {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            transition: background 0.3s ease;
          }
          .menu-item:last-child {
            border-bottom: none;
          }
          .menu-item:hover {
            background: #f5f5f5;
          }
        `}
      </style>
      <header className="header">
        <div className="header-left">
          <div className="company-name" onClick={() => navigate('/')}>✈️ AirZambia.com</div>
          <nav className="nav-links">
            <span className="nav-link" onClick={() => navigate('/search-flights')}>Flights</span>
            <span className="nav-link" onClick={() => navigate('/accommodation')}>Accommodation</span>
            <span className="nav-link" onClick={() => navigate('/magazine')}>Magazine</span>
            <span className="nav-link" onClick={() => navigate('/marketplace')}>Marketplace</span>
            <span className="nav-link">Deals</span>
          </nav>
        </div>
        <div className="header-right">
          <select
            className="region-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
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
    </>
  );
};

export default Header;
