// src/Pages/NotificationsPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from '../Features/notificationsSlice';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { offers: specialOffers } = useSelector((state) => state.specialOffers);

  // Placeholder data for flightStatusChanges and gateInformation
  const flightStatusChanges = [];
  const gateInformation = [];

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .notifications-container {
            animation: fadeIn 0.8s ease-out;
          }
          .notification-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .notification-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(31, 38, 135, 0.5);
          }
          .notification-card h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 20px;
          }
          .notification-card p {
            color: #666;
            font-size: 14px;
            line-height: 1.5;
          }
          .back-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          .back-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .section-title {
            font-size: 28px;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
          }
          .list-item {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      <div className="notifications-container" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <button className="back-button" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>

          <h1 className="section-title">🔔 Notifications</h1>

          <div className="notification-card">
            <h3>✈️ Flight Status Changes</h3>
            {flightStatusChanges.map((item, index) => (
              <div key={index} className="list-item">
                <p><strong>Flight {item.flight}:</strong> {item.status} at {item.time}</p>
              </div>
            ))}
          </div>

          <div className="notification-card">
            <h3>🚪 Gate Information</h3>
            {gateInformation.map((item, index) => (
              <div key={index} className="list-item">
                <p><strong>Flight {item.flight}:</strong> Gate {item.gate} at {item.time}</p>
              </div>
            ))}
          </div>

          <div className="notification-card">
            <h3>🎁 Special Offers Tailored for You</h3>
            {specialOffers.map((offer, index) => (
              <div key={index} className="list-item">
                <h4>{offer.title}</h4>
                <p>{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
