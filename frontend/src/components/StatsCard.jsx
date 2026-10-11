import React from 'react';

const StatsCard = ({ title, value, icon, variant = 'primary' }) => {
  return (
    <div className={`stats-card stats-${variant}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-info">
        <span className="stats-title">{title}</span>
        <h3 className="stats-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
