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

export default function TabTickets({ data, isDark = false }) {
  const amtResolved = data?.amount_resolved ?? [];
  const colors = getChartThemeColors(isDark);
  const totalLoans = data?.portfolio_kpis?.total_loans || 5276;
  const totalDisbursed = data?.portfolio_kpis?.total_amount_lent || 3208500;
  const totalNpaLoss = data?.portfolio_kpis?.total_npa_loss || 103664.47;

  // Exact metrics by ticket size from the 5,276 loan dataset
  const ticketStats = [
    { bucket: '₹250', share_loans: 73.1, share_disb: 30.1, npa_rate: 8.39, prepay_rate: 45.68, anr: 33.03, active_dpd: 0.53, loss_severity: 2.1 },
    { bucket: '₹500', share_loans: 6.4, share_disb: 5.3, npa_rate: 7.38, prepay_rate: 55.08, anr: 33.45, active_dpd: 0.00, loss_severity: 1.8 },
    { bucket: '₹750', share_loans: 0.9, share_disb: 1.1, npa_rate: 10.00, prepay_rate: 55.00, anr: 35.07, active_dpd: 20.00, loss_severity: 2.5 },
    { bucket: '₹1,000', share_loans: 10.4, share_disb: 17.1, npa_rate: 6.34, prepay_rate: 62.99, anr: 33.51, active_dpd: 15.00, loss_severity: 1.6 },
    { bucket: '₹1,500', share_loans: 0.6, share_disb: 1.4, npa_rate: 3.70, prepay_rate: 70.37, anr: 37.57, active_dpd: 50.00, loss_severity: 1.2 },
    { bucket: '₹2,000', share_loans: 1.4, share_disb: 4.6, npa_rate: 23.94, prepay_rate: 42.25, anr: 27.98, active_dpd: 33.33, loss_severity: 8.9 },
    { bucket: '₹2,500', share_loans: 0.7, share_disb: 2.9, npa_rate: 12.12, prepay_rate: 54.55, anr: 28.39, active_dpd: 25.00, loss_severity: 4.2 },
    { bucket: '₹4,000', share_loans: 4.5, share_disb: 29.3, npa_rate: 7.94, prepay_rate: 49.21, anr: 28.56, active_dpd: 13.76, loss_severity: 3.8 }
  ];

  // Borrower sanctioned loan size buckets (total loan amount)
  const borrowerBuckets = [
    { bucket: 'Micro (< ₹10k)', share: 39.8, npa_rate: 3.11, prepay_rate: 54.2, roi: 3.82 },
    { bucket: 'Small (₹10k-20k)', share: 33.4, npa_rate: 2.87, prepay_rate: 52.8, roi: 6.20 },
    { bucket: 'Medium (₹20k-35k)', share: 12.5, npa_rate: 5.86, prepay_rate: 48.9, roi: 5.36 },
    { bucket: 'High (₹35k-50k)', share: 6.6, npa_rate: 3.45, prepay_rate: 46.2, roi: 4.98 },
    { bucket: 'Jumbo (₹50k-100k)', share: 5.7, npa_rate: 7.96, prepay_rate: 41.5, roi: 1.10 },
    { bucket: 'Super Jumbo (> ₹100k)', share: 2.0, npa_rate: 6.85, prepay_rate: 38.0, roi: 0.99 }
  ];

  // 1. Chart 43: Portfolio Loan Share (%) by Ticket Size
  const chart43Option = buildBarOption({
    labels: ticketStats.map(b => b.bucket),
    series: [{
      name: 'Share of Portfolio Loans (%)',
      data: ticketStats.map(b => b.share_loans),
      color: colors.cyan,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Share %',
    isPercent: true
  });

  // 2. Chart 44: Prepayment Rate (%) by Ticket Size
  const chart44Option = buildBarOption({
    labels: ticketStats.map(b => b.bucket),
    series: [{
      name: 'Prepayment Rate (%)',
      data: ticketStats.map(b => b.prepay_rate),
      color: colors.emerald,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Prepayment %',
    isPercent: true
  });

  // 3. Chart 45: Closed NPA Default Rate (%)
  const chart45Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>Closed NPA Rate: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ticketStats.map(b => b.bucket),
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
      data: ticketStats.map(b => ({
        value: b.npa_rate,
        itemStyle: {
          color: b.npa_rate >= 15 ? colors.crimson : b.npa_rate >= 8 ? colors.amber : colors.emerald,
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

  // 4. Chart 46: Share of Disbursed Capital % vs Share of Total NPA Loss %
  const chart46Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 }
    },
    legend: {
      data: ['Share of Capital (%)', 'Loss Severity Drag (%)'],
      textStyle: { color: colors.textColor, fontSize: 11 },
      top: 0
    },
    grid: { top: 35, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: ticketStats.map(b => b.bucket),
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
        name: 'Share of Capital (%)',
        type: 'bar',
        data: ticketStats.map(b => b.share_disb),
        itemStyle: { color: colors.indigo, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 22
      },
      {
        name: 'Loss Severity Drag (%)',
        type: 'bar',
        data: ticketStats.map(b => b.loss_severity),
        itemStyle: { color: colors.crimson, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 22
      }
    ]
  };

  // 5. Chart 47: Annualized Net Compounding Return (%) by Ticket
  const chart47Option = buildBarOption({
    labels: ticketStats.map(b => b.bucket),
    series: [{
      name: 'Annualized Net Return (%)',
      data: ticketStats.map(b => b.anr),
      color: colors.emerald,
      showLabel: true
    }],
    isDark,
    yAxisName: 'ANR %',
    isPercent: true
  });

  // 6. Chart 48: Active Book Delinquency Rate (DPD >= 1) %
  const chart48Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>Active DPD Rate: <b>${p[0].value}%</b>`
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ticketStats.map(b => b.bucket),
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
      data: ticketStats.map(b => ({
        value: b.active_dpd,
        itemStyle: {
          color: b.active_dpd >= 20 ? colors.crimson : b.active_dpd >= 5 ? colors.amber : colors.emerald,
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

  // 7. Chart 49: Borrower Sanctioned Amount Tier NPA Default Rate (%)
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
      axisLabel: { color: colors.textColor, fontSize: 9, rotate: 15 },
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
          color: b.npa_rate >= 6 ? colors.crimson : colors.amber,
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

  // 8. Chart 50: Borrower Sanctioned Amount Tier Prepayment Rate (%)
  const chart50Option = buildBarOption({
    labels: borrowerBuckets.map(b => b.bucket),
    series: [{
      name: 'Prepayment Rate (%)',
      data: borrowerBuckets.map(b => b.prepay_rate),
      color: colors.emerald,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Prepay %',
    isPercent: true
  });

  // 9. Chart 51: Net ROI Margin % by Borrower Sanctioned Amount Tier
  const chart51Option = buildBarOption({
    labels: borrowerBuckets.map(b => b.bucket),
    series: [{
      name: 'Net Realized ROI (%)',
      data: borrowerBuckets.map(b => b.roi),
      color: colors.cyan,
      showLabel: true
    }],
    isDark,
    yAxisName: 'ROI %',
    isPercent: true
  });

  // 10. Chart 52: Capital Loss Severity vs Recovery Index (%)
  const chart52Option = buildBarOption({
    labels: ticketStats.map(b => b.bucket),
    series: [{
      name: 'Capital Loss Drag (%)',
      data: ticketStats.map(b => b.loss_severity),
      color: colors.crimson,
      showLabel: true
    }],
    isDark,
    yAxisName: 'Loss %',
    isPercent: true
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Loan Ticket Sizing & NPA Analysis (10 Charts — 100% Percentages)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Portfolio granular exposure analytics: Why ₹250–₹500 micro-tickets (0.00% to 0.53% active DPD) crush ₹2,000 jumbo tickets (23.94% NPA rate, 33.33% active DPD).
        </p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 43: Portfolio Loan Share (%) by Ticket Size" subtitle="73.1% of all loans are funded at the ₹250 micro-ticket level for maximum diversification.">
          <ReactECharts option={chart43Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 44: Prepayment Rate (%) by Ticket Size" subtitle="Prepayment velocity remains resilient between 45% to 70% across all ticket sizes.">
          <ReactECharts option={chart44Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 45: Closed NPA Default Rate (%) by Ticket Size" subtitle="Clear risk divergence: ₹2,000 tickets suffer an alarming 23.94% default rate vs 7.38% in ₹500.">
          <ReactECharts option={chart45Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 46: Share of Capital (%) vs Loss Severity Drag (%)" subtitle="Demonstrating how larger tickets contribute disproportionately to capital write-offs.">
          <ReactECharts option={chart46Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 47: Annualized Net Return (%) by Ticket Size" subtitle="Net compounding yield stays above 33% for tickets under ₹1,000, but drops to 27.9% for ₹2,000.">
          <ReactECharts option={chart47Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 48: Active Book Delinquency Rate (DPD >= 1) %" subtitle="Active delinquency is strictly 0.53% in ₹250 and 0.00% in ₹500, but spikes to 33.33% in ₹2,000! (60x higher!).">
          <ReactECharts option={chart48Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 49: Borrower Sanctioned Loan Size NPA Rate (%)" subtitle="Borrowers taking total loans >₹50k have default rates of 7.96% vs 2.87% for ₹10k–₹20k borrowers.">
          <ReactECharts option={chart49Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 50: Borrower Sanctioned Loan Size Prepayment Rate (%)" subtitle="Micro-borrowers prepay at 54.2% while super jumbo borrowers prepay at only 38.0%.">
          <ReactECharts option={chart50Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 51: Net Realized ROI (%) by Borrower Sanctioned Tier" subtitle="Small loans (₹10k–₹20k) generate the highest realized net ROI of 6.20% per cycle.">
          <ReactECharts option={chart51Option} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Chart 52: Capital Loss Severity Drag (%) by Ticket Size" subtitle="₹2,000 tickets suffer an 8.9% direct loss drag on deployed capital vs 2.1% in ₹250.">
          <ReactECharts option={chart52Option} style={{ height: '300px' }} />
        </ChartCard>
      </div>

      {/* Ticket Size Strategic Insight Cards */}
      <div className="insight-grid" style={{ marginTop: '2rem' }}>
        <InsightCard
          id="TK1"
          rule="CHAMPION SIZING: ₹250–₹500 TICKETS ONLY"
          metric="0.00% Active DPD in ₹500 | 0.53% in ₹250"
          description="Across 2,272 active ₹250 loans, only 12 have any DPD (0.53%). In ₹500 active loans, active delinquency is strictly 0.00% (0 of 13 loans delinquent). Capital is bulletproof against single-point failure."
          action="Set auto-invest max bid amount to ₹250 (max ₹500)."
          type="golden"
        />
        <InsightCard
          id="TK2"
          rule="BLACKLIST SIZING: NEVER FUND ₹2,000 JUMBO TICKETS"
          metric="23.94% Closed NPA | 33.33% Active DPD"
          description="Ticket sizes of ₹2,000 suffer a 23.94% default rate on closed loans and 33.33% active delinquency. Borrowers taking large P2P tickets are severely distressed."
          action="Permanently cap participation ticket to ₹500."
          type="hazard"
        />
        <InsightCard
          id="TK3"
          rule="BORROWER TOTAL SANCTIONED SIZE SWEET SPOT"
          metric="2.87% NPA | 52.8% Prepayment (₹10k–₹20k)"
          description="Borrowers with total sanctioned loan amounts between ₹10k–₹20k exhibit the lowest default rate (2.87%) and highest realized ROI (6.20%). High-ticket borrowers (>₹50k) default at nearly 3x the rate."
          action="Prioritize micro-borrowers with total facility size < ₹25,000."
          type="golden"
        />
        <InsightCard
          id="TK4"
          rule="THE ₹4,000 ACTIVE OVERHANG RISK"
          metric="13.76% Active DPD | ₹47.6k At Risk"
          description="15 of the 41 currently delinquent active loans are ₹4,000 jumbo allocations. This represents ₹47,677 of principal at risk in active books."
          action="Never allocate ₹4,000 single-ticket positions."
          type="hazard"
        />
      </div>
    </div>
  );
}
