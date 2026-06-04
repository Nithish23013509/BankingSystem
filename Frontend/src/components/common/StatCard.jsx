import React from 'react';
import '../../styles/common.css';

const colorMap = {
  purple: 'purple',
  teal: 'teal',
  green: 'green',
  red: 'red',
  orange: 'orange',
};

function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'purple',
}) {
  const colorClass = colorMap[color] || 'purple';

  return (
    <div className={`stat-card stat-card--${colorClass}`}>
      <div className="stat-card__info">
        <div className="stat-card__title">{title}</div>
        <div className="stat-card__value">{value}</div>
        {trend && trendValue && (
          <div className={`stat-card__trend stat-card__trend--${trend}`}>
            <span className="stat-card__trend-icon">
              {trend === 'up' ? '↑' : '↓'}
            </span>
            {trendValue}
          </div>
        )}
      </div>
      <div className="stat-card__icon-wrapper">
        <span>{icon}</span>
      </div>
    </div>
  );
}

export default StatCard;
