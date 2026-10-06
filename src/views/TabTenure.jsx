import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import { THEME_COLORS, formatPercent } from '../utils/formatters';
import {
  buildBarOption,
  buildLineOption,
  getChartThemeColors
} from '../utils/echartsConfig';

export default function TabTenure({ data, isDark = false }) {
  const tenureData = data?.tenure_resolved ?? [];
  const colors = getChartThemeColors(isDark);
  const totalLoans = data?.portfolio_kpis?.total_loans || 5276;
  const totalDisbursed = data?.portfolio_kpis?.total_amount_lent || 3208500;

  // Prepayment and NPA rate maps by tenure from the 5,276 dataset
  const prepayRateMap = { 2: 52.57, 3: 69.08, 4: 50.05, 5: 51.76, 6: 36.85, 12: 0.0 };
  const closedNpaMap = { 2: 0.91, 3: 5.76, 4: 6.96, 5: 6.53, 6: 16.92, 12: 20.69 };
  const activeDpdMap = { 2: 0.27, 3: 0.40, 4: 0.74, 5: 0.49, 6: 15.79, 12: 27.54 };

  // Chart 33: Portfolio Loan Share % vs Prepayment Rate %
  const chart33Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 }
    },
    legend: {
      data: ['Portfolio Loan Share (%)', 'Prepayment Rate (%)'],
      textStyle: { color: colors.textColor, fontSize: 11 },
      top: 0
    },
    grid: { top: 35, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureData.map(t => `${t.cohort || t.tenure}M`),
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
        name: 'Portfolio Loan Share (%)',
        type: 'bar',
        data: tenureData.map(t => Number(((t.loans / totalLoans) * 100).toFixed(1))),
        itemStyle: { color: colors.cyan, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 24
      },
      {
        name: 'Prepayment Rate (%)',
        type: 'bar',
        data: tenureData.map(t => prepayRateMap[Number(t.cohort || t.tenure)] ?? 50.0),
        itemStyle: { color: colors.emerald, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 24
      }
    ]
  };

  // Chart 34: Share of Capital Disbursed (%)
  const chart34Option = buildBarOption({
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
    series: [{
      name: 'Share of Disbursed Capital (%)',
      data: tenureData.map(t => Number(((t.disbursed / totalDisbursed) * 100).toFixed(1))),
      color: colors.indigo,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Capital Share %',
    isPercent: true
  });

  // Chart 35: Realized Net Profit Margin % (ROI %) by Tenure
  const chart35Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Tenure</b><br/>Net Profit Margin: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureData.map(t => `${t.cohort || t.tenure}M`),
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
      data: tenureData.map(t => {
        const margin = t.disbursed > 0 ? Number(((t.net_profit / t.disbursed) * 100).toFixed(2)) : 0;
        return {
          value: margin,
          itemStyle: {
            color: margin >= 5 ? colors.emerald : margin >= 0 ? colors.amber : colors.crimson,
            borderRadius: margin >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
          }
        };
      }),
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

  // Chart 36: Annualized Net Return (%)
  const chart36Option = buildLineOption({
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
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

  // Chart 37: Annualized NPA Rate (%)
  const chart37Option = buildLineOption({
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
    series: [{
      name: 'Annualized NPA Rate (%)',
      data: tenureData.map(t => t.ann_npa_pct),
      color: colors.crimson,
      fill: true,
      areaColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.12)'
    }],
    isDark,
    yAxisName: 'Ann. NPA %',
    isPercent: true
  });

  // Chart 38: Raw Return % vs Annualized Return %
  const chart38Option = buildBarOption({
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
    series: [
      { name: 'Raw Return Margin (%)', data: tenureData.map(t => t.tenure_net_pct), color: colors.indigo },
      { name: 'Annualized Return (%)', data: tenureData.map(t => t.ann_net_pct), color: colors.emerald }
    ],
    isDark,
    yAxisName: 'Return %',
    isPercent: true
  });

  // Chart 39: Capital Turnover Multiplier (Cycles/Year)
  const chart39Option = buildBarOption({
    labels: ['2 Months', '3 Months', '4 Months', '5 Months', '6 Months', '12 Months'],
    series: [{
      name: 'Capital Turnover (Cycles/Year)',
      data: [6.0, 4.0, 3.0, 2.4, 2.0, 1.0],
      color: colors.cyan,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Cycles/Year'
  });

  // Chart 40: 12-Month Cohort Cashflow Breakdown (% of Disbursed)
  // Dynamic calculation for 12M tenure cohort
  const t12 = tenureData.find(t => String(t.cohort || t.tenure) === '12') || {
    disbursed: 67000,
    interest_received: 7709,
    platform_fee: 4384,
    npa_amount: 10603,
    net_profit: -7278
  };
  const t12Disb = t12.disbursed || 1;
  const t12IntPct = Number(((t12.interest_received / t12Disb) * 100).toFixed(1));
  const t12FeePct = -Number(((t12.platform_fee / t12Disb) * 100).toFixed(1));
  const t12NpaPct = -Number(((t12.npa_amount / t12Disb) * 100).toFixed(1));
  const t12NetPct = Number(((t12.net_profit / t12Disb) * 100).toFixed(1));

  const chart40Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b>: <b>${p[0].value}% of Capital</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Capital Deployed', 'Interest Received', 'Platform Fees', 'NPA Loss', 'Net Result'],
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
      data: [100.0, t12IntPct, t12FeePct, t12NpaPct, t12NetPct].map(v => ({
        value: v,
        itemStyle: {
          color: v >= 0 ? (v >= 50 ? colors.cyan : colors.emerald) : colors.crimson,
          borderRadius: v >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
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

  // Chart 41: Platform Fee Drag (% of Interest Earned)
  const chart41Option = buildBarOption({
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
    series: [{
      name: 'Fee Share (% of Interest)',
      data: tenureData.map(t => Number(((t.platform_fee / Math.max(t.interest_received, 1)) * 100).toFixed(1))),
      color: colors.amber,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Fee %',
    isPercent: true
  });

  // Chart 42: Active Delinquency Rate (DPD >= 1) % by Tenure
  const chart42Option = buildBarOption({
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
    series: [{
      name: 'Active Delinquency Rate (%)',
      data: tenureData.map(t => activeDpdMap[Number(t.cohort || t.tenure)] ?? 0.5),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Active DPD %',
    isPercent: true
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Tenure & Duration Alpha Analytics (10 Charts — 100% Percentages)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Mathematical proof: 2M–3M velocity (+35.4% to +37.8% ANR, &lt;1% NPA) vs 6M deterioration (16.92% NPA) and 12M destruction (20.69% NPA, 27.54% active delinquency).
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 33: Portfolio Loan Share % vs Prepayment Rate %" subtitle="Tenure 3M achieves an astounding 69.08% prepayment rate; 2M reaches 52.57%.">
          <ReactECharts option={chart33Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 34: Share of Total Disbursed Capital (%)" subtitle="Percentage allocation of capital across short vs long duration tenures.">
          <ReactECharts option={chart34Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 35: Realized Net Profit Margin % (ROI %) by Tenure" subtitle="Net profit generated per rupee deployed across each tenure cohort.">
          <ReactECharts option={chart35Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 36: Annualized Net Compounding Return (%)" subtitle="Annualized compounding yield peaks at 37.77% in 3M and collapses to 10.41% in 12M.">
          <ReactECharts option={chart36Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 37: Annualized NPA Default Rate (%) by Tenure" subtitle="Annualized default rate scales exponentially with duration: 1.8% in 2M to >20% in 12M.">
          <ReactECharts option={chart37Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 38: Raw Margin % vs Annualized Velocity Return %" subtitle="Demonstrating how rapid compounding multiples short tenure raw gains into outsized annual yield.">
          <ReactECharts option={chart38Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 39: Capital Turnover Multiplier (Cycles per Year)" subtitle="2M turns over capital 6.0x/yr while 12M turns over only 1.0x/yr.">
          <ReactECharts option={chart39Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 40: 12-Month Cohort Capital Breakdown (% of Disbursed)" subtitle="12M loans suffer a 15.8% NPA loss drag and 6.5% platform fee drag, wiping out profitability.">
          <ReactECharts option={chart40Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 41: Platform Fee Drag (% of Interest Earned)" subtitle="Platform fees consume up to 40%–50% of interest in long-duration loans vs only 15%–20% in short tenures.">
          <ReactECharts option={chart41Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 42: Active Book Delinquency Rate (DPD >= 1) %" subtitle="Active book DPD rate is only 0.27% in 2M and 0.40% in 3M, but skyrockets to 27.54% in 12M! (70x higher!).">
          <ReactECharts option={chart42Option} style={{ height: '300px' }} />
        </ChartCard>
      </div>

      {/* Tenure Strategic Insight Cards */}
      <div className="insight-grid" style={{ marginTop: '2rem' }}>
        <InsightCard
          id="T1"
          rule="THE 2M SPEED RUN: 0.91% NPA & 35.42% ANR"
          metric="0.91% Closed NPA | 0.27% Active DPD"
          description="Across 331 closed 2M loans, only 3 defaulted (0.91% NPA rate). Across 1,106 active 2M loans, exactly 3 have any DPD (0.27% delinquency). Recycles capital 6 times a year."
          action="Make 2-month loans your highest-priority auto-allocation bucket."
          type="golden"
        />
        <InsightCard
          id="T2"
          rule="THE 3M PREPAYMENT CHAMPION: 69.08% PREPAY"
          metric="69.08% Prepayment | 37.77% ANR"
          description="Tenure 3M is the single best prepayment cohort in LenDenClub history: 69.08% of borrowers prepay in full, cycling capital back in ~45 days at an effective 37.77% annualized return with only 0.40% active delinquency."
          action="Max out 3-month loan allocation with ₹250–₹500 ticket sizes."
          type="golden"
        />
        <InsightCard
          id="T3"
          rule="THE 6M DETERIORATION CLIFF: 16.92% NPA"
          metric="16.92% NPA | 15.79% Active DPD"
          description="Default rates jump from 6.96% in 4M to 16.92% in 6M (nearly 2.5x increase!). In active loans, 15.79% of 6M loans are delinquent (40x higher than 3M loans)."
          action="Restrict or avoid 6-month loans unless borrower has LDC Score >= 760."
          type="hazard"
        />
        <InsightCard
          id="T4"
          rule="THE 12M CAPITAL DESTROYER: 27.54% ACTIVE DPD"
          metric="20.69% Closed NPA | 27.54% Active DPD"
          description="12M loans have a 20.69% closed default rate and 27.54% active delinquency rate (19 of 69 active loans delinquent). 0% prepayment rate means capital is locked for 365 days while defaulting."
          action="Immediate and total blacklist: Never fund 12-month loans under any circumstance."
          type="hazard"
        />
      </div>
    </div>
  );
}
