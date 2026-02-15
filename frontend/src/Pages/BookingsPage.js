// src/Pages/BookingsPage.js
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
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .bookings-container {
            animation: fadeIn 0.8s ease-out;
          }
          .booking-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .booking-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(31, 38, 135, 0.5);
          }
          .booking-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          .flight-number {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .status-badge {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-confirmed {
            background-color: #4CAF50;
            color: white;
          }
          .status-pending {
            background-color: #FF9800;
            color: white;
          }
          .flight-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .detail-item {
            background: rgba(255, 255, 255, 0.7);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
          }
          .detail-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .detail-value {
            font-size: 16px;
            color: #333;
            font-weight: bold;
          }
          .action-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
          }
          .action-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          .action-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .action-button.cancel {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          }
          .action-button.checkin {
            background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
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
          .no-bookings {
            text-align: center;
            padding: 50px;
            color: #666;
            font-size: 18px;
          }
        `}
      </style>
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
      <div className="bookings-container" style={{
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
            marginBottom: '30px',
            color: '#333',
            fontSize: '36px'
          }}>
            ✈️ My Flight Bookings
          </h1>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <h2>No bookings found</h2>
              <p>You haven't made any flight bookings yet. Start exploring our amazing destinations!</p>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <span className="flight-number">{booking.flight.flight_number}</span>
                  <span className={`status-badge status-${booking.payment_status.toLowerCase()}`}>
                    {booking.payment_status}
                  </span>
                </div>

                <div className="flight-details">
                  <div className="detail-item">
                    <div className="detail-label">From</div>
                    <div className="detail-value">{booking.flight.departure}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">To</div>
                    <div className="detail-value">{booking.flight.arrival}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Departure</div>
                    <div className="detail-value">{booking.flight.date}</div>
                    <div className="detail-value">{booking.flight.departure_time}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Arrival</div>
                    <div className="detail-value">{booking.flight.arrival_time}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Airline</div>
                    <div className="detail-value">{booking.flight.airline}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Seat</div>
                    <div className="detail-value">{booking.seat_number}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Booking Date</div>
                    <div className="detail-value">{booking.booking_date}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Price</div>
                    <div className="detail-value">${booking.flight.price}</div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="action-button checkin" onClick={() => handleCheckIn(booking.id)}>
                    🛫 Check-in
                  </button>
                  <button className="action-button" onClick={() => handleModify(booking.id)}>
                    ✏️ Modify
                  </button>
                  <button className="action-button cancel" onClick={() => handleCancel(booking.id)}>
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
