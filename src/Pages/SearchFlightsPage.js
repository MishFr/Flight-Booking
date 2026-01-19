// src/Pages/SearchFlightsPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchFlights } from '../Features/flightsSlice';

const SearchFlightsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flights, loading, error } = useSelector((state) => state.flights);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchFlights(searchData));
  };

  const handleBookFlight = (flight) => {
    navigate('/payment', { state: { item: flight, type: 'flight' } });
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .search-container {
            animation: fadeIn 0.8s ease-out;
          }
          .search-form {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .form-group {
            display: flex;
            flex-direction: column;
          }
          .form-group label {
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
          }
          .form-group input, .form-group select {
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
          }
          .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #667eea;
          }
          .search-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 200px;
            margin: 0 auto;
            display: block;
          }
          .search-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .search-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .flight-results {
            margin-top: 30px;
          }
          .flight-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 15px 0;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .flight-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(31, 38, 135, 0.5);
          }
          .flight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          .flight-number {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
          .flight-price {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
          }
          .flight-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .detail-item {
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
          .book-button {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          .book-button:hover {
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
          .loading {
            text-align: center;
            padding: 50px;
            color: #666;
            font-size: 18px;
          }
          .no-results {
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
      <div className="search-container" style={{
        minHeight: '100vh',
        background: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80) no-repeat center center / cover, linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            ✈️ Search Flights
          </h1>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group">
                <label>From</label>
                <input
                  type="text"
                  name="from"
                  value={searchData.from}
                  onChange={handleInputChange}
                  placeholder="Departure City"
                  required
                />
              </div>
              <div className="form-group">
                <label>To</label>
                <input
                  type="text"
                  name="to"
                  value={searchData.to}
                  onChange={handleInputChange}
                  placeholder="Arrival City"
                  required
                />
              </div>
              <div className="form-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  name="departureDate"
                  value={searchData.departureDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Return Date (Optional)</label>
                <input
                  type="date"
                  name="returnDate"
                  value={searchData.returnDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Passengers</label>
                <select name="passengers" value={searchData.passengers} onChange={handleInputChange}>
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                  <option value={5}>5 Passengers</option>
                </select>
              </div>
              <div className="form-group">
                <label>Class</label>
                <select name="class" value={searchData.class} onChange={handleInputChange}>
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? '🔍 Searching...' : '🔍 Search Flights'}
            </button>
          </form>

          {loading && (
            <div className="loading">
              <h2>🔍 Searching for the best flights...</h2>
              <p>Please wait while we find amazing deals for you!</p>
            </div>
          )}

          {!loading && flights.length > 0 && (
            <div className="flight-results">
              <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                ✈️ Available Flights
              </h2>
              {flights.map(flight => (
                <div key={flight.id} className="flight-card">
                  <div className="flight-header">
                    <span className="flight-number">{flight.flightNumber}</span>
                    <span className="flight-price">{flight.price}</span>
                  </div>
                  <div className="flight-details">
                    <div className="detail-item">
                      <div className="detail-label">From</div>
                      <div className="detail-value">{flight.from}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">To</div>
                      <div className="detail-value">{flight.to}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Departure</div>
                      <div className="detail-value">{flight.departureTime}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Arrival</div>
                      <div className="detail-value">{flight.arrivalTime}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Duration</div>
                      <div className="detail-value">{flight.duration}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Stops</div>
                      <div className="detail-value">{flight.stops}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button className="book-button" onClick={() => handleBookFlight(flight)}>
                      🎫 Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && flights.length === 0 && searchData.from && (
            <div className="no-results">
              <h2>No flights found</h2>
              <p>Try adjusting your search criteria or check back later for more options.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchFlightsPage;
