import { formatINR, formatPercent } from './formatters';

export function getChartThemeColors(isDark = false) {
  if (isDark) {
    return {
      textColor: '#94A3B8',
      textPrimary: '#F8FAFC',
      textMuted: '#64748B',
      gridLineColor: 'rgba(255, 255, 255, 0.06)',
      tooltipBg: 'rgba(15, 23, 42, 0.95)',
      tooltipBorder: 'rgba(255, 255, 255, 0.15)',
      tooltipText: '#F8FAFC',
      emerald: '#10B981',
      crimson: '#EF4444',
      cyan: '#06B6D4',
      amber: '#F59E0B',
      indigo: '#6366F1',
      purple: '#8B5CF6',
      cardBg: 'rgba(16, 24, 40, 0.75)'
    };
  } else {
    return {
      textColor: '#475569',
      textPrimary: '#0F172A',
      textMuted: '#64748B',
      gridLineColor: '#E2E8F0',
      tooltipBg: 'rgba(255, 255, 255, 0.96)',
      tooltipBorder: '#CBD5E1',
      tooltipText: '#0F172A',
      emerald: '#059669',
      crimson: '#DC2626',
      cyan: '#0284C7',
      amber: '#D97706',
      indigo: '#4F46E5',
      purple: '#7C3AED',
      cardBg: '#FFFFFF'
    };
  }
}

/**
 * Standard Bar Chart Option
 */
export function buildBarOption({
  labels = [],
  series = [],
  isDark = false,
  isHorizontal = false,
  yAxisName = '',
  xAxisName = '',
  isCurrency = false,
  isPercent = false
}) {
  const colors = getChartThemeColors(isDark);

  const formattedSeries = series.map((s, idx) => ({
    name: s.name || s.label || `Series ${idx + 1}`,
    type: 'bar',
    data: s.data || [],
    barMaxWidth: 38,
    itemStyle: {
      borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
      color: s.color || s.backgroundColor || colors.emerald
    },
    label: s.showLabel ? {
      show: true,
      position: isHorizontal ? 'right' : 'top',
      color: colors.textColor,
      fontSize: 10,
      formatter: (p) => isCurrency ? formatINR(p.value) : isPercent ? `${p.value}%` : p.value
    } : { show: false }
  }));

  const needsRotation = !isHorizontal && labels.some(l => String(l).length > 7);
  const hasLegend = series.length > 1;

  const categoryAxis = {
    type: 'category',
    data: labels,
    axisLabel: {
      color: colors.textColor,
      fontSize: 10,
      interval: 0,
      rotate: needsRotation ? 20 : 0
    },
    axisLine: { lineStyle: { color: colors.gridLineColor } },
    axisTick: { show: false }
  };

  const valueAxis = {
    type: 'value',
    name: isHorizontal ? xAxisName : yAxisName,
    nameTextStyle: { color: colors.textMuted, fontSize: 10 },
    axisLabel: {
      color: colors.textColor,
      fontSize: 10,
      formatter: (v) => isCurrency ? formatINR(v) : isPercent ? `${v}%` : v
    },
    splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
  };

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        if (!params || !params.length) return '';
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name}</div>`;
        params.forEach(p => {
          const val = isCurrency ? formatINR(p.value) : isPercent ? `${p.value}%` : Number(p.value).toLocaleString();
          res += `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${val}</span>
          </div>`;
        });
        return res;
      }
    },
    grid: {
      top: yAxisName ? 34 : 20,
      left: '4%',
      right: '4%',
      bottom: hasLegend ? (needsRotation ? 58 : 44) : (needsRotation ? 42 : 24),
      containLabel: true
    },
    legend: hasLegend ? {
      show: true,
      bottom: 0,
      itemGap: 14,
      textStyle: { color: colors.textColor, fontSize: 11 }
    } : { show: false },
    xAxis: isHorizontal ? valueAxis : categoryAxis,
    yAxis: isHorizontal ? categoryAxis : valueAxis,
    series: formattedSeries
  };
}

/**
 * Standard Line / Area Chart Option
 */
export function buildLineOption({
  labels = [],
  series = [],
  isDark = false,
  yAxisName = '',
  isCurrency = false,
  isPercent = false
}) {
  const colors = getChartThemeColors(isDark);
  const needsRotation = labels.some(l => String(l).length > 7);
  const hasLegend = series.length > 1;

  const formattedSeries = series.map((s, idx) => ({
    name: s.name || s.label || `Series ${idx + 1}`,
    type: 'line',
    data: s.data || [],
    smooth: s.smooth !== false,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: 2.5,
      color: s.color || s.borderColor || colors.cyan
    },
    itemStyle: {
      color: s.color || s.borderColor || colors.cyan
    },
    areaStyle: s.fill ? {
      color: s.areaColor || 'rgba(2, 132, 199, 0.12)'
    } : undefined
  }));

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        if (!params || !params.length) return '';
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name}</div>`;
        params.forEach(p => {
          const val = isCurrency ? formatINR(p.value) : isPercent ? `${p.value}%` : Number(p.value).toLocaleString();
          res += `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700">${val}</span>
          </div>`;
        });
        return res;
      }
    },
    grid: {
      top: yAxisName ? 34 : 20,
      left: '4%',
      right: '4%',
      bottom: hasLegend ? (needsRotation ? 58 : 44) : (needsRotation ? 42 : 24),
      containLabel: true
    },
    legend: hasLegend ? {
      show: true,
      bottom: 0,
      itemGap: 14,
      textStyle: { color: colors.textColor, fontSize: 11 }
    } : { show: false },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: {
        color: colors.textColor,
        fontSize: 10,
        interval: 0,
        rotate: needsRotation ? 20 : 0
      },
      axisLine: { lineStyle: { color: colors.gridLineColor } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: {
        color: colors.textColor,
        fontSize: 10,
        formatter: (v) => isCurrency ? formatINR(v) : isPercent ? `${v}%` : v
      },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: formattedSeries
  };
}

