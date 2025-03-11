import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', text = '' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader">
        <div className="loader-circle"></div>
        <div className="loader-line-mask">
          <div className="loader-line"></div>
        </div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;