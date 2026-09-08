/**
 * Module Tenure & Duration Dynamics (Charts 33 - 42)
 */

window.LDC_MODULE_TENURE = {
  render: function(data) {
    const c = window.LDC_CONFIG.colors;
    const tenureRes = data.tenure_resolved;
    const formatINR = window.LDC_CONFIG.formatINR;

    // Chart 33: Loan Count & Disbursed Capital
    new Chart(document.getElementById('chart33'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [
          { type: 'bar', label: 'Disbursed (₹)', data: tenureRes.map(t => t.disbursed), backgroundColor: c.cyan, yAxisID: 'y' },
          { type: 'line', label: 'Loans Funded', data: tenureRes.map(t => t.loans), borderColor: c.amber, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { position: 'left', ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } },
          y1: { position: 'right', grid: { display: false } }
        }
      }
    });

    // Chart 34: NPA Rate Progression (Tenure vs Ann)
    new Chart(document.getElementById('chart34'), {
      type: 'line',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [
          { label: 'Annualized NPA %', data: tenureRes.map(t => t.ann_npa_pct), borderColor: c.crimson, borderWidth: 3 },
          { label: 'Raw Tenure NPA %', data: tenureRes.map(t => t.tenure_npa_pct), borderColor: c.amber, borderDash: [4, 4] }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 35: Net Realized Profit (₹) by Tenure
    new Chart(document.getElementById('chart35'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Net Realized Profit (₹)',
          data: tenureRes.map(t => t.net_profit),
          backgroundColor: tenureRes.map(t => t.net_profit > 0 ? c.emerald : c.crimson),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 36: Capital Turnover Velocity Multiplier (12 / Tenure)
    new Chart(document.getElementById('chart36'), {
      type: 'doughnut',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M (' + t.annualization_mult + 'x/yr)'),
        datasets: [{
          data: tenureRes.map(t => t.annualization_mult),
          backgroundColor: [c.emerald, c.emeraldLight, c.cyan, c.indigo, c.amber, c.crimson]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    // Chart 37: Tenure Performance Matrix (APR vs Net Yield vs NPA)
    new Chart(document.getElementById('chart37'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + ' Months Tenure'),
        datasets: [
          { label: 'Contractual APR (%)', data: tenureRes.map(t => t.avg_apr), backgroundColor: c.cyan },
          { label: 'Annualized Net Return (%)', data: tenureRes.map(t => t.ann_net_pct), backgroundColor: c.emerald },
          { label: 'Annualized NPA (%)', data: tenureRes.map(t => t.ann_npa_pct), backgroundColor: c.crimson }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 38: Average Days to Full Liquidity / Closure
    new Chart(document.getElementById('chart38'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Estimated Days to Complete Liquidity',
          data: tenureRes.map(t => parseInt(t.cohort) * 30.5),
          backgroundColor: c.indigo,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Days' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 39: Cumulative Cash Generated per Rupee Lent
    new Chart(document.getElementById('chart39'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Total Received per ₹100 Lent (₹)',
          data: tenureRes.map(t => ((t.principal_received + t.interest_received - t.platform_fee) / t.disbursed * 100).toFixed(1)),
          backgroundColor: tenureRes.map(t => t.ann_net_pct > 15 ? c.emerald : (t.ann_net_pct > 0 ? c.amber : c.crimson)),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => '₹' + v }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 40: Default Probability Acceleration Factor
    new Chart(document.getElementById('chart40'), {
      type: 'line',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Relative Default Odds vs 2M Baseline',
          data: tenureRes.map(t => (t.tenure_npa_pct / 0.95).toFixed(1)),
          borderColor: c.crimson,
          backgroundColor: c.crimsonGlow,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + 'x' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 41: Net Interest Margin Compression (APR - Fee - NPA)
    new Chart(document.getElementById('chart41'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Net Spread (APR - Fees - Ann NPA %)',
          data: tenureRes.map(t => (t.avg_apr - t.ann_fee_pct - t.ann_npa_pct).toFixed(1)),
          backgroundColor: tenureRes.map(t => t.ann_net_pct > 15 ? c.emerald : (t.ann_net_pct > 0 ? c.amber : c.crimson)),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 42: Total Rupee Loss Erased by Tenure (₹)
    new Chart(document.getElementById('chart42'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Rupee NPA Loss (₹)',
          data: tenureRes.map(t => t.npa_amount),
          backgroundColor: c.crimson,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } } }
    });
  }
};