/**
 * Mixed Bar + Line Chart Option (Guaranteed Line on Top with z: 10)
 */
export function buildMixedBarLineOption({
  labels = [],
  barSeries = [],
  lineSeries = [],
  isDark = false,
  barAxisName = 'Volume / Capital',
  lineAxisName = 'Rate %',
  isBarCurrency = false,
  isLinePercent = true
}) {
  const colors = getChartThemeColors(isDark);

  const series = [
    ...barSeries.map((b, idx) => ({
      name: b.name || b.label || 'Volume',
      type: 'bar',
      yAxisIndex: 0,
      data: b.data || [],
      barMaxWidth: 36,
      z: 2, // Placed on base layer
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: b.color || b.backgroundColor || (idx === 0 ? colors.cyan : colors.indigo)
      }
    })),
    ...lineSeries.map((l) => ({
      name: l.name || l.label || 'NPA / Margin %',
      type: 'line',
      yAxisIndex: 1,
      data: l.data || [],
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      z: 10, // STRICTLY ELEVATED ON TOP OF BARS
      lineStyle: {
        width: 3,
        color: l.color || l.borderColor || colors.crimson,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowBlur: 4
      },
      itemStyle: {
        color: l.color || l.borderColor || colors.crimson,
        borderWidth: 2,
        borderColor: '#FFFFFF'
      },
      label: l.showLabel ? {
        show: true,
        position: 'top',
        color: l.color || colors.crimson,
        fontWeight: 'bold',
        fontSize: 10,
        formatter: (p) => `${p.value}%`
      } : { show: false }
    }))
  ];
  const needsRotation = labels.some(l => String(l).length > 7);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        if (!params || !params.length) return '';
        let res = `<div style="font-weight:700;margin-bottom:6px;border-bottom:1px solid ${colors.gridLineColor};padding-bottom:3px">${params[0].name}</div>`;
        params.forEach(p => {
          const isLine = p.seriesType === 'line';
          const val = isLine
            ? (isLinePercent ? `${p.value}%` : p.value)
            : (isBarCurrency ? formatINR(p.value) : Number(p.value).toLocaleString());
          res += `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:11px;margin-top:2px">
            <span>${p.marker} ${p.seriesName}:</span>
            <span style="font-weight:700;color:${isLine ? colors.crimson : colors.textPrimary}">${val}</span>
          </div>`;
        });
        return res;
      }
    },
    grid: {
      top: 38,
      left: '4%',
      right: '5%',
      bottom: needsRotation ? 58 : 46,
      containLabel: true
    },
    legend: {
      show: true,
      bottom: 0,
      itemGap: 14,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: {
        color: colors.textColor,
        fontSize: 10,
        interval: 0,
        rotate: needsRotation ? 20 : 0
      },
      axisLine: { lineStyle: { color: colors.gridLineColor } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: barAxisName,
        nameTextStyle: { color: colors.textMuted, fontSize: 10 },
        axisLabel: {
          color: colors.textColor,
          fontSize: 10,
          formatter: (v) => isBarCurrency ? formatINR(v) : v
        },
        splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
      },
      {
        type: 'value',
        name: lineAxisName,
        nameTextStyle: { color: colors.crimson, fontSize: 10, fontWeight: 'bold' },
        axisLabel: {
          color: colors.crimson,
          fontSize: 10,
          formatter: (v) => `${v}%`
        },
        splitLine: { show: false }
      }
    ],
    series
  };
}

