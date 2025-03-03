import React, { useRef, useEffect } from 'react';
import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Deals.css';

function Deals() {
  const swiperRef = useRef(null);
  
  const deals = [
    {
      id: 1,
      title: 'Wireless Noise-Cancelling Headphones',
      image: '/placeholder.svg?height=200&width=200',
      currentPrice: 79.99,
      originalPrice: 129.99,
      discount: 38,
      rating: 4.8,
      reviews: 256,
      stores: ['TechStore', 'ElectroMart']
    },
    {
      id: 2,
      title: 'Smart Watch Series 5 - Health & Fitness Tracker',
      image: '/placeholder.svg?height=200&width=200',
      currentPrice: 199.99,
      originalPrice: 249.99,
      discount: 20,
      rating: 4.7,
      reviews: 189,
      stores: ['WatchDepot', 'TechStore']
    },
    {
      id: 3,
      title: 'Portable Bluetooth Speaker with 24-Hour Battery',
      image: '/placeholder.svg?height=200&width=200',
      currentPrice: 45.99,
      originalPrice: 69.99,
      discount: 34,
      rating: 4.9,
      reviews: 312,
      stores: ['AudioWorld', 'SoundMasters']
    },
    {
      id: 4,
      title: 'Robot Vacuum Cleaner with Smart Mapping',
      image: '/placeholder.svg?height=200&width=200',
      currentPrice: 199.99,
      originalPrice: 299.99,
      discount: 33,
      rating: 4.6,
      reviews: 178,
      stores: ['HomeGoods', 'CleanTech']
    },
    {
      id: 5,
      title: 'Wireless Charging Pad for Smartphones',
      image: '/placeholder.svg?height=200&width=200',
      currentPrice: 29.99,
      originalPrice: 49.99,
      discount: 40,
      rating: 4.5,
      reviews: 203,
      stores: ['TechStore', 'GadgetHub']
    },
    {
      id: 6,
      title: 'Ultra HD 4K Smart TV - 55 inch',
      image: '/placeholder.svg?height=200&width=200',
      currentPrice: 399.99,
      originalPrice: 599.99,
      discount: 33,
      rating: 4.8,
      reviews: 356,
      stores: ['ElectroMart', 'TVWorld']
    }
  ];

  // Add duplicate deals to ensure smooth looping
  const extendedDeals = [
    ...deals.slice(deals.length - 3),
    ...deals,
    ...deals.slice(0, 3)
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="star-filled" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="star-half" size={16} />);
      } else {
        stars.push(<Star key={i} className="star-empty" size={16} />);
      }
    }
    
    return stars;
  };

  // Setup effect for swiper initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        const swiper = swiperRef.current.swiper;
        swiper.update();
        
        // Set initial slide to start of actual deals (after the duplicates)
        swiper.slideToLoop(0, 0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="deals section">
      <div className="container">
        <div className="badge-wrapper">
          <div className="badge">Limited Time Offers</div>
        </div>
        <h2 className="section-title">Today's Best Deals</h2>
        <p className="section-subtitle">
          Discover the biggest savings across electronics, fashion, home goods, and more.
        </p>
        
        <div className="deals-carousel-container">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            grabCursor={true}
            speed={700}
            loop={true}
            watchSlidesProgress={true}
            observer={true}
            observeParents={true}
            simulateTouch={true}
            touchRatio={1}
            preventClicks={false}
            allowTouchMove={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 3, // Ensure exactly 3 cards on larger screens
                spaceBetween: 30
              }
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{
              clickable: true,
              el: '.deals-pagination',
              bulletClass: 'deal-indicator',
              bulletActiveClass: 'active',
            }}
            navigation={{
              prevEl: '.deals-nav-btn.prev',
              nextEl: '.deals-nav-btn.next',
            }}
            className="deals-slider"
            onInit={(swiper) => {
              if (!swiper) return;
              
              setTimeout(() => {
                if (swiper && typeof swiper.update === 'function') {
                  swiper.update();
                }
              }, 100);
            }}
          >
            {extendedDeals.map((deal, index) => (
              <SwiperSlide key={`${deal.id}-${index}`} className="deal-slide">
                <div className="deal-card">
                  <div className="deal-discount">Save {deal.discount}%</div>
                  <div className="deal-image">
                    <img src={deal.image || "/placeholder.svg"} alt={deal.title} />
                  </div>
                  <div className="deal-content">
                    <h3 className="deal-title">{deal.title}</h3>
                    <div className="deal-price">
                      <span className="current-price">${deal.currentPrice}</span>
                      <span className="original-price">${deal.originalPrice}</span>
                    </div>
                    <div className="deal-rating">
                      <div className="stars">
                        {renderStars(deal.rating)}
                      </div>
                      <span className="reviews">({deal.reviews})</span>
                    </div>
                    <div className="deal-stores">
                      Available at {deal.stores.join(', ')} {deal.stores.length > 1 ? '+ more' : ''}
                    </div>
                    <button className="btn btn-primary deal-btn">
                      Compare Prices
                      <ArrowRight className="btn-icon" size={16} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="deals-navigation">
            <button className="deals-nav-btn prev" aria-label="Previous deal">
              <ChevronLeft size={24} />
            </button>
            <div className="deals-pagination"></div>
            <button className="deals-nav-btn next" aria-label="Next deal">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        <div className="deals-action">
          <button className="btn btn-secondary">
            View All Deals
            <ArrowRight className="btn-icon" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Deals;