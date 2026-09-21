import React, { useState } from 'react';
import { formatINRCompact, formatPercent } from '../utils/formatters';

export const INITIAL_FILTERS = {
  search: '',
  tenures: [], // e.g. ['2', '3']
  repayType: 'ALL', // 'ALL' | 'Monthly' | 'Daily'
  riskCategories: [], // e.g. ['AAA', 'AA', 'A']
  rateTiers: [], // e.g. ['<40%', '40-43.9%', '44-45.9%', '46-47.9%', '48%+']
  profession: 'ALL', // 'ALL' | 'Salaried' | 'Self-employed'
  incomeBracket: 'ALL', // 'ALL' | '<25k' | '25k-50k' | '50k-100k' | '>100k'
  loanAmountBracket: 'ALL', // 'ALL' | '<25k' | '25k-50k' | '50k-100k' | '>100k'
  ageBracket: 'ALL', // 'ALL' | '21-25' | '26-35' | '36-45' | '>45'
  ticketTier: 'ALL', // 'ALL' | '₹250' | '₹500' | '₹750-1000' | '₹1250-2000' | '₹2500-4000'
  status: 'ALL', // 'ALL' | 'CLOSED' | 'ACTIVE' | 'NPA' | 'CANCELLED'
  dpdStage: 'ALL' // 'ALL' | 'Current' | 'Stage 1' | 'Stage 2' | 'Stage 3' | 'NPA'
};

