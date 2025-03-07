import React, { useState, useEffect } from 'react';
import { Send, Mail } from 'lucide-react';
import './Newsletter.css';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    const element = document.querySelector('.newsletter');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className={`newsletter section ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="newsletter-container">
          <div className="newsletter-background">
            <div className="newsletter-glow"></div>
            <div className="newsletter-pattern"></div>
          </div>
          
          <div className="newsletter-icon">
            <Mail size={28} />
          </div>
          
          <div className="badge">Stay Updated</div>
          <h2 className="newsletter-title">Never Miss a Deal</h2>
          <p className="newsletter-subtitle">
            Subscribe to our newsletter and get personalized deals and price drops delivered to your inbox.
          </p>
          
          <form className={`newsletter-form ${isSubmitted ? 'submitted' : ''}`} onSubmit={handleSubmit}>
            <div className="newsletter-form-content">
              <div className="newsletter-input-group">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                  <Send className="btn-icon" size={16} />
                </button>
              </div>
              <p className="newsletter-privacy">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
            
            <div className="newsletter-success">
              <div className="newsletter-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="icon">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Thank you for subscribing!</h3>
              <p>Check your email inbox for confirmation.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;