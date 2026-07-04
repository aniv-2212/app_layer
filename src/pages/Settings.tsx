import { KeyRound, MoonStar, ShieldCheck, UserCircle2, Users } from 'lucide-react'
import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'
import { Toast } from '../components/ui/Toast'

export function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'preferences' | 'security'>('preferences')

  const handleSave = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1400)
  }

  return (
    <PageShell
      title="Settings"
      subtitle="Fine-tune preferences, integrations, roles, and the operating model of the platform."
      actions={
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          Save Changes
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Preferences</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">Security</span>
        </>
      }
      kpiSection={[
        <StatusCard key="profile" title="User Profile" value="Ops Team" detail="SOC lead" icon={UserCircle2} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="theme" title="Theme Settings" value="Dark" detail="Adaptive UI" icon={MoonStar} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="keys" title="API Keys" value="6" detail="Active integrations" icon={KeyRound} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="roles" title="Roles & Permissions" value="12" detail="Configured policies" icon={Users} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Theme Settings" subtitle="Visual and notification preferences">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Adaptive dark theme enabled</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Critical alerts only</div>
          </div>
        </ChartCard>
        <ChartCard title="Notification Preferences" subtitle="Alert routing and urgency">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">Slack, email, and pager integration enabled</div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="API Keys" subtitle="Service credentials">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Threat feed</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Ticketing</div>
          </div>
        </ChartCard>
        <ChartCard title="Organization Settings" subtitle="Tenant and account defaults">
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-200">Region: US-East</div>
        </ChartCard>
        <ChartCard title="Integrations" subtitle="Connected tools and platforms">
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">Slack, Zendesk, CrowdStrike</div>
        </ChartCard>
        <ChartCard title="Security Settings" subtitle="Access, MFA, and policies">
          <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">MFA enforced</div>
        </ChartCard>
      </div>

      <ChartCard title="About" subtitle="Platform overview and compliance">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <ShieldCheck className="h-4 w-4 text-cyan-300" />
          <span>Secure by design, enterprise-ready cyber operations experience.</span>
        </div>
      </ChartCard>
    </PageShell>
  )
}
