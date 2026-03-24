import { useState } from 'react'
import { Info } from 'lucide-react'

interface Props {
  hours: number
  riskBuffer: number
  onHoursChange: (hours: number) => void
  onBufferChange: (buffer: number) => void
}

const BUFFER_OPTIONS = [
  { value: 0,  label: 'Cero',   sublabel: '+0%'  },
  { value: 10, label: 'Leve',   sublabel: '+10%' },
  { value: 20, label: 'Seguro', sublabel: '+20%', recommended: true },
  { value: 30, label: 'Amplio', sublabel: '+30%' },
  { value: 50, label: 'Máximo', sublabel: '+50%' },
]

const PRESETS = [20, 40, 80, 160]

export function HoursEstimator({ hours, riskBuffer, onHoursChange, onBufferChange }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const totalHours = hours * (1 + riskBuffer / 100)

  const clamp = (v: number) => Math.min(2000, Math.max(1, v))

  const commitDraft = () => {
    const parsed = parseInt(draft)
    if (!isNaN(parsed) && parsed > 0) onHoursChange(clamp(parsed))
    setEditing(false)
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Estimación de horas</h2>
      <p className="text-slate-400 text-sm mb-8">Cuántas horas crees que tomará el proyecto</p>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Horas estimadas
        </label>

        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => onHoursChange(clamp(hours - 10))}
            className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-slate-300 text-2xl font-light hover:bg-white/[0.1] hover:border-violet-500/50 active:scale-95 transition-all shrink-0 select-none"
          >
            −
          </button>

          <div
            className="flex-1 h-14 flex items-center justify-center rounded-2xl bg-white/[0.05] border border-white/[0.1] cursor-text hover:border-violet-500/50 transition-all"
            onClick={() => { setDraft(hours > 0 ? String(hours) : ''); setEditing(true) }}
          >
            {editing ? (
              <input
                autoFocus
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={draft}
                onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
                onBlur={commitDraft}
                onKeyDown={(e) => e.key === 'Enter' && commitDraft()}
                className="w-full bg-transparent text-center text-2xl font-bold text-white outline-none"
              />
            ) : (
              <span className={`text-2xl font-bold ${hours > 0 ? 'text-white' : 'text-slate-600'}`}>
                {hours > 0 ? hours : '—'}
              </span>
            )}
          </div>

          <button
            onClick={() => onHoursChange(clamp(hours + 10))}
            className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-slate-300 text-2xl font-light hover:bg-white/[0.1] hover:border-violet-500/50 active:scale-95 transition-all shrink-0 select-none"
          >
            +
          </button>
        </div>

        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => onHoursChange(p)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                hours === p
                  ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                  : 'border-white/[0.08] bg-white/[0.03] text-slate-500 hover:border-white/20 hover:text-slate-300'
              }`}
            >
              {p}h
            </button>
          ))}
        </div>

        {hours > 0 && riskBuffer > 0 && (
          <p className="text-xs text-slate-500 mt-3">
            Total con buffer: <span className="text-violet-400 font-semibold">{totalHours.toFixed(1)}h</span>
          </p>
        )}
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold text-white">Buffer de riesgo</div>
            <div className="text-xs text-slate-400">Margen de seguridad para imprevistos</div>
          </div>
          {BUFFER_OPTIONS.find(o => o.value === riskBuffer)?.recommended && (
            <span className="text-xs bg-violet-500 text-white px-3 py-1 rounded-full font-medium">
              +{riskBuffer}% recomendado
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {BUFFER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onBufferChange(option.value)}
              className={`flex flex-col items-center py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl border transition-all ${
                riskBuffer === option.value
                  ? 'border-violet-500 bg-violet-500/20 text-white'
                  : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="text-[10px] sm:text-xs mb-1 leading-none">{option.label}</span>
              <span className={`text-xs sm:text-sm font-bold ${riskBuffer === option.value ? 'text-violet-300' : ''}`}>
                {option.sublabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 italic leading-relaxed">
          Consejo: La mayoría de los proyectos creativos suelen exceder un 15% el tiempo estimado
          inicialmente. El buffer del 20% te protege ante cambios menores del cliente.
        </p>
      </div>
    </div>
  )
}
