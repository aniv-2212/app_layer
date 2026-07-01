import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

export function TopCountriesChart() {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '18%', right: '4%', top: '8%', bottom: '4%' },
    xAxis: { type: 'value', axisLabel: { color: '#64748b' } },
    yAxis: { type: 'category', data: ['US', 'DE', 'SG', 'GB', 'BR'], axisLabel: { color: '#64748b' } },
    series: [{ name: 'Requests', type: 'bar', data: [320, 240, 180, 152, 128], itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#22d3ee' }, { offset: 1, color: '#8b5cf6' }] } } }]
  }), [])
  return <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl"><h3 className="mb-3 text-lg font-semibold text-white">Top Source Countries</h3><ReactECharts option={option} style={{ height: 280 }} /></div>
}
