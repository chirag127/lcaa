/**
 * Module Credit Score Granular Analysis (Charts 21 - 32)
 */

window.LDC_MODULE_SCORES = {
  render: function(data) {
    const c = window.LDC_CONFIG.colors;
    const score20 = data.score_20_resolved;
    const score15 = data.score_15_resolved;
    const formatINR = window.LDC_CONFIG.formatINR;

    // Chart 21: 20-pt Volume Disbursed
    new Chart(document.getElementById('chart21'), {
      type: 'bar',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [{
          label: 'Disbursed Capital (₹)',
          data: score20.map(s => s.disbursed),
          backgroundColor: c.cyan,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 22: 20-pt NPA Rate (Tenure vs Ann)
    new Chart(document.getElementById('chart22'), {
      type: 'bar',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [
          { label: 'Annualized NPA %', data: score20.map(s => s.ann_npa_pct), backgroundColor: c.crimson, borderRadius: 4 },
          { label: 'Raw Tenure NPA %', data: score20.map(s => s.tenure_npa_pct), backgroundColor: c.amber, borderRadius: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 23: 20-pt Net Return %
    new Chart(document.getElementById('chart23'), {
      type: 'bar',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [{
          label: 'Annualized Net Return (%)',
          data: score20.map(s => s.ann_net_pct),
          backgroundColor: score20.map(s => s.ann_net_pct > 15 ? c.emerald : (s.ann_net_pct > 0 ? c.amber : c.crimson)),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 24: 15-pt Loan Count
    new Chart(document.getElementById('chart24'), {
      type: 'bar',
      data: {
        labels: score15.map(s => s.cohort),
        datasets: [{
          label: 'Number of Loans',
          data: score15.map(s => s.loans),
          backgroundColor: c.indigo,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: c.borderSubtle } } } }
    });

    // Chart 25: 15-pt Annualized NPA Line
    new Chart(document.getElementById('chart25'), {
      type: 'line',
      data: {
        labels: score15.map(s => s.cohort),
        datasets: [{
          label: 'Annualized NPA Rate (%)',
          data: score15.map(s => s.ann_npa_pct),
          borderColor: c.crimson,
          backgroundColor: c.crimsonGlow,
          fill: true,
          tension: 0.2
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 26: 15-pt Net Return Line
    new Chart(document.getElementById('chart26'), {
      type: 'line',
      data: {
        labels: score15.map(s => s.cohort),
        datasets: [{
          label: 'Annualized Net Return (%)',
          data: score15.map(s => s.ann_net_pct),
          borderColor: c.emerald,
          backgroundColor: c.emeraldGlow,
          fill: true,
          tension: 0.2
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 27: 15-pt Net Profit Generated (₹)
    new Chart(document.getElementById('chart27'), {
      type: 'bar',
      data: {
        labels: score15.map(s => s.cohort),
        datasets: [{
          label: 'Net Realized Profit (₹)',
          data: score15.map(s => s.net_profit),
          backgroundColor: score15.map(s => s.net_profit >= 0 ? c.emerald : c.crimson),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 28: 20-pt Default Frequency % (Count of Defaults / Total Loans)
    new Chart(document.getElementById('chart28'), {
      type: 'bar',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [{
          label: 'Default Frequency (% of loans defaulted)',
          data: score20.map(s => s.npa_count_pct),
          backgroundColor: c.crimsonLight,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 29: Cumulative Portfolio Share by Score Band (%)
    let cumLoans = 0;
    const totalLoans = score20.reduce((acc, s) => acc + s.loans, 0);
    const cumShare = score20.map(s => {
      cumLoans += s.loans;
      return ((cumLoans / totalLoans) * 100).toFixed(1);
    });
    new Chart(document.getElementById('chart29'), {
      type: 'line',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [{
          label: 'Cumulative Volume Share (%)',
          data: cumShare,
          borderColor: c.cyan,
          backgroundColor: c.cyanGlow,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 30: Average Contractual APR by 20-pt Score Band
    new Chart(document.getElementById('chart30'), {
      type: 'bar',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [{
          label: 'Average Contractual APR (%)',
          data: score20.map(s => s.avg_apr),
          backgroundColor: c.indigo,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 31: Net Spread Retention by Score Band (Net Return % / APR %)
    new Chart(document.getElementById('chart31'), {
      type: 'bar',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [{
          label: 'Spread Retention Efficiency (%)',
          data: score20.map(s => s.avg_apr > 0 ? ((s.ann_net_pct / s.avg_apr) * 100).toFixed(1) : 0),
          backgroundColor: score20.map(s => s.ann_net_pct > 15 ? c.emerald : (s.ann_net_pct > 0 ? c.amber : c.crimson)),
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } } }
    });

    // Chart 32: Cumulative NPA Losses across Score Bands (₹)
    let cumNpa = 0;
    const cumNpaArr = score20.map(s => {
      cumNpa += s.npa_amount;
      return cumNpa;
    });
    new Chart(document.getElementById('chart32'), {
      type: 'line',
      data: {
        labels: score20.map(s => s.cohort),
        datasets: [{
          label: 'Cumulative Rupee NPA Loss (₹)',
          data: cumNpaArr,
          borderColor: c.crimson,
          backgroundColor: c.crimsonGlow,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } } }
    });
  }
};
