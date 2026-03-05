import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TravelInsightsPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [travelHistory, setTravelHistory] = useState([]);

  useEffect(() => {
    const fetchTravelHistory = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/bookings/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const bookings = await response.json();
          const history = bookings.map(booking => ({
            id: booking.id,
            destination: booking.flight.arrival,
            date: booking.flight.date,
            airline: booking.flight.airline,
            rating: 4.5,
            feedback: 'Flight completed successfully.'
          }));
          setTravelHistory(history);
        }
      } catch (error) {
        console.error('Error fetching travel history:', error);
      }
    };
    if (user) fetchTravelHistory();
  }, [user]);

  const { recommendations, exclusiveDeals } = useSelector((state) => state.travelInsights);

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
          maxWidth: '1200px',
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
            marginBottom: '12px',
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#0A1628'
          }}>
            📊 Travel Insights
          </h1>
          <p style={{
            textAlign: 'center',
            marginBottom: '32px',
            color: '#495057',
            fontSize: '18px'
          }}>
            Personalized recommendations, travel history, and exclusive deals tailored for {user?.name || 'you'}
          </p>

          {/* Tab Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { id: 'recommendations', label: '🧭 Recommendations' },
              { id: 'history', label: '📚 Travel History' },
              { id: 'deals', label: '🎁 Exclusive Deals' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  color: activeTab === tab.id ? '#0A1628' : '#495057',
                  border: activeTab === tab.id ? 'none' : '2px solid #E9ECEF',
                  padding: '14px 28px',
                  borderRadius: '30px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === tab.id ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'recommendations' && (
            <div>
              <h2 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: "'Playfair Display', serif", color: '#0A1628', fontSize: '24px' }}>
                🧭 Personalized Recommendations
              </h2>
              {recommendations.map(rec => (
                <div 
                  key={rec.id}
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    margin: '16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <div style={{ fontSize: '48px' }}>{rec.image}</div>
                    <div>
                      <h3 style={{ margin: '0 0 8px', color: '#0A1628', fontSize: '20px', fontFamily: "'Playfair Display', serif" }}>{rec.destination}</h3>
                      <p style={{ margin: '0 0 8px', color: '#495057', fontSize: '15px' }}>{rec.reason}</p>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#D4AF37' }}>{rec.price}</p>
                    </div>
                  </div>
                  <button 
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                      color: '#0A1628',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: "'Playfair Display', serif", color: '#0A1628', fontSize: '24px' }}>
                📚 Your Travel History
              </h2>
              {travelHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6C757D' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✈️</div>
                  <p>No travel history yet. Start your journey with us!</p>
                </div>
              ) : (
                travelHistory.map(trip => (
                  <div 
                    key={trip.id}
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
                      borderRadius: '16px',
                      padding: '24px',
                      margin: '16px 0',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.15)'
                    }}
                  >
                    <h3 style={{ margin: '0 0 12px', color: '#0A1628', fontSize: '20px', fontFamily: "'Playfair Display', serif" }}>{trip.destination}</h3>
                    <p style={{ margin: '0 0 6px', color: '#495057', fontSize: '14px' }}>Date: {trip.date}</p>
                    <p style={{ margin: '0 0 6px', color: '#495057', fontSize: '14px' }}>Airline: {trip.airline}</p>
                    <p style={{ margin: '0 0 12px', color: '#6C757D', fontSize: '14px', fontStyle: 'italic' }}>"{trip.feedback}"</p>
                    <div style={{ color: '#D4AF37', fontSize: '18px' }}>
                      {'★'.repeat(Math.floor(trip.rating))}{'☆'.repeat(5 - Math.floor(trip.rating))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'deals' && (
            <div>
              <h2 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: "'Playfair Display', serif", color: '#0A1628', fontSize: '24px' }}>
                🎁 Exclusive Deals
              </h2>
              {exclusiveDeals.map(deal => (
                <div 
                  key={deal.id}
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    margin: '16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#D4AF37';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px', color: '#0A1628', fontSize: '20px', fontFamily: "'Playfair Display', serif" }}>{deal.title}</h3>
                    <p style={{ margin: '0 0 8px', color: '#495057', fontSize: '15px' }}>{deal.description}</p>
                    <p style={{ margin: '0 0 12px', color: '#6C757D', fontSize: '13px' }}>Valid until: {deal.validUntil}</p>
                    <span style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 700
                    }}>
                      {deal.discount}
                    </span>
                  </div>
                  <button 
                    style={{
                      background: 'linear-gradient(135deg, #0A1628 0%, #1a365d 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Claim Deal
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TravelInsightsPage;

