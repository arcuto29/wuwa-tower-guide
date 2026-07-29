import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Swords, Gem, Clock, TrendingUp, ChevronRight } from 'lucide-react'

function getResetInfo() {
  const RESET_ANCHOR = new Date('2026-07-20T04:00:00Z')
  const CYCLE_DAYS = 28
  const now = new Date()
  const diff = now - RESET_ANCHOR
  const daysSinceAnchor = diff / (1000 * 60 * 60 * 24)
  const currentCycleDay = daysSinceAnchor % CYCLE_DAYS
  const daysUntilReset = Math.ceil(CYCLE_DAYS - currentCycleDay)
  return { daysUntilReset: Math.floor(daysUntilReset), day: Math.floor(currentCycleDay) }
}

export default function HomeTab({ onNavigate }) {
  const [reset, setReset] = useState(getResetInfo())
  const [owned, setOwned] = useState(0)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wuwa-owned') || '[]')
      setOwned(saved.length)
    } catch {}
    const timer = setInterval(() => setReset(getResetInfo()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-4">
      {/* App header - feels native */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold">WuWa Companion</h1>
          <p className="text-xs text-white/40 mt-0.5">v3.5 Rotation • Patch Active</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-lg">⚔️</span>
        </div>
      </div>

      {/* Tower Reset Card - the most important info */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-accent/15 to-accent-2/10 border border-accent/30 rounded-2xl p-5 mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-accent" />
              <span className="text-[10px] font-bold uppercase text-white/50">Tower Reset</span>
            </div>
            <div className="text-3xl font-extrabold">{reset.daysUntilReset}<span className="text-lg text-white/40 ml-1">days</span></div>
            <div className="text-[10px] text-white/30 mt-1">Day {reset.day}/28 of cycle</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-accent/30 flex items-center justify-center relative">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,59,92,0.1)" strokeWidth="4" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#ff3b5c" strokeWidth="4"
                strokeDasharray={`${(reset.day / 28) * 176} 176`} strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold text-accent">{Math.round((reset.day / 28) * 100)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-extrabold">{owned}</div>
          <div className="text-[10px] text-white/40 uppercase mt-0.5">Characters Owned</div>
        </motion.div>
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-extrabold text-yellow-400">700</div>
          <div className="text-[10px] text-white/40 uppercase mt-0.5">Astrite/Reset</div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xs font-bold uppercase text-white/40 mb-3 tracking-wide">Quick Actions</h2>
      <div className="space-y-2 mb-6">
        <QuickAction
          icon={<Swords size={18} />}
          title="Build Tower Teams"
          desc="Get teams based on your characters"
          color="#ff3b5c"
          onClick={() => onNavigate('roster')}
          delay={0.3}
        />
        <QuickAction
          icon={<Gem size={18} />}
          title="Astrite Planner"
          desc="Can you get that 5-star + weapon?"
          color="#a78bfa"
          onClick={() => onNavigate('astrite')}
          delay={0.35}
        />
        <QuickAction
          icon={<TrendingUp size={18} />}
          title="Pull Calculator"
          desc="Check your pity and odds"
          color="#34d399"
          onClick={() => onNavigate('banner')}
          delay={0.4}
        />
      </div>

      {/* Current rotation info */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
        className="bg-card border border-border rounded-2xl p-4">
        <h2 className="text-xs font-bold uppercase text-white/40 mb-3">This Rotation's Buffs</h2>
        <div className="space-y-2.5">
          <BuffRow tower="Hazard" buff="Echo Skill → +6% DMG x4, then +36% CD" color="#ff3b5c" />
          <BuffRow tower="Resonant" buff="Basic ATK → +5% DMG x8 (40% total, resets on swap)" color="#60bfda" />
          <BuffRow tower="Echoing" buff="HP >75% → +20% Crit Rate, +65% Crit DMG" color="#a78bfa" />
        </div>
      </motion.div>
    </motion.div>
  )
}

function QuickAction({ icon, title, desc, color, onClick, delay }) {
  return (
    <motion.button
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full flex items-center gap-3.5 p-4 bg-card border border-border rounded-xl hover:border-white/10 transition-all text-left"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-white/20 flex-shrink-0" />
    </motion.button>
  )
}

function BuffRow({ tower, buff, color }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
      <div>
        <span className="text-xs font-bold" style={{ color }}>{tower}</span>
        <p className="text-[11px] text-white/40 mt-0.5">{buff}</p>
      </div>
    </div>
  )
}
