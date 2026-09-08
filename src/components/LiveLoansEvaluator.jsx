import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';

export default function LiveLoansEvaluator({ availableLoans = [] }) {
  const [filter, setFilter] = useState('ALL');

  const processed = availableLoans.map(loan => {
    const tenure = Number(loan.loan_tenure);
    const score = Number(loan.ldc_score);
    const apr = Number(loan.loan_roi);
    const isDaily = loan.repayment_frequency === 'Daily';

    let verdict = 'NEUTRAL';
    let statusClass = 'neutral';
    let badgeText = 'REVIEW';

    if (isDaily || tenure === 12) {
      verdict = 'FATAL REJECT (DAILY/12M HAZARD)';
      statusClass = 'reject';
      badgeText = 'AVOID';
    } else if (tenure >= 2 && tenure <= 4 && score >= 740 && apr >= 44.0) {
      verdict = 'GOLDEN BUY (LEND ₹500)';
      statusClass = 'golden';
      badgeText = 'STRONG BUY';
    } else {
      verdict = 'SELECTIVE (₹250 MAX)';
      statusClass = 'caution';
      badgeText = 'CAUTION';
    }

    return { ...loan, verdict, statusClass, badgeText };
  });

  const filtered = processed.filter(l => {
    if (filter === 'GOLDEN') return l.statusClass === 'golden';
    if (filter === 'REJECT') return l.statusClass === 'reject';
    if (filter === 'CAUTION') return l.statusClass === 'caution';
    return true;
  });

  const goldenCount = processed.filter(l => l.statusClass === 'golden').length;
  const rejectCount = processed.filter(l => l.statusClass === 'reject').length;

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Live Marketplace Loan Evaluator (Scraped from HAR)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            98 live marketplace loans evaluated against empirical underwriting policy.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilter('ALL')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: filter === 'ALL' ? 'var(--bg-elevated)' : 'transparent',
              color: filter === 'ALL' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              transition: 'all 0.15s ease'
            }}
          >
            All ({processed.length})
          </button>
          <button
            onClick={() => setFilter('GOLDEN')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: filter === 'GOLDEN' ? 'var(--emerald-bg)' : 'transparent',
              color: 'var(--emerald)',
              border: '1px solid var(--emerald-border)',
              transition: 'all 0.15s ease'
            }}
          >
            Golden Opportunities ({goldenCount})
          </button>
          <button
            onClick={() => setFilter('REJECT')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: filter === 'REJECT' ? 'var(--crimson-bg)' : 'transparent',
              color: 'var(--crimson)',
              border: '1px solid var(--crimson-border)',
              transition: 'all 0.15s ease'
            }}
          >
            Fatal Traps ({rejectCount})
          </button>
        </div>
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Borrower Name</th>
              <th>Tenure</th>
              <th>APR (%)</th>
              <th>LDC Score</th>
              <th>Repayment</th>
              <th>Remaining to Fund</th>
              <th>Algorithmic Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, idx) => {
              const isGolden = l.statusClass === 'golden';
              const isReject = l.statusClass === 'reject';
              const color = isGolden ? 'var(--emerald)' : isReject ? 'var(--crimson)' : 'var(--amber)';
              const bg = isGolden ? 'var(--emerald-bg)' : isReject ? 'var(--crimson-bg)' : 'var(--amber-bg)';
              const border = isGolden ? 'var(--emerald-border)' : isReject ? 'var(--crimson-border)' : 'var(--amber-border)';

              return (
                <tr key={idx}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{l.loan_id}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{l.borrower_name}</td>
                  <td>{l.loan_tenure}M</td>
                  <td style={{ color: 'var(--cyan)', fontWeight: 700 }}>{Number(l.loan_roi).toFixed(2)}%</td>
                  <td style={{ fontWeight: 700 }}>{l.ldc_score}</td>
                  <td style={{ color: l.repayment_frequency === 'Daily' ? 'var(--crimson)' : 'var(--emerald)', fontWeight: 600 }}>
                    {l.repayment_frequency}
                  </td>
                  <td>{formatINR(l.remaining_amount)}</td>
                  <td>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', background: bg, color: color, border: `1px solid ${border}` }}>
                      {l.verdict}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
