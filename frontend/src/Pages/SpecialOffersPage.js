import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecialOffers } from '../Features/specialOffersSlice';

const SpecialOffersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { offers } = useSelector((state) => state.specialOffers);

  useEffect(() => {
    dispatch(fetchSpecialOffers());
  }, [dispatch]);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
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

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: '36px', 
              fontWeight: 700, 
              color: '#0A1628', 
              marginBottom: '12px' 
            }}>
              🎫 Special Offers
            </h1>
            <h2 style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontSize: '22px', 
              fontWeight: 400, 
              color: '#1a365d', 
              marginBottom: '16px' 
            }}>
              Exclusive Deals Await You
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#495057',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover amazing discounts, seasonal promotions, and member-only perks to make your travels unforgettable!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '24px',
            justifyItems: 'center'
          }}>
            {offers.map(offer => (
              <div 
                key={offer.id}
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
                  borderRadius: '16px',
                  padding: '28px',
                  margin: '8px 0',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 48px rgba(0, 0, 0, 0.2)';
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
                  {offer.title}
                </h3>
                <p style={{ 
                  color: '#495057', 
                  fontSize: '15px', 
                  lineHeight: '1.7',
                  marginBottom: '16px'
                }}>
                  {offer.description}
                </p>
                <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
                  <p style={{ color: '#0A1628', margin: 0, fontSize: '15px', fontWeight: 600 }}>
                    <strong>Discount:</strong> {offer.discount}
                  </p>
                  <p style={{ color: '#6C757D', margin: 0, fontSize: '14px' }}>
                    <strong>Valid Until:</strong> {offer.valid_until}
                  </p>
                </div>
                <button 
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                    color: '#0A1628',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  Claim Deal
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(135deg, #0A1628 0%, #1a365d 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialOffersPage;

