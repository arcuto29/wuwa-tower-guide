import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, AlertTriangle, Clock, Crown, Flame, Snowflake, Wind } from 'lucide-react'
import { CHARACTERS, ELEMENT_COLORS } from '../data/characters'

function getResetInfo() {
  const RESET_ANCHOR = new Date('2026-07-20T04:00:00Z')
  const CYCLE_DAYS = 28
  const now = new Date()
  const diff = now - RESET_ANCHOR
  const daysSinceAnchor = diff / (1000 * 60 * 60 * 24)
  const currentCycleDay = daysSinceAnchor % CYCLE_DAYS
  const daysUntilReset = Math.ceil(CYCLE_DAYS - currentCycleDay)
  const nextReset = new Date(now.getTime() + daysUntilReset * 24 * 60 * 60 * 1000)
  const rotationNumber = Math.floor(daysSinceAnchor / CYCLE_DAYS) + 1
  return { daysUntilReset: Math.floor(daysUntilReset), nextReset, currentCycleDay: Math.floor(currentCycleDay), rotationNumber }
}

const TOWERS = [
  {
    id: 'hazard',
    name: "Hazard Zone",
    icon: AlertTriangle,
    color: "#ff3b5c",
    gradient: "from-red-900/40 via-red-800/20 to-transparent",
    borderGlow: "shadow-[0_0_30px_rgba(255,59,92,0.15)]",
    vigor: "5/floor",
    buff: "Echo Skill → +6% All DMG (x4 stacks). At 4 stacks: +36% Crit DMG",
    strategy: "Spam Echo Skills EVERY rotation. Each one strips enemy RES while building your damage.",
    bestChars: ["Sigrika", "Augusta", "Aemeath", "Phrolova"],
    tips: [
      "Your 2 STRONGEST teams go here",
      "Echo Skill spam = damage + RES shred simultaneously",
      "Save Liberation for after boss staggers",
      "Parry timing > raw stats against bosses",
    ],
    floors: [
      { num: "1-2", enemies: "Mixed mobs + mini-boss", difficulty: 3 },
      { num: "3-4", enemies: "Elite boss, high HP", difficulty: 5 },
    ]
  },
  {
    id: 'resonant',
    name: "Resonant Zone",
    icon: Shield,
    color: "#60bfda",
    gradient: "from-cyan-900/40 via-cyan-800/20 to-transparent",
    borderGlow: "shadow-[0_0_30px_rgba(96,191,218,0.15)]",
    vigor: "1-4/floor",
    buff: "Basic ATK → +5% All DMG per hit (x8 max = 40%). RESETS on character swap!",
    strategy: "Pick ONE character and NEVER swap. Let the buff stack to 40% then obliterate.",
    bestChars: ["Augusta", "Sigrika", "Jinhsi", "Camellya"],
    tips: [
      "Buff resets on swap — commit to your DPS!",
      "Floors 1-2: use budget team (3 vigor only)",
      "Floors 3-4: your on-field hypercarry",
      "Augusta's kit is literally designed for this",
    ],
    floors: [
      { num: "1-2", enemies: "Weak mobs", difficulty: 1 },
      { num: "3-4", enemies: "Tanky elite + shields", difficulty: 4 },
    ]
  },
  {
    id: 'echoing',
    name: "Echoing Zone",
    icon: Zap,
    color: "#a78bfa",
    gradient: "from-purple-900/40 via-purple-800/20 to-transparent",
    borderGlow: "shadow-[0_0_30px_rgba(167,139,250,0.15)]",
    vigor: "1-4/floor",
    buff: "HP above 75% → FREE +20% Crit Rate + 65% Crit DMG. Gone instantly if you drop.",
    strategy: "Bring a healer. NEVER let HP drop below 75%. The free crit stats are god-tier.",
    bestChars: ["Cartethyia", "Jinhsi", "Hiyuki", "Phrolova"],
    tips: [
      "+20% CR +65% CD is worth more than any echo upgrade",
      "Shorekeeper / Verina = permanent buff uptime",
      "Take hit → heal IMMEDIATELY before attacking again",
      "Budget: literally any DPS + Baizhi works",
    ],
    floors: [
      { num: "1-2", enemies: "Standard mobs", difficulty: 1 },
      { num: "3-4", enemies: "Boss + AoE attacks", difficulty: 4 },
    ]
  }
]

