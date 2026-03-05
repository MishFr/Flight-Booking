import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';

const VendorsCornerPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('browse');
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({ vendors: 0, products: 0, categories: 8 });
  
  // Vendor profile state
  const [vendorProfile, setVendorProfile] = useState(null);
  const [vendorForm, setVendorForm] = useState({
    business_name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    website: '',
    logo_url: ''
  });
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'other',
    price: '',
    price_unit: '',
    image_url: ''
  });

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏪', color: '#1a365d' },
    { id: 'transportation', name: 'Transportation', icon: '🚗', color: '#3B82F6' },
    { id: 'accommodation', name: 'Accommodation', icon: '🏨', color: '#10B981' },
    { id: 'tourism', name: 'Tourism', icon: '🗺️', color: '#F59E0B' },
    { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#E11D48' },
    { id: 'equipment', name: 'Travel Equipment', icon: '🎒', color: '#8B5CF6' },
    { id: 'insurance', name: 'Travel Insurance', icon: '🛡️', color: '#06B6D4' },
    { id: 'other', name: 'Other', icon: '📦', color: '#6B7280' }
  ];

  const benefits = [
    { icon: '📈', text: 'Reach thousands of travelers daily' },
    { icon: '💳', text: 'Secure payment processing' },
    { icon: '📊', text: 'Real-time analytics dashboard' },
    { icon: '🌍', text: 'Global audience exposure' },
    { icon: '⚡', text: 'Easy product management' },
    { icon: '💬', text: 'Direct customer communication' }
  ];

  useEffect(() => {
    if (isAuthenticated && user?.is_vendor) {
      fetchVendorProfile();
    }
    fetchPublicVendorsAndProducts();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchPublicVendorsAndProducts();
    }
  }, [selectedCategory]);

  const fetchPublicVendorsAndProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vendors/products/public/');
      setProducts(response.data);
      // Extract unique vendors from products
      const uniqueVendors = [];
      const vendorMap = new Map();
      response.data.forEach(product => {
        if (product.vendor_name && !vendorMap.has(product.vendor_name)) {
          vendorMap.set(product.vendor_name, true);
          uniqueVendors.push({
            name: product.vendor_name,
            rating: Math.floor(Math.random() * 20) + 80, // Simulated rating
            reviewCount: Math.floor(Math.random() * 50) + 5,
            productCount: response.data.filter(p => p.vendor_name === product.vendor_name).length
          });
        }
      });
      setVendors(uniqueVendors.slice(0, 6)); // Top 6 vendors
      setStats({
        vendors: uniqueVendors.length,
        products: response.data.length,
        categories: categories.length - 1
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    try {
      const response = await api.get(`/vendors/products/public/?category=${category}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
    setLoading(false);
  };

  const fetchVendorProfile = async () => {
    try {
      const response = await api.get('/vendors/profile/');
      setVendorProfile(response.data);
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
    }
  };

  const handleVendorFormChange = (e) => {
    setVendorForm({
      ...vendorForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProductFormChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterVendor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendors/register/', vendorForm);
      setShowVendorForm(false);
      fetchVendorProfile();
      alert('Vendor profile created successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create vendor profile');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendors/products/', {
        ...productForm,
        price: productForm.price ? parseFloat(productForm.price) : null
      });
      setShowProductForm(false);
      setProductForm({
        name: '',
        description: '',
        category: 'other',
        price: '',
        price_unit: '',
        image_url: ''
      });
      alert('Product added successfully!');
      fetchVendorProfile();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add product');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(searchQuery ? filtered : (selectedCategory === 'all' ? products : products));
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0; // newest first by default
  });

  const isVendor = user?.is_vendor && vendorProfile;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 20);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < fullStars ? '#D4AF37' : '#D1D5DB', fontSize: '14px' }}>★</span>
      );
    }
    return stars;
  };

  return (
    <div style={{ padding: '80px 0 40px 0', background: 'linear-gradient(180deg, #F8FAFC 0%, #E9ECEF 100%)', minHeight: '100vh' }}>
      <style>
        {`
          /* Hero Section */
          .hero-section {
            background: linear-gradient(135deg, #1a365d 0%, #002855 50%, #1a365d 100%);
            padding: 60px 24px;
            position: relative;
            overflow: hidden;
          }
          .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23D4AF37\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
            opacity: 0.5;
          }
          .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
            position: relative;
            z-index: 1;
          }
          .hero-title {
            font-size: 3rem;
            font-weight: 700;
            color: white;
            margin-bottom: 16px;
            font-family: 'Playfair Display', Georgia, serif;
          }
          .hero-title span {
            color: #D4AF37;
          }
          .hero-subtitle {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.85);
            margin-bottom: 32px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          .search-container {
            display: flex;
            max-width: 500px;
            margin: 0 auto 40px;
            background: white;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
          .search-input {
            flex: 1;
            padding: 12px 20px;
            border: none;
            font-size: 14px;
            outline: none;
            height: 46px;
          }
          .search-btn {
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            color: #0A1628;
            border: none;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            height: 46px;
          }
          .search-btn:hover {
            background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
          }
          .stats-row {
            display: flex;
            justify-content: center;
            gap: 48px;
            flex-wrap: wrap;
          }
          .stat-item {
            text-align: center;
          }
          .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #D4AF37;
            font-family: 'Playfair Display', Georgia, serif;
          }
          .stat-label {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          /* Featured Vendors */
          .featured-section {
            padding: 60px 24px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .section-header {
            text-align: center;
            margin-bottom: 40px;
          }
          .section-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1a365d;
            margin-bottom: 8px;
            font-family: 'Playfair Display', Georgia, serif;
          }
          .section-subtitle {
            color: #6B7280;
            font-size: 1rem;
          }
          .featured-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
          }
          .featured-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 1px solid #E5E7EB;
            position: relative;
            overflow: hidden;
          }
          .featured-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #1a365d, #3B82F6);
          }
          .featured-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
          }
          .featured-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
          }
          .featured-avatar {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            background: linear-gradient(135deg, #1a365d 0%, #3B82F6 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
          }
          .featured-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1a365d;
          }
          .featured-rating {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .featured-review-count {
            color: #6B7280;
            font-size: 0.85rem;
          }
          .featured-products {
            display: inline-block;
            background: #F3F4F6;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            color: #1a365d;
            font-weight: 500;
          }
          .featured-cta {
            display: inline-block;
            margin-top: 16px;
            padding: 10px 20px;
            background: #1a365d;
            color: white;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .featured-cta:hover {
            background: #3B82F6;
            transform: translateX(4px);
          }

          /* Categories Section */
          .categories-section {
            padding: 40px 24px;
            background: white;
          }
          .categories-container {
            max-width: 1200px;
            margin: 0 auto;
          }
          .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 16px;
          }
          .category-card {
            padding: 20px 16px;
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }
          .category-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }
          .category-card.active {
            border-color: #1a365d;
            background: #F0F4F8;
          }
          .category-icon {
            font-size: 2rem;
            margin-bottom: 8px;
          }
          .category-name {
            font-size: 0.85rem;
            font-weight: 600;
            color: #374151;
          }

          /* Filter Bar */
          .filter-bar {
            padding: 20px 24px;
            background: white;
            border-bottom: 1px solid #E5E7EB;
          }
          .filter-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }
          .filter-label {
            font-weight: 600;
            color: #1a365d;
          }
          .filter-select {
            padding: 10px 16px;
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            font-size: 14px;
            color: #374151;
            background: white;
            cursor: pointer;
            transition: border-color 0.3s ease;
          }
          .filter-select:focus {
            outline: none;
            border-color: #1a365d;
          }
          .results-count {
            color: #6B7280;
            font-size: 0.9rem;
          }

          /* Products Grid */
          .products-section {
            padding: 40px 24px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
          }
          .product-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 1px solid #E5E7EB;
          }
          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
          }
          .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: linear-gradient(135deg, #1a365d 0%, #3B82F6 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3.5rem;
          }
          .product-content {
            padding: 20px;
          }
          .product-category-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }
          .product-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1a365d;
            margin-bottom: 8px;
          }
          .product-description {
            color: #6B7280;
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #D4AF37;
            margin-bottom: 16px;
          }
          .product-price-unit {
            font-size: 0.9rem;
            color: #6B7280;
            font-weight: 400;
          }
          .product-vendor {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 16px;
            border-top: 1px solid #E5E7EB;
          }
          .product-vendor-info {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .product-vendor-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1a365d 0%, #3B82F6 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .product-vendor-name {
            font-weight: 500;
            color: #374151;
            font-size: 0.9rem;
          }
          .product-actions {
            display: flex;
            gap: 8px;
          }
          .contact-btn {
            padding: 8px 16px;
            background: #1a365d;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .contact-btn:hover {
            background: #3B82F6;
          }

          /* Become a Vendor Section */
          .become-vendor-section {
            background: linear-gradient(135deg, #1a365d 0%, #002855 100%);
            padding: 60px 24px;
            margin: 40px 0 0;
          }
          .become-vendor-container {
            max-width: 1000px;
            margin: 0 auto;
            text-align: center;
          }
          .become-vendor-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: white;
            margin-bottom: 16px;
            font-family: 'Playfair Display', Georgia, serif;
          }
          .become-vendor-title span {
            color: #D4AF37;
          }
          .become-vendor-text {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 32px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
          }
          .benefit-item {
            display: flex;
            align-items: center;
            gap: 12px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.95rem;
          }
          .benefit-icon {
            width: 40px;
            height: 40px;
            background: rgba(212, 175, 55, 0.2);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
          }
          .cta-button {
            padding: 16px 48px;
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            color: #0A1628;
            border: none;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
          }
          .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
          }

          /* Tab Navigation */
          .tab-container {
            display: flex;
            justify-content: center;
            gap: 12px;
            padding: 24px;
            background: white;
            border-bottom: 1px solid #E5E7EB;
          }
          .tab-button {
            padding: 12px 28px;
            border: 2px solid #1a365d;
            background: white;
            color: #1a365d;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
          }
          .tab-button:hover,
          .tab-button.active {
            background: #1a365d;
            color: white;
          }

          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 22, 40, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(8px);
          }
          .modal-content {
            background: white;
            border-radius: 20px;
            padding: 32px;
            max-width: 520px;
            width: 92%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
          }
          .modal-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a365d;
            margin-bottom: 24px;
            text-align: center;
            font-family: 'Playfair Display', Georgia, serif;
          }
          .form-input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #E5E7EB;
            border-radius: 10px;
            font-size: 15px;
            margin-bottom: 16px;
            transition: border-color 0.3s ease;
          }
          .form-input:focus {
            outline: none;
            border-color: #1a365d;
          }
          .form-textarea {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #E5E7EB;
            border-radius: 10px;
            font-size: 15px;
            margin-bottom: 16px;
            min-height: 100px;
            resize: vertical;
            font-family: inherit;
          }
          .form-textarea:focus {
            outline: none;
            border-color: #1a365d;
          }
          .form-select {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #E5E7EB;
            border-radius: 10px;
            font-size: 15px;
            margin-bottom: 16px;
            background: white;
          }
          .form-select:focus {
            outline: none;
            border-color: #1a365d;
          }
          .form-label {
            display: block;
            font-weight: 600;
            color: #1a365d;
            margin-bottom: 8px;
            font-size: 0.9rem;
          }
          .submit-button {
            width: 100%;
            padding: 16px;
            background: #1a365d;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .submit-button:hover {
            background: #3B82F6;
          }
          .cancel-button {
            width: 100%;
            padding: 16px;
            background: #F3F4F6;
            color: #374151;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.3s ease;
          }
          .cancel-button:hover {
            background: #E5E7EB;
          }

          /* Vendor Dashboard */
          .vendor-dashboard {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 24px;
          }
          .dashboard-card {
            background: white;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 32px;
          }
          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }
          .dashboard-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a365d;
          }
          .add-product-btn {
            padding: 12px 24px;
            background: linear-gradient(135deg, #1a365d 0%, #3B82F6 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .add-product-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(26, 54, 93, 0.3);
          }
          .my-products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }
          .my-product-card {
            background: #F8FAFC;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #E5E7EB;
          }
          .my-product-name {
            font-weight: 600;
            color: #1a365d;
            margin-bottom: 8px;
          }
          .my-product-description {
            font-size: 0.9rem;
            color: #6B7280;
            margin-bottom: 12px;
          }
          .my-product-price {
            font-weight: 700;
            color: #D4AF37;
          }
          .status-badge {
            display: inline-block;
            margin-top: 12px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          .status-active {
            background: #D1FAE5;
            color: #065F46;
          }
          .status-inactive {
            background: #FEE2E2;
            color: #991B1B;
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 60px 24px;
            color: #6B7280;
          }
          .empty-icon {
            font-size: 4rem;
            margin-bottom: 16px;
          }
          .empty-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }
          .empty-text {
            font-size: 0.95rem;
          }

          /* Loading */
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 24px;
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #E5E7EB;
            border-top-color: #1a365d;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          .loading-text {
            margin-top: 16px;
            color: #6B7280;
            font-size: 0.95rem;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .hero-title {
              font-size: 2rem;
            }
            .stats-row {
              gap: 24px;
            }
            .stat-value {
              font-size: 2rem;
            }
            .search-container {
              flex-direction: column;
              border-radius: 16px;
            }
            .search-btn {
              border-radius: 0;
            }
            .featured-grid,
            .products-grid,
            .categories-grid {
              grid-template-columns: 1fr;
            }
            .filter-container {
              flex-direction: column;
              align-items: stretch;
            }
            .tab-container {
              flex-direction: column;
              align-items: stretch;
            }
            .tab-button {
              text-align: center;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🏪 Vendors <span>Corner</span>
          </h1>
          <p className="hero-subtitle">
            Discover trusted vendors and premium products for your travel needs. 
            Connect with the best service providers in the industry.
          </p>
          
          {/* Search Bar */}
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search vendors, products, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </form>

          {/* Statistics */}
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">{stats.vendors}</div>
              <div className="stat-label">Trusted Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.products}</div>
              <div className="stat-label">Products & Services</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.categories}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          🔍 Browse Vendors
        </button>
        {isAuthenticated && (
          <button
            className={`tab-button ${activeTab === 'vendor' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendor')}
          >
            💼 My Vendor Dashboard
          </button>
        )}
      </div>

      {activeTab === 'browse' && (
        <>
          {/* Featured Vendors Section */}
          {vendors.length > 0 && (
            <div className="featured-section">
              <div className="section-header">
                <h2 className="section-title">⭐ Featured Vendors</h2>
                <p className="section-subtitle">Top-rated vendors recommended by travelers</p>
              </div>
              <div className="featured-grid">
                {vendors.slice(0, 6).map((vendor, index) => (
                  <div key={index} className="featured-card">
                    <div className="featured-header">
                      <div className="featured-avatar">
                        {vendor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="featured-name">{vendor.name}</div>
                        <div className="featured-rating">
                          {renderStars(vendor.rating)}
                          <span className="featured-review-count">({vendor.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <span className="featured-products">{vendor.productCount} Products</span>
                    <div className="featured-cta">View Profile →</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Section */}
          <div className="categories-section">
            <div className="categories-container">
              <div className="section-header">
                <h2 className="section-title">Browse by Category</h2>
                <p className="section-subtitle">Find exactly what you need</p>
              </div>
              <div className="categories-grid">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      background: selectedCategory === category.id ? '#F0F4F8' : 'white',
                      borderColor: selectedCategory === category.id ? '#1a365d' : '#E5E7EB'
                    }}
                  >
                    <div className="category-icon">{category.icon}</div>
                    <div className="category-name">{category.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-container">
              <span className="results-count">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
              </span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className="filter-label">Sort by:</span>
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading products...</p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="products-grid">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        categories.find(c => c.id === product.category)?.icon || '📦'
                      )}
                    </div>
                    <div className="product-content">
                      <span
                        className="product-category-badge"
                        style={{
                          background: `${categories.find(c => c.id === product.category)?.color}15`,
                          color: categories.find(c => c.id === product.category)?.color
                        }}
                      >
                        {categories.find(c => c.id === product.category)?.icon} {product.category}
                      </span>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      {product.price && (
                        <div className="product-price">
                          ${product.price.toFixed(2)}
                          {product.price_unit && <span className="product-price-unit"> {product.price_unit}</span>}
                        </div>
                      )}
                      <div className="product-vendor">
                        <div className="product-vendor-info">
                          <div className="product-vendor-avatar">
                            {product.vendor_name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="product-vendor-name">{product.vendor_name}</span>
                        </div>
                        <div className="product-actions">
                          <button className="contact-btn">Contact</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏪</div>
                <div className="empty-title">No products found</div>
                <p className="empty-text">Try selecting a different category or adjust your search</p>
              </div>
            )}
          </div>

          {/* Become a Vendor CTA */}
          <div className="become-vendor-section">
            <div className="become-vendor-container">
              <h2 className="become-vendor-title">
                Become a <span>Vendor</span>
              </h2>
              <p className="become-vendor-text">
                Join our growing network of trusted vendors and reach thousands of travelers 
                looking for quality products and services.
              </p>
              <div className="benefits-grid">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <div className="benefit-icon">{benefit.icon}</div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
              {isAuthenticated ? (
                user?.is_vendor ? (
                  <button
                    className="cta-button"
                    onClick={() => setActiveTab('vendor')}
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <button
                    className="cta-button"
                    onClick={() => {
                      setActiveTab('vendor');
                      setShowVendorForm(true);
                    }}
                  >
                    Start Selling Today
                  </button>
                )
              ) : (
                <button className="cta-button" onClick={() => window.location.href = '/login'}>
                  Sign In to Become a Vendor
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'vendor' && (
        <div className="vendor-dashboard">
          {!isAuthenticated ? (
            <div className="become-vendor-section" style={{ margin: 0 }}>
              <div className="become-vendor-container">
                <h2 className="become-vendor-title">Sign In Required</h2>
                <p className="become-vendor-text">
                  Please sign in to access your vendor dashboard
                </p>
                <button className="cta-button" onClick={() => window.location.href = '/login'}>
                  Sign In
                </button>
              </div>
            </div>
          ) : !user?.is_vendor || !vendorProfile ? (
            <div className="become-vendor-section" style={{ margin: 0 }}>
              <div className="become-vendor-container">
                <h2 className="become-vendor-title">Create Your <span>Vendor Profile</span></h2>
                <p className="become-vendor-text">
                  Set up your business profile to start listing products and services
                </p>
                <button className="cta-button" onClick={() => setShowVendorForm(true)}>
                  Create Vendor Profile
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Vendor Dashboard */}
              <div className="dashboard-card">
                <div className="dashboard-header">
                  <h2 className="dashboard-title">🏪 {vendorProfile.business_name}</h2>
                  <button
                    className="add-product-btn"
                    onClick={() => setShowProductForm(true)}
                  >
                    + Add New Product
                  </button>
                </div>
                
                {vendorProfile.description && (
                  <p style={{ color: '#6B7280', marginBottom: '20px', lineHeight: '1.6' }}>
                    {vendorProfile.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#374151' }}>
                  {vendorProfile.contact_email && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📧 {vendorProfile.contact_email}
                    </span>
                  )}
                  {vendorProfile.contact_phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📞 {vendorProfile.contact_phone}
                    </span>
                  )}
                  {vendorProfile.website && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🌐 {vendorProfile.website}
                    </span>
                  )}
                </div>

                <h3 style={{ marginTop: '32px', marginBottom: '20px', color: '#1a365d', fontSize: '1.2rem' }}>
                  My Products
                </h3>
                {vendorProfile.products && vendorProfile.products.length > 0 ? (
                  <div className="my-products-grid">
                    {vendorProfile.products.map((product) => (
                      <div key={product.id} className="my-product-card">
                        <h4 className="my-product-name">{product.name}</h4>
                        <p className="my-product-description">{product.description}</p>
                        {product.price && (
                          <p className="my-product-price">${product.price.toFixed(2)}</p>
                        )}
                        <span className={`status-badge ${product.is_active ? 'status-active' : 'status-inactive'}`}>
                          {product.is_active ? '✓ Active' : '○ Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <div className="empty-title">No products yet</div>
                    <p className="empty-text">Add your first product to get started!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Vendor Registration Modal */}
      {showVendorForm && (
        <div className="modal-overlay" onClick={() => setShowVendorForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create Vendor Profile</h2>
            <form onSubmit={handleRegisterVendor}>
              <label className="form-label">Business Name *</label>
              <input
                type="text"
                name="business_name"
                className="form-input"
                value={vendorForm.business_name}
                onChange={handleVendorFormChange}
                required
              />
              
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={vendorForm.description}
                onChange={handleVendorFormChange}
                placeholder="Tell customers about your business..."
              />
              
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                className="form-input"
                value={vendorForm.contact_email}
                onChange={handleVendorFormChange}
              />
              
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                name="contact_phone"
                className="form-input"
                value={vendorForm.contact_phone}
                onChange={handleVendorFormChange}
              />
              
              <label className="form-label">Address</label>
              <textarea
                name="address"
                className="form-textarea"
                value={vendorForm.address}
                onChange={handleVendorFormChange}
              />
              
              <label className="form-label">Website</label>
              <input
                type="url"
                name="website"
                className="form-input"
                value={vendorForm.website}
                onChange={handleVendorFormChange}
                placeholder="https://..."
              />
              
              <label className="form-label">Logo URL</label>
              <input
                type="url"
                name="logo_url"
                className="form-input"
                value={vendorForm.logo_url}
                onChange={handleVendorFormChange}
                placeholder="https://..."
              />
              
              <button type="submit" className="submit-button">
                Create Vendor Profile
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowVendorForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductForm && (
        <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={productForm.name}
                onChange={handleProductFormChange}
                required
              />
              
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={productForm.description}
                onChange={handleProductFormChange}
              />
              
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={productForm.category}
                onChange={handleProductFormChange}
              >
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                className="form-input"
                value={productForm.price}
                onChange={handleProductFormChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
              
              <label className="form-label">Price Unit</label>
              <input
                type="text"
                name="price_unit"
                className="form-input"
                value={productForm.price_unit}
                onChange={handleProductFormChange}
                placeholder="e.g., per night, per person"
              />
              
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="image_url"
                className="form-input"
                value={productForm.image_url}
                onChange={handleProductFormChange}
                placeholder="https://..."
              />
              
              <button type="submit" className="submit-button">
                Add Product
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowProductForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsCornerPage;

