import React, { useState } from 'react';

export default function FilterBlueprint({ filters = [] }) {
  const [copied, setCopied] = useState(false);
  const [filterMode, setFilterMode] = useState('FILTERABLE'); // 'FILTERABLE' | 'ALL' | 'NON_FILTERABLE'

  function copyRulebook() {
    const text = `LenDenClub Website Filter Rulebook (Only Filterable Options):
1. Loan Tenure: Select 2M, 3M, 4M, 5M only. AVOID 6M. NEVER select 12M!
2. Repayment Type: Select "Equated Monthly Installment (EMI)" only. NEVER select "Equated Daily Installment (EDI)"!
3. Risk Category: Select "AA (Medium)" (1.21% NPA). Selective on "A (High)" (require <=4M tenure).
4. Interest Rate: Select "32% to 47.99% p.a." only (absorbs fees + defaults).
5. Borrower Type: Prefer "Self-employed / Business owner" (1.5% NPA, 4.1x safer). Salaried is acceptable volume (6.2% NPA).
6. Loan Amount: Select "Upto ₹25,000" (4.53% NPA, +4.89% margin). NEVER select "More than ₹1,00,000" (25% NPA disaster).
7. Monthly Income: Select "₹50,001 to ₹1,00,000" (+6.39% peak margin) and "Upto ₹25,000" (1.47% NPA).
8. Borrower Age: Select "36 Year to 45 Year" (+5.63% peak margin) and "26 Year to 35 Year". Avoid "21-25".
Note: Default Repayment Mode is NACH for 100% of loans and is non-filterable in the UI.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const displayedFilters = filters.filter(cat => {
    if (filterMode === 'FILTERABLE') return cat.is_filterable !== false;
    if (filterMode === 'NON_FILTERABLE') return cat.is_filterable === false;
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>LenDenClub Website Filter Settings Blueprint</h3>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'var(--emerald-bg)', color: 'var(--emerald)', border: '1px solid var(--emerald-border)' }}>
              100% REAL UI FILTERS
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Exact checkbox settings available on app.lendenclub.com (Filter & Sort modal). Non-filterable parameters are isolated with clear architectural callouts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '0.2rem', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setFilterMode('FILTERABLE')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: filterMode === 'FILTERABLE' ? '#059669' : 'transparent',
                color: filterMode === 'FILTERABLE' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Filterable Only ({filters.filter(f => f.is_filterable !== false).length})
            </button>
            <button
              onClick={() => setFilterMode('ALL')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: filterMode === 'ALL' ? 'var(--border-hover)' : 'transparent',
                color: filterMode === 'ALL' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              All Parameters ({filters.length})
            </button>
            <button
              onClick={() => setFilterMode('NON_FILTERABLE')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: filterMode === 'NON_FILTERABLE' ? 'var(--crimson-bg)' : 'transparent',
                color: filterMode === 'NON_FILTERABLE' ? 'var(--crimson)' : 'var(--text-muted)',
                border: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Non-Filterable Info ({filters.filter(f => f.is_filterable === false).length})
            </button>
          </div>

          <button
            onClick={copyRulebook}
            style={{
              padding: '0.5rem 1rem',
              background: copied ? 'var(--emerald)' : 'var(--emerald-bg)',
              color: copied ? '#FFFFFF' : 'var(--emerald)',
              border: '1px solid var(--emerald-border)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? '✓ Rulebook Copied!' : '📋 Copy Filter Rulebook'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {displayedFilters.map((cat, idx) => {
          const isFilterable = cat.is_filterable !== false;
          return (
            <div
              key={idx}
              style={{
                background: isFilterable ? 'var(--bg-elevated)' : 'var(--indigo-bg)',
                padding: '1.2rem',
                borderRadius: '10px',
                border: isFilterable ? '1px solid var(--border-subtle)' : '1px solid var(--indigo-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cat.category}</div>
                {isFilterable ? (
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--emerald)', background: 'var(--emerald-bg)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid var(--emerald-border)' }}>
                    ✓ FILTERABLE IN UI
                  </span>
                ) : (
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--indigo)', background: 'var(--indigo-bg)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid var(--indigo-border)' }}>
                    ℹ SYSTEM ARCHITECTURE
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>{cat.description}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(cat.options || []).map((opt, oIdx) => {
                  const isGreen = opt.status === 'GREEN';
                  const isRed = opt.status === 'RED';
                  const isInfo = opt.status === 'INFO';
                  const badgeColor = isGreen ? 'var(--emerald)' : isRed ? 'var(--crimson)' : isInfo ? 'var(--indigo)' : 'var(--amber)';
                  const badgeBg = isGreen ? 'var(--emerald-bg)' : isRed ? 'var(--crimson-bg)' : isInfo ? 'var(--indigo-bg)' : 'var(--amber-bg)';
                  const badgeBorder = isGreen ? 'var(--emerald-border)' : isRed ? 'var(--crimson-border)' : isInfo ? 'var(--indigo-border)' : 'var(--amber-border)';

                  return (
                    <div key={oIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.78rem', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{opt.label}</strong>
                        <span style={{ fontSize: '0.71rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{opt.reason}</span>
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.25rem 0.55rem', borderRadius: '4px', background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
                        {opt.action}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
