import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../Features/bookingsSlice';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { item, type } = location.state || {}; // item could be flight or accommodation, type indicates which
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
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Visa card validation (starts with 4, 13-19 digits)
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

    if ((!paymentData.cardholderName.trim()) && (!paymentData.billingAddress.trim())) {
      newErrors.cardholderName = 'Cardholder name is required';
      newErrors.billingAddress = 'Billing address is required';
    }

    if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
    if (errors.cardNumber) {
      setErrors(prev => ({
        ...prev,
        cardNumber: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking after successful payment
      if (type === 'flight' && user && item.id) {
        await dispatch(createBooking({
          user_id: user.id,
          flight_id: item.id,
          payment_status: 'paid'
        })).unwrap();
      }

      // Here you would integrate with actual payment processor
      alert('Payment successful! Your booking has been confirmed.');

      // Navigate back to dashboard or bookings page
      navigate('/dashboard');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>No item selected for payment</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .payment-container {
            animation: fadeIn 0.8s ease-out;
          }
          .payment-form {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
          .form-group input.error, .form-group select.error {
            border-color: #e74c3c;
          }
          .error-message {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 5px;
          }
          .visa-logo {
            display: inline-block;
            background: linear-gradient(135deg, #1a1f71 0%, #003d82 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 20px;
          }
          .item-summary {
            background: rgba(255, 255, 255, 0.8);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .pay-button {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
            max-width: 300px;
            margin: 0 auto;
            display: block;
          }
          .pay-button:hover:not(:disabled) {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .pay-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
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
          .processing {
            text-align: center;
            color: #666;
            font-size: 18px;
          }
        `}
      </style>
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="payment-container" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px 20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
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
            💳 Secure Payment
          </h1>

          <div className="visa-logo">
            VISA ACCEPTED HERE
          </div>

          <div className="item-summary">
            <h3>Booking Summary</h3>
            <p><strong>Type:</strong> {type === 'flight' ? 'Flight' : 'Accommodation'}</p>
            {type === 'flight' ? (
              <>
                <p><strong>Flight:</strong> {item.flightNumber}</p>
                <p><strong>From:</strong> {item.from} → <strong>To:</strong> {item.to}</p>
                <p><strong>Price:</strong> {item.price}</p>
              </>
            ) : (
              <>
                <p><strong>Accommodation:</strong> {item.name}</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Price:</strong> {item.price}</p>
              </>
            )}
          </div>

          <form className="payment-form" onSubmit={handleSubmit}>
            <h3>Visa Card Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? 'error' : ''}
                  required
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={paymentData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={errors.cardholderName ? 'error' : ''}
                  required
                />
                {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    name="expiryMonth"
                    value={paymentData.expiryMonth}
                    onChange={handleInputChange}
                    className={errors.expiry ? 'error' : ''}
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
                    className={errors.expiry ? 'error' : ''}
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
                {errors.expiry && <span className="error-message">{errors.expiry}</span>}
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  className={errors.cvv ? 'error' : ''}
                  required
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
              </div>
            </div>

            <h3 style={{ marginTop: '30px' }}>Billing Address</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="billingAddress"
                  value={paymentData.billingAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  className={errors.billingAddress ? 'error' : ''}
                  required
                />
                {errors.billingAddress && <span className="error-message">{errors.billingAddress}</span>}
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={paymentData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className={errors.city ? 'error' : ''}
                  required
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={paymentData.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className={errors.zipCode ? 'error' : ''}
                  required
                />
                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={paymentData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                  className={errors.country ? 'error' : ''}
                  required
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>
            </div>

            {processing ? (
              <div className="processing">
                <h3>🔄 Processing Payment...</h3>
                <p>Please wait while we securely process your Visa payment.</p>
              </div>
            ) : (
              <button type="submit" className="pay-button">
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
