import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, AlertTriangle, Clock } from 'lucide-react'

// Tower resets every 28 days. This calculates the next reset from a known anchor date.
function getResetInfo() {
  const RESET_ANCHOR = new Date('2026-07-20T04:00:00Z') // Known reset date
  const CYCLE_DAYS = 28
  const now = new Date()
  const diff = now - RESET_ANCHOR
  const daysSinceAnchor = diff / (1000 * 60 * 60 * 24)
  const currentCycleDay = daysSinceAnchor % CYCLE_DAYS
  const daysUntilReset = Math.ceil(CYCLE_DAYS - currentCycleDay)
  const nextReset = new Date(now.getTime() + daysUntilReset * 24 * 60 * 60 * 1000)
  const hoursLeft = Math.floor((daysUntilReset % 1) * 24)
  return { daysUntilReset: Math.floor(daysUntilReset), nextReset, currentCycleDay: Math.floor(currentCycleDay), hoursLeft }
}

const TOWER_INFO = [
  {
    name: "Hazard Tower", color: "#ff3b5c", icon: AlertTriangle,
    buff: "Echo Skill stacking: +6% All-Attribute DMG per Echo Skill (x4). At 4 stacks, +36% Crit DMG.",
    strategy: "Spam Echo Skills every rotation. Teams that fire multiple Echo Skills shred enemy RES while dealing damage.",
    vigor: "5 per floor (20 total)",
    tips: [
      "Use 2 of your strongest teams here — most rewards",
      "Echo Skill spam = stacking buff + RES shred",
      "Save Liberation for stagger/vulnerability windows",
      "Learn boss attack patterns — parry > raw DPS",
      "Sigrika, Augusta, Aemeath dominate this rotation",
    ]
  },
  {
    name: "Resonant Tower", color: "#60bfda", icon: Shield,
    buff: "Basic ATK DMG grants +5% All-Attribute DMG for 6s, stacking up to 8x (40% total). Resets on swap.",
    strategy: "Stay on ONE character. Don't swap. Let buff stack to 40% then burst. Hypercarries shine.",
    vigor: "1+2+3+4 = 10 total",
    tips: [
      "Budget team on floors 1-2 (3 vigor) — save best for 3-4",
      "Buff RESETS on swap — commit to your DPS",
      "Augusta and Sigrika are perfect (long on-field time)",
      "Pair stages 1+4 (5 vigor) and 2+3 (5 vigor) same team",
      "Don't overcomplicate — stay on-field and attack",
    ]
  },
  {
    name: "Echoing Tower", color: "#a78bfa", icon: Zap,
    buff: "When HP > 75%: Crit Rate +20%, Crit DMG +65%. Drops if HP falls below.",
    strategy: "NEVER let HP drop below 75%. Bring a strong healer. The free crit stats are insane.",
    vigor: "1+2+3+4 = 10 total",
    tips: [
      "20% CR + 65% CD free = like god-tier echoes for free",
      "Shorekeeper or Verina mandatory. Baizhi for budget",
      "Take big hit → heal IMMEDIATELY before continuing",
      "Cartethyia + Ciaccona + Shorekeeper = dream team",
      "Budget: any DPS + sub + Baizhi. Just keep HP up!",
    ]
  },
]

const COMBAT_TIPS = [
  { icon: "🔄", title: "Swap Cancel", desc: "Skill → instant swap cancels end-lag. Chain: Skill > Swap > Skill > Swap." },
  { icon: "🔗", title: "Intro/Outro", desc: "Outro triggers Intro. Build teams where Outro buffs → DPS Intro." },
  { icon: "🎯", title: "Parry > DPS", desc: "Perfect dodge = i-frames + counter. Learn boss parry timing." },
  { icon: "⚡", title: "Liberation", desc: "Save ult for stagger windows. Don't waste on invuln phases." },
  { icon: "💀", title: "Adds First", desc: "Boss + adds floors: kill adds first for clean boss DPS." },
  { icon: "📊", title: "Min Stats", desc: "2000+ ATK, 50% CR, 250% CD, Lv90, Echoes +25, Skills 6-8-8-8-6." },
]

export default function TowerTab() {
  const [reset, setReset] = useState(getResetInfo())

  useEffect(() => {
    const timer = setInterval(() => setReset(getResetInfo()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-extrabold mb-1">Tower Tips</h1>
      <p className="text-white/50 text-sm mb-4">Clear every tower this rotation.</p>

      {/* Reset countdown */}
      <div className="bg-gradient-to-r from-accent/10 to-accent-2/10 border border-accent/30 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <Clock size={20} className="text-accent flex-shrink-0" />
        <div className="flex-1">
          <div className="text-xs text-white/50 uppercase font-bold">Next Tower Reset</div>
          <div className="text-lg font-extrabold text-white">
            {reset.daysUntilReset} days remaining
          </div>
          <div className="text-[10px] text-white/30">
            Resets {reset.nextReset.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Day {reset.currentCycleDay}/28 of current cycle
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-accent">{reset.daysUntilReset}d</div>
          <div className="text-[10px] text-white/40">left</div>
        </div>
      </div>

      {/* Tower cards */}
      {TOWER_INFO.map(tower => {
        const Icon = tower.icon
        return (
          <div key={tower.name} className="mb-6">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <Icon size={18} style={{ color: tower.color }} />
                <h2 className="font-bold">{tower.name}</h2>
                <span className="text-[10px] font-bold text-yellow-400 ml-auto">{tower.vigor}</span>
              </div>
              <div className="p-5">
                <div className="rounded-xl p-3 mb-4 border" style={{ background: `${tower.color}08`, borderColor: `${tower.color}30` }}>
                  <p className="text-xs font-bold uppercase mb-1" style={{ color: `${tower.color}cc` }}>This Rotation's Buff</p>
                  <p className="text-xs text-white/60">{tower.buff}</p>
                </div>
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 mb-4">
                  <p className="text-xs font-bold text-accent/80 mb-1 uppercase">Key Strategy</p>
                  <p className="text-xs text-white/60">{tower.strategy}</p>
                </div>
                <ul className="space-y-2">
                  {tower.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs text-white/50">
                      <span className="text-accent font-bold mt-px">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      })}

      {/* Combat tips */}
      <h2 className="font-bold text-sm text-white/70 uppercase tracking-wide mt-8 mb-3">Combat Fundamentals</h2>
      <div className="grid gap-2 mb-8">
        {COMBAT_TIPS.map((t, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex gap-3">
            <span className="text-lg">{t.icon}</span>
            <div>
              <h3 className="text-sm font-bold">{t.title}</h3>
              <p className="text-xs text-white/40 mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
