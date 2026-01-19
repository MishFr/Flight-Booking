import React, { useState } from 'react';

const MagazinePage = () => {
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genres = [
    { id: 'all', name: 'All Magazines', icon: '📚' },
    { id: 'travel', name: 'Travel & Adventure', icon: '✈️' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
    { id: 'business', name: 'Business & Finance', icon: '💼' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'food', name: 'Food & Cuisine', icon: '🍽️' },
    { id: 'fashion', name: 'Fashion & Style', icon: '👗' },
    { id: 'health', name: 'Health & Wellness', icon: '🏃‍♀️' },
  ];

  const magazines = [
    {
      id: 1,
      title: 'Modern Traveler',
      genre: 'travel',
      description: 'Explore the world\'s most breathtaking destinations',
      cover: '🗺️',
      issue: 'March 2024',
      rating: 4.8,
      featured: true,
    },
    {
      id: 2,
      title: 'Tech Horizons',
      genre: 'technology',
      description: 'Cutting-edge innovations shaping our future',
      cover: '🚀',
      issue: 'Latest Edition',
      rating: 4.9,
      featured: true,
    },
    {
      id: 3,
      title: 'Culinary Journeys',
      genre: 'food',
      description: 'Global flavors and culinary adventures',
      cover: '🍳',
      issue: 'Spring 2024',
      rating: 4.7,
      featured: false,
    },
    {
      id: 4,
      title: 'Business Insider',
      genre: 'business',
      description: 'Market trends and entrepreneurial insights',
      cover: '📈',
      issue: 'Q1 2024',
      rating: 4.6,
      featured: false,
    },
    {
      id: 5,
      title: 'Wellness Today',
      genre: 'health',
      description: 'Holistic health and mindful living',
      cover: '🧘‍♀️',
      issue: 'February 2024',
      rating: 4.8,
      featured: false,
    },
    {
      id: 6,
      title: 'Style & Elegance',
      genre: 'fashion',
      description: 'Contemporary fashion and lifestyle trends',
      cover: '💎',
      issue: 'Fashion Week Special',
      rating: 4.5,
      featured: false,
    },
  ];

  const filteredMagazines = selectedGenre === 'all'
    ? magazines
    : magazines.filter(magazine => magazine.genre === selectedGenre);

  const featuredMagazines = magazines.filter(magazine => magazine.featured);

  return (
    <div style={{ padding: '80px 20px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
          .magazine-header {
            text-align: center;
            margin-bottom: 40px;
          }
          .magazine-title {
            font-size: 2.5rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .magazine-subtitle {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 30px;
          }
          .genre-filters {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 40px;
          }
          .genre-button {
            padding: 10px 20px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .genre-button:hover,
          .genre-button.active {
            background: #667eea;
            color: white;
          }
          .featured-section {
            margin-bottom: 50px;
          }
          .section-title {
            font-size: 1.8rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .magazine-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
          }
          .magazine-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }
          .magazine-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          }
          .magazine-cover {
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .magazine-content {
            padding: 20px;
          }
          .magazine-title-card {
            font-size: 1.3rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
          }
          .magazine-description {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 15px;
            line-height: 1.4;
          }
          .magazine-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #888;
          }
          .rating {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .stars {
            color: #ffd700;
          }
          .featured-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ff6b6b;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.7rem;
            font-weight: bold;
          }
          .magazine-card.featured {
            position: relative;
          }
        `}
      </style>

      <div className="magazine-header">
        <h1 className="magazine-title">✨ Modern Magazine Collection</h1>
        <p className="magazine-subtitle">
          Discover the latest in travel, technology, lifestyle, and more
        </p>
      </div>

      <div className="genre-filters">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-button ${selectedGenre === genre.id ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre.id)}
          >
            {genre.icon} {genre.name}
          </button>
        ))}
      </div>

      <div className="featured-section">
        <h2 className="section-title">⭐ Featured This Month</h2>
        <div className="magazine-grid">
          {featuredMagazines.map((magazine) => (
            <div key={magazine.id} className="magazine-card featured">
              <div className="featured-badge">FEATURED</div>
              <div className="magazine-cover">{magazine.cover}</div>
              <div className="magazine-content">
                <h3 className="magazine-title-card">{magazine.title}</h3>
                <p className="magazine-description">{magazine.description}</p>
                <div className="magazine-meta">
                  <span>{magazine.issue}</span>
                  <div className="rating">
                    <span className="stars">⭐</span>
                    <span>{magazine.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title">📖 All Magazines</h2>
        <div className="magazine-grid">
          {filteredMagazines.map((magazine) => (
            <div key={magazine.id} className="magazine-card">
              <div className="magazine-cover">{magazine.cover}</div>
              <div className="magazine-content">
                <h3 className="magazine-title-card">{magazine.title}</h3>
                <p className="magazine-description">{magazine.description}</p>
                <div className="magazine-meta">
                  <span>{magazine.issue}</span>
                  <div className="rating">
                    <span className="stars">⭐</span>
                    <span>{magazine.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MagazinePage;
