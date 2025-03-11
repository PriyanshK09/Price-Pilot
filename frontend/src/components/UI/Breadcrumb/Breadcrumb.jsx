import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              {isLast || !item.link ? (
                <span>{item.label}</span>
              ) : (
                <>
                  <Link to={item.link}>{item.label}</Link>
                  <ChevronRight size={14} className="breadcrumb-separator" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;