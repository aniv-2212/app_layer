import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

export function HTTPMethodChart() {
  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom', textStyle: { color: '#94a3b8' } },
      series: [
        {
          name: 'HTTP Methods',
          type: 'pie',
          radius: ['48%', '72%'],
          data: [
            { value: 360, name: 'GET' },
            { value: 250, name: 'POST' },
            { value: 110, name: 'PUT' },
            { value: 80, name: 'DELETE' },
            { value: 50, name: 'PATCH' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(34,211,238,0.4)',
            },
          },
          itemStyle: { color: '#22d3ee' },
        },
      ],
    }),
    [],
  )

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <h3 className="mb-3 text-lg font-semibold text-white">HTTP Methods</h3>
      <ReactECharts option={option} style={{ height: 280 }} />
    </div>
  )
}
