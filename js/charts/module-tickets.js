/**
 * Module Ticket Size & Concentration Risk (Charts 43 - 52)
 */

window.LDC_MODULE_TICKETS = {
  render: function(data) {
    const c = window.LDC_CONFIG.colors;
    const amtRes = data.amount_resolved;
    const formatINR = window.LDC_CONFIG.formatINR;

    // Chart 43: Ticket Size Volume Share
    new Chart(document.getElementById('chart43'), {
      type: 'pie',
      data: {
        labels: amtRes.map(a => a.cohort),
        datasets: [{
          data: amtRes.map(a => a.loans),
          backgroundColor: [c.emerald, c.cyan, c.indigo, c.amber, c.crimson]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    // Chart 44: Ticket Size vs Annualized NPA Rate %
    new Chart(document.getElementById('chart44'), {
      type: 'bar',
      data: {
        labels: amtRes.map(a => a.cohort),
        datasets: [{
          label: 'Annualized NPA Rate (%)',
          data: amtRes.map(a => a.ann_npa_pct),
          backgroundColor: amtRes.map(a => a.ann_npa_pct > 20 ? c.crimson : c.amber),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 45: Ticket Size vs Annualized Net Return %
    new Chart(document.getElementById('chart45'), {
      type: 'bar',
      data: {
        labels: amtRes.map(a => a.cohort),
        datasets: [{
          label: 'Annualized Net Return (%)',
          data: amtRes.map(a => a.ann_net_pct),
          backgroundColor: amtRes.map(a => a.ann_net_pct > 15 ? c.emerald : (a.ann_net_pct > 0 ? c.amber : c.crimson)),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 46: Loss Severity per Default by Ticket Size
    new Chart(document.getElementById('chart46'), {
      type: 'bar',
      data: {
        labels: ['₹250 Default', '₹500 Default', '₹1,000 Default', '₹2,000 Default', '₹4,000 Default'],
        datasets: [{
          label: 'Unrecovered Capital per Default (₹)',
          data: [230, 480, 960, 1850, 3977],
          backgroundColor: c.crimson,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 47: Total Rupee Profit Contribution vs Rupee NPA Loss
    new Chart(document.getElementById('chart47'), {
      type: 'bar',
      data: {
        labels: amtRes.map(a => a.cohort),
        datasets: [
          { label: 'Net Rupee Profit (₹)', data: amtRes.map(a => a.net_profit), backgroundColor: c.emerald },
          { label: 'NPA Rupee Loss (₹)', data: amtRes.map(a => -a.npa_amount), backgroundColor: c.crimson }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 48: Offset Ratio (Successful Loans Needed to Recover 1 Default)
    new Chart(document.getElementById('chart48'), {
      type: 'bar',
      data: {
        labels: ['₹250 Default', '₹500 Default', '₹1,000 Default', '₹2,000 Default', '₹4,000 Default'],
        datasets: [{
          label: 'Number of Performing Loans Needed to Offset 1 Default',
          data: [9, 19, 38, 74, 159],
          backgroundColor: [c.emerald, c.cyan, c.amber, c.crimson, c.crimsonLight],
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Loans Needed' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 49: Capital Disbursed by Ticket Size (₹)
    new Chart(document.getElementById('chart49'), {
      type: 'bar',
      data: {
        labels: amtRes.map(a => a.cohort),
        datasets: [{
          label: 'Total Disbursed (₹)',
          data: amtRes.map(a => a.disbursed),
          backgroundColor: c.cyan,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 50: Default Frequency by Ticket Size (%)
    new Chart(document.getElementById('chart50'), {
      type: 'bar',
      data: {
        labels: amtRes.map(a => a.cohort),
        datasets: [{
          label: 'Default Frequency (% of loans)',
          data: amtRes.map(a => a.npa_count_pct),
          backgroundColor: amtRes.map(a => a.npa_count_pct > 8 ? c.crimson : c.amber),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 51: Average Recovery Rate per Ticket Tier (%)
    new Chart(document.getElementById('chart51'), {
      type: 'bar',
      data: {
        labels: amtRes.map(a => a.cohort),
        datasets: [{
          label: 'Principal Recovery %',
          data: amtRes.map(a => ((a.principal_received / a.disbursed) * 100).toFixed(1)),
          backgroundColor: amtRes.map(a => (a.principal_received / a.disbursed) > 0.95 ? c.emerald : (a.principal_received / a.disbursed > 0.9 ? c.amber : c.crimson)),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 52: Portfolio Volatility Index by Ticket Size
    new Chart(document.getElementById('chart52'), {
      type: 'bar',
      data: {
        labels: amtRes.map(a => a.cohort),
        datasets: [{
          label: 'Downside Volatility Index (1-100)',
          data: [15, 25, 42, 88, 98],
          backgroundColor: [c.emerald, c.emeraldLight, c.amber, c.crimson, c.crimsonLight],
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: 100, grid: { color: c.borderSubtle } } } }
    });
  }
};
