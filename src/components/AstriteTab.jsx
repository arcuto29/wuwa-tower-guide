import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gem, CheckCircle2, Clock, Star } from 'lucide-react'

const DAILY = [
  { name: "Daily Quests (Guidebook)", amount: 60, per: "day", tip: "4 activities = 100 points = 60 Astrite. Never skip." },
]
const WEEKLY = [
  { name: "Weekly Activities Bonus", amount: 200, per: "week", tip: "Complete weekly missions for bonus threshold." },
]
const RECURRING = [
  { name: "Tower of Adversity (full clear)", amount: 700, per: "28 days", tip: "Full clear all 3 towers every reset. 4.4 free pulls!" },
  { name: "Battle Pass (Free Track)", amount: 500, per: "patch", tip: "Just play normally to max the free track." },
  { name: "Patch Events", amount: 2500, per: "patch", tip: "Don't miss limited events. Do them day 1." },
  { name: "Maintenance Compensation", amount: 600, per: "patch", tip: "Free Astrite for waiting. Always claim mail." },
  { name: "Livestream/Redemption Codes", amount: 300, per: "patch", tip: "Grab codes from Reddit/Twitter immediately." },
  { name: "New Story Quests", amount: 400, per: "patch", tip: "Complete new story ASAP for Astrite." },
]
const ONETIME = [
  { name: "Exploration (chests, puzzles)", amount: "5000+/region", tip: "Use interactive maps. Sonance Caskets = bulk." },
  { name: "ToA One-Time Zones", amount: "1,800 total", tip: "Stable + Experiment + Overdrive. Do early!" },
  { name: "Side Quests & Character Stories", amount: "20-80 each", tip: "Every quest gives some. Don't skip." },
  { name: "Achievements", amount: "5-20 each", tip: "Check menu for easy unclaimed ones." },
  { name: "Pioneer Association Levels", amount: "Varies", tip: "More exploration = higher level = more Astrite." },
]
const TIPS = [
  { icon: "🚫", title: "Never pull Standard Banner", desc: "Only use Astrite on featured. Standard comes from free tides." },
  { icon: "🎯", title: "Save 12,800 for pity", desc: "80 pulls × 160 = 12,800 guarantees your 5-star." },
  { icon: "📅", title: "Plan 1-2 patches ahead", desc: "Check upcoming banners. Skip chars you don't need." },
  { icon: "💡", title: "Tower chars pay for themselves", desc: "Better teams = 700 Astrite/reset = they earn pulls." },
  { icon: "🎲", title: "Single pull after soft pity", desc: "From pull 64+, go one at a time. Saves ~5 pulls avg." },
  { icon: "⏰", title: "Pull last day of banner", desc: "Maximizes income before committing. Better decision." },
]

export default function AstriteTab() {
  const [done, setDone] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wuwa-astrite-done') || '[]')) }
    catch { return new Set() }
  })
  const toggleDone = (id) => {
    setDone(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem('wuwa-astrite-done', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-extrabold mb-1">Astrite Guide</h1>
      <p className="text-white/50 text-sm mb-6">Every way to earn. Best tips to save. F2P optimized.</p>

      <div className="bg-gradient-to-br from-accent/10 to-accent-2/10 border border-accent/30 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-2"><Gem size={20} className="text-accent"/><h2 className="font-bold text-sm">F2P Monthly Estimate</h2></div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="text-center"><div className="text-2xl font-extrabold text-yellow-400">~5,500</div><div className="text-[10px] text-white/40 uppercase">Astrite/mo</div></div>
          <div className="text-center"><div className="text-2xl font-extrabold text-green">~34</div><div className="text-[10px] text-white/40 uppercase">Pulls/mo</div></div>
          <div className="text-center"><div className="text-2xl font-extrabold text-accent">~80</div><div className="text-[10px] text-white/40 uppercase">Pulls/patch</div></div>
        </div>
      </div>

      <Section title="Daily" icon={<Clock size={14}/>} items={DAILY} done={done} onToggle={toggleDone} prefix="d"/>
      <Section title="Weekly" icon={<Clock size={14}/>} items={WEEKLY} done={done} onToggle={toggleDone} prefix="w"/>
      <Section title="Every Rotation/Patch" icon={<Star size={14}/>} items={RECURRING} done={done} onToggle={toggleDone} prefix="r"/>
      <Section title="One-Time (Do These!)" icon={<CheckCircle2 size={14}/>} items={ONETIME} done={done} onToggle={toggleDone} prefix="o"/>

      <h2 className="font-bold text-sm text-white/70 uppercase tracking-wide mt-8 mb-3">Pro Saving Tips</h2>
      <div className="grid gap-2 mb-8">
        {TIPS.map((t, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex gap-3">
            <span className="text-xl">{t.icon}</span>
            <div><h3 className="text-sm font-bold">{t.title}</h3><p className="text-xs text-white/40 mt-0.5">{t.desc}</p></div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function Section({ title, icon, items, done, onToggle, prefix }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">{icon}<h2 className="font-bold text-sm text-white/70 uppercase tracking-wide">{title}</h2></div>
      {items.map((item, i) => {
        const id = `${prefix}-${i}`
        const checked = done.has(id)
        return (
          <button key={id} onClick={() => onToggle(id)}
            className={`w-full flex items-start gap-3 p-3 mb-1.5 rounded-xl border transition-all text-left
              ${checked ? 'bg-green/5 border-green/30' : 'bg-card border-border hover:border-white/10'}`}>
            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${checked ? 'border-green bg-green' : 'border-white/20'}`}>
              {checked && <CheckCircle2 size={12} className="text-black"/>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${checked ? 'line-through text-white/30' : ''}`}>{item.name}</span>
                {item.amount && <span className="text-[10px] font-bold text-yellow-400 ml-auto whitespace-nowrap">+{item.amount}{item.per ? `/${item.per}` : ''}</span>}
              </div>
              <p className="text-[11px] text-white/35 mt-0.5">{item.tip}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
