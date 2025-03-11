import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bell, Heart, User, Menu, X } from 'lucide-react';
import ReactDOM from 'react-dom';
import './Header.css';
import SearchGlobal from '../Search/SearchGlobal';

function Header({ theme, toggleTheme }) {
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
    
    // Prevent scrolling when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      // First set the menu as closing
      const mobileMenu = document.querySelector('.mobile-menu');
      if (mobileMenu) {
        mobileMenu.classList.add('closing');
        
        // Let the closing animation complete before fully closing
        setTimeout(() => {
          setMobileMenuOpen(false);
          mobileMenu.classList.remove('closing');
        }, 400);
      } else {
        setMobileMenuOpen(false);
      }
    } else {
      setMobileMenuOpen(true);
    }
  };

  const handleMenuItemClick = (selector) => {
    // First set the menu as closing
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('closing');
      
      // Wait for animation before hiding
      setTimeout(() => {
        setMobileMenuOpen(false);
        mobileMenu.classList.remove('closing');
        
        // Then scroll to the section
        if (selector === 'top') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          setTimeout(() => {
            const element = document.querySelector(selector);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }, 400);
    } else {
      setMobileMenuOpen(false);
    }
  };

  // Create the mobile menu and backdrop using portals to render them outside of the header
  const renderMobileMenuPortal = () => {
    if (!document || typeof document === 'undefined') return null;
    
    return ReactDOM.createPortal(
      <>
        {/* Mobile Menu Backdrop */}
        <div 
          className={`mobile-menu-backdrop ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
        />
        
        {/* Updated Mobile Menu with slide animation */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <div className="mobile-menu-title">Menu</div>
            <button className="mobile-menu-close" onClick={toggleMobileMenu} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          
          <div className="mobile-search">
            <Search className="mobile-search-icon" size={18} />
            <input type="text" placeholder="Search for products..." />
          </div>
          
          <nav className="mobile-nav">
            <button 
              onClick={() => handleMenuItemClick('top')} 
              className="mobile-nav-item"
              style={{"--index": 1}}
            >
              Home
            </button>
            <button 
              onClick={() => handleMenuItemClick('.deals')} 
              className="mobile-nav-item"
              style={{"--index": 2}}
            >
              Deals
            </button>
            <button 
              onClick={() => handleMenuItemClick('.categories')} 
              className="mobile-nav-item"
              style={{"--index": 3}}
            >
              Categories
            </button>
            <button 
              onClick={() => handleMenuItemClick('.process')} 
              className="mobile-nav-item"
              style={{"--index": 4}}
            >
              How It Works
            </button>
            <button 
              onClick={() => handleMenuItemClick('.testimonials')} 
              className="mobile-nav-item"
              style={{"--index": 5}}
            >
              Testimonials
            </button>
            <button 
              onClick={() => handleMenuItemClick('.footer')} 
              className="mobile-nav-item"
              style={{"--index": 6}}
            >
              Contact
            </button>
          </nav>
        </div>
      </>,
      document.body
    );
  };

  return (
    <>
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
              <SearchGlobal />
            </div>
            
            <div className="header-actions">
              <button className="icon-button" aria-label="Toggle theme" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
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
      </header>
      
      {/* Render the mobile menu and backdrop with portal */}
      {renderMobileMenuPortal()}
    </>
  );
}

export default Header;