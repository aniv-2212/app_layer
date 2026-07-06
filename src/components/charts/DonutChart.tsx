import React from 'react';
import ReactECharts from 'echarts-for-react';

interface DonutChartProps {
  data?: any;
  title?: string;
  height?: string | number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, title, height = 300 }) => {
  const options = {
    title: { text: title, textStyle: { color: '#e2e8f0' } },
    tooltip: { trigger: 'axis' },
    // Placeholder options, to be extended based on chart type
    series: [{ type: 'donut', data: data || [] }]
  };

  return <ReactECharts option={options} style={{ height, width: '100%' }} theme="dark" />;
};
