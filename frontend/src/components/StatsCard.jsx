import React from 'react';

const StatsCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${color}`}>
        {icon}
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{title}</div>
        {subtitle && (
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
