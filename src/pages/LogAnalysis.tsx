import { Filter, Logs, Search, ShieldAlert, TerminalSquare } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'

export function LogAnalysisPage() {
  return (
    <PageShell
      title="Log Analysis"
      subtitle="Search, filter, and inspect authentication, firewall, OS, and API logs from one workspace."
      actions={
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          Export Logs
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Query builder</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">Last 24h</span>
        </>
      }
      kpiSection={[
        <StatusCard key="search" title="Search Bar" value="7.3M" detail="Indexed events" icon={Search} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="filters" title="Filters" value="36" detail="Active parsers" icon={Filter} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="auth" title="Authentication Logs" value="312K" detail="Successful and failed" icon={ShieldAlert} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="api" title="API Logs" value="1.1M" detail="Request and response" icon={TerminalSquare} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Search Bar" subtitle="Run fast queries across the platform">
          <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">source=auth AND action=login AND result=fail</div>
        </ChartCard>
        <ChartCard title="Filters" subtitle="Logical views by source and severity">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">Auth</span>
            <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-200">Firewall</span>
            <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">Windows</span>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Authentication Logs" subtitle="Identity and access events">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">MFA failure</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Privilege escalation</div>
          </div>
        </ChartCard>
        <ChartCard title="Firewall Logs" subtitle="Network and policy events">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">Rule 183 blocked 4.2K flows</div>
        </ChartCard>
        <ChartCard title="Windows Logs" subtitle="Endpoint security events">
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-200">PowerShell execution flagged</div>
        </ChartCard>
        <ChartCard title="Linux Logs" subtitle="Server and workload telemetry">
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">Service restarts detected</div>
        </ChartCard>
      </div>

      <ChartCard title="Query Builder" subtitle="Compose advanced search patterns">
        <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
          <div className="mb-3 flex items-center gap-2"><Logs className="h-4 w-4 text-cyan-300" /> Log explorer query builder</div>
          <div className="space-y-2">
            <div className="rounded-[20px] border border-white/10 bg-slate-950/80 px-4 py-3">{'event.type = "auth" AND severity >= 3'}</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/80 px-4 py-3">{'source = "firewall" OR source = "api"'}</div>
          </div>
        </div>
      </ChartCard>
    </PageShell>
  )
}