/**
 * Donut / Pie Chart Option
 */
export function buildDonutOption({
  data = [],
  isDark = false,
  isDonut = true,
  centerTitle = ''
}) {
  const colors = getChartThemeColors(isDark);

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: '{b}: <span style="font-weight:700">{c} ({d}%)</span>'
    },
    legend: {
      show: true,
      bottom: 4,
      left: 'center',
      itemGap: 12,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    series: [
      {
        name: centerTitle || 'Distribution',
        type: 'pie',
        radius: isDonut ? ['38%', '62%'] : '62%',
        center: ['50%', '42%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: colors.cardBg,
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            color: colors.textPrimary,
            formatter: '{b}\n{d}%'
          }
        },
        labelLine: { show: false },
        data
      }
    ]
  };
}

/**
 * Radar Chart Option
 */
export function buildRadarOption({
  indicators = [],
  series = [],
  isDark = false
}) {
  const colors = getChartThemeColors(isDark);

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: colors.tooltipText, fontSize: 12 }
    },
    legend: {
      show: true,
      bottom: 4,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 4,
      center: ['50%', '46%'],
      radius: '58%',
      axisName: {
        color: colors.textColor,
        fontSize: 10
      },
      splitLine: {
        lineStyle: { color: colors.gridLineColor }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: isDark
            ? ['rgba(255, 255, 255, 0.01)', 'rgba(255, 255, 255, 0.03)']
            : ['rgba(0, 0, 0, 0.01)', 'rgba(0, 0, 0, 0.03)']
        }
      },
      axisLine: {
        lineStyle: { color: colors.gridLineColor }
      }
    },
    series: [
      {
        type: 'radar',
        data: series.map(s => ({
          name: s.name,
          value: s.value,
          itemStyle: { color: s.color },
          lineStyle: { width: 2.5, color: s.color },
          areaStyle: { color: s.areaColor || 'rgba(16, 185, 129, 0.2)' }
        }))
      }
    ]
  };
}

/**
 * 1. Bullet Chart Option
 * Features a primary actual bar, quantitative performance background bands, and target benchmark line.
 */
