import React, { useState, useEffect } from 'react';
import './Features.css';

function Features() {
  const [isVisible, setIsVisible] = useState(false);
  
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
    
    const element = document.querySelector('.features');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const features = [
    {
      id: 1,
      title: 'Real-Time Price Tracking',
      description: 'Monitor price changes across multiple retailers and get instant notifications when prices drop on your favorite items.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20v-6M6 20V10M18 20V4"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Price History Charts',
      description: 'View detailed historical price data to identify trends and determine the best time to make your purchase.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
          <line x1="2" y1="20" x2="22" y2="20"></line>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Smart Browser Extension',
      description: 'Automatically compare prices as you shop online with our powerful browser extension that works across all major retailers.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          <line x1="12" y1="22" x2="12" y2="15.5"></line>
          <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
        </svg>
      )
    }
  ];

  return (
    <section className={`features section ${isVisible ? 'visible' : ''}`}>
      <div className="features-pattern"></div>
      <div className="container">
        <div className="features-content">
          <div className="features-text">
            <div className="badge">Key Features</div>
            <h2 className="features-title">Smart Shopping Tools</h2>
            <p className="features-subtitle">Discover powerful features that help you find the best deals and save money on every purchase.</p>
          </div>
          
          <div className="features-list">
            {features.map(feature => (
              <div className="feature-card" key={feature.id}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;