import React, { useState, useMemo } from 'react';

export default function UnderwriterSimulator() {
  const [score, setScore] = useState(760);
  const [apr, setApr] = useState(46.0);
  const [tenure, setTenure] = useState(3);
  const [amount, setAmount] = useState(500);
  const [repayment, setRepayment] = useState('Monthly');

  // Algorithmic Decision Engine Logic
  const analysis = useMemo(() => {
    const mult = tenure === 2 ? 6.0 : tenure === 3 ? 4.0 : tenure === 4 ? 3.0 : tenure === 5 ? 2.4 : tenure === 6 ? 2.0 : 1.0;

    const checkTenure = tenure >= 2 && tenure <= 4;
    const checkAmount = amount <= 1000;
    const checkScore = score >= 740;
    const checkRepay = repayment === 'Monthly';
    const checkApr = apr >= 44.0;

    const passCount = [checkTenure, checkAmount, checkScore, checkRepay, checkApr].filter(Boolean).length;

    let verdict = 'APPROVED (STRONG BUY)';
    let verdictColor = '#059669';
    let projectedReturn = 0;
    let defaultRisk = 'Low (<1.5%)';

    if (!checkRepay) {
      verdict = 'FATAL REJECT (DAILY DISASTER)';
      verdictColor = '#DC2626';
      projectedReturn = -73.2;
      defaultRisk = 'Catastrophic (74.2%)';
    } else if (tenure === 12) {
      verdict = 'FATAL REJECT (12M CAPITAL TRAP)';
      verdictColor = '#DC2626';
      projectedReturn = -10.8;
      defaultRisk = 'High (15.8%)';
    } else if (amount > 1000) {
      verdict = 'CAUTION (CONCENTRATION TRAP)';
      verdictColor = '#D97706';
      projectedReturn = 4.5;
      defaultRisk = 'Concentration Hazard';
    } else if (!checkTenure) {
      verdict = 'CAUTION (SUB-OPTIMAL DURATION)';
      verdictColor = '#D97706';
      projectedReturn = 5.2;
      defaultRisk = 'Moderate (8.0%)';
    } else {
      const baseNet = apr - 6.0;
      const defFactor = score >= 760 ? 0.95 : score >= 740 ? 2.5 : 5.8;
      projectedReturn = Math.max(0, (baseNet - defFactor) * (mult / (mult * 0.95)));
      defaultRisk = score >= 760 ? 'Negligible (<1.0%)' : 'Low (~2.5%)';
    }

    return {
      mult,
      checkTenure,
      checkAmount,
      checkScore,
      checkRepay,
      checkApr,
      passCount,
      verdict,
      verdictColor,
      projectedReturn: projectedReturn.toFixed(1),
      defaultRisk
    };
  }, [score, apr, tenure, amount, repayment]);

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Algorithmic Loan Underwriting Simulator
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Test any loan candidate against historical LenDenClub backtest rules before deploying capital.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {/* Controls */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>LenDenClub Score</span>
              <strong style={{ color: 'var(--text-primary)' }}>{score}</strong>
            </div>
            <input
              type="range"
              min="700"
              max="820"
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#059669' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Contractual APR (%)</span>
              <strong style={{ color: 'var(--text-primary)' }}>{apr}%</strong>
            </div>
            <input
              type="range"
              min="24"
              max="48"
              step="0.5"
              value={apr}
              onChange={e => setApr(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0284C7' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Loan Tenure
              </label>
              <select
                value={tenure}
                onChange={e => setTenure(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem'
                }}
              >
                <option value={2}>2 Months (6x Mult)</option>
                <option value={3}>3 Months (4x Mult)</option>
                <option value={4}>4 Months (3x Mult)</option>
                <option value={5}>5 Months (2.4x Mult)</option>
                <option value={6}>6 Months (2x Mult)</option>
                <option value={12}>12 Months (1x Mult)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Repayment Mode
              </label>
              <select
                value={repayment}
                onChange={e => setRepayment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem'
                }}
              >
                <option value="Monthly">Monthly EMI</option>
                <option value="Daily">Daily EDI (Hazard)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Allocation Amount (Ticket Size)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[250, 500, 1000, 2000, 4000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: amount === amt ? '#059669' : 'var(--border-subtle)',
                    background: amount === amt ? 'var(--emerald-bg)' : 'var(--bg-elevated)',
                    color: amount === amt ? '#059669' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Rule Checklist & Decision Dial */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
              Rule Compliance Engine ({analysis.passCount}/5 Passed)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ color: analysis.checkRepay ? '#059669' : '#DC2626', fontWeight: 600 }}>
                {analysis.checkRepay ? '✔' : '✖'} Repayment Mode: {repayment === 'Monthly' ? 'Monthly EMI (Pass)' : 'Daily EDI (FATAL BLOCK)'}
              </div>
              <div style={{ color: analysis.checkTenure ? '#059669' : '#DC2626', fontWeight: 600 }}>
                {analysis.checkTenure ? '✔' : '✖'} Tenure Duration: {tenure} Months ({analysis.checkTenure ? 'Pass' : 'Sub-Optimal/Hazard'})
              </div>
              <div style={{ color: analysis.checkScore ? '#059669' : '#DC2626', fontWeight: 600 }}>
                {analysis.checkScore ? '✔' : '✖'} Credit Score: {score} ({analysis.checkScore ? '≥ 740 Pass' : 'Sub-740 High Risk'})
              </div>
              <div style={{ color: analysis.checkAmount ? '#059669' : '#DC2626', fontWeight: 600 }}>
                {analysis.checkAmount ? '✔' : '✖'} Ticket Sizing: ₹{amount} ({analysis.checkAmount ? '≤ ₹1,000 Pass' : 'Concentration Trap'})
              </div>
              <div style={{ color: analysis.checkApr ? '#059669' : '#DC2626', fontWeight: 600 }}>
                {analysis.checkApr ? '✔' : '✖'} Interest Cushion: {apr}% ({analysis.checkApr ? '≥ 44% Pass' : 'Fee Friction Drag'})
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Algorithmic Verdict
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: analysis.verdictColor, letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
              {analysis.verdict}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              <span>Projected Net Return: <strong style={{ color: analysis.verdictColor }}>{analysis.projectedReturn}% p.a.</strong></span>
              <span>Default Risk: <strong>{analysis.defaultRisk}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
