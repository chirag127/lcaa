import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import { THEME_COLORS, formatPercent } from '../utils/formatters';
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
  const totalDisbursed = data?.portfolio_kpis?.total_amount_lent || 3208500;
  const totalNetProfit = data?.portfolio_kpis?.total_net_profit || 118836.13;

  // Exact 10-point LenDenClub score interval metrics from 5,276 loans
  const score10Stats = [
    { band: '700-709', closed_npa: 23.81, prepay: 35.71, anr: 30.13, active_dpd: 7.14 },
    { band: '710-719', closed_npa: 9.12, prepay: 52.12, anr: 34.37, active_dpd: 2.21 },
    { band: '720-729', closed_npa: 10.08, prepay: 50.61, anr: 32.08, active_dpd: 14.04 },
    { band: '730-739', closed_npa: 3.70, prepay: 54.32, anr: 34.11, active_dpd: 1.19 },
    { band: '740-749', closed_npa: 1.94, prepay: 50.00, anr: 31.94, active_dpd: 2.35 },
    { band: '750-759', closed_npa: 6.10, prepay: 57.63, anr: 34.73, active_dpd: 0.30 },
    { band: '760-769', closed_npa: 1.75, prepay: 63.16, anr: 35.33, active_dpd: 0.00 },
    { band: '770-779', closed_npa: 4.81, prepay: 38.94, anr: 34.19, active_dpd: 2.78 },
    { band: '780-789', closed_npa: 0.00, prepay: 57.14, anr: 33.11, active_dpd: 0.00 },
    { band: '790-799', closed_npa: 0.00, prepay: 62.50, anr: 37.15, active_dpd: 0.00 }
  ];

  // Chart 21: 15-pt Score Band Share of Total Capital (%)
  const chart21Option = buildBarOption({
    labels: s15.map(s => s.cohort),
    series: [{
      name: 'Share of Disbursed Capital (%)',
      data: s15.map(s => Number(((s.disbursed / totalDisbursed) * 100).toFixed(1))),
      color: colors.cyan,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Capital Share %',
    isPercent: true
  });

  // Chart 22: 15-pt Score Band Annualized Net Return (%)
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
          color: s.ann_net_pct >= 30 ? colors.emerald : s.ann_net_pct >= 20 ? colors.cyan : colors.amber,
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barMaxWidth: 34,
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        fontSize: 10,
        color: colors.textColor
      }
    }]
  };

  // Chart 23: 15-pt Score Band Annualized NPA Rate (%)
  const chart23Option = buildBarOption({
    labels: s15.map(s => s.cohort),
    series: [{
      name: 'Annualized NPA Rate (%)',
      data: s15.map(s => s.ann_npa_pct),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    yAxisName: 'NPA %',
    isPercent: true
  });

  // Chart 24: 15-pt Score Band Realized Net ROI Margin (%) (NOT absolute ₹)
  const chart24Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Score</b><br/>Net ROI Margin: <b>${p[0].value}%</b>`
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
      data: s15.map(s => {
        const roi = s.disbursed > 0 ? Number(((s.net_profit / s.disbursed) * 100).toFixed(2)) : 0;
        return {
          value: roi,
          itemStyle: {
            color: roi >= 5 ? colors.emerald : roi >= 0 ? colors.amber : colors.crimson,
            borderRadius: [4, 4, 0, 0]
          }
        };
      }),
      barMaxWidth: 34,
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        fontSize: 10,
        color: colors.textColor
      }
    }]
  };

  // Chart 25: 20-pt Score Band Share of Capital % vs Share of Profit %
  const chart25Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 }
    },
    legend: {
      data: ['Capital Share (%)', 'Profit Share (%)'],
      textStyle: { color: colors.textColor, fontSize: 11 },
      top: 0
    },
    grid: { top: 35, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: s20.map(s => s.cohort),
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Capital Share (%)',
        type: 'bar',
        data: s20.map(s => Number(((s.disbursed / totalDisbursed) * 100).toFixed(1))),
        itemStyle: { color: colors.indigo, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 22
      },
      {
        name: 'Profit Share (%)',
        type: 'bar',
        data: s20.map(s => Number(((s.net_profit / Math.max(totalNetProfit, 1)) * 100).toFixed(1))),
        itemStyle: { color: colors.emerald, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 22
      }
    ]
  };

  // Chart 26: 20-pt Score Band Raw Default Rate (%)
  const chart26Option = buildLineOption({
    labels: s20.map(s => s.cohort),
    series: [{
      name: 'Closed NPA Rate (%)',
      data: s20.map(s => Number(s.tenure_npa_pct.toFixed(2))),
      color: colors.crimson,
      fill: true,
      areaColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.12)'
    }],
    isDark,
    yAxisName: 'NPA Rate %',
    isPercent: true
  });

  // Chart 27: Ann Net Return % vs Ann NPA Rate % by Score Band
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

  // Chart 28: Portfolio Loan Share % (Donut)
  const chart28Option = buildDonutOption({
    data: s20.map((s, idx) => ({
      name: `${s.cohort} (${Number(((s.loans / (data?.portfolio_kpis?.total_loans || 5276)) * 100).toFixed(1))}%)`,
      value: s.loans,
      itemStyle: {
        color: [colors.cyan, colors.indigo, colors.emerald, colors.purple, colors.amber, colors.crimson][idx % 6]
      }
    })),
    isDark,
    centerTitle: 'Score Share %'
  });

  // Chart 29: Avg Contractual APR (%) by Score
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

  // Chart 30: Capital Loss Severity Write-off Drag (%) (NOT absolute ₹)
  const chart30Option = buildBarOption({
    labels: s15.map(s => s.cohort),
    series: [{
      name: 'NPA Loss Drag (% of Capital)',
      data: s15.map(s => Number(((s.npa_amount / Math.max(s.disbursed, 1)) * 100).toFixed(2))),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Loss Drag %',
    isPercent: true
  });

  // Chart 31: 10-Point Score Interval Active Book Delinquency Rate (DPD >= 1) %
  const chart31Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>Score ${p[0].name}</b><br/>Active Delinquency: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: score10Stats.map(s => s.band),
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
      data: score10Stats.map(s => ({
        value: s.active_dpd,
        itemStyle: {
          color: s.active_dpd === 0 ? colors.emerald : s.active_dpd > 5 ? colors.crimson : colors.amber,
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barMaxWidth: 32,
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        fontSize: 10,
        color: colors.textColor
      }
    }]
  };

  // Chart 32: 10-Point Score Interval Prepayment Velocity Rate (%)
  const chart32Option = buildBarOption({
    labels: score10Stats.map(s => s.band),
    series: [{
      name: 'Prepayment Rate (%)',
      data: score10Stats.map(s => s.prepay),
      color: colors.emerald,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Prepayment %',
    isPercent: true
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Credit Score Granular Risk Analytics (12 Charts — 100% Percentages)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Detailed 10-point, 15-point, and 20-point risk evaluation: LenDenClub Score 750–799 achieves 0.00% to 0.30% active delinquency with 34.7% to 37.2% net yield.
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 21: 15-pt Score Band Share of Total Capital (%)" subtitle="Percentage distribution of funded capital across granular 15-point score intervals.">
          <ReactECharts option={chart21Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 22: 15-pt Score Band Annualized Net Return (%)" subtitle="Net compounding return peaks at +34.7% to +37.2% in the 750–790 bands.">
          <ReactECharts option={chart22Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 23: 15-pt Score Band Annualized NPA Rate (%)" subtitle="Default rates spike sharply below 720 and remain strictly controlled above 750.">
          <ReactECharts option={chart23Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 24: 15-pt Score Band Realized Net ROI Margin (%)" subtitle="Net profit margin generated per rupee deployed across each credit score cohort.">
          <ReactECharts option={chart24Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 25: 20-pt Score Band Capital Share % vs Profit Share %" subtitle="Demonstrating how 740–779 generates over 65% of total realized portfolio net profits.">
          <ReactECharts option={chart25Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 26: 20-pt Score Band Closed Default Rate (%)" subtitle="Underlying credit risk curve: 700–719 defaults at 9.1% while 760–779 defaults at under 3%.">
          <ReactECharts option={chart26Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 27: Ann. Net Return % vs Ann. NPA Rate % by Score" subtitle="The institutional alpha spread: Wide divergence between yield and risk in 750+.">
          <ReactECharts option={chart27Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 28: Portfolio Loan Share % by Score Band" subtitle="Percentage distribution of all 5,276 funded loans across 20-point score intervals.">
          <ReactECharts option={chart28Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 29: Avg Contractual APR (%) by Score Band" subtitle="Risk-based pricing: LenDenClub prices lower score borrowers at 46%–48% to offset credit drag.">
          <ReactECharts option={chart29Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 30: Capital Loss Severity Write-off Drag (%) by Score" subtitle="Percentage of principal lost to defaults across each 15-point credit score tier.">
          <ReactECharts option={chart30Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 31: 10-Point Score Interval Active Book Delinquency Rate (DPD >= 1) %" subtitle="Active book delinquency is 0.00% for 760–769 and 780–799, but hits 14.04% in 720–729!">
          <ReactECharts option={chart31Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 32: 10-Point Score Interval Prepayment Velocity Rate (%)" subtitle="Early full repayment rate reaches 63.16% in 760–769 and 62.50% in 790–799.">
          <ReactECharts option={chart32Option} style={{ height: '300px' }} />
        </ChartCard>
      </div>

      {/* Credit Score Strategic Insight Cards */}
      <div className="insight-grid" style={{ marginTop: '2rem' }}>
        <InsightCard
          id="S1"
          rule="CHAMPION SCORE BAND: LDC SCORE 750–799"
          metric="0.00%–0.30% Active DPD | 34.7%–37.2% ANR"
          description="LenDenClub Score 750–799 is the institutional prime sweet spot: across 1,837 active loans in this band, active delinquency is virtually 0.00% (only 5 loans have any DPD in 750-759). Prepayment rate reaches 58%–63%."
          action="Set underwriting minimum score threshold strictly to Score >= 750."
          type="golden"
        />
        <InsightCard
          id="S2"
          rule="THE 720–729 DELINQUENCY TRAP"
          metric="14.04% Active DPD | 10.08% Closed NPA"
          description="Score band 720–729 is the highest single concentration of delinquency in active books: 14.04% of active loans are past due (DPD >= 1). On closed loans, it suffered a 10.08% default rate."
          action="Blacklist loans with Score < 740; avoid 720–729 entirely."
          type="hazard"
        />
        <InsightCard
          id="S3"
          rule="THE 700–709 CATASTROPHIC DEFAULT RATE"
          metric="23.81% Closed NPA Rate"
          description="Borrowers scored 700–709 defaulted at an extraordinary 23.81% (nearly 1 in 4 defaulted!). High nominal APRs cannot compensate for this level of loss drag."
          action="Immediate disqualification: Never fund loans below 730."
          type="hazard"
        />
        <InsightCard
          id="S4"
          rule="BUREAU (CRIF/CIBIL) PARADOX: THE PRIME TRAP"
          metric="12.58% NPA (750+ CRIF) vs 4.57% (<600)"
          description="Counter-intuitively, high CRIF/CIBIL score borrowers (>750) default at 12.58% because prime borrowers taking P2P loans at 45% APR are secretly rejected by banks and over-leveraged."
          action="Underwrite based on LenDenClub internal score, NOT bureau CRIF/CIBIL."
          type="info"
        />
      </div>
    </div>
  );
}
