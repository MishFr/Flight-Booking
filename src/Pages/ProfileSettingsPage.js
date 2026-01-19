import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../Features/authSlice';
import { useNavigate } from 'react-router-dom';

const ProfileSettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePicture: user?.profilePicture || '',
  });

  const [preferences, setPreferences] = useState({
    notifications: user?.preferences?.notifications || false,
    seatPreference: user?.preferences?.seatPreference || 'window',
    mealPreference: user?.preferences?.mealPreference || 'vegetarian',
  });

  const [customization, setCustomization] = useState({
    theme: user?.customization?.theme || 'light',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({ ...preferences, [name]: type === 'checkbox' ? checked : value });
  };

  const handleCustomizationChange = (e) => {
    const { name, value } = e.target;
    setCustomization({ ...customization, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({ ...profileData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...profileData,
      preferences,
      customization,
    };
    dispatch(updateProfile(updatedUser));
    alert('Profile updated successfully!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Profile Settings</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile Information */}
          <div>
            <h2>Profile Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={profileData.name}
                onChange={handleProfileChange}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={profileData.email}
                onChange={handleProfileChange}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={profileData.phone}
                onChange={handleProfileChange}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <div>
                <label>Profile Picture:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ marginTop: '5px' }}
                />
                {profileData.profilePicture && (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2>Preferences</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={preferences.notifications}
                  onChange={handlePreferencesChange}
                />
                Enable Notifications
              </label>
              <select
                name="seatPreference"
                value={preferences.seatPreference}
                onChange={handlePreferencesChange}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="window">Window Seat</option>
                <option value="aisle">Aisle Seat</option>
                <option value="middle">Middle Seat</option>
              </select>
              <select
                name="mealPreference"
                value={preferences.mealPreference}
                onChange={handlePreferencesChange}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
          </div>

          {/* Customization */}
          <div>
            <h2>Customize Travel Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select
                name="theme"
                value={customization.theme}
                onChange={handleCustomizationChange}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#ccc',
                color: '#333',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
