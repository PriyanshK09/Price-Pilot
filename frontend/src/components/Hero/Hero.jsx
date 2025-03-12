import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-particles"></div>
      </div>
      
      <div className="container hero-container">
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <div className="hero-badges">
            <span className="badge hero-badge">Daily Price Updates</span>
            <span className="badge hero-badge">Price History Tracking</span>
          </div>
          
          <h1 className="hero-title">
            <span className="hero-title-highlight">Smart shopping</span> with price tracking intelligence
          </h1>
          
          <p className="hero-description">
            Price Pilot helps you track product prices across multiple retailers, notifies you of drops, and ensures you never overpay again. Save money effortlessly with our automated price tracking.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary">
              Get Started Free
              <ChevronRight className="btn-icon" size={18} />
            </button>
            <button className="btn btn-secondary">
              See How It Works
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">5M+</span>
              <span className="hero-stat-label">Products tracked</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">₹43M</span>
              <span className="hero-stat-label">Customer savings</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">200+</span>
              <span className="hero-stat-label">Supported stores</span>
            </div>
          </div>
        </div>
        
        <div className={`hero-image ${isVisible ? 'visible' : ''}`}>
          <div className="hero-image-device">
            <div className="hero-device-content">
              <div className="hero-device-screenshot">
                <div className="hero-device-notch"></div>
                <div className="hero-app-interface">
                  <div className="hero-app-header">
                    <div className="hero-app-logo"></div>
                    <div className="hero-app-actions"></div>
                  </div>
                  <div className="hero-app-product">
                    <div className="hero-product-image"></div>
                    <div className="hero-product-details">
                      <div className="hero-product-title"></div>
                      <div className="hero-product-price"></div>
                      <div className="hero-product-trend"></div>
                    </div>
                  </div>
                  <div className="hero-app-chart">
                    <div className="hero-chart-line"></div>
                    <div className="hero-chart-markers"></div>
                  </div>
                  <div className="hero-app-recommendations">
                    <div className="hero-recommendation"></div>
                    <div className="hero-recommendation"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-device-reflection"></div>
          </div>
          
          <div className="hero-floating-elements">
            <div className="hero-price-tag hero-float-element">
              <div className="hero-price-tag-inner">
                <span className="hero-price-old">₹1,299</span>
                <span className="hero-price-new">₹999</span>
                <span className="hero-price-save">Save ₹300</span>
              </div>
            </div>
            <div className="hero-notification hero-float-element">
              <div className="hero-notification-icon"></div>
              <div className="hero-notification-content">
                <div className="hero-notification-title">Price Drop Alert!</div>
                <div className="hero-notification-text">Sony XM5 Headphones now ₹100 lower</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;