import React from 'react';
import { formatINRCompact, formatPercent } from '../utils/formatters';

export default function Header({ kpis, theme = 'light', onToggleTheme }) {
  const anr = kpis?.annualized_net_return_pct ?? 32.86;
  const roi = kpis?.overall_roi_pct ?? 5.80;
  const npaRate = kpis?.npa_rate_pct ?? 8.37;
  const strictDpd = kpis?.strict_zero_tolerance_delinquency_pct ?? 4.02;
  const prepayRate = kpis?.prepayment_rate_pct ?? 50.75;
  const disbursed = kpis?.total_amount_lent ?? 3208500;
  const pos = kpis?.total_principal_outstanding_active ?? 753845.58;

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="brand-badge">LDC</div>
        <div>
          <h1 className="brand-title">LenDenClub Portfolio Analytics & Algorithmic Underwriting Engine</h1>
          <p className="brand-subtitle">
            100% Rate & Percentage Analytics &bull; 5,276 Loans (2,492 Active + 2,784 Closed) &bull; Zero Absolute Bias
          </p>
        </div>
      </div>
      
      <div className="header-pills">
        <div className="stat-pill success" title="Annualized Net Return across closed loans">
          <span style={{ color: 'var(--text-muted)' }}>Net ANR:</span>
          <strong>{formatPercent(anr)}</strong>
        </div>
        <div className="stat-pill success" title="Percentage of closed loans that prepaid early">
          <span style={{ color: 'var(--text-muted)' }}>Prepay Rate:</span>
          <strong>{formatPercent(prepayRate)}</strong>
        </div>
        <div className="stat-pill info" title="Realized net profit percentage on disbursed capital">
          <span style={{ color: 'var(--text-muted)' }}>Realized ROI:</span>
          <strong>{formatPercent(roi)}</strong>
        </div>
        <div className="stat-pill warning" title="Strict Zero-Tolerance: Loans with any DPD >= 1 day">
          <span style={{ color: 'var(--text-muted)' }}>Strict DPD (1+):</span>
          <strong>{formatPercent(strictDpd)}</strong>
        </div>
        <div className="stat-pill danger" title="Regulatory 90+ DPD NPA rate">
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
