import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface BarChartProps {
  data?: any;
  options?: EChartsOption;
  title?: string;
  height?: string | number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, options, title, height = 300 }) => {
  const defaultOptions: EChartsOption = {
    backgroundColor: 'transparent',
    title: { text: title, textStyle: { color: '#e2e8f0' } },
    tooltip: { trigger: 'axis' },
    grid: { left: 36, right: 16, top: title ? 48 : 24, bottom: 32 },
    xAxis: { type: 'category', data: data?.labels ?? [], axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.14)' } } },
    series: [{ type: 'bar', data: data?.values ?? data ?? [], itemStyle: { color: '#22d3ee', borderRadius: [6, 6, 0, 0] } }],
  };

  return <ReactECharts option={options ?? defaultOptions} style={{ height, width: '100%' }} theme="dark" />;
};