export function buildBulletOption({
  categories = ['Portfolio Closed ANR'],
  actual = 16.91,
  target = 21.55,
  ranges = [10, 18, 25, 35], // [Sub-par, Baseline, Target Sweet-spot, Elite]
  isDark = false,
  unit = '%'
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: () => {
        return `<div style="font-weight:700;margin-bottom:4px">Portfolio Net Return Benchmark</div>
        <div style="color:${colors.emerald}">● Realized Net ANR: <b>${actual}${unit}</b></div>
        <div style="color:${colors.cyan}">● Golden Rules Target: <b>${target}${unit}</b></div>
        <div style="font-size:10px;color:${colors.textMuted};margin-top:4px">Benchmark: Sub-par <10% | Base 10-18% | Elite >18%</div>`;
      }
    },
    grid: { top: 30, left: '4%', right: '8%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'value',
      max: ranges[3] || 35,
      axisLabel: { color: colors.textColor, formatter: `{value}${unit}` },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: colors.textColor, fontSize: 11, fontWeight: 'bold' },
      axisLine: { lineStyle: { color: colors.gridLineColor } },
      axisTick: { show: false }
    },
    series: [
      // Background Range 3 (Elite - outer)
      {
        name: 'Elite (25-35%)',
        type: 'bar',
        barGap: '-100%',
        barWidth: 32,
        data: [ranges[3]],
        itemStyle: { color: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.12)', borderRadius: 4 },
        z: 1
      },
      // Background Range 2 (Target Sweet-spot)
      {
        name: 'Target Range (18-25%)',
        type: 'bar',
        barGap: '-100%',
        barWidth: 32,
        data: [ranges[2]],
        itemStyle: { color: isDark ? 'rgba(6, 182, 212, 0.18)' : 'rgba(2, 132, 199, 0.15)', borderRadius: 4 },
        z: 2
      },
      // Background Range 1 (Baseline)
      {
        name: 'Base Range (10-18%)',
        type: 'bar',
        barGap: '-100%',
        barWidth: 32,
        data: [ranges[1]],
        itemStyle: { color: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(217, 119, 6, 0.12)', borderRadius: 4 },
        z: 3
      },
      // Background Range 0 (Sub-par)
      {
        name: 'Sub-par (<10%)',
        type: 'bar',
        barGap: '-100%',
        barWidth: 32,
        data: [ranges[0]],
        itemStyle: { color: isDark ? 'rgba(239, 68, 68, 0.18)' : 'rgba(220, 38, 38, 0.15)', borderRadius: 4 },
        z: 4
      },
      // Actual Performance Bar (Thinner, foreground)
      {
        name: 'Actual ANR',
        type: 'bar',
        barGap: '-100%',
        barWidth: 14,
        data: [actual],
        itemStyle: { color: colors.emerald, borderRadius: [0, 4, 4, 0] },
        markLine: {
          symbol: ['none', 'none'],
          lineStyle: { color: colors.cyan, width: 3, type: 'solid' },
          label: {
            show: true,
            formatter: `Target: ${target}${unit}`,
            position: 'end',
            color: colors.cyan,
            fontSize: 10,
            fontWeight: 'bold'
          },
          data: [{ xAxis: target }]
        },
        z: 10
      }
    ]
  };
}

/**
 * 2. Butterfly (Tornado) Chart Option
 * Dual diverging comparison from a central zero axis (e.g. Closed vs Defaulted loans).
 */
