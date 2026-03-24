import type { ProjectType } from '../types'
import { PROJECT_TYPES } from '../data/projectTypes'
import { Monitor, ShoppingCart, LayoutDashboard, Terminal, TrendingUp, Smartphone, CheckCircle2 } from 'lucide-react'

interface Props {
  selected: ProjectType | null
  onSelect: (type: ProjectType) => void
}

const ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  landing:    { icon: Monitor,         color: 'text-violet-400', bg: 'bg-violet-500/20' },
  ecommerce:  { icon: ShoppingCart,    color: 'text-amber-400',  bg: 'bg-amber-500/20'  },
  saas:       { icon: LayoutDashboard, color: 'text-violet-300', bg: 'bg-violet-600/25' },
  api:        { icon: Terminal,        color: 'text-slate-300',  bg: 'bg-slate-500/20'  },
  consulting: { icon: TrendingUp,      color: 'text-orange-400', bg: 'bg-orange-500/20' },
  mobile:     { icon: Smartphone,      color: 'text-violet-400', bg: 'bg-violet-500/20' },
}

export function ProjectTypeSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <h1 className="text-2xl sm:text-4xl font-bold text-white text-center mb-3 leading-tight">
        ¿Qué tipo de proyecto es?
      </h1>
      <p className="text-slate-400 text-center text-sm mb-10">
        Selecciona el que mejor describe el trabajo para calcular una base de valor precisa.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PROJECT_TYPES.map((type) => {
          const isSelected = selected?.id === type.id
          const { icon: Icon, color, bg } = ICONS[type.id] ?? ICONS.landing

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type)}
              className={`relative text-left p-5 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10'
                  : 'border-white/[0.08] bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              {isSelected && (
                <CheckCircle2 size={16} className="absolute top-3 right-3 text-violet-400" />
              )}
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon size={18} className={color} />
              </div>
              <div className="font-semibold text-white mb-1">{type.name}</div>
              <div className="text-xs text-slate-400 mb-4 leading-relaxed">{type.description}</div>
              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  isSelected ? 'bg-violet-500 text-white' : 'bg-white/[0.08] text-slate-300'
                }`}
              >
                desde{' '}
                <span className={isSelected ? 'text-white' : 'text-violet-400'}>
                  ${type.baseHourlyRate}/h
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
