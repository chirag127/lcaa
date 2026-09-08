import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import KpiCard from '../components/KpiCard';
import { THEME_COLORS, formatINR, formatPercent } from '../utils/formatters';
import {
  buildBarOption,
  buildLineOption,
  buildMixedBarLineOption,
  buildDonutOption,
  buildRadarOption,
  getChartThemeColors
} from '../utils/echartsConfig';
import {
  computeAgeAnalysis,
  computeGenderAnalysis,
  computeIncomeAnalysis,
  computeProfessionAnalysis,
  computeBureauScoreAnalysis,
  computeLDCScoreAnalysis,
  computeCityAnalysis,
  computeStayTypeAnalysis,
  computeBorrowerRadar,
  computeDemographicKPIs,
  computeRepaymentModeAnalysis,
  computeDPDBucketAnalysis,
  computeAPRDistribution,
  computeRiskCategoryAnalysis,
  computeBorrowerLoanAmountAnalysis,
  computeDefaultRepaymentModeAnalysis
} from '../utils/demographicsEngine';

export default function TabBorrowerProfile({ data, isDark = false }) {
  const loans = data?.loans ?? [];
  const colors = getChartThemeColors(isDark);

  // Memoize all computations for performance
  const age = useMemo(() => computeAgeAnalysis(loans), [loans]);
  const gender = useMemo(() => computeGenderAnalysis(loans), [loans]);
  const income = useMemo(() => computeIncomeAnalysis(loans), [loans]);
  const profession = useMemo(() => computeProfessionAnalysis(loans), [loans]);
  const crif = useMemo(() => computeBureauScoreAnalysis(loans), [loans]);
  const ldc = useMemo(() => computeLDCScoreAnalysis(loans), [loans]);
  const cities = useMemo(() => computeCityAnalysis(loans, 15), [loans]);
  const stayType = useMemo(() => computeStayTypeAnalysis(loans), [loans]);
  const radar = useMemo(() => computeBorrowerRadar(loans), [loans]);
  const kpis = useMemo(() => computeDemographicKPIs(loans), [loans]);
  const repayMode = useMemo(() => computeRepaymentModeAnalysis(loans), [loans]);
  const dpdBuckets = useMemo(() => computeDPDBucketAnalysis(loans), [loans]);
  const aprDist = useMemo(() => computeAPRDistribution(loans), [loans]);
  const riskCategory = useMemo(() => computeRiskCategoryAnalysis(loans), [loans]);
  const approvedAmt = useMemo(() => computeBorrowerLoanAmountAnalysis(loans), [loans]);
  const defaultRepayMode = useMemo(() => computeDefaultRepaymentModeAnalysis(loans), [loans]);

  // Chart B1: Age Distribution
  const chart1Option = buildBarOption({
    labels: age.map(a => a.label),
    series: [{
      name: 'Loans Funded',
      data: age.map(a => a.count),
      color: colors.cyan
    }],
    isDark,
    yAxisName: 'Loans'
  });

  // Chart B2: Age vs NPA Default Rate
  const chart2Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Age</b><br/>NPA Rate: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: age.map(a => a.label),
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: age.map(a => ({
        value: Number(a.npa_pct.toFixed(2)),
        itemStyle: {
          color: a.npa_pct >= 6 ? colors.crimson : a.npa_pct >= 4 ? colors.amber : colors.emerald,
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barMaxWidth: 38
    }]
  };

  // Chart B3: Gender Distribution (Donut)
  const chart3Option = buildDonutOption({
    data: gender.map(g => ({
      name: g.label,
      value: g.count,
      itemStyle: { color: g.label === 'Male' ? colors.cyan : colors.purple }
    })),
    isDark,
    centerTitle: 'Gender'
  });

  // Chart B4: Income Bracket Default Rate
  const chart4Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>NPA Rate: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: income.map(i => i.label),
      axisLabel: { color: colors.textColor, fontSize: 10, rotate: 15 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: income.map(i => ({
        value: Number(i.npa_pct.toFixed(2)),
        itemStyle: {
          color: i.npa_pct >= 8 ? colors.crimson : i.npa_pct >= 5 ? colors.amber : colors.emerald,
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barMaxWidth: 36
    }]
  };

  // Chart B5: Income vs Net Margin & NPA Rate (Mixed - Line on Top z:10)
  const chart5Option = buildMixedBarLineOption({
    labels: income.map(i => i.label),
    barSeries: [{
      name: 'Net Margin (%)',
      data: income.map(i => Number(i.margin_pct.toFixed(2))),
      color: colors.emerald
    }],
    lineSeries: [{
      name: 'NPA Rate (%)',
      data: income.map(i => Number(i.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Margin %',
    lineAxisName: 'NPA %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B6: Salaried vs Self-Employed Loan Volume
  const chart6Option = buildBarOption({
    labels: profession.map(p => p.label),
    series: [{
      name: 'Loan Volume',
      data: profession.map(p => p.count),
      color: colors.indigo
    }],
    isDark,
    yAxisName: 'Loans'
  });

  // Chart B7: Bureau Score (CRIF) vs NPA (Mixed - Line on Top z:10)
  const chart7Option = buildMixedBarLineOption({
    labels: crif.map(c => c.label),
    barSeries: [{
      name: 'Loan Count',
      data: crif.map(c => c.count),
      color: colors.indigo
    }],
    lineSeries: [{
      name: 'NPA Rate (%)',
      data: crif.map(c => Number(c.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Loans',
    lineAxisName: 'NPA %'
  });

  // Chart B8: LenDenClub Score vs NPA Rate (Mixed - Line on Top z:10)
  const chart8Option = buildMixedBarLineOption({
    labels: ldc.map(l => l.label),
    barSeries: [{
      name: 'Loan Count',
      data: ldc.map(l => l.count),
      color: colors.cyan
    }],
    lineSeries: [{
      name: 'NPA Rate (%)',
      data: ldc.map(l => Number(l.npa_pct.toFixed(2))),
      color: colors.emerald,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Loans',
    lineAxisName: 'NPA %'
  });

  // Chart B9: CRIF vs LDC Head-to-Head Comparison
  const chart9Option = buildLineOption({
    labels: ['Lowest Band', 'Low-Mid', 'Mid', 'Mid-High', 'High', 'Prime (>800)'],
    series: [
      {
        name: 'CRIF Bureau NPA % (Flawed)',
        data: [2.2, 4.3, 4.4, 5.9, 5.1, 9.1],
        color: colors.crimson,
        fill: false
      },
      {
        name: 'LDC Score NPA % (Predictive)',
        data: [8.1, 7.8, 6.7, 5.4, 2.9, 0.0],
        color: colors.emerald,
        fill: false
      }
    ],
    isDark,
    yAxisName: 'NPA %',
    isPercent: true
  });

  // Chart B10: Top 15 Cities
  const chart10Option = buildBarOption({
    labels: cities.map(c => c.label),
    series: [{
      name: 'Loan Count',
      data: cities.map(c => c.count),
      color: colors.cyan
    }],
    isDark,
    isHorizontal: true,
    xAxisName: 'Loans'
  });

  // Chart B11: Residence Type: Owned vs Rented
  const chart11Option = buildBarOption({
    labels: stayType.map(s => s.label),
    series: [{
      name: 'Loan Count',
      data: stayType.map(s => s.count),
      color: colors.purple
    }],
    isDark,
    yAxisName: 'Loans'
  });

  // Chart B12: Multi-Dimensional Borrower Radar
  const chart12Option = buildRadarOption({
    indicators: [
      { name: 'Age Safety (31-40)', max: 100 },
      { name: 'Profession (Self-Emp)', max: 100 },
      { name: 'Income Stability', max: 100 },
      { name: 'LDC Score (776+)', max: 100 },
      { name: 'CRIF Independence', max: 100 },
      { name: 'Tenure Velocity (2-4M)', max: 100 }
    ],
    series: [
      {
        name: 'Ideal Borrower Archetype',
        value: [95, 95, 90, 100, 90, 95],
        color: colors.emerald,
        areaColor: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(5, 150, 105, 0.2)'
      },
      {
        name: 'Distressed / High-Risk Archetype',
        value: [35, 40, 50, 30, 85, 20],
        color: colors.crimson,
        areaColor: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(220, 38, 38, 0.18)'
      }
    ],
    isDark
  });

  // Chart B13: Repayment Mode: Monthly vs Daily (EDI)
  const chart13Option = buildBarOption({
    labels: repayMode.map(r => r.label),
    series: [
      { name: 'Loans Count', data: repayMode.map(r => r.count), color: colors.cyan },
      { name: 'NPA Rate (%)', data: repayMode.map(r => Number(r.npa_pct.toFixed(1))), color: colors.crimson }
    ],
    isDark,
    yAxisName: 'Value'
  });

  // Chart B14: DPD Delinquency Stage Volume & POS (Mixed - Line on Top z:10)
  const chart14Option = buildMixedBarLineOption({
    labels: dpdBuckets.map(b => b.label),
    barSeries: [{
      name: 'Loans Count',
      data: dpdBuckets.map(b => b.count),
      color: colors.cyan
    }],
    lineSeries: [{
      name: 'Net Margin (%)',
      data: dpdBuckets.map(b => Number(b.margin_pct.toFixed(1))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Loans',
    lineAxisName: 'Margin %'
  });

  // Chart B15: APR Pricing Distribution (Mixed - Line on Top z:10)
  const chart15Option = buildMixedBarLineOption({
    labels: aprDist.map(a => a.label),
    barSeries: [{
      name: 'Loans Count',
      data: aprDist.map(a => a.count),
      color: colors.indigo
    }],
    lineSeries: [{
      name: 'Net Margin (%)',
      data: aprDist.map(a => Number(a.margin_pct.toFixed(2))),
      color: colors.emerald,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Loans',
    lineAxisName: 'Margin %'
  });

  // Chart B16: Risk Category Filter (AA vs A) (Mixed - Line on Top z:10)
  const chart16Option = buildMixedBarLineOption({
    labels: riskCategory.map(r => r.label),
    barSeries: [{
      name: 'Loan Volume',
      data: riskCategory.map(r => r.count),
      color: colors.emerald
    }],
    lineSeries: [{
      name: 'NPA Default Rate (%)',
      data: riskCategory.map(r => Number(r.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Loans',
    lineAxisName: 'NPA Rate %'
  });

  // Chart B17: Borrower Total Loan Amount Ticket Size (Mixed - Line on Top z:10)
  const chart17Option = buildMixedBarLineOption({
    labels: approvedAmt.map(a => a.label),
    barSeries: [{
      name: 'Loan Volume',
      data: approvedAmt.map(a => a.count),
      color: colors.cyan
    }],
    lineSeries: [{
      name: 'NPA Default Rate (%)',
      data: approvedAmt.map(a => Number(a.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Loans',
    lineAxisName: 'NPA Rate %'
  });

  // Chart B18: Default Repayment Mode Infrastructure (NACH Coverage)
  const chart18Option = buildBarOption({
    labels: defaultRepayMode.map(m => m.label),
    series: [{
      name: 'Loan Count',
      data: defaultRepayMode.map(m => m.count),
      color: colors.indigo
    }],
    isDark,
    yAxisName: 'Loans'
  });

  const selfData = profession.find(p => p.label === 'Self-Employed');
  const salData = profession.find(p => p.label === 'Salaried');

  return (
    <div>
      {/* Tab Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Borrower Demographics & Personal Profile Intelligence (18 Charts)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Comprehensive underwriting intelligence derived from 3,967 individual borrower profiles. Powered by Apache ECharts with dual-axis layering.
        </p>
      </div>

      {/* Demographic KPI Summary */}
      <div className="kpi-grid">
        <KpiCard label="Profiles Analyzed" badge="DATA" value={(kpis?.totalProfiles || 3967).toLocaleString()} subtext="3,967 verified borrowers" accentColor="#059669" />
        <KpiCard label="Safest Age Bracket" badge="SWEET SPOT" value={kpis?.safestAge || '31 – 40'} subtext={`Low ${kpis?.safestAgeNPA || '4.8'}% default rate`} accentColor="#0284C7" />
        <KpiCard label="Safest Profession" badge="DISCIPLINE" value={kpis?.safestProfession || 'Self-Employed'} subtext={`Only ${kpis?.safestProfNPA || '1.5'}% default rate`} accentColor="#10B981" />
        <KpiCard label="Optimal Income" badge="YIELD" value={kpis?.optimalIncome || '₹50k – ₹100k'} subtext="Highest margin & recovery" accentColor="#4F46E5" />
        <KpiCard label="Best LDC Score" badge="CREDIT" value={kpis?.bestLDCScore || '776 – 800'} subtext="0.0% NPA — perfect record" accentColor="#D97706" />
        <KpiCard label="Worst Hazard" badge="REJECT" value={kpis?.worstRiskFactor || 'Daily EDI / CRIF >800'} subtext="Negative return / high default" accentColor="#DC2626" />
      </div>

      {/* 18 ECharts Grid */}
      <div className="charts-grid-2">
        <ChartCard title="Chart B1: Borrower Age Distribution" subtitle="Portfolio age curve — 73% concentrated in 26-40 age brackets." option={chart1Option} />
        <ChartCard title="Chart B2: Age Bracket vs Default Risk" subtitle="Borrowers aged 31-40 show the lowest default rate (4.6-5.1%). Under 26 has lowest margin." option={chart2Option} />
        <ChartCard title="Chart B3: Gender Split" subtitle="Portfolio is 87% male, 13% female — minimal performance difference (5.4% vs 5.3% NPA)." option={chart3Option} />
        <ChartCard title="Chart B4: Monthly Income vs Default Rate" subtitle="Granular 9 brackets: low earners (<₹20k) have 1.86% defaults; high earners (>₹200k) reach 7.9%." option={chart4Option} />
        <ChartCard title="Chart B5: Income vs Net Margin & NPA Rate" subtitle="Granular analysis: ₹75k–₹100k delivers peak margin (+7.42%). Beyond ₹150k, margins drop to +1.59%." option={chart5Option} />
        <ChartCard title="Chart B6: Salaried vs Self-Employed Volume" subtitle="Salaried dominates volume (81%), but Self-Employed is 4.1x safer (1.5% vs 6.2% NPA)." option={chart6Option} />
        <ChartCard title="Chart B7: Bureau Score (CRIF) vs NPA Rate" subtitle="CRIF score >800 has HIGHEST default rate (9.1%) — bureau score is broken for P2P." option={chart7Option} />
        <ChartCard title="Chart B8: LenDenClub Score vs NPA Rate" subtitle="LDC Score monotonically predicts repayment: 776-800 has 0.0% defaults!" option={chart8Option} />
        <ChartCard title="Chart B9: CRIF vs LDC Head-to-Head Comparison" subtitle="Proof: LDC Score NPA drops monotonically (green); CRIF NPA rises (red)." option={chart9Option} />
        <ChartCard title="Chart B10: Top 15 Borrower Cities" subtitle="Tier-2 cities (Chittoor, Guntur, Lucknow) show near 0% defaults; Mumbai/Bengaluru elevated." option={chart10Option} />
        <ChartCard title="Chart B11: Housing / Residence Stability" subtitle="Self-Owned housing delivers +1.83% higher margin than Rented (6.18% vs 4.35%)." option={chart11Option} />
        <ChartCard title="Chart B12: Ideal vs Distressed Borrower Profile" subtitle="Radar comparison across 6 underwriting dimensions isolating safe borrowers." option={chart12Option} />
        <ChartCard title="Chart B13: Repayment Mode: Monthly vs Daily" subtitle="Daily EDI loans default at 12.5% vs 5.4% for Monthly EMI — filter Daily out!" option={chart13Option} />
        <ChartCard title="Chart B14: DPD Delinquency Stage Volume & POS" subtitle="92.9% of loans are at DPD=0. Any loan at DPD>7 suffers severe margin decay." option={chart14Option} />
        <ChartCard title="Chart B15: Contractual APR Distribution & Margin" subtitle="Sweet spot: 46-48% APR delivers highest margin. Sub-40% APR fails platform fee coverage." option={chart15Option} />
        <ChartCard title="Chart B16: Risk Category Filter: AA (Medium) vs A (High)" subtitle="AA (Medium) delivers 1.21% NPA vs 6.81% for A (High). Both lines fully visible on top." option={chart16Option} />
        <ChartCard title="Chart B17: Borrower Total Loan Amount vs Default Risk" subtitle="Granular 9-tier breakdown: ≤₹5k micro loans are safest (2.64% NPA); >₹1L jumbos spike to 25.0% defaults!" option={chart17Option} />
        <ChartCard title="Chart B18: Repayment Infrastructure (NACH Coverage)" subtitle="100% of marketplace loans are collected via NACH auto-debit. Non-filterable in website UI." option={chart18Option} />
      </div>

      {/* 18 Demographics Intelligence Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Borrower Demographics & Marketplace Filter Intelligence Cards (B1 – B18)
        </h3>
        <div className="insights-grid">
          <InsightCard id="B1" type="green" badge="AGE SWEET SPOT" title="31-40 Age Range: Peak Risk-Adjusted Returns"
            body="Borrowers aged 31-40 deliver the optimal balance of low default rates (4.6-5.1%) and high margins (4.82-5.57%). This cohort represents 1,804 loans — nearly half the portfolio."
            metrics={[{ label: 'Age Range', value: '31-40' }, { label: 'Avg NPA', value: '~4.8%' }, { label: 'Avg Margin', value: '~5.2%' }]}
            directive="MANDATE: Prefer borrowers aged 31-40 for maximum risk-adjusted yield."
          />
          <InsightCard id="B2" type="yellow" badge="YOUTH RISK" title="Under 26: Lowest Margin at 1.39%"
            body="Young borrowers (<26) have the lowest realized net margin at just 1.39%, despite a moderate 5.0% NPA rate. Lower income and shorter credit history reduce yield."
            metrics={[{ label: 'Loans', value: '418' }, { label: 'NPA Rate', value: '5.0%' }, { label: 'Margin', value: '1.39%' }]}
            directive="MANDATE: Apply stricter filters for borrowers under 26."
          />
          <InsightCard id="B3" type="info" badge="GENDER NEUTRAL" title="Gender Has Minimal Impact on Default Rates"
            body="Male (5.4% NPA) and Female (5.3% NPA) borrowers show virtually identical default behavior. Gender is NOT a useful underwriting signal in this portfolio."
            metrics={[{ label: 'Male NPA', value: '5.4%' }, { label: 'Female NPA', value: '5.3%' }, { label: 'Signal', value: 'Weak' }]}
            directive="MANDATE: Do not use gender as a filtering criterion."
          />
          <InsightCard id="B4" type="red" badge="INCOME PARADOX" title="High Earners (>₹200k) Default MORE (7.9%)"
            body="Counter-intuitively, borrowers earning over ₹200k/month have a 7.9% default rate — the highest of any income bracket. Low earners (<₹25k) have just 1.2% NPA."
            metrics={[{ label: '>₹200k NPA', value: '7.9%' }, { label: '<₹25k NPA', value: '1.2%' }, { label: 'Paradox Ratio', value: '6.6x Higher' }]}
            directive="MANDATE: Do NOT assume high income equals safety. Cap loan sizes even for high earners."
          />
          <InsightCard id="B5" type="green" badge="INCOME ALPHA SWEET SPOT" title="Optimal Income: ₹75k–₹100k Delivers Peak +7.42% Margin"
            body="Subdividing income into 9 granular brackets reveals that ₹75k–₹100k is the peak profitability zone (+7.42% net margin across 370 loans). The ₹50k–₹75k tier also performs strongly (+5.66%). Beyond ₹150k, margins plunge to +1.59% as overleveraged high earners default at nearly 8%."
            metrics={[{ label: '₹75k–100k Margin', value: '+7.42%' }, { label: '₹50k–75k Margin', value: '+5.66%' }, { label: '>₹150k Margin', value: '+1.59%' }]}
            directive="MANDATE: Prioritize borrowers earning ₹50,000–₹100,000/month, with maximum allocation concentrated in ₹75,000–₹100,000."
          />
          <InsightCard id="B6" type="green" badge="COUNTER-INTUITIVE" title="Self-Employed: 4x Safer Than Salaried"
            body={`Self-Employed borrowers have a stunning ${selfData?.npa_pct?.toFixed(1) || '1.5'}% NPA rate vs ${salData?.npa_pct?.toFixed(1) || '6.2'}% for Salaried. Business owners show stronger repayment discipline.`}
            metrics={[{ label: 'Self-Emp NPA', value: `${selfData?.npa_pct?.toFixed(1) || '1.5'}%` }, { label: 'Salaried NPA', value: `${salData?.npa_pct?.toFixed(1) || '6.2'}%` }, { label: 'Advantage', value: '4.1x' }]}
            directive="MANDATE: Actively seek Self-Employed borrowers — they are dramatically safer."
          />
          <InsightCard id="B7" type="red" badge="CRIF IS BROKEN" title="Bureau Score >800: WORST Performance (9.1% NPA)"
            body="The CRIF bureau score is fundamentally broken for P2P lending. Borrowers with the highest CRIF scores (>800) have the HIGHEST default rate at 9.1% and a devastating -7.25% net margin."
            metrics={[{ label: 'CRIF >800 NPA', value: '9.1%' }, { label: 'CRIF <600 NPA', value: '2.2%' }, { label: 'Margin', value: '-7.25%' }]}
            directive="MANDATE: NEVER use CRIF score as a primary underwriting filter. It is inversely correlated with safety."
          />
          <InsightCard id="B8" type="green" badge="LDC SCORE IS KING" title="LDC 776-800: Zero Defaults — Perfect Record"
            body="LenDenClub's proprietary LDC Score is the single most predictive credit metric. Borrowers with LDC 776-800 have a PERFECT 0.0% default rate with 4.75% margin."
            metrics={[{ label: 'LDC 776+ NPA', value: '0.0%' }, { label: 'LDC 700-710 NPA', value: '8.1%' }, { label: 'Predictive Power', value: 'Superior' }]}
            directive="MANDATE: Use LDC Score ≥751 as the PRIMARY credit filter. Trust LDC over CRIF."
          />
          <InsightCard id="B9" type="info" badge="SCORE FACE-OFF" title="LDC Score Drops Monotonically; CRIF Rises — Proof"
            body="When ranked from lowest to highest band, LDC NPA drops from 8.1% to 0.0% (correct behavior). CRIF NPA RISES from 2.2% to 9.1% (broken). This is empirical proof LDC is superior."
            metrics={[{ label: 'LDC Trend', value: '↓ Correct' }, { label: 'CRIF Trend', value: '↑ Broken' }, { label: 'Winner', value: 'LDC' }]}
            directive="MANDATE: Replace all CRIF-based filters with LDC Score filters immediately."
          />
          <InsightCard id="B10" type="yellow" badge="METRO RISK" title="Metro Cities Have Higher Default Rates"
            body="Mumbai (10.9%), Bengaluru (13.8%), and Ghaziabad (13.0%) show elevated NPA rates. Tier-2 cities like Chittoor, Guntur, and Lucknow show 0% defaults."
            metrics={[{ label: 'Mumbai NPA', value: '10.9%' }, { label: 'Tier-2 NPA', value: '~0%' }, { label: 'Signal', value: 'Moderate' }]}
            directive="MANDATE: Do not overweight metro borrowers. Tier-2 city borrowers are empirically safer."
          />
          <InsightCard id="B11" type="info" badge="HOUSING" title="Self-Owned Housing: Slightly Higher Margin"
            body="Borrowers with self-owned homes deliver 6.18% net margin vs 4.35% for renters. Homeownership correlates with financial stability and better repayment."
            metrics={[{ label: 'Self-Owned Margin', value: '6.18%' }, { label: 'Rented Margin', value: '4.35%' }, { label: 'Advantage', value: '+1.83%' }]}
            directive="MANDATE: Prefer borrowers with self-owned housing when data is available."
          />
          <InsightCard id="B12" type="green" badge="IDEAL PROFILE" title="The Perfect Borrower: Self-Employed, 31-40, LDC 776+"
            body={`Combining all demographic signals: the ideal borrower is ${radar.ideal.profession}, aged ${radar.ideal.age}, earning ${radar.ideal.income}, with LDC Score ${radar.ideal.ldcScore}. This profile delivers near-zero defaults with maximum margin.`}
            metrics={[{ label: 'Profession', value: radar.ideal.profession }, { label: 'Age', value: radar.ideal.age }, { label: 'LDC Score', value: radar.ideal.ldcScore }]}
            directive="MANDATE: Configure all auto-invest rules to match this ideal borrower archetype."
          />
          <InsightCard id="B13" type="red" badge="REPAYMENT MODE" title="Daily EMI = 12.5% NPA — 2.3x Higher Than Monthly"
            body={`Daily repayment (EDI) borrowers suffer a ${repayMode.find(r=>r.label==='Daily')?.npa_pct?.toFixed(1)||'12.5'}% NPA rate — more than double the ${repayMode.find(r=>r.label==='Monthly')?.npa_pct?.toFixed(1)||'5.4'}% seen in Monthly EMI. Daily auto-debit puts excessive daily cash-flow pressure on borrowers.`}
            metrics={[{ label: 'Monthly NPA', value: `${repayMode.find(r=>r.label==='Monthly')?.npa_pct?.toFixed(1)||'5.4'}%` }, { label: 'Daily NPA', value: `${repayMode.find(r=>r.label==='Daily')?.npa_pct?.toFixed(1)||'12.5'}%` }, { label: 'Risk', value: '2.3x Higher' }]}
            directive="MANDATE: Never invest in Daily (EDI) repayment loans. Filter to Monthly EMI only."
          />
          <InsightCard id="B14" type="green" badge="PORTFOLIO HEALTH" title="92.9% Loans at DPD=0 — Extremely Healthy Book"
            body={`${dpdBuckets.find(b=>b.label==='0 – Clean')?.count?.toLocaleString()||'3,685'} loans (92.9%) are perfectly on-time with zero days overdue. Only ${dpdBuckets.find(b=>b.label==='NPA Written Off')?.count||217} have been written off as NPA.`}
            metrics={[{ label: 'Clean (DPD=0)', value: '92.9%' }, { label: 'NPA Written Off', value: '217' }, { label: 'DPD Margin Loss', value: '-52.5%' }]}
            directive="MANDATE: Monitor DPD daily — any loan at DPD>7 is an early warning of potential default."
          />
          <InsightCard id="B15" type="yellow" badge="APR PRICING" title="52% of Portfolio Priced at 46-48% APR Sweet Spot"
            body="2,077 loans (52%) are in the 46-48% contractual APR band — the optimal zone for fee coverage and margin. Only 250 loans (<40% APR) are below the platform fee breakeven threshold."
            metrics={[{ label: 'Optimal Band', value: '46-48%' }, { label: 'Loans in Band', value: '2,077' }, { label: 'Below Breakeven', value: '250' }]}
            directive="MANDATE: Only invest in loans with APR ≥44%. Below 40% APR cannot cover platform fees + default risk."
          />
          <InsightCard id="B16" type="green" badge="RISK CATEGORY FILTER" title="AA (Medium) Delivers 1.21% NPA vs 6.81% for A (High)"
            body="Across 911 loans rated 'AA (Medium)', only 11 defaulted (1.21% NPA). Meanwhile, 3,010 'A (High)' loans suffered 205 defaults (6.81%). AA is the ultimate filterable sweet spot on LenDenClub."
            metrics={[{ label: 'AA NPA Rate', value: '1.21%' }, { label: 'A NPA Rate', value: '6.81%' }, { label: 'Safety Edge', value: '5.6x Safer' }]}
            directive="MANDATE: In Website Filter, check 'AA (Medium)' first. Only select 'A (High)' if tenure ≤ 4 Months."
          />
          <InsightCard id="B17" type="red" badge="GRANULAR LOAN AMOUNT TIERS" title="Micro-Tiers (≤₹5k at 2.64% NPA) vs Jumbo Hazard (>₹1L at 25.0% NPA)"
            body="Granular sub-tiering reveals an escalating risk curve: loans ≤₹5,000 have the lowest default rate (2.64%). The ₹5k–₹15k range delivers peak net margins (+5.5% to +5.8%). Above ₹20,000, defaults surge to ~8–10%, culminating in a catastrophic 25.0% default rate and -13.92% net loss on jumbo loans >₹1,00,000."
            metrics={[{ label: '≤₹5k NPA', value: '2.64%' }, { label: '₹5k–15k Margin', value: '+5.7%' }, { label: '>₹1L NPA', value: '25.0%' }]}
            directive="MANDATE: In Website Filter, prioritize 'Upto ₹ 25,000' and avoid loans where approved amount exceeds ₹20,000."
          />
          <InsightCard id="B18" type="info" badge="NON-FILTERABLE ARCHITECTURE" title="Default Repayment Mode: 100% NACH Infrastructure"
            body="LenDenClub automatically routes 100% of loans through bank NACH e-mandates. This is the underlying platform debt-collection rail and cannot be toggled via marketplace UI filters."
            metrics={[{ label: 'NACH Share', value: '100.0%' }, { label: 'Filterable', value: 'No (Backend)' }, { label: 'UI Equivalent', value: 'Repayment Type' }]}
            directive="MANDATE: Understand that Default Repayment Mode is non-filterable. Filter by 'Repayment Type: Monthly EMI' instead."
          />
        </div>
      </div>
    </div>
  );
}
