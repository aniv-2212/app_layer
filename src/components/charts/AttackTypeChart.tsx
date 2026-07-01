import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

export function AttackTypeChart() {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '2%', right: '2%', top: '8%', bottom: '4%' },
    xAxis: { type: 'value', axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } } },
    yAxis: { type: 'category', data: ['SQL Injection', 'XSS', 'Command Injection', 'RCE', 'Path Traversal', 'File Inclusion'], axisLabel: { color: '#64748b' } },
    series: [{ name: 'Attempts', type: 'bar', data: [120, 94, 84, 60, 44, 32], itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#22d3ee' }, { offset: 1, color: '#8b5cf6' }] } } }]
  }), [])
  return <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl"><h3 className="mb-3 text-lg font-semibold text-white">Top Attack Types</h3><ReactECharts option={option} style={{ height: 280 }} /></div>
}
