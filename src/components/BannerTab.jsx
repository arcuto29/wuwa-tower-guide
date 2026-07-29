import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, TrendingUp, Calendar } from 'lucide-react'

export default function BannerTab() {
  const [astrite, setAstrite] = useState('')
  const [tides, setTides] = useState('')
  const [pity, setPity] = useState('')
  const [guaranteed, setGuaranteed] = useState('5050')
  const [days, setDays] = useState('21')
  const [dailies, setDailies] = useState(true)
  const [result, setResult] = useState(null)

  function calculate() {
    const a = parseInt(astrite) || 0
    const t = parseInt(tides) || 0
    const p = parseInt(pity) || 0
    const d = parseInt(days) || 0
    const isG = guaranteed === 'guaranteed'
    let income = 0
    if (dailies) income += d * 60
    income += 700 + 500 + 300
    const totalPulls = Math.floor((a + income) / 160) + t
    const best = Math.max(1, 64 - p)
    const avg = Math.ceil((80 - p) * (isG ? 0.7 : 1.1))
    const worst = isG ? (80 - p) : (80 - p) + 80
    let verdict, color
    if (totalPulls >= worst) { verdict = "GUARANTEED"; color = "green" }
    else if (totalPulls >= avg) { verdict = "GOOD CHANCE"; color = "yellow" }
    else if (totalPulls >= best) { verdict = "RISKY"; color = "yellow" }
    else { verdict = "SHORT"; color = "accent" }
    setResult({ totalPulls, best, avg, worst, verdict, color, income, d })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-extrabold mb-1">Banner Planner</h1>
      <p className="text-white/50 text-sm mb-6">Can you get that 5-star?</p>

      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3"><Calendar size={14} className="text-accent"/><h3 className="text-xs font-bold uppercase text-white/60">Upcoming v3.5</h3></div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
            <span className="text-[10px] font-bold uppercase text-accent">Phase 2</span>
            <span className="text-xs text-white/70 flex-1">Suisui (NEW), Aemeath rerun</span>
            <span className="text-[10px] text-white/30">Jul 30 - Aug 20</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-yellow/30 bg-yellow/5">
            <span className="text-[10px] font-bold uppercase text-yellow-400">Starpath</span>
            <span className="text-xs text-white/70 flex-1">Pick: Jiyan/Yinlin/Jinhsi/Changli/Zhezhi/Xiangli Yao</span>
            <span className="text-[10px] text-white/30">10 free!</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4"><Target size={14} className="text-accent"/><h3 className="text-xs font-bold uppercase text-white/60">Your Status</h3></div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Field label="Current Astrite" value={astrite} onChange={setAstrite} placeholder="0"/>
          <Field label="Radiant Tides" value={tides} onChange={setTides} placeholder="0"/>
          <Field label="Current Pity" value={pity} onChange={setPity} placeholder="0"/>
          <Field label="Days Until Banner" value={days} onChange={setDays} placeholder="21"/>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div><label className="text-[10px] text-white/40 font-bold uppercase block mb-1">50/50?</label>
            <select value={guaranteed} onChange={e => setGuaranteed(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white"><option value="5050">50/50</option><option value="guaranteed">Guaranteed</option></select></div>
          <div><label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Dailies?</label>
            <select value={dailies?'yes':'no'} onChange={e=>setDailies(e.target.value==='yes')} className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white"><option value="yes">Yes (60/day)</option><option value="no">No</option></select></div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={calculate}
          className="w-full py-3 bg-gradient-to-r from-accent to-accent-2 text-white font-bold rounded-xl shadow-lg shadow-accent/20">
          Calculate
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-card border border-border rounded-2xl p-5 mb-8">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }}
              className={`text-center py-3 px-4 rounded-xl mb-4 border font-bold
              ${result.color === 'green' ? 'bg-green/10 border-green/30 text-green' : result.color === 'yellow' ? 'bg-yellow/10 border-yellow/30 text-yellow-400' : 'bg-accent/10 border-accent/30 text-accent'}`}>
              {result.verdict === 'GUARANTEED' && '✅'} {result.verdict === 'GOOD CHANCE' && '⚠️'} {result.verdict === 'RISKY' && '🎲'} {result.verdict === 'SHORT' && '❌'} {result.verdict}
            </motion.div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[{l:"Yours",v:result.totalPulls,c:"text-white"},{l:"Best",v:result.best,c:"text-green"},{l:"Average",v:result.avg,c:"text-yellow-400"},{l:"Worst",v:result.worst,c:"text-accent"}].map((s,i) => (
                <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i*0.05 }}
                  className="bg-surface rounded-xl p-2.5 text-center">
                  <div className={`text-xl font-extrabold ${s.c}`}>{s.v}</div>
                  <div className="text-[9px] text-white/30 uppercase">{s.l}</div>
                </motion.div>
              ))}
            </div>
            <div className="space-y-1.5 text-xs text-white/40">
              <div className="flex justify-between"><span>Current Astrite</span><span>{astrite||0}</span></div>
              {dailies&&<div className="flex justify-between"><span>Dailies ({result.d}d × 60)</span><span className="text-green">+{result.d*60}</span></div>}
              <div className="flex justify-between"><span>Tower + Events + Codes</span><span className="text-green">+1,500</span></div>
              <div className="flex justify-between"><span>Radiant Tides</span><span className="text-green">+{tides||0} pulls</span></div>
              <div className="flex justify-between border-t border-border pt-1.5 font-bold text-white/70"><span>Total</span><span>{result.totalPulls} pulls</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-2 mb-3"><TrendingUp size={14} className="text-green"/><h3 className="text-xs font-bold uppercase text-white/60">Quick Math</h3></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-surface rounded-xl p-3"><div className="text-lg font-extrabold text-yellow-400">160</div><div className="text-white/40">Astrite/pull</div></div>
          <div className="bg-surface rounded-xl p-3"><div className="text-lg font-extrabold text-accent">12,800</div><div className="text-white/40">Hard pity cost</div></div>
          <div className="bg-surface rounded-xl p-3"><div className="text-lg font-extrabold text-green">64</div><div className="text-white/40">Soft pity start</div></div>
          <div className="bg-surface rounded-xl p-3"><div className="text-lg font-extrabold text-electro">80</div><div className="text-white/40">Hard pity</div></div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div><label className="text-[10px] text-white/40 font-bold uppercase block mb-1">{label}</label>
      <input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-accent focus:outline-none transition-colors"/></div>
  )
}
