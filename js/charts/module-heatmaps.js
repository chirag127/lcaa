/**
 * Module 2D Heatmaps & Cross-Cohort Risk Matrices (Charts 63 - 72)
 */

window.LDC_MODULE_HEATMAPS = {
  render: function(data) {
    // 1. Chart 63: Score 20-pt x Tenure -> Net Return
    this.renderMatrixTable(
      'heatmap-score-tenure-net-container',
      data.heatmap_score_tenure_net,
      'Score Band',
      ['2', '3', '4', '5', '6', '12'],
      ['2M', '3M', '4M', '5M', '6M', '12M'],
      v => v !== null ? v + '%' : 'N/A',
      v => this.getReturnColor(v)
    );

    // 2. Chart 64: Score 20-pt x Tenure -> NPA Rate
    this.renderMatrixTable(
      'heatmap-score-tenure-npa-container',
      data.heatmap_score_tenure_npa,
      'Score Band',
      ['2', '3', '4', '5', '6', '12'],
      ['2M', '3M', '4M', '5M', '6M', '12M'],
      v => v !== null ? v + '%' : 'N/A',
      v => this.getNpaColor(v)
    );

    // 3. Chart 65: Ticket Size x Tenure -> Net Return
    this.renderMatrixTable(
      'heatmap-amt-tenure-net-container',
      data.heatmap_amt_tenure_net,
      'Ticket Tier',
      ['2', '3', '4', '5', '6', '12'],
      ['2M', '3M', '4M', '5M', '6M', '12M'],
      v => v !== null ? v + '%' : 'N/A',
      v => this.getReturnColor(v)
    );

    // 4. Chart 66: Ticket Size x Score -> NPA Rate
    this.renderMatrixTable(
      'heatmap-amt-score-npa-container',
      data.heatmap_amt_score_npa,
      'Ticket Tier',
      ['700-719', '720-739', '740-759', '760-779', '780-799', '800+'],
      ['700-719', '720-739', '740-759', '760-779', '780-799', '800+'],
      v => v !== null ? v + '%' : 'N/A',
      v => this.getNpaColor(v)
    );

    // 5. Chart 67: APR Tier x Tenure -> Net Return
    this.renderMatrixTable(
      'heatmap-rate-tenure-net-container',
      data.heatmap_rate_tenure_net,
      'APR Tier',
      ['2', '3', '4', '5', '6', '12'],
      ['2M', '3M', '4M', '5M', '6M', '12M'],
      v => v !== null ? v + '%' : 'N/A',
      v => this.getReturnColor(v)
    );

    // 6. Chart 68: APR Tier x Score 20-pt -> Net Return
    this.renderMatrixTable(
      'heatmap-rate-score-net-container',
      data.heatmap_rate_score_net,
      'APR Tier',
      ['700-719', '720-739', '740-759', '760-779', '780-799', '800+'],
      ['700-719', '720-739', '740-759', '760-779', '780-799', '800+'],
      v => v !== null ? v + '%' : 'N/A',
      v => this.getReturnColor(v)
    );

    // 7. Chart 69: DPD Stage x Tenure -> Loan Volume
    this.renderMatrixTable(
      'heatmap-dpd-tenure-vol-container',
      data.heatmap_dpd_tenure_vol,
      'DPD Risk Stage',
      ['2', '3', '4', '5', '6', '12'],
      ['2M', '3M', '4M', '5M', '6M', '12M'],
      v => v !== null ? v : 0,
      v => v > 50 ? 'rgba(239, 68, 68, 0.4)' : (v > 10 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.2)')
    );

    // 8. Chart 70: DPD Stage x Ticket Tier -> Capital Outstanding
    this.renderMatrixTable(
      'heatmap-dpd-amt-pos-container',
      data.heatmap_dpd_amt_pos,
      'DPD Risk Stage',
      ['₹250', '₹500', '₹750-1000', '₹1250-2000', '₹2500-4000'],
      ['₹250', '₹500', '₹1k', '₹1.5k-2k', '₹2.5k-4k'],
      v => v !== null ? '₹' + v : '₹0',
      v => v > 10000 ? 'rgba(239, 68, 68, 0.4)' : (v > 2000 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.2)')
    );

    // 9. Chart 71: Repayment Type x Tenure -> Net Return
    this.renderMatrixTable(
      'heatmap-repay-tenure-net-container',
      data.heatmap_repay_tenure_net,
      'Repayment Mode',
      ['2', '3', '4', '5', '6', '12'],
      ['2M', '3M', '4M', '5M', '6M', '12M'],
      v => v !== null ? v + '%' : 'N/A',
      v => this.getReturnColor(v)
    );

    // 10. Chart 72: Score 15-pt x Tenure -> Net Return
    this.renderMatrixTable(
      'heatmap-score15-tenure-net-container',
      data.heatmap_score15_tenure_net,
      '15-pt Score Band',
      ['2', '3', '4', '5', '6', '12'],
      ['2M', '3M', '4M', '5M', '6M', '12M'],
      v => v !== null ? v + '%' : 'N/A',
      v => this.getReturnColor(v)
    );
  },

  renderMatrixTable: function(containerId, rows, rowHeader, colKeys, colLabels, formatFn, colorFn) {
    const container = document.getElementById(containerId);
    if (!container || !rows) return;

    let html = `<table class="heatmap-table"><thead><tr><th>${rowHeader}</th>`;
    colLabels.forEach(lbl => html += `<th>${lbl}</th>`);
    html += `</tr></thead><tbody>`;

    rows.forEach(r => {
      const rLabel = r.score_bin || r.amount_tier || r.rate_tier || r.dpd_stage || r.repay_type || r.score_bin_15;
      html += `<tr><td style="font-weight:700; text-align:left; background:rgba(255,255,255,0.03);">${rLabel}</td>`;
      colKeys.forEach(k => {
        const val = r[k];
        const bg = colorFn(val);
        const text = formatFn(val);
        html += `<td style="background:${bg};" class="heatmap-cell">${text}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  },

  getReturnColor: function(val) {
    if (val === null || val === undefined) return 'rgba(255,255,255,0.02)';
    if (val >= 25) return 'rgba(16, 185, 129, 0.55)';
    if (val >= 18) return 'rgba(16, 185, 129, 0.35)';
    if (val >= 10) return 'rgba(6, 182, 212, 0.25)';
    if (val > 0) return 'rgba(245, 158, 11, 0.25)';
    return 'rgba(239, 68, 68, 0.55)';
  },

  getNpaColor: function(val) {
    if (val === null || val === undefined) return 'rgba(255,255,255,0.02)';
    if (val <= 4) return 'rgba(16, 185, 129, 0.4)';
    if (val <= 8) return 'rgba(6, 182, 212, 0.25)';
    if (val <= 15) return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(239, 68, 68, 0.55)';
  }
};
