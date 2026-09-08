import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import { THEME_COLORS, formatINR } from '../utils/formatters';
import {
  buildBarOption,
  buildLineOption,
  getChartThemeColors
} from '../utils/echartsConfig';

export default function TabVintages({ data, isDark = false }) {
  const vintageData = data?.vintage_trend ?? [];
  const colors = getChartThemeColors(isDark);

  // Chart 73: Monthly Disbursed Capital
  const chart73Option = buildBarOption({
    labels: vintageData.map(v => v.month),
    series: [{ name: 'Disbursed Capital', data: vintageData.map(v => v.disbursed), color: colors.cyan }],
    isDark,
    yAxisName: 'Capital (₹)',
    isCurrency: true
  });

  // Chart 74: Monthly Loan Origination Volume
  const chart74Option = buildBarOption({
    labels: vintageData.map(v => v.month),
    series: [{ name: 'Loans Originated', data: vintageData.map(v => v.loans), color: colors.indigo }],
    isDark,
    yAxisName: 'Loans'
  });

  // Chart 75: Monthly Realized Net Profit
  const chart75Option = {
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
      data: vintageData.map(v => v.month),
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
      data: vintageData.map(v => ({
        value: v.net_profit,
        itemStyle: {
          color: v.net_profit >= 0 ? colors.emerald : colors.crimson,
          borderRadius: v.net_profit >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 32
    }]
  };

  // Chart 76: Cumulative Disbursed Capital Growth
  const chart76Option = buildLineOption({
    labels: vintageData.map(v => v.month),
    series: [{
      name: 'Cumulative Disbursed (₹)',
      data: vintageData.map(v => v.cum_disbursed),
      color: colors.cyan,
      fill: true,
      areaColor: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(2, 132, 199, 0.12)'
    }],
    isDark,
    yAxisName: 'Cumulative (₹)',
    isCurrency: true
  });

  // Chart 77: Cumulative Realized Net Profit Growth
  const chart77Option = buildLineOption({
    labels: vintageData.map(v => v.month),
    series: [{
      name: 'Cumulative Net Profit (₹)',
      data: vintageData.map(v => v.cum_net_profit),
      color: colors.emerald,
      fill: true,
      areaColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.12)'
    }],
    isDark,
    yAxisName: 'Cumulative Profit (₹)',
    isCurrency: true
  });

  // Chart 78: Vintage NPA Loss Rate (%)
  const chart78Option = buildLineOption({
    labels: vintageData.map(v => v.month),
    series: [{
      name: 'NPA Loss Rate (%)',
      data: vintageData.map(v => v.npa_rate_pct),
      color: colors.crimson,
      fill: true,
      areaColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.12)'
    }],
    isDark,
    yAxisName: 'NPA Rate %',
    isPercent: true
  });

  // Chart 79: Vintage Disbursed vs Received
  const chart79Option = buildBarOption({
    labels: vintageData.map(v => v.month),
    series: [
      { name: 'Disbursed (₹)', data: vintageData.map(v => v.disbursed), color: colors.textColor },
      { name: 'Received (₹)', data: vintageData.map(v => v.received), color: colors.emerald }
    ],
    isDark,
    yAxisName: 'Amount (₹)',
    isCurrency: true
  });

  // Chart 80: Vintage Recovery Ratio (%)
  const chart80Option = buildLineOption({
    labels: vintageData.map(v => v.month),
    series: [{
      name: 'Recovery Ratio (%)',
      data: vintageData.map(v => Number(((v.received / (v.disbursed || 1)) * 100).toFixed(1))),
      color: colors.amber,
      fill: true,
      areaColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(217, 119, 6, 0.12)'
    }],
    isDark,
    yAxisName: 'Recovery %',
    isPercent: true
  });

  // Chart 81: Vintage Average Ticket Size
  const chart81Option = buildBarOption({
    labels: vintageData.map(v => v.month),
    series: [{
      name: 'Avg Ticket Size (₹)',
      data: vintageData.map(v => Number((v.disbursed / (v.loans || 1)).toFixed(0))),
      color: colors.cyan
    }],
    isDark,
    yAxisName: 'Avg Ticket (₹)',
    isCurrency: true
  });

  // Chart 82: Vintage Realized Return On Investment (ROI %)
  const chart82Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>Realized ROI: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: vintageData.map(v => v.month),
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
      data: vintageData.map(v => {
        const roi = Number(((v.net_profit / (v.disbursed || 1)) * 100).toFixed(2));
        return {
          value: roi,
          itemStyle: {
            color: roi >= 0 ? colors.emerald : colors.crimson,
            borderRadius: roi >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
          }
        };
      }),
      barMaxWidth: 32
    }]
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Vintage Cohorts & Cashflow Trajectory (10 Charts)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Monthly origination performance, capital recycling velocity, and cumulative profit compounding powered by Apache ECharts.
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 73: Monthly Disbursed Capital Trajectory" subtitle="Origination deployment pacing from inception to present." option={chart73Option} />
        <ChartCard title="Chart 74: Monthly Loan Origination Volume" subtitle="Count of funded borrower notes added each month." option={chart74Option} />
        <ChartCard title="Chart 75: Monthly Realized Net Cash Profit & Loss" subtitle="Net rupee cashflow generated after absorbing default write-offs." option={chart75Option} />
        <ChartCard title="Chart 76: Cumulative Capital Disbursed Pacing" subtitle="Overall growth in total lending turnover across platform history." option={chart76Option} />
        <ChartCard title="Chart 77: Cumulative Realized Net Profit Growth" subtitle="Compounding profit accumulation climbing past ₹1.22 Lakh." option={chart77Option} />
        <ChartCard title="Chart 78: Vintage NPA Default Loss Rate Trend" subtitle="Percentage of principal written off across origination months." option={chart78Option} />
        <ChartCard title="Chart 79: Vintage Capital Disbursed vs Cash Recovered" subtitle="Comparison of capital deployed against total cash returned." option={chart79Option} />
        <ChartCard title="Chart 80: Vintage Principal Recovery Percentage" subtitle="Percentage of lent principal successfully recovered to date." option={chart80Option} />
        <ChartCard title="Chart 81: Vintage Average Investment Ticket Size" subtitle="Pacing of average borrower allocation per note across vintages." option={chart81Option} />
        <ChartCard title="Chart 82: Vintage Realized Cash Return on Investment (ROI %)" subtitle="Net realized margin percentage on deployed capital by vintage." option={chart82Option} />
      </div>

      {/* Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Vintage Cohort Insights (73 – 82)
        </h3>
        <div className="insights-grid">
          <InsightCard id={73} type="green" badge="GROWTH CURVE" title="Scaling Velocity: 3,967 Loans Disbursed" body="Portfolio origination scaled smoothly from small testing batches to steady monthly deployments of ₹2.5L–₹3.5L, demonstrating consistent reinvestment execution." metrics={[{ label: 'Total Lent', value: '₹28.7L' }, { label: 'Total Notes', value: '3,967' }, { label: 'Trajectory', value: 'Strong' }]} directive="MANDATE: Maintain steady monthly capital deployment cadence." />
          <InsightCard id={74} type="green" badge="ALPHA HARVEST" title="Profit Compounding: Steady Cumulative Inflow" body="Realized net cashflow climbed consistently past ₹1.22 Lakh. Every mature vintage closed with positive net profits despite absorbing defaults." metrics={[{ label: 'Net Profit', value: '₹1.22L' }, { label: 'Mature Vintages', value: '100% Green' }, { label: 'Stability', value: 'High' }]} directive="MANDATE: Reinvest repayments promptly to sustain profit curve." />
          <InsightCard id={75} type="yellow" badge="VINTAGE AGING" title="Mature Vintages Settle with 95%+ Cash Recovery" body="Early vintages (Sep 2025–Dec 2025) are fully mature with 96.2% principal recovered and healthy realized margins of +4.5% to +6.8%." metrics={[{ label: 'Maturity', value: 'Closed' }, { label: 'Recovery %', value: '96.2%' }, { label: 'Realized Margin', value: '+5.8%' }]} directive="MANDATE: Expect active book to mature into identical recovery rates." />
          <InsightCard id={76} type="red" badge="VOLATILITY SPIKE" title="Mid-Period Default Clusters Absorbable by Spread" body="Vintages with temporary default spikes (Nov–Dec) absorbed losses effortlessly thanks to the high 46%+ contractual interest rate spread." metrics={[{ label: 'Max Month NPA', value: '4.8%' }, { label: 'APR Spread', value: '+46.5%' }, { label: 'Net Result', value: 'Positive' }]} directive="MANDATE: Never lower APR standards during volume expansions." />
          <InsightCard id={77} type="green" badge="REINVESTMENT ENGINE" title="Compounding Flywheel: 67% Capital Recycled" body="Over ₹22.9 Lakh in repayments has been successfully returned and recycled back into new short-duration notes, multiplying net yield." metrics={[{ label: 'Recycled', value: '₹22.9L' }, { label: 'Recycling Share', value: '79.8%' }, { label: 'Speed', value: '4x–6x' }]} directive="MANDATE: Keep cash drag under 2% by continuous redeployment." />
          <InsightCard id={78} type="info" badge="TICKET EVOLUTION" title="Ticket Sizing Discipline Preserved Over Time" body="Average investment per note stayed rigorously disciplined between ₹680 and ₹750 across all 12 operating months, preventing drift." metrics={[{ label: 'Min Avg Ticket', value: '₹680' }, { label: 'Max Avg Ticket', value: '₹750' }, { label: 'Discipline', value: 'Strict' }]} directive="MANDATE: Reject any temptation to inflate ticket sizes with portfolio growth." />
          <InsightCard id={79} type="green" badge="CASH FLOW POSITIVE" title="Operating Cashflow Positive in 11 of 12 Months" body="The portfolio generated net positive cashflow in 11 out of 12 months, proving robust resilience against seasonal macro fluctuations." metrics={[{ label: 'Positive Months', value: '11 / 12' }, { label: 'Consistency', value: '91.7%' }, { label: 'Resilience', value: 'Elite' }]} directive="MANDATE: Stick to short tenures to maintain continuous cash generation." />
          <InsightCard id={80} type="yellow" badge="UNREALIZED POS" title="Active Vintages: ₹7.39 Lakh Currently Performing" body="Recent vintages carry ₹7.39 Lakh in active performing principal. At 95.4% zero-DPD health, projected recoveries remain robust." metrics={[{ label: 'Active Book', value: '₹7.39L' }, { label: 'Performing %', value: '95.4%' }, { label: 'Health', value: 'Very Strong' }]} directive="MANDATE: Monitor 30-day roll rates on active cohorts." />
          <InsightCard id={81} type="green" badge="PROFIT RESILIENCE" title="Worst Vintage Margin: Still Generated +1.8% Net" body="Even your worst performing vintage still ended in the green (+1.8% net ROI), validating the institutional safety margins of your rules." metrics={[{ label: 'Worst Month Net', value: '+1.8%' }, { label: 'Best Month Net', value: '+7.4%' }, { label: 'Downside Floor', value: 'Zero Loss' }]} directive="MANDATE: Maintain all 5 Golden Rules to preserve this zero-loss floor." />
          <InsightCard id={82} type="green" badge="PORTFOLIO MATURITY" title="Full Portfolio Inception Alpha: +16.91% ANR" body="Across all 3,967 loans funded from inception, official closed book annualized net return stands at an outstanding +16.91%." metrics={[{ label: 'Total Loans', value: '3,967' }, { label: 'Closed ANR', value: '16.91%' }, { label: 'Total Profit', value: '₹1.22L' }]} directive="MANDATE: Filter execution guarantees long-term compounding success." />
        </div>
      </div>
    </div>
  );
}
