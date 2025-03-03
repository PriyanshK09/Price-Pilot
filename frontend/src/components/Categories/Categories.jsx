import React from 'react';
import { Laptop, Shirt, Sofa, Smartphone, Watch, Camera, Headphones, ShoppingBag, ArrowRight } from 'lucide-react';
import './Categories.css';

function Categories() {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      icon: <Laptop size={24} />,
      count: '2,543 products',
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'Fashion',
      icon: <Shirt size={24} />,
      count: '1,834 products',
      color: '#4ECDC4'
    },
    {
      id: 3,
      name: 'Home & Living',
      icon: <Sofa size={24} />,
      count: '1,425 products',
      color: '#45B7D1'
    },
    {
      id: 4,
      name: 'Smartphones',
      icon: <Smartphone size={24} />,
      count: '987 products',
      color: '#96CEB4'
    },
    {
      id: 5,
      name: 'Watches',
      icon: <Watch size={24} />,
      count: '654 products',
      color: '#D4A5A5'
    },
    {
      id: 6,
      name: 'Cameras',
      icon: <Camera size={24} />,
      count: '432 products',
      color: '#9B8816'
    },
    {
      id: 7,
      name: 'Audio',
      icon: <Headphones size={24} />,
      count: '765 products',
      color: '#6C5B7B'
    },
    {
      id: 8,
      name: 'Accessories',
      icon: <ShoppingBag size={24} />,
      count: '1,123 products',
      color: '#C06C84'
    }
  ];

  return (
    <section className="categories section">
      <div className="container">
        <div className="badge-wrapper">
          <div className="badge">Browse Categories</div>
        </div>
        <h2 className="section-title">Popular Categories</h2>
        <p className="section-subtitle">
          Explore our wide range of categories and find the best deals for your needs.
        </p>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.id}>
              <div 
                className="category-icon" 
                style={{ 
                  '--category-color': category.color,
                  backgroundColor: `${category.color}15`
                }}
              >
                {category.icon}
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count}</p>
              </div>
              <div className="category-arrow">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;