export function buildButterflyOption({
  categories = [],
  leftData = [],
  rightData = [],
  leftName = 'Defaulted (NPA)',
  rightName = 'Repaid (Closed)',
  isDark = false
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        let res = `<div style="font-weight:700;margin-bottom:4px">${params[0].name} Tenure</div>`;
        params.forEach(p => {
          const val = Math.abs(p.value);
          res += `<div style="display:flex;justify-content:space-between;gap:12px">
            <span>${p.marker} ${p.seriesName}:</span>
            <b>${val.toLocaleString()} Loans</b>
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
    grid: { top: 25, left: '5%', right: '5%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: colors.textColor,
        fontSize: 10,
        formatter: (v) => Math.abs(v).toLocaleString()
      },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } },
      axisTick: { show: false }
    },
    series: [
      {
        name: leftName,
        type: 'bar',
        stack: 'total',
        data: leftData.map(v => -Math.abs(v)),
        itemStyle: { color: colors.crimson, borderRadius: [4, 0, 0, 4] },
        barMaxWidth: 26
      },
      {
        name: rightName,
        type: 'bar',
        stack: 'total',
        data: rightData.map(v => Math.abs(v)),
        itemStyle: { color: colors.emerald, borderRadius: [0, 4, 4, 0] },
        barMaxWidth: 26
      }
    ]
  };
}

/**
 * 3. Candlestick (OHLC) Chart Option
 * Financial spread tracking: Open, Close, Lowest, Highest.
 */
export function buildCandlestickOption({
  categories = [],
  data = [], // [[open, close, lowest, highest], ...]
  isDark = false,
  yAxisName = 'Net Return %'
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        const p = params[0];
        const vals = p.value;
        return `<div style="font-weight:700;margin-bottom:4px">${p.name} Vintage</div>
        <div>Open (Q1): <b>${vals[1]}%</b></div>
        <div>Close (Q3): <b>${vals[2]}%</b></div>
        <div style="color:${colors.crimson}">Lowest (Min): <b>${vals[3]}%</b></div>
        <div style="color:${colors.emerald}">Highest (Max): <b>${vals[4]}%</b></div>`;
      }
    },
    grid: { top: 35, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        type: 'candlestick',
        data,
        itemStyle: {
          color: colors.emerald,
          color0: colors.crimson,
          borderColor: colors.emerald,
          borderColor0: colors.crimson
        }
      }
    ]
  };
}

/**
 * 4. Gantt Chart Option
 * Horizontal timeline for loan servicing and lifecycle schedules.
 */
export function buildGanttOption({
  tasks = [], // [{ name, start, duration, color }]
  isDark = false
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (params) => {
        const p = params[1];
        if (!p) return '';
        return `<b>${p.name}</b><br/>Servicing Window: <b>Month 0 to Month ${p.value}</b><br/>Duration: <b>${p.value} Months</b>`;
      }
    },
    grid: { top: 25, left: '5%', right: '6%', bottom: 25, containLabel: true },
    xAxis: {
      type: 'value',
      name: 'Months',
      min: 0,
      max: 12,
      axisLabel: { color: colors.textColor, formatter: '{value}M' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: tasks.map(t => t.name),
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    series: [
      // Base offset (transparent)
      {
        name: 'Start Offset',
        type: 'bar',
        stack: 'schedule',
        itemStyle: { borderColor: 'transparent', color: 'transparent' },
        emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
        data: tasks.map(t => t.start || 0)
      },
      // Active duration bar
      {
        name: 'Loan Duration',
        type: 'bar',
        stack: 'schedule',
        data: tasks.map(t => ({
          value: t.duration,
          itemStyle: { color: t.color || colors.cyan, borderRadius: 4 }
        })),
        barMaxWidth: 22,
        label: {
          show: true,
          position: 'insideRight',
          formatter: (p) => `${p.value}M`,
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: 'bold'
        }
      }
    ]
  };
}

/**
 * 5. Treemap Option
 * Hierarchical multi-level rectangular tiles (e.g. Employment -> Profession -> Risk Category).
 */
export function buildTreemapOption({
  data = [],
  isDark = false,
  title = 'Portfolio Allocation Treemap'
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => {
        const val = p.value ? `₹${Number(p.value).toLocaleString()}` : '';
        return `<b>${p.name}</b><br/>Capital Deployed: <b>${val}</b>`;
      }
    },
    series: [
      {
        type: 'treemap',
        name: title,
        data,
        leafDepth: 2,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: '{b}\n₹{c}',
          fontSize: 11,
          color: '#FFFFFF',
          fontWeight: 'bold'
        },
        itemStyle: {
          borderColor: colors.cardBg,
          borderWidth: 2,
          gapWidth: 2
        },
        levels: [
          { itemStyle: { borderWidth: 3, borderColor: colors.cardBg, gapWidth: 3 } },
          { itemStyle: { gapWidth: 2 } }
        ]
      }
    ]
  };
}

/**
 * 6. Sunburst Chart Option
 * Concentric circular rings for multi-layer hierarchical breakdowns.
 */
export function buildSunburstOption({
  data = [],
  isDark = false
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => `<b>${p.name}</b><br/>Exposure: <b>₹${Number(p.value).toLocaleString()}</b>`
    },
    series: [
      {
        type: 'sunburst',
        data,
        radius: ['15%', '85%'],
        center: ['50%', '50%'],
        sort: undefined,
        emphasis: { focus: 'ancestor' },
        itemStyle: {
          borderRadius: 4,
          borderWidth: 2,
          borderColor: colors.cardBg
        },
        label: {
          rotate: 'radial',
          color: colors.textColor,
          fontSize: 10
        },
        levels: [
          {},
          { r0: '15%', r: '40%', itemStyle: { borderWidth: 2 }, label: { rotate: 'tangential', fontSize: 11, fontWeight: 'bold' } },
          { r0: '40%', r: '70%', label: { align: 'right' } },
          { r0: '70%', r: '85%', label: { position: 'outside', padding: 3, silent: false } }
        ]
      }
    ]
  };
}

/**
 * 7. Histogram Option
 * Continuous frequency binning with normal density curve overlay.
 */
export function buildHistogramOption({
  bins = [],
  frequencies = [],
  curveData = [],
  isDark = false,
  xAxisName = 'Credit Score',
  yAxisName = 'Frequency'
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: bins,
      name: xAxisName,
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Loan Count',
        type: 'bar',
        data: frequencies,
        itemStyle: { color: colors.cyan, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 40
      },
      {
        name: 'Density Bell Curve',
        type: 'line',
        smooth: true,
        data: curveData,
        symbol: 'none',
        lineStyle: { width: 3, color: colors.amber }
      }
    ]
  };
}

/**
 * 8. Box Plot (Box-and-Whisker) Option
 * Quartile statistical dispersion: Min, Q1, Median, Q3, Max.
 */
export function buildBoxplotOption({
  categories = [],
  data = [], // [[min, Q1, median, Q3, max], ...]
  isDark = false,
  yAxisName = 'Net Return %'
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => {
        const d = p.data;
        return `<div style="font-weight:700;margin-bottom:4px">${p.name} Tenure Return Dispersion</div>
        <div>Upper Whisker (Max): <b>${d[5]}%</b></div>
        <div>Q3 (75th Percentile): <b>${d[4]}%</b></div>
        <div>Median (50th): <b>${d[3]}%</b></div>
        <div>Q1 (25th Percentile): <b>${d[2]}%</b></div>
        <div>Lower Whisker (Min): <b>${d[1]}%</b></div>`;
      }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 30, containLabel: true },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: colors.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: 'Net Return Dispersion',
        type: 'boxplot',
        data,
        itemStyle: {
          color: isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.15)',
          borderColor: colors.indigo,
          borderWidth: 2
        }
      }
    ]
  };
}

/**
 * 9. Violin / Density Option
 * Smooth dual-density probability distribution comparing two cohorts.
 */
export function buildViolinOption({
  categories = [],
  cohortA = [], // e.g. AA Medium
  cohortB = [], // e.g. A High
  nameA = 'AA (Medium Risk)',
  nameB = 'A (High Risk)',
  isDark = false
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: colors.textColor, fontSize: 11 }
    },
    grid: { top: 25, left: '4%', right: '4%', bottom: 35, containLabel: true },
    xAxis: {
      type: 'category',
      data: categories,
      name: 'Net Return Range',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Probability Density',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        name: nameA,
        type: 'line',
        smooth: true,
        data: cohortA,
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: { color: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(5, 150, 105, 0.2)' },
        lineStyle: { width: 2.5, color: colors.emerald }
      },
      {
        name: nameB,
        type: 'line',
        smooth: true,
        data: cohortB,
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: { color: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(220, 38, 38, 0.2)' },
        lineStyle: { width: 2.5, color: colors.crimson }
      }
    ]
  };
}

/**
 * 10. Scatter Plot Option
 * Cartesian correlation between two continuous variables (e.g. Score vs Return).
 */
export function buildScatterOption({
  data = [], // [[x, y, loanId, status], ...]
  isDark = false,
  xAxisName = 'Credit Score',
  yAxisName = 'Return %'
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => {
        const [x, y, id, status] = p.value;
        return `<b>Loan #${id || ''}</b> (${status || ''})<br/>${xAxisName}: <b>${x}</b><br/>${yAxisName}: <b>${y}%</b>`;
      }
    },
    grid: { top: 30, left: '4%', right: '4%', bottom: 30, containLabel: true },
    xAxis: {
      type: 'value',
      name: xAxisName,
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        type: 'scatter',
        data: data.map(pt => ({
          value: pt,
          itemStyle: {
            color: pt[3] === 'CLOSED' ? colors.emerald : pt[3] === 'NPA' ? colors.crimson : colors.cyan,
            opacity: 0.75
          }
        })),
        symbolSize: 7
      }
    ]
  };
}

