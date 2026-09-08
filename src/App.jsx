import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import RuleBanner from './components/RuleBanner';
import Footer from './components/Footer';

import TabExecutive from './views/TabExecutive';
import TabBorrowerProfile from './views/TabBorrowerProfile';
import TabScores from './views/TabScores';
import TabTenure from './views/TabTenure';
import TabTickets from './views/TabTickets';
import TabRates from './views/TabRates';
import TabHeatmaps from './views/TabHeatmaps';
import TabVintages from './views/TabVintages';
import TabDelinquency from './views/TabDelinquency';
import TabStrategy from './views/TabStrategy';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tab-executive');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ldc_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ldc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  useEffect(() => {
    async function loadLendingData() {
      try {
        const res = await fetch('./lending_data.json');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load lending_data.json:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadLendingData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-wide">Loading Portfolio Intelligence Engine...</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Ingesting 3,967 loans, 10 2D heatmaps, and 100+ institutional analytics matrices with Apache ECharts</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 max-w-md">
          <h2 className="text-lg font-bold text-rose-600 dark:text-rose-400">Failed to Load Lending Data</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{error || 'Data payload unavailable.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Platform Header with Theme Switcher */}
      <Header kpis={data.portfolio_kpis} theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Container */}
      <div className="tab-content" style={{ marginTop: '1.25rem', marginBottom: '3rem' }}>
        {/* Golden Rules & Blacklist Warning Banner */}
        <RuleBanner />

        {/* 10-Tab Navigation Bar */}
        <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Tab Content Display */}
        <main style={{ marginTop: '1.5rem' }}>
          {activeTab === 'tab-executive' && <TabExecutive data={data} isDark={isDark} />}
          {activeTab === 'tab-annualized' && <TabBorrowerProfile data={data} isDark={isDark} />}
          {activeTab === 'tab-scores' && <TabScores data={data} isDark={isDark} />}
          {activeTab === 'tab-tenure' && <TabTenure data={data} isDark={isDark} />}
          {activeTab === 'tab-tickets' && <TabTickets data={data} isDark={isDark} />}
          {activeTab === 'tab-rates' && <TabRates data={data} isDark={isDark} />}
          {activeTab === 'tab-heatmaps' && <TabHeatmaps data={data} isDark={isDark} />}
          {activeTab === 'tab-vintages' && <TabVintages data={data} isDark={isDark} />}
          {activeTab === 'tab-delinquency' && <TabDelinquency data={data} isDark={isDark} />}
          {activeTab === 'tab-strategy' && <TabStrategy data={data} isDark={isDark} />}
        </main>
      </div>

      {/* Modern Institutional Platform Footer */}
      <Footer kpis={data.portfolio_kpis} />
    </div>
  );
}
