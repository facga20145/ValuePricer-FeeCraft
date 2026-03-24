import { Check } from 'lucide-react'

interface Props {
  currentStep: number
  totalSteps: number
  label?: string
}

const LABELS = ['Proyecto', 'Horas', 'Valor', 'Resultado']

export function ProgressBar({ currentStep, totalSteps }: Props) {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isDone   = i < currentStep
          const isActive = i === currentStep

          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  style={{
                    width: 32, height: 32,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    background: isDone ? '#fff' : isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: isDone ? '1px solid #fff' : isActive ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    color: isDone ? '#000' : isActive ? '#fff' : '#333',
                    boxShadow: isActive ? '0 0 0 3px rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  {isDone ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                    color: isActive ? '#fff' : isDone ? '#444' : '#2a2a2a',
                    transition: 'color 0.25s ease',
                  }}
                  className="hidden sm:block"
                >
                  {LABELS[i]}
                </span>
              </div>

              {i < totalSteps - 1 && (
                <div
                  className="w-10 sm:w-16 md:w-24 mx-2 mb-0 sm:mb-5"
                  style={{
                    height: 1,
                    background: isDone ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.06)',
                    transition: 'background 0.3s ease',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="sm:hidden text-center mt-3">
        <span style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {LABELS[currentStep]}
        </span>
      </div>
    </div>
  )
}
