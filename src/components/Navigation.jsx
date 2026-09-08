import React from 'react';

export const TABS = [
  { id: 'tab-executive', label: '1. Executive Cockpit', count: '10 Charts' },
  { id: 'tab-annualized', label: '2. Borrower Profile & Demographics', count: '18 Charts' },
  { id: 'tab-scores', label: '3. Credit Score Granular', count: '12 Charts' },
  { id: 'tab-tenure', label: '4. Tenure & Duration', count: '10 Charts' },
  { id: 'tab-tickets', label: '5. Loan Amount & NPA Analysis', count: '10 Charts' },
  { id: 'tab-rates', label: '6. APR & Pricing Traps', count: '10 Charts' },
  { id: 'tab-heatmaps', label: '7. 2D Heatmaps (10x)', count: '10 Matrices' },
  { id: 'tab-vintages', label: '8. Vintages & Cashflow', count: '10 Charts' },
  { id: 'tab-delinquency', label: '9. Delinquency & DPD', count: '10 Charts' },
  { id: 'tab-strategy', label: '10. Blueprint & Database', count: '8 Charts + DB' }
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
