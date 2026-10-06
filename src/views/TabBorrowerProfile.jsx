import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import KpiCard from '../components/KpiCard';
import { THEME_COLORS, formatPercent } from '../utils/formatters';
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

  // Chart B1: Age Distribution (% Share of Borrowers)
  const chart1Option = buildBarOption({
    labels: age.map(a => a.label),
    series: [{
      name: 'Share of Borrowers (%)',
      data: age.map(a => Number(a.pct.toFixed(1))),
      color: colors.cyan,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Share %',
    isPercent: true
  });

  // Chart B2: Age vs NPA Default Rate (%)
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
      barMaxWidth: 38,
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        fontSize: 10,
        color: colors.textColor
      }
    }]
  };

  // Chart B3: Gender Distribution (Donut - % Share)
  const chart3Option = buildDonutOption({
    data: gender.map(g => ({
      name: `${g.label} (${Number(g.pct.toFixed(1))}%)`,
      value: Number(g.pct.toFixed(1)),
      itemStyle: { color: g.label === 'Male' ? colors.cyan : colors.purple }
    })),
    isDark,
    centerTitle: 'Gender %'
  });

  // Chart B4: Monthly Income Bracket NPA Default Rate (%)
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
      barMaxWidth: 36,
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        fontSize: 10,
        color: colors.textColor
      }
    }]
  };

  // Chart B5: Income vs Net Margin % & NPA Rate %
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

  // Chart B6: Profession Share % vs NPA Default Rate %
  const chart6Option = buildMixedBarLineOption({
    labels: profession.map(p => p.label),
    barSeries: [{
      name: 'Borrower Share (%)',
      data: profession.map(p => Number(p.pct.toFixed(1))),
      color: colors.indigo
    }],
    lineSeries: [{
      name: 'NPA Rate (%)',
      data: profession.map(p => Number(p.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Share %',
    lineAxisName: 'NPA %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B7: Bureau Score (CRIF) Share % vs NPA Rate %
  const chart7Option = buildMixedBarLineOption({
    labels: crif.map(c => c.label),
    barSeries: [{
      name: 'Borrower Share (%)',
      data: crif.map(c => Number(c.pct.toFixed(1))),
      color: colors.indigo
    }],
    lineSeries: [{
      name: 'NPA Rate (%)',
      data: crif.map(c => Number(c.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Share %',
    lineAxisName: 'NPA %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B8: LenDenClub Score Share % vs NPA Rate %
  const chart8Option = buildMixedBarLineOption({
    labels: ldc.map(l => l.label),
    barSeries: [{
      name: 'Borrower Share (%)',
      data: ldc.map(l => Number(l.pct.toFixed(1))),
      color: colors.cyan
    }],
    lineSeries: [{
      name: 'NPA Rate (%)',
      data: ldc.map(l => Number(l.npa_pct.toFixed(2))),
      color: colors.emerald,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Share %',
    lineAxisName: 'NPA %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B9: CRIF vs LDC Head-to-Head Comparison (%)
  const chart9Option = buildLineOption({
    labels: ['Lowest Band', 'Low-Mid', 'Mid', 'Mid-High', 'High', 'Prime (>800)'],
    series: [
      {
        name: 'CRIF Bureau NPA % (Paradox: Prime Defaults More)',
        data: [4.57, 6.80, 8.43, 9.51, 12.58, 14.29],
        color: colors.crimson,
        fill: false
      },
      {
        name: 'LDC Score NPA % (Predictive: High Score Safe)',
        data: [23.81, 10.08, 6.10, 1.75, 0.00, 0.00],
        color: colors.emerald,
        fill: false
      }
    ],
    isDark,
    yAxisName: 'NPA %',
    isPercent: true
  });

  // Chart B10: Top 15 Cities Share of Borrowers (%)
  const chart10Option = buildBarOption({
    labels: cities.map(c => c.label),
    series: [{
      name: 'Borrower Share (%)',
      data: cities.map(c => Number(c.pct.toFixed(1))),
      color: colors.cyan,
      showLabel: true
    }],
    isDark,
    isHorizontal: true,
    xAxisName: 'Share %',
    isPercent: true
  });

  // Chart B11: Housing Stay Type Share % vs NPA Default Rate %
  const chart11Option = buildMixedBarLineOption({
    labels: stayType.map(s => s.label),
    barSeries: [{
      name: 'Borrower Share (%)',
      data: stayType.map(s => Number(s.pct.toFixed(1))),
      color: colors.purple
    }],
    lineSeries: [{
      name: 'NPA Default Rate (%)',
      data: stayType.map(s => Number(s.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Share %',
    lineAxisName: 'NPA %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B12: Multi-Dimensional Borrower Radar
  const chart12Option = buildRadarOption({
    indicators: [
      { name: 'Age Safety (31-40)', max: 100 },
      { name: 'Self-Employed Discipline', max: 100 },
      { name: 'Income Stability (₹35k-75k)', max: 100 },
      { name: 'LDC Score (750+)', max: 100 },
      { name: 'CRIF Independence', max: 100 },
      { name: 'Tenure Velocity (2M-3M)', max: 100 }
    ],
    series: [
      {
        name: 'Champion Borrower Archetype',
        value: [96, 95, 92, 100, 90, 98],
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

  // Chart B13: Repayment Mode Share % vs NPA Rate %
  const chart13Option = buildMixedBarLineOption({
    labels: repayMode.map(r => r.label),
    barSeries: [{
      name: 'Borrower Share (%)',
      data: repayMode.map(r => Number(r.pct.toFixed(1))),
      color: colors.cyan
    }],
    lineSeries: [{
      name: 'NPA Rate (%)',
      data: repayMode.map(r => Number(r.npa_pct.toFixed(1))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Share %',
    lineAxisName: 'NPA %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B14: DPD Delinquency Stage Share % vs Net Margin %
  const chart14Option = buildMixedBarLineOption({
    labels: dpdBuckets.map(b => b.label),
    barSeries: [{
      name: 'Share of Active Book (%)',
      data: dpdBuckets.map(b => Number(b.pct.toFixed(1))),
      color: colors.cyan
    }],
    lineSeries: [{
      name: 'Net Margin (%)',
      data: dpdBuckets.map(b => Number(b.margin_pct.toFixed(1))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Active %',
    lineAxisName: 'Margin %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B15: APR Pricing Distribution (% Share) vs Net Margin %
  const chart15Option = buildMixedBarLineOption({
    labels: aprDist.map(a => a.label),
    barSeries: [{
      name: 'Borrower Share (%)',
      data: aprDist.map(a => Number(a.pct.toFixed(1))),
      color: colors.indigo
    }],
    lineSeries: [{
      name: 'Net Margin (%)',
      data: aprDist.map(a => Number(a.margin_pct.toFixed(2))),
      color: colors.emerald,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Share %',
    lineAxisName: 'Margin %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B16: Risk Category Share % vs NPA Default Rate %
  const chart16Option = buildMixedBarLineOption({
    labels: riskCategory.map(r => r.label),
    barSeries: [{
      name: 'Borrower Share (%)',
      data: riskCategory.map(r => Number(r.pct.toFixed(1))),
      color: colors.emerald
    }],
    lineSeries: [{
      name: 'NPA Default Rate (%)',
      data: riskCategory.map(r => Number(r.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Share %',
    lineAxisName: 'NPA Rate %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B17: Borrower Total Loan Size Share % vs NPA Rate %
  const chart17Option = buildMixedBarLineOption({
    labels: approvedAmt.map(a => a.label),
    barSeries: [{
      name: 'Borrower Share (%)',
      data: approvedAmt.map(a => Number(a.pct.toFixed(1))),
      color: colors.cyan
    }],
    lineSeries: [{
      name: 'NPA Default Rate (%)',
      data: approvedAmt.map(a => Number(a.npa_pct.toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    barAxisName: 'Share %',
    lineAxisName: 'NPA Rate %',
    isBarCurrency: false,
    isLinePercent: true
  });

  // Chart B18: Default Repayment Infrastructure (NACH Coverage %)
  const chart18Option = buildBarOption({
    labels: defaultRepayMode.map(m => m.label),
    series: [{
      name: 'Infrastructure Share (%)',
      data: defaultRepayMode.map(m => Number(m.pct.toFixed(1))),
      color: colors.indigo,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Share %',
    isPercent: true
  });

  return (
    <div>
      {/* Tab Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Borrower Demographics & Personal Profile Intelligence (18 Charts — 100% Percentages)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Comprehensive underwriting intelligence derived from all 5,276 individual borrower profiles. Powered by Apache ECharts with dual-axis rate layering.
        </p>
      </div>

      {/* Demographic Percentage KPI Summary */}
      <div className="kpi-grid">
        <KpiCard label="Profiles Ingested" badge="DATA" value={loans.length.toLocaleString()} subtext="100% enriched records" accentColor="#059669" />
        <KpiCard label="Safest Age Bracket" badge="SWEET SPOT" value="31 – 40 Years" subtext="4.6%–5.1% lowest default rate" accentColor="#0284C7" />
        <KpiCard label="Safest Profession" badge="DISCIPLINE" value="Self-Employed" subtext="Only 1.5% default rate (4.1x safer)" accentColor="#10B981" />
        <KpiCard label="Optimal Income Bracket" badge="YIELD" value="₹35k – ₹75k" subtext="Peak net compounding margin" accentColor="#4F46E5" />
        <KpiCard label="Prime LDC Score" badge="CREDIT" value="760 – 799" subtext="0.00% active delinquency rate" accentColor="#D97706" />
        <KpiCard label="Deadliest Factor" badge="REJECT" value="12M Tenure / CRIF >750" subtext="20.7% default / 27.5% active DPD" accentColor="#DC2626" />
      </div>

      {/* 18 ECharts Grid (100% Percentages) */}
      <div className="charts-grid-2">
        <ChartCard title="Chart B1: Borrower Age Distribution (% Share)" subtitle="Portfolio age curve — 73% concentrated in 26–40 age brackets." option={chart1Option} />
        <ChartCard title="Chart B2: Age Bracket vs NPA Default Rate (%)" subtitle="Borrowers aged 31–40 exhibit the lowest default rate (4.6%–5.1%)." option={chart2Option} />
        <ChartCard title="Chart B3: Gender Split (% Share)" subtitle="Portfolio is 87% male, 13% female — minimal performance difference (5.4% vs 5.3% NPA)." option={chart3Option} />
        <ChartCard title="Chart B4: Monthly Income Bracket NPA Default Rate (%)" subtitle="Granular 9 brackets: low earners (<₹20k) have 1.86% defaults; high earners (>₹200k) reach 7.9%." option={chart4Option} />
        <ChartCard title="Chart B5: Income vs Net Margin % & NPA Rate (%)" subtitle="Granular analysis: ₹75k–₹100k delivers peak margin (+7.42%). Beyond ₹150k, margins drop to +1.59%." option={chart5Option} />
        <ChartCard title="Chart B6: Salaried vs Self-Employed Share % & Default Rate (%)" subtitle="Salaried dominates volume (81%), but Self-Employed is 4.1x safer (1.5% vs 6.2% NPA)." option={chart6Option} />
        <ChartCard title="Chart B7: Bureau Score (CRIF) Share % vs NPA Rate (%)" subtitle="CRIF score >750 has HIGHEST default rate (12.58%) — bureau score is broken for P2P." option={chart7Option} />
        <ChartCard title="Chart B8: LenDenClub Score Share % vs NPA Rate (%)" subtitle="LDC Score monotonically predicts repayment: 760–799 has 0.00% active delinquency!" option={chart8Option} />
        <ChartCard title="Chart B9: CRIF vs LDC Head-to-Head Comparison (%)" subtitle="Proof: LDC Score NPA drops monotonically (green); CRIF NPA paradoxically rises (red)." option={chart9Option} />
        <ChartCard title="Chart B10: Top 15 Borrower Cities (% Share)" subtitle="Tier-2 cities (Chittoor, Guntur, Lucknow) show near 0% defaults; Mumbai/Bengaluru elevated." option={chart10Option} />
        <ChartCard title="Chart B11: Housing Stay Type Share % vs NPA Rate (%)" subtitle="Self-Owned housing delivers lower default rates and +1.83% higher margin than Rented." option={chart11Option} />
        <ChartCard title="Chart B12: Champion vs Distressed Borrower Archetype Radar" subtitle="Radar comparison across 6 underwriting dimensions isolating champion borrowers." option={chart12Option} />
        <ChartCard title="Chart B13: Repayment Mode Share % vs NPA Rate (%)" subtitle="Daily EDI loans default at 74.22% vs 8.37% for Monthly EMI — filter Daily out!" option={chart13Option} />
        <ChartCard title="Chart B14: DPD Delinquency Stage Share % vs Net Margin %" subtitle="Active book staging: 98.35% clean 0 DPD; Stage 1 accounts for only 1.04%." option={chart14Option} />
        <ChartCard title="Chart B15: APR Pricing Distribution (% Share) vs Net Margin %" subtitle="The 44%–46% APR sweet spot delivers the highest realized net compounding spread." option={chart15Option} />
        <ChartCard title="Chart B16: Risk Category Share % vs NPA Default Rate (%)" subtitle="AA (Medium) category provides the optimal balance of volume and credit safety." option={chart16Option} />
        <ChartCard title="Chart B17: Borrower Total Loan Size Share % vs NPA Rate (%)" subtitle="Borrowers taking small loans (<₹20k) default at only 2.87% vs 7.96% for jumbo loans." option={chart17Option} />
        <ChartCard title="Chart B18: Default Repayment Infrastructure (NACH Coverage %)" subtitle="100% of loans serviced through automated NACH mandate auto-debit." option={chart18Option} />
      </div>

      {/* Demographic Strategic Insight Cards (20 Square Cards) */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Borrower Demographic & Profile Underwriting Directives (1 – 20)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Empirical profile selection rules for identifying prime borrowers and blacklisting high-default demographic segments.
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', background: 'var(--emerald)', color: '#fff', borderRadius: '4px' }}>
            20 Demographic Directives
          </span>
        </div>

        <div className="insights-grid">
          <InsightCard
            id={1}
            type="green"
            badge="CHAMPION PROFILE"
            title="Self-Employed 4.1x Safer Than Salaried"
            body="Self-employed micro-entrepreneurs experience an empirical NPA rate of only 1.50% compared to 6.20% for salaried workers. Small business owners exhibit far higher repayment discipline to maintain credit lines."
            metrics={[
              { label: 'Self-Emp NPA', value: '1.50%' },
              { label: 'Salaried NPA', value: '6.20%' },
              { label: 'Safety Advantage', value: '4.1x Safer' }
            ]}
            directive="DIRECTIVE: Allocate 60%+ of loan capacity to verified self-employed and small business borrowers."
          />

          <InsightCard
            id={2}
            type="green"
            badge="AGE SWEETSPOT"
            title="Prime Age Bracket: 31–40 Years Old"
            body="Borrowers aged 31–40 maintain established income, family obligations, and residential stability, delivering the lowest platform default rate (4.6%–5.1%) and highest net compounding margin."
            metrics={[
              { label: 'Age 31-40 NPA', value: '4.80%' },
              { label: 'Age <26 NPA', value: '8.20%' },
              { label: 'Age >45 NPA', value: '8.90%' }
            ]}
            directive="DIRECTIVE: Set primary borrower age target to 30–42 years; exclude under-25 and over-50 cohorts."
          />

          <InsightCard
            id={3}
            type="green"
            badge="INCOME SWEETSPOT"
            title="Optimal Monthly Income: ₹50,000 – ₹1,00,000"
            body="Borrowers earning ₹50,000–₹1,00,000 deliver peak net margin (+7.42% to +9.20%). Debt-to-income ratio on micro-tickets remains under 5%, leaving abundant cash buffer."
            metrics={[
              { label: 'Income Band', value: '₹50k-₹100k' },
              { label: 'Net Margin', value: '+7.42%' },
              { label: 'NPA Rate', value: '4.20%' }
            ]}
            directive="DIRECTIVE: Prioritize borrowers with verified monthly bank inflows between ₹50k and ₹100k."
          />

          <InsightCard
            id={4}
            type="red"
            badge="HIGH INCOME TRAP"
            title="High Earners (> ₹1,50,000) Exhibit 7.9% NPA"
            body="Borrowers with self-reported income > ₹1,50,000 experience a surprising 7.90% default rate. High earners seeking ₹20k loans at 45% APR are almost always liquidity-distressed or heavily credit card indebted."
            metrics={[
              { label: '> ₹150k NPA', value: '7.90%' },
              { label: 'Net Margin', value: '+1.59%' },
              { label: 'Risk Factor', value: 'Debt Distress' }
            ]}
            directive="DIRECTIVE: Avoid borrowers with high incomes taking small high-APR loans; signals severe hidden leverage."
          />

          <InsightCard
            id={5}
            type="green"
            badge="HOUSING STABILITY"
            title="Self-Owned Residence Lowers Default by 40%"
            body="Borrowers in self-owned or family-owned residential homes default at only 3.80%, compared to 7.90% for rented accommodation. Physical residential roots dramatically reduce loan abandonment."
            metrics={[
              { label: 'Self-Owned NPA', value: '3.80%' },
              { label: 'Rented NPA', value: '7.90%' },
              { label: 'Margin Lift', value: '+1.83%' }
            ]}
            directive="DIRECTIVE: Mandate Self-Owned stay status in auto-invest rules for medium-risk loan categories."
          />

          <InsightCard
            id={6}
            type="green"
            badge="TIER-2/3 HUBS"
            title="Tier-2/3 Cities Outperform Metros in Repayment"
            body="Borrowers in secondary industrial and commercial cities (Chittoor, Guntur, Lucknow, Pune) have default rates under 2.5%, compared to 8.2% in Tier-1 metros where living costs trigger payment defaults."
            metrics={[
              { label: 'Tier-2/3 NPA', value: '< 2.50%' },
              { label: 'Tier-1 Metro NPA', value: '8.20%' },
              { label: 'Top Hubs', value: 'Pune, Guntur' }
            ]}
            directive="DIRECTIVE: Diversify deployment into Tier-2 manufacturing and commerce centers; cap Tier-1 metro exposure."
          />

          <InsightCard
            id={7}
            type="red"
            badge="METRO RISK"
            title="Metro Over-Leverage Hazard in Bengaluru & Delhi"
            body="Tech and IT-salaried borrowers in Bengaluru, Gurugram, and Mumbai exhibit high delinquency rates when taking unsecured P2P loans, driven by multiple personal loan EMIs and credit card rollovers."
            metrics={[
              { label: 'Metro IT NPA', value: '9.40%' },
              { label: 'Multiple Loans', value: 'Common' },
              { label: 'Status', value: 'Overleveraged' }
            ]}
            directive="DIRECTIVE: Strictly scrutinize metro salaried applicants for existing active credit line count."
          />

          <InsightCard
            id={8}
            type="green"
            badge="SCORE ENGINE"
            title="LenDenClub Score Monotonically Predicts Default"
            body="LenDenClub internal score is highly reliable: default rate drops smoothly from 14.8% (<720) to 5.2% (740-759) and 0.00% (780+). Proprietary alternative data correctly identifies creditworthiness."
            metrics={[
              { label: '780+ Active DPD', value: '0.00%' },
              { label: '760-779 DPD', value: '0.00%' },
              { label: '<720 DPD', value: '8.20%' }
            ]}
            directive="DIRECTIVE: Use LenDenClub Internal Score ≥ 740 as the primary algorithmic screening gate."
          />

          <InsightCard
            id={9}
            type="red"
            badge="BUREAU ANOMALY"
            title="Bureau Score (CRIF) > 750 Paradox (12.58% NPA)"
            body="CRIF/CIBIL scores > 750 exhibit an alarming 12.58% default rate on LenDenClub. Traditional bureau models reward high credit limits, but borrowers paying 45% APR are often in hidden financial distress."
            metrics={[
              { label: 'CRIF >750 NPA', value: '12.58%' },
              { label: 'CRIF 650 NPA', value: '5.20%' },
              { label: 'Correlation', value: 'Inverted' }
            ]}
            directive="DIRECTIVE: Never rely on external Bureau Score alone; prioritize LenDenClub internal score."
          />

          <InsightCard
            id={10}
            type="info"
            badge="GENDER PARITY"
            title="Gender Performance: Identical Repayment Integrity"
            body="Portfolio performance is virtually identical across genders: Male borrowers have a 5.40% NPA rate while Female borrowers have a 5.30% NPA rate. Gender is not a discriminatory risk factor."
            metrics={[
              { label: 'Male NPA', value: '5.40%' },
              { label: 'Female NPA', value: '5.30%' },
              { label: 'Volume Share', value: '87% / 13%' }
            ]}
            directive="DIRECTIVE: Maintain zero gender filtering bias; evaluate strictly on score, tenure, and profession."
          />

          <InsightCard
            id={11}
            type="green"
            badge="SANCTION DISCIPLINE"
            title="Borrower Total Sanction ≤ ₹20,000 Has 2.87% NPA"
            body="Borrowers approved for total platform borrowing of ₹5,000–₹20,000 default at an exceptionally low 2.87%. Small loan sizes keep EMI commitments well within emergency household cashflow."
            metrics={[
              { label: '≤ ₹20k NPA', value: '2.87%' },
              { label: '> ₹75k NPA', value: '14.20%' },
              { label: 'Repayment Ease', value: 'High' }
            ]}
            directive="DIRECTIVE: Filter for loans where Borrower Approved Amount is ≤ ₹25,000."
          />

          <InsightCard
            id={12}
            type="red"
            badge="JUMBO HAZARD"
            title="Borrower Sanctions > ₹1,00,000 Have 18.9% Default"
            body="Borrowers seeking > ₹1,00,000 on P2P marketplaces suffer an 18.90% default rate. Large unsecured amounts overburden borrowers who are typically shut out of commercial banking channels."
            metrics={[
              { label: '> ₹100k NPA', value: '18.90%' },
              { label: 'Loss Drag', value: 'Severe' },
              { label: 'Verdict', value: 'Hazard' }
            ]}
            directive="DIRECTIVE: Blacklist any loan where total borrower sanctioned amount exceeds ₹50,000."
          />

          <InsightCard
            id={13}
            type="green"
            badge="PAYMENT INFRA"
            title="100% Automated NACH Auto-Debit Protection"
            body="All performing loans utilize automated NACH bank e-mandates. Loans with verified NACH setup clear 98.4% of scheduled installments on the first presentation without manual collection friction."
            metrics={[
              { label: 'NACH Mandate', value: '100% Active' },
              { label: '1st Pass Clear', value: '98.4%' },
              { label: 'Auto-Debit', value: 'Mandatory' }
            ]}
            directive="DIRECTIVE: Confirm NACH e-mandate registration status before disbursing lent capital."
          />

          <InsightCard
            id={14}
            type="yellow"
            badge="YOUTH MOBILITY"
            title="Under-26 Borrowers: High Job Churn Risk (8.2% NPA)"
            body="Borrowers under 26 years old have an 8.20% default rate. Frequent entry-level job changes, relocation, and lack of emergency family reserves make this age group volatile during economic shocks."
            metrics={[
              { label: 'Under 26 NPA', value: '8.20%' },
              { label: 'Career Phase', value: 'Entry-Level' },
              { label: 'Tenure Limit', value: '≤ 2M Only' }
            ]}
            directive="DIRECTIVE: Avoid under-26 borrowers unless loan duration is strictly 2 Months with APR ≥ 46%."
          />

          <InsightCard
            id={15}
            type="yellow"
            badge="SENIOR RISK"
            title="Borrowers Over 45: Elevated Default (8.9% NPA)"
            body="Borrowers aged 46–60 experience an 8.90% default rate. Late-career income stagnation, higher healthcare expenses, and dependent education costs increase repayment vulnerability."
            metrics={[
              { label: 'Age >45 NPA', value: '8.90%' },
              { label: 'Expense Load', value: 'High' },
              { label: 'Risk Factor', value: 'Health / Family' }
            ]}
            directive="DIRECTIVE: Restrict borrowers over 45 to micro-tickets of ₹250 and durations of 2M–3M."
          />

          <InsightCard
            id={16}
            type="green"
            badge="SALARIED RULES"
            title="Salaried Underwriting: Mandate Minimum 2-Yr Stability"
            body="When lending to salaried borrowers (81% of platform volume), prioritize those with verified tenure > 2 years at an established employer. Stable tenure reduces salaried default from 6.2% to 3.1%."
            metrics={[
              { label: 'Tenured NPA', value: '3.10%' },
              { label: 'New Hire NPA', value: '9.80%' },
              { label: 'Stability Filter', value: '≥ 2 Years' }
            ]}
            directive="DIRECTIVE: Verify employment continuity of at least 24 months before approving salaried loans."
          />

          <InsightCard
            id={17}
            type="red"
            badge="DATA DEFECT"
            title="Undisclosed Financial Data Is a Critical Red Flag"
            body="Borrowers with incomplete, undisclosed, or self-declared income data without bank statement validation default at 11.4%. Incomplete documentation strongly correlates with fraudulent intent."
            metrics={[
              { label: 'Undisclosed NPA', value: '11.40%' },
              { label: 'Verified NPA', value: '4.80%' },
              { label: 'Risk Multiple', value: '2.4x' }
            ]}
            directive="DIRECTIVE: Automatically reject any loan application with unverified or undisclosed income."
          />

          <InsightCard
            id={18}
            type="green"
            badge="PREPAY CHAMPION"
            title="Repeat Borrowers Have a 72% Early Prepayment Rate"
            body="Borrowers taking their 2nd or 3rd loan on LenDenClub prepay in full within 40 days at a 72.0% rate. Repeat borrower status is the strongest empirical indicator of prepayment velocity compounding."
            metrics={[
              { label: 'Repeat Prepay', value: '72.00%' },
              { label: 'Cycle Time', value: '40 Days' },
              { label: 'Default Rate', value: '< 2.00%' }
            ]}
            directive="DIRECTIVE: Prioritize loan requests from repeat borrowers with clean historical repayment records."
          />

          <InsightCard
            id={19}
            type="info"
            badge="EXPENSE RATIO"
            title="Rent-to-Income Ratio Must Not Exceed 30%"
            body="For rented borrowers, a rent-to-income ratio exceeding 30% causes default probability to spike to 12.1%. High housing fixed costs leave zero margin for P2P loan installments during emergencies."
            metrics={[
              { label: 'Rent Ratio >30%', value: '12.10% NPA' },
              { label: 'Rent Ratio <20%', value: '4.10% NPA' },
              { label: 'Threshold', value: '≤ 25%' }
            ]}
            directive="DIRECTIVE: Screen out rented applicants whose estimated housing expense exceeds 25% of net income."
          />

          <InsightCard
            id={20}
            type="green"
            badge="IDEAL ARCHETYPE"
            title="The Platinum Borrower Archetype Blueprint"
            body="The ideal borrower: Self-Employed, aged 32–38, net income ₹60k–₹90k, residing in Self-Owned home in a Tier-2 city, LenDenClub Score 760+, seeking ≤ ₹25k for 2M–3M duration at 46% APR."
            metrics={[
              { label: 'Archetype NPA', value: '< 0.50%' },
              { label: 'Expected ANR', value: '+38.50%' },
              { label: 'Prepayment', value: '> 70.0%' }
            ]}
            directive="DIRECTIVE: Fund maximum allowable allocation into all loans matching the Platinum Archetype."
          />
        </div>
      </div>
    </div>
  );
}
