import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { useAttackStore } from '../../store/attackStore'

export function RequestChart() {
  const requestSeries = useAttackStore((state) => state.requestSeries)
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#94a3b8' } },
    grid: { left: '4%', right: '4%', top: '10%', bottom: '8%' },
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'], axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }, axisLabel: { color: '#64748b' } },
    series: requestSeries.map((item) => ({ name: item.name, type: 'line', smooth: true, data: item.data, lineStyle: { width: 3 }, itemStyle: { color: item.name === 'Requests' ? '#22d3ee' : '#a855f7' }, areaStyle: { color: item.name === 'Requests' ? 'rgba(34,211,238,0.16)' : 'rgba(168,85,247,0.16)' } }))
  }), [requestSeries])
  return <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl"><h3 className="mb-3 text-lg font-semibold text-white">HTTP Requests Over Time</h3><ReactECharts option={option} style={{ height: 280 }} /></div>
}
