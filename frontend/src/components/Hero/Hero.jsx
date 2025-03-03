import React from 'react';
import { Search, ArrowRight, Check } from 'lucide-react';
import './Hero.css';
import { ReactComponent as ShoppingSVG } from './Shopping.svg';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-gradient"></div>
      <div className="hero-bg-pattern"></div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <div className="badge">Smart Price Comparison</div>
          <h1 className="hero-title">
            <span className="hero-title-line">Find the Best</span>
            <span className="hero-title-line">Deals Across</span>
            <span className="hero-title-line">the Web</span>
          </h1>
          <p className="hero-subtitle">
            Compare prices from hundreds of retailers and save money on your purchases with Price Pilot.
          </p>
          
          <div className="hero-search">
            <div className="hero-search-bar">
              <Search className="search-icon" size={18} />
              <input type="text" placeholder="Search for products..." />
            </div>
            <button className="btn btn-primary hero-search-btn">
              Compare Prices
              <ArrowRight className="btn-icon" size={18} />
            </button>
          </div>
          
          <div className="hero-features">
            <div className="hero-feature">
              <Check className="hero-feature-icon" size={16} />
              <span>Trusted Retailers</span>
            </div>
            <div className="hero-feature">
              <Check className="hero-feature-icon" size={16} />
              <span>Real-time Prices</span>
            </div>
            <div className="hero-feature">
              <Check className="hero-feature-icon" size={16} />
              <span>Price History</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="hero-image-glow"></div>
          <ShoppingSVG className="hero-shopping-svg" />
        </div>
      </div>
    </section>
  );
}

export default Hero;