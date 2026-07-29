import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gem, CheckCircle2, Clock, Star, Sparkles, Target, ArrowRight } from 'lucide-react'

// ===== PITY CONSTANTS =====
const CHAR_HARD_PITY = 80
const CHAR_SOFT_PITY = 64
const WEAPON_HARD_PITY = 80
const WEAPON_SOFT_PITY = 64
const ASTRITE_PER_PULL = 160

// ===== SMART PLANNER LOGIC =====
function calculateNeeded(charPity, charGuaranteed, wantWeapon, weaponPity, weaponGuaranteed) {
  // Character pulls needed
  const charBest = Math.max(1, CHAR_SOFT_PITY - charPity)
  const charAvg = Math.ceil((CHAR_HARD_PITY - charPity) * (charGuaranteed ? 0.7 : 1.1))
  const charWorst = charGuaranteed ? (CHAR_HARD_PITY - charPity) : (CHAR_HARD_PITY - charPity) + CHAR_HARD_PITY

  // Weapon pulls needed (if wanted)
  let weapBest = 0, weapAvg = 0, weapWorst = 0
  if (wantWeapon) {
    weapBest = Math.max(1, WEAPON_SOFT_PITY - weaponPity)
    weapAvg = Math.ceil((WEAPON_HARD_PITY - weaponPity) * (weaponGuaranteed ? 0.7 : 1.1))
    weapWorst = weaponGuaranteed ? (WEAPON_HARD_PITY - weaponPity) : (WEAPON_HARD_PITY - weaponPity) + WEAPON_HARD_PITY
  }

  return {
    char: { best: charBest, avg: charAvg, worst: charWorst },
    weapon: { best: weapBest, avg: weapAvg, worst: weapWorst },
    total: {
      best: charBest + weapBest,
      avg: charAvg + weapAvg,
      worst: charWorst + weapWorst,
    }
  }
}

function generateAdvice(have, needed, days, wantWeapon) {
  const advice = []
  const deficit = needed.total.worst - have
  const avgDeficit = needed.total.avg - have

  if (have >= needed.total.worst) {
    advice.push({ type: 'safe', icon: '✅', title: "You're 100% safe", desc: `Even worst case (${needed.total.worst} pulls), you have ${have - needed.total.worst} pulls to spare. Pull whenever you want!` })
  } else if (have >= needed.total.avg) {
    advice.push({ type: 'good', icon: '👍', title: "Good position", desc: `You can likely get ${wantWeapon ? 'both' : 'the character'}. You'd only fail in worst case (lose all 50/50s). ${Math.abs(deficit)} pulls short of guarantee.` })
    advice.push({ type: 'tip', icon: '💡', title: "To guarantee it", desc: `You need ${deficit} more pulls = ${(deficit * ASTRITE_PER_PULL).toLocaleString()} more Astrite. In ${days} days of dailies = ${Math.floor(days * 60 / 160)} pulls.` })
  } else if (have >= needed.total.best) {
    advice.push({ type: 'risky', icon: '⚠️', title: "Risky — need luck", desc: `You need ${Math.abs(avgDeficit)} more pulls to hit average case. Start grinding NOW.` })
  } else {
    advice.push({ type: 'short', icon: '❌', title: "Significantly short", desc: `You're ${Math.abs(avgDeficit)} pulls away from even average case. Major grind or spending needed.` })
  }

  // Character + Weapon strategy
  if (wantWeapon) {
    if (have >= needed.char.worst + needed.weapon.avg) {
      advice.push({ type: 'strategy', icon: '🎯', title: "Pull character first, weapon second", desc: "Get the character guaranteed first. Then try weapon with remaining pulls. If you lose weapon 50/50, you can still use a 4-star weapon." })
    } else if (have >= needed.char.worst) {
      advice.push({ type: 'strategy', icon: '🎯', title: "Character is safe — weapon is a gamble", desc: `You guarantee the character (${needed.char.worst} pulls worst). Remaining ${have - needed.char.worst} pulls for weapon is not enough to guarantee. Consider skipping weapon unless you get char early.` })
    } else {
      advice.push({ type: 'strategy', icon: '🎯', title: "Focus on character only", desc: `You can't guarantee both. Get the character first — a good 4-star weapon is 80% as effective as their signature for way less cost.` })
    }
  }

  // Daily income projection
  const dailyIncome = days * 60
  const totalFreeIncome = dailyIncome + 700 + 500 + 300 // dailies + tower + events + codes
  const freeIncomeePulls = Math.floor(totalFreeIncome / ASTRITE_PER_PULL)
  advice.push({ type: 'income', icon: '📈', title: `${days} days = ~${freeIncomeePulls} more free pulls`, desc: `Dailies (${Math.floor(dailyIncome/160)}) + Tower (4) + Events (3) + Codes (2). Your total by banner end: ~${have + freeIncomeePulls} pulls.` })

  // Spending advice
  if (have < needed.total.avg) {
    const astNeeded = (needed.total.avg - have - freeIncomeePulls) * ASTRITE_PER_PULL
    if (astNeeded > 0) {
      advice.push({ type: 'grind', icon: '⛏️', title: "Grind exploration", desc: `You need ~${astNeeded.toLocaleString()} more Astrite after free income. Each region has 5000+ from chests alone. Use interactive map!` })
      if (astNeeded > 3000) {
        advice.push({ type: 'spend', icon: '💳', title: "Lunite Subscription (best value)", desc: `$5/month = 90 Astrite/day = ${Math.floor(days * 90 / 160)} extra pulls over ${days} days. Cheapest way to close the gap.` })
      }
    }
  }

  return advice
}

