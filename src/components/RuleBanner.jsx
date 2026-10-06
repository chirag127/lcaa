import React from 'react';

export default function RuleBanner() {
  return (
    <div className="rule-banner">
      <div className="glass-panel rule-box green">
        <div className="rule-title green">
          <span>✓</span> THE CHAMPION UNDERWRITING RULES: WHICH LOANS TO FUND (100% PERCENTAGE-DRIVEN)
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>1. Golden Rule (Tenure 2M–3M, Ticket ≤ ₹500, LDC Score ≥ 750):</strong>
          <span>
            Delivers <strong>1.32% NPA Rate</strong> (vs 8.37% baseline — <strong>84.2% default reduction</strong>) and <strong>0.07% Active Delinquency Rate</strong> (only 1 of 1,533 active loans). Produces <strong>37.93% ANR</strong> with <strong>58.55% Prepayment Rate</strong>.
          </span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>2. Ultra-Safe Capital Preservation (Tenure 2M, Ticket ₹250, Score ≥ 740):</strong>
          <span>
            Achieved <strong>0.00% Defaults</strong> across 127 closed loans and <strong>0.09% Active DPD</strong> across 1,079 active loans. 100% clean capital cycle every ~60 days with <strong>32.06% ANR</strong>.
          </span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>3. High-Velocity Prepayment Recycler (Tenure 3M, Ticket ₹250–₹1,000, Score ≥ 750):</strong>
          <span>
            <strong>66.10% Prepayment Rate</strong> (2 in 3 prepay in ~45 days) with <strong>0.00% Active Delinquency</strong> across 473 loans and <strong>38.35% Net Annualized Yield</strong>.
          </span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>4. Score Threshold: LenDenClub Internal Score ≥ 750 (Sweet Spot 750–799):</strong>
          <span>
            750–759 yields <strong>34.73% ANR</strong> (0.30% active DPD); 760–769 yields <strong>35.33% ANR</strong> (0.00% active DPD); 790–799 yields <strong>37.15% ANR</strong> (0.00% active DPD).
          </span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#059669' }}>5. Monthly EMI Servicing Only:</strong>
          <span>
            Monthly repayments deliver steady automated NACH clearing with <strong>98.35% zero-DPD active compliance</strong>.
          </span>
        </div>
      </div>

      <div className="glass-panel rule-box red">
        <div className="rule-title red">
          <span>✕</span> THE TOXIC BLACKLIST: WHAT LOANS NEVER TO FUND
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>1. NEVER Fund 12-Month Tenure Loans:</strong>
          <span>
            Suffers a catastrophic <strong>20.69% Closed NPA Rate</strong> and <strong>27.54% Active Delinquency Rate</strong> (over 1 in 4 active loans delinquent!). <strong>0.00% Prepayments</strong>. Net return collapses to <strong>10.41%</strong>.
          </span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>2. NEVER Fund Ticket Sizes &gt; ₹1,000 (₹2,000 – ₹4,000):</strong>
          <span>
            ₹2,000 tickets suffer a <strong>23.94% Default Rate</strong> and <strong>33.33% Active Delinquency</strong>. A single ₹4,000 default wipes out the net interest of 16 performing loans.
          </span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>3. NEVER Fund 6-Month Tenure Loans:</strong>
          <span>
            Default rate jumps to <strong>16.92%</strong> and active delinquency reaches <strong>15.79%</strong> (40x higher than 3M loans!).
          </span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>4. Bureau Score Paradox (CRIF/CIBIL &gt; 750):</strong>
          <span>
            Borrowers with Bureau Score 750–799 default at <strong>12.58%</strong> and 800+ default at <strong>14.29%</strong> (vs only <strong>4.57%</strong> for &lt;600). Desperate prime borrowers using P2P at 45% APR represent hidden stress.
          </span>
        </div>
        <div className="rule-item">
          <strong style={{ color: '#DC2626' }}>5. NEVER Fund Daily Repayment (EDI) Loans:</strong>
          <span>
            Catastrophic <strong>74.22% Default Rate</strong> and <strong>-73.19% Annualized Net Loss</strong> in historical books.
          </span>
        </div>
      </div>
    </div>
  );
}
