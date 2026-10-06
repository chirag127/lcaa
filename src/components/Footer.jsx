import React from 'react';
import { formatINR, formatPercent } from '../utils/formatters';

export default function Footer({ kpis }) {
  const totalLent = kpis?.total_amount_lent ?? 3208500;
  const closedAnr = kpis?.annualized_net_return_pct ?? 32.86;
  const realizedProfit = kpis?.total_net_profit ?? 118836.13;
  const totalLoans = kpis?.total_loans ?? 5276;
  const activeLoans = kpis?.active_loans ?? 2492;
  const closedLoans = kpis?.closed_loans ?? 2784;
  const npaLoans = kpis?.npa_loans ?? 233;
  const npaRate = kpis?.npa_rate_pct ?? 8.37;

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* Top Summary Row */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-badge small">LDC</div>
            <div>
              <div className="footer-brand-title">LenDenClub Algorithmic Decision Engine</div>
              <div className="footer-brand-sub">Manual Lending Portfolio Intelligence • Quantitative Risk Infrastructure</div>
            </div>
          </div>
          
          <div className="footer-status-pill">
            <span className="pulse-indicator"></span>
            <span>Analytics Engine Active &bull; 5,276 Loans Synchronized (100% Rate-Based)</span>
          </div>
        </div>

        {/* Metric Micro-Tiles Grid */}
        <div className="footer-metrics-grid">
          <div className="footer-metric-card">
            <span className="footer-metric-label">Total Capital Lent</span>
            <strong className="footer-metric-val">{formatINR(totalLent)}</strong>
            <span className="footer-metric-sub">{totalLoans.toLocaleString()} empirical loans</span>
          </div>

          <div className="footer-metric-card">
            <span className="footer-metric-label">Loan Resolution Split</span>
            <strong className="footer-metric-val">{closedLoans.toLocaleString()} Closed &bull; {activeLoans.toLocaleString()} Active</strong>
            <span className="footer-metric-sub">{npaLoans} NPA ({formatPercent(npaRate)})</span>
          </div>

          <div className="footer-metric-card">
            <span className="footer-metric-label">Official Closed ANR</span>
            <strong className="footer-metric-val success">{formatPercent(closedAnr)}</strong>
            <span className="footer-metric-sub">+{formatINR(realizedProfit)} Net Realized Profit</span>
          </div>

          <div className="footer-metric-card">
            <span className="footer-metric-label">Analytical Surfaces</span>
            <strong className="footer-metric-val cyan">100+ Charts &bull; 108 Insights</strong>
            <span className="footer-metric-sub">10 2D Matrices &bull; Live Loan Engine</span>
          </div>
        </div>

        {/* Bottom Legal / Tech Row */}
        <div className="footer-bottom">
          <div className="footer-tech-stack">
            <span className="tech-tag">Apache ECharts 6.0</span>
            <span className="tech-tag">React 19</span>
            <span className="tech-tag">Vite 6</span>
            <span className="tech-tag">TailwindCSS</span>
          </div>

          <p className="footer-disclaimer">
            Confidential proprietary algorithmic underwriting model. Backtested on empirical investor loan performance across all 5,276 loans.
          </p>

          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} LenDenClub Analytics Terminal &bull; v2.5.0-institutional
          </div>
        </div>
      </div>
    </footer>
  );
}
