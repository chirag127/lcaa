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
