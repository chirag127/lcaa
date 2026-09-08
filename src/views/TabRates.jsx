import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import { THEME_COLORS } from '../utils/formatters';
import {
  buildBarOption,
  buildLineOption,
  getChartThemeColors
} from '../utils/echartsConfig';

export default function TabRates({ data, isDark = false }) {
  const rateData = data?.rate_resolved ?? [];
  const colors = getChartThemeColors(isDark);

  // Chart 53: Loan Count
  const chart53Option = buildBarOption({
    labels: rateData.map(r => r.cohort || r.tier),
    series: [{ name: 'Loans Funded', data: rateData.map(r => r.loans), color: colors.cyan }],
    isDark,
    yAxisName: 'Loans'
  });

  // Chart 54: Disbursed Capital
  const chart54Option = buildBarOption({
    labels: rateData.map(r => r.cohort || r.tier),
    series: [{ name: 'Disbursed Capital', data: rateData.map(r => r.disbursed), color: colors.indigo }],
    isDark,
    yAxisName: 'Capital (₹)',
    isCurrency: true
  });

  // Chart 55: Realized Net Profit
  const chart55Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} APR</b><br/>Net Profit: <b>₹${Number(p[0].value).toLocaleString()}</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: rateData.map(r => r.cohort || r.tier),
      axisLabel: { color: colors.textColor, fontSize: 10, interval: 0 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, formatter: (v) => `₹${v}` },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: rateData.map(r => ({
        value: r.net_profit,
        itemStyle: {
          color: r.net_profit >= 0 ? colors.emerald : colors.crimson,
          borderRadius: r.net_profit >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 38
    }]
  };

  // Chart 56: Annualized Net Return
  const chart56Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name} APR</b><br/>Ann. Return: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: rateData.map(r => r.cohort || r.tier),
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
      data: rateData.map(r => ({
        value: r.ann_net_pct,
        itemStyle: {
          color: r.ann_net_pct >= 15 ? colors.emerald : r.ann_net_pct >= 0 ? colors.amber : colors.crimson,
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barMaxWidth: 38
    }]
  };

  // Chart 57: Annualized NPA Rate
  const chart57Option = buildLineOption({
    labels: rateData.map(r => r.cohort || r.tier),
    series: [{
      name: 'Annualized NPA Rate (%)',
      data: rateData.map(r => r.ann_npa_pct),
      color: colors.crimson,
      fill: true,
      areaColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.12)'
    }],
    isDark,
    yAxisName: 'NPA %',
    isPercent: true
  });

  // Chart 58: Contractual APR vs Realized Net Return
  const chart58Option = buildLineOption({
    labels: rateData.map(r => r.cohort || r.tier),
    series: [
      { name: 'Contractual APR (%)', data: [36.0, 42.0, 45.0, 47.0, 48.0], color: colors.amber, fill: false },
      { name: 'Realized Net Return (%)', data: rateData.map(r => r.ann_net_pct), color: colors.emerald, fill: false }
    ],
    isDark,
    yAxisName: 'Rate %',
    isPercent: true
  });

  // Chart 59: Platform Fee Friction %
  const chart59Option = buildBarOption({
    labels: rateData.map(r => r.cohort || r.tier),
    series: [{
      name: 'Fees Paid (% of Interest)',
      data: rateData.map(r => Number(((r.platform_fee / Math.max(r.interest_received, 1)) * 100).toFixed(1))),
      color: colors.amber
    }],
    isDark,
    yAxisName: 'Friction %',
    isPercent: true
  });

  // Chart 60: Net Spread
  const chart60Option = buildLineOption({
    labels: rateData.map(r => r.cohort || r.tier),
    series: [{
      name: 'Net Spread (Return - NPA)',
      data: rateData.map(r => Number((r.ann_net_pct - r.ann_npa_pct).toFixed(2))),
      color: colors.cyan,
      fill: true,
      areaColor: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(2, 132, 199, 0.12)'
    }],
    isDark,
    yAxisName: 'Spread %',
    isPercent: true
  });

  // Chart 61: Capital Recovery Rate %
  const chart61Option = buildLineOption({
    labels: rateData.map(r => r.cohort || r.tier),
    series: [{
      name: 'Principal Recovery Rate (%)',
      data: rateData.map(r => Number(((r.principal_received / r.disbursed) * 100).toFixed(1))),
      color: colors.emerald,
      fill: false
    }],
    isDark,
    yAxisName: 'Recovery %',
    isPercent: true
  });

  // Chart 62: Raw Return vs Annualized Return
  const chart62Option = buildBarOption({
    labels: rateData.map(r => r.cohort || r.tier),
    series: [
      { name: 'Raw Margin (%)', data: rateData.map(r => r.tenure_net_pct), color: colors.indigo },
      { name: 'Annualized Return (%)', data: rateData.map(r => r.ann_net_pct), color: colors.emerald }
    ],
    isDark,
    yAxisName: 'Return %',
    isPercent: true
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          APR Pricing & Net Yield Economics (10 Charts)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Contractual interest rate cushion analysis and why APR ≥ 44% is essential to absorb platform fees and defaults. Powered by Apache ECharts.
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 53: Loan Volume by Contractual APR Bracket" subtitle="Pricing distribution: 2,668 loans concentrated at 46%–48%+ APR." option={chart53Option} />
        <ChartCard title="Chart 54: Disbursed Capital Across Interest Rate Tiers" subtitle="Capital allocation across marketplace interest rate tiers." option={chart54Option} />
        <ChartCard title="Chart 55: Realized Net Rupee Profit by APR Tier" subtitle="46%-47.9% generated ₹75.6k profit alone, leading the portfolio." option={chart55Option} />
        <ChartCard title="Chart 56: Annualized Net Return by APR Bracket" subtitle="46%-47.9% APR (+19.1%) and 48%+ (+18.2%) deliver maximum compounding." option={chart56Option} />
        <ChartCard title="Chart 57: Annualized NPA Default Rate Across APR Tiers" subtitle="NPA rate is stable around 6%–10% across all high APR cohorts." option={chart57Option} />
        <ChartCard title="Chart 58: Contractual APR vs Realized Net Return Spread" subtitle="The gap between gross headline yield and net in-pocket profit." option={chart58Option} />
        <ChartCard title="Chart 59: Platform Fee Friction Ratio by APR Tier" subtitle="Platform charges as a percentage of gross interest earned." option={chart59Option} />
        <ChartCard title="Chart 60: Net Risk-Adjusted Yield Spread (ANR - NPA)" subtitle="Net yield buffer after subtracting annualized default losses." option={chart60Option} />
        <ChartCard title="Chart 61: Principal Recovery Rate by APR Bracket" subtitle="Principal cashflow recovery percentage across pricing tiers." option={chart61Option} />
        <ChartCard title="Chart 62: Raw Return Margin vs Annualized Return" subtitle="Compounding magnification effect across interest rate tiers." option={chart62Option} />
      </div>

      {/* Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Pricing Strategy Directives (51 – 60)
        </h3>
        <div className="insights-grid">
          <InsightCard id={51} type="green" badge="THE APR RULE" title="46%–48% APR Sweet Spot: Maximum Net Alpha" body="Loans priced at 46%–48% contractual APR generated ₹115.8k combined net profit (95% of total portfolio profit) with strong +18% to +19% net return." metrics={[{ label: 'Disbursed', value: '₹22.1L' }, { label: 'Net Profit', value: '₹115.8k' }, { label: 'Ann. Return', value: '+18.8%' }]} directive="MANDATE: Prioritize 46%–48% APR loans as primary lending focus." />
          <InsightCard id={52} type="red" badge="FEE COMPRESSION" title="Low APR Trap (<44%): Yield Drops to +1.66%" body="40%–43.9% APR loans delivered a meager +1.66% net return. After 6% platform fees and 5.7% defaults, virtually zero profit remained." metrics={[{ label: 'Disbursed', value: '₹4.31L' }, { label: 'Net Profit', value: '₹1.8k' }, { label: 'Ann. Return', value: '+1.66%' }]} directive="MANDATE: Filter out loans with contractual APR under 44%." />
          <InsightCard id={53} type="yellow" badge="FEE DRAG" title="Platform Fee Friction: 18.4% of Gross Yield" body="Platform fees took ₹45,922 (18.4% of all gross interest earned). High contractual APR is mandatory to overcome this fixed friction." metrics={[{ label: 'Gross Interest', value: '₹2.57L' }, { label: 'Fees Paid', value: '₹45.9k' }, { label: 'Fee Drag', value: '18.4%' }]} directive="MANDATE: Never lend at rates that cannot comfortably absorb 6% fees." />
          <InsightCard id={54} type="green" badge="SPREAD ALPHA" title="Net Spread Buffer: +10% Cushion Against Shocks" body="At 46%+ APR, your net spread (ANR minus NPA) remains comfortably positive (+10.2%), providing an ample shock absorber." metrics={[{ label: 'Gross APR', value: '46.5%' }, { label: 'Net ANR', value: '+19.1%' }, { label: 'Net Spread', value: '+10.2%' }]} directive="MANDATE: Maintain at least a 10% positive net spread buffer." />
          <InsightCard id={55} type="info" badge="CONCENTRATION" title="77% Capital Concentration in Safe APR Zone" body="77% of all portfolio capital was placed in loans priced at ≥44% APR. This pricing discipline protected your overall profitability." metrics={[{ label: 'High APR Lent', value: '₹22.1L' }, { label: 'Portfolio Share', value: '77.0%' }, { label: 'Discipline', value: 'Strong' }]} directive="MANDATE: Keep ≥85% of active capital in the 46%–48% APR corridor." />
          <InsightCard id={56} type="green" badge="RECOVERY RATE" title="46%–48% APR Recovery: 96.1% Principal Returned" body="Borrowers in the 46%–48% tier exhibited stellar payment discipline, returning 96.1% of all disbursed principal on time." metrics={[{ label: 'Disbursed', value: '₹14.9L' }, { label: 'Recovered', value: '₹14.3L' }, { label: 'Recovery %', value: '96.1%' }]} directive="MANDATE: Reinvest repayments into identical 46%+ loans." />
          <InsightCard id={57} type="red" badge="ADVERSE SELECTION" title="Sub-40% Myth: Lower Rates Do NOT Mean Safer Loans" body="Loans below 40% APR still suffered 5.2% default rates. You take the default risk without receiving the interest premium to pay for it." metrics={[{ label: 'Sub-40% NPA', value: '5.2%' }, { label: '46%+ NPA', value: '6.1%' }, { label: 'Risk Gap', value: 'Negligible' }]} directive="MANDATE: Dismiss the myth that low rate loans are significantly safer." />
          <InsightCard id={58} type="green" badge="VOLUME DEPTH" title="Marketplace Volume Concentrated at 46%–48%" body="Over 68% of loans on the LenDenClub marketplace are listed in the 46%–48% corridor, providing ample liquidity for selective lending." metrics={[{ label: 'Available Volume', value: 'High' }, { label: 'Listing Share', value: '68%' }, { label: 'Liquidity', value: 'Deep' }]} directive="MANDATE: Exploit marketplace volume depth in 46%–48% bracket." />
          <InsightCard id={59} type="yellow" badge="48%+ CEILING" title="48%+ Performance: Solid +18.21% but Stagnant" body="Loans at 48%+ APR delivered +18.21% net return, slightly below 46%–48% (+19.08%) due to slightly higher collection friction." metrics={[{ label: 'Disbursed', value: '₹7.21L' }, { label: 'Net Profit', value: '₹40.2k' }, { label: 'Ann. Return', value: '+18.21%' }]} directive="MANDATE: Treat 46%–48% as superior to >48% when given choice." />
          <InsightCard id={60} type="green" badge="THE GOLDEN APR" title="The Golden Rate Formula: APR ≥ 44% Always" body="Backtesting confirms: enforcing an APR ≥ 44% filter eliminates all low-margin drag and ensures minimum +18% net annualized returns." metrics={[{ label: 'Floor Rate', value: '44.0% APR' }, { label: 'Optimal Rate', value: '46.0%–48.0%' }, { label: 'Target Net', value: '> 18% ANR' }]} directive="MANDATE: Set automated investment rule: Minimum APR = 44.0%." />
        </div>
      </div>
    </div>
  );
}
