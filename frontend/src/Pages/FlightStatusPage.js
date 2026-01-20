import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFlightStatus } from '../Features/flightsSlice';

const Hourglass = () => (
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '60px',
    height: '80px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    zIndex: 10
  }}>
    <div style={{
      width: '40px',
      height: '20px',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '50% 50% 0 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
        animation: 'sandFall 3s linear infinite'
      }}></div>
    </div>
    <div style={{
      width: '2px',
      height: '20px',
      background: 'rgba(255,255,255,0.5)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        width: '100%',
        height: '50%',
        background: 'rgba(255,255,255,0.8)',
        animation: 'sandFlow 3s linear infinite'
      }}></div>
    </div>
    <div style={{
      width: '40px',
      height: '20px',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '0 0 50% 50%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
        animation: 'sandRise 3s linear infinite'
      }}></div>
    </div>
    <style>{`
      @keyframes sandFall {
        0% { height: 0%; }
        50% { height: 100%; }
        100% { height: 0%; }
      }
      @keyframes sandFlow {
        0% { top: 0%; height: 50%; }
        50% { top: 50%; height: 0%; }
        100% { top: 0%; height: 50%; }
      }
      @keyframes sandRise {
        0% { height: 0%; }
        50% { height: 100%; }
        100% { height: 0%; }
      }
    `}</style>
  </div>
);

const FlightStatusPage = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const dispatch = useDispatch();
  const { currentFlight, loading, error } = useSelector((state) => state.flights);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (flightNumber.trim()) {
      dispatch(getFlightStatus(flightNumber.trim()));
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Hourglass />
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2.5em', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Flight Status</h2>
      <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.2em' }}>Enter your flight number to check the status.</p>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
        <input
          type="text"
          placeholder="Flight Number (e.g., AA123)"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          style={{
            padding: '15px',
            width: '100%',
            marginBottom: '15px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1em',
            background: 'rgba(255,255,255,0.9)',
            color: '#333'
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1em',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            width: '100%'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </form>
      {error && <p style={{ color: '#ff6b6b', textAlign: 'center', fontSize: '1.1em' }}>Error: {error}</p>}
      {currentFlight && (
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.8em', textAlign: 'center' }}>Flight Details</h3>
          <p style={{ marginBottom: '10px' }}><strong>Flight Number:</strong> {currentFlight.flight_number}</p>
          <p style={{ marginBottom: '10px' }}><strong>Departure:</strong> {currentFlight.departure}</p>
          <p style={{ marginBottom: '10px' }}><strong>Arrival:</strong> {currentFlight.arrival}</p>
          <p style={{ marginBottom: '10px' }}><strong>Scheduled Departure:</strong> {new Date(currentFlight.date).toLocaleString()}</p>
          <p style={{ marginBottom: '10px' }}><strong>Status:</strong> <span style={{
            color: currentFlight.status === 'on-time' ? '#51cf66' : '#ff6b6b',
            fontWeight: 'bold'
          }}>{currentFlight.status}</span></p>
          <p style={{ marginBottom: '10px' }}><strong>Price:</strong> ${currentFlight.price}</p>
          <p><strong>Available:</strong> {currentFlight.availability ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default FlightStatusPage;
