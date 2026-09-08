import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import { THEME_COLORS } from '../utils/formatters';
import { baseChartOptions } from '../utils/chartConfig';

export default function TabAnnualized({ data }) {
  const tenureData = data?.tenure_resolved ?? [];
  const scoreData = data?.score_20_resolved ?? [];
  const amtData = data?.amount_resolved ?? [];
  const rateData = data?.rate_resolved ?? [];

  // Chart 11: Tenure Raw vs Annualized Return
  const chart11Data = {
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
    datasets: [
      { label: 'Raw Tenure Net Return (%)', data: tenureData.map(t => t.tenure_net_pct), backgroundColor: THEME_COLORS.indigo },
      { label: 'Annualized Net Return (%)', data: tenureData.map(t => t.ann_net_pct), backgroundColor: THEME_COLORS.emerald }
    ]
  };

  // Chart 12: Tenure Raw vs Annualized NPA
  const chart12Data = {
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
    datasets: [
      { label: 'Raw Tenure NPA (%)', data: tenureData.map(t => t.tenure_npa_pct), backgroundColor: THEME_COLORS.amber },
      { label: 'Annualized NPA (%)', data: tenureData.map(t => t.ann_npa_pct), backgroundColor: THEME_COLORS.crimson }
    ]
  };

  // Chart 13: Score 20pt Raw vs Annualized Return
  const chart13Data = {
    labels: scoreData.map(s => s.cohort),
    datasets: [
      { label: 'Raw Net Return (%)', data: scoreData.map(s => s.tenure_net_pct), borderColor: THEME_COLORS.cyan, backgroundColor: 'transparent', tension: 0.3 },
      { label: 'Annualized Net Return (%)', data: scoreData.map(s => s.ann_net_pct), borderColor: THEME_COLORS.emerald, backgroundColor: 'transparent', tension: 0.3 }
    ]
  };

  // Chart 14: Score 20pt Raw vs Annualized NPA
  const chart14Data = {
    labels: scoreData.map(s => s.cohort),
    datasets: [
      { label: 'Raw NPA (%)', data: scoreData.map(s => s.tenure_npa_pct), borderColor: THEME_COLORS.amber, backgroundColor: 'transparent', tension: 0.3 },
      { label: 'Annualized NPA (%)', data: scoreData.map(s => s.ann_npa_pct), borderColor: THEME_COLORS.crimson, backgroundColor: 'transparent', tension: 0.3 }
    ]
  };

  // Chart 15: Ticket Size Raw vs Annualized Return
  const chart15Data = {
    labels: amtData.map(a => a.cohort || a.tier),
    datasets: [
      { label: 'Raw Net Return (%)', data: amtData.map(a => a.tenure_net_pct), backgroundColor: THEME_COLORS.cyan },
      { label: 'Annualized Net Return (%)', data: amtData.map(a => a.ann_net_pct), backgroundColor: THEME_COLORS.emerald }
    ]
  };

  // Chart 16: Ticket Size Raw vs Annualized NPA
  const chart16Data = {
    labels: amtData.map(a => a.cohort || a.tier),
    datasets: [
      { label: 'Raw NPA (%)', data: amtData.map(a => a.tenure_npa_pct), backgroundColor: THEME_COLORS.amber },
      { label: 'Annualized NPA (%)', data: amtData.map(a => a.ann_npa_pct), backgroundColor: THEME_COLORS.crimson }
    ]
  };

  // Chart 17: APR Tiers Raw vs Annualized Return
  const chart17Data = {
    labels: rateData.map(r => r.cohort || r.tier),
    datasets: [
      { label: 'Raw Net Return (%)', data: rateData.map(r => r.tenure_net_pct), backgroundColor: THEME_COLORS.indigo },
      { label: 'Annualized Net Return (%)', data: rateData.map(r => r.ann_net_pct), backgroundColor: THEME_COLORS.emerald }
    ]
  };

  // Chart 18: Platform Fees Raw vs Annualized Drag
  const chart18Data = {
    labels: tenureData.map(t => `${t.cohort || t.tenure}M`),
    datasets: [
      { label: 'Raw Fee Drag (%)', data: tenureData.map(t => t.tenure_fee_pct), backgroundColor: THEME_COLORS.amber },
      { label: 'Annualized Fee Drag (%)', data: tenureData.map(t => t.ann_fee_pct), backgroundColor: THEME_COLORS.purple }
    ]
  };

  // Chart 19: ₹10,000 Compounded Return by Tenure
  const chart19Data = {
    labels: ['2 Months (6x)', '3 Months (4x)', '4 Months (3x)', '5 Months (2.4x)', '6 Months (2x)', '12 Months (1x)'],
    datasets: [{
      label: 'End-of-Year Value of ₹10,000 (₹)',
      data: [12739, 12113, 11702, 12162, 10426, 8921],
      backgroundColor: [THEME_COLORS.emerald, THEME_COLORS.emerald, THEME_COLORS.emerald, THEME_COLORS.emerald, THEME_COLORS.amber, THEME_COLORS.crimson]
    }]
  };

  // Chart 20: Velocity-Adjusted Net Spread
  const chart20Data = {
    labels: tenureData.map(t => `${t.tenure}M`),
    datasets: [{
      label: 'Velocity Net Spread (Ann. Return - Ann. NPA)',
      data: tenureData.map(t => (t.ann_net_pct - t.ann_npa_pct)),
      borderColor: THEME_COLORS.cyan,
      backgroundColor: THEME_COLORS.cyanGlow,
      fill: true,
      tension: 0.3
    }]
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Annualized vs Raw Performance Dynamics</h2>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Unmasking real portfolio yield by applying the capital turnover multiplier M = 12 / Tenure.</p>
      </div>

      <div className="charts-grid-2">
        <ChartCard title="Chart 11: Tenure - Raw vs Annualized Net Return" subtitle="How short tenures multiply raw returns (2M raw 4.56% x 6 = 27.39% annualized).">
          <Bar data={chart11Data} options={{ ...baseChartOptions, plugins: { legend: { display: true } } }} />
        </ChartCard>

        <ChartCard title="Chart 12: Tenure - Raw vs Annualized NPA Rate" subtitle="Annualized default drag across duration horizons.">
          <Bar data={chart12Data} options={{ ...baseChartOptions, plugins: { legend: { display: true } } }} />
        </ChartCard>

        <ChartCard title="Chart 13: Credit Score - Raw vs Annualized Return Curve" subtitle="Annualized alpha peaks sharply in the 745–774 score band.">
          <Line data={chart13Data} options={{ ...baseChartOptions, plugins: { legend: { display: true } } }} />
        </ChartCard>

        <ChartCard title="Chart 14: Credit Score - Raw vs Annualized NPA Curve" subtitle="Annualized default rate drops from 16.3% in sub-740 to 0% in 780+.">
          <Line data={chart14Data} options={{ ...baseChartOptions, plugins: { legend: { display: true } } }} />
        </ChartCard>

        <ChartCard title="Chart 15: Ticket Size - Raw vs Annualized Return" subtitle="Micro-tickets deliver 20% annualized yield; large tickets plunge to -14.2%.">
          <Bar data={chart15Data} options={{ ...baseChartOptions, plugins: { legend: { display: true } } }} />
        </ChartCard>

        <ChartCard title="Chart 16: Ticket Size - Raw vs Annualized NPA Rate" subtitle="Severe annualized default concentration on tickets > ₹1,000.">
          <Bar data={chart16Data} options={{ ...baseChartOptions, plugins: { legend: { display: true } } }} />
        </ChartCard>

        <ChartCard title="Chart 17: APR Tiers - Raw vs Annualized Net Spread" subtitle="44%+ APR provides the necessary margin to absorb 6% platform fees.">
          <Bar data={chart17Data} options={{ ...baseChartOptions, plugins: { legend: { display: true } } }} />
        </ChartCard>

        <ChartCard title="Chart 18: Platform Fee Drag - Raw vs Annualized" subtitle="Fee friction scales with loan velocity, requiring high APR selection.">
          <Bar data={chart18Data} options={{ ...baseChartOptions, plugins: { legend: { display: true } } }} />
        </ChartCard>

        <ChartCard title="Chart 19: Year-End Value of ₹10,000 by Tenure" subtitle="Simulating ₹10,000 deployed for 1 year in each tenure bucket.">
          <Bar data={chart19Data} options={baseChartOptions} />
        </ChartCard>

        <ChartCard title="Chart 20: Velocity-Adjusted Net Spread by Tenure" subtitle="Annualized Net Return minus Annualized NPA rate.">
          <Line data={chart20Data} options={baseChartOptions} />
        </ChartCard>
      </div>

      {/* 10 Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Annualized Multiplier Insights (11 – 20)</h3>
        <div className="insights-grid">
          <InsightCard id={11} type="green" badge="VELOCITY MULTIPLIER" title="The 6.0x Velocity Engine on 2M Loans" body="A raw 4.56% return on a 2-month loan sounds modest, but recycling that capital 6 times a year produces a massive +27.39% annualized net yield." metrics={[{ label: 'Raw Return', value: '4.56%' }, { label: 'Multiplier', value: '6.0x' }, { label: 'Annualized', value: '+27.39%' }]} directive="RULE: Treat capital turnover velocity as your primary profit engine." />
          <InsightCard id={12} type="red" badge="ZERO MULTIPLIER" title="The 12-Month Trap: Multiplier is 1.0x" body="On 12-month loans, the annualization multiplier drops to 1.0x. You get zero velocity benefits and bear 12 months of borrower delinquency risk." metrics={[{ label: 'Multiplier', value: '1.0x' }, { label: 'NPA Rate', value: '15.82%' }, { label: 'Net Return', value: '-10.79%' }]} directive="RULE: Eliminate 12M loans; capital stays trapped too long." />
          <InsightCard id={13} type="green" badge="SCORE COMPOUNDING" title="Score Band 740–759 Delivers +21.46% Net" body="With an annualized multiplier of 3.2x, the 740–759 cohort delivered ₹22.8k in clean net profit with only 2.51% raw default losses." metrics={[{ label: 'Loans Funded', value: '359' }, { label: 'Raw NPA', value: '2.51%' }, { label: 'Ann. Return', value: '+21.46%' }]} directive="RULE: Target this cohort for your core lending volume." />
          <InsightCard id={14} type="info" badge="SUB-720 SCORES" title="Sub-720 Loans Require Strict 2M–3M Filtering" body="Borrowers with scores 700–719 had an annualized NPA rate of 13.17%. However, when restricted to 2M–3M, net return remained positive (+18.27%)." metrics={[{ label: 'Ann. NPA', value: '13.17%' }, { label: 'Ann. Return', value: '+18.27%' }, { label: 'Condition', value: '≤ 3M Only' }]} directive="RULE: Never fund sub-720 scores beyond 3 months duration." />
          <InsightCard id={15} type="green" badge="TICKET SIZING" title="₹250 Micro-Tickets Protect Net Spread" body="At ₹250 ticket size, annualized return reached +18.50%. Diversification across 1,000+ borrowers effectively eliminates idiosyncratic default shocks." metrics={[{ label: 'Avg Ticket', value: '₹250' }, { label: 'Ann. Return', value: '+18.50%' }, { label: 'Diversification', value: 'Max' }]} directive="RULE: Maintain default allocation at ₹250 per loan." />
          <InsightCard id={16} type="red" badge="LARGE TICKET DRAG" title="₹2,000+ Sizing: Severe Portfolio Damage" body="Allocating ₹2,000–₹4,000 per loan resulted in a catastrophic -14.18% net annualized return. Large borrowers defaulted at triple the rate of micro-borrowers." metrics={[{ label: 'Ticket Size', value: '₹2k–₹4k' }, { label: 'Ann. NPA', value: '41.46%' }, { label: 'Net Return', value: '-14.18%' }]} directive="RULE: Hard ceiling at ₹1,000; never lend ₹2,000+." />
          <InsightCard id={17} type="green" badge="PRICING POWER" title="APR ≥ 46% Generates 22.8% Annualized Net" body="High contractual interest rates (46%–48%) provide a wide gross margin that comfortably covers platform fees and standard defaults." metrics={[{ label: 'APR Band', value: '46%–48%' }, { label: 'Gross Margin', value: '47.2%' }, { label: 'Net Yield', value: '+22.8%' }]} directive="RULE: Filter for loans with APR between 44% and 48%." />
          <InsightCard id={18} type="yellow" badge="FEE DRAG" title="Low APR (<44%) Squeezed Out by 6% Fee" body="Because LenDenClub charges a 6% platform fee on principal, low APR loans (40%–43.9%) leave almost no margin after minor defaults (+1.66% net)." metrics={[{ label: 'Platform Fee', value: '6.0%' }, { label: 'Net Spread', value: '1.66%' }, { label: 'Status', value: 'Unprofitable' }]} directive="RULE: Avoid low APR loans even if scores look safe." />
          <InsightCard id={19} type="green" badge="WEALTH COMPOUNDING" title="Compounding Simulation: ₹10k Grows to ₹12.7k" body="In our 1-year compounding model, ₹10k invested strictly in 2M loans grew to ₹12,739, compared to declining to ₹8,921 in 12M loans." metrics={[{ label: '2M Value', value: '₹12,739' }, { label: '12M Value', value: '₹8,921' }, { label: 'Spread', value: '+₹3,818' }]} directive="RULE: Continuous reinvestment is key to capturing velocity." />
          <InsightCard id={20} type="green" badge="VELOCITY SPREAD" title="Net Velocity Spread: Peak Alpha at 2M–3M" body="The velocity-adjusted net spread (Annualized Return minus Annualized NPA) peaks at +21.7% on 2M tenures, confirming optimal capital deployment." metrics={[{ label: '2M Spread', value: '+21.69%' }, { label: '3M Spread', value: '+6.72%' }, { label: '12M Spread', value: '-26.61%' }]} directive="RULE: Rebalance book towards 2M loans to maximize spread." />
        </div>
      </div>
    </div>
  );
}
