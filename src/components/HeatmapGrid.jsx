import React from 'react';

export default function HeatmapGrid({
  data,
  rowKey = 'score_bin',
  columns = ['2', '3', '4', '5', '6', '12'],
  columnLabels = ['2M', '3M', '4M', '5M', '6M', '12M'],
  isReturn = true, // true for Net Return (high is green), false for NPA (high is red)
  isDark = false
}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div style={{ color: 'var(--text-muted)', padding: '1rem' }}>No heatmap data available</div>;
  }

  function getCellColor(val) {
    if (val === null || val === undefined) {
      return { bg: 'var(--bg-elevated)', text: 'var(--text-muted)' };
    }
    const num = Number(val);
    if (isReturn) {
      if (num >= 25) {
        return isDark
          ? { bg: 'rgba(16, 185, 129, 0.35)', text: '#34D399' }
          : { bg: '#D1FAE5', text: '#065F46' };
      }
      if (num >= 15) {
        return isDark
          ? { bg: 'rgba(16, 185, 129, 0.20)', text: '#10B981' }
          : { bg: '#ECFDF5', text: '#047857' };
      }
      if (num >= 5) {
        return isDark
          ? { bg: 'rgba(6, 182, 212, 0.15)', text: '#38BDF8' }
          : { bg: '#E0F2FE', text: '#0369A1' };
      }
      if (num >= 0) {
        return isDark
          ? { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24' }
          : { bg: '#FEF3C7', text: '#B45309' };
      }
      return isDark
        ? { bg: 'rgba(239, 68, 68, 0.35)', text: '#F87171' }
        : { bg: '#FEE2E2', text: '#B91C1C' };
    } else {
      // NPA: Lower is better (green), Higher is worse (red)
      if (num === 0) {
        return isDark
          ? { bg: 'rgba(16, 185, 129, 0.35)', text: '#34D399' }
          : { bg: '#D1FAE5', text: '#065F46' };
      }
      if (num <= 5) {
        return isDark
          ? { bg: 'rgba(16, 185, 129, 0.18)', text: '#10B981' }
          : { bg: '#ECFDF5', text: '#047857' };
      }
      if (num <= 10) {
        return isDark
          ? { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24' }
          : { bg: '#FEF3C7', text: '#B45309' };
      }
      if (num <= 20) {
        return isDark
          ? { bg: 'rgba(239, 68, 68, 0.25)', text: '#F87171' }
          : { bg: '#FEE2E2', text: '#DC2626' };
      }
      return isDark
        ? { bg: 'rgba(239, 68, 68, 0.50)', text: '#FFA4A4' }
        : { bg: '#FCA5A5', text: '#7F1D1D' };
    }
  }

  return (
    <div style={{ overflowX: 'auto', padding: '0.5rem 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
              Cohort / Duration
            </th>
            {columnLabels.map((lbl, idx) => (
              <th key={idx} style={{ textAlign: 'center', padding: '0.5rem 0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                {lbl}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx}>
              <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {row[rowKey]}
              </td>
              {columns.map((col, cIdx) => {
                const val = row[col];
                const { bg, text } = getCellColor(val);
                return (
                  <td key={cIdx} style={{ padding: '0.35rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="matrix-cell" style={{ backgroundColor: bg, color: text, fontWeight: 700 }}>
                      {val !== null && val !== undefined ? `${Number(val).toFixed(1)}%` : 'N/A'}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
