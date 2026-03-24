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

export function HoursEstimator({ hours, riskBuffer, onHoursChange, onBufferChange }: Props) {
  const totalHours = hours * (1 + riskBuffer / 100)

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Estimación de horas</h2>
      <p className="text-slate-400 text-sm mb-8">Cuántas horas crees que tomará el proyecto</p>

      {/* Hours input */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Horas estimadas
        </label>
        <div className="relative">
          <input
            type="number"
            min={1}
            max={2000}
            value={hours || ''}
            onChange={(e) => onHoursChange(Math.max(1, parseInt(e.target.value) || 0))}
            placeholder="Ej: 80"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-4 text-lg text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">horas</span>
        </div>
        {hours > 0 && riskBuffer > 0 && (
          <p className="text-xs text-slate-500 mt-2">
            Total con buffer: <span className="text-violet-400 font-semibold">{totalHours.toFixed(1)}h</span>
          </p>
        )}
      </div>

      {/* Buffer section */}
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

      {/* Tip */}
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
