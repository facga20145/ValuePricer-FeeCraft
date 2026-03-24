interface Step {
  label: string
  completed: boolean
}

interface Props {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: Props) {
  return (
    <div className="flex items-center justify-center mb-8 px-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                index === currentStep
                  ? 'bg-violet-500 text-white shadow-md shadow-violet-200'
                  : step.completed
                  ? 'bg-violet-200 text-violet-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step.completed && index !== currentStep ? '\u2713' : index + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium whitespace-nowrap hidden sm:block ${
                index === currentStep ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 mb-0 sm:mb-4 transition-all ${
                step.completed ? 'bg-violet-300' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
