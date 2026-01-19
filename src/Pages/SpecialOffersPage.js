import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecialOffers } from '../Features/specialOffersSlice';

const SpecialOffersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { offers, loading, error } = useSelector((state) => state.specialOffers);

  useEffect(() => {
    dispatch(fetchSpecialOffers());
  }, [dispatch]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .offers-container {
            animation: fadeIn 0.8s ease-out;
          }
          .offer-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 15px 0;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .offer-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(31, 38, 135, 0.5);
          }
          .offer-card h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 24px;
            display: flex;
            align-items: center;
          }
          .offer-card p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
          }
          .offer-card ul {
            list-style-type: none;
            padding: 0;
          }
          .offer-card li {
            margin: 10px 0;
            padding: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 8px;
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
          .offers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            justify-items: center;
          }
        `}
      </style>
      <div className="offers-container" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            <h1>🎫 Special Offers</h1>
            <h2>Exclusive Deals Await You</h2>
            <p>Discover amazing discounts, seasonal promotions, and member-only perks to make your travels unforgettable!</p>
          </div>

          <div className="offers-grid">
            {offers.map(offer => (
              <div key={offer.id} className="offer-card">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <p><strong>Discount:</strong> {offer.discount}</p>
                <p><strong>Valid Until:</strong> {offer.valid_until}</p>
                <button className="action-button">Claim Deal</button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button className="action-button" onClick={handleBackToDashboard}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialOffersPage;