const META_TEAMS = [
  { tower: "Hazard", tier: "SS", name: "Sigrika Hypercarry", chars: ["Sigrika", "Qiuyuan", "Shorekeeper"], why: "#1 Echo Skill spammer. Strips RES while stacking rotation buff." },
  { tower: "Hazard", tier: "SS", name: "Aemeath Nuke", chars: ["Aemeath", "Lynae", "Mornye"], why: "Highest single-target burst. Tune Rupture one-shots Floor 4 bosses." },
  { tower: "Resonant", tier: "S", name: "Augusta On-Field", chars: ["Augusta", "Yinlin", "Shorekeeper"], why: "Basic ATK stacks 40% without swapping. She was made for this tower." },
  { tower: "Echoing", tier: "S", name: "Cartethyia Burst", chars: ["Cartethyia", "Ciaccona", "Shorekeeper"], why: "Free crit stats + Shorekeeper = permanent god mode. Burst hits insanely hard." },
  { tower: "Budget", tier: "A", name: "F2P Havoc", chars: ["Rover (Havoc)", "Danjin", "Baizhi"], why: "Free team for easy floors. Saves Vigor for hard content." },
]

const COMBAT_TIPS = [
  { icon: "⚡", title: "Swap Cancel", desc: "Skill → instant swap. Cuts animation by 40%. Chain them." },
  { icon: "🔗", title: "Intro/Outro", desc: "Outro buffs → DPS Intro. Build teams around this chain." },
  { icon: "🎯", title: "Parry > DPS", desc: "Perfect dodge = i-frames + counter. Learn boss patterns." },
  { icon: "💀", title: "Kill Adds First", desc: "Clean up adds for uninterrupted boss DPS windows." },
  { icon: "📊", title: "Min Stats", desc: "2000 ATK • 50% CR • 250% CD • Lv90 • Echoes +25" },
]

