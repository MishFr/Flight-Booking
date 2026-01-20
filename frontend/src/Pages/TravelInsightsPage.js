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
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const bookings = await response.json();
          const history = bookings.map(booking => ({
            id: booking.id,
            destination: booking.flight.arrival,
            date: booking.flight.date,
            airline: booking.flight.airline,
            rating: 4.5, // Placeholder, could be added to model later
            feedback: 'Flight completed successfully.'
          }));
          setTravelHistory(history);
        }
      } catch (error) {
        console.error('Error fetching travel history:', error);
      }
    };

    if (user) {
      fetchTravelHistory();
    }
  }, [user]);

  const { recommendations, exclusiveDeals } = useSelector((state) => state.travelInsights);

  const handleBookRecommendation = (destination) => {
    alert(`Booking recommendation for ${destination} - Feature coming soon!`);
  };

  const handleClaimDeal = (dealTitle) => {
    alert(`Claiming deal: ${dealTitle} - Feature coming soon!`);
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .insights-container {
            animation: fadeIn 0.8s ease-out;
          }
          .tab-buttons {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
          }
          .tab-button {
            background: rgba(255, 255, 255, 0.8);
            border: none;
            padding: 12px 24px;
            margin: 0 5px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .tab-button.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .tab-button:hover {
            transform: scale(1.05);
          }
          .content-section {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .content-section:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(31, 38, 135, 0.5);
          }
          .recommendation-card, .history-card, .deal-card {
            background: rgba(255, 255, 255, 0.7);
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .recommendation-info, .history-info, .deal-info {
            flex: 1;
          }
          .recommendation-image {
            font-size: 48px;
            margin-right: 20px;
          }
          .action-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .action-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
          }
          .back-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .rating {
            color: #ffd700;
            font-size: 18px;
          }
          .discount-badge {
            background: #4CAF50;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
          }
        `}
      </style>
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
      <div className="insights-container" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px 20px',
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
          <h1 style={{
            textAlign: 'center',
            marginBottom: '10px',
            color: '#333',
            fontSize: '36px'
          }}>
            📊 Travel Insights
          </h1>
          <p style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#666',
            fontSize: '18px'
          }}>
            Personalized recommendations, travel history, and exclusive deals tailored for {user?.name || 'you'}
          </p>

          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              🧭 Recommendations
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📚 Travel History
            </button>
            <button
              className={`tab-button ${activeTab === 'deals' ? 'active' : ''}`}
              onClick={() => setActiveTab('deals')}
            >
              🎁 Exclusive Deals
            </button>
          </div>

          {activeTab === 'recommendations' && (
            <div className="content-section">
              <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                🧭 Personalized Recommendations
              </h2>
              {recommendations.map(rec => (
                <div key={rec.id} className="recommendation-card">
                  <div className="recommendation-image">{rec.image}</div>
                  <div className="recommendation-info">
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{rec.destination}</h3>
                    <p style={{ margin: '0 0 10px 0', color: '#666' }}>{rec.reason}</p>
                    <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>{rec.price}</p>
                  </div>
                  <button className="action-button" onClick={() => handleBookRecommendation(rec.destination)}>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="content-section">
              <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                📚 Your Travel History
              </h2>
              {travelHistory.map(trip => (
                <div key={trip.id} className="history-card">
                  <div className="history-info">
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{trip.destination}</h3>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Date: {trip.date}</p>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Airline: {trip.airline}</p>
                    <p style={{ margin: '0 0 10px 0', color: '#666' }}>"{trip.feedback}"</p>
                    <div className="rating">{'★'.repeat(Math.floor(trip.rating))}{'☆'.repeat(5 - Math.floor(trip.rating))}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="content-section">
              <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                🎁 Exclusive Deals
              </h2>
              {exclusiveDeals.map(deal => (
                <div key={deal.id} className="deal-card">
                  <div className="deal-info">
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{deal.title}</h3>
                    <p style={{ margin: '0 0 10px 0', color: '#666' }}>{deal.description}</p>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Valid until: {deal.validUntil}</p>
                    <span className="discount-badge">{deal.discount}</span>
                  </div>
                  <button className="action-button" onClick={() => handleClaimDeal(deal.title)}>
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
