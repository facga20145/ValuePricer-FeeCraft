interface Props {
  currentStep: number
  onStepClick: (step: number) => void
  completedSteps: number[]
}

const STEPS = ['Proyecto', 'Horas', 'Valor', 'Resultado']

export function TopNav({ currentStep, onStepClick, completedSteps }: Props) {
  return (
    <nav
      className="flex items-center justify-between px-4 sm:px-8 py-4"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <span className="text-white font-semibold text-sm tracking-tight">ValuePricer</span>

      <div className="hidden sm:flex items-center gap-0.5">
        {STEPS.map((label, i) => {
          const isActive = i === currentStep
          const isAccessible = i === 0 || completedSteps.includes(i - 1)
          return (
            <button
              key={i}
              onClick={() => isAccessible && onStepClick(i)}
              disabled={!isAccessible}
              style={{ transition: 'all 0.15s ease' }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                isActive
                  ? 'text-white bg-white/[0.07]'
                  : isAccessible
                  ? 'text-[#444] hover:text-[#888] hover:bg-white/[0.03]'
                  : 'text-[#222] cursor-not-allowed'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex sm:hidden items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{ transition: 'all 0.3s ease' }}
            className={`h-px rounded-full ${
              i === currentStep ? 'w-6 bg-white' : i < currentStep ? 'w-3 bg-white/30' : 'w-3 bg-white/10'
            }`}
          />
        ))}
        <span className="ml-1 text-[11px] text-[#444] font-medium">{STEPS[currentStep]}</span>
      </div>
    </nav>
  )
}
