/**
 * Global Configuration & Styling Helpers
 */

window.LDC_CONFIG = {
  colors: {
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
    indigoGlow: 'rgba(99, 102, 241, 0.25)',
    purple: '#8b5cf6',
    textSecondary: '#9ca3af',
    borderSubtle: 'rgba(255, 255, 255, 0.08)'
  },
  
  formatINR: function(val) {
    if (val === null || val === undefined) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  },

  formatPercent: function(val) {
    if (val === null || val === undefined) return '0.0%';
    return Number(val).toFixed(2) + '%';
  }
};

// Configure Chart.js Defaults
if (window.Chart) {
  Chart.defaults.color = window.LDC_CONFIG.colors.textSecondary;
  Chart.defaults.font.family = "'Plus Jakarta Sans', -apple-system, sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.95)';
  Chart.defaults.plugins.tooltip.titleColor = '#fff';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.15)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
}
