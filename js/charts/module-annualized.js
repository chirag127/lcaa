/**
 * Module Annualized vs Raw Analytics (Charts 11 - 20)
 */

window.LDC_MODULE_ANNUALIZED = {
  render: function(data) {
    const c = window.LDC_CONFIG.colors;
    const score20 = data.score_20_resolved;
    const score15 = data.score_15_resolved;
    const tenureRes = data.tenure_resolved;

    // Chart 11: Dual Line - 20-pt Score NPA %
    new Chart(document.getElementById('chart11'), {
      type: 'line',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [
          { label: 'Annualized NPA % (with multiplier)', data: score20.map(s => s.ann_npa_pct), borderColor: c.crimson, backgroundColor: c.crimsonGlow, fill: true, pointRadius: 5 },
          { label: 'Raw Tenure NPA %', data: score20.map(s => s.tenure_npa_pct), borderColor: c.amber, borderDash: [4, 4], pointRadius: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 12: Dual Line - 20-pt Score Net Return %
    new Chart(document.getElementById('chart12'), {
      type: 'line',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [
          { label: 'Annualized Net Return %', data: score20.map(s => s.ann_net_pct), borderColor: c.emerald, backgroundColor: c.emeraldGlow, fill: true, pointRadius: 5 },
          { label: 'Raw Tenure Net Return %', data: score20.map(s => s.tenure_net_pct), borderColor: c.cyan, borderDash: [4, 4], pointRadius: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 13: Dual Line - 15-pt Score NPA %
    new Chart(document.getElementById('chart13'), {
      type: 'line',
      data: {
        labels: score15.map(s => s.cohort),
        datasets: [
          { label: 'Annualized NPA %', data: score15.map(s => s.ann_npa_pct), borderColor: c.crimson, pointRadius: 4 },
          { label: 'Raw Tenure NPA %', data: score15.map(s => s.tenure_npa_pct), borderColor: c.amber, borderDash: [4, 4], pointRadius: 3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 14: Dual Line - 15-pt Score Net Return %
    new Chart(document.getElementById('chart14'), {
      type: 'line',
      data: {
        labels: score15.map(s => s.cohort),
        datasets: [
          { label: 'Annualized Net Return %', data: score15.map(s => s.ann_net_pct), borderColor: c.emerald, pointRadius: 4 },
          { label: 'Raw Tenure Net Return %', data: score15.map(s => s.tenure_net_pct), borderColor: c.cyan, borderDash: [4, 4], pointRadius: 3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 15: Capital Turnover Velocity Multiplier (12 / Tenure)
    new Chart(document.getElementById('chart15'), {
      type: 'bar',
      data: {
        labels: ['2 Months', '3 Months', '4 Months', '5 Months', '6 Months', '12 Months'],
        datasets: [{
          label: 'Annualization Multiplier (Cycles / Year)',
          data: [6.0, 4.0, 3.0, 2.4, 2.0, 1.0],
          backgroundColor: [c.emerald, c.emeraldLight, c.cyan, c.indigo, c.amber, c.crimson],
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Cycles / Year' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 16: Dual Bar - Tenure vs Annualized Fee Drag
    new Chart(document.getElementById('chart16'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [
          { label: 'Annualized Fee %', data: tenureRes.map(t => t.ann_fee_pct), backgroundColor: c.amber, borderRadius: 4 },
          { label: 'Raw Tenure Fee %', data: tenureRes.map(t => t.tenure_fee_pct), backgroundColor: c.indigo, borderRadius: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 17: Compounding Multiplier Yield Boost (Net Delta %)
    new Chart(document.getElementById('chart17'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Annualization Yield Boost (Ann % - Raw %)',
          data: tenureRes.map(t => (t.ann_net_pct - t.tenure_net_pct).toFixed(2)),
          backgroundColor: tenureRes.map(t => (t.ann_net_pct - t.tenure_net_pct) > 10 ? c.emerald : (t.ann_net_pct - t.tenure_net_pct > 0 ? c.cyan : c.crimson)),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 18: Gross Yield vs Net Yield Spread by Tenure
    new Chart(document.getElementById('chart18'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [
          { label: 'Contractual APR (%)', data: tenureRes.map(t => t.avg_apr), backgroundColor: c.cyan },
          { label: 'Realized Net Ann. Return (%)', data: tenureRes.map(t => t.ann_net_pct), backgroundColor: c.emerald }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 19: Annualized Loss Drag % by Tenure
    new Chart(document.getElementById('chart19'), {
      type: 'line',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Annualized Default Drag (%)',
          data: tenureRes.map(t => t.ann_npa_pct),
          borderColor: c.crimson,
          backgroundColor: c.crimsonGlow,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 20: Net Spread Retention Ratio (%)
    new Chart(document.getElementById('chart20'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + 'M'),
        datasets: [{
          label: 'Spread Retention (Net / Gross %)',
          data: tenureRes.map(t => t.avg_apr > 0 ? ((t.ann_net_pct / t.avg_apr) * 100).toFixed(1) : 0),
          backgroundColor: tenureRes.map(t => t.ann_net_pct > 15 ? c.emerald : (t.ann_net_pct > 0 ? c.amber : c.crimson)),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });
  }
};
