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
    lowLabel: 'Impacto bajo',
    highLabel: 'Alto impacto',
  },
  {
    key: 'strategicValue' as const,
    label: 'Valor estratégico',
    description: '¿Es crítico para el negocio o solo sería bueno tenerlo?',
    lowLabel: 'Nice-to-have',
    highLabel: 'Crítico',
  },
  {
    key: 'urgency' as const,
    label: 'Urgencia',
    description: '¿Qué tan pronto necesita el cliente el resultado?',
    lowLabel: 'Sin prisa',
    highLabel: 'Urgente',
  },
  {
    key: 'exclusivity' as const,
    label: 'Exclusividad',
    description: '¿Puede cualquiera hacer esto o eres la persona indicada?',
    lowLabel: 'Cualquiera puede',
    highLabel: 'Solo tú',
  },
]

const LEVEL_LABELS: Record<number, string> = {
  1: 'Muy bajo', 2: 'Bajo', 3: 'Medio', 4: 'Alto', 5: 'Muy alto',
}

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-slate-500/80',
  2: 'bg-slate-400/80',
  3: 'bg-violet-500/80',
  4: 'bg-violet-500',
  5: 'bg-violet-600',
}

export function ValueLevers({ levers, onChange, previewPrice, valueMultiplier }: Props) {
  const handleChange = (key: keyof ValueLeversType, value: number) => {
    onChange({ ...levers, [key]: value })
  }

  const getFillStyle = (value: number) => ({
    background: `linear-gradient(to right, #7c3aed ${((value - 1) / 4) * 100}%, #2d3148 ${((value - 1) / 4) * 100}%)`,
  })

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">¿Cuánto valor entregas?</h2>
      <p className="text-slate-400 text-sm mb-6 sm:mb-8">
        Estos factores ajustan el precio más allá del tiempo invertido
      </p>

      <div className="space-y-3 sm:space-y-4">
        {LEVERS.map(({ key, label, description, lowLabel, highLabel }) => (
          <div key={key} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="pr-3">
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5 hidden sm:block">{description}</div>
              </div>
              <span className={`text-xs font-bold text-white ${LEVEL_COLORS[levers[key]]} rounded-full px-2.5 py-0.5 shrink-0`}>
                {LEVEL_LABELS[levers[key]]}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              {[1, 2, 3, 4, 5].map((dot) => (
                <button
                  key={dot}
                  onClick={() => handleChange(key, dot)}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    dot <= levers[key] ? 'bg-violet-500' : 'bg-white/10'
                  }`}
                  aria-label={`${label}: ${dot}`}
                />
              ))}
            </div>

            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={levers[key]}
              onChange={(e) => handleChange(key, parseInt(e.target.value))}
              style={getFillStyle(levers[key])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>{lowLabel}</span>
              <span>{highLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {previewPrice !== undefined && valueMultiplier !== undefined && (
        <div className="mt-5 bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-violet-400 font-medium mb-1">Precio estimado</div>
            <div className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(previewPrice)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Multiplicador</div>
            <div className="text-lg sm:text-xl font-bold text-violet-400">×{valueMultiplier}</div>
          </div>
        </div>
      )}
    </div>
  )
}
