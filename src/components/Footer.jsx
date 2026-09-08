import React from 'react';
import { formatINR, formatPercent } from '../utils/formatters';

export default function Footer({ kpis }) {
  const totalLent = kpis?.total_disbursed ?? 2869500;
  const closedAnr = kpis?.official_closed_anr ?? 16.91;
  const realizedProfit = kpis?.realized_net_profit ?? 122117;

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
            <span>Analytics Engine Active &bull; 3,967 Loans Synchronized</span>
          </div>
        </div>

        {/* Metric Micro-Tiles Grid */}
        <div className="footer-metrics-grid">
          <div className="footer-metric-card">
            <span className="footer-metric-label">Total Capital Lent</span>
            <strong className="footer-metric-val">{formatINR(totalLent)}</strong>
            <span className="footer-metric-sub">3,967 empirical loans</span>
          </div>

          <div className="footer-metric-card">
            <span className="footer-metric-label">Loan Resolution Split</span>
            <strong className="footer-metric-val">2,396 Closed &bull; 1,385 Active</strong>
            <span className="footer-metric-sub">149 NPA (3.09%) &bull; 37 Cancelled</span>
          </div>

          <div className="footer-metric-card">
            <span className="footer-metric-label">Official Closed ANR</span>
            <strong className="footer-metric-val success">{formatPercent(closedAnr)}</strong>
            <span className="footer-metric-sub">+₹1.22L Net Realized Profit</span>
          </div>

          <div className="footer-metric-card">
            <span className="footer-metric-label">Analytical Surfaces</span>
            <strong className="footer-metric-val cyan">100 Charts &bull; 108 Insights</strong>
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
            Confidential proprietary algorithmic underwriting model. Backtested on empirical investor loan performance from Platform Inception to Present.
          </p>

          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} LenDenClub Analytics Terminal &bull; v2.5.0-institutional
          </div>
        </div>
      </div>
    </footer>
  );
}