// ===== INCOME DATA =====
const DAILY_SOURCES = [
  { name: "Daily Quests", amount: 60, per: "day", tip: "4 activities = 100 pts. Never skip!" },
]
const RECURRING_SOURCES = [
  { name: "Tower of Adversity", amount: 700, per: "28d", tip: "Full clear = 4.4 free pulls per reset" },
  { name: "Battle Pass (Free)", amount: 500, per: "patch", tip: "Play normally to max" },
  { name: "Patch Events", amount: 2500, per: "patch", tip: "Do limited events day 1" },
  { name: "Maintenance + Codes", amount: 900, per: "patch", tip: "Always claim compensation mail + livestream codes" },
  { name: "New Story", amount: 400, per: "patch", tip: "Complete new quests ASAP" },
]
const GRIND_SOURCES = [
  { name: "Exploration (per region)", amount: "5000+", tip: "Chests, puzzles, Sonance Caskets, Nexuses" },
  { name: "ToA One-Time Zones", amount: "1,800", tip: "Stable + Experiment + Overdrive" },
  { name: "Achievements", amount: "5-20 each", tip: "Check menu for easy unclaimed" },
  { name: "Side Quests", amount: "20-80 each", tip: "Character stories + world quests" },
  { name: "Pioneer Association", amount: "Varies", tip: "Higher exploration = more rewards" },
]

export default function AstriteTab() {
  const [mode, setMode] = useState('planner') // 'planner' | 'guide'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-extrabold mb-1">Astrite Planner</h1>
      <p className="text-white/50 text-sm mb-4">Smart planning for your next 5-star.</p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode('planner')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${mode === 'planner' ? 'bg-accent border-accent text-white' : 'bg-surface border-border text-white/40'}`}>
          <Sparkles size={14} className="inline mr-1.5" />Smart Planner
        </button>
        <button onClick={() => setMode('guide')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${mode === 'guide' ? 'bg-accent border-accent text-white' : 'bg-surface border-border text-white/40'}`}>
          <Gem size={14} className="inline mr-1.5" />Income Guide
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'planner' ? <SmartPlanner key="planner" /> : <IncomeGuide key="guide" />}
      </AnimatePresence>
    </motion.div>
  )
}

