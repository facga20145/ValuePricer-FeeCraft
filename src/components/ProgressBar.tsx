import { Check } from 'lucide-react'

interface Props {
  currentStep: number
  totalSteps: number
  label?: string
}

const LABELS = ['Proyecto', 'Horas', 'Valor', 'Resultado']

export function ProgressBar({ currentStep, totalSteps }: Props) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isDone   = i < currentStep
          const isActive = i === currentStep

          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all duration-300 ${
                    isDone
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : isActive
                      ? 'bg-transparent border-violet-500 text-violet-400'
                      : 'bg-transparent border-white/10 text-slate-600'
                  }`}
                >
                  {isDone ? <Check size={12} strokeWidth={2.5} /> : i + 1}
                </div>
                <span
                  className={`hidden sm:block text-[10px] font-semibold uppercase tracking-widest ${
                    isActive ? 'text-violet-400' : isDone ? 'text-slate-500' : 'text-slate-700'
                  }`}
                >
                  {LABELS[i]}
                </span>
              </div>

              {i < totalSteps - 1 && (
                <div
                  className="w-8 sm:w-16 md:w-20 h-px mx-1.5 sm:mx-2 mb-0 sm:mb-5 transition-all duration-500"
                  style={{
                    background: isDone ? '#7c3aed' : 'rgba(255,255,255,0.08)',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="sm:hidden text-center mt-2">
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
          {LABELS[currentStep]}
        </span>
      </div>
    </div>
  )
}
