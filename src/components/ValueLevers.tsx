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
    description: '¿Cuánto dinero genera o ahorra este proyecto?',
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
    description: '¿Puede cualquiera hacer esto o eres tú el indicado?',
    low: 'Cualquiera', mid: 'Especializado', high: 'Solo tú',
  },
]

const LEVEL_LABEL: Record<number, string> = {
  1: 'Muy bajo', 2: 'Bajo', 3: 'Equilibrado', 4: 'Alto', 5: 'Máximo',
}

export function ValueLevers({ levers, onChange, previewPrice, valueMultiplier }: Props) {
  const handleChange = (key: keyof ValueLeversType, value: number) => {
    onChange({ ...levers, [key]: value })
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 tracking-tight">Valor entregado</h2>
      <p className="text-[#555] text-sm mb-8 font-light">
        Ajusta el precio más allá del tiempo invertido.
      </p>

      <div className="space-y-7">
        {LEVERS.map(({ key, label, description, low, mid, high }) => {
          const val = levers[key]
          const fillPct = ((val - 1) / 4) * 100

          return (
            <div key={key}>
              <div className="flex justify-between items-baseline mb-3">
                <div>
                  <span className="text-sm font-semibold text-[#ccc] tracking-tight">{label}</span>
                  <span className="hidden sm:inline text-xs text-[#666] ml-2 font-light">{description}</span>
                </div>
                <span
                  className="text-xs text-[#777] shrink-0 ml-3 tabular-nums"
                  style={{ transition: 'all 0.2s ease' }}
                >
                  {LEVEL_LABEL[val]}
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
                  background: `linear-gradient(to right, rgba(255,255,255,0.8) ${fillPct}%, rgba(255,255,255,0.1) ${fillPct}%)`,
                  transition: 'background 0.15s ease',
                }}
                className="w-full"
              />

              <div className="flex justify-between text-[10px] text-[#555] uppercase tracking-widest mt-2 font-medium">
                <span>{low}</span>
                <span>{mid}</span>
                <span>{high}</span>
              </div>
            </div>
          )
        })}
      </div>

      {previewPrice !== undefined && valueMultiplier !== undefined && (
        <div
          className="mt-8 pt-6 flex items-end justify-between price-reveal"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <div className="text-[10px] text-[#666] uppercase tracking-widest mb-2 font-medium">Precio estimado</div>
            <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {formatCurrency(previewPrice)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#666] uppercase tracking-widest mb-2 font-medium">Multiplicador</div>
            <div className="text-2xl font-light text-[#888] tracking-tight">×{valueMultiplier}</div>
          </div>
        </div>
      )}
    </div>
  )
}
