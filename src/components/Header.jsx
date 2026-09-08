import React from 'react';
import { formatINRCompact, formatPercent } from '../utils/formatters';

export default function Header({ kpis, theme = 'light', onToggleTheme }) {
  const anr = kpis?.official_closed_anr ?? 16.91;
  const disbursed = kpis?.total_disbursed ?? 2869500;
  const pos = kpis?.principal_outstanding ?? 738856;
  const npaRate = kpis?.total_disbursed ? ((kpis.npa_amount / kpis.total_disbursed) * 100) : 3.09;

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="brand-badge">LDC</div>
        <div>
          <h1 className="brand-title">LenDenClub Portfolio Analytics & Algorithmic Decision Engine</h1>
          <p className="brand-subtitle">Manual Lending Intelligence Platform &bull; 3,967 Loans Analyzed &bull; ₹2.87M Capital Deployed</p>
        </div>
      </div>
      
      <div className="header-pills">
        <div className="stat-pill success">
          <span style={{ color: 'var(--text-muted)' }}>Closed ANR:</span>
          <strong>{formatPercent(anr)}</strong>
        </div>
        <div className="stat-pill info">
          <span style={{ color: 'var(--text-muted)' }}>Total Lent:</span>
          <strong>{formatINRCompact(disbursed)}</strong>
        </div>
        <div className="stat-pill warning">
          <span style={{ color: 'var(--text-muted)' }}>Active POS:</span>
          <strong>{formatINRCompact(pos)}</strong>
        </div>
        <div className="stat-pill danger">
          <span style={{ color: 'var(--text-muted)' }}>NPA Rate:</span>
          <strong>{formatPercent(npaRate)}</strong>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <>
              <span>🌙</span>
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <span>☀️</span>
              <span>Light Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
