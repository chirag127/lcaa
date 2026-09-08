import React from 'react';

export default function RuleBanner() {
  return (
    <div className="rule-banner">
      <div className="glass-panel rule-box green">
        <div className="rule-title green">
          <span>✓</span> THE GOLDEN RULES: WHAT LOANS TO FUND
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>Tenure 2 to 4 Months Only:</strong>
          <span>Recycles capital 3x to 6x/year. 2M yields +27.39% net annualized return with &lt;1% default rate.</span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>Ticket Sizing ₹250 to ₹500 (Max ₹1,000):</strong>
          <span>Diversifies capital across hundreds of borrowers. A single default has zero portfolio impact.</span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>LenDenClub Score ≥ 740 (Sweet spot 745–774):</strong>
          <span>Delivers &gt;21% to &gt;30% net annualized returns with historically low default rates.</span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>Monthly Repayments Only:</strong>
          <span>95.6% historical recovery rate; steady salary deduction servicing avoids business distress.</span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>High APR Cushion (44% to 48%+):</strong>
          <span>Generates wide interest cushion that easily absorbs 6% platform fees and minor defaults.</span>
        </div>
      </div>

      <div className="glass-panel rule-box red">
        <div className="rule-title red">
          <span>✕</span> THE BLACKLIST: WHAT LOANS NOT TO FUND
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>NEVER Fund Daily Repayment Loans:</strong>
          <span>Suffered a catastrophic 74.22% default rate and -73.19% net annualized loss!</span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>NEVER Fund 12-Month Tenure Loans:</strong>
          <span>15.82% default rate, zero compounding velocity (1.0x), producing -10.79% annualized loss.</span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>AVOID Ticket Sizes &gt; ₹1,000 (₹2,000 – ₹4,000):</strong>
          <span>A single ₹4,000 default wipes out the entire profit of 16 performing ₹250 loans!</span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>AVOID 6-Month Tenure Loans:</strong>
          <span>Default rate spikes to 7.95% raw (15.9% annualized); net return drops to barely 4.26%.</span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>AVOID Low APRs (&lt; 44%):</strong>
          <span>40–43.9% APR generated barely 1.66% net return after 6% platform fees and defaults.</span>
        </div>
      </div>
    </div>
  );
}
