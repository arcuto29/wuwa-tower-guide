import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { CHARACTERS, ELEMENTS, ELEMENT_COLORS } from '../data/characters'
import { TEAM_RECIPES, TOWER_SECTIONS } from '../data/teams'

export default function RosterTab() {
  const [owned, setOwned] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wuwa-owned') || '[]')) }
    catch { return new Set() }
  })
  const [filter, setFilter] = useState('all')
  const [showTeams, setShowTeams] = useState(false)

  useEffect(() => {
    localStorage.setItem('wuwa-owned', JSON.stringify([...owned]))
  }, [owned])

  const toggle = (name) => {
    setOwned(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const filtered = filter === 'all' ? CHARACTERS : CHARACTERS.filter(c => c.element === filter)

  if (showTeams) return <TeamResults owned={owned} onBack={() => setShowTeams(false)} />

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">My Roster</h1>
      <p className="text-white/50 text-sm mb-5">Tap characters you own. We'll build your best teams.</p>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {ELEMENTS.map(el => (
          <button key={el} onClick={() => setFilter(el)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap border transition-all
              ${filter === el ? 'bg-accent border-accent text-white' : 'bg-surface border-border text-white/40 hover:text-white/60'}`}>
            {el}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
        {filtered.map((c, ci) => {
          const sel = owned.has(c.name)
          const initials = c.name.split(' ').map(w => w[0]).join('').slice(0,2)
          return (
            <motion.button key={c.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: ci * 0.02 }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => toggle(c.name)}
              className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all overflow-hidden
                ${sel
                  ? 'border-accent bg-accent/8 shadow-xl shadow-accent/25'
                  : 'border-border bg-surface hover:border-white/20 hover:shadow-lg'}`}
            >
              {/* Glow effect when selected */}
              {sel && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${ELEMENT_COLORS[c.element]}30, transparent 70%)` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {sel && <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-lg z-10"><Check size={11} strokeWidth={3}/></div>}

              {/* BIG character portrait */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(160deg, ${ELEMENT_COLORS[c.element]}15, ${ELEMENT_COLORS[c.element]}50, ${ELEMENT_COLORS[c.element]}20)`,
                  border: `2px solid ${ELEMENT_COLORS[c.element]}${sel ? '99' : '33'}`,
                  boxShadow: sel ? `0 0 20px ${ELEMENT_COLORS[c.element]}40, inset 0 0 20px ${ELEMENT_COLORS[c.element]}10` : 'none'
                }}>
                {c.img ? <img src={c.img} alt={c.name} className="w-full h-full object-cover scale-110" loading="lazy" />
                  : <span className="text-2xl font-extrabold text-white/80">{initials}</span>}
                {/* Rarity stars overlay */}
                <div className="absolute bottom-0 inset-x-0 h-5 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-0.5">
                  <span className="text-[8px]" style={{ color: c.rarity === 5 ? '#facc15' : '#a78bfa' }}>
                    {'★'.repeat(c.rarity)}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-white/70 text-center leading-tight w-full truncate">{c.name}</span>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: ELEMENT_COLORS[c.element], boxShadow: `0 0 6px ${ELEMENT_COLORS[c.element]}` }} />
                <span className="text-[9px] text-white/40 uppercase font-bold">{c.role}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="fixed bottom-16 inset-x-0 px-4 pb-3 pt-6 bg-gradient-to-t from-bg via-bg/90 to-transparent z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between bg-surface/95 backdrop-blur-xl border border-border rounded-2xl px-5 py-3.5 shadow-2xl">
          <span className="text-sm text-white/50"><span className="text-accent font-bold text-lg">{owned.size}</span> selected</span>
          <button onClick={() => setShowTeams(true)} disabled={owned.size < 3}
            className="px-6 py-2.5 bg-gradient-to-r from-accent to-accent-2 text-white font-bold rounded-xl text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-accent/30">
            Show My Teams →
          </button>
        </div>
      </div>
    </div>
  )
}

function TeamResults({ owned, onBack }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} className="text-sm text-white/40 hover:text-white mb-4 border border-border px-4 py-2 rounded-xl transition-all hover:border-accent/50">← Back to roster</button>
      <h1 className="text-2xl font-extrabold mb-1">Your Tower Teams</h1>
      <p className="text-white/50 text-sm mb-6">Based on your <span className="text-accent font-bold">{owned.size}</span> characters:</p>

      {TOWER_SECTIONS.map(sec => {
        const recipes = TEAM_RECIPES[sec.key] || []
        const match = recipes.find(r => r.chars.every(c => owned.has(c)))
        return (
          <div key={sec.key} className="mb-5">
            <div className="flex items-center gap-3 mb-2.5">
              <h2 className="font-bold text-sm">{sec.title}</h2>
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md"
                style={{ background: `${ELEMENT_COLORS[sec.color] || '#ff3b5c'}15`, color: ELEMENT_COLORS[sec.color] || '#ff3b5c' }}>{sec.sub}</span>
              <span className="text-[10px] font-bold text-yellow-400 ml-auto">{sec.vigor} vigor</span>
            </div>
            {match ? (
              <div className="bg-card border border-border rounded-2xl p-4 hover:border-white/10 transition-all">
                <div className="flex gap-3 mb-3 overflow-x-auto pb-1">
                  {match.chars.map(name => {
                    const ch = CHARACTERS.find(x => x.name === name)
                    return (
                      <div key={name} className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 flex-shrink-0">
                        {ch?.img ? <img src={ch.img} alt={name} className="w-8 h-8 rounded-lg object-cover" style={{ border: `1.5px solid ${ELEMENT_COLORS[ch.element]}66` }} />
                          : <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${ELEMENT_COLORS[ch?.element]}33`, border: `1.5px solid ${ELEMENT_COLORS[ch?.element]}66` }}>{name.slice(0,2)}</div>}
                        <span className="text-xs font-semibold whitespace-nowrap">{name}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-white/50 border-l-2 border-accent pl-3 leading-relaxed">{match.tip}</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-5 text-center text-xs text-white/30">No team found — go back and add more characters</div>
            )}
          </div>
        )
      })}
    </motion.div>
  )
}
