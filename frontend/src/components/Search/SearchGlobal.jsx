import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, History, ArrowRight, Zap } from 'lucide-react';
import './SearchGlobal.css';

const SearchGlobal = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  // Sample trending searches
  const trendingSearches = [
    'Sony WH-1000XM5', 
    'iPhone 15 Pro', 
    'Samsung QLED TV', 
    'Dyson V11',
    'MacBook Air M3'
  ];
  
  // Sample recent searches (in a real app this would come from localStorage or user data)
  const recentSearches = [
    'MacBook Air M2',
    'Nike Air Zoom',
    'PlayStation 5'
  ];

  // Handle click outside to close expanded search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    
    if (e.target.value.length > 2) {
      setIsLoading(true);
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Mock search results - replace with actual API call
        setSearchResults([
          { 
            id: 1, 
            title: 'Apple MacBook Air M2', 
            price: 99999, 
            store: 'Amazon', 
            discount: 17, 
            image: '/images/macbook.jpg',
            badge: 'Popular'
          },
          { 
            id: 2, 
            title: 'MacBook Pro 14" M3', 
            price: 169999, 
            store: 'Flipkart', 
            discount: 10, 
            image: '/images/macbookpro.jpg' 
          },
          { 
            id: 3, 
            title: 'Apple Magic Keyboard', 
            price: 9999, 
            store: 'Croma', 
            discount: 20, 
            image: '/images/keyboard.jpg',
            badge: 'Best Deal'
          }
        ].filter(item => 
          item.title.toLowerCase().includes(e.target.value.toLowerCase())
        ));
        
        setIsLoading(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  // Clear search query
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsExpanded(false);
    }
  };

  // Handle individual result click
  const handleResultClick = (id) => {
    // You could navigate to product detail page
    // navigate(`/product/${id}`);
    // Or for now, just go to search results
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsExpanded(false);
  };

  return (
    <div className={`search-global ${isExpanded ? 'expanded' : ''}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-global-form">
        <div className="search-global-input-wrapper">
          <Search className="search-global-icon" size={18} />
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsExpanded(true)}
            className="search-global-input"
            aria-label="Search for products"
          />
          {query && (
            <button 
              type="button" 
              className="search-global-clear" 
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {isExpanded && (
        <div className="search-global-dropdown">
          <div className="search-global-glow"></div>
          {isLoading ? (
            <div className="search-global-loading">
              <div className="search-global-spinner"></div>
              <p>Searching products...</p>
            </div>
          ) : (
            <>
              {searchResults.length > 0 ? (
                <div className="search-global-results">
                  <h3 className="search-global-heading">Search Results</h3>
                  {searchResults.map(result => (
                    <div 
                      className="search-global-result-item" 
                      key={result.id}
                      onClick={() => handleResultClick(result.id)}
                    >
                      <div className="search-global-result-image">
                        <div className="search-global-result-image-inner" style={{ backgroundImage: `url(${result.image})` }}></div>
                      </div>
                      <div className="search-global-result-content">
                        <div className="search-global-result-meta">
                          <div className="search-global-result-store">{result.store}</div>
                          {result.badge && (
                            <div className="search-global-result-badge">
                              {result.badge === 'Popular' && <Zap size={10} />}
                              {result.badge}
                            </div>
                          )}
                        </div>
                        <h4 className="search-global-result-title">{result.title}</h4>
                        <div className="search-global-result-price">
                          <span className="search-global-result-current">₹{result.price.toLocaleString()}</span>
                          {result.discount > 0 && (
                            <span className="search-global-result-discount">-{result.discount}%</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="search-global-result-arrow" size={16} />
                    </div>
                  ))}
                  <button 
                    onClick={handleSubmit} 
                    className="search-global-view-all"
                  >
                    View all results <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="search-global-suggestions">
                  {/* Trending searches */}
                  <div className="search-global-section">
                    <h3 className="search-global-heading">
                      <TrendingUp size={16} />
                      Trending Searches
                    </h3>
                    <div className="search-global-tags">
                      {trendingSearches.map((term, index) => (
                        <button 
                          key={index} 
                          className="search-global-tag" 
                          onClick={() => {
                            setQuery(term);
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                            setIsExpanded(false);
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div className="search-global-section">
                      <h3 className="search-global-heading">
                        <History size={16} />
                        Recent Searches
                      </h3>
                      <div className="search-global-tags">
                        {recentSearches.map((term, index) => (
                          <button 
                            key={index} 
                            className="search-global-tag recent" 
                            onClick={() => {
                              setQuery(term);
                              navigate(`/search?q=${encodeURIComponent(term)}`);
                              setIsExpanded(false);
                            }}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchGlobal;