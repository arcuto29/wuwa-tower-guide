import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Calendar, Users, Sword, ArrowDown, Gem } from 'lucide-react'

// Where you can get pulls from + amounts
const INCOME_SOURCES = [
  { name: "Daily Quests", perDay: 60, icon: "📋", desc: "4 activities = 60 Astrite/day" },
  { name: "Tower of Adversity", flat: 700, icon: "🏯", desc: "Full clear all 3 towers" },
  { name: "Patch Events", flat: 2500, icon: "🎮", desc: "Complete all limited events" },
  { name: "Maintenance Comp", flat: 600, icon: "🔧", desc: "Free from server updates" },
  { name: "Redemption Codes", flat: 300, icon: "🎁", desc: "Livestream + social codes" },
  { name: "New Story Quests", flat: 400, icon: "📖", desc: "New patch story content" },
  { name: "Battle Pass (Free)", flat: 500, icon: "⭐", desc: "Free track rewards" },
  { name: "Exploration Grind", flat: 2000, icon: "🗺️", desc: "Unclaimed chests & puzzles" },
  { name: "Achievements", flat: 500, icon: "🏆", desc: "Easy unclaimed achievements" },
  { name: "Lunite Sub ($5/mo)", perDay: 90, icon: "💳", desc: "90 Astrite/day for 30 days", paid: true },
]