/**
 * 11. Bubble Chart Option
 * 3-Variable relationship: X = Income, Y = Loan Amount, Size = Disbursed Capital.
 */
export function buildBubbleOption({
  data = [], // [[income, approvedAmt, disbursed, status], ...]
  isDark = false
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => {
        const [x, y, size, status] = p.value;
        return `<b>Status: ${status}</b><br/>Monthly Income: <b>₹${x.toLocaleString()}</b><br/>Approved Loan: <b>₹${y.toLocaleString()}</b><br/>Capital Deployed: <b>₹${size.toLocaleString()}</b>`;
      }
    },
    grid: { top: 30, left: '5%', right: '5%', bottom: 30, containLabel: true },
    xAxis: {
      type: 'value',
      name: 'Monthly Income (₹)',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: (v) => formatINR(v) },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    yAxis: {
      type: 'value',
      name: 'Approved Amount (₹)',
      nameTextStyle: { color: colors.textMuted, fontSize: 10 },
      axisLabel: { color: colors.textColor, formatter: (v) => formatINR(v) },
      splitLine: { lineStyle: { color: colors.gridLineColor, type: 'dashed' } }
    },
    series: [
      {
        type: 'scatter',
        data: data.map(pt => ({
          value: pt,
          itemStyle: {
            color: pt[3] === 'CLOSED' ? colors.emerald : pt[3] === 'NPA' ? colors.crimson : colors.cyan,
            opacity: 0.65
          }
        })),
        symbolSize: (val) => {
          // Scale size between 8 and 32
          const amt = val[2] || 500;
          return Math.max(8, Math.min(32, Math.round(amt / 100)));
        }
      }
    ]
  };
}

