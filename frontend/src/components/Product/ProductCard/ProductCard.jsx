import React from 'react';
import { Heart, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const {
    id,
    title,
    image,
    currentPrice,
    originalPrice,
    discountPercent,
    store,
    rating,
    reviewCount,
    inStock
  } = product;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`product-card ${viewMode}`}>
      <div className="product-card-inner">
        <div className="product-card-front">
          <div className="product-card-image">
            <Link to={`/product/${id}`}>
              <img src={image} alt={title} loading="lazy" />
            </Link>
            
            <button className="product-card-wishlist" aria-label="Add to wishlist">
              <Heart size={18} />
            </button>
            
            {discountPercent > 0 && (
              <div className="product-card-discount">
                <span>{discountPercent}% OFF</span>
              </div>
            )}
          </div>
          
          <div className="product-card-content">
            <Link to={`/product/${id}`} className="product-card-title-link">
              <h3 className="product-card-title">{title}</h3>
            </Link>
            
            <div className="product-card-rating">
              <div className="rating-stars">
                <Star size={14} fill="#697565" color="#697565" />
                <span>{rating}</span>
              </div>
              <span className="reviews-count">({reviewCount} reviews)</span>
            </div>
            
            <div className="product-card-store">
              <span>from</span> {store}
            </div>
            
            <div className="product-card-price">
              <div className="price-current">{formatPrice(currentPrice)}</div>
              {originalPrice && (
                <div className="price-original">{formatPrice(originalPrice)}</div>
              )}
            </div>
            
            <div className="product-card-status">
              {inStock ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="product-card-actions">
          <Link to={`/product/${id}`} className="btn btn-primary btn-card">
            View Details
          </Link>
          <button 
            onClick={() => window.open(`https://pricepilot.com/compare/${id}`, '_blank')}
            className="btn btn-outline btn-card"
          >
            Compare Prices <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;