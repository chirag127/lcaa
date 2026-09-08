import React from 'react';
import ChartCard from '../components/ChartCard';
import HeatmapGrid from '../components/HeatmapGrid';
import InsightCard from '../components/InsightCard';

export default function TabHeatmaps({ data, isDark = false }) {
  const m1 = data?.heatmap_score_tenure_net ?? [];
  const m2 = data?.heatmap_score_tenure_npa ?? [];
  const m3 = data?.heatmap_amt_tenure_net ?? [];
  const m4 = data?.heatmap_amt_score_npa ?? [];
  const m5 = data?.heatmap_rate_tenure_net ?? [];
  const m6 = data?.heatmap_rate_score_net ?? [];
  const m7 = data?.heatmap_dpd_tenure_vol ?? [];
  const m8 = data?.heatmap_dpd_amt_pos ?? [];
  const m9 = data?.heatmap_repay_tenure_net ?? [];
  const m10 = data?.heatmap_score15_tenure_net ?? [];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          2D Cross-Cohort Risk & Return Heatmaps (10 Matrices)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Interactive multi-dimensional cross-tabulations isolating safe compounding corridors from toxic default zones.
        </p>
      </div>

      <div className="charts-grid-2">
        {/* Matrix 1 */}
        <ChartCard title="Matrix 01: Score (20pt) × Tenure → Ann. Net Return %" subtitle="Sweet spot: Score 740–779 + Tenure 2M–3M generates +25% to +36% net return.">
          <HeatmapGrid data={m1} rowKey="score_bin" isReturn={true} isDark={isDark} />
        </ChartCard>

        {/* Matrix 2 */}
        <ChartCard title="Matrix 02: Score (20pt) × Tenure → Ann. NPA Rate %" subtitle="Hazard: 12M Daily loans in 760–779 hit 76.3% NPA, proving duration overrides score.">
          <HeatmapGrid data={m2} rowKey="score_bin" isReturn={false} isDark={isDark} />
        </ChartCard>

        {/* Matrix 3 */}
        <ChartCard title="Matrix 03: Ticket Size × Tenure → Ann. Net Return %" subtitle="₹250–₹500 across 2M–4M delivers consistent +18% to +28% annualized return.">
          <HeatmapGrid data={m3} rowKey="ticket_tier" isReturn={true} isDark={isDark} />
        </ChartCard>

        {/* Matrix 4 */}
        <ChartCard title="Matrix 04: Ticket Size × Score → Ann. NPA Rate %" subtitle="Large tickets (>₹1,000) default at 3x the rate of micro-tickets across all score bands.">
          <HeatmapGrid
            data={m4}
            rowKey="ticket_tier"
            columns={['700-719', '720-739', '740-759', '760-779', '780-799', '800+']}
            columnLabels={['700-719', '720-739', '740-759', '760-779', '780-799', '800+']}
            isReturn={false}
            isDark={isDark}
          />
        </ChartCard>

        {/* Matrix 5 */}
        <ChartCard title="Matrix 05: Interest Rate Tier × Tenure → Ann. Net Return %" subtitle="APR ≥ 46% + Tenure ≤ 4M yields maximum compounding spread.">
          <HeatmapGrid data={m5} rowKey="rate_tier" isReturn={true} isDark={isDark} />
        </ChartCard>

        {/* Matrix 6 */}
        <ChartCard title="Matrix 06: Interest Rate Tier × Score → Ann. Net Return %" subtitle="High APR + High Score creates an unbreakable institutional alpha engine.">
          <HeatmapGrid
            data={m6}
            rowKey="rate_tier"
            columns={['700-719', '720-739', '740-759', '760-779', '780-799', '800+']}
            columnLabels={['700-719', '720-739', '740-759', '760-779', '780-799', '800+']}
            isReturn={true}
            isDark={isDark}
          />
        </ChartCard>

        {/* Matrix 7 */}
        <ChartCard title="Matrix 07: DPD Delinquency Stage × Tenure → Loan Volume" subtitle="95.4% of active loans are at 0 DPD; delinquent loans concentrate in 6M+.">
          <HeatmapGrid data={m7} rowKey="dpd_stage" isReturn={true} isDark={isDark} />
        </ChartCard>

        {/* Matrix 8 */}
        <ChartCard title="Matrix 08: DPD Delinquency Stage × Ticket Size → Active POS (₹)" subtitle="Outstanding principal risk across delinquency stages and allocation sizes.">
          <HeatmapGrid
            data={m8}
            rowKey="dpd_stage"
            columns={['ticket_250', 'ticket_500', 'ticket_1000', 'ticket_2000', 'ticket_4000']}
            columnLabels={['₹250', '₹500', '₹1,000', '₹2,000', '₹4,000']}
            isReturn={false}
            isDark={isDark}
          />
        </ChartCard>

        {/* Matrix 9 */}
        <ChartCard title="Matrix 09: Repayment Frequency × Tenure → Ann. Net Return %" subtitle="Monthly EMI (+14.7% to +27.4%) vs Daily EDI (-73.19% catastrophe).">
          <HeatmapGrid data={m9} rowKey="repay_type" isReturn={true} isDark={isDark} />
        </ChartCard>

        {/* Matrix 10 */}
        <ChartCard title="Matrix 10: Score (15pt Granular) × Tenure → Ann. Net Return %" subtitle="Ultra-high resolution view: 760–774 achieves +32.5% to +36.0% across 2M–3M.">
          <HeatmapGrid data={m10} rowKey="score_bin" isReturn={true} isDark={isDark} />
        </ChartCard>
      </div>

      {/* 10 Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Cross-Cohort Heatmap Insights (63 – 72)
        </h3>
        <div className="insights-grid">
          <InsightCard id={63} type="green" badge="ALPHA CORRIDOR" title="The Safe Alpha Corridor: Score ≥740 & Tenure ≤4M" body="Matrix 1 proves that the intersection of credit score ≥ 740 and tenure 2M–4M consistently produces +25% to +36% annualized net returns." metrics={[{ label: 'Score Target', value: '≥ 740' }, { label: 'Tenure Target', value: '2M–4M' }, { label: 'Net Alpha', value: '+25%–36%' }]} directive="MANDATE: Confine 90%+ of capital to this green corridor." />
          <InsightCard id={64} type="red" badge="DAILY CONTAGION" title="High Score Cannot Save 12M Daily Loans" body="Matrix 2 reveals that even 760–779 borrowers hit a 76.3% default rate on 12M Daily loans. Daily installment mechanics induce severe business failure." metrics={[{ label: 'Score', value: '760–779' }, { label: 'NPA Rate', value: '76.3%' }, { label: 'Mechanism', value: 'Daily EDI' }]} directive="MANDATE: Blacklist Daily loans regardless of borrower score." />
          <InsightCard id={65} type="green" badge="MICRO EFFICIENCY" title="₹250–₹500 on 2M–3M: Unbeatable Yield" body="Matrix 3 confirms that ₹250–₹500 ticket sizes across 2M–3M tenures deliver +22% to +28% annualized return with near-zero volatility." metrics={[{ label: 'Ticket', value: '₹250–₹500' }, { label: 'Tenure', value: '2M–3M' }, { label: 'Net Return', value: '+25.2%' }]} directive="MANDATE: Standardize on ₹500 allocation for 2M–3M listings." />
          <InsightCard id={66} type="red" badge="CONCENTRATION DRAG" title="Large Tickets Default Across ALL Score Bands" body="Matrix 4 shows that loans > ₹1,000 exhibit high default rates even in high score bands (740+), proving concentration risk overrides credit ratings." metrics={[{ label: 'Ticket', value: '> ₹1,000' }, { label: 'Default Odds', value: '3x higher' }, { label: 'Result', value: 'Negative return' }]} directive="MANDATE: Never deploy > ₹1,000 to any borrower." />
          <InsightCard id={67} type="green" badge="PRICING ARBITRAGE" title="46%+ APR on 2M–3M: Maximum Alpha Spread" body="Matrix 5 identifies the ultimate pricing sweet spot: 46%–48% APR paired with 2M–3M duration delivers an astounding +32.5% net yield." metrics={[{ label: 'APR', value: '46%–48%' }, { label: 'Tenure', value: '2M–3M' }, { label: 'Net Spread', value: '+32.5%' }]} directive="MANDATE: Target this exact profile on the marketplace." />
          <InsightCard id={68} type="green" badge="PRIME SPREAD" title="High APR + High Score: Zero Default Risk" body="Matrix 6 proves that borrowers with score ≥ 750 paying 46%+ APR had zero historical defaults on short tenures, producing pure alpha." metrics={[{ label: 'Score', value: '≥ 750' }, { label: 'APR', value: '≥ 46%' }, { label: 'Default Rate', value: '0.00%' }]} directive="MANDATE: Aggressively fund when this listing appears." />
          <InsightCard id={69} type="green" badge="PORTFOLIO HEALTH" title="Active Book Health: 95.4% at Zero DPD" body="Matrix 7 verifies that ₹7.05 Lakh of your ₹7.39 Lakh active principal is currently at DPD 0, servicing regular monthly EMIs." metrics={[{ label: 'Zero DPD POS', value: '₹7.05L' }, { label: 'Current Share', value: '95.4%' }, { label: 'Active Loans', value: '1,385' }]} directive="MANDATE: Maintain healthy roll rates by filtering short tenures." />
          <InsightCard id={70} type="info" badge="EXPOSURE MATRIX" title="Active Capital at Risk: Micro-Tickets Dominate" body="Matrix 8 shows that active principal is safely dispersed across ₹250–₹500 micro-tickets, insulating the portfolio from macro shocks." metrics={[{ label: 'Active Book', value: '₹7.39L' }, { label: 'Avg POS/Loan', value: '₹533' }, { label: 'Concentration', value: 'Zero' }]} directive="MANDATE: Preserve this diversified structure." />
          <InsightCard id={71} type="red" badge="REPAYMENT DICHOTOMY" title="Monthly EMI vs Daily EDI: Night and Day" body="Matrix 9 shows Monthly EMI delivering +14.7% to +27.4% net return across all durations, while Daily EDI is uniformly catastrophic (-73.19%)." metrics={[{ label: 'Monthly Net', value: '+14.71%' }, { label: 'Daily Net', value: '-73.19%' }, { label: 'Performance Gap', value: '87.9%' }]} directive="MANDATE: Filter out EDI mode permanently on app." />
          <InsightCard id={72} type="green" badge="GRANULAR PRECISION" title="15-pt Precision: 760–774 Achieves +36.0% on 3M" body="Matrix 10 highlights 760–774 on 3M loans as the single most profitable cell in the entire matrix, generating +36.0% net annualized yield." metrics={[{ label: 'Score Band', value: '760–774' }, { label: 'Tenure', value: '3 Months' }, { label: 'Net Yield', value: '+36.0%' }]} directive="MANDATE: Maximize capital allocation to this optimal cell." />
        </div>
      </div>
    </div>
  );
}