/**
 * 12. Sankey Flow Diagram Option
 * Capital pipeline: Total Deployed -> Principal Active/Closed/NPA -> Liquidated + Interest -> Fees + Net Realized Alpha.
 */
export function buildSankeyOption({
  nodes = [],
  links = [],
  isDark = false
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => {
        if (p.dataType === 'edge') {
          return `${p.data.source} → ${p.data.target}<br/>Cashflow: <b>${formatINR(p.data.value)}</b>`;
        }
        return `<b>${p.name}</b><br/>Volume: <b>${formatINR(p.value)}</b>`;
      }
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
        emphasis: { focus: 'adjacency' },
        data: nodes.map(n => ({
          name: n.name,
          itemStyle: {
            color: n.name.includes('Net Realized') || n.name.includes('Repaid') || n.name.includes('Liquidated')
              ? colors.emerald
              : n.name.includes('NPA') || n.name.includes('Default')
              ? colors.crimson
              : n.name.includes('Fee')
              ? colors.amber
              : colors.cyan
          }
        })),
        links,
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
          opacity: 0.35
        },
        label: {
          color: colors.textColor,
          fontSize: 10,
          fontWeight: 'bold'
        }
      }
    ]
  };
}

/**
 * 13. Native ECharts Heatmap Option
 * Matrix of color intensity across two discrete categorical axes.
 */
export function buildHeatmapOption({
  xCategories = [],
  yCategories = [],
  data = [], // [[xIndex, yIndex, value], ...]
  isDark = false,
  minVal = -15,
  maxVal = 35,
  isReturn = true
}) {
  const colors = getChartThemeColors(isDark);
  return {
    tooltip: {
      position: 'top',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText, fontSize: 12 },
      formatter: (p) => {
        const x = xCategories[p.value[0]];
        const y = yCategories[p.value[1]];
        const val = p.value[2];
        return `<b>${y} × ${x}</b><br/>${isReturn ? 'Ann. Net Return' : 'Ann. NPA Rate'}: <b>${val}%</b>`;
      }
    },
    grid: { top: 20, bottom: 45, left: '6%', right: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xCategories,
      splitArea: { show: true },
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    yAxis: {
      type: 'category',
      data: yCategories,
      splitArea: { show: true },
      axisLabel: { color: colors.textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: colors.gridLineColor } }
    },
    visualMap: {
      min: minVal,
      max: maxVal,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemWidth: 10,
      itemHeight: 80,
      textStyle: { color: colors.textColor, fontSize: 9 },
      inRange: {
        color: isReturn
          ? [colors.crimson, colors.amber, colors.emerald]
          : [colors.emerald, colors.amber, colors.crimson]
      }
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: {
          show: true,
          formatter: (p) => `${p.value[2]}%`,
          fontSize: 9,
          color: '#FFFFFF'
        },
        itemStyle: {
          borderColor: colors.cardBg,
          borderWidth: 1.5,
          borderRadius: 3
        }
      }
    ]
  };
}


