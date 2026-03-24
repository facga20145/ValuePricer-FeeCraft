import { useState } from 'react'

interface Props {
  hours: number
  riskBuffer: number
  onHoursChange: (hours: number) => void
  onBufferChange: (buffer: number) => void
}

const BUFFER_OPTIONS = [
  { value: 0,  label: '+0%'  },
  { value: 10, label: '+10%' },
  { value: 20, label: '+20%', recommended: true },
  { value: 30, label: '+30%' },
  { value: 50, label: '+50%' },
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
    <div className="max-w-lg mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">Horas estimadas</h2>
      <p className="text-[#666] text-sm mb-8 font-light">¿Cuántas horas tomará el proyecto?</p>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => onHoursChange(clamp(hours - 10))}
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.15s ease' }}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-[#666] text-xl hover:text-white hover:border-white/25 hover:bg-[#222] active:scale-95 shrink-0 select-none"
          >
            −
          </button>

          <div
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.15s ease' }}
            className="flex-1 h-11 flex items-center justify-center rounded-lg cursor-text hover:border-white/20"
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
                className="w-full bg-transparent text-center text-xl font-bold text-white outline-none tracking-tight"
              />
            ) : (
              <span className={`text-xl font-bold tracking-tight ${hours > 0 ? 'text-white' : 'text-[#333]'}`}>
                {hours > 0 ? `${hours}h` : '—'}
              </span>
            )}
          </div>

          <button
            onClick={() => onHoursChange(clamp(hours + 10))}
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.15s ease' }}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-[#666] text-xl hover:text-white hover:border-white/25 hover:bg-[#222] active:scale-95 shrink-0 select-none"
          >
            +
          </button>
        </div>

        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => onHoursChange(p)}
              style={{
                background: hours === p ? 'rgba(255,255,255,0.09)' : '#1a1a1a',
                border: hours === p ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.15s ease',
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium hover:bg-[#222] ${hours === p ? 'text-white' : 'text-[#777] hover:text-[#bbb]'}`}
            >
              {p}h
            </button>
          ))}
        </div>

        {hours > 0 && riskBuffer > 0 && (
          <p className="text-xs text-[#666] mt-3 font-light">
            Total con buffer: <span className="text-[#bbb]">{totalHours.toFixed(1)}h</span>
          </p>
        )}
      </div>

      <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="text-sm font-semibold text-[#ddd] tracking-tight">Buffer de riesgo</div>
            <div className="text-xs text-[#777] mt-0.5 font-light">Margen para imprevistos</div>
          </div>
          {BUFFER_OPTIONS.find(o => o.value === riskBuffer)?.recommended && (
            <span className="text-[10px] text-[#777] uppercase tracking-widest font-medium">recomendado</span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {BUFFER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onBufferChange(option.value)}
              style={{
                background: riskBuffer === option.value ? 'rgba(255,255,255,0.09)' : '#1a1a1a',
                border: riskBuffer === option.value ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.15s ease',
              }}
              className={`py-2.5 rounded-lg text-xs font-medium hover:bg-[#222] ${riskBuffer === option.value ? 'text-white' : 'text-[#777] hover:text-[#bbb]'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
