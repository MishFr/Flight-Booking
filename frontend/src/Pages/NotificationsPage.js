import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from '../Features/notificationsSlice';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { offers: specialOffers } = useSelector((state) => state.specialOffers);

  const flightStatusChanges = [];
  const gateInformation = [];

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          background: '#0A1628',
          color: 'white',
          border: '1px solid #D4AF37',
          padding: '12px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      >
        ← Back to Dashboard
      </button>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1628 0%, #1a365d 50%, #0A1628 100%)',
        padding: '100px 24px 60px',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 16px 64px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gold Top Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #D4AF37, #FFD700, #B8860B)'
          }}></div>

          <h1 style={{
            textAlign: 'center',
            marginBottom: '36px',
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#0A1628'
          }}>
            🔔 Notifications
          </h1>

          {/* Flight Status Changes */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
            borderRadius: '16px',
            padding: '24px',
            margin: '20px 0',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = '#D4AF37';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
          }}
          >
            <h3 style={{ 
              color: '#0A1628', 
              marginBottom: '16px', 
              fontSize: '22px',
              fontFamily: "'Playfair Display', serif",
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '28px' }}>✈️</span> Flight Status Changes
            </h3>
            {flightStatusChanges.length === 0 ? (
              <p style={{ color: '#6C757D', fontSize: '15px' }}>No flight status changes at this time.</p>
            ) : (
              flightStatusChanges.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '16px',
                    borderRadius: '12px',
                    margin: '10px 0',
                    border: '1px solid #E9ECEF'
                  }}
                >
                  <p style={{ margin: 0, color: '#495057', fontSize: '15px' }}>
                    <strong style={{ color: '#0A1628' }}>Flight {item.flight}:</strong> {item.status} at {item.time}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Gate Information */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
            borderRadius: '16px',
            padding: '24px',
            margin: '20px 0',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = '#D4AF37';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
          }}
          >
            <h3 style={{ 
              color: '#0A1628', 
              marginBottom: '16px', 
              fontSize: '22px',
              fontFamily: "'Playfair Display', serif",
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '28px' }}>🚪</span> Gate Information
            </h3>
            {gateInformation.length === 0 ? (
              <p style={{ color: '#6C757D', fontSize: '15px' }}>No gate information updates at this time.</p>
            ) : (
              gateInformation.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '16px',
                    borderRadius: '12px',
                    margin: '10px 0',
                    border: '1px solid #E9ECEF'
                  }}
                >
                  <p style={{ margin: 0, color: '#495057', fontSize: '15px' }}>
                    <strong style={{ color: '#0A1628' }}>Flight {item.flight}:</strong> Gate {item.gate} at {item.time}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Special Offers */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
            borderRadius: '16px',
            padding: '24px',
            margin: '20px 0',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = '#D4AF37';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
          }}
          >
            <h3 style={{ 
              color: '#0A1628', 
              marginBottom: '16px', 
              fontSize: '22px',
              fontFamily: "'Playfair Display', serif",
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '28px' }}>🎁</span> Special Offers Tailored for You
            </h3>
            {specialOffers && specialOffers.length > 0 ? (
              specialOffers.map((offer, index) => (
                <div 
                  key={index}
                  style={{
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
                    padding: '18px',
                    borderRadius: '12px',
                    margin: '12px 0',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}
                >
                  <h4 style={{ color: '#0A1628', margin: '0 0 8px', fontSize: '17px', fontWeight: 600 }}>{offer.title}</h4>
                  <p style={{ color: '#495057', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{offer.description}</p>
                </div>
              ))
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #E9ECEF'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
                <p style={{ color: '#6C757D', margin: 0, fontSize: '15px' }}>No special offers available at the moment.</p>
                <button 
                  onClick={() => navigate('/special-offers')}
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                    color: '#0A1628',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  Browse All Offers
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;

