import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../Features/bookingsSlice';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { item, type } = location.state || {};
  const { user } = useSelector((state) => state.auth);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    if (!visaRegex.test(paymentData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid Visa card number';
    }

    if (!paymentData.expiryMonth || !paymentData.expiryYear) {
      newErrors.expiry = 'Please select expiry date';
    } else {
      const currentDate = new Date();
      const expiryDate = new Date(2000 + parseInt(paymentData.expiryYear), parseInt(paymentData.expiryMonth) - 1);
      if (expiryDate < currentDate) {
        newErrors.expiry = 'Card has expired';
      }
    }

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!paymentData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }

    if (!paymentData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!paymentData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    if (!paymentData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (type === 'flight' && user && item.id) {
        await dispatch(createBooking({
          user_id: user.id,
          flight_id: item.id,
          payment_status: 'paid'
        })).unwrap();
      }
      alert('Payment successful! Your booking has been confirmed.');
      navigate('/dashboard');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!item) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A1628 0%, #1a365d 100%)',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ 
          background: 'white', 
          padding: '48px', 
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 16px 64px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💳</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', marginBottom: '12px' }}>No item selected</h2>
          <p style={{ color: '#6C757D', marginBottom: '24px' }}>Please select a flight to proceed with payment</p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
              color: '#0A1628',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <button 
        onClick={() => navigate(-1)}
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
        ← Back
      </button>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1628 0%, #1a365d 50%, #0A1628 100%)',
        padding: '100px 24px 60px',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          maxWidth: '800px',
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
            marginBottom: '32px',
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#0A1628'
          }}>
            💳 Secure Payment
          </h1>

          {/* Visa Logo */}
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #1a1f71 0%, #003d82 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '20px',
            marginBottom: '28px',
            letterSpacing: '2px'
          }}>
            VISA ACCEPTED HERE
          </div>

          {/* Booking Summary */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(248,249,250,0.98) 0%, rgba(233,236,239,0.95) 100%)',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '28px',
            border: '1px solid rgba(212, 175, 55, 0.15)'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', marginBottom: '16px', fontSize: '20px' }}>Booking Summary</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <p style={{ color: '#495057', margin: 0 }}>
                <strong style={{ color: '#0A1628' }}>Type:</strong> {type === 'flight' ? '✈️ Flight' : '🏨 Accommodation'}
              </p>
              {type === 'flight' ? (
                <>
                  <p style={{ color: '#495057', margin: 0 }}>
                    <strong style={{ color: '#0A1628' }}>Flight:</strong> {item.flightNumber}
                  </p>
                  <p style={{ color: '#495057', margin: 0 }}>
                    <strong style={{ color: '#0A1628' }}>Route:</strong> {item.from} → {item.to}
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: '#495057', margin: 0 }}>
                    <strong style={{ color: '#0A1628' }}>Accommodation:</strong> {item.name}
                  </p>
                  <p style={{ color: '#495057', margin: 0 }}>
                    <strong style={{ color: '#0A1628' }}>Location:</strong> {item.location}
                  </p>
                </>
              )}
              <p style={{ color: '#0A1628', margin: '8px 0 0', fontSize: '20px', fontWeight: 700 }}>
                <strong>Total Price:</strong> {item.price}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', marginBottom: '20px', fontSize: '20px' }}>Visa Card Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.cardNumber ? '2px solid #EF4444' : '2px solid #E9ECEF',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  required
                />
                {errors.cardNumber && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.cardNumber}</span>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={paymentData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.cardholderName ? '2px solid #EF4444' : '2px solid #E9ECEF',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  required
                />
                {errors.cardholderName && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.cardholderName}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>Expiry Date</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    name="expiryMonth"
                    value={paymentData.expiryMonth}
                    onChange={handleInputChange}
                    style={{
                      flex: 1,
                      padding: '14px',
                      border: errors.expiry ? '2px solid #EF4444' : '2px solid #E9ECEF',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'white'
                    }}
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    name="expiryYear"
                    value={paymentData.expiryYear}
                    onChange={handleInputChange}
                    style={{
                      flex: 1,
                      padding: '14px',
                      border: errors.expiry ? '2px solid #EF4444' : '2px solid #E9ECEF',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'white'
                    }}
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                        {new Date().getFullYear() + i}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.expiry && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.expiry}</span>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.cvv ? '2px solid #EF4444' : '2px solid #E9ECEF',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  required
                />
                {errors.cvv && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.cvv}</span>}
              </div>
            </div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', marginTop: '32px', marginBottom: '20px', fontSize: '20px' }}>Billing Address</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>Address</label>
                <input
                  type="text"
                  name="billingAddress"
                  value={paymentData.billingAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.billingAddress ? '2px solid #EF4444' : '2px solid #E9ECEF',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>City</label>
                <input
                  type="text"
                  name="city"
                  value={paymentData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.city ? '2px solid #EF4444' : '2px solid #E9ECEF',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={paymentData.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.zipCode ? '2px solid #EF4444' : '2px solid #E9ECEF',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>Country</label>
                <input
                  type="text"
                  name="country"
                  value={paymentData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.country ? '2px solid #EF4444' : '2px solid #E9ECEF',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                  required
                />
              </div>
            </div>

            {processing ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  border: '4px solid #E9ECEF', 
                  borderTop: '4px solid #D4AF37', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px'
                }}></div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', marginBottom: '12px' }}>Processing Payment...</h3>
                <p style={{ color: '#6C757D' }}>Please wait while we securely process your Visa payment.</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <button 
                type="submit" 
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
                  color: '#0A1628',
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  maxWidth: '320px',
                  margin: '0 auto',
                  display: 'block',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
                  letterSpacing: '0.5px'
                }}
              >
                💳 Pay with Visa
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;

