import React, { useRef, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './Testimonials.css';

function Testimonials() {
  const swiperRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: 'Arjun Sharma',
      role: 'Tech Enthusiast',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Price Pilot saved me over ₹15,000 on my latest laptop purchase. The price history feature helped me time my purchase perfectly!',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Smart Shopper',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'I\'ve been using Price Pilot for 3 months now and it\'s become my go-to tool before making any purchase online. The price comparisons are accurate and comprehensive.',
      rating: 5
    },
    {
      id: 3,
      name: 'Vikram Mehta',
      role: 'Budget Conscious',
      avatar: 'https://randomuser.me/api/portraits/men/74.jpg',
      content: 'The browser extension is a game changer! It automatically shows me better deals while I\'m shopping on Flipkart and Amazon. Incredibly useful.',
      rating: 4
    },
    {
      id: 4,
      name: 'Neha Gupta',
      role: 'Gadget Lover',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      content: 'Price alerts feature is fantastic - I set up notifications for a gaming console and bought it when the price dropped by 15%. Couldn\'t be happier!',
      rating: 5
    },
    {
      id: 5,
      name: 'Rajesh Khanna',
      role: 'Online Shopper',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      content: 'What sets Price Pilot apart is how it not only compares prices but also shipping costs and delivery times. It\'s the complete package for smart shopping.',
      rating: 5
    },
    {
      id: 6,
      name: 'Ananya Singh',
      role: 'Frequent Shopper',
      avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
      content: 'I love how Price Pilot notifies me about flash sales and limited-time offers. I\'ve managed to grab amazing deals that I would have otherwise missed!',
      rating: 5
    }
  ];

  // Add duplicate cards at the beginning and end to ensure smooth looping
  const extendedTestimonials = [
    ...testimonials.slice(testimonials.length - 3),
    ...testimonials,
    ...testimonials.slice(0, 3)
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={i < rating ? "star-filled" : "star-empty"} 
          size={16} 
        />
      );
    }
    
    return stars;
  };

  // Setup effect for swiper initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        const swiper = swiperRef.current.swiper;
        swiper.update();
        
        // Set initial slide to start of actual testimonials (after the duplicates)
        swiper.slideToLoop(0, 0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="testimonials section">
      <div className="testimonial-bg-glow"></div>
      <div className="container">
        <div className="badge-wrapper">
          <div className="badge">User Stories</div>
        </div>
        <h2 className="section-title">What Our Users Say</h2>
        <p className="section-subtitle">
          Discover how Price Pilot is helping shoppers save money and make smarter purchasing decisions.
        </p>
        
        <div className="testimonials-container">
          <div className="testimonial-glow"></div>
          
          <Swiper
            ref={swiperRef}
            modules={[Autoplay]}
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
                slidesPerView: 3,
                spaceBetween: 30
              }
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            className="testimonials-slider"
            onInit={(swiper) => {
              if (!swiper) return;
              
              setTimeout(() => {
                if (swiper && typeof swiper.update === 'function') {
                  swiper.update();
                }
              }, 100);
            }}
          >
            {extendedTestimonials.map((testimonial, index) => (
              <SwiperSlide key={`${testimonial.id}-${index}`} className="testimonial-slide">
                <div className="testimonial-card">
                  <div className="testimonial-quote">
                    <Quote className="quote-icon" size={32} />
                  </div>
                  <div className="testimonial-content">
                    {testimonial.content}
                  </div>
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  <div className="testimonial-user">
                    <div className="testimonial-avatar">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        loading="eager"
                      />
                    </div>
                    <div className="testimonial-user-info">
                      <h4 className="testimonial-name">{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;