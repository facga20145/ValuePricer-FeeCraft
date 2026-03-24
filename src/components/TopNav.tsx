interface Props {
  currentStep: number
  onStepClick: (step: number) => void
  completedSteps: number[]
}

const STEPS = ['Proyecto', 'Horas', 'Valor', 'Resultado']

export function TopNav({ currentStep, onStepClick, completedSteps }: Props) {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
      <span className="text-white font-bold text-base sm:text-lg tracking-tight">ValuePricer</span>

      <div className="hidden sm:flex items-center gap-4 lg:gap-6">
        {STEPS.map((label, i) => {
          const isActive = i === currentStep
          const isAccessible = i === 0 || completedSteps.includes(i - 1)
          return (
            <button
              key={i}
              onClick={() => isAccessible && onStepClick(i)}
              disabled={!isAccessible}
              className={`text-sm font-medium pb-1 transition-all border-b-2 ${
                isActive
                  ? 'text-violet-400 border-violet-400'
                  : isAccessible
                  ? 'text-slate-400 border-transparent hover:text-slate-200'
                  : 'text-slate-600 border-transparent cursor-not-allowed'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex sm:hidden items-center gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentStep
                ? 'w-5 bg-violet-400'
                : i < currentStep
                ? 'w-2 bg-violet-600'
                : 'w-2 bg-white/10'
            }`}
          />
        ))}
        <span className="ml-2 text-xs text-slate-400 font-medium">{STEPS[currentStep]}</span>
      </div>
    </nav>
  )
}
