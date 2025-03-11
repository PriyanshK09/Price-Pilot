import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, ArrowRight, Smartphone, Laptop, Headphones, Camera, Watch, Tv, Gamepad2 } from 'lucide-react';
import './HomeSearch.css';

const HomeSearch = () => {
  const [query, setQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  
  const popularCategories = [
    { name: 'Smartphones', icon: <Smartphone size={18} /> },
    { name: 'Laptops', icon: <Laptop size={18} /> },
    { name: 'Headphones', icon: <Headphones size={18} /> },
    { name: 'TVs', icon: <Tv size={18} /> },
    { name: 'Cameras', icon: <Camera size={18} /> },
    { name: 'Watches', icon: <Watch size={18} /> },
    { name: 'Gaming', icon: <Gamepad2 size={18} /> }
  ];
  
  const trendingSearches = [
    'iPhone 15 Pro',
    'Samsung S24 Ultra',
    'MacBook Air M3',
    'Sony WH-1000XM5',
    'Dyson V11',
    'iPad Pro',
    'OLED TV',
    'PS5 Slim'
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    const element = document.querySelector('.home-search-section');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Use React Router's navigate instead of window.location for better performance
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className={`home-search-section ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="home-search-wrapper">
          <div className="home-search-glow"></div>
          
          <div className="home-search-content">
            <div className="home-search-header">
              <div className="badge">Start saving today</div>
              <h2 className="home-search-title">Find the best deals across the web</h2>
              <p className="home-search-subtitle">
                Compare prices from hundreds of retailers and get alerts when prices drop
              </p>
            </div>
            
            <form className="home-search-form" onSubmit={handleSubmit}>
              <div className="home-search-input-wrapper">
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search className="home-search-icon" size={20} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a product or paste a URL..."
                    className="home-search-input"
                    aria-label="Search for a product"
                  />
                </div>
                <button type="submit" className="home-search-button">
                  <span>Find Deals</span>
                  <ArrowRight size={16} className="btn-icon" />
                </button>
              </div>
            </form>
            
            <div className="home-search-categories">
              <div className="home-search-section-label">
                Popular Categories:
              </div>
              <div className="home-search-category-tags">
                {popularCategories.map((category, index) => (
                  <a 
                    key={index} 
                    href={`/categories/${category.name.toLowerCase()}`} 
                    className="home-search-category"
                  >
                    {category.icon}
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="home-search-trending">
              <div className="home-search-section-label">
                <TrendingUp size={16} />
                Trending Searches:
              </div>
              <div className="home-search-trending-tags">
                {trendingSearches.map((term, index) => (
                  <a 
                    key={index} 
                    href={`/search?q=${encodeURIComponent(term)}`} 
                    className="home-search-trending-tag"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSearch;