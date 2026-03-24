import type { ProjectType } from '../types'
import { PROJECT_TYPES } from '../data/projectTypes'
import { Monitor, ShoppingCart, LayoutDashboard, Terminal, TrendingUp, Smartphone } from 'lucide-react'

interface Props {
  selected: ProjectType | null
  onSelect: (type: ProjectType) => void
}

const ICONS: Record<string, React.ElementType> = {
  landing:    Monitor,
  ecommerce:  ShoppingCart,
  saas:       LayoutDashboard,
  api:        Terminal,
  consulting: TrendingUp,
  mobile:     Smartphone,
}

export function ProjectTypeSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight leading-tight">
        Tipo de proyecto
      </h1>
      <p className="text-[#666] text-sm mb-8 font-light">
        Selecciona el que mejor describe el trabajo.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {PROJECT_TYPES.map((type) => {
          const isSelected = selected?.id === type.id
          const Icon = ICONS[type.id] ?? Monitor

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type)}
              style={{
                background: isSelected ? 'rgba(255,255,255,0.09)' : '#1a1a1a',
                border: isSelected ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.07)',
                transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: isSelected ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
                transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
              }}
              className="text-left p-4 rounded-xl active:scale-[0.97] hover:border-white/15 hover:bg-[#1f1f1f]"
            >
              <Icon
                size={17}
                className={`mb-3.5 transition-colors duration-150 ${isSelected ? 'text-white' : 'text-[#444]'}`}
              />
              <div className={`font-semibold text-sm mb-1 tracking-tight ${isSelected ? 'text-white' : 'text-[#bbb]'}`}>
                {type.name}
              </div>
              <div className="text-xs text-[#555] mb-3 hidden sm:block leading-relaxed font-light">
                {type.description}
              </div>
              <div className={`text-xs font-medium ${isSelected ? 'text-white/60' : 'text-[#444]'}`}>
                ${type.baseHourlyRate}/h
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
