import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Video Background */}
      <video
        src="/assets/grok-video-82f37bb8-9c3b-4d96-ad86-bbe852678b19.mp4"
        autoPlay
        muted
        loop
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
        }}
      />
      
      {/* Luxury Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.7) 0%, rgba(10, 22, 40, 0.85) 50%, rgba(10, 22, 40, 0.95) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 1s ease-out'
      }}>
        
        {/* Logo and Brand */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <div style={{
            fontSize: '72px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 4px 20px rgba(212, 175, 55, 0.4))'
          }}>
            ✈️
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '56px',
            fontWeight: 700,
            color: 'white',
            margin: 0,
            letterSpacing: '2px',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
          }}>
            Air<span style={{ color: '#D4AF37' }}>Zambia</span>
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginTop: '12px',
            letterSpacing: '4px',
            textTransform: 'uppercase'
          }}>
            Premium Travel Experience
          </p>
        </div>

        {/* Gold Divider Line */}
        <div style={{
          width: '120px',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          marginBottom: '40px',
          animation: 'fadeIn 1.5s ease-out'
        }}></div>

        {/* Tagline */}
        <div style={{
          animation: 'fadeInUp 1.2s ease-out'
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '8px',
            fontWeight: 400
          }}>
            Discover the World in Luxury
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '0'
          }}>
            Your journey begins with us
          </p>
        </div>

        {/* Loading Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 2s ease-out'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            borderTop: '3px solid #D4AF37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Loading...
          </p>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          background: 'rgba(212, 175, 55, 0.2)',
          border: '1px solid #D4AF37',
          color: '#D4AF37',
          padding: '10px 24px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.5px'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#D4AF37';
          e.target.style.color = '#0A1628';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(212, 175, 55, 0.2)';
          e.target.style.color = '#D4AF37';
        }}
      >
        Skip →
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SplashPage;

