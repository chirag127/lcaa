export function formatINR(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function formatINRCompact(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Number(val);
  if (Math.abs(num) >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (Math.abs(num) >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  if (Math.abs(num) >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
  return `₹${num.toFixed(0)}`;
}

export function formatPercent(val) {
  if (val === null || val === undefined || isNaN(val)) return '0.00%';
  return Number(val).toFixed(2) + '%';
}

export const THEME_COLORS = {
  emerald: '#10B981',
  emeraldLight: '#34D399',
  emeraldGlow: 'rgba(16, 185, 129, 0.25)',
  crimson: '#EF4444',
  crimsonLight: '#F87171',
  crimsonGlow: 'rgba(239, 68, 68, 0.25)',
  cyan: '#06B6D4',
  cyanLight: '#38BDF8',
  cyanGlow: 'rgba(6, 182, 212, 0.25)',
  amber: '#F59E0B',
  amberGlow: 'rgba(245, 158, 11, 0.25)',
  indigo: '#6366F1',
  purple: '#8B5CF6',
  textSecondary: '#94A3B8',
  borderSubtle: 'rgba(255, 255, 255, 0.08)'
};
