import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface PieChartProps {
  data?: any;
  options?: EChartsOption;
  title?: string;
  height?: string | number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, options, title, height = 300 }) => {
  const defaultOptions: EChartsOption = {
    backgroundColor: 'transparent',
    title: { text: title, textStyle: { color: '#e2e8f0' } },
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#94a3b8' } },
    series: [{ type: 'pie', radius: ['42%', '68%'], center: ['50%', '45%'], data: data ?? [], label: { color: '#cbd5e1' } }],
  };

  return <ReactECharts option={options ?? defaultOptions} style={{ height, width: '100%' }} theme="dark" />;
};
