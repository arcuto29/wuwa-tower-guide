import { useState } from 'react'
import { Users, Gem, Swords, Target } from 'lucide-react'
import RosterTab from './components/RosterTab'
import AstriteTab from './components/AstriteTab'
import TowerTab from './components/TowerTab'
import BannerTab from './components/BannerTab'

const TABS = [
  { id: 'roster', label: 'My Roster', icon: Users },
  { id: 'astrite', label: 'Astrite', icon: Gem },
  { id: 'tower', label: 'Tower', icon: Swords },
  { id: 'banner', label: 'Planner', icon: Target },
]

export default function App() {
  const [tab, setTab] = useState('roster')

  return (
    <div className="min-h-screen pb-20">
      {/* Animated bg */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-accent-2/10 blur-[120px] animate-pulse" style={{animationDelay:'2s'}} />
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 pt-6">
        {tab === 'roster' && <RosterTab />}
        {tab === 'astrite' && <AstriteTab />}
        {tab === 'tower' && <TowerTab />}
        {tab === 'banner' && <BannerTab />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-lg border-t border-border z-50">
        <div className="max-w-2xl mx-auto flex">
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${active ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[10px] font-semibold uppercase tracking-wide">{t.label}</span>
                {active && <div className="absolute top-0 w-10 h-0.5 bg-accent rounded-b" />}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
