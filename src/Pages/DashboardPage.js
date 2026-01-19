// src/pages/DashboardPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleViewBookings = () => {
    navigate('/bookings');
  };

  const handleSearchFlights = () => {
    navigate('/search-flights');
  };

  const handleManageProfile = () => {
    navigate('/profile-settings');
  };

  const handleViewInsights = () => {
    navigate('/travel-insights');
  };

  const handleFlightStatus = () => {
    navigate('/flight-status');
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .dashboard-container {
            animation: fadeIn 0.8s ease-out;
          }
          .card {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 15px;
            padding: 15px;
            margin: 15px 0;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(31, 38, 135, 0.5);
          }
          .card h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 20px;
            display: flex;
            align-items: center;
          }
          .card p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
          }
          .action-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin: 5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          .action-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .header-section {
            text-align: center;
            margin-bottom: 30px;
          }
          .header-section h1 {
            font-size: 36px;
            color: #333;
            margin-bottom: 10px;
          }
          .header-section h2 {
            font-size: 24px;
            color: #667eea;
            margin-bottom: 15px;
            font-weight: 300;
          }
          .header-section p {
            font-size: 18px;
            color: #666;
          }
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            justify-items: center;
          }
        `}
      </style>
      <div className="dashboard-container" style={{
        minHeight: '100vh',
        background: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
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
          <div className="header-section">
            <h1>✈️ AirZambia.com</h1>
            <h2>Your Ultimate Aviation Journey Starts Here</h2>
            <p>Seamlessly manage your bookings, discover new destinations, and soar through your travel plans with ease!</p>
          </div>

          <div className="cards-grid">
            <div className="card">
              <h2>🛫 My Bookings</h2>
              <p>View and manage all your flight reservations. Check-in, modify, or cancel your upcoming trips with ease.</p>
              <button className="action-button" onClick={handleViewBookings}>View Bookings</button>
            </div>

            <div className="card">
              <h2>🔍 Search Flights</h2>
              <p>Discover amazing flight deals and explore new destinations. Find the perfect journey for your next adventure.</p>
              <button className="action-button" onClick={handleSearchFlights}>Search Now</button>
            </div>

            <div className="card">
              <h2>👤 Profile Settings</h2>
              <p>Update your personal information, manage preferences, and customize your travel experience.</p>
              <button className="action-button" onClick={handleManageProfile}>Manage Profile</button>
            </div>

            <div className="card">
              <h2>📊 Travel Insights</h2>
              <p>Get personalized recommendations, view your travel history, and unlock exclusive deals based on your preferences.</p>
              <button className="action-button" onClick={handleViewInsights}>View Insights</button>
            </div>

            <div className="card">
              <h2>🔔 Notifications</h2>
              <p>Stay updated with flight status changes, gate information, and special offers tailored just for you.</p>
              <button className="action-button" onClick={() => navigate('/notifications')}>Check Notifications</button>
            </div>

            <div className="card">
              <h2>🎫 Special Offers</h2>
              <p>Unlock exclusive deals, seasonal promotions, and member-only discounts for your next flight.</p>
              <button className="action-button" onClick={() => navigate('/special-offers')}>View Offers</button>
            </div>

            <div className="card">
              <h2>📍 Flight Status</h2>
              <p>Track real-time flight status, position, altitude, and speed using live aviation data.</p>
              <button className="action-button" onClick={handleFlightStatus}>Check Status</button>
            </div>

            <div className="card">
              <h2>🛡️ Travel Insurance</h2>
              <p>Protect your journey with comprehensive travel insurance covering trip cancellations, medical emergencies, and lost baggage.</p>
              <button className="action-button" onClick={() => window.open('https://www.allianztravelinsurance.com/', '_blank')}>Get Insurance</button>
              <br />
              <a href="https://www.allianztravelinsurance.com/travel-insurance-plans" target="_blank" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Learn More</a>
            </div>

            <div className="card">
              <h2>🏆 Loyalty Program</h2>
              <p>Join our rewards program to earn points on every flight, redeem for free tickets, upgrades, and exclusive perks.</p>
              <button className="action-button" onClick={() => window.open('https://www.delta.com/us/en/skymiles/medallion-program/overview', '_blank')}>Join Now</button>
              <br />
              <a href="https://www.delta.com/us/en/skymiles/medallion-program/overview" target="_blank" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Learn More</a>
            </div>

            <div className="card">
              <h2>📞 Customer Support</h2>
              <p>Get 24/7 assistance with your bookings, travel queries, and any issues. Our support team is here to help.</p>
              <button className="action-button" onClick={() => window.open('https://www.aa.com/i18n/customer-service/support/main.jsp', '_blank')}>Contact Support</button>
              <br />
              <a href="https://www.aa.com/i18n/customer-service/support/main.jsp" target="_blank" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Learn More</a>
            </div>

            <div className="card">
              <h2>🏢 Airport Information</h2>
              <p>Access detailed information about airports worldwide, including terminals, services, and travel tips.</p>
              <button className="action-button" onClick={() => window.open('https://www.faa.gov/airports/', '_blank')}>Explore Airports</button>
              <br />
              <a href="https://www.faa.gov/airports/" target="_blank" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Learn More</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