function SmartPlanner() {
  const [astrite, setAstrite] = useState('')
  const [tides, setTides] = useState('')
  const [charPity, setCharPity] = useState('')
  const [charGuaranteed, setCharGuaranteed] = useState('5050')
  const [wantWeapon, setWantWeapon] = useState(false)
  const [weaponPity, setWeaponPity] = useState('')
  const [weaponGuaranteed, setWeaponGuaranteed] = useState('5050')
  const [days, setDays] = useState('21')
  const [result, setResult] = useState(null)

  function analyze() {
    const totalPulls = Math.floor((parseInt(astrite) || 0) / ASTRITE_PER_PULL) + (parseInt(tides) || 0)
    const needed = calculateNeeded(
      parseInt(charPity) || 0, charGuaranteed === 'guaranteed',
      wantWeapon, parseInt(weaponPity) || 0, weaponGuaranteed === 'guaranteed'
    )
    const d = parseInt(days) || 0
    const advice = generateAdvice(totalPulls, needed, d, wantWeapon)
    setResult({ totalPulls, needed, advice, wantWeapon })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-accent-2/10 border border-accent-2/30 rounded-xl w-fit">
        <Sparkles size={14} className="text-accent-2" />
        <span className="text-[11px] font-bold text-accent-2/80">AI-Powered Analysis</span>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase text-white/60 mb-4 flex items-center gap-2">
          <Target size={14} className="text-accent" /> What do you want?
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Field label="Current Astrite" value={astrite} onChange={setAstrite} placeholder="0" />
          <Field label="Radiant Tides" value={tides} onChange={setTides} placeholder="0" />
          <Field label="Character Pity" value={charPity} onChange={setCharPity} placeholder="0" />
          <Field label="Days Until Banner" value={days} onChange={setDays} placeholder="21" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Character 50/50?</label>
            <select value={charGuaranteed} onChange={e => setCharGuaranteed(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white">
              <option value="5050">50/50</option>
              <option value="guaranteed">Guaranteed</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Want weapon too?</label>
            <select value={wantWeapon ? 'yes' : 'no'} onChange={e => setWantWeapon(e.target.value === 'yes')}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white">
              <option value="no">Character only</option>
              <option value="yes">Character + Weapon</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {wantWeapon && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-border">
                <Field label="Weapon Pity" value={weaponPity} onChange={setWeaponPity} placeholder="0" />
                <div>
                  <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Weapon 50/50?</label>
                  <select value={weaponGuaranteed} onChange={e => setWeaponGuaranteed(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white">
                    <option value="5050">50/50</option>
                    <option value="guaranteed">Guaranteed</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={analyze}
          className="w-full py-3 bg-gradient-to-r from-accent to-accent-2 text-white font-bold rounded-xl shadow-lg shadow-accent/20 flex items-center justify-center gap-2">
          <Sparkles size={16} /> Analyze My Situation
        </motion.button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <div className="bg-card border border-border rounded-2xl p-5 mb-4">
              <h3 className="text-xs font-bold uppercase text-white/60 mb-3 flex items-center gap-2">Pulls Required</h3>
              <div className="grid grid-cols-4 gap-2 mb-2 text-[9px] text-white/30 uppercase">
                <span></span><span className="text-center">Best</span><span className="text-center">Avg</span><span className="text-center">Worst</span>
              </div>
              <PullRow label="Character" best={result.needed.char.best} avg={result.needed.char.avg} worst={result.needed.char.worst} />
              {result.wantWeapon && <PullRow label="Weapon" best={result.needed.weapon.best} avg={result.needed.weapon.avg} worst={result.needed.weapon.worst} />}
              <div className="border-t border-border pt-2 mt-2">
                <PullRow label="TOTAL" best={result.needed.total.best} avg={result.needed.total.avg} worst={result.needed.total.worst} bold />
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-white/50">You have:</span>
                <span className="text-lg font-extrabold">{result.totalPulls} pulls</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between text-[10px] text-white/40 mb-1.5">
                <span>You: {result.totalPulls}</span>
                <span>Need: {result.needed.total.worst}</span>
              </div>
              <div className="h-3 bg-surface rounded-full overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (result.totalPulls / result.needed.total.worst) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${result.totalPulls >= result.needed.total.worst ? 'bg-green' : result.totalPulls >= result.needed.total.avg ? 'bg-yellow-400' : 'bg-accent'}`} />
              </div>
              <div className="text-center mt-1.5 text-[10px] text-white/30">
                {Math.round((result.totalPulls / result.needed.total.worst) * 100)}% to full guarantee
              </div>
            </div>

            {/* AI Advice */}
            <div className="bg-gradient-to-br from-accent-2/5 to-accent/5 border border-accent-2/20 rounded-2xl p-5 mb-6">
              <h3 className="text-xs font-bold uppercase text-accent-2/80 mb-4 flex items-center gap-2"><Sparkles size={14}/> Personalized Advice</h3>
              <div className="space-y-4">
                {result.advice.map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                    className="flex gap-3 items-start">
                    <span className="text-lg flex-shrink-0">{a.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold">{a.title}</h4>
                      <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">{a.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
