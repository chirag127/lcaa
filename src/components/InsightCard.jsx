import React from 'react';

export default function InsightCard({
  id,
  type = 'green', // green, red, yellow, info
  badge,
  title,
  body,
  metrics = [],
  directive
}) {
  return (
    <div className={`glass-panel insight-card ${type}`}>
      <div className="insight-header">
        <span className="insight-id">INSIGHT #{String(id).padStart(2, '0')}</span>
        {badge && <span className="insight-badge">{badge}</span>}
      </div>
      <h4 className="insight-title">{title}</h4>
      <p className="insight-body">{body}</p>

      {metrics && metrics.length > 0 && (
        <div className="insight-metric-row">
          {metrics.map((m, idx) => (
            <div key={idx} className="insight-metric-item">
              <span>{m.label}</span>
              <strong>{m.value}</strong>
            </div>
          ))}
        </div>
      )}

      {directive && (
        <div className="insight-directive">
          {directive}
        </div>
      )}
    </div>
  );
}
