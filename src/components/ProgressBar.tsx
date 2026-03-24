interface Props {
  currentStep: number
  totalSteps: number
  label?: string
}

export function ProgressBar({ currentStep, totalSteps, label }: Props) {
  return (
    <div className="mb-8">
      {label && (
        <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest text-center mb-3">
          {label}
        </p>
      )}
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'bg-violet-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