export default function GlobalFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalLoansCount = 3967,
  filteredLoansCount = 3967,
  kpis = {}
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Helper to count active filters
  const activeFilterCount = [
    filters.search.trim() !== '',
    filters.tenures.length > 0,
    filters.repayType !== 'ALL',
    filters.riskCategories.length > 0,
    filters.rateTiers.length > 0,
    filters.profession !== 'ALL',
    filters.incomeBracket !== 'ALL',
    filters.loanAmountBracket !== 'ALL',
    filters.ageBracket !== 'ALL',
    filters.ticketTier !== 'ALL',
    filters.status !== 'ALL',
    filters.dpdStage !== 'ALL'
  ].filter(Boolean).length;

  const isFiltered = activeFilterCount > 0;
  const matchPct = totalLoansCount > 0 ? ((filteredLoansCount / totalLoansCount) * 100).toFixed(1) : 100;

  // Toggle array item (multi-select)
  const toggleArrayItem = (field, value) => {
    const arr = [...filters[field]];
    const idx = arr.indexOf(value);
    if (idx >= 0) {
      arr.splice(idx, 1);
    } else {
      arr.push(value);
    }
    onFilterChange({ ...filters, [field]: arr });
  };

  // Set single value
  const setFieldValue = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  // Quick Presets
  const applyPreset = (presetName) => {
    switch (presetName) {
      case 'BLUEPRINT':
        onFilterChange({
          ...INITIAL_FILTERS,
          tenures: ['2', '3', '4', '5'],
          repayType: 'Monthly',
          riskCategories: ['AA', 'AAA'],
          rateTiers: ['46-47.9%', '48%+'],
          ticketTier: 'ALL'
        });
        break;
      case 'CLOSED_ONLY':
        onFilterChange({
          ...INITIAL_FILTERS,
          status: 'CLOSED'
        });
        break;
      case 'ACTIVE_ONLY':
        onFilterChange({
          ...INITIAL_FILTERS,
          status: 'ACTIVE'
        });
        break;
      case 'NPA_ONLY':
        onFilterChange({
          ...INITIAL_FILTERS,
          status: 'NPA'
        });
        break;
      case 'SALARIED_ONLY':
        onFilterChange({
          ...INITIAL_FILTERS,
          profession: 'Salaried'
        });
        break;
      case 'BUSINESS_ONLY':
        onFilterChange({
          ...INITIAL_FILTERS,
          profession: 'Self-employed'
        });
        break;
      case 'MICRO_250':
        onFilterChange({
          ...INITIAL_FILTERS,
          ticketTier: '₹250'
        });
        break;
      case 'RESET':
      default:
        onResetFilters();
        break;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', border: isFiltered ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)', boxShadow: isFiltered ? '0 0 15px rgba(6, 182, 212, 0.15)' : 'none', transition: 'all 0.2s ease' }}>
      {/* Top Banner & Summary Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              Dynamic Portfolio Graph & Data Filter
            </h3>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              background: isFiltered ? 'var(--cyan-bg)' : 'var(--emerald-bg)',
              color: isFiltered ? 'var(--cyan)' : 'var(--emerald)',
              border: isFiltered ? '1px solid var(--cyan-border)' : '1px solid var(--emerald-border)'
            }}
          >
            {isFiltered ? `ACTIVE FILTERS (${activeFilterCount})` : 'FULL PORTFOLIO (ALL DATA)'}
          </span>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Showing</span>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{filteredLoansCount.toLocaleString()}</strong>
            <span>of</span>
            <span>{totalLoansCount.toLocaleString()} loans</span>
            <span style={{ opacity: 0.6 }}>({matchPct}%)</span>
          </div>

          {kpis && kpis.total_disbursed > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                Lent: <strong style={{ color: 'var(--text-primary)' }}>{formatINRCompact(kpis.total_disbursed)}</strong>
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                ANR: <strong style={{ color: 'var(--emerald)' }}>{formatPercent(kpis.resolved_ann_net_pct ?? kpis.official_closed_anr)}</strong>
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                NPA: <strong style={{ color: (kpis.npa_rate_pct ?? 0) > 5 ? 'var(--crimson)' : 'var(--amber)' }}>{formatPercent(kpis.npa_rate_pct ?? 0)}</strong>
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '6px',
                background: 'var(--crimson-bg)',
                color: 'var(--crimson)',
                border: '1px solid var(--crimson-border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span>↺</span> Reset All Filters
            </button>
          )}

          <button
            onClick={() => setIsExpanded(prev => !prev)}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '6px',
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>{isExpanded ? '▲ Collapse Filters' : '▼ Expand Filters'}</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Quick Presets:
        </span>
        <button
          onClick={() => applyPreset('RESET')}
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '4px',
            background: !isFiltered ? 'var(--emerald)' : 'var(--bg-elevated)',
            color: !isFiltered ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          All 3,967 Loans
        </button>
        <button
          onClick={() => applyPreset('BLUEPRINT')}
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '4px',
            background: 'var(--emerald-bg)',
            color: 'var(--emerald)',
            border: '1px solid var(--emerald-border)',
            cursor: 'pointer'
          }}
        >
          🎯 LDC Optimal Blueprint (2-5M, EMI, AA/AAA)
        </button>
        <button
          onClick={() => applyPreset('CLOSED_ONLY')}
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '4px',
            background: filters.status === 'CLOSED' ? 'var(--cyan)' : 'var(--bg-elevated)',
            color: filters.status === 'CLOSED' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          Closed & Repaid Only
        </button>
        <button
          onClick={() => applyPreset('ACTIVE_ONLY')}
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '4px',
            background: filters.status === 'ACTIVE' ? 'var(--cyan)' : 'var(--bg-elevated)',
            color: filters.status === 'ACTIVE' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          Active Book Only
        </button>
        <button
          onClick={() => applyPreset('NPA_ONLY')}
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '4px',
            background: filters.status === 'NPA' ? 'var(--crimson)' : 'var(--bg-elevated)',
            color: filters.status === 'NPA' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          NPA Defaults Only
        </button>
        <button
          onClick={() => applyPreset('SALARIED_ONLY')}
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '4px',
            background: filters.profession === 'Salaried' ? 'var(--purple)' : 'var(--bg-elevated)',
            color: filters.profession === 'Salaried' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          Salaried Borrowers
        </button>
        <button
          onClick={() => applyPreset('BUSINESS_ONLY')}
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '4px',
            background: filters.profession === 'Self-employed' ? 'var(--amber)' : 'var(--bg-elevated)',
            color: filters.profession === 'Self-employed' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          Self-Employed / Business
        </button>
        <button
          onClick={() => applyPreset('MICRO_250')}
          style={{
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '4px',
            background: filters.ticketTier === '₹250' ? 'var(--cyan)' : 'var(--bg-elevated)',
            color: filters.ticketTier === '₹250' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          ₹250 Tickets Only
        </button>
      </div>

      {/* Expandable Granular Filter Controls */}
      {isExpanded && (
        <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          {/* Universal Search Input */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              🔍 Universal Search (Borrower Name, Loan ID, City, Score)
            </label>
            <input
              type="text"
              placeholder="Type any keyword: e.g. 'LOA-VE33G23G', 'Patil', 'Pune', '760', 'Salaried'..."
              value={filters.search}
              onChange={e => setFieldValue('search', e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 1. Loan Tenure (Multi-select) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Loan Tenure (Multi-select)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {['2', '3', '4', '5', '6', '12'].map(t => {
                const active = filters.tenures.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleArrayItem('tenures', t)}
                    style={{
                      padding: '0.3rem 0.55rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: active ? 'var(--cyan)' : 'var(--border-subtle)',
                      background: active ? 'var(--cyan-bg)' : 'var(--bg-elevated)',
                      color: active ? 'var(--cyan)' : 'var(--text-secondary)'
                    }}
                  >
                    {t}M
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Repayment Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Repayment Frequency
            </label>
            <select
              value={filters.repayType}
              onChange={e => setFieldValue('repayType', e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">All Frequencies (EMI & EDI)</option>
              <option value="Monthly">Equated Monthly (EMI) Only</option>
              <option value="Daily">Equated Daily (EDI) Only</option>
            </select>
          </div>

          {/* 3. Risk Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Risk Category
            </label>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {['AAA', 'AA', 'A'].map(rc => {
                const active = filters.riskCategories.includes(rc);
                return (
                  <button
                    key={rc}
                    onClick={() => toggleArrayItem('riskCategories', rc)}
                    style={{
                      flex: 1,
                      padding: '0.3rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: active ? (rc === 'AAA' ? 'var(--emerald)' : rc === 'AA' ? 'var(--cyan)' : 'var(--crimson)') : 'var(--border-subtle)',
                      background: active ? (rc === 'AAA' ? 'var(--emerald-bg)' : rc === 'AA' ? 'var(--cyan-bg)' : 'var(--crimson-bg)') : 'var(--bg-elevated)',
                      color: active ? (rc === 'AAA' ? 'var(--emerald)' : rc === 'AA' ? 'var(--cyan)' : 'var(--crimson)') : 'var(--text-secondary)'
                    }}
                  >
                    {rc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Interest Rate APR */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Interest Rate (APR)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {['<40%', '40-43.9%', '44-45.9%', '46-47.9%', '48%+'].map(r => {
                const active = filters.rateTiers.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleArrayItem('rateTiers', r)}
                    style={{
                      padding: '0.25rem 0.45rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: active ? 'var(--cyan)' : 'var(--border-subtle)',
                      background: active ? 'var(--cyan-bg)' : 'var(--bg-elevated)',
                      color: active ? 'var(--cyan)' : 'var(--text-secondary)'
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Borrower Profession / Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Borrower Profession
            </label>
            <select
              value={filters.profession}
              onChange={e => setFieldValue('profession', e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">All Professions</option>
              <option value="Salaried">Salaried Only</option>
              <option value="Self-employed">Self-Employed / Business Only</option>
            </select>
          </div>

          {/* 6. Monthly Income Range */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Monthly Income Range
            </label>
            <select
              value={filters.incomeBracket}
              onChange={e => setFieldValue('incomeBracket', e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">All Incomes</option>
              <option value="<25k">Upto ₹25,000</option>
              <option value="25k-50k">₹25,001 to ₹50,000</option>
              <option value="50k-100k">₹50,001 to ₹1,00,000</option>
              <option value=">100k">More than ₹1,00,000</option>
            </select>
          </div>

          {/* 7. Borrower Sanctioned Loan Amount */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Sanctioned Loan Amount
            </label>
            <select
              value={filters.loanAmountBracket}
              onChange={e => setFieldValue('loanAmountBracket', e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">All Sanctioned Amounts</option>
              <option value="<25k">Upto ₹25,000</option>
              <option value="25k-50k">₹25,001 to ₹50,000</option>
              <option value="50k-100k">₹50,001 to ₹1,00,000</option>
              <option value=">100k">More than ₹1,00,000 (Jumbo)</option>
            </select>
          </div>

          {/* 8. Borrower Age Bracket */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Borrower Age
            </label>
            <select
              value={filters.ageBracket}
              onChange={e => setFieldValue('ageBracket', e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">All Age Groups</option>
              <option value="21-25">21 Year to 25 Year</option>
              <option value="26-35">26 Year to 35 Year</option>
              <option value="36-45">36 Year to 45 Year</option>
              <option value=">45">More than 45 Year</option>
            </select>
          </div>

          {/* 9. Disbursed Ticket Size */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Disbursed Ticket Size
            </label>
            <select
              value={filters.ticketTier}
              onChange={e => setFieldValue('ticketTier', e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">All Ticket Sizes</option>
              <option value="₹250">₹250 (Minimum Ticket)</option>
              <option value="₹500">₹500</option>
              <option value="₹750-1000">₹750 to ₹1,000</option>
              <option value="₹1250-2000">₹1,250 to ₹2,000</option>
              <option value="₹2500-4000">₹2,500 to ₹4,000</option>
            </select>
          </div>

          {/* 10. Loan Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Loan Status
            </label>
            <select
              value={filters.status}
              onChange={e => setFieldValue('status', e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="CLOSED">Closed (Repaid) Only</option>
              <option value="ACTIVE">Active (Current) Only</option>
              <option value="NPA">NPA (Defaulted) Only</option>
              <option value="CANCELLED">Rejected / Cancelled Only</option>
            </select>
          </div>

          {/* 11. DPD Stage */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Delinquency Stage (DPD)
            </label>
            <select
              value={filters.dpdStage}
              onChange={e => setFieldValue('dpdStage', e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">All DPD Stages</option>
              <option value="Current">Current (0 DPD)</option>
              <option value="Stage 1">Stage 1 (1 to 30 DPD)</option>
              <option value="Stage 2">Stage 2 (31 to 60 DPD)</option>
              <option value="Stage 3">Stage 3 (61 to 90 DPD)</option>
              <option value="NPA">NPA Default (90+ DPD)</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar */}
      {isFiltered && (
        <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Active Filters:</span>
          {filters.search.trim() && (
            <span
              onClick={() => setFieldValue('search', '')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Search: "{filters.search}" ×
            </span>
          )}
          {filters.tenures.map(t => (
            <span
              key={t}
              onClick={() => toggleArrayItem('tenures', t)}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Tenure: {t}M ×
            </span>
          ))}
          {filters.repayType !== 'ALL' && (
            <span
              onClick={() => setFieldValue('repayType', 'ALL')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Repay: {filters.repayType} ×
            </span>
          )}
          {filters.riskCategories.map(rc => (
            <span
              key={rc}
              onClick={() => toggleArrayItem('riskCategories', rc)}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Risk: {rc} ×
            </span>
          ))}
          {filters.rateTiers.map(r => (
            <span
              key={r}
              onClick={() => toggleArrayItem('rateTiers', r)}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Rate: {r} ×
            </span>
          ))}
          {filters.profession !== 'ALL' && (
            <span
              onClick={() => setFieldValue('profession', 'ALL')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Profession: {filters.profession} ×
            </span>
          )}
          {filters.incomeBracket !== 'ALL' && (
            <span
              onClick={() => setFieldValue('incomeBracket', 'ALL')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Income: {filters.incomeBracket} ×
            </span>
          )}
          {filters.loanAmountBracket !== 'ALL' && (
            <span
              onClick={() => setFieldValue('loanAmountBracket', 'ALL')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Sanctioned: {filters.loanAmountBracket} ×
            </span>
          )}
          {filters.ageBracket !== 'ALL' && (
            <span
              onClick={() => setFieldValue('ageBracket', 'ALL')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Age: {filters.ageBracket} ×
            </span>
          )}
          {filters.ticketTier !== 'ALL' && (
            <span
              onClick={() => setFieldValue('ticketTier', 'ALL')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Ticket: {filters.ticketTier} ×
            </span>
          )}
          {filters.status !== 'ALL' && (
            <span
              onClick={() => setFieldValue('status', 'ALL')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              Status: {filters.status} ×
            </span>
          )}
          {filters.dpdStage !== 'ALL' && (
            <span
              onClick={() => setFieldValue('dpdStage', 'ALL')}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--cyan)', borderRadius: '999px', cursor: 'pointer', color: 'var(--cyan)' }}
              title="Click to remove"
            >
              DPD: {filters.dpdStage} ×
            </span>
          )}
          <button
            onClick={onResetFilters}
            style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', background: 'transparent', border: 'none', color: 'var(--crimson)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
