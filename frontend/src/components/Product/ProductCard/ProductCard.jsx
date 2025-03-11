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
    inStock,
    delivery
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
                -{discountPercent}%
              </div>
            )}
          </div>
          
          <div className="product-card-content">
            <div className="product-card-store">{store}</div>
            
            <Link to={`/product/${id}`} className="product-card-title">
              {title.length > 65 ? `${title.substring(0, 65)}...` : title}
            </Link>
            
            <div className="product-card-pricing">
              <div className="product-card-current-price">
                {formatPrice(currentPrice)}
              </div>
              
              {originalPrice && (
                <div className="product-card-original-price">
                  {formatPrice(originalPrice)}
                </div>
              )}
            </div>
            
            <div className="product-card-meta">
              {rating && (
                <div className="product-card-rating">
                  <Star size={14} fill="currentColor" strokeWidth={0} />
                  <span>{rating}</span>
                  {reviewCount > 0 && <span className="product-card-reviews">({reviewCount})</span>}
                </div>
              )}
              
              {delivery && (
                <div className="product-card-delivery">
                  {delivery}
                </div>
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
            onClick={() => window.open(product.productUrl || `https://pricepilot.com/compare/${id}`, '_blank')}
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