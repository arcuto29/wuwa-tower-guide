import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, AlertTriangle, Clock, Crown } from 'lucide-react'
import { CHARACTERS, ELEMENT_COLORS } from '../data/characters'

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
  const rotationNumber = Math.floor(daysSinceAnchor / CYCLE_DAYS) + 1
  // Determine if we're still in the rotation where these tips are accurate
  const tipsRotation = 1 // This data is for rotation 1 (Jul 20 - Aug 17 2026)
  const tipsOutdated = rotationNumber > tipsRotation
  return { daysUntilReset: Math.floor(daysUntilReset), nextReset, currentCycleDay: Math.floor(currentCycleDay), rotationNumber, tipsOutdated }
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

const RECOMMENDED_TEAMS = [
  {
    tower: "Hazard",
    tier: "SS",
    teams: [
      { name: "Sigrika Hypercarry", chars: ["Sigrika", "Qiuyuan", "Shorekeeper"], why: "Best Echo Skill spam in the game. Strips RES stacks while building the rotation buff. #1 pick this rotation." },
      { name: "Aemeath Nuke", chars: ["Aemeath", "Lynae", "Mornye"], why: "Highest single-target damage. Tune Rupture Mode one-shots bosses on Floor 4." },
      { name: "Augusta Time-Stop", chars: ["Augusta", "Yinlin", "Shorekeeper"], why: "7-second Liberation freeze gives you breathing room to reset buffs. Great for Floor 1-2." },
    ]
  },
  {
    tower: "Resonant",
    tier: "S",
    teams: [
      { name: "Augusta On-Field", chars: ["Augusta", "Yinlin", "Shorekeeper"], why: "Basic ATK buff stacks to 40% and never resets while she's on-field. Made for this tower." },
      { name: "Sigrika Sustained", chars: ["Sigrika", "Qiuyuan", "Verina"], why: "Sigrika's kit fires tons of Basic ATK hits = fast stacking. Great on Floors 3-4." },
    ]
  },
  {
    tower: "Echoing",
    tier: "S",
    teams: [
      { name: "Cartethyia Burst", chars: ["Cartethyia", "Ciaccona", "Shorekeeper"], why: "Free +20% CR +65% CD when HP>75%. Shorekeeper makes this permanent. Burst hits insanely hard." },
      { name: "Jinhsi Spectro", chars: ["Jinhsi", "Zhezhi", "Verina"], why: "Jinhsi's burst with the free crit stats is devastating. Verina keeps HP topped." },
    ]
  },
  {
    tower: "Budget (F2P)",
    tier: "A",
    teams: [
      { name: "Havoc F2P", chars: ["Rover (Havoc)", "Danjin", "Baizhi"], why: "Completely free team. Use on easy floors (Resonant 1-2, Echoing 1-2) to save Vigor." },
      { name: "Fusion Budget", chars: ["Encore", "Sanhua", "Baizhi"], why: "Encore burst is strong even at low investment. Sanhua is free from quests." },
    ]
  },
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
          <div className="text-xs text-white/50 uppercase font-bold">Next Tower Reset (Rotation #{reset.rotationNumber})</div>
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

      {/* Outdated warning if rotation changed */}
      {reset.tipsOutdated && (
        <div className="bg-yellow/10 border border-yellow/30 rounded-xl p-4 mb-6 flex gap-3 items-start">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-xs font-bold text-yellow-400">New rotation detected!</p>
            <p className="text-[11px] text-white/50 mt-0.5">Tower buffs and recommended teams below are from last rotation. The <strong>team builder</strong> in "My Roster" tab still works — it picks the best team from your characters regardless of rotation. Check patch notes for new buffs!</p>
          </div>
        </div>
      )}

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

      {/* Recommended Teams */}
      <h2 className="font-bold text-sm text-white/70 uppercase tracking-wide mt-8 mb-3 flex items-center gap-2">
        <Crown size={14} className="text-yellow-400" /> Recommended Teams This Rotation
      </h2>
      <p className="text-xs text-white/40 mb-4">The best teams to aim for. If you don't own them yet, these are worth pulling for.</p>

      {RECOMMENDED_TEAMS.map((section, si) => (
        <motion.div key={section.tower} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}
          className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-sm">{section.tower}</h3>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
              section.tier === 'SS' ? 'bg-accent/15 text-accent' :
              section.tier === 'S' ? 'bg-yellow/15 text-yellow-400' :
              'bg-green/15 text-green'
            }`}>{section.tier} Tier</span>
          </div>
          <div className="space-y-2">
            {section.teams.map((team, ti) => (
              <div key={ti} className="bg-card border border-border rounded-xl p-4 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xs font-bold text-white/90">{team.name}</span>
                </div>
                <div className="flex gap-2 mb-2.5 flex-wrap">
                  {team.chars.map(name => {
                    const ch = CHARACTERS.find(x => x.name === name)
                    return (
                      <div key={name} className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1.5">
                        {ch?.img ? (
                          <img src={ch.img} alt={name} className="w-6 h-6 rounded-md object-cover"
                            style={{ border: `1px solid ${ELEMENT_COLORS[ch.element]}44` }} />
                        ) : (
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold"
                            style={{ background: `${ELEMENT_COLORS[ch?.element]}33` }}>
                            {name.slice(0,2)}
                          </div>
                        )}
                        <span className="text-[11px] font-semibold">{name}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed">{team.why}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

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
