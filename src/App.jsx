import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import RuleBanner from './components/RuleBanner';
import Footer from './components/Footer';
import GlobalFilterBar, { INITIAL_FILTERS } from './components/GlobalFilterBar';
import {
  computeDynamicPortfolio,
  getRateTier,
  getAmountTier,
  getDpdStage,
  safeNum
} from './utils/portfolioEngine';

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
import TabAdvancedCharts from './views/TabAdvancedCharts';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tab-executive');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
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

  // -------------------------------------------------------------
  // DYNAMIC MULTI-PARAMETER LOAN FILTERING
  // -------------------------------------------------------------
  const filteredLoans = useMemo(() => {
    if (!data || !data.loans) return [];
    let list = data.loans;

    // 1. Universal Search (borrower_name, id, borrower_city, score, borrower_profession, bureau_score_exact)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(l =>
        (l.id && l.id.toLowerCase().includes(q)) ||
        (l.borrower_name && l.borrower_name.toLowerCase().includes(q)) ||
        (l.borrower_city && l.borrower_city.toLowerCase().includes(q)) ||
        (l.borrower_profession && l.borrower_profession.toLowerCase().includes(q)) ||
        String(l.score).includes(q) ||
        (l.bureau_score_exact && String(l.bureau_score_exact).includes(q))
      );
    }

    // 2. Tenures multi-select
    if (filters.tenures.length > 0) {
      list = list.filter(l => filters.tenures.includes(String(l.tenure)));
    }

    // 3. Repayment Frequency (Monthly EMI vs Daily EDI)
    if (filters.repayType !== 'ALL') {
      list = list.filter(l => (l.repay_type || 'Monthly') === filters.repayType);
    }

    // 4. Risk Category (AAA, AA, A)
    if (filters.riskCategories.length > 0) {
      list = list.filter(l => {
        const rc = l.risk_category || '';
        return filters.riskCategories.some(cat => rc.includes(cat));
      });
    }

    // 5. Rate Tiers (<40%, 40-43.9%, 44-45.9%, 46-47.9%, 48%+)
    if (filters.rateTiers.length > 0) {
      list = list.filter(l => {
        const rt = getRateTier(l.rate);
        return filters.rateTiers.includes(rt);
      });
    }

    // 6. Borrower Profession
    if (filters.profession !== 'ALL') {
      list = list.filter(l => {
        const prof = (l.borrower_profession || '').toLowerCase();
        if (filters.profession === 'Salaried') return prof.includes('salaried');
        if (filters.profession === 'Self-employed') return prof.includes('self') || prof.includes('business');
        return true;
      });
    }

    // 7. Monthly Income Range
    if (filters.incomeBracket !== 'ALL') {
      list = list.filter(l => {
        const inc = safeNum(l.borrower_income);
        if (filters.incomeBracket === '<25k') return inc > 0 && inc <= 25000;
        if (filters.incomeBracket === '25k-50k') return inc > 25000 && inc <= 50000;
        if (filters.incomeBracket === '50k-100k') return inc > 50000 && inc <= 100000;
        if (filters.incomeBracket === '>100k') return inc > 100000;
        return true;
      });
    }

    // 8. Borrower Sanctioned Loan Amount
    if (filters.loanAmountBracket !== 'ALL') {
      list = list.filter(l => {
        const amt = safeNum(l.borrower_loan_amount, safeNum(l.amount));
        if (filters.loanAmountBracket === '<25k') return amt <= 25000;
        if (filters.loanAmountBracket === '25k-50k') return amt > 25000 && amt <= 50000;
        if (filters.loanAmountBracket === '50k-100k') return amt > 50000 && amt <= 100000;
        if (filters.loanAmountBracket === '>100k') return amt > 100000;
        return true;
      });
    }

    // 9. Borrower Age
    if (filters.ageBracket !== 'ALL') {
      list = list.filter(l => {
        const age = safeNum(l.borrower_age);
        if (filters.ageBracket === '21-25') return age >= 21 && age <= 25;
        if (filters.ageBracket === '26-35') return age >= 26 && age <= 35;
        if (filters.ageBracket === '36-45') return age >= 36 && age <= 45;
        if (filters.ageBracket === '>45') return age > 45;
        return true;
      });
    }

    // 10. Disbursed Ticket Tier
    if (filters.ticketTier !== 'ALL') {
      list = list.filter(l => getAmountTier(l.amount) === filters.ticketTier);
    }

    // 11. Loan Status (CLOSED, ACTIVE, NPA, CANCELLED)
    if (filters.status !== 'ALL') {
      list = list.filter(l => {
        const st = String(l.status || '').toUpperCase();
        if (filters.status === 'NPA') return st === 'NPA' || safeNum(l.npa) > 0;
        if (filters.status === 'CANCELLED') return st === 'CANCELLED' || st === 'REJECTED';
        return st === filters.status;
      });
    }

    // 12. DPD Stage (Strict Zero-Tolerance vs Standard Staging)
    if (filters.dpdStage !== 'ALL') {
      if (filters.dpdStage === 'Strict 0 DPD') {
        list = list.filter(l => safeNum(l.dpd) === 0);
      } else if (filters.dpdStage === 'Strict Delinquent (1+ DPD)') {
        list = list.filter(l => safeNum(l.dpd) > 0);
      } else {
        list = list.filter(l => {
          const stage = getDpdStage(l.dpd);
          return stage.includes(filters.dpdStage);
        });
      }
    }

    // 13. LenDenClub Score Bracket
    if (filters.scoreTier && filters.scoreTier !== 'ALL') {
      list = list.filter(l => {
        const sc = safeNum(l.score);
        if (filters.scoreTier === '<700') return sc < 700;
        if (filters.scoreTier === '700-729') return sc >= 700 && sc < 730;
        if (filters.scoreTier === '730-759') return sc >= 730 && sc < 760;
        if (filters.scoreTier === '760-779') return sc >= 760 && sc < 780;
        if (filters.scoreTier === '780+') return sc >= 780;
        return true;
      });
    }

    // 14. Capital Velocity / Prepayment Status
    if (filters.prepaymentStatus && filters.prepaymentStatus !== 'ALL') {
      list = list.filter(l => {
        if (filters.prepaymentStatus === 'PREPAID') return l.prepaid === true;
        if (filters.prepaymentStatus === 'FULL_TERM') return !l.prepaid;
        return true;
      });
    }

    return list;
  }, [data, filters]);

  // -------------------------------------------------------------
  // DYNAMIC CALCULATION OF 100% OF PORTFOLIO DATA & GRAPHS
  // -------------------------------------------------------------
  const dynamicData = useMemo(() => {
    if (!data) return null;
    return computeDynamicPortfolio(filteredLoans, data);
  }, [data, filteredLoans]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-wide">Loading Portfolio Intelligence Engine...</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Ingesting 5,276 loans (2,492 Active + 2,784 Closed), 10 2D heatmaps, and 100+ institutional analytics matrices with Apache ECharts</p>
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

  const activeLoanCount = filteredLoans.length;
  const totalLoanCount = data.loans ? data.loans.length : 5276;

  return (
    <div className="app-container">
      {/* Platform Header with Theme Switcher and Live Dynamic KPIs */}
      <Header kpis={dynamicData.portfolio_kpis} theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Container */}
      <div className="tab-content" style={{ marginTop: '1.25rem', marginBottom: '3rem' }}>
        {/* Golden Rules & Blacklist Warning Banner */}
        <RuleBanner />

        {/* Global Multi-Parameter Filter Bar */}
        <GlobalFilterBar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          totalLoansCount={totalLoanCount}
          filteredLoansCount={activeLoanCount}
          kpis={dynamicData.portfolio_kpis}
        />

        {/* 10-Tab Navigation Bar */}
        <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Tab Content Display */}
        <main style={{ marginTop: '1.5rem' }}>
          {activeLoanCount === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No Loans Match the Selected Filters
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                Try loosening your filter criteria or click the reset button below to restore the complete portfolio dataset of 3,967 loans.
              </p>
              <button
                onClick={handleResetFilters}
                style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  background: 'var(--emerald)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'tab-executive' && <TabExecutive data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-annualized' && <TabBorrowerProfile data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-scores' && <TabScores data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-tenure' && <TabTenure data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-tickets' && <TabTickets data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-rates' && <TabRates data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-heatmaps' && <TabHeatmaps data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-vintages' && <TabVintages data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-delinquency' && <TabDelinquency data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-strategy' && <TabStrategy data={dynamicData} isDark={isDark} />}
              {activeTab === 'tab-advanced' && <TabAdvancedCharts data={dynamicData} isDark={isDark} />}
            </>
          )}
        </main>
      </div>

      {/* Modern Institutional Platform Footer */}
      <Footer kpis={dynamicData.portfolio_kpis} />
    </div>
  );
}
