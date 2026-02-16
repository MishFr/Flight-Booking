import React from 'react';

const SplashPage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <video
        src="/assets/grok-video-82f37bb8-9c3b-4d96-ad86-bbe852678b19.mp4"
        autoPlay
        muted
        loop
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default SplashPage;