export default function BannerTab() {
  const [mode, setMode] = useState('character') // 'character' | 'weapon'
  const [astrite, setAstrite] = useState('')
  const [tides, setTides] = useState('')
  const [pity, setPity] = useState('')
  const [guaranteed, setGuaranteed] = useState('5050')
  const [days, setDays] = useState('21')
  const [result, setResult] = useState(null)

  function calculate() {
    const a = parseInt(astrite) || 0
    const t = parseInt(tides) || 0
    const p = Math.min(79, parseInt(pity) || 0)
    const d = parseInt(days) || 0
    const isG = guaranteed === 'guaranteed'

    const currentPulls = Math.floor(a / 160) + t

    // Pulls needed
    const best = Math.max(1, 64 - p)
    const avg = Math.ceil((80 - p) * (isG ? 0.7 : 1.1))
    const worst = isG ? (80 - p) : (80 - p) + 80

    // Deficit (how many more you need)
    const deficitBest = Math.max(0, best - currentPulls)
    const deficitAvg = Math.max(0, avg - currentPulls)
    const deficitWorst = Math.max(0, worst - currentPulls)

    // Astrite deficit
    const astriteNeeded = deficitWorst * 160

    // Calculate income sources
    const sources = INCOME_SOURCES.map(s => {
      let pullsFromSource = 0
      if (s.perDay) {
        pullsFromSource = Math.floor((s.perDay * d) / 160)
      } else {
        pullsFromSource = Math.floor(s.flat / 160)
      }
      return { ...s, pulls: pullsFromSource, astrite: s.perDay ? s.perDay * d : s.flat }
    }).filter(s => s.pulls > 0)

    const totalFreeIncome = sources.filter(s => !s.paid).reduce((sum, s) => sum + s.pulls, 0)
    const totalWithPaid = sources.reduce((sum, s) => sum + s.pulls, 0)
    const finalPulls = currentPulls + totalFreeIncome

    // Verdict
    let verdict, color, emoji
    if (finalPulls >= worst) { verdict = "GUARANTEED"; color = "green"; emoji = "✅" }
    else if (finalPulls >= avg) { verdict = "GOOD CHANCE"; color = "yellow"; emoji = "⚠️" }
    else if (finalPulls >= best) { verdict = "RISKY"; color = "yellow"; emoji = "🎲" }
    else { verdict = "SHORT"; color = "accent"; emoji = "❌" }

    setResult({
      currentPulls, best, avg, worst,
      deficitBest, deficitAvg, deficitWorst,
      astriteNeeded, sources, totalFreeIncome,
      totalWithPaid, finalPulls, verdict, color, emoji, d
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-extrabold mb-1">Banner Planner</h1>
      <p className="text-white/50 text-sm mb-5">Separate character & weapon. See exactly what you need.</p>

      {/* Banner type toggle */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => { setMode('character'); setResult(null) }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all
            ${mode === 'character' ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-surface border-border text-white/40'}`}>
          <Users size={16} /> Character
        </button>
        <button onClick={() => { setMode('weapon'); setResult(null) }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all
            ${mode === 'weapon' ? 'bg-accent-2 border-accent-2 text-white shadow-lg shadow-accent-2/20' : 'bg-surface border-border text-white/40'}`}>
          <Sword size={16} /> Weapon
        </button>
      </div>

      {/* Upcoming banners */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3"><Calendar size={14} className="text-accent"/><h3 className="text-xs font-bold uppercase text-white/60">Current Banners (v3.5)</h3></div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
            <span className="text-[10px] font-bold uppercase text-accent">Phase 2</span>
            <span className="text-xs text-white/70 flex-1">{mode === 'character' ? 'Suisui, Aemeath rerun' : 'Suisui & Aemeath weapons'}</span>
            <span className="text-[10px] text-white/30">Jul 30 - Aug 20</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-yellow/30 bg-yellow/5">
            <span className="text-[10px] font-bold uppercase text-yellow-400">Starpath</span>
            <span className="text-xs text-white/70 flex-1">Pick 1 of 6 characters (10 free pulls!)</span>
          </div>
        </div>
      </motion.div>

      {/* Input section */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={14} className={mode === 'character' ? 'text-accent' : 'text-accent-2'} />
          <h3 className="text-xs font-bold uppercase text-white/60">
            {mode === 'character' ? 'Character Banner' : 'Weapon Banner'}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Field label="Your Astrite" value={astrite} onChange={setAstrite} placeholder="0" />
          <Field label={mode === 'character' ? 'Radiant Tides' : 'Forging Tides'} value={tides} onChange={setTides} placeholder="0" />
          <Field label={`${mode === 'character' ? 'Char' : 'Weapon'} Pity (0-79)`} value={pity} onChange={setPity} placeholder="0" />
          <Field label="Days Until Banner Ends" value={days} onChange={setDays} placeholder="21" />
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">50/50 or Guaranteed?</label>
          <select value={guaranteed} onChange={e => setGuaranteed(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white">
            <option value="5050">50/50 (haven't lost yet)</option>
            <option value="guaranteed">Guaranteed (lost last 50/50)</option>
          </select>
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={calculate}
          className={`w-full py-3.5 text-white font-bold rounded-xl shadow-lg transition-all ${
            mode === 'character'
              ? 'bg-gradient-to-r from-accent to-accent-2 shadow-accent/20'
              : 'bg-gradient-to-r from-accent-2 to-purple-500 shadow-accent-2/20'
          }`}>
          Calculate {mode === 'character' ? 'Character' : 'Weapon'} Pulls
        </motion.button>
      </motion.div>

      {/* RESULTS */}
      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}>

            {/* Verdict */}
            <div className={`text-center py-4 px-4 rounded-2xl mb-4 border font-bold text-lg
              ${result.color === 'green' ? 'bg-green/10 border-green/30 text-green' :
                result.color === 'yellow' ? 'bg-yellow/10 border-yellow/30 text-yellow-400' :
                'bg-accent/10 border-accent/30 text-accent'}`}>
              {result.emoji} {result.verdict}
            </div>

            {/* You have vs You need */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-white">{result.currentPulls}</div>
                <div className="text-[10px] text-white/40 uppercase mt-1">You have now</div>
              </div>
              <div className="bg-card border border-accent/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-accent">{result.worst}</div>
                <div className="text-[10px] text-white/40 uppercase mt-1">Worst case need</div>
              </div>
            </div>

            {/* How many MORE you need */}
            {result.deficitWorst > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-accent/10 to-accent-2/10 border border-accent/20 rounded-2xl p-5 mb-4">
                <h3 className="text-xs font-bold uppercase text-accent/80 mb-3 flex items-center gap-2">
                  <ArrowDown size={14} /> You still need
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-extrabold text-green">{result.deficitBest}</div>
                    <div className="text-[9px] text-white/30 uppercase">Best case</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-yellow-400">{result.deficitAvg}</div>
                    <div className="text-[9px] text-white/30 uppercase">Average</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-accent">{result.deficitWorst}</div>
                    <div className="text-[9px] text-white/30 uppercase">Worst case</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 text-center">
                  <span className="text-xs text-white/50">= <span className="font-bold text-yellow-400">{(result.deficitWorst * 160).toLocaleString()}</span> more Astrite to guarantee</span>
                </div>
              </motion.div>
            )}

            {/* WHERE TO GET THEM */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-5 mb-4">
              <h3 className="text-xs font-bold uppercase text-green/80 mb-1 flex items-center gap-2">
                <Gem size={14} className="text-green" /> Where to get pulls ({result.d} days)
              </h3>
              <p className="text-[10px] text-white/30 mb-4">Every source available before banner ends:</p>

              <div className="space-y-2">
                {result.sources.filter(s => !s.paid).map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                    <span className="text-lg">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">{s.name}</div>
                      <div className="text-[10px] text-white/30">{s.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-extrabold text-green">+{s.pulls}</div>
                      <div className="text-[9px] text-white/30">{s.astrite.toLocaleString()} ast</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total free income */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">Total free pulls:</span>
                <span className="text-lg font-extrabold text-green">+{result.totalFreeIncome}</span>
              </div>

              {/* Final total */}
              <div className="mt-2 p-3 rounded-xl bg-green/5 border border-green/20 flex items-center justify-between">
                <span className="text-xs font-bold text-white/70">Your total by banner end:</span>
                <span className="text-xl font-extrabold text-white">{result.finalPulls} pulls</span>
              </div>

              {/* Still short? Show paid option */}
              {result.finalPulls < result.worst && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] text-white/30 mb-2">Still short? Paid option:</p>
                  {result.sources.filter(s => s.paid).map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-yellow/20">
                      <span className="text-lg">{s.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-semibold">{s.name}</div>
                        <div className="text-[10px] text-white/30">{s.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-yellow-400">+{s.pulls}</div>
                        <div className="text-[9px] text-white/30">{s.astrite.toLocaleString()} ast</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Progress bar */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-8">
              <div className="flex items-center justify-between text-[10px] text-white/40 mb-2">
                <span>You: {result.finalPulls}</span>
                <span>Need: {result.worst}</span>
              </div>
              <div className="h-4 bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (result.finalPulls / result.worst) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    result.finalPulls >= result.worst ? 'bg-green' :
                    result.finalPulls >= result.avg ? 'bg-yellow-400' : 'bg-accent'
                  }`}
                />
              </div>
              <div className="text-center mt-2 text-xs text-white/40">
                {Math.round((result.finalPulls / result.worst) * 100)}% to guarantee
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick reference - always visible */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-8">
        <h3 className="text-xs font-bold uppercase text-white/40 mb-3">Pity Reference</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-surface rounded-xl p-3">
            <div className="text-lg font-extrabold text-yellow-400">160</div>
            <div className="text-white/40">Astrite per pull</div>
          </div>
          <div className="bg-surface rounded-xl p-3">
            <div className="text-lg font-extrabold text-accent">{mode === 'character' ? '12,800' : '12,800'}</div>
            <div className="text-white/40">Hard pity cost</div>
          </div>
          <div className="bg-surface rounded-xl p-3">
            <div className="text-lg font-extrabold text-green">64</div>
            <div className="text-white/40">Soft pity starts</div>
          </div>
          <div className="bg-surface rounded-xl p-3">
            <div className="text-lg font-extrabold text-electro">80</div>
            <div className="text-white/40">Hard pity (100%)</div>
          </div>
        </div>
        {mode === 'character' && (
          <p className="text-[10px] text-white/30 mt-3 text-center">50/50: 50% chance featured, 50% standard. If you lose, next 5★ is guaranteed featured.</p>
        )}
        {mode === 'weapon' && (
          <p className="text-[10px] text-white/30 mt-3 text-center">Weapon banner works the same as character. 50/50 between featured and standard weapon.</p>
        )}
      </div>
    </motion.div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">{label}</label>
      <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-accent focus:outline-none transition-colors" />
    </div>
  )
}