export default function TowerTab() {
  const [reset, setReset] = useState(getResetInfo())
  const [expandedTower, setExpandedTower] = useState('hazard')

  useEffect(() => {
    const timer = setInterval(() => setReset(getResetInfo()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero section with animated particles */}
      <div className="relative overflow-hidden rounded-2xl mb-5 p-5"
        style={{ background: 'linear-gradient(135deg, rgba(255,59,92,0.08), rgba(124,58,237,0.08), rgba(96,191,218,0.05))' }}>
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-accent/40"
              initial={{ x: `${Math.random() * 100}%`, y: '100%', opacity: 0 }}
              animate={{ y: '-20%', opacity: [0, 1, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.7, ease: 'linear' }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Swords size={20} className="text-accent" />
            <h1 className="text-xl font-extrabold">Tower of Adversity</h1>
          </div>
          <p className="text-xs text-white/40 mb-4">Clear all floors. Earn 700 Astrite per reset.</p>

          {/* Countdown ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle cx="28" cy="28" r="24" fill="none" stroke="#ff3b5c" strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 151" }}
                  animate={{ strokeDasharray: `${(reset.currentCycleDay / 28) * 151} 151` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-extrabold text-accent">{reset.daysUntilReset}d</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold">
                {reset.daysUntilReset} days until reset
              </div>
              <div className="text-[10px] text-white/30">
                Rotation #{reset.rotationNumber} • Day {reset.currentCycleDay}/28
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-lg font-extrabold text-yellow-400">700</div>
              <div className="text-[9px] text-white/30">Astrite waiting</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tower Cards - Interactive & Alive */}
      <div className="space-y-3 mb-6">
        {TOWERS.map((tower, ti) => {
          const Icon = tower.icon
          const isExpanded = expandedTower === tower.id
          return (
            <motion.div
              key={tower.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ti * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${tower.borderGlow}
                ${isExpanded ? 'border-white/15' : 'border-border hover:border-white/10'}`}
              onClick={() => setExpandedTower(isExpanded ? null : tower.id)}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${tower.gradient} pointer-events-none`} />

              {/* Pulsing glow when expanded */}
              {isExpanded && (
                <motion.div
                  className="absolute top-0 left-0 w-full h-0.5"
                  style={{ background: `linear-gradient(90deg, transparent, ${tower.color}, transparent)` }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="relative z-10 p-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${tower.color}20` }}>
                    <Icon size={20} style={{ color: tower.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{tower.name}</h3>
                    <p className="text-[10px] text-white/40">{tower.vigor} vigor</p>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-white/30">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </motion.div>
                </div>

                {/* Buff preview (always visible) */}
                <div className="mt-3 p-2.5 rounded-lg" style={{ background: `${tower.color}08`, border: `1px solid ${tower.color}20` }}>
                  <p className="text-[11px] text-white/60 leading-relaxed">{tower.buff}</p>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {/* Strategy */}
                      <div className="mt-3 p-3 bg-accent/5 border border-accent/20 rounded-xl">
                        <p className="text-[10px] font-bold uppercase text-accent/70 mb-1">Strategy</p>
                        <p className="text-xs text-white/60">{tower.strategy}</p>
                      </div>

                      {/* Best characters */}
                      <div className="mt-3">
                        <p className="text-[10px] font-bold uppercase text-white/40 mb-2">Top Picks This Rotation</p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {tower.bestChars.map(name => {
                            const ch = CHARACTERS.find(c => c.name === name)
                            return (
                              <div key={name} className="flex-shrink-0 flex flex-col items-center gap-1">
                                <div className="w-12 h-12 rounded-xl overflow-hidden border"
                                  style={{ borderColor: `${ELEMENT_COLORS[ch?.element]}44`, background: `linear-gradient(135deg, ${ELEMENT_COLORS[ch?.element]}22, ${ELEMENT_COLORS[ch?.element]}55)` }}>
                                  {ch?.img ? <img src={ch.img} alt={name} className="w-full h-full object-cover" loading="lazy" />
                                    : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{name.slice(0,2)}</div>}
                                </div>
                                <span className="text-[9px] text-white/40 font-semibold">{name.split(' ')[0]}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Floor difficulty */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {tower.floors.map(floor => (
                          <div key={floor.num} className="bg-surface/50 rounded-lg p-2.5 border border-border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold">Floor {floor.num}</span>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < floor.difficulty ? 'bg-accent' : 'bg-white/10'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-[9px] text-white/30">{floor.enemies}</p>
                          </div>
                        ))}
                      </div>

                      {/* Tips */}
                      <div className="mt-3 space-y-1.5">
                        {tower.tips.map((tip, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                            className="flex gap-2 items-start text-[11px] text-white/50">
                            <span style={{ color: tower.color }}>→</span>
                            <span>{tip}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recommended Teams */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase text-white/40 mb-3 flex items-center gap-2">
          <Crown size={14} className="text-yellow-400" /> Meta Teams
        </h2>
        <div className="space-y-2">
          {META_TEAMS.map((team, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
              className="bg-card border border-border rounded-xl p-3.5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                  team.tier === 'SS' ? 'bg-accent/15 text-accent' : team.tier === 'S' ? 'bg-yellow/15 text-yellow-400' : 'bg-green/15 text-green'
                }`}>{team.tier}</span>
                <span className="text-xs font-bold">{team.name}</span>
                <span className="text-[9px] text-white/30 ml-auto">{team.tower}</span>
              </div>
              <div className="flex gap-1.5 mb-2">
                {team.chars.map(name => {
                  const ch = CHARACTERS.find(c => c.name === name)
                  return (
                    <div key={name} className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2 py-1">
                      {ch?.img ? <img src={ch.img} alt={name} className="w-5 h-5 rounded object-cover" />
                        : <div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold" style={{ background: `${ELEMENT_COLORS[ch?.element]}33` }}>{name.slice(0,2)}</div>}
                      <span className="text-[10px] font-semibold">{name.split(' ')[0]}</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-white/40">{team.why}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Combat Tips */}
      <h2 className="text-xs font-bold uppercase text-white/40 mb-3">Combat Tips</h2>
      <div className="grid gap-2 mb-8">
        {COMBAT_TIPS.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.05 }}
            className="bg-card border border-border rounded-xl p-3.5 flex gap-3">
            <span className="text-base">{t.icon}</span>
            <div>
              <h3 className="text-xs font-bold">{t.title}</h3>
              <p className="text-[10px] text-white/40 mt-0.5">{t.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
