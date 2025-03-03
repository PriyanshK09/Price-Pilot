import React, { useState, useEffect } from 'react';
import { Search, Moon, Bell, Heart, User, Menu, X } from 'lucide-react';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-notch">
          <div className="logo">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <span className="logo-text">Price Pilot</span>
          </div>
          
          <div className="search-container">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input type="text" placeholder="Search for products..." />
            </div>
          </div>
          
          <div className="header-actions">
            <button className="icon-button" aria-label="Toggle theme">
              <Moon size={20} />
            </button>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <button className="icon-button" aria-label="Favorites">
              <Heart size={20} />
            </button>
            <button className="icon-button" aria-label="Account">
              <User size={20} />
            </button>
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <Search className="mobile-search-icon" size={18} />
            <input type="text" placeholder="Search for products..." />
          </div>
          <nav className="mobile-nav">
            <a href="#" className="mobile-nav-item">Home</a>
            <a href="#" className="mobile-nav-item">Deals</a>
            <a href="#" className="mobile-nav-item">Categories</a>
            <a href="#" className="mobile-nav-item">How It Works</a>
            <a href="#" className="mobile-nav-item">Testimonials</a>
            <a href="#" className="mobile-nav-item">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;