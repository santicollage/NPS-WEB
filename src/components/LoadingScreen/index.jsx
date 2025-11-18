import React from 'react';
import './LoadingScreen.scss';

const LoadingScreen = () => {
  return (
    <div className="mechanic-loader-overlay">
      <div className="gears">
        <div className="gear gear-large">
          <div className="center-dot"></div>
        </div>

        <div className="gear gear-medium">
          <div className="center-dot"></div>
        </div>

        <div className="gear gear-small">
          <div className="center-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
