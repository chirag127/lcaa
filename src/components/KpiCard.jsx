import React from 'react';

export default function KpiCard({ label, badge, value, subtext, accentColor }) {
  return (
    <div className="glass-panel kpi-card" style={{ '--accent-color': accentColor }}>
      <div className="kpi-label">
        <span>{label}</span>
        {badge && <span style={{ color: accentColor, fontWeight: 800 }}>{badge}</span>}
      </div>
      <div className="kpi-value">{value}</div>
      {subtext && <div className="kpi-sub">{subtext}</div>}
    </div>
  );
}
