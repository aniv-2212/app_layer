import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

export function AIInsights() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-400">AI Insights</p>
          <h3 className="text-lg font-semibold text-white">Threat Intelligence Summary</h3>
        </div>
        <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 p-2 text-cyan-300">
          <Brain className="h-5 w-5" />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ['Threat Score', '92/100'],
          ['Predicted Attack', 'Credential Stuffing'],
          ['Confidence', '94%'],
          ['Recommendation', 'Enable adaptive rate limiting'],
          ['Risk Level', 'High'],
          ['Suspicious Endpoint', '/api/v1/login'],
          ['Top Threat Actor', 'Astra Botnet'],
          ['Recommended Mitigation', 'Deploy WAF signature + MFA challenge'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-1 font-medium text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-[24px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-4 text-sm text-slate-200">
        <div className="mb-2 flex items-center gap-2 text-cyan-300"><Sparkles className="h-4 w-4" /> AI-generated summary</div>
        <p>Signals across the application layer show a rising campaign targeting authenticated login flows. The model recommends tightening rate limiting and triggering bot challenge flows for high-volume HTTP POST attempts.</p>
      </div>
    </motion.div>
  )
}
