import {
  Chart as ChartJS,
  registerables
} from 'chart.js';

ChartJS.register(...registerables);

// Global Chart.js dark-mode defaults
ChartJS.defaults.color = '#94A3B8';
ChartJS.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
ChartJS.defaults.font.size = 11;
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.95)';
ChartJS.defaults.plugins.tooltip.titleColor = '#FFF';
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.12)';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.legend.labels.boxWidth = 12;
ChartJS.defaults.plugins.legend.labels.boxHeight = 12;
ChartJS.defaults.plugins.legend.labels.color = '#94A3B8';

export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.04)' },
      ticks: { color: '#64748B' }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.04)' },
      ticks: { color: '#64748B' }
    }
  }
};

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#94A3B8',
        boxWidth: 12,
        padding: 12
      }
    }
  },
  cutout: '65%'
};

