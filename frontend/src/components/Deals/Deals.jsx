import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Bookmark, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './Deals.css';
import dealItems from './data/dealItems';

const Deals = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [animationDirection, setAnimationDirection] = useState(null);
  const [gridKey, setGridKey] = useState(0); // Used to force grid re-render
  // Remove setAllDeals since we're not updating the deals data in this component
  const allDeals = dealItems;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.querySelector('.deals');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setAnimationDirection('slide-left-exit');
      
      setTimeout(() => {
        setActiveTab(tab);
        setCurrentPage(1);
        setAnimationDirection('slide-left-enter');
        setGridKey(prevKey => prevKey + 1);
      }, 300);
    }
  };

  const handlePageChange = (page) => {
    if (typeof page === 'number' && page !== currentPage) {
      // Determine direction based on page number
      const direction = page > currentPage ? 'slide-left' : 'slide-right';
      setAnimationDirection(`${direction}-exit`);
      
      setTimeout(() => {
        setCurrentPage(page);
        setAnimationDirection(`${direction}-enter`);
        setGridKey(prevKey => prevKey + 1);
      }, 300);
    }
  };

  const navigateNext = () => {
    if (currentPage < Math.ceil(allDeals[activeTab].length / itemsPerPage)) {
      setAnimationDirection('slide-left-exit');
      
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setAnimationDirection('slide-left-enter');
        setGridKey(prevKey => prevKey + 1);
      }, 300);
    }
  };

  const navigatePrev = () => {
    if (currentPage > 1) {
      setAnimationDirection('slide-right-exit');
      
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setAnimationDirection('slide-right-enter');
        setGridKey(prevKey => prevKey + 1);
      }, 300);
    }
  };

  const getPaginatedItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allDeals[activeTab].slice(start, end);
  };

  const totalPages = Math.ceil(allDeals[activeTab].length / itemsPerPage);

  // Build an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    let rangeStart = currentPage - 1;
    let rangeEnd = currentPage + 1;
    
    // Adjust range if too close to start or end
    if (rangeStart <= 1) {
      rangeStart = 2;
      rangeEnd = Math.min(totalPages - 1, 4);
    } else if (rangeEnd >= totalPages) {
      rangeEnd = totalPages - 1;
      rangeStart = Math.max(2, totalPages - 3);
    }
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('...');
    }
    
    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Add a class to help determine if there's an ellipsis before current page
  const paginationClasses = [
    "deals-pagination",
    getPageNumbers().includes('...') && getPageNumbers()[1] === '...' ? 'has-first-ellipsis' : ''
  ].filter(Boolean).join(' ');

  return (
    <section className={`deals section ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="deals-header">
          <div className="deals-header-text">
            <span className="badge">Limited Time</span>
            <h2 className="section-title">Today's Best Deals</h2>
            <p className="section-subtitle">
              Discover the biggest discounts from your favorite stores. Updated hourly to ensure you never miss a great deal.
            </p>
          </div>
          
          <div className={`deals-tabs tab-${activeTab === 'trending' ? '1' : activeTab === 'top' ? '2' : '3'}-active`}>
            <button
              className={`deals-tab ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => handleTabChange('trending')}
            >
              Trending
            </button>
            <button
              className={`deals-tab ${activeTab === 'top' ? 'active' : ''}`}
              onClick={() => handleTabChange('top')}
            >
              Top Discounts
            </button>
            <button
              className={`deals-tab ${activeTab === 'ending' ? 'active' : ''}`}
              onClick={() => handleTabChange('ending')}
            >
              Ending Soon
            </button>
          </div>
        </div>
        
        <div 
          className={`deals-grid ${animationDirection || ''}`}
          key={gridKey}
        >
          {getPaginatedItems().map((item) => {
            const savedAmount = item.originalPrice - item.currentPrice;
            return (
              <div className="deal-card" key={item.id}>
                <div className="deal-card-header">
                  <div className="deal-discount">-{item.discount}%</div>
                  <div className="deal-actions">
                    <button className="deal-action-btn" aria-label="Save to favorites">
                      <Heart size={16} />
                    </button>
                    <button className="deal-action-btn" aria-label="Save to collection">
                      <Bookmark size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="deal-image-container">
                  <div className="deal-image-placeholder" style={{ backgroundImage: `url(${item.image})` }}></div>
                </div>
                
                <div className="deal-content">
                  <div className="deal-store">{item.store}</div>
                  <h3 className="deal-title">{item.title}</h3>
                  
                  <div className="deal-rating">
                    <div className="deal-stars">
                      <Star size={14} fill="currentColor" strokeWidth={0} />
                      <span>{item.rating}</span>
                    </div>
                    <span className="deal-reviews">({item.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="deal-price">
                    <div className="deal-current-price">₹{item.currentPrice}</div>
                    <div className="deal-original-price">₹{item.originalPrice}</div>
                  </div>
                  
                  <div className="deal-saved">
                    You saved <span className="deal-saved-amount">₹{savedAmount}</span>
                  </div>
                  
                  {item.endsIn && (
                    <div className="deal-expires">
                      Ends in: <span className="deal-timer">{item.endsIn}</span>
                    </div>
                  )}
                </div>
                
                <button className="deal-cta">
                  View Deal <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
        
        {totalPages > 1 && (
          <div className="deals-navigation">
            <button 
              className={`deals-nav-btn ${currentPage === 1 ? 'disabled' : ''}`} 
              aria-label="Previous page"
              onClick={navigatePrev}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={24} />
            </button>
            <div 
              className={paginationClasses}
              data-active={getPageNumbers().findIndex(page => page === currentPage) + 1}
            >
              {getPageNumbers().map((page, index) => (
                <span 
                  key={index}
                  className={`deals-page ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
                  onClick={() => page !== '...' ? handlePageChange(page) : null}
                  role={page !== '...' ? "button" : "presentation"}
                  tabIndex={page !== '...' ? 0 : -1}
                >
                  {page}
                </span>
              ))}
            </div>
            <button 
              className={`deals-nav-btn ${currentPage === totalPages ? 'disabled' : ''}`} 
              aria-label="Next page"
              onClick={navigateNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Deals;