import React, { useState } from 'react';

const MagazinePage = () => {
  const [activeSection, setActiveSection] = useState('featured');

  const sections = [
    { id: 'featured', name: 'Featured', icon: '★' },
    { id: 'trending', name: 'Trending Now', icon: '↗' },
    { id: 'quick', name: 'Quick Reads', icon: '⚡' },
    { id: 'all', name: 'All Stories', icon: '☰' },
  ];

  const featuredArticles = [
    {
      id: 1,
      category: 'Travel',
      categoryColor: '#FF6B6B',
      title: 'The Future of Sustainable Travel: How Airlines Are Going Green',
      excerpt: 'From fuel-efficient aircraft to carbon offset programs, the aviation industry is pioneering a new era of eco-conscious flying.',
      author: 'Sarah Mitchell',
      readTime: '12 min read',
      image: '✈️',
      featured: true,
      date: 'March 15, 2024',
    },
    {
      id: 2,
      category: 'Lifestyle',
      categoryColor: '#4ECDC4',
      title: 'Luxury Redefined: The New Wave of Boutique Hotels',
      excerpt: 'Discover the most innovative hotel designs that are reshaping hospitality around the world.',
      author: 'James Chen',
      readTime: '8 min read',
      image: '🏨',
      featured: true,
      date: 'March 14, 2024',
    },
  ];

  const trendingArticles = [
    {
      id: 3,
      category: 'Business',
      categoryColor: '#45B7D1',
      title: 'The Rise of Private Jet Memberships',
      author: 'Michael Torres',
      readTime: '6 min read',
      image: '💼',
    },
    {
      id: 4,
      category: 'Tech',
      categoryColor: '#96CEB4',
      title: 'AI-Powered Travel Planning Is Here',
      author: 'Lisa Park',
      readTime: '5 min read',
      image: '🤖',
    },
    {
      id: 5,
      category: 'Food',
      categoryColor: '#FFEAA7',
      title: 'World\'s Best Airport Restaurants',
      author: 'Chef Marco',
      readTime: '7 min read',
      image: '🍽️',
    },
    {
      id: 6,
      category: 'Adventure',
      categoryColor: '#DDA0DD',
      title: 'Hidden Gems: Remote Destinations for 2024',
      author: 'Emma Wilson',
      readTime: '10 min read',
      image: '🗺️',
    },
  ];

  const quickReads = [
    {
      id: 7,
      category: 'Tips',
      categoryColor: '#FF8C42',
      title: '10 Ways to Beat Jet Lag',
      readTime: '3 min',
      icon: '💡',
    },
    {
      id: 8,
      category: 'Gear',
      categoryColor: '#6C5CE7',
      title: 'Best Travel Accessories 2024',
      readTime: '4 min',
      icon: '🎒',
    },
    {
      id: 9,
      category: 'Safety',
      categoryColor: '#00B894',
      title: 'Travel Insurance Explained',
      readTime: '5 min',
      icon: '🛡️',
    },
    {
      id: 10,
      category: 'Points',
      categoryColor: '#FD79A8',
      title: 'Maximize Your Miles',
      readTime: '4 min',
      icon: '💳',
    },
  ];

  const headlines = [
    { id: 1, text: '✈️ New Direct Routes to Bali Launch This Summer' },
    { id: 2, text: '🏆 Airline Ratings: The Winners of 2024' },
    { id: 3, text: '🎉 Exclusive: First Class Suite Preview' },
    { id: 4, text: '🌍 UNESCO Adds 5 New Heritage Sites' },
  ];

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
        
        * { box-sizing: border-box; }
        
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        .magazine-card:hover .card-image-wrapper {
          transform: scale(1.05);
        }
        
        .trending-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .quick-read:hover {
          transform: translateY(-5px) rotate(-1deg);
        }
        
        .headline-item:hover {
          transform: translateX(10px);
          color: #FF6B6B;
        }
      `}</style>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>★ COVER STORY</div>
          <h1 style={styles.heroTitle}>
            The New Era of
            <span style={styles.heroTitleAccent}> Travel</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Exploring the frontiers of sustainable aviation, luxury hospitality, and transformative journeys
          </p>
          <div style={styles.heroMeta}>
            <span style={styles.heroAuthor}>By Sarah Mitchell</span>
            <span style={styles.heroDivider}>|</span>
            <span style={styles.heroDate}>March 2024 Issue</span>
          </div>
        </div>
        <div style={styles.heroDecor}>
          <div style={styles.heroDecorCircle}></div>
          <div style={styles.heroDecorSquare}></div>
        </div>
      </section>

      {/* Headlines Ticker */}
      <section style={styles.headlinesSection}>
        <div style={styles.headlinesLabel}>BREAKING</div>
        <div style={styles.headlinesTrack}>
          {headlines.map((headline, index) => (
            <div key={headline.id} className="headline-item" style={{
              ...styles.headlineItem,
              animationDelay: `${index * 0.1}s`
            }}>
              {headline.text}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Tabs */}
      <section style={styles.navSection}>
        <div style={styles.navContainer}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                ...styles.navButton,
                ...(activeSection === section.id ? styles.navButtonActive : {})
              }}
            >
              <span style={styles.navIcon}>{section.icon}</span>
              <span style={styles.navText}>{section.name}</span>
              {activeSection === section.id && <div style={styles.navIndicator}></div>}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section style={styles.contentSection}>
        
        {/* Featured Articles - Asymmetrical Layout */}
        {(activeSection === 'featured' || activeSection === 'all') && (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>★</span>
                Featured Stories
              </h2>
              <p style={styles.sectionSubtitle}>Editor's picks for this month</p>
            </div>
            
            <div style={styles.featuredGrid}>
              {/* Main Featured - Large */}
              <div style={styles.featuredMain}>
                {featuredArticles[0] && (
                  <div className="magazine-card" style={styles.featuredMainCard}>
                    <div style={styles.featuredMainImage}>
                      <span style={styles.featuredMainEmoji}>{featuredArticles[0].image}</span>
                      <div style={styles.imageOverlay}></div>
                    </div>
                    <div style={styles.featuredMainContent}>
                      <span style={{
                        ...styles.categoryTag,
                        background: featuredArticles[0].categoryColor
                      }}>
                        {featuredArticles[0].category}
                      </span>
                      <h3 style={styles.featuredMainTitle}>{featuredArticles[0].title}</h3>
                      <p style={styles.featuredMainExcerpt}>{featuredArticles[0].excerpt}</p>
                      <div style={styles.articleMeta}>
                        <span>{featuredArticles[0].author}</span>
                        <span>•</span>
                        <span>{featuredArticles[0].readTime}</span>
                        <span>•</span>
                        <span>{featuredArticles[0].date}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary Features */}
              <div style={styles.featuredSecondary}>
                {featuredArticles.slice(1).map((article, index) => (
                  <div 
                    key={article.id} 
                    className="magazine-card"
                    style={{
                      ...styles.featuredSecondaryCard,
                      animationDelay: `${index * 0.15}s`
                    }}
                  >
                    <div style={styles.featuredSecondaryImage}>
                      <span style={styles.featuredSecondaryEmoji}>{article.image}</span>
                    </div>
                    <div style={styles.featuredSecondaryContent}>
                      <span style={{
                        ...styles.categoryTagSmall,
                        background: article.categoryColor
                      }}>
                        {article.category}
                      </span>
                      <h4 style={styles.featuredSecondaryTitle}>{article.title}</h4>
                      <div style={styles.articleMetaSmall}>
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trending Section */}
        {(activeSection === 'trending' || activeSection === 'all') && (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>↗</span>
                Trending Now
              </h2>
              <p style={styles.sectionSubtitle}>What readers are loving this week</p>
            </div>
            
            <div style={styles.trendingGrid}>
              {trendingArticles.map((article, index) => (
                <div 
                  key={article.id}
                  className="trending-card"
                  style={{
                    ...styles.trendingCard,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={styles.trendingImage}>
                    <span style={styles.trendingEmoji}>{article.image}</span>
                    <span style={{
                      ...styles.trendingNumber,
                      background: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index % 4]
                    }}>
                      0{index + 1}
                    </span>
                  </div>
                  <div style={styles.trendingContent}>
                    <span style={{
                      ...styles.categoryTagSmall,
                      background: article.categoryColor
                    }}>
                      {article.category}
                    </span>
                    <h4 style={styles.trendingTitle}>{article.title}</h4>
                    <div style={styles.trendingMeta}>
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Reads Section */}
        {(activeSection === 'quick' || activeSection === 'all') && (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>⚡</span>
                Quick Reads
              </h2>
              <p style={styles.sectionSubtitle}>Bite-sized stories for busy travelers</p>
            </div>
            
            <div style={styles.quickReadsGrid}>
              {quickReads.map((item, index) => (
                <div 
                  key={item.id}
                  className="quick-read"
                  style={{
                    ...styles.quickReadCard,
                    animationDelay: `${index * 0.08}s`
                  }}
                >
                  <div style={{
                    ...styles.quickReadIcon,
                    background: `linear-gradient(135deg, ${item.categoryColor}20, ${item.categoryColor}40)`
                  }}>
                    <span style={styles.quickReadEmoji}>{item.icon}</span>
                  </div>
                  <div style={styles.quickReadContent}>
                    <span style={{
                      ...styles.categoryTagSmall,
                      background: item.categoryColor
                    }}>
                      {item.category}
                    </span>
                    <h4 style={styles.quickReadTitle}>{item.title}</h4>
                    <span style={styles.quickReadTime}>{item.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Highlights */}
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🎯</span>
              Explore by Category
            </h2>
          </div>
          
          <div style={styles.categoryGrid}>
            {[
              { name: 'Travel & Adventure', icon: '✈️', color: '#FF6B6B', count: 24 },
              { name: 'Business Class', icon: '💼', color: '#45B7D1', count: 18 },
              { name: 'Luxury Hotels', icon: '🏨', color: '#DDA0DD', count: 32 },
              { name: 'Food & Dining', icon: '🍽️', color: '#FFEAA7', count: 15 },
              { name: 'Technology', icon: '💻', color: '#96CEB4', count: 21 },
              { name: 'Wellness', icon: '🧘', color: '#4ECDC4', count: 12 },
            ].map((category, index) => (
              <div 
                key={category.name}
                style={{
                  ...styles.categoryCard,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div style={{
                  ...styles.categoryIcon,
                  background: `linear-gradient(135deg, ${category.color}30, ${category.color}60)`
                }}>
                  <span>{category.icon}</span>
                </div>
                <div style={styles.categoryInfo}>
                  <h4 style={styles.categoryName}>{category.name}</h4>
                  <span style={styles.categoryCount}>{category.count} articles</span>
                </div>
                <span style={styles.categoryArrow}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div style={styles.newsletterSection}>
          <div style={styles.newsletterContent}>
            <h3 style={styles.newsletterTitle}>Stay in the Loop</h3>
            <p style={styles.newsletterText}>
              Get the latest travel stories, exclusive offers, and insider tips delivered to your inbox.
            </p>
            <div style={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={styles.newsletterInput}
              />
              <button style={styles.newsletterButton}>Subscribe</button>
            </div>
          </div>
          <div style={styles.newsletterDecor}>
            <div style={styles.newsletterCircle1}></div>
            <div style={styles.newsletterCircle2}></div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>✈️</span>
            <span style={styles.footerTitle}>TravelMag</span>
          </div>
          <p style={styles.footerText}>
            Your trusted source for travel inspiration, tips, and exclusive content.
          </p>
          <div style={styles.footerLinks}>
            <span>About</span>
            <span>Contact</span>
            <span>Advertise</span>
            <span>Careers</span>
          </div>
          <p style={styles.copyright}>© 2024 TravelMag. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: '#0A0A0A',
    paddingTop: '70px',
  },

  // Hero Section
  heroSection: {
    position: 'relative',
    minHeight: '500px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.15) 0%, transparent 50%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    maxWidth: '800px',
    animation: 'fadeInUp 0.8s ease-out',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #FF6B6B, #ee5a24)',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '30px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    marginBottom: '24px',
    fontFamily: "'Bebas Neue', sans-serif",
  },
  heroTitle: {
    fontSize: 'clamp(40px, 8vw, 72px)',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 20px 0',
    lineHeight: '1.1',
    fontFamily: "'Playfair Display', serif",
  },
  heroTitleAccent: {
    background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  heroMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
  },
  heroDivider: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  heroDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  heroDecorCircle: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    top: '10%',
    right: '10%',
    animation: 'pulse 4s ease-in-out infinite',
  },
  heroDecorSquare: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    border: '1px solid rgba(78, 205, 196, 0.2)',
    bottom: '20%',
    left: '5%',
    transform: 'rotate(45deg)',
  },

  // Headlines
  headlinesSection: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(90deg, #FF6B6B, #ee5a24)',
    padding: '16px 24px',
    gap: '20px',
  },
  headlinesLabel: {
    color: 'white',
    fontWeight: '700',
    fontSize: '14px',
    letterSpacing: '2px',
    whiteSpace: 'nowrap',
  },
  headlinesTrack: {
    display: 'flex',
    gap: '40px',
    overflow: 'hidden',
    flex: 1,
  },
  headlineItem: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'slideInLeft 0.5s ease-out forwards',
    opacity: 0,
  },

  // Navigation
  navSection: {
    background: '#111',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: '70px',
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '30px',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  navButtonActive: {
    background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
  },
  navIcon: {
    fontSize: '16px',
  },
  navText: {
    fontFamily: "'Inter', sans-serif",
  },
  navIndicator: {
    position: 'absolute',
    bottom: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '3px',
    background: 'white',
    borderRadius: '2px',
  },

  // Content Section
  contentSection: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  sectionContainer: {
    marginBottom: '60px',
  },
  sectionHeader: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: "'Playfair Display', serif",
  },
  sectionIcon: {
    fontSize: '24px',
  },
  sectionSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    margin: 0,
  },

  // Featured Grid - Asymmetrical
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '24px',
  },
  featuredMain: {
    animation: 'fadeInUp 0.6s ease-out forwards',
  },
  featuredMainCard: {
    background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: '100%',
  },
  featuredMainImage: {
    height: '300px',
    background: 'linear-gradient(135deg, #FF6B6B40, #4ECDC440)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(to top, #1a1a2e, transparent)',
  },
  featuredMainEmoji: {
    fontSize: '80px',
    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
  },
  featuredMainContent: {
    padding: '30px',
  },
  categoryTag: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  categoryTagSmall: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '10px',
    fontWeight: '700',
    color: '#111',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  featuredMainTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 16px 0',
    lineHeight: '1.3',
    fontFamily: "'Playfair Display', serif",
  },
  featuredMainExcerpt: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '15px',
    lineHeight: '1.7',
    marginBottom: '20px',
  },
  articleMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '13px',
  },
  articleMetaSmall: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
  },

  // Secondary Featured
  featuredSecondary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  featuredSecondaryCard: {
    background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    animation: 'fadeInUp 0.6s ease-out forwards',
    opacity: 0,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  featuredSecondaryImage: {
    width: '120px',
    minHeight: '140px',
    background: 'linear-gradient(135deg, #4ECDC440, #45B7D140)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featuredSecondaryEmoji: {
    fontSize: '40px',
  },
  featuredSecondaryContent: {
    padding: '20px',
    flex: 1,
  },
  featuredSecondaryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 10px 0',
    lineHeight: '1.4',
  },

  // Trending Grid
  trendingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  trendingCard: {
    background: 'linear-gradient(145deg, #1e1e32, #252545)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    animation: 'fadeInUp 0.5s ease-out forwards',
    opacity: 0,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  trendingImage: {
    height: '160px',
    background: 'linear-gradient(135deg, #2a2a4a, #1a1a3a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  trendingEmoji: {
    fontSize: '50px',
  },
  trendingNumber: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: '800',
  },
  trendingContent: {
    padding: '20px',
  },
  trendingTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 10px 0',
    lineHeight: '1.4',
  },
  trendingMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
  },

  // Quick Reads
  quickReadsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  quickReadCard: {
    background: 'linear-gradient(145deg, #1e1e32, #252545)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    animation: 'fadeInUp 0.5s ease-out forwards',
    opacity: 0,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  quickReadIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickReadEmoji: {
    fontSize: '28px',
  },
  quickReadContent: {
    flex: 1,
  },
  quickReadTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 6px 0',
  },
  quickReadTime: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '12px',
  },

  // Category Grid
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  categoryCard: {
    background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.5s ease-out forwards',
    opacity: 0,
  },
  categoryIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 4px 0',
  },
  categoryCount: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
  },
  categoryArrow: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '20px',
    transition: 'transform 0.3s ease',
  },

  // Newsletter
  newsletterSection: {
    position: 'relative',
    background: 'linear-gradient(135deg, #FF6B6B, #ee5a24)',
    borderRadius: '24px',
    padding: '50px',
    overflow: 'hidden',
    marginTop: '40px',
  },
  newsletterContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  newsletterTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 12px 0',
    fontFamily: "'Playfair Display', serif",
  },
  newsletterText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  newsletterForm: {
    display: 'flex',
    gap: '12px',
    maxWidth: '450px',
    margin: '0 auto',
  },
  newsletterInput: {
    flex: 1,
    padding: '14px 20px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '15px',
    background: 'rgba(255, 255, 255, 0.95)',
    outline: 'none',
  },
  newsletterButton: {
    padding: '14px 32px',
    borderRadius: '30px',
    border: 'none',
    background: '#111',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    whiteSpace: 'nowrap',
  },
  newsletterDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  newsletterCircle1: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    top: '-50px',
    right: '-50px',
  },
  newsletterCircle2: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    bottom: '-30px',
    left: '10%',
  },

  // Footer
  footer: {
    background: '#0a0a0a',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '50px 24px 30px',
  },
  footerContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  footerLogo: {
    fontSize: '28px',
  },
  footerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    fontFamily: "'Playfair Display', serif",
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '24px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    cursor: 'pointer',
  },
  copyright: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '12px',
  },
};

export default MagazinePage;

