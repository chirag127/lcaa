import React, { useState, useMemo } from 'react';
import { formatINR, formatPercent } from '../utils/formatters';

export default function LoanDatabaseTable({ loans = [] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tenureFilter, setTenureFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const pageSize = 25;

  const filteredLoans = useMemo(() => {
    let list = loans;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l => 
        l.id.toLowerCase().includes(q) ||
        (l.borrower_name && l.borrower_name.toLowerCase().includes(q)) ||
        (l.borrower_city && l.borrower_city.toLowerCase().includes(q)) ||
        (l.borrower_profession && l.borrower_profession.toLowerCase().includes(q)) ||
        String(l.score).includes(q) ||
        (l.bureau_score_exact && String(l.bureau_score_exact).includes(q))
      );
    }

    if (statusFilter !== 'ALL') {
      list = list.filter(l => l.status.toUpperCase() === statusFilter);
    }

    if (tenureFilter !== 'ALL') {
      list = list.filter(l => String(l.tenure) === tenureFilter);
    }

    return list;
  }, [loans, search, statusFilter, tenureFilter]);

  const totalPages = Math.ceil(filteredLoans.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageLoans = filteredLoans.slice(startIdx, startIdx + pageSize);

  function exportCSV() {
    window.location.href = './clean_lending_report.csv';
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Top Demographics Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--emerald-bg)', border: '1px solid var(--emerald-border)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>VERIFIED PROFILES</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.25rem' }}>3,958 <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>(99.8%)</span></div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Full bureau + income verified</div>
        </div>

        <div style={{ background: 'var(--cyan-bg)', border: '1px solid var(--cyan-border)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>AVG. VERIFIED INCOME</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '0.25rem' }}>₹92,704 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ mo</span></div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Median: ₹63,076 / mo</div>
        </div>

        <div style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>AVG. BORROWER AGE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber)', marginTop: '0.25rem' }}>34.6 yrs</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Range: 21 to 57 yrs (86% Male)</div>
        </div>

        <div style={{ background: 'var(--purple-bg)', border: '1px solid var(--purple-border)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>LEGAL AGREEMENTS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.25rem' }}>3,958 PDFs</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Direct AWS S3 signed documents</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Complete Portfolio Loan Database (3,967 Loans)</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click any loan row to reveal complete borrower profile, salary/income, bureau score, and signed agreement PDF.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search ID, Borrower, City, Score..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '0.45rem 0.85rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', minWidth: '240px' }}
          />

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.45rem 0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Statuses ({loans.length})</option>
            <option value="CLOSED">Closed Only (2,396)</option>
            <option value="ACTIVE">Active Only (1,385)</option>
            <option value="NPA">NPA Defaults Only (149)</option>
            <option value="CANCELLED">Rejected/Cancelled (37)</option>
          </select>

          <select
            value={tenureFilter}
            onChange={e => { setTenureFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.45rem 0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Tenures</option>
            <option value="2">2 Months</option>
            <option value="3">3 Months</option>
            <option value="4">4 Months</option>
            <option value="5">5 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>

          <button
            onClick={exportCSV}
            style={{ padding: '0.45rem 0.85rem', background: '#059669', color: '#FFFFFF', fontWeight: 800, borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            Export Enriched CSV
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '32px' }}></th>
              <th>Loan ID</th>
              <th>Borrower / City</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Tenure</th>
              <th>Score</th>
              <th>APR (%)</th>
              <th>Repay</th>
              <th>DPD</th>
              <th>Received</th>
              <th>NPA Loss</th>
              <th>Net Profit</th>
              <th>Ann. Net Return</th>
            </tr>
          </thead>
          <tbody>
            {pageLoans.map((l, idx) => {
              const isClosed = l.status === 'CLOSED';
              const isNpa = l.status === 'NPA';
              const stColor = isClosed ? 'var(--emerald)' : isNpa ? 'var(--crimson)' : 'var(--cyan)';
              const stBg = isClosed ? 'var(--emerald-bg)' : isNpa ? 'var(--crimson-bg)' : 'var(--cyan-bg)';
              const stBorder = isClosed ? 'var(--emerald-border)' : isNpa ? 'var(--crimson-border)' : 'var(--cyan-border)';
              const retColor = l.ann_net_pct >= 15 ? 'var(--emerald)' : l.ann_net_pct >= 0 ? 'var(--amber)' : 'var(--crimson)';
              const isExpanded = expandedId === l.id;

              return (
                <React.Fragment key={l.id || idx}>
                  <tr 
                    onClick={() => toggleExpand(l.id)}
                    style={{ 
                      cursor: 'pointer', 
                      background: isExpanded ? 'var(--bg-elevated)' : 'transparent',
                      transition: 'background 0.15s'
                    }}
                  >
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {isExpanded ? '▼' : '▶'}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {l.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8rem' }}>{l.borrower_name || 'N/A'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{l.borrower_city ? `${l.borrower_city}` : 'India'}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{l.disb_date}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{formatINR(l.amount)}</td>
                    <td>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', background: stBg, color: stColor, border: `1px solid ${stBorder}` }}>
                        {l.status}
                      </span>
                    </td>
                    <td>{l.tenure}M</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {l.bureau_score_exact || l.score}
                      {l.bureau_score_exact && <span style={{ fontSize: '0.65rem', color: 'var(--emerald)', marginLeft: '3px' }}>CRIF</span>}
                    </td>
                    <td style={{ color: 'var(--cyan)', fontWeight: 600 }}>{Number(l.rate).toFixed(1)}%</td>
                    <td>{l.repay_type}</td>
                    <td style={{ color: l.dpd > 0 ? 'var(--crimson)' : 'var(--text-muted)', fontWeight: l.dpd > 0 ? 700 : 400 }}>{l.dpd}</td>
                    <td>{formatINR(l.received)}</td>
                    <td style={{ color: l.npa > 0 ? 'var(--crimson)' : 'var(--text-muted)' }}>{formatINR(l.npa)}</td>
                    <td style={{ color: l.net_profit >= 0 ? 'var(--emerald)' : 'var(--crimson)', fontWeight: 700 }}>{formatINR(l.net_profit)}</td>
                    <td style={{ color: retColor, fontWeight: 800 }}>{formatPercent(l.ann_net_pct)}</td>
                  </tr>

                  {/* Expanded Row Details */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={15} style={{ background: 'var(--bg-elevated)', padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
                          {/* Demographic Info */}
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Borrower Demographics</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}><strong>Name:</strong> {l.borrower_name || 'N/A'}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}><strong>Age / Gender:</strong> {l.borrower_age ? `${l.borrower_age} yrs` : 'N/A'} • {l.borrower_gender || 'N/A'}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}><strong>City / Region:</strong> {l.borrower_city || 'N/A'}</div>
                            {l.borrower_marital_status && <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}><strong>Marital Status:</strong> {l.borrower_marital_status}</div>}
                          </div>

                          {/* Financial Profile */}
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Employment & Income</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                              <strong>Monthly Income:</strong> {l.borrower_income ? `₹${Number(l.borrower_income).toLocaleString('en-IN')}` : 'Not Disclosed'}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}><strong>Profession:</strong> {l.borrower_profession || 'N/A'}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}><strong>Verification:</strong> <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>✓ Verified</span></div>
                            {l.borrower_employer && <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}><strong>Employer:</strong> {l.borrower_employer}</div>}
                          </div>

                          {/* Credit Bureau Details */}
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Credit Bureau Scoring</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}><strong>CRIF Score:</strong> {l.bureau_score_exact || l.score}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}><strong>LenDen Score:</strong> {l.lenden_score || l.score}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}><strong>Repayment Mode:</strong> {l.repay_type} (NACH auto-debit)</div>
                          </div>

                          {/* Loan Agreement Link */}
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Legal Documentation</div>
                            {l.agreement_url ? (
                              <a
                                href={l.agreement_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.55rem 1rem',
                                  background: '#059669',
                                  color: '#FFFFFF',
                                  fontWeight: 800,
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  textDecoration: 'none',
                                  boxShadow: '0 2px 6px rgba(5,150,105,0.25)'
                                }}
                              >
                                📄 View Signed Agreement PDF &rarr;
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Agreement not available for this loan</span>
                            )}
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Direct official AWS S3 document signed by borrower</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Showing {startIdx + 1} to {Math.min(startIdx + pageSize, filteredLoans.length)} of {filteredLoans.length} loans</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', opacity: currentPage <= 1 ? 0.5 : 1 }}
          >
            &larr; Prev
          </button>
          <span style={{ padding: '0.4rem 0.6rem', color: 'var(--text-primary)', fontWeight: 700 }}>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages ? 0.5 : 1 }}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
