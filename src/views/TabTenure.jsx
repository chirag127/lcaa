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

export default function TabTenure({ data, isDark = false }) {
  const tenureData = data?.tenure_resolved ?? [];
  const colors = getChartThemeColors(isDark);

  // Chart 33: Loan Count
  const chart33Option = buildBarOption({
    labels: tenureData.map(t => `${t.tenure}M`),
    series: [{
      name: 'Loans Funded',
      data: tenureData.map(t => t.loans),
      color: colors.cyan
    }],
    isDark,
    yAxisName: 'Loans'
  });

  // Chart 34: Disbursed
  const chart34Option = buildBarOption({
    labels: tenureData.map(t => `${t.tenure}M`),
    series: [{
      name: 'Disbursed Capital',
      data: tenureData.map(t => t.disbursed),
      color: colors.indigo
    }],
    isDark,
    yAxisName: 'Capital (₹)',
    isCurrency: true
  });

  // Chart 35: Net Profit
  const chart35Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Tenure</b><br/>Net Profit: <b>${formatINR(p[0].value)}</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureData.map(t => `${t.tenure}M`),
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: (v) => formatINR(v) },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: tenureData.map(t => ({
        value: t.net_profit,
        itemStyle: {
          color: t.net_profit >= 0 ? colors.emerald : colors.crimson,
          borderRadius: t.net_profit >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 38
    }]
  };

  // Chart 36: Ann Net Return
  const chart36Option = buildLineOption({
    labels: tenureData.map(t => `${t.tenure}M`),
    series: [{
      name: 'Annualized Net Return (%)',
      data: tenureData.map(t => t.ann_net_pct),
      color: colors.emerald,
      fill: true,
      areaColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.12)'
    }],
    isDark,
    yAxisName: 'Net Return %',
    isPercent: true
  });

  // Chart 37: Ann NPA Rate
  const chart37Option = buildLineOption({
    labels: tenureData.map(t => `${t.tenure}M`),
    series: [{
      name: 'Annualized NPA Rate (%)',
      data: tenureData.map(t => t.ann_npa_pct),
      color: colors.crimson,
      fill: true,
      areaColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.12)'
    }],
    isDark,
    yAxisName: 'NPA %',
    isPercent: true
  });

  // Chart 38: Raw vs Ann Return
  const chart38Option = buildBarOption({
    labels: tenureData.map(t => `${t.tenure}M`),
    series: [
      { name: 'Raw Return (%)', data: tenureData.map(t => t.tenure_net_pct), color: colors.indigo },
      { name: 'Annualized Return (%)', data: tenureData.map(t => t.ann_net_pct), color: colors.emerald }
    ],
    isDark,
    yAxisName: 'Return %',
    isPercent: true
  });

  // Chart 39: 2M vs 3M vs 4M Capital Velocity
  const chart39Option = buildBarOption({
    labels: ['2 Months', '3 Months', '4 Months', '5 Months', '6 Months', '12 Months'],
    series: [{
      name: 'Capital Turnover (Cycles/Year)',
      data: [6.0, 4.0, 3.0, 2.4, 2.0, 1.0],
      color: colors.cyan
    }],
    isDark,
    yAxisName: 'Cycles/Year'
  });

  // Chart 40: 12M Breakdown
  const chart40Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b>: <b>${formatINR(p[0].value)}</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Disbursed', 'Interest Received', 'Platform Fees', 'NPA Loss', 'Net Loss'],
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
      data: [67000, 7709, -4384, -10603, -7278].map(v => ({
        value: v,
        itemStyle: {
          color: v >= 0 ? (v > 20000 ? colors.cyan : colors.emerald) : colors.crimson,
          borderRadius: v >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 38
    }]
  };

  // Chart 41: Fee Friction by Tenure
  const chart41Option = buildBarOption({
    labels: tenureData.map(t => `${t.tenure}M`),
    series: [{
      name: 'Fee Share (% of Interest)',
      data: tenureData.map(t => Number(((t.platform_fee / Math.max(t.interest_received, 1)) * 100).toFixed(1))),
      color: colors.amber
    }],
    isDark,
    yAxisName: 'Fee %',
    isPercent: true
  });

  // Chart 42: Duration Weighted Return
  const chart42Option = buildBarOption({
    labels: tenureData.map(t => `${t.tenure}M`),
    series: [{
      name: 'Capital Velocity Multiplier',
      data: tenureData.map(t => Number((12 / t.tenure).toFixed(1))),
      color: colors.emerald
    }],
    isDark,
    yAxisName: 'Multiplier (x)'
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Tenure & Duration Alpha Analytics (10 Charts)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Empirical proof of the Golden Rules: 2M–4M velocity vs 6M drag and 12M capital destruction. Powered by Apache ECharts.
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 33: Loan Volume by Tenure Duration" subtitle="Exposure distribution across borrower repayment tenures." option={chart33Option} />
        <ChartCard title="Chart 34: Total Disbursed Capital by Tenure" subtitle="Rupee concentration: ₹15.8L concentrated in 3M & 4M loans." option={chart34Option} />
        <ChartCard title="Chart 35: Realized Net Profit by Tenure Cohort" subtitle="3M delivered ₹65.7k net profit; 12M destroyed ₹7.3k of principal." option={chart35Option} />
        <ChartCard title="Chart 36: Annualized Net Return by Duration" subtitle="2M (+27.4%) and 3M (+21.1%) generate superior compounding." option={chart36Option} />
        <ChartCard title="Chart 37: Annualized NPA Rate by Duration" subtitle="NPA rate spikes dramatically from 5.7% (2M) to 15.8% (12M)." option={chart37Option} />
        <ChartCard title="Chart 38: Raw Tenure Return vs Annualized Return" subtitle="Compounding multiplier effect: 2M raw 4.56% turns into 27.39% annualized." option={chart38Option} />
        <ChartCard title="Chart 39: Capital Recycling Turnover Velocity" subtitle="Annual reinvestment cycles: 2M turns 6x/year; 12M turns just 1x." option={chart39Option} />
        <ChartCard title="Chart 40: 12-Month Autopsy: Rupee P&L Breakdown" subtitle="Detailed breakdown showing why 12M loans lost ₹7,278 net." option={chart40Option} />
        <ChartCard title="Chart 41: Platform Fee Drag Friction by Tenure" subtitle="Platform charges as a percentage of gross interest earned." option={chart41Option} />
        <ChartCard title="Chart 42: Duration Weighted Velocity Multiplier" subtitle="Annualization compounding factor (12 / Tenure months)." option={chart42Option} />
      </div>

      {/* Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Tenure Strategic Directives (21 – 30)
        </h3>
        <div className="insights-grid">
          <InsightCard id={21} type="green" badge="THE GOLDEN TENURE" title="2-Month Velocity Outperformance (+27.39% Net)" body="2M loans are your premier compounding asset. With a 6.0x annual turnover and just 0.95% raw NPA, capital grows at an incredible +27.39% net annualized rate." metrics={[{ label: 'Disbursed', value: '₹1.61L' }, { label: 'Raw NPA', value: '0.95%' }, { label: 'Ann. Return', value: '+27.39%' }]} directive="MANDATE: Prioritize 2-Month tenures whenever available." />
          <InsightCard id={22} type="green" badge="WORKHORSE ALPHA" title="3-Month Volume Engine: ₹65.7k Net Profit" body="3M loans provided the absolute bulk of your portfolio profit, generating ₹65,716 net alpha across 1,176 loans with a robust +21.13% net return." metrics={[{ label: 'Disbursed', value: '₹8.86L' }, { label: 'Net Profit', value: '₹65.7k' }, { label: 'Ann. Return', value: '+21.13%' }]} directive="MANDATE: Treat 3-Month loans as primary portfolio workhorse." />
          <InsightCard id={23} type="red" badge="CAPITAL TRAP" title="12-Month Disaster: -10.79% Net Annualized Loss" body="12M loans destroyed capital. A 15.82% default rate with zero compounding multiplier (1.0x) generated a net loss of -10.79%." metrics={[{ label: 'Disbursed', value: '₹67.0k' }, { label: 'Loss', value: '-₹7.3k' }, { label: 'Ann. Return', value: '-10.79%' }]} directive="MANDATE: Ban 12-Month tenures completely." />
          <InsightCard id={24} type="yellow" badge="6-MONTH DRAG" title="6-Month Duration Hazard: Yield Crashes to +4.26%" body="6M loans saw default rates double to 7.95% raw (15.9% annualized), cutting net returns down to inflation levels (+4.26%)." metrics={[{ label: 'Disbursed', value: '₹7.54L' }, { label: 'Raw NPA', value: '7.95%' }, { label: 'Ann. Return', value: '+4.26%' }]} directive="MANDATE: Restrict 6-Month loans to <10% allocation." />
          <InsightCard id={25} type="green" badge="4-MONTH SWEET SPOT" title="4-Month Balance: +20.25% Net Annualized Yield" body="4M loans generated ₹34.5k net profit with a 3.0x turnover multiplier, delivering an optimal balance of duration and reinvestment frequency." metrics={[{ label: 'Disbursed', value: '₹6.97L' }, { label: 'Net Profit', value: '₹34.5k' }, { label: 'Ann. Return', value: '+20.25%' }]} directive="MANDATE: Allocate freely to 4-Month tenures." />
          <InsightCard id={26} type="info" badge="COMPOUNDING SPEED" title="The Math of Velocity: 6.0x vs 1.0x Compounding" body="A 2M loan returns capital 6 times a year, compounding principal and interest continuously. A 12M loan locks funds for 365 days." metrics={[{ label: '2M Cycles', value: '6x / yr' }, { label: '12M Cycles', value: '1x / yr' }, { label: 'Velocity Gap', value: '600%' }]} directive="MANDATE: Optimize for turnover speed over nominal loan tenure." />
          <InsightCard id={27} type="red" badge="COLLECTION RISK" title="Prolonged Borrower Distress in Long Tenures" body="Over 12 months, borrower circumstances change dramatically: job losses, medical emergencies, and macro distress cause defaults to surge." metrics={[{ label: '2M Defaults', value: '0.95%' }, { label: '12M Defaults', value: '15.82%' }, { label: 'Risk Surge', value: '16.6x' }]} directive="MANDATE: Minimize exposure time to borrower economic shocks." />
          <InsightCard id={28} type="yellow" badge="5-MONTH BOUNDARY" title="5-Month Performance: Acceptable +13.52% Yield" body="5M loans performed decently with +13.52% net return across ₹3.04L disbursed, serving as an acceptable boundary cohort." metrics={[{ label: 'Disbursed', value: '₹3.04L' }, { label: 'Raw NPA', value: '4.93%' }, { label: 'Ann. Return', value: '+13.52%' }]} directive="MANDATE: Fund 5M loans selectively when 2M–4M volume is low." />
          <InsightCard id={29} type="green" badge="REINVESTMENT FLOW" title="Monthly Liquidity Stream from Short Tenures" body="Short tenures create a torrent of monthly principal and interest returns, providing continuous liquidity to redeploy at higher rates." metrics={[{ label: 'Monthly Inflow', value: '₹1.8L+' }, { label: 'Liquidity', value: 'High' }, { label: 'Flexibility', value: 'Maximum' }]} directive="MANDATE: Reinvest daily repayment inflows automatically." />
          <InsightCard id={30} type="green" badge="PORTFOLIO POLICY" title="The 2M–4M Rule: Guaranteed Alpha Protection" body="Empirical backtest proves: eliminating 6M & 12M tenures lifts total portfolio ANR from +16.91% to +21.55%." metrics={[{ label: 'Current ANR', value: '16.91%' }, { label: 'Target ANR', value: '21.55%' }, { label: 'Alpha Boost', value: '+4.64%' }]} directive="MANDATE: Lock tenure filter to 2M, 3M, 4M permanently." />
        </div>
      </div>
    </div>
  );
}
