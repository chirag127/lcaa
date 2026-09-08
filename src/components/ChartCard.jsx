import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function ChartCard({ title, subtitle, option, children, span2 = false, height = '330px' }) {
  return (
    <div className="glass-panel chart-card" style={span2 ? { gridColumn: 'span 2' } : {}}>
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      </div>
      <div className="chart-container" style={{ height }}>
        {option ? (
          <ReactECharts
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{ height: '100%', width: '100%' }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
