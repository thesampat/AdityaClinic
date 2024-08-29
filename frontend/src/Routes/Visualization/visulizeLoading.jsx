import React from 'react';
import './loading.css';

const ThreeDotsLoading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="loading-container">
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="loading-label">Loading...</div>
      </div>
    </div>
  );
};

export default ThreeDotsLoading;
