import { TrendingUp } from 'lucide-react'
import type { ValueLevers as ValueLeversType } from '../types'
import { formatCurrency } from '../utils/calculator'

interface Props {
  levers: ValueLeversType
  onChange: (levers: ValueLeversType) => void
  previewPrice?: number
  valueMultiplier?: number
}

const LEVERS = [
  {
    key: 'businessImpact' as const,
    label: 'Impacto al negocio',
    description: '¿Cuánto dinero genera o ahorra este proyecto al cliente?',
    low: 'Bajo', mid: 'Moderado', high: 'Alto',
  },
  {
    key: 'strategicValue' as const,
    label: 'Valor estratégico',
    description: '¿Es crítico para el negocio o solo sería bueno tenerlo?',
    low: 'Nice-to-have', mid: 'Importante', high: 'Crítico',
  },
  {
    key: 'urgency' as const,
    label: 'Urgencia',
    description: '¿Qué tan pronto necesita el cliente el resultado?',
    low: 'Sin prisa', mid: 'Moderado', high: 'Urgente',
  },
  {
    key: 'exclusivity' as const,
    label: 'Exclusividad',
    description: '¿Puede cualquiera hacer esto o eres la persona indicada?',
    low: 'Cualquiera', mid: 'Especializado', high: 'Solo tú',
  },
]

const BADGE: Record<number, { label: string; color: string }> = {
  1: { label: 'Muy bajo',    color: 'bg-slate-600 text-slate-300' },
  2: { label: 'Bajo',        color: 'bg-slate-500/80 text-slate-200' },
  3: { label: 'Equilibrado', color: 'bg-violet-600/70 text-violet-200' },
  4: { label: 'Alto',        color: 'bg-violet-600 text-white' },
  5: { label: 'Máximo',      color: 'bg-violet-500 text-white' },
}

export function ValueLevers({ levers, onChange, previewPrice, valueMultiplier }: Props) {
  const handleChange = (key: keyof ValueLeversType, value: number) => {
    onChange({ ...levers, [key]: value })
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">¿Cuánto valor entregas?</h2>
      <p className="text-slate-400 text-sm mb-6 sm:mb-8 text-center">
        Estos factores ajustan el precio más allá del tiempo invertido para capturar el valor real de tu trabajo.
      </p>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-6">
        {LEVERS.map(({ key, label, description, low, mid, high }) => {
          const val = levers[key]
          const badge = BADGE[val]
          const fillPct = ((val - 1) / 4) * 100

          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-xs text-slate-500 mt-0.5 hidden sm:block">{description}</div>
                </div>
                <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 shrink-0 ml-3 ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={val}
                onChange={(e) => handleChange(key, parseInt(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #7c3aed ${fillPct}%, #2d3148 ${fillPct}%)`,
                }}
                className="w-full"
              />

              <div className="flex justify-between text-[10px] font-semibold text-slate-600 uppercase tracking-wider mt-1.5">
                <span>{low}</span>
                <span>{mid}</span>
                <span>{high}</span>
              </div>
            </div>
          )
        })}
      </div>

      {previewPrice !== undefined && valueMultiplier !== undefined && (
        <div className="mt-4 bg-gradient-to-r from-violet-600/20 to-violet-800/10 border border-violet-500/30 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-violet-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-0.5">Precio estimado</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(previewPrice)}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Multiplicador</div>
            <div className="text-xl font-bold text-violet-300">×{valueMultiplier}</div>
          </div>
        </div>
      )}
    </div>
  )
}
