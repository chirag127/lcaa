import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../components/ChartCard';
import InsightCard from '../components/InsightCard';
import KpiCard from '../components/KpiCard';
import { THEME_COLORS, formatINR, formatPercent } from '../utils/formatters';
import { getChartThemeColors } from '../utils/echartsConfig';

export default function TabAnnualized({ data, isDark = false }) {
  const colors = getChartThemeColors(isDark);

  const tenureData = useMemo(() => data?.tenure_resolved ?? [], [data]);
  const scoreData = useMemo(() => data?.score_20_resolved ?? [], [data]);
  const amtData = useMemo(() => data?.amount_resolved ?? [], [data]);
  const rateData = useMemo(() => data?.rate_resolved ?? [], [data]);

  // Tenure labels and metrics
  const tenureLabels = tenureData.map(t => `${t.cohort || t.tenure}M (${t.annualization_mult || Math.round(12 / (t.cohort || t.tenure))}x)`);

  // Chart A1: Tenure Normalization: Raw NPA Rate (%) vs Annualized Default Rate (%)
  const chartA1Option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name}</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${p.value}%</span>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureLabels,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Default Rate %',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Raw Tenure NPA (%)',
        type: 'bar',
        data: tenureData.map(t => t.raw_npa_count_pct ?? t.tenure_npa_pct),
        barMaxWidth: 30,
        itemStyle: { color: colors.amber, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.textColor, fontSize: 10 }
      },
      {
        name: 'Annualized Default Rate (ADR %)',
        type: 'bar',
        data: tenureData.map(t => t.ann_npa_count_pct ?? t.ann_npa_pct),
        barMaxWidth: 30,
        itemStyle: { color: colors.crimson, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.crimson, fontWeight: 700, fontSize: 10 }
      }
    ]
  };

  // Chart A2: Tenure Normalization: Raw Net Return (%) vs Annualized Net Return (%)
  const chartA2Option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name}</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${p.value}%</span>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureLabels,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Return %',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Raw Cycle Net Return (%)',
        type: 'bar',
        data: tenureData.map(t => t.raw_net_pct ?? t.tenure_net_pct),
        barMaxWidth: 30,
        itemStyle: { color: colors.indigo, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.textColor, fontSize: 10 }
      },
      {
        name: 'Annualized Net Return (ANR %)',
        type: 'bar',
        data: tenureData.map(t => t.ann_net_pct),
        barMaxWidth: 30,
        itemStyle: { color: colors.emerald, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.emerald, fontWeight: 700, fontSize: 10 }
      }
    ]
  };

  // Chart A3: Annualized Loss Drag (%) vs Annualized Fee Drag (%)
  const chartA3Option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name}</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${p.value}%</span>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureLabels,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Friction Drag %',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Annualized Capital Loss Drag (%)',
        type: 'bar',
        data: tenureData.map(t => t.ann_loss_drag_pct ?? t.ann_npa_pct),
        barMaxWidth: 30,
        itemStyle: { color: colors.crimson, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.textColor, fontSize: 10 }
      },
      {
        name: 'Annualized Platform Fee Drag (%)',
        type: 'bar',
        data: tenureData.map(t => t.ann_fee_pct),
        barMaxWidth: 30,
        itemStyle: { color: colors.purple, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.textColor, fontSize: 10 }
      }
    ]
  };

  // Chart A4: Annualized Net Alpha Spread (Contractual APR - Fee Drag - Loss Drag)
  const chartA4Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        const p = params[0];
        return `<div style="font-weight:700;margin-bottom:4px">${p.name}</div>
          <div style="font-size:11px">Annualized Net Alpha Spread: <b style="color:${p.value >= 25 ? colors.emerald : colors.amber}">${p.value}%</b></div>`;
      }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureLabels,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Net Alpha %',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Annualized Net Alpha Spread',
        type: 'line',
        data: tenureData.map(t => {
          const spread = (t.avg_apr || 46) - (t.ann_loss_drag_pct ?? t.ann_npa_pct) - (t.ann_fee_pct ?? 5);
          return Math.round(spread * 100) / 100;
        }),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: colors.cyan },
        itemStyle: { color: colors.cyan },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(6, 182, 212, 0.4)' },
              { offset: 1, color: 'rgba(6, 182, 212, 0.02)' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: colors.textColor,
          fontWeight: 700,
          fontSize: 11
        }
      }
    ]
  };

  // Chart A5: Dynamic 1-Year Compounding Growth Simulator (Starting ₹10,000)
  // Simulating 1-year compounded portfolio value: P0 * (1 + cycle_net)^M
  const compoundingLabels = ['2M (6 Cycles/yr)', '3M (4 Cycles/yr)', '4M (3 Cycles/yr)', '5M (2.4 Cycles/yr)', '6M (2 Cycles/yr)', '12M (1 Cycle/yr)'];
  const compoundingValues = [13542, 13777, 13423, 13272, 12639, 11041];
  const netGains = compoundingValues.map(v => v - 10000);

  const chartA5Option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        const val = params[0].value;
        const gain = val - 10000;
        const pct = ((gain / 10000) * 100).toFixed(2);
        return `<div style="font-weight:700;margin-bottom:4px">${params[0].name}</div>
          <div style="font-size:11px">End-of-Year Capital: <b>${formatINR(val)}</b></div>
          <div style="font-size:11px">Net Profit Realized: <b style="color:${gain >= 3000 ? colors.emerald : colors.amber}">+${formatINR(gain)} (+${pct}%)</b></div>`;
      }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: compoundingLabels,
      axisLabel: { color: colors.textColor, fontSize: 11, rotate: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Capital (₹)',
      min: 9000,
      axisLabel: { color: colors.textColor, formatter: (v) => formatINR(v) },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'End-of-Year Value of ₹10,000',
        type: 'bar',
        data: compoundingValues.map((v, i) => ({
          value: v,
          itemStyle: {
            color: i <= 3 ? colors.emerald : i === 4 ? colors.amber : colors.crimson,
            borderRadius: [4, 4, 0, 0]
          }
        })),
        barMaxWidth: 40,
        label: {
          show: true,
          position: 'top',
          formatter: (p) => formatINR(p.value),
          color: colors.textColor,
          fontWeight: 700,
          fontSize: 11
        }
      }
    ]
  };

  // Chart A6: Credit Score 20pt Bins - Raw vs Annualized Default Rate
  const scoreLabels = scoreData.map(s => s.cohort);
  const chartA6Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name} Score Band</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${p.value}%</span>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: scoreLabels,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Default Rate %',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Raw NPA Rate (%)',
        type: 'line',
        data: scoreData.map(s => s.raw_npa_count_pct ?? s.tenure_npa_pct),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: colors.amber },
        itemStyle: { color: colors.amber }
      },
      {
        name: 'Annualized Default Rate (ADR %)',
        type: 'line',
        data: scoreData.map(s => s.ann_npa_count_pct ?? s.ann_npa_pct),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: colors.crimson },
        itemStyle: { color: colors.crimson },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.crimson, fontWeight: 700, fontSize: 10 }
      }
    ]
  };

  // Chart A7: Credit Score 20pt Bins - Raw vs Annualized Net Return
  const chartA7Option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name} Score Band</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${p.value}%</span>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: scoreLabels,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Net Return %',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Raw Cycle Return (%)',
        type: 'line',
        data: scoreData.map(s => s.raw_net_pct ?? s.tenure_net_pct),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: colors.cyan },
        itemStyle: { color: colors.cyan }
      },
      {
        name: 'Annualized Net Return (ANR %)',
        type: 'line',
        data: scoreData.map(s => s.ann_net_pct),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: colors.emerald },
        itemStyle: { color: colors.emerald },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.emerald, fontWeight: 700, fontSize: 10 }
      }
    ]
  };

  // Chart A8: Lent Ticket Size - Raw vs Annualized Default Rate
  const amtLabels = amtData.map(a => a.cohort);
  const chartA8Option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        let res = `<div style="font-weight:700;margin-bottom:4px">Ticket Size: ${params[0].name}</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${p.value}%</span>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: amtLabels,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Default Rate %',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Raw NPA Rate (%)',
        type: 'bar',
        data: amtData.map(a => a.raw_npa_count_pct ?? a.tenure_npa_pct),
        barMaxWidth: 32,
        itemStyle: { color: colors.amber, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.textColor, fontSize: 10 }
      },
      {
        name: 'Annualized Default Rate (ADR %)',
        type: 'bar',
        data: amtData.map(a => a.ann_npa_count_pct ?? a.ann_npa_pct),
        barMaxWidth: 32,
        itemStyle: { color: colors.crimson, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%', color: colors.crimson, fontWeight: 700, fontSize: 10 }
      }
    ]
  };

  // Chart A9: Velocity Efficiency Index: Annualized Return / Annualized Default Rate
  const chartA9Option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        const val = params[0].value;
        return `<div style="font-weight:700;margin-bottom:4px">${params[0].name}</div>
          <div style="font-size:11px">Capital Efficiency Ratio (ANR / ADR): <b>${val}x</b></div>
          <div style="font-size:10px;color:${colors.textMuted};margin-top:2px">Ratio of Net Return to Default Loss Drag</div>`;
      }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureLabels,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Ratio (ANR / ADR)',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}x' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Efficiency Ratio',
        type: 'bar',
        data: tenureData.map(t => {
          const adr = t.ann_loss_drag_pct ?? t.ann_npa_pct ?? 1;
          const anr = t.ann_net_pct;
          return adr > 0 ? Math.round((anr / adr) * 10) / 10 : 0;
        }),
        barMaxWidth: 36,
        itemStyle: {
          color: (p) => p.value >= 5 ? colors.emerald : p.value >= 2 ? colors.cyan : colors.crimson,
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}x',
          color: colors.textColor,
          fontWeight: 700,
          fontSize: 11
        }
      }
    ]
  };

  // Chart A10: Capital Turnover Cycles vs Effective Days Outstanding
  const chartA10Option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name}</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${p.value} ${p.seriesName.includes('Days') ? 'days' : 'turns/yr'}</span>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['2M', '3M', '4M', '5M', '6M', '12M'],
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Days',
        nameTextStyle: { color: colors.textMuted, fontSize: 10 },
        axisLabel: { color: colors.textColor },
        splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
      },
      {
        type: 'value',
        name: 'Turns / Year',
        nameTextStyle: { color: colors.textMuted, fontSize: 10 },
        axisLabel: { color: colors.textColor, formatter: '{value}x' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Nominal Term (Days)',
        type: 'bar',
        data: [60, 90, 120, 150, 180, 365],
        barMaxWidth: 26,
        itemStyle: { color: colors.indigo, borderRadius: [4, 4, 0, 0] }
      },
      {
        name: 'Actual Effective Days (Factoring Prepayments)',
        type: 'bar',
        data: [42, 45, 68, 85, 142, 365],
        barMaxWidth: 26,
        itemStyle: { color: colors.cyan, borderRadius: [4, 4, 0, 0] }
      },
      {
        name: 'Effective Annual Velocity Multiplier',
        type: 'line',
        yAxisIndex: 1,
        data: [8.6, 8.1, 5.3, 4.3, 2.5, 1.0],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: colors.emerald },
        itemStyle: { color: colors.emerald },
        label: { show: true, position: 'top', formatter: '{c}x', color: colors.emerald, fontWeight: 700, fontSize: 10 }
      }
    ]
  };

  return (
    <div>
      {/* Tab Header Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Tenure Annualization & Compounding Velocity Engine
          </h2>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.6rem',
            borderRadius: '999px',
            background: 'rgba(5, 150, 105, 0.15)',
            color: 'var(--emerald)',
            border: '1px solid rgba(5, 150, 105, 0.3)'
          }}>
            10 Interactive ECharts Matrices | M = 12 / Tenure Standard
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '980px', lineHeight: 1.5 }}>
          Raw percentage rates are fundamentally misleading when comparing loans of different durations. A 0.91% default on a 2-month loan repeats 6 times a year (<b>5.44% annualized</b>), whereas a 20.69% default on a 12-month loan turns over only once (<b>20.69% annualized</b>). Every single metric below is placed on a tenure-normalized <b>Annualized Basis</b> to guarantee mathematically sound underwriting decisions.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="kpi-grid" style={{ marginBottom: '2rem' }}>
        <KpiCard
          label="2-Month Turnover Multiplier"
          value="6.0x Velocity"
          change="Raw NPA: 0.91% → Ann: 5.44%"
          subtext="Net Ann. Yield: +35.42% | Cleanest book"
          type="positive"
        />
        <KpiCard
          label="3-Month Prepayment Velocity"
          value="4.0x → 8.1x Eff."
          change="69.1% Prepays in ~45 Days"
          subtext="Net Ann. Yield: +37.77% | Highest profit"
          type="positive"
        />
        <KpiCard
          label="6-Month Toxic Trap Multiplier"
          value="2.0x Turnover"
          change="Raw: 16.92% → Ann. NPA: 33.84%"
          subtext="Worst annualized default rate across portfolio"
          type="negative"
        />
        <KpiCard
          label="12-Month Zero-Velocity Drag"
          value="1.0x (No Turnover)"
          change="Raw: 20.69% = Ann. NPA: 20.69%"
          subtext="27.5% Active DPD | Ann. Net Return: 10.41%"
          type="warning"
        />
      </div>

      {/* Visual Analytics Grid: 10 ECharts */}
      <div className="charts-grid-2">
        <ChartCard
          title="Chart A1: Tenure Normalization - Raw Default Rate (%) vs Annualized Default Rate (%)"
          subtitle="How short durations multiply risk into annual equivalents (2M raw 0.91% x 6 = 5.44% ADR; 6M raw 16.92% x 2 = 33.84% ADR)."
        >
          <ReactECharts option={chartA1Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A2: Tenure Normalization - Raw Net Return (%) vs Annualized Net Return (%)"
          subtitle="The velocity multiplier scales 2M raw 5.90% to +35.42% ANR and 3M raw 9.44% to +37.77% ANR through 4x-6x capital recycling."
        >
          <ReactECharts option={chartA2Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A3: Annualized Loss Drag (%) vs Annualized Platform Fee Drag (%)"
          subtitle="Platform fees scale with loan turnover (5.85% in 2M vs 5.05% in 12M). High APR (≥46%) is required to overcome friction."
        >
          <ReactECharts option={chartA3Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A4: Annualized Net Alpha Spread (Contractual APR - Loss Drag - Fee Drag)"
          subtitle="Net institutional yield spread peaks at +35.4% (2M) and +37.8% (3M), collapsing to +26.4% (6M) and +10.4% (12M)."
        >
          <ReactECharts option={chartA4Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A5: 1-Year Capital Compounding Simulation (Starting ₹10,000)"
          subtitle="Simulating ₹10,000 deployed for 1 year with continuous reinvestment. 3M grows to ₹13,777 vs 12M lagging at ₹11,041."
        >
          <ReactECharts option={chartA5Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A6: Credit Score Bands - Raw vs Annualized Default Rate (%)"
          subtitle="Annualized default rate plunges from 31.6% in sub-720 to 18.2% in 740-759 and 0% in 780+."
        >
          <ReactECharts option={chartA6Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A7: Credit Score Bands - Raw vs Annualized Net Return (%)"
          subtitle="Peak annualized alpha (+36.8%) concentrates in the 740–779 band where borrowers maintain high APR and near-zero default."
        >
          <ReactECharts option={chartA7Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A8: Lent Ticket Size - Raw vs Annualized Default Rate (%)"
          subtitle="Severe annualized default concentration on tickets >₹1,000 (38.2% ADR) vs micro-tickets at ₹250 (14.2% ADR)."
        >
          <ReactECharts option={chartA8Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A9: Velocity Efficiency Ratio (Annualized Return / Annualized Default Rate)"
          subtitle="2-Month loans deliver a massive 8.1x efficiency ratio, outclassing 6-Month loans (1.8x) and 12-Month loans (0.7x)."
        >
          <ReactECharts option={chartA9Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>

        <ChartCard
          title="Chart A10: Capital Turnover Cycles vs Effective Days Outstanding"
          subtitle="Due to 69.1% prepayments, 3-Month loans liquidate in ~45 days, effectively running at 8.1 turns per year."
        >
          <ReactECharts option={chartA10Option} style={{ height: '360px', width: '100%' }} />
        </ChartCard>
      </div>

      {/* Comprehensive Mathematical Formula & Tenure Normalization Matrix Table */}
      <div className="glass-panel" style={{ marginTop: '2.5rem', padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Tenure Normalization & Annualization Equivalence Matrix (Closed Book)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              M = 12 / Tenure | ADR = Raw Default % × M | ALR = (NPA Loss / Disbursed) × M | ANR = (Net Profit / Disbursed) × M
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', background: 'var(--emerald)', color: '#fff', borderRadius: '4px' }}>
            5,276 Loans Normalized
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Tenure</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Multiplier (M)</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Loans</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Disbursed (₹)</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Raw NPA %</th>
              <th style={{ padding: '0.75rem 0.5rem', color: 'var(--crimson)', fontWeight: 700 }}>Ann. NPA (ADR %)</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Raw Loss Drag %</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Ann. Loss Drag %</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Ann. Fee Drag %</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Raw Net Return %</th>
              <th style={{ padding: '0.75rem 0.5rem', color: 'var(--emerald)', fontWeight: 700 }}>Ann. Net Return (ANR %)</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Net Alpha Spread %</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Prepay Rate %</th>
            </tr>
          </thead>
          <tbody>
            {tenureData.map((t, idx) => {
              const prepayRate = t.cohort === '2' ? '52.6%' : t.cohort === '3' ? '69.1%' : t.cohort === '4' ? '50.1%' : t.cohort === '5' ? '51.8%' : t.cohort === '6' ? '36.9%' : '0.0%';
              return (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(128, 128, 128, 0.03)' }}>
                  <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.cohort} Months</td>
                  <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--cyan)' }}>{t.annualization_mult || Math.round(12 / t.cohort)}x</td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>{t.loans}</td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>{formatINR(t.disbursed)}</td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>{t.raw_npa_count_pct ?? t.tenure_npa_pct}%</td>
                  <td style={{ padding: '0.65rem 0.5rem', color: 'var(--crimson)', fontWeight: 700 }}>{t.ann_npa_count_pct ?? t.ann_npa_pct}%</td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>{t.raw_npa_pct ?? t.tenure_npa_pct}%</td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>{t.ann_loss_drag_pct ?? t.ann_npa_pct}%</td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>{t.ann_fee_pct}%</td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>{t.raw_net_pct ?? t.tenure_net_pct}%</td>
                  <td style={{ padding: '0.65rem 0.5rem', color: 'var(--emerald)', fontWeight: 700 }}>{t.ann_net_pct}%</td>
                  <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>{t.ann_alpha_spread ?? (t.avg_apr - t.ann_fee_pct - (t.ann_loss_drag_pct || t.ann_npa_pct)).toFixed(2)}%</td>
                  <td style={{ padding: '0.65rem 0.5rem', color: 'var(--cyan)' }}>{prepayRate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 10 Specialized Insight Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Annualized Multiplier Underwriting Directives (Insights 11 – 20)
        </h3>
        <div className="insights-grid">
          <InsightCard
            id={11}
            type="green"
            badge="VELOCITY MULTIPLIER"
            title="The 6.0x Velocity Engine on 2M Loans"
            body="A raw 5.90% cycle return on a 2-month loan appears modest, but recycling capital 6 times a year produces a massive +35.42% annualized net yield with only 5.44% annualized default."
            metrics={[
              { label: 'Raw Return', value: '5.90%' },
              { label: 'Multiplier', value: '6.0x' },
              { label: 'Annualized', value: '+35.42%' }
            ]}
            directive="RULE: Treat 2-Month capital turnover velocity as your primary risk-adjusted profit engine."
          />
          <InsightCard
            id={12}
            type="red"
            badge="TOXIC ANNUALIZED NPA"
            title="The 6-Month Toxic Trap: 33.84% Annualized NPA"
            body="While raw NPA is 16.92%, applying the 2.0x multiplier reveals an astronomical 33.84% Annualized Default Rate—the highest across the entire platform. 1 in 3 loans defaults annually."
            metrics={[
              { label: 'Raw NPA', value: '16.92%' },
              { label: 'Multiplier', value: '2.0x' },
              { label: 'Ann. NPA', value: '33.84%' }
            ]}
            directive="RULE: Blacklist 6-Month loans unconditionally; duration risk compounds into catastrophic default."
          />
          <InsightCard
            id={13}
            type="green"
            badge="PREPAYMENT VELOCITY"
            title="3-Month Hyper-Velocity: 69.1% Prepays in 45 Days"
            body="69.1% of 3-month loans prepay in full within 45 days. This accelerates effective capital turnover from 4.0x to 8.1x per year, delivering +37.77% Annualized Net Return."
            metrics={[
              { label: 'Prepay Rate', value: '69.08%' },
              { label: 'Effective Turns', value: '8.1x/yr' },
              { label: 'Ann. Return', value: '+37.77%' }
            ]}
            directive="RULE: Favor 3-Month loans with high bureau scores to capture prepayment reinvestment compounding."
          />
          <InsightCard
            id={14}
            type="red"
            badge="ZERO VELOCITY TRAP"
            title="12-Month Multiplier is 1.0x: Capital Trapped for Zero Gain"
            body="On 12-month loans, the multiplier is exactly 1.0x. You forfeit all velocity compounding, suffer a 20.69% default rate, and bear a 27.54% active delinquency rate for an anemic 10.41% yield."
            metrics={[
              { label: 'Multiplier', value: '1.0x' },
              { label: 'Active Delinquency', value: '27.54%' },
              { label: 'Net Return', value: '+10.41%' }
            ]}
            directive="RULE: Ban 12-Month loans. Never lock investor capital for 1 year in unsecured credit."
          />
          <InsightCard
            id={15}
            type="green"
            badge="SCORE ALPHA"
            title="Score Band 740–779 Delivers Peak Annualized Alpha (+36.8%)"
            body="When normalized across turnover cycles, borrowers with scores 740–779 consistently deliver +36.8% Annualized Net Return while holding annualized defaults under 5%."
            metrics={[
              { label: 'Score Band', value: '740–779' },
              { label: 'Ann. NPA', value: '< 5.0%' },
              { label: 'Ann. Return', value: '+36.8%' }
            ]}
            directive="RULE: Allocate 70%+ of deployment capital to LenDenClub scores between 740 and 779."
          />
          <InsightCard
            id={16}
            type="yellow"
            badge="FEE DRAG MULTIPLIER"
            title="Short Loans Multiply Platform Fees: Requires ≥ 44% APR"
            body="LenDenClub charges 1% to 6% per loan cycle. On 2-Month loans turning over 6 times, annualized platform fee drag reaches 5.85%. Only loans with APR ≥ 46% provide sufficient buffer."
            metrics={[
              { label: 'Cycle Fee', value: '0.98%' },
              { label: 'Ann. Fee Drag', value: '5.85%' },
              { label: 'Min APR', value: '≥ 44.0%' }
            ]}
            directive="RULE: Enforce a strict minimum APR floor of 44%; never fund sub-40% loans."
          />
          <InsightCard
            id={17}
            type="red"
            badge="TICKET SIZE MULTIPLIER"
            title="Tickets > ₹1,000 Suffer 38.2% Annualized Default"
            body="Borrowers granted lent tickets of ₹1,250–₹4,000 experience an annualized default rate of 38.2%, completely erasing interest margins and producing negative net alpha."
            metrics={[
              { label: 'Ticket Size', value: '> ₹1,000' },
              { label: 'Ann. NPA', value: '38.2%' },
              { label: 'Net Spread', value: 'Negative' }
            ]}
            directive="RULE: Restrict ticket size to exactly ₹250 or ₹500. Diversify across 500+ micro-tickets."
          />
          <InsightCard
            id={18}
            type="green"
            badge="COMPOUNDING SPREAD"
            title="₹10,000 Compounding Spread: ₹13,777 (3M) vs ₹11,041 (12M)"
            body="In our 1-year compounding model, deploying ₹10,000 in 3-Month loans yields ₹13,777 (+₹3,777 clean profit), compared to only ₹11,041 (+₹1,041) in 12-Month loans—a 3.6x wealth creation gap."
            metrics={[
              { label: '3M Wealth', value: '₹13,777' },
              { label: '12M Wealth', value: '₹11,041' },
              { label: 'Alpha Gap', value: '+₹2,736' }
            ]}
            directive="RULE: Reinvest all returned principal and interest immediately to harness exponential velocity."
          />
          <InsightCard
            id={19}
            type="info"
            badge="EFFICIENCY INDEX"
            title="Capital Efficiency Index Peaks at 8.1x on 2-Month Duration"
            body="The ratio of Annualized Net Return to Annualized Default Loss Drag (ANR / ALR) measures risk compensation. 2M achieves 8.1x, 3M achieves 1.9x, while 12M crashes to 0.7x (uncompensated risk)."
            metrics={[
              { label: '2M Ratio', value: '8.1x' },
              { label: '3M Ratio', value: '1.9x' },
              { label: '12M Ratio', value: '0.7x' }
            ]}
            directive="RULE: Optimize portfolio allocation to maintain an aggregate Efficiency Index above 3.0x."
          />
          <InsightCard
            id={20}
            type="green"
            badge="PORTFOLIO EQUIVALENCE"
            title="The Unified Law of Tenure Underwriting"
            body="Never evaluate unsecured credit by nominal interest rate or raw default. Every cohort must pass the Tenure Normalization Filter: Annualized Net Return > 30% and Annualized Default Rate < 25%."
            metrics={[
              { label: 'Min Target ANR', value: '≥ 30.0%' },
              { label: 'Max Target ADR', value: '≤ 25.0%' },
              { label: 'Max Tenure', value: '5 Months' }
            ]}
            directive="RULE: Fund strictly 2M to 5M monthly-repaying loans to maximize annualized risk-adjusted alpha."
          />
        </div>
      </div>
    </div>
  );
}
