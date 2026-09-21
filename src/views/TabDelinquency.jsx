import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import { THEME_COLORS, formatINR } from '../utils/formatters';
import {
  buildBarOption,
  buildLineOption,
  buildDonutOption,
  getChartThemeColors
} from '../utils/echartsConfig';

export default function TabDelinquency({ data, isDark = false }) {
  const dpdActive = data?.dpd_active ?? [];
  const scenarios = data?.active_scenarios ?? [];
  const repayTypes = data?.repay_type_resolved ?? [];
  const colors = getChartThemeColors(isDark);

  // Chart 83: Active Book Staging Distribution
  const chart83Option = buildBarOption({
    labels: dpdActive.map(d => d.cohort),
    series: [{
      name: 'Active Loans',
      data: dpdActive.map(d => d.loans),
      color: colors.cyan
    }],
    isDark,
    yAxisName: 'Active Loans'
  });

  // Chart 84: Active Disbursed Capital by Stage
  const chart84Option = buildBarOption({
    labels: dpdActive.map(d => d.cohort),
    series: [{
      name: 'Active Disbursed Capital',
      data: dpdActive.map(d => d.disbursed),
      color: colors.indigo
    }],
    isDark,
    yAxisName: 'Capital (₹)',
    isCurrency: true
  });

  // Chart 85: Projected NPA Loss by Scenario
  const chart85Option = buildBarOption({
    labels: scenarios.map(s => s.scenario),
    series: [{
      name: 'Projected NPA Loss',
      data: scenarios.map(s => s.projected_npa_loss),
      color: colors.crimson
    }],
    isDark,
    yAxisName: 'Loss (₹)',
    isCurrency: true
  });

  // Chart 86: Projected Annualized Net Return
  const chart86Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>Projected Return: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: scenarios.map(s => s.scenario),
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: scenarios.map(s => {
        const val = s.projected_ann_net ?? s.projected_net_ann_return_pct ?? 0;
        return {
          value: val,
          itemStyle: {
            color: val >= 20 ? colors.emerald : val >= 10 ? colors.amber : colors.crimson,
            borderRadius: [4, 4, 0, 0]
          }
        };
      }),
      barMaxWidth: 38
    }]
  };

  // Chart 87: EDI vs EMI Loan Volume
  const chart87Option = buildBarOption({
    labels: repayTypes.map(r => r.cohort),
    series: [{
      name: 'Loans Count',
      data: repayTypes.map(r => r.loans),
      color: colors.indigo
    }],
    isDark,
    yAxisName: 'Loans'
  });

  // Chart 88: EDI vs EMI NPA Rate Comparison
  const chart88Option = buildBarOption({
    labels: repayTypes.map(r => r.cohort),
    series: [{
      name: 'Annualized NPA Rate (%)',
      data: repayTypes.map(r => r.ann_npa_pct),
      color: colors.crimson
    }],
    isDark,
    yAxisName: 'NPA Rate %',
    isPercent: true
  });

  // Chart 89: EDI vs EMI Annualized Net Return
  const chart89Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>Ann. Net Return: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: repayTypes.map(r => r.cohort),
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
      data: repayTypes.map(r => ({
        value: r.ann_net_pct,
        itemStyle: {
          color: r.ann_net_pct >= 0 ? colors.emerald : colors.crimson,
          borderRadius: r.ann_net_pct >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 48
    }]
  };

  // Chart 90: Active Book Health Doughnut (Dynamic count matching)
  const currentCount = dpdActive.find(d => d.cohort?.includes('Current'))?.loans ?? 0;
  const stage1Count = dpdActive.find(d => d.cohort?.includes('Stage 1'))?.loans ?? 0;
  const stage2Count = dpdActive.find(d => d.cohort?.includes('Stage 2'))?.loans ?? 0;
  const stage3Count = dpdActive.find(d => d.cohort?.includes('Stage 3'))?.loans ?? 0;

  const chart90Option = buildDonutOption({
    data: [
      { name: 'Current (0 DPD)', value: currentCount, itemStyle: { color: colors.emerald } },
      { name: 'Early Delinquent (1-30 DPD)', value: stage1Count, itemStyle: { color: colors.cyan } },
      { name: 'Mid Delinquent (31-60 DPD)', value: stage2Count, itemStyle: { color: colors.amber } },
      { name: 'Critical (61-90 DPD)', value: stage3Count, itemStyle: { color: colors.crimson } }
    ],
    isDark,
    centerTitle: 'Book Health'
  });

  // Chart 91: Roll Rate Transition Probability
  const chart91Option = buildLineOption({
    labels: ['0 to 30 DPD', '30 to 60 DPD', '60 to 90 DPD', '90 to NPA Write-off'],
    series: [{
      name: 'Roll Probability (%)',
      data: [3.2, 58.8, 50.0, 94.2],
      color: colors.amber,
      fill: true,
      areaColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(217, 119, 6, 0.12)'
    }],
    isDark,
    yAxisName: 'Probability %',
    isPercent: true
  });

  // Chart 92: Active Stage Platform Fee Drag
  const chart92Option = buildBarOption({
    labels: dpdActive.map(d => d.cohort),
    series: [{
      name: 'Platform Fee Collected (₹)',
      data: dpdActive.map(d => d.platform_fee),
      color: colors.cyan
    }],
    isDark,
    yAxisName: 'Fees (₹)',
    isCurrency: true
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Delinquency Surveillance & Active Book Staging (10 Charts)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Real-time DPD roll-rate mechanics, Stage 1/2/3 ECL loss provisions, and the empirical breakdown of Daily Repayment (EDI) vs Monthly (EMI). Powered by Apache ECharts.
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 83: Active Book Staging Distribution" subtitle="Performing active loans segmented by Days Past Due (DPD) buckets." option={chart83Option} />
        <ChartCard title="Chart 84: Active Disbursed Capital by Stage" subtitle="Capital volume exposed across current and early delinquent stages." option={chart84Option} />
        <ChartCard title="Chart 85: Projected NPA Loss by Scenario" subtitle="Stress testing the active portfolio under Base, Mild, and Severe delinquency spillover." option={chart85Option} />
        <ChartCard title="Chart 86: Projected Annualized Net Return Under Stress" subtitle="Estimated net return after absorbing projected ECL losses in each scenario." option={chart86Option} />
        <ChartCard title="Chart 87: EDI vs EMI Loan Origination Volume" subtitle="Comparison of total loans originated under Daily vs Monthly schedules." option={chart87Option} />
        <ChartCard title="Chart 88: Annualized NPA Rate: EDI vs EMI" subtitle="74.22% default rate for Daily (EDI) vs 14.04% for Monthly (EMI)." option={chart88Option} />
        <ChartCard title="Chart 89: Realized Net Annualized Return: EDI vs EMI" subtitle="Monthly EMI generated +14.71% net; Daily EDI caused catastrophic -73.19% net loss." option={chart89Option} />
        <ChartCard title="Chart 90: Active Book Health Doughnut" subtitle="Proportion of performing active loans vs early, mid, and late delinquencies." option={chart90Option} />
        <ChartCard title="Chart 91: Roll Rate Transition Probability Curve" subtitle="Probability of a loan deteriorating from one DPD stage to the next." option={chart91Option} />
        <ChartCard title="Chart 92: Active Stage Platform Fee Friction" subtitle="Cumulative platform charges collected on loans across each DPD stage." option={chart92Option} />
      </div>

      {/* Delinquency Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Delinquency Surveillance & Recovery Mandates (81 – 90)
        </h3>
        <div className="insights-grid">
          <InsightCard id={81} type="green" badge="BOOK QUALITY" title="95.4% Performing Book: Strong Core" body="Out of all active loans, 95.4% are Current (0 DPD), generating predictable monthly cashflow." metrics={[{ label: 'Current Book', value: '95.4%' }, { label: 'Current Count', value: String(currentCount) }, { label: 'Health', value: 'High' }]} directive="MANDATE: Continue prioritizing salary-linked borrowers." />
          <InsightCard id={82} type="red" badge="DAILY CATACLYSM" title="EDI Default Hazard: 74.2% Capital Loss" body="Daily installment collection creates severe cashflow friction for small merchants, driving catastrophic defaults." metrics={[{ label: 'EDI NPA Rate', value: '74.2%' }, { label: 'Loss Severity', value: '-73.2%' }, { label: 'Verdict', value: 'Toxic' }]} directive="MANDATE: Blacklist EDI permanently in filter presets." />
          <InsightCard id={83} type="yellow" badge="STAGE 2 SPILL" title="30-60 DPD Roll Risk: 58.8% Probability" body="Loans entering Stage 2 roll forward into Stage 3 over half the time. Early recovery intervention is crucial." metrics={[{ label: 'Stage 2 Count', value: String(stage2Count) }, { label: 'Roll Rate', value: '58.8%' }, { label: 'Risk', value: 'Moderate' }]} directive="MANDATE: Monitor Stage 2 closely for early settlement offers." />
          <InsightCard id={84} type="red" badge="TERMINAL STAGE 3" title="61-90 DPD Roll Risk: 94.2% to NPA" body="Once a loan crosses 60 DPD, the probability of complete NPA write-off reaches 94.2%." metrics={[{ label: 'Stage 3 Count', value: String(stage3Count) }, { label: 'Roll to NPA', value: '94.2%' }, { label: 'Recovery', value: '< 6%' }]} directive="MANDATE: Fully provision Stage 3 balances as expected credit loss." />
        </div>
      </div>
    </div>
  );
}
