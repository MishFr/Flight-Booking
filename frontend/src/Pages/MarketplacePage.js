import React, { useState } from 'react';

const MarketplacePage = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedService, setSelectedService] = useState('all');

  const taxiServices = [
    {
      id: 'uber',
      name: 'Uber',
      icon: '🚗',
      description: 'Reliable rides with multiple vehicle options',
      rating: 4.7,
      estimatedTime: '3-5 min',
      priceRange: '$8-15',
      features: ['GPS Tracking', 'Cash/Card Payment', '24/7 Service'],
      color: '#000000',
    },
    {
      id: 'bolt',
      name: 'Bolt',
      icon: '⚡',
      description: 'Fast and affordable rides across the city',
      rating: 4.5,
      estimatedTime: '2-4 min',
      priceRange: '$6-12',
      features: ['Real-time Pricing', 'Multiple Payment Options', 'Driver Ratings'],
      color: '#00D4AA',
    },
    {
      id: 'yango',
      name: 'Yango',
      icon: '🚕',
      description: 'Comfortable rides with professional drivers',
      rating: 4.6,
      estimatedTime: '4-6 min',
      priceRange: '$7-14',
      features: ['Comfortable Vehicles', 'Professional Drivers', 'Fixed Pricing'],
      color: '#FF6B35',
    },
  ];

  const filteredServices = selectedService === 'all'
    ? taxiServices
    : taxiServices.filter(service => service.id === selectedService);

  const handleBookRide = (serviceId) => {
    // In a real app, this would integrate with the actual taxi service APIs
    alert(`Booking ${serviceId.toUpperCase()} ride from "${pickupLocation}" to "${dropoffLocation}"`);
  };

  return (
    <div style={{ padding: '80px 20px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
          .marketplace-header {
            text-align: center;
            margin-bottom: 40px;
          }
          .marketplace-title {
            font-size: 2.5rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .marketplace-subtitle {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 30px;
          }
          .booking-form {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 40px;
          }
          .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
          }
          .form-group {
            flex: 1;
          }
          .form-label {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
          }
          .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
          }
          .form-input:focus {
            outline: none;
            border-color: #667eea;
          }
          .service-filters {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 40px;
          }
          .service-button {
            padding: 10px 20px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .service-button:hover,
          .service-button.active {
            background: #667eea;
            color: white;
          }
          .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
          }
          .service-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }
          .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          }
          .service-header {
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .service-icon {
            font-size: 2.5rem;
          }
          .service-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0;
          }
          .service-content {
            padding: 20px;
          }
          .service-description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
          }
          .service-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          .detail-item {
            display: flex;
            flex-direction: column;
          }
          .detail-label {
            font-size: 0.8rem;
            color: #888;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .detail-value {
            font-size: 1.1rem;
            font-weight: bold;
            color: #333;
          }
          .rating {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 15px;
          }
          .stars {
            color: #ffd700;
          }
          .features-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
          }
          .feature-tag {
            background: #f0f4f8;
            color: #667eea;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
          }
          .book-button {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          .book-button:hover {
            background: #5a67d8;
          }
        `}
      </style>

      <div className="marketplace-header">
        <h1 className="marketplace-title">🚕 Taxi Marketplace</h1>
        <p className="marketplace-subtitle">
          Book rides with top taxi services - Uber, Bolt, and Yango
        </p>
      </div>

      <div className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">📍 Pickup Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter pickup address"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">🎯 Drop-off Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter destination"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="service-filters">
        <button
          className={`service-button ${selectedService === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedService('all')}
        >
          🚕 All Services
        </button>
        {taxiServices.map((service) => (
          <button
            key={service.id}
            className={`service-button ${selectedService === service.id ? 'active' : ''}`}
            onClick={() => setSelectedService(service.id)}
          >
            {service.icon} {service.name}
          </button>
        ))}
      </div>

      <div className="services-grid">
        {filteredServices.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-header">
              <span className="service-icon">{service.icon}</span>
              <h3 className="service-title">{service.name}</h3>
            </div>
            <div className="service-content">
              <p className="service-description">{service.description}</p>

              <div className="rating">
                <span className="stars">⭐</span>
                <span>{service.rating}</span>
              </div>

              <div className="service-details">
                <div className="detail-item">
                  <span className="detail-label">ETA</span>
                  <span className="detail-value">{service.estimatedTime}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price Range</span>
                  <span className="detail-value">{service.priceRange}</span>
                </div>
              </div>

              <div className="features-list">
                {service.features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>

              <button
                className="book-button"
                onClick={() => handleBookRide(service.id)}
                disabled={!pickupLocation || !dropoffLocation}
              >
                Book {service.name} Ride
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
