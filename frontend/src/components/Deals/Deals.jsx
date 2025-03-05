import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Bookmark, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './Deals.css';

const Deals = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [animationDirection, setAnimationDirection] = useState(null);
  const [gridKey, setGridKey] = useState(0); // Used to force grid re-render
  
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
      // First set the exit animation
      setAnimationDirection('slide-left-exit');
      
      // After a brief delay, change the page and set the enter animation
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setAnimationDirection('slide-left-enter');
        setGridKey(prevKey => prevKey + 1);
      }, 300);
    }
  };

  const navigatePrev = () => {
    if (currentPage > 1) {
      // First set the exit animation
      setAnimationDirection('slide-right-exit');
      
      // After a brief delay, change the page and set the enter animation
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setAnimationDirection('slide-right-enter');
        setGridKey(prevKey => prevKey + 1);
      }, 300);
    }
  };

  // Complete deal items dataset
  const allDeals = {
    trending: [
      {
        id: 1,
        title: 'Sony WH-1000XM5 Wireless Headphones',
        originalPrice: 39999,
        currentPrice: 29999,
        discount: 25,
        image: '/images/headphones.jpg',
        rating: 4.8,
        reviewCount: 1245,
        store: 'Amazon',
        category: 'Electronics',
      },
      {
        id: 2,
        title: 'Apple iPad Air (5th Generation)',
        originalPrice: 59999,
        currentPrice: 49999,
        discount: 17,
        image: '/images/ipad.jpg',
        rating: 4.9,
        reviewCount: 2156,
        store: 'Best Buy',
        category: 'Electronics',
      },
      {
        id: 3,
        title: 'Dyson V11 Torque Drive Cordless Vacuum',
        originalPrice: 69999,
        currentPrice: 54999,
        discount: 21,
        image: '/images/vacuum.jpg',
        rating: 4.7,
        reviewCount: 876,
        store: 'Target',
        category: 'Home',
      },
      {
        id: 4,
        title: 'Samsung 55" QLED 4K Smart TV',
        originalPrice: 99999,
        currentPrice: 74999,
        discount: 25,
        image: '/images/tv.jpg',
        rating: 4.6,
        reviewCount: 932,
        store: 'Walmart',
        category: 'Electronics',
      },
      {
        id: 5,
        title: 'Nikon Z6 II Mirrorless Camera',
        originalPrice: 189999,
        currentPrice: 159999,
        discount: 16,
        image: '/images/camera.jpg',
        rating: 4.8,
        reviewCount: 538,
        store: 'Amazon',
        category: 'Electronics',
      },
      {
        id: 6,
        title: 'Bose QuietComfort Earbuds II',
        originalPrice: 29999,
        currentPrice: 24999,
        discount: 17,
        image: '/images/earbuds.jpg',
        rating: 4.7,
        reviewCount: 1120,
        store: 'Flipkart',
        category: 'Electronics',
      },
      {
        id: 7,
        title: 'LG 34" UltraWide Monitor',
        originalPrice: 44999,
        currentPrice: 35999,
        discount: 20,
        image: '/images/monitor.jpg',
        rating: 4.5,
        reviewCount: 724,
        store: 'Amazon',
        category: 'Electronics',
      },
      {
        id: 8,
        title: 'DJI Mini 3 Pro Drone',
        originalPrice: 89999,
        currentPrice: 79999,
        discount: 11,
        image: '/images/drone.jpg',
        rating: 4.9,
        reviewCount: 326,
        store: 'Reliance Digital',
        category: 'Electronics',
      }
    ],
    top: [
      {
        id: 9,
        title: 'Philips Air Fryer XXL',
        originalPrice: 14999,
        currentPrice: 8999,
        discount: 40,
        image: '/images/airfryer.jpg',
        rating: 4.5,
        reviewCount: 892,
        store: 'Amazon',
        category: 'Home',
      },
      {
        id: 10,
        title: 'Nike Air Zoom Pegasus 39',
        originalPrice: 12999,
        currentPrice: 7799,
        discount: 40,
        image: '/images/shoes.jpg',
        rating: 4.6,
        reviewCount: 1456,
        store: 'Nike',
        category: 'Fashion',
      },
      {
        id: 11,
        title: 'PlayStation 5 Digital Edition',
        originalPrice: 44999,
        currentPrice: 29999,
        discount: 33,
        image: '/images/ps5.jpg',
        rating: 4.9,
        reviewCount: 3256,
        store: 'Flipkart',
        category: 'Gaming',
      },
      {
        id: 12,
        title: 'Samsung Galaxy Watch 6',
        originalPrice: 34999,
        currentPrice: 22999,
        discount: 34,
        image: '/images/watch.jpg',
        rating: 4.7,
        reviewCount: 982,
        store: 'Croma',
        category: 'Wearables',
      },
      {
        id: 13,
        title: 'Adidas Ultra Boost 22',
        originalPrice: 17999,
        currentPrice: 10799,
        discount: 40,
        image: '/images/adidas.jpg',
        rating: 4.8,
        reviewCount: 748,
        store: 'Myntra',
        category: 'Fashion',
      },
      {
        id: 14,
        title: 'Lenovo IdeaPad Slim 5',
        originalPrice: 89999,
        currentPrice: 55999,
        discount: 38,
        image: '/images/laptop.jpg',
        rating: 4.5,
        reviewCount: 356,
        store: 'Amazon',
        category: 'Electronics',
      },
      {
        id: 15,
        title: 'Levi\'s Men\'s 511 Jeans',
        originalPrice: 4999,
        currentPrice: 2999,
        discount: 40,
        image: '/images/jeans.jpg',
        rating: 4.6,
        reviewCount: 1235,
        store: 'Ajio',
        category: 'Fashion',
      },
      {
        id: 16,
        title: 'Instant Pot Duo Evo Plus',
        originalPrice: 12999,
        currentPrice: 7999,
        discount: 38,
        image: '/images/instantpot.jpg',
        rating: 4.7,
        reviewCount: 892,
        store: 'Amazon',
        category: 'Home',
      }
    ],
    ending: [
      {
        id: 17,
        title: 'Apple MacBook Air M2',
        originalPrice: 119999,
        currentPrice: 99999,
        discount: 17,
        image: '/images/macbook.jpg',
        rating: 4.9,
        reviewCount: 782,
        store: 'Amazon',
        category: 'Electronics',
        endsIn: '12:25:16',
      },
      {
        id: 18,
        title: 'Sony PlayStation VR2',
        originalPrice: 59999,
        currentPrice: 49999,
        discount: 17,
        image: '/images/psvr.jpg',
        rating: 4.7,
        reviewCount: 316,
        store: 'Flipkart',
        category: 'Gaming',
        endsIn: '08:45:32',
      },
      {
        id: 19,
        title: 'KitchenAid Artisan Stand Mixer',
        originalPrice: 49999,
        currentPrice: 39999,
        discount: 20,
        image: '/images/mixer.jpg',
        rating: 4.8,
        reviewCount: 1024,
        store: 'Amazon',
        category: 'Home',
        endsIn: '05:30:22',
      },
      {
        id: 20,
        title: 'Samsung Galaxy Tab S9',
        originalPrice: 69999,
        currentPrice: 59999,
        discount: 14,
        image: '/images/tablet.jpg',
        rating: 4.6,
        reviewCount: 528,
        store: 'Croma',
        category: 'Electronics',
        endsIn: '02:15:45',
      },
      {
        id: 21,
        title: 'Apple Watch Series 9',
        originalPrice: 44999,
        currentPrice: 37999,
        discount: 16,
        image: '/images/applewatch.jpg',
        rating: 4.8,
        reviewCount: 635,
        store: 'Reliance Digital',
        category: 'Wearables',
        endsIn: '13:45:08',
      },
      {
        id: 22,
        title: 'Bose SoundLink Revolve+ II',
        originalPrice: 29999,
        currentPrice: 24999,
        discount: 17,
        image: '/images/speaker.jpg',
        rating: 4.7,
        reviewCount: 463,
        store: 'Amazon',
        category: 'Electronics',
        endsIn: '09:50:18',
      },
      {
        id: 23,
        title: 'GoPro HERO11 Black',
        originalPrice: 44999,
        currentPrice: 37999,
        discount: 16,
        image: '/images/gopro.jpg',
        rating: 4.6,
        reviewCount: 327,
        store: 'Flipkart',
        category: 'Electronics',
        endsIn: '06:20:42',
      },
      {
        id: 24,
        title: 'Nintendo Switch OLED Model',
        originalPrice: 34999,
        currentPrice: 28999,
        discount: 17,
        image: '/images/switch.jpg',
        rating: 4.9,
        reviewCount: 892,
        store: 'Amazon',
        category: 'Gaming',
        endsIn: '03:10:35',
      }
    ]
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
        
        <div className="deals-grid" key={gridKey}>
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
                    <div className="deal-current-price">₹{item.currentPrice.toLocaleString('en-IN')}</div>
                    <div className="deal-original-price">₹{item.originalPrice.toLocaleString('en-IN')}</div>
                  </div>
                  
                  <div className="deal-saved">
                    You save: <span className="deal-saved-amount">₹{savedAmount.toLocaleString('en-IN')}</span>
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