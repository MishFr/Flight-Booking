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
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 24px 60px',
        fontFamily: "'Inter', sans-serif",
        position: 'relative'
      }}>
        {/* Luxury Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.75) 0%, rgba(10, 22, 40, 0.85) 100%)',
        }}></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
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
              fontSize: '42px', 
              fontWeight: 700, 
              color: '#0A1628', 
              marginBottom: '12px' 
            }}>
              ✈️ Air<span style={{ color: '#D4AF37' }}>Zambia</span>.com
            </h1>
            <h2 style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontSize: '24px', 
              fontWeight: 400, 
              color: '#1a365d', 
              marginBottom: '16px' 
            }}>
              Your Ultimate Aviation Journey Starts Here
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#495057',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Seamlessly manage your bookings, discover new destinations, and soar through your travel plans with ease!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            justifyItems: 'center'
          }}>
            {[
              { icon: '🛫', title: 'My Bookings', desc: 'View and manage all your flight reservations. Check-in, modify, or cancel your upcoming trips with ease.', action: handleViewBookings, color: '#0A1628' },
              { icon: '🔍', title: 'Search Flights', desc: 'Discover amazing flight deals and explore new destinations. Find the perfect journey for your next adventure.', action: handleSearchFlights, color: '#1a365d' },
              { icon: '👤', title: 'Profile Settings', desc: 'Update your personal information, manage preferences, and customize your travel experience.', action: handleManageProfile, color: '#D4AF37' },
              { icon: '📊', title: 'Travel Insights', desc: 'Get personalized recommendations, view your travel history, and unlock exclusive deals based on your preferences.', action: handleViewInsights, color: '#0A1628' },
              { icon: '🔔', title: 'Notifications', desc: 'Stay updated with flight status changes, gate information, and special offers tailored just for you.', action: () => navigate('/notifications'), color: '#1a365d' },
              { icon: '🎫', title: 'Special Offers', desc: 'Unlock exclusive deals, seasonal promotions, and member-only discounts for your next flight.', action: () => navigate('/special-offers'), color: '#D4AF37' },
              { icon: '📍', title: 'Flight Status', desc: 'Track real-time flight status, position, altitude, and speed using live aviation data.', action: handleFlightStatus, color: '#0A1628' },
              { icon: '🛡️', title: 'Travel Insurance', desc: 'Protect your journey with comprehensive travel insurance covering trip cancellations, medical emergencies, and lost baggage.', action: () => window.open('https://www.allianztravelinsurance.com/', '_blank'), color: '#1a365d', link: 'https://www.allianztravelinsurance.com/travel-insurance-plans' },
              { icon: '🏆', title: 'Loyalty Program', desc: 'Join our rewards program to earn points on every flight, redeem for free tickets, upgrades, and exclusive perks.', action: () => window.open('https://www.delta.com/us/en/skymiles/medallion-program/overview', '_blank'), color: '#D4AF37', link: 'https://www.delta.com/us/en/skymiles/medallion-program/overview' },
              { icon: '📞', title: 'Customer Support', desc: 'Get 24/7 assistance with your bookings, travel queries, and any issues. Our support team is here to help.', action: () => window.open('https://www.aa.com/i18n/customer-service/support/main.jsp', '_blank'), color: '#0A1628', link: 'https://www.aa.com/i18n/customer-service/support/main.jsp' },
              { icon: '🏢', title: 'Airport Information', desc: 'Access detailed information about airports worldwide, including terminals, services, and travel tips.', action: () => window.open('https://www.faa.gov/airports/', '_blank'), color: '#1a365d', link: 'https://www.faa.gov/airports/' }
            ].map((item, index) => (
              <div 
                key={index}
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  margin: '8px 0',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '340px',
                  position: 'relative',
                  overflow: 'hidden'
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
                {/* Gold accent on hover */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #D4AF37, #FFD700)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.4s ease'
                }} className="gold-bar"></div>
                
                <h2 style={{ 
                  color: item.color, 
                  marginBottom: '16px', 
                  fontSize: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600
                }}>
                  <span style={{ fontSize: '28px' }}>{item.icon}</span>
                  {item.title}
                </h2>
                <p style={{ 
                  color: '#495057', 
                  fontSize: '14px', 
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>
                  {item.desc}
                </p>
                <button 
                  onClick={item.action}
                  style={{
                    background: item.color === '#D4AF37' 
                      ? 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' 
                      : 'linear-gradient(135deg, #0A1628 0%, #1a365d 100%)',
                    color: item.color === '#D4AF37' ? '#0A1628' : 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.5px'
                  }}
                >
                  {item.title === 'Travel Insurance' || item.title === 'Loyalty Program' || item.title === 'Customer Support' || item.title === 'Airport Information' ? 'Learn More' : 'View Details'}
                </button>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      display: 'block',
                      marginTop: '12px', 
                      color: '#D4AF37', 
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    Learn More →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

