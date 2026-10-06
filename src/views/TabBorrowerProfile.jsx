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

      {/* Demographic Strategic Insight Cards */}
      <div className="insight-grid" style={{ marginTop: '2rem' }}>
        <InsightCard
          id="B1"
          rule="CHAMPION PROFILE: SELF-EMPLOYED IN TIER-2 CITIES"
          metric="1.5% NPA (Self-Emp) vs 6.2% (Salaried)"
          description="Self-employed micro-borrowers repay with 4.1x higher discipline than salaried workers. Combined with Self-Owned residential stay and Tier-2 city locations (Chittoor, Guntur, Pune), default rates drop below 1%."
          action="Favor Self-Employed borrowers with self-owned homes in Tier-2/3 hubs."
          type="golden"
        />
        <InsightCard
          id="B2"
          rule="AGE SWEET SPOT: 31–40 YEARS OLD"
          metric="4.6%–5.1% NPA vs 8.2% (<26)"
          description="Borrowers aged 31–40 have established financial obligations and household stability, resulting in the lowest default rates (4.6%). Under 26 has high job mobility and elevated default frequency."
          action="Set borrower age filter to 28–45 years old."
          type="golden"
        />
        <InsightCard
          id="B19"
          rule="PREPAYMENT VELOCITY CHAMPIONS (50.75% OF BOOK)"
          metric="69.08% Prepayment Rate in 3M Loans"
          description="Across 2,784 closed loans, exactly 1,413 loans (50.75%) closed with ANR >= 36% and ZERO NPA. 3-Month loans have a 69.08% prepayment rate and 2-Month loans have 52.57%. Recycles capital in ~45 days."
          action="Target 2M–3M tenures with LDC Score >= 750 for maximum capital recycling."
          type="golden"
        />
        <InsightCard
          id="B20"
          rule="ZERO-TOLERANCE DPD & CONCENTRATION HAZARD"
          metric="98.35% Clean (0 DPD) | 75.6% Delinquency in 6M–12M"
          description="Under strict zero-tolerance where DPD >= 1 is treated as toxic, 2,451 active loans (98.35%) have flawless 0 DPD. Exactly 41 active loans (1.65%) have DPD >= 1, and 31 of those 41 loans are in 6M–12M tenures."
          action="Strictly avoid 6M–12M tenures and tickets > ₹1,000 to eliminate 75.6% of delinquency."
          type="hazard"
        />
      </div>
    </div>
  );
}
