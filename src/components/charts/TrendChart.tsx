import React from 'react';
import ReactECharts from 'echarts-for-react';

interface TrendChartProps {
  data?: any;
  title?: string;
  height?: string | number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, title, height = 300 }) => {
  const options = {
    title: { text: title, textStyle: { color: '#e2e8f0' } },
    tooltip: { trigger: 'axis' },
    // Placeholder options, to be extended based on chart type
    series: [{ type: 'trend', data: data || [] }]
  };

  return <ReactECharts option={options} style={{ height, width: '100%' }} theme="dark" />;
};
