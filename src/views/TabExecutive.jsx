import React from 'react';
import ReactECharts from 'echarts-for-react';
import KpiCard from '../components/KpiCard';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import { formatINR, formatPercent, THEME_COLORS } from '../utils/formatters';
import {
  buildDonutOption,
  buildBarOption,
  buildLineOption,
  getChartThemeColors
} from '../utils/echartsConfig';

export default function TabExecutive({ data, isDark = false }) {
  const kpis = data?.portfolio_kpis;
  const colors = getChartThemeColors(isDark);

  // Chart 1: Status Distribution (Donut)
  const chart1Option = buildDonutOption({
    data: [
      { name: 'Closed (Repaid)', value: kpis?.closed_loans ?? 2396, itemStyle: { color: colors.emerald } },
      { name: 'Active (Current)', value: kpis?.active_loans ?? 1385, itemStyle: { color: colors.cyan } },
      { name: 'NPA (Defaulted)', value: kpis?.npa_loans ?? 149, itemStyle: { color: colors.crimson } },
      { name: 'Rejected/Cancelled', value: kpis?.rejected_loans ?? 37, itemStyle: { color: colors.purple } }
    ],
    isDark,
    isDonut: true,
    centerTitle: 'Status'
  });

  // Chart 2: Net Cashflow Waterfall
  const chart2Labels = ['Disbursed', 'Principal Back', 'Interest Earned', 'Platform Fee', 'NPA Loss', 'Net Profit'];
  const chart2Values = [
    kpis?.total_disbursed ?? 2869500,
    kpis?.principal_received ?? 2041826,
    kpis?.interest_received ?? 256859,
    -(kpis?.platform_fee ?? 45922),
    -(kpis?.npa_amount ?? 88820),
    kpis?.realized_net_profit ?? 122117
  ];
  const chart2Option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        const p = params[0];
        return `<div style="font-weight:700">${p.name}</div><div>Amount: <b>${formatINR(p.value)}</b></div>`;
      }
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: 45, containLabel: true },
    xAxis: {
      type: 'category',
      data: chart2Labels,
      axisLabel: { color: colors.textColor, fontSize: 10, interval: 0, rotate: 20 },
      axisLine: { lineStyle: { color: colors.gridLineColor } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: (v) => formatINR(v) },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: chart2Values.map(v => ({
        value: v,
        itemStyle: {
          color: v >= 0 ? (v > 1000000 ? colors.cyan : colors.emerald) : colors.crimson,
          borderRadius: v >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 42
    }]
  };

  // Chart 3: Net Return by Tenure
  const tenureData = data?.tenure_resolved ?? [];
  const chart3Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Tenure</b><br/>Ann. Net Return: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureData.map(t => t.cohort ? `${t.cohort}M` : `${t.tenure}M`),
      axisLabel: { color: colors.textColor, fontSize: 10, interval: 0 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: tenureData.map(t => ({
        value: t.ann_net_pct,
        itemStyle: {
          color: t.ann_net_pct >= 15 ? colors.emerald : t.ann_net_pct >= 0 ? colors.amber : colors.crimson,
          borderRadius: t.ann_net_pct >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 38
    }]
  };

  // Chart 4: Net Return by Ticket Size
  const amtData = data?.amount_resolved ?? [];
  const chart4Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Ticket</b><br/>Ann. Net Return: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: amtData.map(a => a.cohort || a.tier || 'Micro'),
      axisLabel: { color: colors.textColor, fontSize: 10, interval: 0 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: amtData.map(a => ({
        value: a.ann_net_pct,
        itemStyle: {
          color: a.ann_net_pct >= 15 ? colors.emerald : a.ann_net_pct >= 0 ? colors.amber : colors.crimson,
          borderRadius: a.ann_net_pct >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 38
    }]
  };

  // Chart 5: Cumulative Disbursed vs Received
  const vintages = data?.vintage_trend ?? [];
  const chart5Option = buildLineOption({
    labels: vintages.map(v => v.month),
    series: [
      {
        name: 'Cumulative Disbursed',
        data: vintages.map((v, i) => vintages.slice(0, i + 1).reduce((acc, x) => acc + x.disbursed, 0)),
        color: colors.cyan,
        fill: false
      },
      {
        name: 'Cumulative Received',
        data: vintages.map((v, i) => vintages.slice(0, i + 1).reduce((acc, x) => acc + x.received, 0)),
        color: colors.emerald,
        fill: true,
        areaColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.12)'
      }
    ],
    isDark,
    yAxisName: 'Capital (₹)',
    isCurrency: true
  });

  // Chart 6: Realized Net Profit over Time
  const chart6Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>Net Profit: <b>${formatINR(p[0].value)}</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: vintages.map(v => v.month),
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: (v) => formatINR(v) },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: vintages.map(v => ({
        value: v.net_profit,
        itemStyle: {
          color: v.net_profit >= 0 ? colors.emerald : colors.crimson,
          borderRadius: v.net_profit >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 28
    }]
  };

  // Chart 7: Capital Allocation by Score Tier
  const score20 = data?.score_20_resolved ?? [];
  const chart7Option = buildBarOption({
    labels: score20.map(s => s.cohort),
    series: [{ name: 'Capital Disbursed', data: score20.map(s => s.disbursed), color: colors.indigo }],
    isDark,
    yAxisName: 'Rupees (₹)',
    isCurrency: true
  });

  // Chart 8: Gross Interest vs Fees vs NPA
  const chart8Option = buildBarOption({
    labels: ['Interest Received', 'Platform Fees', 'NPA Loss'],
    series: [
      {
        name: 'Amount',
        data: [
          { value: kpis?.interest_received ?? 256859, itemStyle: { color: colors.emerald } },
          { value: kpis?.platform_fee ?? 45922, itemStyle: { color: colors.amber } },
          { value: kpis?.npa_amount ?? 88820, itemStyle: { color: colors.crimson } }
        ],
        showLabel: true
      }
    ],
    isDark,
    yAxisName: 'Amount (₹)',
    isCurrency: true
  });

  // Chart 9: NPA Amount by Tenure
  const chart9Option = buildBarOption({
    labels: tenureData.map(t => t.cohort ? `${t.cohort}M` : `${t.tenure}M`),
    series: [{ name: 'NPA Losses', data: tenureData.map(t => t.npa_amount), color: colors.crimson, showLabel: true }],
    isDark,
    yAxisName: 'Loss (₹)',
    isCurrency: true
  });

  // Chart 10: Annualized Velocity Multiplier by Tenure
  const chart10Option = buildLineOption({
    labels: ['2 Months', '3 Months', '4 Months', '5 Months', '6 Months', '12 Months'],
    series: [{
      name: 'Turnover Multiplier (12 / Tenure)',
      data: [6.0, 4.0, 3.0, 2.4, 2.0, 1.0],
      color: colors.cyan,
      fill: true,
      areaColor: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(2, 132, 199, 0.12)'
    }],
    isDark,
    yAxisName: 'Velocity (x/yr)'
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Executive Cockpit & Strategic Overview
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          High-level institutional portfolio performance, cashflow waterfalls, and empirical lending rules powered by Apache ECharts.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KpiCard label="Total Capital Lent" badge="ALL" value={formatINR(kpis?.total_disbursed)} subtext="Across 3,930 funded loans" accentColor="#059669" />
        <KpiCard label="Cash Received Back" badge="CASH" value={formatINR(kpis?.total_received)} subtext={`Principal: ${formatINR(kpis?.principal_received)} | Int: ${formatINR(kpis?.interest_received)}`} accentColor="#0284C7" />
        <KpiCard label="Official Closed ANR" badge="LDC" value={formatPercent(kpis?.official_closed_anr)} subtext="Absolute Return: 6.25% on closed book" accentColor="#4F46E5" />
        <KpiCard label="Active POS Outstanding" badge="LIVE" value={formatINR(kpis?.principal_outstanding)} subtext="1,385 performing loans active" accentColor="#D97706" />
        <KpiCard label="Total NPA Write-Off" badge="DEFAULTS" value={formatINR(kpis?.npa_amount)} subtext="149 defaults (3.09% of capital)" accentColor="#DC2626" />
        <KpiCard label="Realized Net Profit" badge="REALIZED" value={formatINR(kpis?.realized_net_profit)} subtext="Net of ₹45.9k fees & defaults" accentColor="#10B981" />
      </div>

      {/* Charts 1 to 10 with Apache ECharts */}
      <div className="charts-grid-2">
        <ChartCard title="Chart 01: Portfolio Status Distribution" subtitle="Breakdown of 3,967 loans across Closed, Active, NPA, and Cancelled." option={chart1Option} />
        <ChartCard title="Chart 02: Net Cashflow Waterfall Decomposition" subtitle="Disbursed vs Principal Repaid, Interest Earned, Fees, and NPA Loss." option={chart2Option} />
        <ChartCard title="Chart 03: Realized Annualized Net Return by Tenure" subtitle="2M (+27.4%) and 3M (+21.1%) dramatically outperform 6M (+4.3%) and 12M (-10.8%)." option={chart3Option} />
        <ChartCard title="Chart 04: Net Return by Ticket Size Concentration" subtitle="₹250 - ₹500 micro-tickets deliver +18% to +20%; ₹2k+ drops to -14.2% loss." option={chart4Option} />
        <ChartCard title="Chart 05: Cumulative Cash Deployed vs Recovered" subtitle="Capital recycling trajectory from Sep 2025 to Sep 2026." option={chart5Option} />
        <ChartCard title="Chart 06: Realized Net Profit Trajectory by Month" subtitle="Monthly cashflow profit after absorbing fees and default write-offs." option={chart6Option} />
        <ChartCard title="Chart 07: Capital Deployed by Credit Score Band" subtitle="Exposure distribution across 20-point credit score cohorts." option={chart7Option} />
        <ChartCard title="Chart 08: Gross Interest vs Platform Fees vs NPA" subtitle="Interest income cushion vs cost friction and write-offs." option={chart8Option} />
        <ChartCard title="Chart 09: Total NPA Losses by Tenure Cohort" subtitle="Total rupees written off across tenure buckets." option={chart9Option} />
        <ChartCard title="Chart 10: Annualization Velocity Multiplier Curve" subtitle="Capital recycling velocity: 2M recycles 6x/year; 12M locks capital 1x/year." option={chart10Option} />
      </div>

      {/* 10 Executive Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Executive Intelligence Cards (1 – 10)
        </h3>
        <div className="insights-grid">
          <InsightCard id={1} type="green" badge="PORTFOLIO ALPHA" title="Macro Performance: ₹1.22 Lakh Net Alpha" body="The portfolio successfully generated ₹1.22 Lakh net profit after absorbing ₹45.9k in platform charges and ₹88.8k in NPA write-offs." metrics={[{ label: 'Disbursed', value: '₹28.70L' }, { label: 'Recovered', value: '₹22.99L' }, { label: 'Net Alpha', value: '₹1.22L' }]} directive="MANDATE: Reinvest repayments exclusively into 2M–4M loans to sustain alpha." />
          <InsightCard id={2} type="green" badge="THE GOLDEN RULE" title="2-Month Velocity Outperformance (+27.39% Net)" body="2-month loans delivered your highest risk-adjusted yield with an astounding 6.0x capital velocity and less than 1% raw NPA rate." metrics={[{ label: 'Capital Lent', value: '₹1.61L' }, { label: 'NPA Rate', value: '0.95%' }, { label: 'Ann. Return', value: '+27.39%' }]} directive="MANDATE: Prioritize 2-Month tenures whenever available on marketplace." />
          <InsightCard id={3} type="red" badge="THE BLACKLIST" title="12-Month Tenures: Capital Destruction (-10.79% Net)" body="12-month loans suffered a 15.82% default rate with zero turnover multiplier (1.0x), producing a net annualized loss of -10.79%." metrics={[{ label: 'Disbursed', value: '₹67.0k' }, { label: 'NPA Rate', value: '15.82%' }, { label: 'Net Return', value: '-10.79%' }]} directive="MANDATE: Never fund 12-month loans under any circumstances." />
          <InsightCard id={4} type="red" badge="FATAL HAZARD" title="Daily Repayment Catastrophe: 74.22% Defaults" body="Borrowers subjected to Daily auto-debits experienced extreme business distress, wiping out 74.2% of principal." metrics={[{ label: 'Default Rate', value: '74.22%' }, { label: 'Net Return', value: '-73.19%' }, { label: 'Loss Severity', value: 'Extreme' }]} directive="MANDATE: Filter out Equated Daily Installment (EDI) permanently." />
          <InsightCard id={5} type="yellow" badge="TICKET SIZING" title="Concentration Hazard: Loans > ₹1,000" body="Loans of ₹2,000–₹4,000 yielded -14.18% net loss. A single ₹4,000 default wipes out the entire profit of 16 healthy ₹250 loans." metrics={[{ label: 'Disbursed', value: '₹2.21L' }, { label: 'NPA Rate', value: '11.19%' }, { label: 'Net Return', value: '-14.18%' }]} directive="MANDATE: Enforce a strict ₹250–₹500 ticket size ceiling." />
          <InsightCard id={6} type="green" badge="SWEET SPOT" title="Optimal Credit Score Band: 745 – 774" body="Borrowers in the 745–774 score range delivered between +21.3% and +30.3% net annualized return with minimal defaults." metrics={[{ label: 'Score Range', value: '745–774' }, { label: 'Avg NPA', value: '1.8%' }, { label: 'Net Return', value: '> 25.0%' }]} directive="MANDATE: Target LDC score 745–774 as primary underwriting sweet spot." />
          <InsightCard id={7} type="info" badge="FEE FRICTION" title="Platform Fee Drag: 18.4% of Gross Yield" body="Platform charges totaled ₹45,922 (18.4% of gross interest). Low APR loans (<44%) cannot absorb this fee friction." metrics={[{ label: 'Gross Interest', value: '₹2.57L' }, { label: 'Platform Fee', value: '₹45.9k' }, { label: 'Fee Share', value: '18.4%' }]} directive="MANDATE: Only fund loans with contractual APR ≥ 44%." />
          <InsightCard id={8} type="green" badge="RECOVERY RATIO" title="Monthly Salary Cashflow: 95.6% Recovery" body="Monthly EMI loans backed by salaried borrowers exhibited robust cashflow discipline with 95.6% principal recovery." metrics={[{ label: 'Recovery Rate', value: '95.6%' }, { label: 'Servicing', value: 'Monthly EMI' }, { label: 'Stability', value: 'High' }]} directive="MANDATE: Prioritize salaried borrowers with direct monthly payroll." />
          <InsightCard id={9} type="yellow" badge="6-MONTH TRAP" title="6-Month Duration Penalty: Yield Drops to +4.26%" body="6-month loans saw default rates double to 7.95% raw (15.9% annualized), cutting net returns down to inflation levels." metrics={[{ label: 'Disbursed', value: '₹7.54L' }, { label: 'Raw NPA', value: '7.95%' }, { label: 'Ann. Return', value: '+4.26%' }]} directive="MANDATE: Limit 6-month allocation to under 10% of portfolio." />
          <InsightCard id={10} type="green" badge="CAPITAL VELOCITY" title="Compounding Velocity: 4x–6x Capital Turnover" body="By strictly recycling capital into 2M–4M tenures, your ₹28.7L capital pool turns over 4 to 6 times annually, multiplying net alpha." metrics={[{ label: '2M Velocity', value: '6.0x' }, { label: '3M Velocity', value: '4.0x' }, { label: 'Annual Alpha', value: '+21%–27%' }]} directive="MANDATE: Maintain 100% active capital utilization in short tenures." />
        </div>
      </div>
    </div>
  );
}
