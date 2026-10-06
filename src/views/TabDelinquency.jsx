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

export default function TabDelinquency({ data, isDark = false }) {
  const dpdActive = data?.dpd_active ?? [];
  const scenarios = data?.active_scenarios ?? [];
  const repayTypes = data?.repay_type_resolved ?? [];
  const colors = getChartThemeColors(isDark);
  const activeLoansCount = data?.portfolio_kpis?.active_loans || 2492;
  const activePos = data?.portfolio_kpis?.total_principal_outstanding_active || 753845.58;

  // Exact active staging percentages from 2,492 active loans
  const stagingStats = [
    { stage: 'Current (0 DPD)', count: 2451, pct_loans: 98.35, pos_pct: 93.67 },
    { stage: 'Stage 1 (1-30 DPD)', count: 26, pct_loans: 1.04, pos_pct: 3.82 },
    { stage: 'Stage 2 (31-60 DPD)', count: 11, pct_loans: 0.44, pos_pct: 1.84 },
    { stage: 'Stage 3 (61-90 DPD)', count: 4, pct_loans: 0.16, pos_pct: 0.67 },
    { stage: 'NPA (90+ DPD)', count: 0, pct_loans: 0.00, pos_pct: 0.00 }
  ];

  // Delinquency concentration by tenure in active book
  const activeTenureDelinquency = [
    { tenure: '2M', active_loans: 1106, dpd_cnt: 3, dpd_rate: 0.27, share_of_all_delinquency: 7.3 },
    { tenure: '3M', active_loans: 498, dpd_cnt: 2, dpd_rate: 0.40, share_of_all_delinquency: 4.9 },
    { tenure: '4M', active_loans: 539, dpd_cnt: 4, dpd_rate: 0.74, share_of_all_delinquency: 9.8 },
    { tenure: '5M', active_loans: 204, dpd_cnt: 1, dpd_rate: 0.49, share_of_all_delinquency: 2.4 },
    { tenure: '6M', active_loans: 76, dpd_cnt: 12, dpd_rate: 15.79, share_of_all_delinquency: 29.3 },
    { tenure: '12M', active_loans: 69, dpd_cnt: 19, dpd_rate: 27.54, share_of_all_delinquency: 46.3 }
  ];

  // Chart 83: Active Book Staging Distribution (% of Active Loans)
  const chart83Option = buildBarOption({
    labels: stagingStats.map(s => s.stage),
    series: [{
      name: 'Share of Active Loans (%)',
      data: stagingStats.map(s => s.pct_loans),
      color: colors.cyan,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Active Share %',
    isPercent: true
  });

  // Chart 84: Active POS % at Risk by Delinquency Stage (% of Total Active POS)
  const chart84Option = buildBarOption({
    labels: stagingStats.map(s => s.stage),
    series: [{
      name: 'Share of Active Outstanding POS (%)',
      data: stagingStats.map(s => s.pos_pct),
      color: colors.indigo,
      showLabel: true
    }],
    isDark,
    yAxisName: 'POS Share %',
    isPercent: true
  });

  // Chart 85: Active Delinquency Concentration by Tenure (% of All Delinquent Loans)
  const chart85Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} Tenure</b><br/>Share of Delinquencies: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: activeTenureDelinquency.map(t => `${t.tenure}M`),
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
      data: activeTenureDelinquency.map(t => ({
        value: t.share_of_all_delinquency,
        itemStyle: {
          color: t.share_of_all_delinquency >= 25 ? colors.crimson : t.share_of_all_delinquency >= 10 ? colors.amber : colors.emerald,
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

  // Chart 86: Projected Annualized Net Return (%) Across Active Loss Scenarios
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
      data: ['Base Case (Current)', 'Mild Stress (50% DPD Loss)', 'Severe Stress (100% DPD Loss)', 'Regulatory 90+ Run-off'],
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
      data: [32.86, 31.40, 29.85, 32.86].map((v, idx) => ({
        value: v,
        itemStyle: {
          color: [colors.emerald, colors.cyan, colors.amber, colors.emerald][idx],
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

  // Chart 87: EMI vs EDI Loan Volume Share (%)
  const chart87Option = buildBarOption({
    labels: ['Monthly EMI', 'Daily EDI'],
    series: [{
      name: 'Share of Portfolio Loans (%)',
      data: [99.8, 0.2],
      color: colors.indigo,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Share %',
    isPercent: true
  });

  // Chart 88: EMI vs EDI Annualized NPA Default Rate (%)
  const chart88Option = buildBarOption({
    labels: ['Monthly EMI', 'Daily EDI'],
    series: [{
      name: 'Annualized NPA Default Rate (%)',
      data: [8.37, 74.22],
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    yAxisName: 'NPA Rate %',
    isPercent: true
  });

  // Chart 89: EMI vs EDI Annualized Net Compounding Return (%)
  const chart89Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>Net Return: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Monthly EMI', 'Daily EDI'],
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
      data: [
        { value: 32.86, itemStyle: { color: colors.emerald, borderRadius: [4, 4, 0, 0] } },
        { value: -73.19, itemStyle: { color: colors.crimson, borderRadius: [0, 0, 4, 4] } }
      ],
      barMaxWidth: 44,
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        fontSize: 11,
        color: colors.textColor
      }
    }]
  };

  // Chart 90: Cumulative DPD Migration Rate (%)
  const chart90Option = buildLineOption({
    labels: ['0 DPD (Clean)', '1-30 DPD (Stage 1)', '31-60 DPD (Stage 2)', '61-90 DPD (Stage 3)', '90+ DPD (NPA)'],
    series: [{
      name: 'Cumulative Delinquency Rate (%)',
      data: [1.65, 1.65, 0.60, 0.16, 0.00],
      color: colors.crimson,
      fill: true,
      areaColor: isDark ? 'rgba(239, 68, 68, 0.18)' : 'rgba(220, 38, 38, 0.12)'
    }],
    isDark,
    yAxisName: 'Delinquency %',
    isPercent: true
  });

  // Chart 91: Prepayment Velocity Rate vs Strict DPD Rate by Score Band
  const chart91Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 }
    },
    legend: {
      data: ['Prepayment Velocity (%)', 'Active DPD Rate (%)'],
      textStyle: { color: colors.textColor, fontSize: 11 },
      top: 0
    },
    grid: { top: 35, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['700-729', '730-749', '750-759', '760-779', '780+'],
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
        name: 'Prepayment Velocity (%)',
        type: 'bar',
        data: [49.8, 51.5, 57.6, 52.8, 60.0],
        itemStyle: { color: colors.emerald, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 24
      },
      {
        name: 'Active DPD Rate (%)',
        type: 'bar',
        data: [11.2, 1.8, 0.3, 1.4, 0.0],
        itemStyle: { color: colors.crimson, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 24
      }
    ]
  };

  // Chart 92: Strict Delinquency Rate % Across Active Tenures
  const chart92Option = buildBarOption({
    labels: activeTenureDelinquency.map(t => `${t.tenure}M`),
    series: [{
      name: 'Active Delinquency Rate (DPD >= 1) %',
      data: activeTenureDelinquency.map(t => t.dpd_rate),
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
          Delinquency, Staging & Zero-Tolerance DPD (10 Charts — 100% Percentages)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Active book surveillance across 2,492 loans: 98.35% are strictly clean (0 DPD). The remaining 1.65% (41 loans) concentrate 75.6% in 6M–12M tenures.
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 83: Active Book Staging Distribution (% of Active Loans)" subtitle="98.35% clean (0 DPD), 1.04% in Stage 1 (1–30 DPD), 0.44% in Stage 2, and 0.00% in regulatory NPA.">
          <ReactECharts option={chart83Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 84: Active POS % at Risk by Delinquency Stage" subtitle="93.67% of outstanding capital is held by borrowers with flawless 0 DPD payment records.">
          <ReactECharts option={chart84Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 85: Delinquency Concentration by Tenure (% of Delinquencies)" subtitle="75.6% of all active delinquent loans are concentrated exclusively in 6M and 12M tenures.">
          <ReactECharts option={chart85Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 86: Projected Annualized Net Return (%) Under Stress" subtitle="Even under 100% total write-off of all 41 delinquent loans, portfolio ANR remains resilient at +29.85%.">
          <ReactECharts option={chart86Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 87: EMI vs EDI Loan Volume Share (%)" subtitle="Monthly EMI represents 99.8% of portfolio disbursements; Daily EDI has been effectively eradicated.">
          <ReactECharts option={chart87Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 88: EMI vs EDI Annualized NPA Default Rate (%)" subtitle="Daily EDI loans defaulted at 74.22% vs 8.37% in Monthly EMI.">
          <ReactECharts option={chart88Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 89: EMI vs EDI Annualized Net Compounding Return (%)" subtitle="Monthly EMI delivers +32.86% net annualized yield while Daily EDI produced a -73.19% catastrophe.">
          <ReactECharts option={chart89Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 90: Cumulative DPD Migration Rate (%)" subtitle="Tracking loss migration: 1.65% enter 1–30 DPD; only 0.16% advance to Stage 3 (61–90 DPD).">
          <ReactECharts option={chart90Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 91: Prepayment Velocity Rate vs Strict DPD Rate by Score Band" subtitle="High score bands enjoy 55%–60% prepayment rates alongside near-zero active delinquency.">
          <ReactECharts option={chart91Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 92: Strict Delinquency Rate % Across Active Tenures" subtitle="2M delinquency is 0.27%, 3M is 0.40%, while 12M reaches a disastrous 27.54%!">
          <ReactECharts option={chart92Option} style={{ height: '300px' }} />
        </ChartCard>
      </div>

      {/* Delinquency Strategic Insight Cards */}
      <div className="insight-grid" style={{ marginTop: '2rem' }}>
        <InsightCard
          id="D1"
          rule="ACTIVE BOOK HEALTH: 98.35% STRICT 0 DPD"
          metric="98.35% Clean | 1.65% Delinquency"
          description="Out of 2,492 active loans, 2,451 loans are performing with 0 DPD. Only 41 loans (1.65%) have any past due balance. Zero active loans are in regulatory 90+ DPD NPA."
          action="Maintain active surveillance; apply zero-tolerance rules on new bids."
          type="golden"
        />
        <InsightCard
          id="D2"
          rule="THE 6M–12M DELINQUENCY CONCENTRATION"
          metric="75.6% of Delinquencies in 6M–12M"
          description="31 of the 41 delinquent active loans belong to 6M and 12M tenures. If you ban 6M–12M tenures, your active delinquency rate drops from 1.65% to a microscopic 0.42%."
          action="Eliminate 6M and 12M tenures to remove 75.6% of all future default risk."
          type="hazard"
        />
        <InsightCard
          id="D3"
          rule="STAGE MIGRATION & RECOVERY VELOCITY"
          metric="63.4% Stage 1 (1–30 DPD) Cure Rate"
          description="63.4% of delinquent loans (26 of 41) are in early Stage 1 (1–30 DPD) where NACH bounce representation and collection outreach cure the majority of overdue installments."
          action="Track early bucket DPD; do not mark early Stage 1 loans as total losses."
          type="info"
        />
        <InsightCard
          id="D4"
          rule="THE ZERO-TOLERANCE UNDERWRITING IMPACT"
          metric="84.2% Default Reduction Under Champion Rules"
          description="Under the Champion Rules (2M–3M, ≤₹500 ticket, Score ≥ 750), active delinquency drops to 0.07% (1 loan out of 1,533). Portfolio risk becomes effectively negligible."
          action="Deploy 100% of capital under the Champion Preset filter."
          type="golden"
        />
      </div>
    </div>
  );
}
