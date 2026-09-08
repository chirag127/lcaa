import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import { THEME_COLORS, formatINR, formatPercent } from '../utils/formatters';
import {
  buildBarOption,
  buildLineOption,
  getChartThemeColors
} from '../utils/echartsConfig';

export default function TabTickets({ data, isDark = false }) {
  const analysis = data?.loan_amount_npa_analysis ?? {};
  const summary = analysis.summary ?? {
    total_npas: 149,
    total_npa_lent: 113000,
    avg_lent_per_npa: 758.39,
    avg_lent_overall: 723.34,
    avg_borrower_sanctioned_overall: 18153.61,
    avg_borrower_sanctioned_closed: 15347.81,
    avg_borrower_sanctioned_npa: 23456.08,
    total_npa_recovered_principal: 25193.39,
    npa_recovery_rate_pct: 22.3,
    total_npa_loss: 83733.94,
    npa_net_return_pct: -74.1,
    npa_ann_return_pct: -168.96
  };

  const ticketBuckets = analysis.ticket_buckets ?? [
    { bucket: '₹250 (Min)', loans: 2521, npas: 84, npa_rate: 3.33, disbursed: 630250, net_profit: 21909, npa_loss: 11580, realized_roi: 3.48, ann_net_pct: 18.5, npa_recovery_rate: 44.9, npa_roi: -55.1 },
    { bucket: '₹251-500', loans: 328, npas: 19, npa_rate: 5.79, disbursed: 164000, net_profit: 10665, npa_loss: 4723, realized_roi: 6.50, ann_net_pct: 19.7, npa_recovery_rate: 50.3, npa_roi: -49.7 },
    { bucket: '₹501-750', loans: 45, npas: 3, npa_rate: 6.67, disbursed: 33750, net_profit: 2189, npa_loss: 697, realized_roi: 6.49, ann_net_pct: 19.4, npa_recovery_rate: 69.0, npa_roi: -31.0 },
    { bucket: '₹751-1,000', loans: 549, npas: 18, npa_rate: 3.28, disbursed: 549000, net_profit: 39283, npa_loss: 13818, realized_roi: 7.16, ann_net_pct: 20.8, npa_recovery_rate: 23.2, npa_roi: -76.8 },
    { bucket: '₹1,001-2,000', loans: 148, npas: 15, npa_rate: 10.14, disbursed: 258250, net_profit: -6410, npa_loss: 24037, realized_roi: -2.48, ann_net_pct: -1.2, npa_recovery_rate: 17.1, npa_roi: -82.9 },
    { bucket: '₹2,001-5,000', loans: 339, npas: 10, npa_rate: 2.95, disbursed: 1234250, net_profit: 54480, npa_loss: 28879, realized_roi: 4.41, ann_net_pct: 14.8, npa_recovery_rate: 13.1, npa_roi: -86.9 },
  ];

  const borrowerBuckets = analysis.borrower_sanctioned_buckets ?? [
    { bucket: 'Micro (< ₹10k)', loans: 1578, npas: 49, npa_rate: 3.11, disbursed: 909250, net_profit: 34695, npa_loss: 26067, realized_roi: 3.82 },
    { bucket: 'Small (₹10k-20k)', loans: 1325, npas: 38, npa_rate: 2.87, disbursed: 808000, net_profit: 50121, npa_loss: 11629, realized_roi: 6.20 },
    { bucket: 'Medium (₹20k-35k)', loans: 495, npas: 29, npa_rate: 5.86, disbursed: 396250, net_profit: 21236, npa_loss: 10923, realized_roi: 5.36 },
    { bucket: 'High (₹35k-50k)', loans: 261, npas: 9, npa_rate: 3.45, disbursed: 203250, net_profit: 10121, npa_loss: 2685, realized_roi: 4.98 },
    { bucket: 'Jumbo (₹50k-100k)', loans: 226, npas: 18, npa_rate: 7.96, disbursed: 418500, net_profit: 4624, npa_loss: 22520, realized_roi: 1.10 },
    { bucket: 'Super Jumbo (> ₹100k)', loans: 73, npas: 5, npa_rate: 6.85, disbursed: 131250, net_profit: 1300, npa_loss: 9727, realized_roi: 0.99 },
  ];

  const colors = getChartThemeColors(isDark);

  // 1. Chart 43: Loans Funded
  const chart43Option = buildBarOption({
    labels: ticketBuckets.map(b => b.bucket),
    series: [{ name: 'Funded Loans', data: ticketBuckets.map(b => b.loans), color: colors.emerald }],
    isDark,
    yAxisName: 'Loans'
  });

  // 2. Chart 44: NPA Default Count
  const chart44Option = buildBarOption({
    labels: ticketBuckets.map(b => b.bucket),
    series: [{ name: 'NPA Default Count', data: ticketBuckets.map(b => b.npas), color: colors.crimson }],
    isDark,
    yAxisName: 'Defaults'
  });

  // 3. Chart 45: NPA Default Rate (%)
  const chart45Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>NPA Rate: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ticketBuckets.map(b => b.bucket),
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
      data: ticketBuckets.map(b => ({
        value: b.npa_rate,
        itemStyle: {
          color: b.npa_rate > 7 ? colors.crimson : b.npa_rate > 5 ? colors.amber : colors.emerald,
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barMaxWidth: 36
    }]
  };

  // 4. Chart 46: Disbursed vs Write-off
  const chart46Option = buildBarOption({
    labels: ticketBuckets.map(b => b.bucket),
    series: [
      { name: 'Capital Disbursed', data: ticketBuckets.map(b => b.disbursed), color: colors.cyan },
      { name: 'NPA Write-off', data: ticketBuckets.map(b => b.npa_loss), color: colors.crimson }
    ],
    isDark,
    yAxisName: 'Rupees (₹)',
    isCurrency: true
  });

  // 5. Chart 47: Net Profit / Loss
  const chart47Option = {
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
      data: ticketBuckets.map(b => b.bucket),
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
      data: ticketBuckets.map(b => ({
        value: b.net_profit,
        itemStyle: {
          color: b.net_profit >= 0 ? colors.emerald : colors.crimson,
          borderRadius: b.net_profit >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 36
    }]
  };

  // 6. Chart 48: NPA Margin %
  const chart48Option = buildBarOption({
    labels: ticketBuckets.map(b => b.bucket),
    series: [{ name: 'NPA Realized Margin (%)', data: ticketBuckets.map(b => b.npa_roi), color: colors.crimson }],
    isDark,
    yAxisName: 'Margin %',
    isPercent: true
  });

  // 7. Chart 49: Borrower Sanctioned vs NPA Rate
  const chart49Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>NPA Rate: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: borrowerBuckets.map(b => b.bucket),
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
      data: borrowerBuckets.map(b => ({
        value: b.npa_rate,
        itemStyle: {
          color: b.npa_rate > 6 ? colors.crimson : b.npa_rate > 4 ? colors.amber : colors.emerald,
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barMaxWidth: 36
    }]
  };

  // 8. Chart 50: Average Loan Size: Closed vs Active vs NPA
  const chart50Option = buildBarOption({
    labels: ['Closed (Repaid)', 'Active (Current)', 'NPA Defaults (Written Off)'],
    series: [{
      name: 'Avg Sanctioned Loan (₹)',
      data: [summary.avg_borrower_sanctioned_closed, 21802.15, summary.avg_borrower_sanctioned_npa],
      color: colors.indigo
    }],
    isDark,
    yAxisName: 'Amount (₹)',
    isCurrency: true
  });

  // 9. Chart 51: NPA Recovery Rate (%)
  const chart51Option = buildLineOption({
    labels: ticketBuckets.map(b => b.bucket),
    series: [{
      name: 'Principal Recovery Rate (%)',
      data: ticketBuckets.map(b => b.npa_recovery_rate),
      color: colors.emerald,
      fill: true,
      areaColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.12)'
    }],
    isDark,
    yAxisName: 'Recovery %',
    isPercent: true
  });

  // 10. Chart 52: Annualized Net Return (%)
  const chart52Option = {
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
      data: ticketBuckets.map(b => b.bucket),
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
      data: ticketBuckets.map(b => ({
        value: b.ann_net_pct,
        itemStyle: {
          color: b.ann_net_pct >= 18 ? colors.emerald : b.ann_net_pct >= 10 ? colors.amber : colors.crimson,
          borderRadius: b.ann_net_pct >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
        }
      })),
      barMaxWidth: 36
    }]
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Loan Amount & NPA Deep-Dive Analytics (10 Charts)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Detailed loss distribution across investor ticket sizes and borrower sanctioned loan buckets. Powered by Apache ECharts.
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 43: Funded Loan Volume by Investor Allocation Tier" subtitle="2,521 loans (64%) were funded at the ₹250 baseline minimum." option={chart43Option} />
        <ChartCard title="Chart 44: NPA Default Frequency Across Ticket Buckets" subtitle="Count of defaulted loans across your chosen investment sizes." option={chart44Option} />
        <ChartCard title="Chart 45: NPA Default Rate (%) Across Allocation Tiers" subtitle="₹1,001-₹2,000 experienced an alarming 10.14% default spike." option={chart45Option} />
        <ChartCard title="Chart 46: Capital Deployed vs Absolute Rupee NPA Losses" subtitle="Rupee magnitude of defaults across investment ticket tiers." option={chart46Option} />
        <ChartCard title="Chart 47: Realized Net Cash Profit & Loss by Ticket Tier" subtitle="₹1,001-₹2,000 lost ₹6,410 net after write-offs!" option={chart47Option} />
        <ChartCard title="Chart 48: Loss Severity: Realized Margin on Defaulted Loans" subtitle="NPA loans in large ticket tiers lost up to 86.9% of capital." option={chart48Option} />
        <ChartCard title="Chart 49: Borrower Sanctioned Loan Size vs NPA Rate (%)" subtitle="Borrowers taking >₹50k sanctioned loans default at 2.6x higher rates." option={chart49Option} />
        <ChartCard title="Chart 50: Average Sanctioned Size: Closed vs NPA Defaults" subtitle="Defaulted borrowers were sanctioned ₹23,456 vs ₹15,348 for closed loans." option={chart50Option} />
        <ChartCard title="Chart 51: Principal Recovery Rate (%) on Defaulted Loans" subtitle="₹250-₹750 loans recovered 45%–69% before default." option={chart51Option} />
        <ChartCard title="Chart 52: Annualized Net Return (%) Across Ticket Sizes" subtitle="₹250 to ₹1,000 consistently delivers +18% to +20.8% net return." option={chart52Option} />
      </div>

      {/* Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Loan Sizing Underwriting Insights (41 – 50)
        </h3>
        <div className="insights-grid">
          <InsightCard id={41} type="green" badge="SWEET SPOT" title="₹250–₹500 Ticket Size: Optimal Diversification" body="Allocating ₹250 to ₹500 per borrower minimizes portfolio concentration risk. Even with 84 defaults in the ₹250 tier, you generated ₹21,909 net profit." metrics={[{ label: 'Loans', value: '2,521' }, { label: 'Net Profit', value: '₹21.9k' }, { label: 'Ann. Return', value: '+18.5%' }]} directive="MANDATE: Keep manual lending tickets capped at ₹500 maximum." />
          <InsightCard id={42} type="red" badge="FATAL SIZING" title="₹1,001–₹2,000 Hazard: -1.2% Net Annualized Loss" body="The ₹1,001–₹2,000 ticket tier was an absolute disaster. With 10.14% default rate, it wiped out ₹24,037 in NPA losses and ended at -1.2% net return." metrics={[{ label: 'Disbursed', value: '₹2.58L' }, { label: 'Loss', value: '-₹6.4k' }, { label: 'NPA Rate', value: '10.14%' }]} directive="MANDATE: Completely avoid the ₹1,001–₹2,000 allocation range." />
          <InsightCard id={43} type="green" badge="TOP DOLLAR" title="₹751–₹1,000 Efficiency: ₹39.3k Net Profit" body="This bracket delivered your highest nominal dollar profit (₹39,283) with low 3.28% defaults and a sterling +20.8% net annualized return." metrics={[{ label: 'Disbursed', value: '₹5.49L' }, { label: 'Net Profit', value: '₹39.3k' }, { label: 'Ann. Return', value: '+20.8%' }]} directive="MANDATE: Deploy ₹1,000 tickets only on Prime 760+ score borrowers." />
          <InsightCard id={44} type="yellow" badge="JUMBO HAZARD" title="Borrowers with >₹50k Loans Default 2.6x More" body="When a borrower takes more than ₹50,000 from LenDenClub, default rate jumps to 7.96%. They struggle with total debt-servicing load." metrics={[{ label: 'Micro NPA', value: '3.11%' }, { label: 'Jumbo NPA', value: '7.96%' }, { label: 'Risk Ratio', value: '2.6x' }]} directive="MANDATE: Reject borrowers requesting total loan size >₹50,000." />
          <InsightCard id={45} type="green" badge="RECOVERY EDGE" title="Smaller Loans Have 2.7x Better NPA Recovery" body="When ₹250–₹500 loans defaulted, borrowers had already repaid 45%–50% of principal. In >₹2,000 loans, recovery dropped to just 13.1%." metrics={[{ label: 'Small Recovery', value: '45-50%' }, { label: 'Large Recovery', value: '13.1%' }, { label: 'Cushion', value: '+35%' }]} directive="MANDATE: Use small tickets to maximize pre-default amortized recovery." />
          <InsightCard id={46} type="red" badge="ASYMMETRIC LOSS" title="One Big Default Equals 16 Healthy Loans" body="A single ₹4,000 default destroys the entire net interest earned across 16 healthy ₹250 loans. Concentration destroys portfolio alpha." metrics={[{ label: 'Max Single Loss', value: '₹4,000' }, { label: 'Avg Gain', value: '₹240' }, { label: 'Ratio', value: '1 : 16' }]} directive="MANDATE: Never lend more than ₹1,000 to any single entity." />
          <InsightCard id={47} type="green" badge="VOLUME STABILITY" title="Micro-Tickets (<₹10k) Form 73% of Safe Book" body="Borrowers taking small loans (<₹20,000 total) delivered 73% of total portfolio cash profits with steady, predictable monthly repayments." metrics={[{ label: 'Loans', value: '2,903' }, { label: 'Total Profit', value: '₹84.8k' }, { label: 'Stability', value: 'Very High' }]} directive="MANDATE: Target borrowers requesting ₹10k to ₹20k total loans." />
          <InsightCard id={48} type="yellow" badge="RECOVERY RATE" title="Overall NPA Recovery Rate: 22.3% of Principal" body="Across all 149 written-off loans, the platform managed to recover ₹25,193 out of ₹113,000 total lent principal before default." metrics={[{ label: 'NPA Lent', value: '₹1.13L' }, { label: 'Recovered', value: '₹25.2k' }, { label: 'Recovery %', value: '22.3%' }]} directive="MANDATE: Treat NPA write-offs as unrecoverable once DPD exceeds 90." />
          <InsightCard id={49} type="info" badge="CONCENTRATION" title="Capital Concentration Risk Matrix" body="Diversifying across 3,900+ small loans protected the portfolio from systemic default shocks. High fragmentation is your best armor." metrics={[{ label: 'Total Loans', value: '3,967' }, { label: 'Avg Ticket', value: '₹723' }, { label: 'Diversification', value: 'Elite' }]} directive="MANDATE: Maintain average loan allocation under ₹750." />
          <InsightCard id={50} type="green" badge="PORTFOLIO RULE" title="The ₹500 Ticket Standard: The Ideal Balance" body="Restricting manual investment tickets strictly to ₹250–₹500 eliminates concentration risk while maintaining maximum compounding speed." metrics={[{ label: 'Target Ticket', value: '₹250-₹500' }, { label: 'Max Ticket', value: '₹1,000' }, { label: 'Yield Target', value: '> 20% ANR' }]} directive="MANDATE: Set standard manual investment ticket size to ₹500." />
        </div>
      </div>
    </div>
  );
}
