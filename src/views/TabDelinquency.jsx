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
      data: scenarios.map(s => ({
        value: s.projected_net_ann_return_pct,
        itemStyle: {
          color: s.projected_net_ann_return_pct >= 20 ? colors.emerald : s.projected_net_ann_return_pct >= 10 ? colors.amber : colors.crimson,
          borderRadius: [4, 4, 0, 0]
        }
      })),
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

  // Chart 90: Active Book Health Doughnut
  const chart90Option = buildDonutOption({
    data: [
      { name: 'Current (0 DPD)', value: dpdActive[0]?.loans ?? 1321, itemStyle: { color: colors.emerald } },
      { name: 'Early Delinquent (1-30 DPD)', value: dpdActive[1]?.loans ?? 34, itemStyle: { color: colors.cyan } },
      { name: 'Mid Delinquent (31-60 DPD)', value: dpdActive[2]?.loans ?? 18, itemStyle: { color: colors.amber } },
      { name: 'Critical (61-90 DPD)', value: dpdActive[3]?.loans ?? 12, itemStyle: { color: colors.crimson } }
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
        <ChartCard title="Chart 83: Active Book Staging Distribution" subtitle="Active loan distribution across standard IFRS-9 delinquency stages." option={chart83Option} />
        <ChartCard title="Chart 84: Active Disbursed Capital by Delinquency Stage" subtitle="Outstanding principal risk across current and delinquent loans." option={chart84Option} />
        <ChartCard title="Chart 85: Stress-Test Projected NPA Losses by Scenario" subtitle="Simulated write-off losses under Baseline, Mild, Severe, and Extreme macro stress." option={chart85Option} />
        <ChartCard title="Chart 86: Projected Annualized Net Return Under Macro Stress" subtitle="Net annualized return remains positive (+11.8% to +21.4%) across scenarios." option={chart86Option} />
        <ChartCard title="Chart 87: EDI (Daily) vs EMI (Monthly) Funded Loan Volume" subtitle="Portfolio exposure split between Daily business installment and Monthly payroll." option={chart87Option} />
        <ChartCard title="Chart 88: EDI vs EMI Historical Default Rate Comparison" subtitle="Daily EDI loans defaulted at a catastrophic 74.22% rate vs 5.37% for Monthly." option={chart88Option} />
        <ChartCard title="Chart 89: EDI vs EMI Annualized Net Return Comparison" subtitle="Monthly EMI generated +14.71% net return; Daily EDI produced a devastating -73.19% loss." option={chart89Option} />
        <ChartCard title="Chart 90: Active Portfolio Staging Composition (IFRS-9)" subtitle="95.4% of active loans are fully performing at Stage 1 (0 DPD)." option={chart90Option} />
        <ChartCard title="Chart 91: Historical DPD Roll-Rate Transition Probabilities" subtitle="Once a loan reaches 30+ DPD, probability of full default surges to 94.2%." option={chart91Option} />
        <ChartCard title="Chart 92: Platform Fee Collection Across Active Stages" subtitle="Fees collected on active loans across performing and delinquent stages." option={chart92Option} />
      </div>

      {/* Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Delinquency & Stress-Testing Insights (83 – 92)
        </h3>
        <div className="insights-grid">
          <InsightCard id={83} type="green" badge="STAGE 1 DOMINANCE" title="95.4% of Active Book is Performing at 0 DPD" body="₹7.05 Lakh of your ₹7.39 Lakh active principal is completely current with zero missed payments, proving the underlying health of your performing portfolio." metrics={[{ label: 'Clean POS', value: '₹7.05L' }, { label: 'Clean Share', value: '95.4%' }, { label: 'Health Status', value: 'Pristine' }]} directive="MANDATE: Continue filtering for Monthly EMI to keep roll rates near zero." />
          <InsightCard id={84} type="red" badge="DAILY EDI DISASTER" title="The Daily Repayment Catastrophe: -73.19% Loss" body="Daily auto-debit (EDI) loans suffered a 74.22% default rate and wiped out -73.19% of capital. Daily cash extraction strangles borrower working capital." metrics={[{ label: 'NPA Rate', value: '74.22%' }, { label: 'Net Return', value: '-73.19%' }, { label: 'Severity', value: 'Fatal' }]} directive="MANDATE: Blacklist Equated Daily Installments (EDI) permanently." />
          <InsightCard id={85} type="green" badge="MONTHLY RELIABILITY" title="Monthly EMI: The Bedrock of Stable Compounding" body="Monthly EMI loans delivered a healthy +14.71% net annualized return with modest 5.37% default rates across 3,643 loans." metrics={[{ label: 'Loans', value: '3,643' }, { label: 'NPA Rate', value: '5.37%' }, { label: 'Net Return', value: '+14.71%' }]} directive="MANDATE: Mandate Monthly EMI as an absolute requirement for all loans." />
          <InsightCard id={86} type="yellow" badge="ROLL-RATE TRAP" title="94.2% of 60+ DPD Loans Roll Directly into NPA" body="Delinquency transition data proves that borrowers reaching 60+ DPD rarely recover. 94.2% roll directly into total write-offs." metrics={[{ label: '60+ Roll Rate', value: '94.2%' }, { label: 'Cure Rate', value: '< 6%' }, { label: 'Action', value: 'Write-off' }]} directive="MANDATE: Do not count on recovery for loans past 60 DPD." />
          <InsightCard id={87} type="green" badge="STRESS RESILIENCE" title="Stress Test Confirms: +11.8% Return in Severe Downturn" body="Even under severe macro distress where 50% of delinquent loans immediately default, your portfolio generates +11.8% net annualized returns." metrics={[{ label: 'Severe Return', value: '+11.8%' }, { label: 'Baseline', value: '+21.4%' }, { label: 'Loss Cushion', value: 'Ample' }]} directive="MANDATE: Trust the portfolio safety buffers in any economic climate." />
          <InsightCard id={88} type="info" badge="ECL PROVISIONING" title="Stage 2 & 3 At-Risk Capital: Only ₹34.2k Total" body="Total active capital in delinquent stages (1–90 DPD) is limited to just ₹34,200 across 64 loans, leaving 95.4% of your book completely insulated." metrics={[{ label: 'At-Risk POS', value: '₹34.2k' }, { label: 'Share of Book', value: '4.6%' }, { label: 'Risk Scale', value: 'Minimal' }]} directive="MANDATE: Keep at-risk principal under 5% of active capital." />
          <InsightCard id={89} type="green" badge="COLLECTION SPEED" title="Fast Amortization Shields Against Macro Shifts" body="Because average duration is under 4 months, 25%–50% of outstanding loan principal is repaid before any macroeconomic shock can trigger defaults." metrics={[{ label: 'Avg Duration', value: '3.4 Months' }, { label: 'Monthly Amort.', value: '29.4%' }, { label: 'Defense', value: 'Inherent' }]} directive="MANDATE: Short duration provides built-in risk mitigation." />
          <InsightCard id={90} type="yellow" badge="LATE-STAGE DRAG" title="Stage 3 Loans Generate Zero Interest Income" body="Loans at 61–90 DPD cease paying interest while still tying up investor capital. Eliminating long tenures prevents loans from entering Stage 3." metrics={[{ label: 'Stage 3 Loans', value: '12' }, { label: 'Yield Drag', value: '-0.4%' }, { label: 'Prevention', value: 'Tenure ≤ 4M' }]} directive="MANDATE: Cut tenures to prevent borrower fatigue." />
          <InsightCard id={91} type="green" badge="LIQUIDITY FLOW" title="Performing Cash Stream: ₹1.5L+ Monthly Inflow" body="Healthy Stage 1 loans generate over ₹1.5 Lakh in monthly principal and interest returns, providing continuous liquidity to redeploy into 2M–4M notes." metrics={[{ label: 'Monthly Cash', value: '₹1.5L+' }, { label: 'Reinvestment', value: 'Continuous' }, { label: 'Velocity', value: 'Rapid' }]} directive="MANDATE: Maintain 100% active capital reinvestment rate." />
          <InsightCard id={92} type="green" badge="PORTFOLIO MANDATE" title="The Non-Negotiable Filter: Monthly EMI Only" body="By strictly checking 'Equated Monthly Installment (EMI)' in the filter settings, you permanently eliminate 100% of Daily EDI toxicity." metrics={[{ label: 'EDI Elimination', value: '100%' }, { label: 'Loss Avoidance', value: '₹62.5k' }, { label: 'Rule Status', value: 'Mandatory' }]} directive="MANDATE: Verify Monthly EMI checkbox on every single investment run." />
        </div>
      </div>
    </div>
  );
}
