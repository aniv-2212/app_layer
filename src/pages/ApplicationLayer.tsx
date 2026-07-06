import { useEffect, useState } from 'react'
import { KPIRow } from '../components/cards/KPIRow'
import { MapFilters } from '../components/filters/MapFilters'
import { ApplicationAttackMap } from '../components/maps/ApplicationAttackMap'
import { CountryDrawer } from '../components/maps/CountryDrawer'
import { MapLegend } from '../components/maps/MapLegend'
import { RequestChart } from '../components/charts/RequestChart'
import { AttackTrendChart } from '../components/charts/AttackTrendChart'
import { AttackTypeChart } from '../components/charts/AttackTypeChart'
import { HTTPMethodChart } from '../components/charts/HTTPMethodChart'
import { StatusCodeChart } from '../components/charts/StatusCodeChart'
import { ApplicationLayerMap } from '../components/maps/ApplicationLayerMap'
import { LiveEvents } from '../components/live-events/LiveEvents'
import { AttackLogTable } from '../components/tables/AttackLogTable'
import { AIInsights } from '../components/insights/AIInsights'
import { useSocketStore } from '../store/socketStore'
import { LoadingSkeleton } from '../components/LoadingSkeleton'

export function ApplicationLayerPage() {
  const connect = useSocketStore((state) => state.connect)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    connect()
    const timer = window.setTimeout(() => setReady(true), 700)
    return () => window.clearTimeout(timer)
  }, [connect])

  return (
    <div className="space-y-6">
      {!ready ? <LoadingSkeleton /> : (
        <>
          <KPIRow />
          <MapFilters />
          <div className="mb-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <ApplicationAttackMap />
            <LiveEvents />
          </div>
          <div className="mb-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <RequestChart />
            <AttackTrendChart />
          </div>
          <div className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <AttackTypeChart />
            <HTTPMethodChart />
            <StatusCodeChart />
            <ApplicationLayerMap />
          </div>
          <div className="mb-6 grid gap-6 xl:grid-cols-[1.5fr_0.85fr]">
            <AttackLogTable />
            <AIInsights />
          </div>
          <MapLegend />
        </>
      )}
      <CountryDrawer />
    </div>
  )
}
