import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

export function StatusCodeChart() {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#94a3b8' } },
    grid: { left: '4%', right: '4%', top: '10%', bottom: '8%' },
    xAxis: { type: 'category', data: ['00', '04', '08', '12', '16', '20', '24'], axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b' } },
    series: [{ name: '200', type: 'bar', stack: 'x', data: [84, 92, 96, 88, 82, 78, 90], itemStyle: { color: '#22d3ee' } }, { name: '301', type: 'bar', stack: 'x', data: [14, 12, 10, 16, 11, 13, 15], itemStyle: { color: '#38bdf8' } }, { name: '403', type: 'bar', stack: 'x', data: [8, 10, 9, 7, 11, 9, 12], itemStyle: { color: '#f59e0b' } }, { name: '429', type: 'bar', stack: 'x', data: [6, 9, 8, 7, 10, 8, 9], itemStyle: { color: '#f43f5e' } }, { name: '500', type: 'bar', stack: 'x', data: [3, 4, 3, 5, 4, 6, 7], itemStyle: { color: '#a855f7' } }]
  }), [])
  return <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl"><h3 className="mb-3 text-lg font-semibold text-white">HTTP Status Codes</h3><ReactECharts option={option} style={{ height: 280 }} /></div>
}
