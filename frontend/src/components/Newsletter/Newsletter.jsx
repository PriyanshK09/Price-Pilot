import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './Newsletter.css';

function Newsletter() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <section className="newsletter section">
      <div className="container">
        <div className="newsletter-container">
          <div className="newsletter-glow"></div>
          <div className="badge">Stay Updated</div>
          <h2 className="newsletter-title">Never Miss a Deal</h2>
          <p className="newsletter-subtitle">
            Subscribe to our newsletter and get personalized deals and price drops delivered to your inbox.
          </p>
          
          <form className="newsletter-form" onSubmit={handleSubmit}>
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
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;