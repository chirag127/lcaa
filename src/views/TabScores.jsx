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

export default function TabScores({ data, isDark = false }) {
  const s15 = data?.score_15_resolved ?? [];
  const s20 = data?.score_20_resolved ?? [];
  const colors = getChartThemeColors(isDark);

  // Chart 21: 15-pt Disbursed
  const chart21Option = buildBarOption({
    labels: s15.map(s => s.cohort),
    series: [{ name: 'Disbursed Capital', data: s15.map(s => s.disbursed), color: colors.cyan }],
    isDark,
    yAxisName: 'Capital (₹)',
    isCurrency: true
  });

  // Chart 22: 15-pt Ann Return
  const chart22Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Score</b><br/>Ann. Return: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: s15.map(s => s.cohort),
      axisLabel: { color: colors.textColor, fontSize: 10, rotate: 20 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: s15.map(s => ({
        value: s.ann_net_pct,
        itemStyle: {
          color: s.ann_net_pct >= 20 ? colors.emerald : s.ann_net_pct >= 0 ? colors.amber : colors.crimson,
          borderRadius: s.ann_net_pct >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 34
    }]
  };

  // Chart 23: 15-pt Ann NPA
  const chart23Option = buildBarOption({
    labels: s15.map(s => s.cohort),
    series: [{ name: 'Ann. NPA Rate (%)', data: s15.map(s => s.ann_npa_pct), color: colors.crimson }],
    isDark,
    yAxisName: 'NPA %',
    isPercent: true
  });

  // Chart 24: 15-pt Net Profit
  const chart24Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Score</b><br/>Net Profit: <b>${formatINR(p[0].value)}</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: s15.map(s => s.cohort),
      axisLabel: { color: colors.textColor, fontSize: 10, rotate: 20 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: (v) => formatINR(v) },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: s15.map(s => ({
        value: s.net_profit,
        itemStyle: {
          color: s.net_profit >= 0 ? colors.emerald : colors.crimson,
          borderRadius: s.net_profit >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 34
    }]
  };

  // Chart 25: 20-pt Disbursed vs Profit
  const chart25Option = buildBarOption({
    labels: s20.map(s => s.cohort),
    series: [
      { name: 'Disbursed (₹)', data: s20.map(s => s.disbursed), color: colors.indigo },
      { name: 'Net Profit (₹)', data: s20.map(s => s.net_profit), color: colors.emerald }
    ],
    isDark,
    yAxisName: 'Amount (₹)',
    isCurrency: true
  });

  // Chart 26: 20-pt Cumulative Default Curve
  const chart26Option = buildLineOption({
    labels: s20.map(s => s.cohort),
    series: [{
      name: 'Raw NPA Rate (%)',
      data: s20.map(s => s.tenure_npa_pct),
      color: colors.crimson,
      fill: true,
      areaColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.12)'
    }],
    isDark,
    yAxisName: 'Raw NPA %',
    isPercent: true
  });

  // Chart 27: Return vs NPA by Score
  const chart27Option = buildLineOption({
    labels: s20.map(s => s.cohort),
    series: [
      { name: 'Ann. Net Return (%)', data: s20.map(s => s.ann_net_pct), color: colors.emerald, fill: false },
      { name: 'Ann. NPA Rate (%)', data: s20.map(s => s.ann_npa_pct), color: colors.crimson, fill: false }
    ],
    isDark,
    yAxisName: 'Rate %',
    isPercent: true
  });

  // Chart 28: Loan Count by Score Band (Donut)
  const chart28Option = buildDonutOption({
    data: s20.map((s, idx) => ({
      name: s.cohort,
      value: s.loans,
      itemStyle: {
        color: [colors.cyan, colors.indigo, colors.emerald, colors.purple, colors.amber, colors.crimson][idx % 6]
      }
    })),
    isDark,
    centerTitle: 'Score Band'
  });

  // Chart 29: Contractual APR by 15-pt Score
  const chart29Option = buildLineOption({
    labels: s15.map(s => s.cohort),
    series: [{
      name: 'Avg Contractual APR (%)',
      data: s15.map(s => s.avg_apr),
      color: colors.amber,
      fill: false
    }],
    isDark,
    yAxisName: 'APR %',
    isPercent: true
  });

  // Chart 30: Total NPA Write-off by Score Band
  const chart30Option = buildBarOption({
    labels: s15.map(s => s.cohort),
    series: [{ name: 'NPA Amount (₹)', data: s15.map(s => s.npa_amount), color: colors.crimson }],
    isDark,
    yAxisName: 'NPA (₹)',
    isCurrency: true
  });

  // Chart 31: Score Efficiency Ratio
  const chart31Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Score</b><br/>Efficiency Ratio: <b>${p[0].value}x</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: s15.map(s => s.cohort),
      axisLabel: { color: colors.textColor, fontSize: 10, rotate: 20 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: '{value}x' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: s15.map(s => {
        const ratio = s.ann_npa_pct > 0 ? (s.ann_net_pct / s.ann_npa_pct) : s.ann_net_pct > 0 ? 5.0 : 0;
        return {
          value: Number(ratio.toFixed(2)),
          itemStyle: {
            color: ratio >= 1.5 ? colors.emerald : colors.amber,
            borderRadius: [4, 4, 0, 0]
          }
        };
      }),
      barMaxWidth: 34
    }]
  };

  // Chart 32: Principal Recovery Rate % by Score
  const chart32Option = buildLineOption({
    labels: s20.map(s => s.cohort),
    series: [{
      name: 'Recovery Rate (%)',
      data: s20.map(s => Number(((s.principal_received / s.disbursed) * 100).toFixed(1))),
      color: colors.emerald,
      fill: true,
      areaColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.12)'
    }],
    isDark,
    yAxisName: 'Recovery %',
    isPercent: true
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Credit Score Granular Risk Analysis (12 Charts)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Detailed 15-point and 20-point credit score band cohort performance and yield optimization powered by Apache ECharts.
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 21: Capital Deployed by 15-pt Score Band" subtitle="Capital allocation across fine-grained 15-point score intervals." option={chart21Option} />
        <ChartCard title="Chart 22: Annualized Net Return by 15-pt Score Band" subtitle="745-759 (+30.3%) and 760-774 (+21.3%) form your peak alpha corridor." option={chart22Option} />
        <ChartCard title="Chart 23: Annualized NPA Rate by 15-pt Score Band" subtitle="790-804 defaults spiked to 25.1% due to high-score duration traps." option={chart23Option} />
        <ChartCard title="Chart 24: Realized Net Profit by 15-pt Score Band" subtitle="745-759 generated ₹35.3k profit alone, leading the entire portfolio." option={chart24Option} />
        <ChartCard title="Chart 25: Capital vs Net Profit by 20-pt Band" subtitle="Compare deployed capital against total realized net rupee profit." option={chart25Option} />
        <ChartCard title="Chart 26: Raw NPA Default Curve Across 20-pt Cohorts" subtitle="Default frequency as a percentage of total cohort loans." option={chart26Option} />
        <ChartCard title="Chart 27: Net Return vs NPA Rate Divergence" subtitle="The critical intersection: net margin remains positive across major bands." option={chart27Option} />
        <ChartCard title="Chart 28: Total Loan Count Distribution by Score" subtitle="Portfolio borrower volume breakdown across credit score tiers." option={chart28Option} />
        <ChartCard title="Chart 29: Average Contractual APR by Score Tier" subtitle="Pricing discipline: how marketplace borrowers are priced across score tiers." option={chart29Option} />
        <ChartCard title="Chart 30: Total NPA Rupee Write-off by Score Band" subtitle="Rupee magnitude of defaults across credit cohorts." option={chart30Option} />
        <ChartCard title="Chart 31: Score Efficiency Ratio (Return / NPA)" subtitle="Risk-adjusted alpha multiplier: highest in 745-774 bands." option={chart31Option} />
        <ChartCard title="Chart 32: Principal Recovery Rate by Score Tier" subtitle="Percentage of lent principal successfully recovered to date." option={chart32Option} />
      </div>

      {/* Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Credit Score Strategic Insights (11 – 20)
        </h3>
        <div className="insights-grid">
          <InsightCard id={11} type="green" badge="SWEET SPOT" title="Score Band 745–774: Your Core Alpha Engine" body="The 745–774 band delivered ₹54.4k net profit with +21.3% to +30.3% net annualized return. This is your primary portfolio engine." metrics={[{ label: 'Net Profit', value: '₹54.4k' }, { label: 'Min Return', value: '+21.3%' }, { label: 'Max Return', value: '+30.3%' }]} directive="MANDATE: Channel at least 65% of all reinvestment capital into 745–774." />
          <InsightCard id={12} type="red" badge="PARADOX TRAP" title="High Score Anomaly: 790–804 Disaster (-7.25% Net)" body="Borrowers with 790–804 scores suffered a 25.07% annualized NPA rate, resulting in -7.25% net annualized return due to long tenures." metrics={[{ label: 'Disbursed', value: '₹2.12L' }, { label: 'Ann. NPA', value: '25.07%' }, { label: 'Net Return', value: '-7.25%' }]} directive="MANDATE: Do not blindly trust 790+ scores; enforce strict tenure limits." />
          <InsightCard id={13} type="green" badge="745-759 PEAK" title="745–759 Band: Outstanding +30.3% Net Yield" body="This single cohort generated ₹35,321 net profit with just 1.76% raw default rate, outperforming all other tiers by a massive margin." metrics={[{ label: 'Disbursed', value: '₹5.58L' }, { label: 'Raw NPA', value: '1.76%' }, { label: 'Ann. Return', value: '+30.29%' }]} directive="MANDATE: Treat 745–759 as highest priority auto-invest target." />
          <InsightCard id={14} type="yellow" badge="715-729 FLOOR" title="715–729 Band: Marginal Profitability (+5.14%)" body="While generating ₹2.2k net profit, high 5.86% raw NPA pulled net annualized returns down to +5.14%." metrics={[{ label: 'Disbursed', value: '₹2.20L' }, { label: 'Raw NPA', value: '5.86%' }, { label: 'Ann. Return', value: '+5.14%' }]} directive="MANDATE: Require APR ≥ 46% when funding borrowers below score 730." />
          <InsightCard id={15} type="info" badge="CONCENTRATION" title="Capital Concentration: 740–779 Holds 61% Exposure" body="61% of total portfolio capital is concentrated in 740–779. This disciplined focus is why the overall portfolio remains highly profitable." metrics={[{ label: 'Allocated', value: '₹17.5L' }, { label: 'Share', value: '61.0%' }, { label: 'Health', value: 'Optimal' }]} directive="MANDATE: Maintain concentration discipline in proven safe bands." />
          <InsightCard id={16} type="green" badge="RECOVERY RATIO" title="745–759 Principal Recovery: 97.4% High" body="The 745–759 band recovered 97.4% of all disbursed principal, leaving negligible uncollectable write-offs." metrics={[{ label: 'Disbursed', value: '₹5.58L' }, { label: 'Recovered', value: '₹5.44L' }, { label: 'Recovery', value: '97.4%' }]} directive="MANDATE: Reinvest principal repayments immediately upon receipt." />
          <InsightCard id={17} type="red" badge="TENURE OVERRIDE" title="Duration Risk Overrides Credit Score Advantage" body="Even high-score borrowers (780+) defaulted when placed in 12M loans. Score does not protect against prolonged borrower economic distress." metrics={[{ label: 'Rule', value: 'Tenure > Score' }, { label: 'Max Safe Tenure', value: '4 Months' }, { label: 'Hazard', value: '12M Loans' }]} directive="MANDATE: Never grant tenure >4M regardless of credit score." />
          <InsightCard id={18} type="green" badge="EFFICIENCY PEAK" title="Risk Efficiency Ratio Peaks at 4.2x in 745–759" body="For every rupee lost to defaults in 745–759, the portfolio generated 4.2 rupees of net interest income." metrics={[{ label: 'Efficiency', value: '4.2x' }, { label: 'Interest', value: '₹47.2k' }, { label: 'Write-off', value: '₹11.2k' }]} directive="MANDATE: Maximize capital allocation to high efficiency ratio bands." />
          <InsightCard id={19} type="yellow" badge="730-744 PROFILE" title="730–744 Transition Band: Solid +16.8% Return" body="This transition band provides substantial loan volume with good +16.8% net return, acting as a viable capacity expansion tier." metrics={[{ label: 'Disbursed', value: '₹4.82L' }, { label: 'Raw NPA', value: '3.42%' }, { label: 'Ann. Return', value: '+16.84%' }]} directive="MANDATE: Include 730–744 when 745+ volume is constrained." />
          <InsightCard id={20} type="green" badge="PORTFOLIO DEFENSE" title="Strategic Takeaway: Strict Underwriting Barrier" body="Setting a hard floor at score 740 and ceiling at tenure 4M cuts portfolio default rate by 68% while preserving 92% of alpha." metrics={[{ label: 'Default Cut', value: '-68%' }, { label: 'Alpha Kept', value: '92%' }, { label: 'Target ANR', value: '> 22%' }]} directive="MANDATE: Codify Score ≥ 740 + Tenure ≤ 4M as non-negotiable policy." />
        </div>
      </div>
    </div>
  );
}
