/**
 * Module Executive Cockpit & Strategy (Charts 1 - 10)
 */

window.LDC_MODULE_EXECUTIVE = {
  render: function(data) {
    const c = window.LDC_CONFIG.colors;
    const kpi = data.portfolio_kpis;
    const tenureRes = data.tenure_resolved;
    const amtRes = data.amount_resolved;
    const vintage = data.vintage_trend;
    const formatINR = window.LDC_CONFIG.formatINR;

    // Chart 1: Status Distribution
    new Chart(document.getElementById('chart1'), {
      type: 'doughnut',
      data: {
        labels: ['Closed (Repaid)', 'Active (Performing)', 'NPA (Defaulted)', 'Rejected/Cancelled'],
        datasets: [{
          data: [kpi.closed_loans, kpi.active_loans, kpi.npa_loans, kpi.rejected_loans],
          backgroundColor: [c.emerald, c.cyan, c.crimson, c.indigo],
          borderColor: '#0a0e17',
          borderWidth: 2
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    // Chart 2: Net Cashflow Waterfall
    new Chart(document.getElementById('chart2'), {
      type: 'bar',
      data: {
        labels: ['Lent Capital', 'Principal Repaid', 'Gross Interest', 'Platform Fees', 'NPA Loss', 'Net Realized Profit'],
        datasets: [{
          data: [kpi.total_disbursed, kpi.principal_received, kpi.interest_received, -kpi.platform_fee, -kpi.npa_amount, kpi.realized_net_profit],
          backgroundColor: [c.cyan, c.emerald, c.emeraldLight, c.amber, c.crimson, c.purple],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } }
      }
    });

    // Chart 3: Realized Net Annualized Return by Tenure
    new Chart(document.getElementById('chart3'), {
      type: 'bar',
      data: {
        labels: tenureRes.map(t => t.cohort + ' Months'),
        datasets: [{
          label: 'Annualized Net Return (%)',
          data: tenureRes.map(t => t.ann_net_pct),
          backgroundColor: tenureRes.map(t => t.ann_net_pct > 15 ? c.emerald : (t.ann_net_pct > 0 ? c.amber : c.crimson)),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } }
      }
    });

    // Chart 4: Net Annualized Return by Ticket Size
    new Chart(document.getElementById('chart4'), {
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
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } }
      }
    });

    // Chart 5: Risk vs Return Scatter Plot
    const scatterPoints = tenureRes.map(t => ({
      x: t.ann_npa_pct,
      y: t.ann_net_pct,
      label: t.cohort + 'M Tenure'
    }));
    new Chart(document.getElementById('chart5'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Tenure Cohorts',
          data: scatterPoints,
          backgroundColor: scatterPoints.map(p => p.y > 15 ? c.emerald : (p.y > 0 ? c.amber : c.crimson)),
          pointRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Annualized NPA %' }, grid: { color: c.borderSubtle } },
          y: { title: { display: true, text: 'Annualized Net Return %' }, grid: { color: c.borderSubtle } }
        }
      }
    });

    // Chart 6: Cumulative Cashflow Curve
    new Chart(document.getElementById('chart6'), {
      type: 'line',
      data: {
        labels: vintage.map(v => v.month),
        datasets: [
          { label: 'Cumulative Cash Recovered', data: vintage.map(v => v.cum_received), borderColor: c.emerald, backgroundColor: c.emeraldGlow, fill: true },
          { label: 'Cumulative Disbursed', data: vintage.map(v => v.cum_disbursed), borderColor: c.cyan, borderDash: [4, 4], fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } }
      }
    });

    // Chart 7: Capital Recovery Rate % by Month
    new Chart(document.getElementById('chart7'), {
      type: 'line',
      data: {
        labels: vintage.map(v => v.month),
        datasets: [{
          label: 'Capital Recovery Ratio (%)',
          data: vintage.map(v => ((v.cum_received / v.cum_disbursed) * 100).toFixed(1)),
          borderColor: c.cyan,
          backgroundColor: c.cyanGlow,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: c.borderSubtle } } }
      }
    });

    // Chart 8: Gross Interest Yield vs Fee Burden
    new Chart(document.getElementById('chart8'), {
      type: 'bar',
      data: {
        labels: ['Gross Interest Earned', 'Platform Fees Paid', 'NPA Loss Incurred', 'Net Retained Alpha'],
        datasets: [{
          data: [kpi.interest_received, kpi.platform_fee, kpi.npa_amount, kpi.realized_net_profit],
          backgroundColor: [c.emerald, c.amber, c.crimson, c.purple],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } }
      }
    });

    // Chart 9: Loan Outcome Win Rate % (Resolved Loans)
    const resolvedTotal = kpi.closed_loans + kpi.npa_loans;
    new Chart(document.getElementById('chart9'), {
      type: 'doughnut',
      data: {
        labels: [`Repaid Full: ${((kpi.closed_loans / resolvedTotal) * 100).toFixed(1)}%`, `Defaulted: ${((kpi.npa_loans / resolvedTotal) * 100).toFixed(1)}%`],
        datasets: [{
          data: [kpi.closed_loans, kpi.npa_loans],
          backgroundColor: [c.emerald, c.crimson]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    // Chart 10: Cumulative Realized Net Alpha Progression (₹)
    new Chart(document.getElementById('chart10'), {
      type: 'line',
      data: {
        labels: vintage.map(v => v.month),
        datasets: [{
          label: 'Cumulative Net Profit (₹)',
          data: vintage.map(v => v.cum_net_profit),
          borderColor: c.emerald,
          backgroundColor: c.emeraldGlow,
          fill: true,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: c.borderSubtle } } }
      }
    });
  }
};
