import React from 'react';

export const TABS = [
  { id: 'tab-executive', label: '1. Executive Cockpit', count: '10 Charts' },
  { id: 'tab-annualized', label: '2. Tenure Annualization & Compounding', count: '10 Charts' },
  { id: 'tab-demographics', label: '3. Borrower Profile & Demographics', count: '18 Charts' },
  { id: 'tab-scores', label: '4. Credit Score Granular', count: '12 Charts' },
  { id: 'tab-tenure', label: '5. Tenure & Repayment Modes', count: '10 Charts' },
  { id: 'tab-tickets', label: '6. Loan Amount & NPA Analysis', count: '10 Charts' },
  { id: 'tab-rates', label: '7. APR & Pricing Traps', count: '10 Charts' },
  { id: 'tab-heatmaps', label: '8. 2D Heatmaps (10x)', count: '10 Matrices' },
  { id: 'tab-vintages', label: '9. Vintages & Cashflow', count: '10 Charts' },
  { id: 'tab-delinquency', label: '10. Delinquency & DPD', count: '10 Charts' },
  { id: 'tab-strategy', label: '11. Blueprint & Database', count: '8 Charts + DB' },
  { id: 'tab-advanced', label: '12. Visual Taxonomy Matrix', count: '18 Chart Types' }
];

export default function Navigation({ activeTab, onSelectTab }) {
  return (
    <nav className="tabs-bar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onSelectTab(tab.id)}
        >
          <span>{tab.label}</span>
          <span className="tab-count-badge">{tab.count}</span>
        </button>
      ))}
    </nav>
  );
}
