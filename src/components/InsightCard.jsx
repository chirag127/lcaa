import React from 'react';

export default function InsightCard({
  id,
  number,
  type = 'green', // green, red, yellow, info
  badge,
  tag,
  title,
  body,
  description,
  metrics = [],
  kpis = [],
  directive,
  recommendation
}) {
  const cardId = id ?? number ?? '01';
  const cardBadge = badge || tag;
  const cardBody = body || description;
  const cardMetrics = metrics.length > 0 ? metrics : kpis;
  const cardDirective = directive || recommendation;

  return (
    <div className={`glass-panel insight-card ${type}`}>
      <div className="insight-header">
        <span className="insight-id">
          INSIGHT #{String(cardId).startsWith('V') ? cardId : String(cardId).padStart(2, '0')}
        </span>
        {cardBadge && <span className="insight-badge">{cardBadge}</span>}
      </div>
      <h4 className="insight-title">{title}</h4>
      <p className="insight-body">{cardBody}</p>

      {cardMetrics && cardMetrics.length > 0 && (
        <div className="insight-metric-row">
          {cardMetrics.map((m, idx) => (
            <div key={idx} className="insight-metric-item">
              <span>{m.label}</span>
              <strong>{m.value}</strong>
            </div>
          ))}
        </div>
      )}

      {cardDirective && (
        <div className="insight-directive">
          {cardDirective}
        </div>
      )}
    </div>
  );
}
