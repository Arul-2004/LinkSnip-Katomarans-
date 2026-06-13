import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  };

  const colorClasses = {
    primary: 'spinner-primary',
    accent: 'spinner-accent',
    white: 'spinner-white',
  };

  return (
    <div className="flex-center" style={{ width: '100%', padding: '2rem 0' }}>
      <div className={`spinner ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary}`}></div>
    </div>
  );
};

export default LoadingSpinner;
