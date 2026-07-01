import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { useAttackStore } from '../../store/attackStore'

export function AttackTrendChart() {
  const attackSeries = useAttackStore((state) => state.attackSeries)
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: '4%', right: '4%', top: '10%', bottom: '8%' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b' } },
    series: [{ name: 'Attack Traffic', type: 'bar', stack: 'total', areaStyle: {}, smooth: true, data: attackSeries, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#22d3ee' }, { offset: 1, color: '#8b5cf6' }] } } }]
  }), [attackSeries])
  return <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl"><h3 className="mb-3 text-lg font-semibold text-white">Attack Traffic Trend</h3><ReactECharts option={option} style={{ height: 280 }} /></div>
}
