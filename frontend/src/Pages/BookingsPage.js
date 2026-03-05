import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, cancelBooking } from '../Features/bookingsSlice';

const BookingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleModify = (bookingId) => {
    alert(`Modify booking ${bookingId} - Feature coming soon!`);
  };

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const handleCheckIn = (bookingId) => {
    alert(`Check-in for booking ${bookingId} - Feature coming soon!`);
  };

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
          fontWeight: '600',
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
            marginBottom: '36px',
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#0A1628'
          }}>
            ✈️ My Flight Bookings
          </h1>

          {bookings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#495057',
              fontSize: '18px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎫</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', marginBottom: '12px' }}>No bookings found</h2>
              <p>You haven't made any flight bookings yet. Start exploring our amazing destinations!</p>
              <button 
                onClick={() => navigate('/search-flights')}
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  color: '#0A1628',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '24px',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                }}
              >
                Search Flights
              </button>
            </div>
          ) : (
            bookings.map(booking => (
              <div 
                key={booking.id} 
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
                  borderRadius: '16px',
                  padding: '28px',
                  margin: '24px 0',
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  borderBottom: '2px solid #D4AF37',
                  paddingBottom: '16px'
                }}>
                  <span style={{ fontSize: '26px', fontWeight: 700, color: '#0A1628', fontFamily: "'Playfair Display', serif" }}>
                    {booking.flight.flight_number}
                  </span>
                  <span style={{
                    padding: '6px 18px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: booking.payment_status.toLowerCase() === 'paid' || booking.payment_status.toLowerCase() === 'confirmed'
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: 'white',
                    letterSpacing: '0.5px'
                  }}>
                    {booking.payment_status}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  {[
                    { label: 'From', value: booking.flight.departure },
                    { label: 'To', value: booking.flight.arrival },
                    { label: 'Departure', value: booking.flight.date },
                    { label: 'Departure Time', value: booking.flight.departure_time },
                    { label: 'Arrival Time', value: booking.flight.arrival_time },
                    { label: 'Airline', value: booking.flight.airline },
                    { label: 'Seat', value: booking.seat_number },
                    { label: 'Booking Date', value: booking.booking_date },
                    { label: 'Price', value: `$${booking.flight.price}` }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '16px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid #E9ECEF'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#6C757D', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '16px', color: '#0A1628', fontWeight: 600 }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleCheckIn(booking.id)}
                    style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    🛫 Check-in
                  </button>
                  <button 
                    onClick={() => handleModify(booking.id)}
                    style={{
                      background: 'linear-gradient(135deg, #0A1628 0%, #1a365d 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    ✏️ Modify
                  </button>
                  <button 
                    onClick={() => handleCancel(booking.id)}
                    style={{
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;

