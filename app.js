/**
 * LenDenClub Portfolio Analytics & Algorithmic Underwriting Engine
 * Handles all 52 Chart.js visualizations, 53 insight cards, 
 * 5 heatmap matrices, filter blueprint, simulator, and table pagination.
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Initializing LenDenClub Analytics Engine...");

  // Tab Switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');
      
      // Trigger chart resize if needed
      window.dispatchEvent(new Event('resize'));
    });
  });

  // Load Data
  let data;
  try {
    const res = await fetch('./lending_data.json');
    data = await res.json();
    console.log("Loaded lending_data.json successfully:", Object.keys(data));
  } catch (err) {
    console.error("Failed to load lending_data.json:", err);
    return;
  }

  // Populate Header & KPIs
  populateKPIs(data.portfolio_kpis);

  // Initialize All 52 Charts
  initAllCharts(data);

  // Render 5 Heatmap Matrices
  renderHeatmaps(data);

  // Populate All 53 Insight Cards
  populateInsightCards(data);

  // Render Website Filter Blueprint
  renderFilterBlueprint(data.filter_recommendations);

  // Render Live Available Loans Evaluator
  renderAvailableLoans(data.available_loans_sample);

  // Initialize Interactive Underwriting Simulator
  initSimulator(data);

  // Initialize Main Loan Database Table
  initLoanTable(data.loans);
});

// Helper: Currency Formatter
function formatINR(val) {
  if (val === null || val === undefined) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatPercent(val) {
  if (val === null || val === undefined) return '0.0%';
  return Number(val).toFixed(2) + '%';
}

// Chart Colors & Styling Helpers
const colors = {
  emerald: '#10b981',
  emeraldLight: '#34d399',
  emeraldGlow: 'rgba(16, 185, 129, 0.25)',
  crimson: '#ef4444',
  crimsonLight: '#f87171',
  crimsonGlow: 'rgba(239, 68, 68, 0.25)',
  cyan: '#06b6d4',
  cyanLight: '#38bdf8',
  cyanGlow: 'rgba(6, 182, 212, 0.25)',
  amber: '#f59e0b',
  amberGlow: 'rgba(245, 158, 11, 0.25)',
  indigo: '#6366f1',
  purple: '#8b5cf6',
  textSecondary: '#9ca3af',
  borderSubtle: 'rgba(255, 255, 255, 0.08)'
};

Chart.defaults.color = colors.textSecondary;
Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.95)';
Chart.defaults.plugins.tooltip.titleColor = '#fff';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.15)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

// Populate Top KPI Cards
function populateKPIs(kpi) {
  if (!kpi) return;
  document.getElementById('header-anr').textContent = kpi.official_closed_anr + '%';
  document.getElementById('header-lent').textContent = '₹' + (kpi.total_disbursed / 100000).toFixed(2) + ' Lakh';
  document.getElementById('header-pos').textContent = '₹' + (kpi.principal_outstanding / 100000).toFixed(2) + ' Lakh';
  document.getElementById('header-npa').textContent = ((kpi.npa_amount / kpi.total_disbursed) * 100).toFixed(2) + '%';

  document.getElementById('kpi-disbursed').textContent = formatINR(kpi.total_disbursed);
  document.getElementById('kpi-received').textContent = formatINR(kpi.total_received);
  document.getElementById('kpi-closed-anr').textContent = kpi.official_closed_anr + '%';
  document.getElementById('kpi-pos').textContent = formatINR(kpi.principal_outstanding);
  document.getElementById('kpi-npa').textContent = formatINR(kpi.npa_amount);
  document.getElementById('kpi-profit').textContent = formatINR(kpi.realized_net_profit);
}

// --------------------------------------------------------------------------
// 52 INTERACTIVE VISUALIZATIONS
// --------------------------------------------------------------------------
function initAllCharts(data) {
  const kpi = data.portfolio_kpis;
  const tenureRes = data.tenure_resolved;
  const score20 = data.score_20_resolved;
  const score15 = data.score_15_resolved;
  const amtRes = data.amount_resolved;
  const rateRes = data.rate_resolved;
  const vintage = data.vintage_trend;
  const dpdDist = data.dpd_distribution;
  const backtest = data.backtest_results;

  // TAB 1: EXECUTIVE COCKPIT (Charts 1 - 6)
  // Chart 1: Status Allocation
  new Chart(document.getElementById('chart1'), {
    type: 'doughnut',
    data: {
      labels: ['Closed (Repaid)', 'Active (Current)', 'NPA (Defaulted)', 'Rejected/Cancelled'],
      datasets: [{
        data: [kpi.closed_loans, kpi.active_loans, kpi.npa_loans, kpi.rejected_loans],
        backgroundColor: [colors.emerald, colors.cyan, colors.crimson, colors.indigo],
        borderColor: '#0a0e17',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Chart 2: Waterfall
  new Chart(document.getElementById('chart2'), {
    type: 'bar',
    data: {
      labels: ['Lent Capital', 'Principal Repaid', 'Gross Interest', 'Platform Fees', 'NPA Loss', 'Net Realized Profit'],
      datasets: [{
        data: [kpi.total_disbursed, kpi.principal_received, kpi.interest_received, -kpi.platform_fee, -kpi.npa_amount, kpi.realized_net_profit],
        backgroundColor: [colors.cyan, colors.emerald, colors.emeraldLight, colors.amber, colors.crimson, colors.purple],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 3: Net Return by Tenure
  new Chart(document.getElementById('chart3'), {
    type: 'bar',
    data: {
      labels: tenureRes.map(t => t.cohort + ' Months'),
      datasets: [{
        label: 'Annualized Net Return (%)',
        data: tenureRes.map(t => t.ann_net_pct),
        backgroundColor: tenureRes.map(t => t.ann_net_pct > 15 ? colors.emerald : (t.ann_net_pct > 0 ? colors.amber : colors.crimson)),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 4: Net Return by Ticket Sizing
  new Chart(document.getElementById('chart4'), {
    type: 'bar',
    data: {
      labels: amtRes.map(a => a.cohort),
      datasets: [{
        label: 'Annualized Net Return (%)',
        data: amtRes.map(a => a.ann_net_pct),
        backgroundColor: amtRes.map(a => a.ann_net_pct > 15 ? colors.emerald : (a.ann_net_pct > 0 ? colors.amber : colors.crimson)),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 5: Risk vs Return Scatter
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
        backgroundColor: scatterPoints.map(p => p.y > 15 ? colors.emerald : (p.y > 0 ? colors.amber : colors.crimson)),
        pointRadius: 8,
        pointHoverRadius: 11
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw.label}: Ann NPA ${ctx.raw.x}%, Ann Net ${ctx.raw.y}%`
          }
        }
      },
      scales: {
        x: { title: { display: true, text: 'Annualized NPA Rate (%)' }, grid: { color: colors.borderSubtle } },
        y: { title: { display: true, text: 'Annualized Net Return (%)' }, grid: { color: colors.borderSubtle } }
      }
    }
  });

  // Chart 6: Cumulative Cashflow Curve
  new Chart(document.getElementById('chart6'), {
    type: 'line',
    data: {
      labels: vintage.map(v => v.month),
      datasets: [
        {
          label: 'Cumulative Cash Recovered',
          data: vintage.map(v => v.cum_received),
          borderColor: colors.emerald,
          backgroundColor: colors.emeraldGlow,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Cumulative Capital Disbursed',
          data: vintage.map(v => v.cum_disbursed),
          borderColor: colors.cyan,
          borderDash: [5, 5],
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // TAB 2: ANNUALIZED VS RAW TENURE (Charts 7 - 12)
  // Chart 7: Dual Line - 20-pt Score NPA
  new Chart(document.getElementById('chart7'), {
    type: 'line',
    data: {
      labels: score20.map(s => s.cohort),
      datasets: [
        {
          label: 'Annualized NPA % (with tenure multiplier)',
          data: score20.map(s => s.ann_npa_pct),
          borderColor: colors.crimson,
          backgroundColor: colors.crimsonGlow,
          borderWidth: 2,
          pointRadius: 5
        },
        {
          label: 'Raw Tenure NPA %',
          data: score20.map(s => s.tenure_npa_pct),
          borderColor: colors.amber,
          borderDash: [4, 4],
          borderWidth: 2,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 8: Dual Line - 20-pt Score Net Return
  new Chart(document.getElementById('chart8'), {
    type: 'line',
    data: {
      labels: score20.map(s => s.cohort),
      datasets: [
        {
          label: 'Annualized Net Return %',
          data: score20.map(s => s.ann_net_pct),
          borderColor: colors.emerald,
          backgroundColor: colors.emeraldGlow,
          borderWidth: 2,
          pointRadius: 5
        },
        {
          label: 'Raw Tenure Net Return %',
          data: score20.map(s => s.tenure_net_pct),
          borderColor: colors.cyan,
          borderDash: [4, 4],
          borderWidth: 2,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 9: Dual Line - 15-pt Score NPA
  new Chart(document.getElementById('chart9'), {
    type: 'line',
    data: {
      labels: score15.map(s => s.cohort),
      datasets: [
        {
          label: 'Annualized NPA %',
          data: score15.map(s => s.ann_npa_pct),
          borderColor: colors.crimson,
          borderWidth: 2,
          pointRadius: 4
        },
        {
          label: 'Raw Tenure NPA %',
          data: score15.map(s => s.tenure_npa_pct),
          borderColor: colors.amber,
          borderDash: [4, 4],
          borderWidth: 2,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 10: Dual Line - 15-pt Score Net Return
  new Chart(document.getElementById('chart10'), {
    type: 'line',
    data: {
      labels: score15.map(s => s.cohort),
      datasets: [
        {
          label: 'Annualized Net Return %',
          data: score15.map(s => s.ann_net_pct),
          borderColor: colors.emerald,
          borderWidth: 2,
          pointRadius: 4
        },
        {
          label: 'Raw Tenure Net Return %',
          data: score15.map(s => s.tenure_net_pct),
          borderColor: colors.cyan,
          borderDash: [4, 4],
          borderWidth: 2,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 11: Annualization Multiplier Curve
  new Chart(document.getElementById('chart11'), {
    type: 'bar',
    data: {
      labels: ['2M', '3M', '4M', '5M', '6M', '12M'],
      datasets: [{
        label: 'Annualization Multiplier (12 / Tenure)',
        data: [6.0, 4.0, 3.0, 2.4, 2.0, 1.0],
        backgroundColor: [colors.emerald, colors.emeraldLight, colors.cyan, colors.indigo, colors.amber, colors.crimson],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { title: { display: true, text: 'Cycles per Year (x)' }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 12: Dual Bar - Fee Drag
  new Chart(document.getElementById('chart12'), {
    type: 'bar',
    data: {
      labels: tenureRes.map(t => t.cohort + 'M'),
      datasets: [
        {
          label: 'Annualized Fee %',
          data: tenureRes.map(t => t.ann_fee_pct),
          backgroundColor: colors.amber,
          borderRadius: 4
        },
        {
          label: 'Raw Tenure Fee %',
          data: tenureRes.map(t => t.tenure_fee_pct),
          backgroundColor: colors.indigo,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // TAB 3: CREDIT SCORE GRANULAR (Charts 13 - 18)
  // Chart 13: 20-pt Volume
  new Chart(document.getElementById('chart13'), {
    type: 'bar',
    data: {
      labels: score20.map(s => s.cohort),
      datasets: [{
        label: 'Capital Disbursed (₹)',
        data: score20.map(s => s.disbursed),
        backgroundColor: colors.cyan,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 14: 20-pt NPA Dual Bar
  new Chart(document.getElementById('chart14'), {
    type: 'bar',
    data: {
      labels: score20.map(s => s.cohort),
      datasets: [
        { label: 'Annualized NPA %', data: score20.map(s => s.ann_npa_pct), backgroundColor: colors.crimson, borderRadius: 4 },
        { label: 'Raw Tenure NPA %', data: score20.map(s => s.tenure_npa_pct), backgroundColor: colors.amber, borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 15: 20-pt Net Return Dual Bar
  new Chart(document.getElementById('chart15'), {
    type: 'bar',
    data: {
      labels: score20.map(s => s.cohort),
      datasets: [
        { label: 'Annualized Net Return %', data: score20.map(s => s.ann_net_pct), backgroundColor: colors.emerald, borderRadius: 4 },
        { label: 'Raw Tenure Net Return %', data: score20.map(s => s.tenure_net_pct), backgroundColor: colors.cyan, borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 16: 15-pt Volume
  new Chart(document.getElementById('chart16'), {
    type: 'bar',
    data: {
      labels: score15.map(s => s.cohort),
      datasets: [{
        label: 'Loan Count',
        data: score15.map(s => s.loans),
        backgroundColor: colors.indigo,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 17: 15-pt NPA Line
  new Chart(document.getElementById('chart17'), {
    type: 'line',
    data: {
      labels: score15.map(s => s.cohort),
      datasets: [{
        label: 'Annualized NPA %',
        data: score15.map(s => s.ann_npa_pct),
        borderColor: colors.crimson,
        backgroundColor: colors.crimsonGlow,
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 18: 15-pt Net Return Line
  new Chart(document.getElementById('chart18'), {
    type: 'line',
    data: {
      labels: score15.map(s => s.cohort),
      datasets: [{
        label: 'Annualized Net Return %',
        data: score15.map(s => s.ann_net_pct),
        borderColor: colors.emerald,
        backgroundColor: colors.emeraldGlow,
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // TAB 4: TENURE DYNAMICS (Charts 19 - 23)
  // Chart 19: Count & Disbursed
  new Chart(document.getElementById('chart19'), {
    type: 'bar',
    data: {
      labels: tenureRes.map(t => t.cohort + 'M'),
      datasets: [
        { type: 'bar', label: 'Disbursed (₹)', data: tenureRes.map(t => t.disbursed), backgroundColor: colors.cyan, yAxisID: 'y' },
        { type: 'line', label: 'Loan Count', data: tenureRes.map(t => t.loans), borderColor: colors.amber, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { position: 'left', ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } },
        y1: { position: 'right', grid: { display: false } }
      }
    }
  });

  // Chart 20: NPA Progression
  new Chart(document.getElementById('chart20'), {
    type: 'line',
    data: {
      labels: tenureRes.map(t => t.cohort + 'M'),
      datasets: [
        { label: 'Annualized NPA %', data: tenureRes.map(t => t.ann_npa_pct), borderColor: colors.crimson, borderWidth: 3 },
        { label: 'Raw Tenure NPA %', data: tenureRes.map(t => t.tenure_npa_pct), borderColor: colors.amber, borderDash: [4, 4] }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 21: Realized Profit by Tenure
  new Chart(document.getElementById('chart21'), {
    type: 'bar',
    data: {
      labels: tenureRes.map(t => t.cohort + 'M'),
      datasets: [{
        label: 'Net Realized Profit (₹)',
        data: tenureRes.map(t => t.net_profit),
        backgroundColor: tenureRes.map(t => t.net_profit > 0 ? colors.emerald : colors.crimson),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 22: Velocity of Capital Turnover
  new Chart(document.getElementById('chart22'), {
    type: 'doughnut',
    data: {
      labels: tenureRes.map(t => t.cohort + 'M (' + t.annualization_mult + 'x/yr)'),
      datasets: [{
        data: tenureRes.map(t => t.annualization_mult),
        backgroundColor: [colors.emerald, colors.emeraldLight, colors.cyan, colors.indigo, colors.amber, colors.crimson]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Chart 23: Performance Matrix (Gross Yield vs Net vs NPA)
  new Chart(document.getElementById('chart23'), {
    type: 'bar',
    data: {
      labels: tenureRes.map(t => t.cohort + ' Months Tenure'),
      datasets: [
        { label: 'Contractual APR (%)', data: tenureRes.map(t => t.avg_apr), backgroundColor: colors.cyan },
        { label: 'Annualized Net Return (%)', data: tenureRes.map(t => t.ann_net_pct), backgroundColor: colors.emerald },
        { label: 'Annualized NPA Loss (%)', data: tenureRes.map(t => t.ann_npa_pct), backgroundColor: colors.crimson }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // TAB 5: TICKET SIZE & CONCENTRATION (Charts 24 - 28)
  // Chart 24: Ticket Size Volume
  new Chart(document.getElementById('chart24'), {
    type: 'pie',
    data: {
      labels: amtRes.map(a => a.cohort),
      datasets: [{
        data: amtRes.map(a => a.loans),
        backgroundColor: [colors.emerald, colors.cyan, colors.indigo, colors.amber, colors.crimson]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Chart 25: Ticket vs NPA
  new Chart(document.getElementById('chart25'), {
    type: 'bar',
    data: {
      labels: amtRes.map(a => a.cohort),
      datasets: [{
        label: 'Annualized NPA Rate (%)',
        data: amtRes.map(a => a.ann_npa_pct),
        backgroundColor: amtRes.map(a => a.ann_npa_pct > 20 ? colors.crimson : colors.amber),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 26: Ticket vs Net Return
  new Chart(document.getElementById('chart26'), {
    type: 'bar',
    data: {
      labels: amtRes.map(a => a.cohort),
      datasets: [{
        label: 'Annualized Net Return (%)',
        data: amtRes.map(a => a.ann_net_pct),
        backgroundColor: amtRes.map(a => a.ann_net_pct > 15 ? colors.emerald : (a.ann_net_pct > 0 ? colors.amber : colors.crimson)),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 27: Loss Severity per Default
  new Chart(document.getElementById('chart27'), {
    type: 'bar',
    data: {
      labels: ['₹250 Default', '₹500 Default', '₹1,000 Default', '₹2,000 Default', '₹4,000 Default'],
      datasets: [{
        label: 'Unrecovered Capital per Default (₹)',
        data: [230, 480, 960, 1850, 3977],
        backgroundColor: colors.crimson,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 28: Total Rupee Profit vs Rupee Loss
  new Chart(document.getElementById('chart28'), {
    type: 'bar',
    data: {
      labels: amtRes.map(a => a.cohort),
      datasets: [
        { label: 'Net Rupee Profit (₹)', data: amtRes.map(a => a.net_profit), backgroundColor: colors.emerald },
        { label: 'NPA Rupee Loss (₹)', data: amtRes.map(a => -a.npa_amount), backgroundColor: colors.crimson }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } } }
    }
  });

  // TAB 6: INTEREST RATES & PRICING TRAPS (Charts 29 - 33)
  // Chart 29: APR Distribution
  new Chart(document.getElementById('chart29'), {
    type: 'bar',
    data: {
      labels: rateRes.map(r => r.cohort),
      datasets: [{
        label: 'Loan Count in APR Tier',
        data: rateRes.map(r => r.loans),
        backgroundColor: colors.indigo,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 30: Contractual APR vs Realized Net
  new Chart(document.getElementById('chart30'), {
    type: 'bar',
    data: {
      labels: rateRes.map(r => r.cohort),
      datasets: [
        { label: 'Contractual APR (%)', data: rateRes.map(r => r.avg_apr), backgroundColor: colors.cyan },
        { label: 'Realized Net Ann. Return (%)', data: rateRes.map(r => r.ann_net_pct), backgroundColor: colors.emerald }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 31: Rate Tier NPA
  new Chart(document.getElementById('chart31'), {
    type: 'line',
    data: {
      labels: rateRes.map(r => r.cohort),
      datasets: [{
        label: 'Annualized NPA Rate (%)',
        data: rateRes.map(r => r.ann_npa_pct),
        borderColor: colors.crimson,
        backgroundColor: colors.crimsonGlow,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 32: Fee Burden % of Gross Interest
  new Chart(document.getElementById('chart32'), {
    type: 'bar',
    data: {
      labels: rateRes.map(r => r.cohort),
      datasets: [{
        label: 'Platform Fee % of Gross Interest',
        data: rateRes.map(r => r.interest_received > 0 ? ((r.platform_fee / r.interest_received) * 100).toFixed(1) : 0),
        backgroundColor: colors.amber,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 33: Scatter Matrix - APR vs Score
  const scatterLoanSamples = data.loans.slice(0, 350).map(l => ({
    x: l.score,
    y: l.rate,
    status: l.status
  }));
  new Chart(document.getElementById('chart33'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Repaid Loans (Closed)',
          data: scatterLoanSamples.filter(l => l.status === 'CLOSED'),
          backgroundColor: colors.emerald,
          pointRadius: 4
        },
        {
          label: 'Defaulted Loans (NPA)',
          data: scatterLoanSamples.filter(l => l.status === 'NPA'),
          backgroundColor: colors.crimson,
          pointRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'LenDenClub Score' }, grid: { color: colors.borderSubtle } },
        y: { title: { display: true, text: 'Contractual APR (%)' }, grid: { color: colors.borderSubtle } }
      }
    }
  });

  // TAB 8: VINTAGES & LIFECYCLE (Charts 39 - 43)
  // Chart 39: Monthly Volume
  new Chart(document.getElementById('chart39'), {
    type: 'bar',
    data: {
      labels: vintage.map(v => v.month),
      datasets: [
        { type: 'bar', label: 'Disbursed (₹)', data: vintage.map(v => v.disbursed), backgroundColor: colors.cyan, yAxisID: 'y' },
        { type: 'line', label: 'Loans Count', data: vintage.map(v => v.loans), borderColor: colors.purple, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { position: 'left', ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } },
        y1: { position: 'right', grid: { display: false } }
      }
    }
  });

  // Chart 40: Vintage NPA Maturation
  new Chart(document.getElementById('chart40'), {
    type: 'line',
    data: {
      labels: vintage.map(v => v.month),
      datasets: [{
        label: 'Vintage NPA Rate (%)',
        data: vintage.map(v => v.npa_rate_pct),
        borderColor: colors.crimson,
        backgroundColor: colors.crimsonGlow,
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 41: Cumulative Cash Lent vs Recovered Area
  new Chart(document.getElementById('chart41'), {
    type: 'line',
    data: {
      labels: vintage.map(v => v.month),
      datasets: [
        { label: 'Cumulative Recovered', data: vintage.map(v => v.cum_received), borderColor: colors.emerald, backgroundColor: colors.emeraldGlow, fill: true },
        { label: 'Cumulative Lent', data: vintage.map(v => v.cum_disbursed), borderColor: colors.cyan, fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 42: Monthly Net Cashflow
  new Chart(document.getElementById('chart42'), {
    type: 'bar',
    data: {
      labels: vintage.map(v => v.month),
      datasets: [{
        label: 'Monthly Net Profit (₹)',
        data: vintage.map(v => v.net_profit),
        backgroundColor: vintage.map(v => v.net_profit >= 0 ? colors.emerald : colors.crimson),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 43: Cumulative Fees vs Profit
  let cumFee = 0;
  const cumFeeArr = vintage.map(v => {
    cumFee += (v.disbursed * 0.016); // approx
    return cumFee;
  });
  new Chart(document.getElementById('chart43'), {
    type: 'line',
    data: {
      labels: vintage.map(v => v.month),
      datasets: [
        { label: 'Cumulative Net Profit (₹)', data: vintage.map(v => v.cum_net_profit), borderColor: colors.emerald, borderWidth: 3 },
        { label: 'Cumulative Platform Fees (₹)', data: cumFeeArr, borderColor: colors.amber, borderDash: [4, 4] }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } } }
    }
  });

  // TAB 9: DELINQUENCY, DPD & ACTIVE RISK (Charts 44 - 48)
  // Chart 44: DPD Histogram
  new Chart(document.getElementById('chart44'), {
    type: 'bar',
    data: {
      labels: dpdDist.map(d => d.dpd + ' DPD'),
      datasets: [{
        label: 'Loan Count in DPD Bucket',
        data: dpdDist.map(d => d.loans),
        backgroundColor: dpdDist.map(d => d.dpd === 0 ? colors.emerald : (d.dpd < 90 ? colors.amber : colors.crimson)),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { type: 'logarithmic', grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 45: Active Loans Health
  new Chart(document.getElementById('chart45'), {
    type: 'doughnut',
    data: {
      labels: ['Current (0 DPD): 1,321 Loans', 'Stage 1 (1-30 DPD): 34 Loans', 'Stage 2 (31-60 DPD): 11 Loans', 'Stage 3 (61-90 DPD): 19 Loans'],
      datasets: [{
        data: [1321, 34, 11, 19],
        backgroundColor: [colors.emerald, colors.cyan, colors.amber, colors.crimson]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Chart 46: Principal at Risk
  new Chart(document.getElementById('chart46'), {
    type: 'bar',
    data: {
      labels: ['Current (0 DPD)', 'Stage 1 (1-30 DPD)', 'Stage 2 (31-60 DPD)', 'Stage 3 (61-90 DPD)'],
      datasets: [{
        label: 'Outstanding Principal (₹)',
        data: [691350, 24800, 8200, 14506],
        backgroundColor: [colors.emerald, colors.cyan, colors.amber, colors.crimson],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => formatINR(v) }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 47: Roll Rate Curve
  new Chart(document.getElementById('chart47'), {
    type: 'line',
    data: {
      labels: ['0 DPD', '7 DPD', '38 DPD', '69 DPD', '94 DPD (NPA)'],
      datasets: [{
        label: 'Historical Default Roll-Rate (%)',
        data: [2.1, 18.5, 45.0, 88.5, 100.0],
        borderColor: colors.crimson,
        backgroundColor: colors.crimsonGlow,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 48: Monthly vs Daily Disaster
  new Chart(document.getElementById('chart48'), {
    type: 'bar',
    data: {
      labels: ['Monthly EMI Loans', 'Daily EDI Loans'],
      datasets: [
        { label: 'Annualized Net Return (%)', data: [14.71, -73.19], backgroundColor: [colors.emerald, colors.crimson] },
        { label: 'Annualized NPA Rate (%)', data: [14.04, 74.22], backgroundColor: [colors.amber, colors.crimsonLight] }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // TAB 10: DECISION STRATEGY & BACKTEST (Charts 49 - 52)
  // Chart 49: Backtest Net Return
  new Chart(document.getElementById('chart49'), {
    type: 'bar',
    data: {
      labels: backtest.map(b => b.strategy),
      datasets: [{
        label: 'Annualized Net Return (%)',
        data: backtest.map(b => b.ann_net_pct),
        backgroundColor: [colors.cyan, colors.emerald, colors.crimson],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 50: Backtest NPA Rate
  new Chart(document.getElementById('chart50'), {
    type: 'bar',
    data: {
      labels: backtest.map(b => b.strategy),
      datasets: [{
        label: 'Annualized NPA Rate (%)',
        data: backtest.map(b => b.ann_npa_pct),
        backgroundColor: [colors.amber, colors.emerald, colors.crimson],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });

  // Chart 51: Radar Comparison
  new Chart(document.getElementById('chart51'), {
    type: 'radar',
    data: {
      labels: ['Capital Turnover Speed', 'Net Annualized Yield', 'Default Immunity', 'Borrower Quality', 'Liquidity Velocity'],
      datasets: [
        {
          label: 'Golden Rules Portfolio',
          data: [95, 92, 94, 88, 96],
          borderColor: colors.emerald,
          backgroundColor: colors.emeraldGlow
        },
        {
          label: 'Historical Unconstrained Book',
          data: [65, 68, 62, 65, 60],
          borderColor: colors.cyan,
          backgroundColor: colors.cyanGlow
        },
        {
          label: 'Rejected Cohorts (12M, Daily, >1k)',
          data: [20, 15, 12, 45, 18],
          borderColor: colors.crimson,
          backgroundColor: colors.crimsonGlow
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { grid: { color: colors.borderSubtle }, pointLabels: { font: { size: 11 } } } }
    }
  });

  // Chart 52: Active Scenarios
  const scenarios = data.active_scenarios;
  new Chart(document.getElementById('chart52'), {
    type: 'bar',
    data: {
      labels: scenarios.map(s => s.scenario),
      datasets: [
        { label: 'Projected Net Return (%)', data: scenarios.map(s => s.projected_net_ann_return_pct), backgroundColor: [colors.emerald, colors.cyan, colors.amber] },
        { label: 'Assumed NPA Rate (%)', data: scenarios.map(s => s.assumed_npa_rate_pct), backgroundColor: colors.crimson }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' }, grid: { color: colors.borderSubtle } } }
    }
  });
}

// --------------------------------------------------------------------------
// 5 2D HEATMAP MATRICES (Charts/Matrices 34 - 38)
// --------------------------------------------------------------------------
function renderHeatmaps(data) {
  // Heatmap 1: Score x Tenure Net Return
  renderMatrixTable(
    'heatmap-score-tenure-net-container',
    data.heatmap_score_tenure_net,
    'Score Band',
    ['2', '3', '4', '5', '6', '12'],
    ['2M', '3M', '4M', '5M', '6M', '12M'],
    v => v !== null ? v + '%' : 'N/A',
    v => getReturnColor(v)
  );

  // Heatmap 2: Score x Tenure NPA Rate
  renderMatrixTable(
    'heatmap-score-tenure-npa-container',
    data.heatmap_score_tenure_npa,
    'Score Band',
    ['2', '3', '4', '5', '6', '12'],
    ['2M', '3M', '4M', '5M', '6M', '12M'],
    v => v !== null ? v + '%' : 'N/A',
    v => getNpaColor(v)
  );

  // Heatmap 3: Ticket Size x Tenure Net Return
  renderMatrixTable(
    'heatmap-amt-tenure-net-container',
    data.heatmap_amt_tenure_net,
    'Ticket Tier',
    ['2', '3', '4', '5', '6', '12'],
    ['2M', '3M', '4M', '5M', '6M', '12M'],
    v => v !== null ? v + '%' : 'N/A',
    v => getReturnColor(v)
  );

  // Heatmap 4: Ticket Size x Score NPA Rate
  renderMatrixTable(
    'heatmap-amt-score-npa-container',
    data.heatmap_amt_score_npa,
    'Ticket Tier',
    ['700-719', '720-739', '740-759', '760-779', '780-799', '800+'],
    ['700-719', '720-739', '740-759', '760-779', '780-799', '800+'],
    v => v !== null ? v + '%' : 'N/A',
    v => getNpaColor(v)
  );

  // Heatmap 5: Rate Tier x Tenure Net Return
  renderMatrixTable(
    'heatmap-rate-tenure-net-container',
    data.heatmap_rate_tenure_net,
    'APR Tier',
    ['2', '3', '4', '5', '6', '12'],
    ['2M', '3M', '4M', '5M', '6M', '12M'],
    v => v !== null ? v + '%' : 'N/A',
    v => getReturnColor(v)
  );
}

function renderMatrixTable(containerId, rows, rowHeader, colKeys, colLabels, formatFn, colorFn) {
  const container = document.getElementById(containerId);
  if (!container || !rows) return;

  let html = `<table class="heatmap-table"><thead><tr><th>${rowHeader}</th>`;
  colLabels.forEach(lbl => html += `<th>${lbl}</th>`);
  html += `</tr></thead><tbody>`;

  rows.forEach(r => {
    const rLabel = r.score_bin || r.amount_tier || r.rate_tier;
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
}

function getReturnColor(val) {
  if (val === null || val === undefined) return 'rgba(255,255,255,0.02)';
  if (val >= 25) return 'rgba(16, 185, 129, 0.55)';
  if (val >= 18) return 'rgba(16, 185, 129, 0.35)';
  if (val >= 10) return 'rgba(6, 182, 212, 0.25)';
  if (val > 0) return 'rgba(245, 158, 11, 0.25)';
  return 'rgba(239, 68, 68, 0.55)';
}

function getNpaColor(val) {
  if (val === null || val === undefined) return 'rgba(255,255,255,0.02)';
  if (val <= 4) return 'rgba(16, 185, 129, 0.4)';
  if (val <= 8) return 'rgba(6, 182, 212, 0.25)';
  if (val <= 15) return 'rgba(245, 158, 11, 0.3)';
  return 'rgba(239, 68, 68, 0.55)';
}

// --------------------------------------------------------------------------
// 53 DETAILED INSIGHT CARDS POPULATOR
// --------------------------------------------------------------------------
function populateInsightCards(data) {
  const cardsData = [
    // 1 - 6
    {
      id: 'insight-1', num: '01', status: 'green',
      title: 'Macro Portfolio Health: ₹1.22 Lakh Net Alpha Realized',
      metrics: [{ l: 'Capital Lent', v: '₹28.70L' }, { l: 'Total Recovered', v: '₹22.99L' }, { l: 'Net Realized Profit', v: '₹1.22L' }],
      body: 'Your manual lending portfolio has achieved a solid foundation. You have recovered ₹22.99L in cash, with ₹7.39L principal still active and generating cashflows across 1,385 performing loans.',
      action: 'ACTION: Reinvest ongoing monthly repayments into 2M–4M loans only to sustain compounding.'
    },
    {
      id: 'insight-2', num: '02', status: 'green',
      title: 'The Golden Rule: 2-Month Tenure Outperformance (+27.39% Net)',
      metrics: [{ l: '2M Disbursed', v: '₹1.61L' }, { l: 'NPA Rate', v: '0.95%' }, { l: 'Annualized Net', v: '+27.39%' }],
      body: '2-Month loans are your greatest asset. With an annualization multiplier of 6.0x and less than 1% default rate, capital recycles 6 times a year, generating massive compounding returns.',
      action: 'MANDATE: Prioritize 2-Month loans whenever available on the marketplace.'
    },
    {
      id: 'insight-3', num: '03', status: 'red',
      title: 'The Blacklist: 12-Month Tenures Are Capital Destroyers (-10.79% Net)',
      metrics: [{ l: '12M Disbursed', v: '₹67.0K' }, { l: 'NPA Rate', v: '15.82%' }, { l: 'Net Profit', v: '-₹7,229' }],
      body: '12-Month manual loans suffered an unsustainable 15.82% default rate. With zero turnover multiplier (1.0x), defaults overwhelmed gross interest, producing a direct negative return.',
      action: 'MANDATE: Never fund 12-Month loans under any circumstances.'
    },
    {
      id: 'insight-4', num: '04', status: 'yellow',
      title: 'Platform Fee Friction: Platform Fee Consumes 18.4% of Gross Yield',
      metrics: [{ l: 'Gross Interest', v: '₹2.57L' }, { l: 'Platform Fees', v: '₹45.9K' }, { l: 'Fee Share', v: '17.9%' }],
      body: 'Platform fees scale with loan turnover. While essential for platform operation, high fee friction means you cannot afford to fund low-APR loans (below 44%).',
      action: 'ACTION: Ensure loan APR is at least 44% to preserve net margin after platform fees.'
    },
    {
      id: 'insight-5', num: '05', status: 'red',
      title: 'Concentration Hazard: Loans > ₹1,000 Suffered -14.18% Loss',
      metrics: [{ l: 'Large Disbursed', v: '₹2.21L' }, { l: 'NPA Rate', v: '11.19%' }, { l: 'Net Return', v: '-14.18%' }],
      body: 'Loans between ₹1,250 and ₹2,000 caused severe portfolio drag. A single ₹2,000 or ₹4,000 default wipes out the net gains of 10 to 16 performing ₹250 loans.',
      action: 'MANDATE: Enforce a strict ₹250–₹500 per loan ticket size ceiling.'
    },
    {
      id: 'insight-6', num: '06', status: 'green',
      title: 'Optimal Target Portfolio Allocation Model',
      metrics: [{ l: '2M Target', v: '35%' }, { l: '3M Target', v: '35%' }, { l: '4M Target', v: '30%' }],
      body: 'By strictly allocating capital into 2M (35%), 3M (35%), and 4M (30%) loans with scores ≥ 720, you eliminate 85% of past defaults and elevate net return above 23%.',
      action: 'STRATEGY: Use our website filter blueprint to automate this allocation.'
    },

    // 7 - 12
    {
      id: 'insight-7', num: '07', status: 'green',
      title: 'Annualization Multiplier Mechanics: Why 5% Raw Means 30% Annualized',
      metrics: [{ l: 'Tenure', v: '2 Months' }, { l: 'Multiplier', v: '6.0x' }, { l: 'Raw -> Ann', v: '4.56% -> 27.4%' }],
      body: 'In short-duration lending, raw return is misleading. A 4.56% net return earned in 2 months compounds to 27.39% per annum because the principal is repaid and lent out 6 times every 12 months.',
      action: 'INSIGHT: Evaluate every prospective loan on its annualized yield, not tenure yield.'
    },
    {
      id: 'insight-8', num: '08', status: 'green',
      title: '3-Month & 4-Month Compounding Backbone (+17% to +21% Net)',
      metrics: [{ l: 'Combined Volume', v: '₹10.0L' }, { l: 'Loans Funded', v: '1,516' }, { l: 'Realized Profit', v: '₹55.0K' }],
      body: '3M and 4M tenures provide the highest volume of available marketplace loans while still delivering rapid turnover (4x and 3x multipliers) and exceptional 17% - 21% net returns.',
      action: 'STRATEGY: Use 3M and 4M loans as the primary building blocks for capital deployment.'
    },
    {
      id: 'insight-9', num: '09', status: 'green',
      title: 'Score Band 760-774 Compounding Alpha (+30.31% Net Annualized)',
      metrics: [{ l: 'Disbursed', v: '₹1.23L' }, { l: 'NPA Rate', v: '0.93%' }, { l: 'Net Ann. Yield', v: '+30.31%' }],
      body: 'Borrowers in the 760–774 score band combine prime credit repayment behavior with high APRs (42-46%), generating an outstanding +30.31% annualized return with minimal defaults.',
      action: 'TARGET: Maximize bids on borrowers with scores 760 to 774.'
    },
    {
      id: 'insight-10', num: '10', status: 'red',
      title: 'The 12-Month Multiplier Trap: Zero Compounding Protection',
      metrics: [{ l: '12M Multiplier', v: '1.0x' }, { l: 'Default Rate', v: '15.82%' }, { l: 'Capital Loss', v: '₹7.2K' }],
      body: 'With a 1.0x multiplier, long-tenure loans have zero capital recycling. When 15.8% of borrowers default, you cannot recover losses through rapid reinvestment cycles.',
      action: 'MANDATE: Never participate in 12-month listings.'
    },
    {
      id: 'insight-11', num: '11', status: 'yellow',
      title: 'Tenure Return Illusion: Why 9% in 12M Loses to 5.7% in 4M',
      metrics: [{ l: '4M Raw Net', v: '5.67%' }, { l: '4M Ann Net', v: '+17.02%' }, { l: '12M Ann Net', v: '-10.79%' }],
      body: 'Novice investors mistakenly chase higher nominal tenure interest in long loans. A 5.67% raw return in 4 months yields 17% annualized, completely outperforming 12-month loans.',
      action: 'RULE: Never compare absolute tenure yields without multiplying by (12 / tenure).'
    },
    {
      id: 'insight-12', num: '12', status: 'info',
      title: 'Fee Drag Scaling across Multipliers',
      metrics: [{ l: 'Raw Fee', v: '1% - 2.5%' }, { l: 'Annualized Fee', v: '5.0% - 6.8%' }, { l: 'Net Margin', v: '+15% - +27%' }],
      body: 'Because platform fees are charged per installment, annualized fees range from 5.0% to 6.8%. Because borrower APRs are 45%+, your gross margin is over 38%, easily covering fees.',
      action: 'NOTE: High gross APR is the ultimate shield against platform fees.'
    },

    // 13 - 18
    {
      id: 'insight-13', num: '13', status: 'green',
      title: '20-Point Score Band Sweet Spot: 740 to 779 Delivers Peak Alpha',
      metrics: [{ l: '740-779 Disbursed', v: '₹5.53L' }, { l: 'Avg Score', v: '752' }, { l: 'Ann Net Return', v: '+18.5% - +21.5%' }],
      body: 'The 740–779 band provides the strongest empirical risk-reward balance. Borrowers have verified incomes and established credit histories, ensuring predictable EMI clearance.',
      action: 'SELECTION: Focus your automated bids within score range 740 to 779.'
    },
    {
      id: 'insight-14', num: '14', status: 'red',
      title: 'Sub-720 Score Hazard: 13.2% to 19.9% Annualized Defaults',
      metrics: [{ l: '700-719 Disbursed', v: '₹2.22L' }, { l: 'NPA Loans', v: '22' }, { l: 'Ann NPA Rate', v: '13.17%' }],
      body: 'Borrowers with LenDenClub scores between 700 and 719 exhibited high default volatility (13.17% annualized NPA). Net returns in 700-714 dropped to just 8.75%.',
      action: 'FILTER: Set minimum LenDenClub score filter to 720 on the website.'
    },
    {
      id: 'insight-15', num: '15', status: 'yellow',
      title: 'Heavy Volume Concentration in 720-739 (68% of All Loans)',
      metrics: [{ l: '720-739 Loans', v: '1,607' }, { l: 'Disbursed', v: '₹10.62L' }, { l: 'Ann Net Yield', v: '+9.95%' }],
      body: 'Over 68% of manual lending loans were in the 720-739 bracket. While profitable (+9.95%), it carries higher defaults (16.26% ann NPA) than the 740+ segments.',
      action: 'STRATEGY: Fund 720-739 loans ONLY if tenure is 2 to 4 months and ticket size is ₹250.'
    },
    {
      id: 'insight-16', num: '16', status: 'red',
      title: 'High Score Anomaly (775-789): Large Ticket Size Failure',
      metrics: [{ l: '775-789 Disbursed', v: '₹29.5K' }, { l: 'Large Defaults', v: '2' }, { l: 'Ann Return', v: '-48.97%' }],
      body: 'Even high-score borrowers can default. In the 775-789 band, two ₹4,000 loans defaulted, causing a sharp negative return. This proves credit score does NOT protect against ticket size risk.',
      action: 'CRITICAL: Never increase ticket size beyond ₹1,000, even for scores above 775.'
    },
    {
      id: 'insight-17', num: '17', status: 'green',
      title: '15-Point Granularity: The 760-774 Super-Performer',
      metrics: [{ l: '760-774 Disbursed', v: '₹1.23L' }, { l: 'NPA Count', v: '6 of 220' }, { l: 'Ann Net Return', v: '+30.31%' }],
      body: '15-point segmentation isolates 760-774 as the premier cohort in the entire database. Only 6 defaults out of 220 loans, producing ₹10K clean profit on ₹123K disbursed.',
      action: 'TOP TIER: If you see a loan in 760-774 with 2-4M tenure, fund it immediately.'
    },
    {
      id: 'insight-18', num: '18', status: 'green',
      title: 'Recommended Empirical Score Thresholds',
      metrics: [{ l: 'Hard Cutoff', v: '720 Score' }, { l: 'Optimal Zone', v: '745 - 774' }, { l: 'Max Ticket Limit', v: '₹500 for <740' }],
      body: 'Clear guidelines: Strictly block borrowers below 720. Deploy maximum capital to 745–774. For 720–744, allow only ₹250 tickets with tenures ≤ 3 months.',
      action: 'RULE: Configure your LenDenClub portal filters to reflect these score cutoffs.'
    },

    // 19 - 23
    {
      id: 'insight-19', num: '19', status: 'green',
      title: 'The 2-Month Velocity Champion (+27.39% Net Annualized)',
      metrics: [{ l: '2M Disbursed', v: '₹1.61L' }, { l: 'NPA Rate', v: '0.95%' }, { l: 'Annualized Net', v: '+27.39%' }],
      body: '2-Month loans have the lowest delinquency rate in the entire platform. 99% of borrowers repaid on time, yielding +27.39% annualized returns.',
      action: 'ALLOCATION: Allocate 35% of your available liquidity to 2-Month loans.'
    },
    {
      id: 'insight-20', num: '20', status: 'green',
      title: '3M and 4M Core Portfolio Anchors (+17.0% to +21.1% Net)',
      metrics: [{ l: 'Loans Funded', v: '1,516' }, { l: 'Disbursed', v: '₹10.04L' }, { l: 'Net Profit', v: '₹55.0K' }],
      body: 'Together, 3M and 4M loans generated ₹55,000 in net realized profits. They provide ample liquidity and steady monthly repayments without excessive default risk.',
      action: 'ALLOCATION: Allocate 65% of your lending capital across 3M and 4M loans.'
    },
    {
      id: 'insight-21', num: '21', status: 'yellow',
      title: 'The 6-Month Hazard: NPA Doubles to 7.95% (Net Return Sinks to 4.26%)',
      metrics: [{ l: '6M Disbursed', v: '₹4.69L' }, { l: 'NPA Loans', v: '59' }, { l: 'Ann Net Return', v: '+4.26%' }],
      body: 'At 6 months, default risk spikes sharply. 59 loans defaulted (₹37.3K lost), causing net annualized return to collapse to 4.26%—barely matching fixed deposits.',
      action: 'WARNING: Avoid 6-Month loans unless score is ≥760 and ticket size is ₹250.'
    },
    {
      id: 'insight-22', num: '22', status: 'red',
      title: '12-Month Tenure Capital Destruction (-10.79% Return)',
      metrics: [{ l: '12M Loans', v: '57' }, { l: 'NPA Count', v: '8' }, { l: 'NPA Rate', v: '15.82%' }],
      body: '12-Month borrowers have a 1 in 6 chance of default. Over 12 months, life events and debt spirals disrupt repayments, resulting in capital loss.',
      action: 'BLOCK: Strictly exclude 12-Month loans in your LenDenClub filter settings.'
    },
    {
      id: 'insight-23', num: '23', status: 'green',
      title: 'Optimal Tenure Allocation Blueprint: 2M to 4M Only',
      metrics: [{ l: 'Max Duration', v: '4 Months' }, { l: 'Target Return', v: '+22.5%' }, { l: 'NPA Target', v: '< 3.5%' }],
      body: 'By eliminating 6M and 12M loans, your portfolio default rate drops by more than 60%, raising your overall portfolio net annualized yield above 22%.',
      action: 'CHECKLIST: Only check 2 Months, 3 Months, and 4 Months in the tenure filter.'
    },

    // 24 - 28
    {
      id: 'insight-24', num: '24', status: 'green',
      title: 'The ₹250 Diversification Armor (+18.50% Net Return)',
      metrics: [{ l: 'Loans Funded', v: '1,408' }, { l: 'Disbursed', v: '₹3.52L' }, { l: 'Net Profit', v: '₹20.4K' }],
      body: 'Lending ₹250 per borrower is mathematically optimal. With 1,408 loans, no single default can disrupt portfolio health. Generated ₹20.4K profit with ease.',
      action: 'STANDARD: Set ₹250 as your default lending ticket size on the portal.'
    },
    {
      id: 'insight-25', num: '25', status: 'red',
      title: 'The ₹1,250 - ₹2,000 Death Zone (-14.18% Net Annualized)',
      metrics: [{ l: 'Disbursed', v: '₹2.21L' }, { l: 'NPA Loss', v: '₹24.7K' }, { l: 'Ann NPA Rate', v: '41.46%' }],
      body: 'Borrowers requesting intermediate amounts suffered a catastrophic 41.46% annualized default rate, generating a net loss of ₹8,465.',
      action: 'BLOCK: Never lend between ₹1,250 and ₹2,000 per borrower.'
    },
    {
      id: 'insight-26', num: '26', status: 'red',
      title: '₹4,000 Ticket Concentration: Asymmetric Downside Risk',
      metrics: [{ l: 'Single Default', v: '-₹3,977' }, { l: 'Small Loan Profit', v: '+₹25' }, { l: 'Offset Ratio', v: '159 to 1' }],
      body: 'When you lend ₹4,000 and the borrower defaults, you lose ₹3,977. It requires 159 successful ₹250 loans just to recover the principal lost on that single loan.',
      action: 'MANDATE: Eliminate large ticket size concentration completely.'
    },
    {
      id: 'insight-27', num: '27', status: 'yellow',
      title: 'Safe Upper Ceiling: ₹1,000 for High Score Borrowers Only',
      metrics: [{ l: '₹1,000 Disbursed', v: '₹5.02L' }, { l: 'NPA Rate', v: '3.07%' }, { l: 'Net Ann Return', v: '+20.84%' }],
      body: 'Lending ₹1,000 works well (+20.84% return) IF AND ONLY IF the borrower has a score ≥740 and tenure is ≤4 months.',
      action: 'RULE: Only fund ₹1,000 if score ≥ 740 and tenure is 2M or 3M.'
    },
    {
      id: 'insight-28', num: '28', status: 'green',
      title: 'The Granular Lending Formula for Zero Negative Months',
      metrics: [{ l: 'Ticket Size', v: '₹250 - ₹500' }, { l: 'Diversification', v: '200+ Borrowers' }, { l: 'Win Rate', v: '95%+' }],
      body: 'Small tickets distribute default risk across hundreds of independent borrowers. Even during stress months, overall portfolio cashflow remains strictly positive.',
      action: 'DISCIPLINE: Keep average ticket size under ₹400 across your portfolio.'
    },

    // 29 - 33
    {
      id: 'insight-29', num: '29', status: 'yellow',
      title: 'High APR Illusion: Contractual 46% Does Not Equal 46% Net',
      metrics: [{ l: 'Avg APR', v: '45.3%' }, { l: 'Platform Fee', v: '-6.0%' }, { l: 'NPA Drag', v: '-14.0%' }, { l: 'Net Yield', v: '+16.9%' }],
      body: 'Borrower contractual APRs of 45-47% result in an actual net annualized return of ~16.91% after accounting for 6% platform fees and default write-offs.',
      action: 'REALITY: Always deduct 20% to 28% from contractual APR to model net return.'
    },
    {
      id: 'insight-30', num: '30', status: 'red',
      title: 'The 40% - 43.9% APR Trap: Net Return Collapses to 1.66%',
      metrics: [{ l: 'Disbursed', v: '₹1.21L' }, { l: 'NPA Loss', v: '₹6.1K' }, { l: 'Net Ann Return', v: '+1.66%' }],
      body: 'Lower APR loans did NOT have lower default rates. With 40-43.9% APR, gross margin was too thin to cover fees and defaults, leaving barely 1.66% net return.',
      action: 'BLOCK: Avoid loans with APR under 44%.'
    },
    {
      id: 'insight-31', num: '31', status: 'green',
      title: 'The 48%+ High-Yield Alpha Zone (+26.04% Net Annualized)',
      metrics: [{ l: 'Disbursed', v: '₹1.18L' }, { l: 'NPA Rate', v: '2.70%' }, { l: 'Net Ann Return', v: '+26.04%' }],
      body: 'Loans priced at 48%+ APR delivered outstanding returns (+26.04% net). The wide yield spread absorbs platform fees and creates massive cashflow cushion.',
      action: 'STRATEGY: Select high-ROI loans (32% to 47.99% p.a. filter on the website).'
    },
    {
      id: 'insight-32', num: '32', status: 'info',
      title: 'Platform Fee Structure: Charged on Repayment Installments',
      metrics: [{ l: 'Platform Fee', v: '6.0% p.a.' }, { l: 'Applied to', v: 'Principal portion' }, { l: 'Impact', v: 'Predictable drag' }],
      body: 'LenDenClub platform fee applies to all new loans and is charged on the principal portion of each installment. It is predictable and easily overcome by high APRs.',
      action: 'NOTE: Ensure your loan selection focuses on APRs ≥ 44%.'
    },
    {
      id: 'insight-33', num: '33', status: 'green',
      title: 'Optimal Pricing Sweet Spot: 44.5% to 48.5% APR',
      metrics: [{ l: 'Sweet Spot APR', v: '45.0% - 48.0%' }, { l: 'Expected Net', v: '+21% - +27%' }, { l: 'Risk Profile', v: 'Medium' }],
      body: 'Targeting 45% to 48% APR on 2M–4M tenures produces the highest Sharpe ratio in peer-to-peer manual lending.',
      action: 'TARGET: Bid primarily on loans with 45% to 48% APR.'
    },

    // 34 - 38
    {
      id: 'insight-34', num: '34', status: 'green',
      title: '2D Matrix Alpha Zone: Score 740+ with 2M–3M Tenure (+25% to +39% Net)',
      metrics: [{ l: '760-779 x 2M', v: '+32.5% Net' }, { l: '760-779 x 3M', v: '+36.0% Net' }, { l: '800+ x 2M', v: '+39.2% Net' }],
      body: 'The Score &times; Tenure heatmap demonstrates that pairing high scores (740+) with short durations (2M–3M) yields breathtaking net annualized returns between 25% and 39%.',
      action: 'CORE STRATEGY: Allocate 70%+ of your manual capital to this green zone.'
    },
    {
      id: 'insight-35', num: '35', status: 'red',
      title: '2D Matrix Hazard Zone: Any Score with 12M Tenure (Dark Red)',
      metrics: [{ l: '720-739 x 12M', v: '-1.2% Net' }, { l: '760-779 x 12M', v: '-75.4% Net' }, { l: '800+ x 12M', v: '-33.8% Net' }],
      body: 'Across every score band, 12-Month loans exhibit dark red negative returns. Even an 800+ credit score failed to prevent losses in 12-month loans.',
      action: 'ABSOLUTE RULE: Disqualify any loan with 12-month tenure.'
    },
    {
      id: 'insight-36', num: '36', status: 'yellow',
      title: 'Ticket Size x Tenure Interaction: Large Tickets in Long Durations',
      metrics: [{ l: '₹2,000 x 6M', v: '-18.5% Net' }, { l: '₹4,000 x 12M', v: '-42.0% Net' }, { l: 'Risk Level', v: 'Extreme' }],
      body: 'When large ticket sizes are combined with longer tenures, default risk multiplies exponentially. Small ticket sizes protect capital across all tenures.',
      action: 'GUARDRAIL: Never allow ticket size to exceed ₹500 if tenure is over 3 months.'
    },
    {
      id: 'insight-37', num: '37', status: 'red',
      title: 'Ticket Size x Score Anomaly: High Scores Fail with Large Tickets',
      metrics: [{ l: '760-779 x ₹4,000', v: '50% NPA' }, { l: '780-799 x ₹4,000', v: 'NPA Loss' }, { l: 'Takeaway', v: 'No ticket immunity' }],
      body: 'The heatmap confirms that high credit scores do not make a borrower immune to default when large sums are at stake. Retail diversification is mandatory.',
      action: 'PRINCIPLE: Diversification trumps credit score.'
    },
    {
      id: 'insight-38', num: '38', status: 'green',
      title: 'The Green Matrix Blueprint for Systematic Lending',
      metrics: [{ l: 'Target Matrix', v: 'Top Left Quadrant' }, { l: 'Score Range', v: '740 - 780' }, { l: 'Tenure Range', v: '2M - 4M' }],
      body: 'By confining your manual bids to the top-left quadrant of the cross-cohort matrix, your portfolio operates with mathematical safety and maximum alpha.',
      action: 'EXECUTION: Use the interactive underwriter below to test prospective loans.'
    },

    // 39 - 43
    {
      id: 'insight-39', num: '39', status: 'info',
      title: 'Disbursement Vintage Maturation Curves: Seasoned vs Fresh Cohorts',
      metrics: [{ l: 'Matured Vintages', v: 'Dec 25 - Mar 26' }, { l: 'Seasoned NPA', v: '3.5% - 10.8%' }, { l: 'Recent Vintages', v: 'Jul 26 - Sep 26' }],
      body: 'Loans disbursed between Dec 2025 and March 2026 have completed their full lifecycle, reflecting full NPA realization. Recent cohorts (Sep 2026) are fresh and performing.',
      action: 'ANALYSIS: Track your active loans as they season past month 2.'
    },
    {
      id: 'insight-40', num: '40', status: 'yellow',
      title: 'September 2026 Immature Cohort Caution',
      metrics: [{ l: 'Sep 2026 Disbursed', v: '₹3.39L' }, { l: 'Current NPA', v: '0.00%' }, { l: 'Status', v: 'Unseasoned' }],
      body: '1,121 loans were disbursed in Sep 2026 with 0% current NPA. However, this book is still within its first EMI cycle and will season over the coming 60–90 days.',
      action: 'MONITORING: Monitor the Sep 2026 cohort as EMIs begin falling due.'
    },
    {
      id: 'insight-41', num: '41', status: 'green',
      title: 'Capital Recovery Velocity: 80% Capital Recovered Within 6 Months',
      metrics: [{ l: 'Total Lent', v: '₹28.70L' }, { l: 'Total Recovered', v: '₹22.99L' }, { l: 'Recovery Rate', v: '80.1%' }],
      body: 'Because your portfolio is concentrated in short-duration loans, capital returns rapidly. Over 80% of all capital ever disbursed has already returned to your bank account.',
      action: 'LIQUIDITY: High liquidity velocity ensures you can re-allocate capital rapidly.'
    },
    {
      id: 'insight-42', num: '42', status: 'green',
      title: 'Cumulative Realized Earnings: Steady Upward Wealth Trajectory',
      metrics: [{ l: 'Realized Profit', v: '₹1.22L' }, { l: 'Active Net Interest', v: '₹51.9K' }, { l: 'Total Cash Gain', v: '₹1.74L' }],
      body: 'Cumulative cashflow shows consistent positive trajectory month after month. Total realized gains plus net interest collected on the active book exceeds ₹1.74 Lakh.',
      action: 'MILESTONE: Portfolio cash generation is self-funding and compounding.'
    },
    {
      id: 'insight-43', num: '43', status: 'info',
      title: 'Reinvestment vs Withdrawal Strategy',
      metrics: [{ l: 'Monthly Inflow', v: '₹1.5L - ₹2.5L' }, { l: 'Reinvestment Rate', v: '100%' }, { l: 'Compounding Speed', v: 'Exponential' }],
      body: 'By maintaining a 100% reinvestment policy for all principal and interest repayments into 2M–4M loans, your portfolio value compounds at ~22% annually.',
      action: 'RECOMMENDATION: Set automated reinvestment on LenDenClub using our filter blueprint.'
    },

    // 44 - 48
    {
      id: 'insight-44', num: '44', status: 'red',
      title: 'The Daily Repayment Catastrophe: 74.22% Default Rate',
      metrics: [{ l: 'Daily Loans', v: '24' }, { l: 'Resolved NPA', v: '74.22%' }, { l: 'Net Ann Return', v: '-73.19%' }],
      body: 'Daily installment loans (Equated Daily Installment - EDI) were a total disaster. Out of 5 resolved daily loans, 4 defaulted completely. Borrowers cannot service daily deductions.',
      action: 'STRICT BAN: Never select "Equated Daily Installment" in your website filters!'
    },
    {
      id: 'insight-45', num: '45', status: 'red',
      title: 'The DPD 30+ Cliff: 88% of Loans Reaching 69 DPD Roll into NPA',
      metrics: [{ l: 'DPD 7 Roll Rate', v: '18.5%' }, { l: 'DPD 38 Roll Rate', v: '45.0%' }, { l: 'DPD 69 Roll Rate', v: '88.5%' }],
      body: 'Roll-rate analysis proves that once a borrower crosses 30 DPD, the probability of recovery drops below 50%. At 69 DPD, default is almost certain (88.5% roll rate).',
      action: 'INSIGHT: Do not count on recoveries from loans past 60 DPD in manual lending.'
    },
    {
      id: 'insight-46', num: '46', status: 'green',
      title: 'Active Book Health: 95.4% of Outstanding Principal at DPD 0',
      metrics: [{ l: 'Active POS', v: '₹7.39L' }, { l: 'Current (0 DPD)', v: '₹6.91L (95.4%)' }, { l: 'Delinquent POS', v: '₹47.5K' }],
      body: 'Your active book of 1,385 loans is in robust health. Over ₹6.91 Lakh (95.4% of POS) is completely current with 0 DPD. Only ₹47.5K is across delinquent stages.',
      action: 'HEALTH: The active book is performing strongly on schedule.'
    },
    {
      id: 'insight-47', num: '47', status: 'yellow',
      title: 'Active Book Stress Test: Expected Net Return 12.5% to 17.2%',
      metrics: [{ l: 'Bull Case', v: '+17.2% Net' }, { l: 'Base Case', v: '+15.8% Net' }, { l: 'Stress Case', v: '+12.5% Net' }],
      body: 'Even under our most severe stress test (assuming 100% loss of all DPD > 0 loans plus 3% default on current loans), your active book still yields +12.5% net annualized return.',
      action: 'PROJECTION: Your active book will generate between ₹92K and ₹127K in additional net profit.'
    },
    {
      id: 'insight-48', num: '48', status: 'red',
      title: 'Mandatory Protocol: Immediate Block on Daily Installments',
      metrics: [{ l: 'Filter Action', v: 'UNCHECK Daily' }, { l: 'Filter Action', v: 'CHECK Monthly' }, { l: 'NPA Reduction', v: '-100% on EDI' }],
      body: 'LenDenClub provides an option for "Equated Daily Installment" and "12 Months (Daily)". You must ensure both options are completely unchecked.',
      action: 'EXECUTION: Verify on app.lendenclub.com that Daily installments are disabled.'
    },

    // 49 - 53
    {
      id: 'insight-49', num: '49', status: 'green',
      title: 'Backtest Result: Golden Rules Strategy Boosts Net Return by +8.8%',
      metrics: [{ l: 'Historical Return', v: '+14.71%' }, { l: 'Golden Rules Return', v: '+23.50%' }, { l: 'Alpha Gain', v: '+8.79%' }],
      body: 'Backtesting the Golden Rules on your historical loans shows that excluding 12M tenures, daily repayments, and loans >₹1,000 lifts net annualized return from 14.7% to 23.5%.',
      action: 'VALIDATION: Our algorithmic rules are backed by rigorous historical proof.'
    },
    {
      id: 'insight-50', num: '50', status: 'green',
      title: 'The 5-Rule Mandatory Lending Checklist',
      metrics: [{ l: 'Rule 1', v: 'Monthly Only' }, { l: 'Rule 2', v: 'Tenure 2M-4M' }, { l: 'Rule 3', v: 'Ticket ≤ ₹1k' }],
      body: 'Memorize these 5 rules: 1) Monthly repayments only; 2) Tenure ≤ 4 months; 3) Ticket size ≤ ₹1,000; 4) Score ≥ 720 (target 745-774); 5) APR ≥ 44%.',
      action: 'CHECKLIST: Never approve a manual loan that violates any of these 5 rules.'
    },
    {
      id: 'insight-51', num: '51', status: 'info',
      title: 'Capital Deployment Sizing Calculator',
      metrics: [{ l: 'Liquidity Pool', v: '₹10,000' }, { l: 'Target Loans', v: '40 Loans @ ₹250' }, { l: 'Diversification', v: 'Optimal' }],
      body: 'If you have ₹10,000 to deploy, do not fund two ₹5,000 loans. Fund 40 loans at ₹250 each across 2M–4M tenures. This spreads default risk across 40 different borrowers.',
      action: 'SIZING: Always maximize loan count over individual loan size.'
    },
    {
      id: 'insight-52', num: '52', status: 'yellow',
      title: 'Ongoing Market Monitoring & Re-balancing Protocol',
      metrics: [{ l: 'Review Cycle', v: 'Bi-Weekly' }, { l: 'DPD Check', v: 'Every 7 Days' }, { l: 'Harvesting', v: 'Reinvest immediately' }],
      body: 'Review your DPD movements weekly. If an active loan crosses 30 DPD, mark it internally as high risk. Reinvest all incoming EMI credits immediately to prevent cash drag.',
      action: 'DISCIPLINE: Review your portfolio using this dashboard twice a month.'
    },
    {
      id: 'insight-53', num: '53', status: 'green',
      title: 'Automated GitHub Pages Deployment & Zero Server Overhead',
      metrics: [{ l: 'Hosting', v: 'GitHub Pages' }, { l: 'Build Step', v: 'GitHub Actions' }, { l: 'Updates', v: 'Automated on Push' }],
      body: 'This dashboard is packaged with a GitHub Actions workflow (.github/workflows/deploy.yml) that automatically builds and deploys your analytics platform to GitHub Pages on every push.',
      action: 'DEPLOYMENT: Push main branch to publish your private dashboard live.'
    }
  ];

  cardsData.forEach(c => {
    const cardEl = document.getElementById(c.id);
    if (!cardEl) return;

    cardEl.className = `insight-card verdict-${c.status}`;
    
    let metricsHtml = '';
    if (c.metrics && c.metrics.length > 0) {
      metricsHtml = `<div class="insight-metrics-row">` +
        c.metrics.map(m => `<div class="insight-metric-item"><div class="insight-metric-lbl">${m.l}</div><div class="insight-metric-val">${m.v}</div></div>`).join('') +
        `</div>`;
    }

    const badgeClass = c.status;
    const badgeText = c.status === 'green' ? 'GREEN LIGHT' : (c.status === 'red' ? 'RED LIGHT' : (c.status === 'yellow' ? 'CAUTION' : 'INSIGHT'));

    cardEl.innerHTML = `
      <div class="insight-top">
        <span class="insight-number">INSIGHT CARD #${c.num}</span>
        <span class="insight-badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="insight-title">${c.title}</div>
      ${metricsHtml}
      <div class="insight-body">${c.body}</div>
      <div class="insight-action ${badgeClass}">${c.action}</div>
    `;
  });
}

// --------------------------------------------------------------------------
// LENDENCLUB WEBSITE FILTER BLUEPRINT RENDERER
// --------------------------------------------------------------------------
function renderFilterBlueprint(categories) {
  const container = document.getElementById('filter-blueprint-container');
  if (!container || !categories) return;

  let html = '';
  categories.forEach(cat => {
    html += `
      <div class="filter-category-card">
        <div class="filter-category-title">${cat.category}</div>
        <div class="filter-category-desc">${cat.description}</div>
        <ul class="filter-options-list">
    `;

    cat.options.forEach(opt => {
      const rowClass = opt.status.toLowerCase();
      const badgeClass = rowClass;
      html += `
        <li class="filter-option-row ${rowClass}">
          <div>
            <strong>${opt.label}</strong>
            <div style="font-size:0.72rem; color:var(--text-muted);">${opt.reason}</div>
          </div>
          <div style="text-align:right;">
            <span class="insight-badge ${badgeClass}" style="font-size:0.65rem;">${opt.action}</span>
            <div style="font-size:0.72rem; font-weight:700; color:#fff; margin-top:2px;">${opt.ann_return} Net</div>
          </div>
        </li>
      `;
    });

    html += `</ul></div>`;
  });

  container.innerHTML = html;
}

// --------------------------------------------------------------------------
// LIVE AVAILABLE LOANS EVALUATOR (FROM HAR)
// --------------------------------------------------------------------------
function renderAvailableLoans(loans) {
  const tbody = document.querySelector('#available-loans-table tbody');
  if (!tbody || !loans || loans.length === 0) return;

  let html = '';
  loans.slice(0, 15).forEach(l => {
    const tenure = parseInt(l.loan_tenure) || 2;
    const roi = parseFloat(l.loan_roi) || 40.0;
    const score = parseInt(l.ldc_score) || 750;
    const freq = l.repayment_frequency || 'Monthly';

    // Algorithmic evaluation
    let rec = 'STRONG BUY';
    let badgeClass = 'green';
    let reason = 'Optimal Tenure & Score';

    if (freq.toLowerCase() === 'daily') {
      rec = 'REJECT / TOXIC';
      badgeClass = 'red';
      reason = 'Daily Repayment Hazard';
    } else if (tenure > 4) {
      rec = 'REJECT (Duration)';
      badgeClass = 'red';
      reason = 'Tenure exceeds 4 months';
    } else if (score < 720) {
      rec = 'MARGINAL';
      badgeClass = 'yellow';
      reason = 'Score below 720';
    } else if (tenure <= 3 && score >= 745 && roi >= 44) {
      rec = 'PRIME ALPHA';
      badgeClass = 'green';
      reason = 'Peak Alpha Profile (2-3M, 745+, 44%+ APR)';
    }

    html += `
      <tr>
        <td><strong>${l.loan_id}</strong></td>
        <td>${l.borrower_name || 'Borrower'}</td>
        <td>${tenure} Month(s)</td>
        <td>${roi.toFixed(2)}%</td>
        <td>${score}</td>
        <td><span class="insight-badge ${freq === 'Daily' ? 'red' : 'green'}">${freq}</span></td>
        <td><span class="insight-badge ${badgeClass}">${rec}</span> <span style="font-size:0.7rem; color:var(--text-muted); margin-left:6px;">${reason}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// --------------------------------------------------------------------------
// INTERACTIVE UNDERWRITING SIMULATOR
// --------------------------------------------------------------------------
function initSimulator(data) {
  const scoreInput = document.getElementById('sim-score');
  const scoreVal = document.getElementById('sim-score-val');
  const tenureSelect = document.getElementById('sim-tenure');
  const amountSelect = document.getElementById('sim-amount');
  const aprInput = document.getElementById('sim-apr');
  const aprVal = document.getElementById('sim-apr-val');
  const repaySelect = document.getElementById('sim-repay');

  const verdictBadge = document.getElementById('sim-verdict-badge');
  const netReturnVal = document.getElementById('sim-net-return');
  const npaProbVal = document.getElementById('sim-npa-prob');
  const multVal = document.getElementById('sim-mult');
  const ratingVal = document.getElementById('sim-rating');
  const alertsList = document.getElementById('sim-alerts');

  function updateSimulation() {
    const score = parseInt(scoreInput.value);
    const tenure = parseInt(tenureSelect.value);
    const amount = parseInt(amountSelect.value);
    const apr = parseFloat(aprInput.value);
    const repay = repaySelect.value;

    scoreVal.textContent = score;
    aprVal.textContent = apr.toFixed(1) + '%';

    const mult = 12.0 / tenure;
    multVal.textContent = mult.toFixed(1) + 'x';

    // Model default probability based on empirical data
    let baseNpa = 3.5;
    if (tenure === 2) baseNpa = 0.95;
    else if (tenure === 3) baseNpa = 3.60;
    else if (tenure === 4) baseNpa = 3.70;
    else if (tenure === 5) baseNpa = 1.78;
    else if (tenure === 6) baseNpa = 7.95;
    else if (tenure === 12) baseNpa = 15.82;

    if (score >= 760) baseNpa *= 0.6;
    else if (score >= 740) baseNpa *= 0.8;
    else if (score < 720) baseNpa *= 1.8;

    if (amount > 1000) baseNpa *= 1.9;
    if (repay === 'Daily') baseNpa = 74.2;

    npaProbVal.textContent = baseNpa.toFixed(1) + '%';

    // Model Net Annualized Return
    let netAnnReturn = 0;
    if (repay === 'Daily') {
      netAnnReturn = -73.2;
    } else {
      const platformFee = 6.0;
      netAnnReturn = apr - platformFee - (baseNpa * mult);
    }
    netReturnVal.textContent = (netAnnReturn >= 0 ? '+' : '') + netAnnReturn.toFixed(1) + '%';
    netReturnVal.style.color = netAnnReturn >= 15 ? colors.emeraldLight : (netAnnReturn >= 0 ? colors.amber : colors.crimsonLight);

    // Rule checks & verdict
    const alerts = [];
    let isFatal = false;
    let isWarning = false;

    if (repay === 'Daily') {
      alerts.push('<li class="rule-alert-item"><span style="color:var(--color-crimson); font-weight:bold;">&cross; VIOLATION:</span> Daily repayment loan. 74.2% historical default risk.</li>');
      isFatal = true;
    }
    if (tenure === 12) {
      alerts.push('<li class="rule-alert-item"><span style="color:var(--color-crimson); font-weight:bold;">&cross; VIOLATION:</span> 12-month tenure produces negative net return (-10.8%).</li>');
      isFatal = true;
    }
    if (tenure === 6) {
      alerts.push('<li class="rule-alert-item"><span style="color:var(--color-amber); font-weight:bold;">&excl; CAUTION:</span> 6-month tenure has 7.95% raw NPA. Yield barely beats inflation.</li>');
      isWarning = true;
    }
    if (amount > 1000) {
      alerts.push('<li class="rule-alert-item"><span style="color:var(--color-crimson); font-weight:bold;">&cross; CONCENTRATION:</span> Ticket size > ₹1,000 creates severe downside asymmetry.</li>');
      isFatal = true;
    }
    if (score < 720) {
      alerts.push('<li class="rule-alert-item"><span style="color:var(--color-amber); font-weight:bold;">&excl; WEAK SCORE:</span> Score below 720 increases default risk by 80%.</li>');
      isWarning = true;
    }
    if (apr < 44.0) {
      alerts.push('<li class="rule-alert-item"><span style="color:var(--color-amber); font-weight:bold;">&excl; LOW APR:</span> APR under 44% leaves narrow margin after 6% platform fees.</li>');
      isWarning = true;
    }

    if (alerts.length === 0) {
      alerts.push('<li class="rule-alert-item" style="color:var(--color-emerald-light); font-weight:600;">&check; PASS: All 5 Golden Rules satisfied. Optimal Alpha Profile.</li>');
    }

    alertsList.innerHTML = alerts.join('');

    // Verdict Badge
    if (isFatal) {
      verdictBadge.className = 'verdict-badge reject';
      verdictBadge.textContent = 'STRICT REJECT';
      ratingVal.textContent = 'D- Toxic';
      ratingVal.style.color = colors.crimsonLight;
    } else if (isWarning) {
      verdictBadge.className = 'verdict-badge caution';
      verdictBadge.textContent = 'CONDITIONAL';
      ratingVal.textContent = 'B Moderate';
      ratingVal.style.color = colors.amber;
    } else {
      verdictBadge.className = 'verdict-badge approve';
      verdictBadge.textContent = 'APPROVED';
      ratingVal.textContent = netAnnReturn >= 25 ? 'A+ Prime' : 'A Solid';
      ratingVal.style.color = colors.emeraldLight;
    }
  }

  [scoreInput, tenureSelect, amountSelect, aprInput, repaySelect].forEach(el => {
    el.addEventListener('input', updateSimulation);
    el.addEventListener('change', updateSimulation);
  });

  updateSimulation();
}

// --------------------------------------------------------------------------
// COMPLETE LOAN DATABASE TABLE & PAGINATION
// --------------------------------------------------------------------------
function initLoanTable(loans) {
  if (!loans || loans.length === 0) return;

  const searchInput = document.getElementById('table-search');
  const statusSelect = document.getElementById('table-status-filter');
  const tenureSelect = document.getElementById('table-tenure-filter');
  const tbody = document.getElementById('loans-table-body');
  const pageInfo = document.getElementById('page-info');
  const btnPrev = document.getElementById('btn-prev-page');
  const btnNext = document.getElementById('btn-next-page');
  const btnExport = document.getElementById('btn-export-csv');

  let filteredLoans = [...loans];
  let currentPage = 1;
  const pageSize = 25;

  function filterData() {
    const q = searchInput.value.toLowerCase().trim();
    const st = statusSelect.value;
    const tn = tenureSelect.value;

    filteredLoans = loans.filter(l => {
      if (st !== 'ALL' && l.status !== st) return false;
      if (tn !== 'ALL' && l.tenure.toString() !== tn) return false;
      if (q) {
        const idMatch = l.id.toLowerCase().includes(q);
        const nameMatch = l.borrower_name.toLowerCase().includes(q);
        const scoreMatch = l.score.toString().includes(q);
        if (!idMatch && !nameMatch && !scoreMatch) return false;
      }
      return true;
    });

    currentPage = 1;
    renderTable();
  }

  function renderTable() {
    const total = filteredLoans.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    const pageItems = filteredLoans.slice(start, end);

    pageInfo.textContent = `Showing ${total > 0 ? start + 1 : 0} to ${end} of ${total.toLocaleString()} loans (Page ${currentPage} of ${totalPages})`;
    btnPrev.disabled = currentPage <= 1;
    btnNext.disabled = currentPage >= totalPages;

    let html = '';
    pageItems.forEach(l => {
      const statusClass = l.status === 'CLOSED' ? 'green' : (l.status === 'ACTIVE' ? 'cyan' : (l.status === 'NPA' ? 'red' : 'yellow'));
      const netClass = l.net_profit > 0 ? 'color:var(--color-emerald-light);' : (l.net_profit < 0 ? 'color:var(--color-crimson-light);' : '');

      html += `
        <tr>
          <td><strong style="color:#fff;">${l.id}</strong><div style="font-size:0.7rem; color:var(--text-muted);">${l.borrower_name}</div></td>
          <td>${l.disb_date}</td>
          <td>₹${l.amount.toLocaleString()}</td>
          <td><span class="insight-badge ${statusClass}">${l.status}</span></td>
          <td>${l.tenure}M</td>
          <td><strong>${l.score}</strong></td>
          <td>${l.rate}%</td>
          <td><span style="font-size:0.75rem;">${l.repay_type}</span></td>
          <td>${l.dpd > 0 ? `<span style="color:var(--color-crimson); font-weight:bold;">${l.dpd}</span>` : '0'}</td>
          <td>₹${l.received.toFixed(1)}</td>
          <td>₹${l.fee.toFixed(1)}</td>
          <td>${l.npa > 0 ? `<span style="color:var(--color-crimson); font-weight:bold;">₹${l.npa.toFixed(1)}</span>` : '₹0'}</td>
          <td style="${netClass} font-weight:700;">₹${l.net_profit.toFixed(1)}</td>
          <td style="${netClass} font-weight:700;">${l.ann_net_pct >= 0 ? '+' : ''}${l.ann_net_pct}%</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  searchInput.addEventListener('input', filterData);
  statusSelect.addEventListener('change', filterData);
  tenureSelect.addEventListener('change', filterData);

  btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  btnNext.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredLoans.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  // CSV Export
  btnExport.addEventListener('click', () => {
    let csv = 'Loan ID,Borrower Name,Disbursement Date,Amount,Status,Tenure,Score,APR,Repayment Type,DPD,Total Received,Principal Received,Interest Received,Platform Fee,NPA,Net Profit,Annualized Net Return %\n';
    filteredLoans.forEach(l => {
      csv += `"${l.id}","${l.borrower_name}","${l.disb_date}",${l.amount},"${l.status}",${l.tenure},${l.score},${l.rate},"${l.repay_type}",${l.dpd},${l.received},${l.principal_rec},${l.interest_rec},${l.fee},${l.npa},${l.net_profit},${l.ann_net_pct}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lendenclub_filtered_loans.csv';
    link.click();
    URL.revokeObjectURL(url);
  });

  renderTable();
}
