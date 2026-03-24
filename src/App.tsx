import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { CalculatorState, ProjectType, ValueLevers } from './types'
import { calculatePrice } from './utils/calculator'
import { saveQuote, getHistory, clearHistory } from './utils/storage'
import type { SavedQuote } from './utils/storage'
import { TopNav } from './components/TopNav'
import { ProgressBar } from './components/ProgressBar'
import { ProjectTypeSelector } from './components/ProjectTypeSelector'
import { HoursEstimator } from './components/HoursEstimator'
import { ValueLevers as ValueLeversComponent } from './components/ValueLevers'
import { PriceSummary } from './components/PriceSummary'

const INITIAL_STATE: CalculatorState = {
  projectType: null,
  estimatedHours: 0,
  riskBuffer: 20,
  valueLevers: {
    businessImpact: 3,
    urgency: 2,
    exclusivity: 3,
    strategicValue: 3,
  },
}

const STEP_LABELS = ['Proyecto', 'Horas', 'Valor', 'Resultado']

export default function App() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE)
  const [currentStep, setCurrentStep] = useState(0)
  const [history, setHistory] = useState<SavedQuote[]>(getHistory)
  const [showHistory, setShowHistory] = useState(false)

  const result = calculatePrice(state)
  const completedSteps = Array.from({ length: currentStep }, (_, i) => i)

  const canAdvance = () => {
    if (currentStep === 0) return state.projectType !== null
    if (currentStep === 1) return state.estimatedHours > 0
    return true
  }

  const handleSave = () => {
    if (result) {
      saveQuote(state, result.suggestedPrice)
      setHistory(getHistory())
    }
  }

  const handleLoadQuote = (quote: SavedQuote) => {
    setState(quote.state)
    setCurrentStep(3)
    setShowHistory(false)
  }

  const reset = () => {
    setState(INITIAL_STATE)
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      <TopNav
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        completedSteps={completedSteps}
      />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {history.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-2 text-xs bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-all border border-white/[0.08]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                {showHistory ? 'Cerrar historial' : `Historial (${history.length})`}
              </button>
            </div>
          )}

          {showHistory && (
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Cotizaciones recientes</h3>
                <button
                  onClick={() => { clearHistory(); setHistory([]); setShowHistory(false) }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Borrar todo
                </button>
              </div>
              <div className="space-y-2">
                {history.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => handleLoadQuote(quote)}
                    className="w-full text-left flex justify-between items-center px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{quote.projectName}</div>
                      <div className="text-xs text-slate-500">{quote.date}</div>
                    </div>
                    <div className="text-sm font-bold text-violet-400">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(quote.suggestedPrice)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#161922] border border-white/[0.06] rounded-3xl p-4 sm:p-8">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={4}
              label={currentStep === 3 ? `PASO 4: ${STEP_LABELS[3].toUpperCase()}` : undefined}
            />

            {currentStep === 0 && (
              <ProjectTypeSelector
                selected={state.projectType}
                onSelect={(type: ProjectType) => setState((s) => ({ ...s, projectType: type }))}
              />
            )}

            {currentStep === 1 && (
              <HoursEstimator
                hours={state.estimatedHours}
                riskBuffer={state.riskBuffer}
                onHoursChange={(h) => setState((s) => ({ ...s, estimatedHours: h }))}
                onBufferChange={(b) => setState((s) => ({ ...s, riskBuffer: b }))}
              />
            )}

            {currentStep === 2 && (
              <ValueLeversComponent
                levers={state.valueLevers}
                onChange={(levers: ValueLevers) => setState((s) => ({ ...s, valueLevers: levers }))}
                previewPrice={result?.suggestedPrice}
                valueMultiplier={result?.valueMultiplier}
              />
            )}

            {currentStep === 3 && result && (
              <PriceSummary result={result} state={state} onSave={handleSave} />
            )}
          </div>

          <div className="flex items-center justify-between mt-6 px-1">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.06] text-slate-300 text-sm font-medium hover:bg-white/[0.1] transition-all"
              >
                <ArrowLeft size={16} />
                Atrás
              </button>
            ) : (
              <div />
            )}

            <span className="text-xs text-slate-600 font-medium">
              {currentStep < 3 ? `PASO ${currentStep + 1} DE 4` : ''}
            </span>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] text-slate-300 text-sm font-semibold hover:bg-white/[0.1] transition-all"
              >
                Nueva cotización
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
