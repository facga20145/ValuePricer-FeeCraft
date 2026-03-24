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
    <div className="min-h-screen bg-[#080808] flex flex-col">
      <TopNav
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        completedSteps={completedSteps}
      />

      <main className="flex-1 px-3 sm:px-6 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto">

          {history.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="text-xs text-[#555] hover:text-[#999] transition-colors"
              >
                {showHistory ? 'cerrar historial' : `historial (${history.length})`}
              </button>
            </div>
          )}

          {showHistory && (
            <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#555] uppercase tracking-widest">Recientes</span>
                <button
                  onClick={() => { clearHistory(); setHistory([]); setShowHistory(false) }}
                  className="text-xs text-[#555] hover:text-red-400 transition-colors"
                >
                  borrar
                </button>
              </div>
              <div className="space-y-1">
                {history.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => handleLoadQuote(quote)}
                    className="w-full text-left flex justify-between items-center px-2 py-2 rounded hover:bg-white/[0.03] transition-colors"
                  >
                    <div>
                      <div className="text-sm text-[#ccc]">{quote.projectName}</div>
                      <div className="text-xs text-[#444]">{quote.date}</div>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(quote.suggestedPrice)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            className="rounded-xl p-4 sm:p-8"
            style={{
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <ProgressBar currentStep={currentStep} totalSteps={4} />
            <div key={currentStep} className="step-enter">
              {currentStep === 0 && (
                <ProjectTypeSelector
                  selected={state.projectType}
                  onSelect={(type: ProjectType) => {
                    setState((s) => ({ ...s, projectType: type }))
                    setTimeout(() => setCurrentStep(1), 300)
                  }}
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
          </div>

          <div className="flex items-center justify-between mt-4 px-1 pb-24 sm:pb-0">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#555] hover:text-[#999] transition-colors"
              >
                <ArrowLeft size={14} />
                Atrás
              </button>
            ) : <div />}

            <span className="text-xs text-[#333] tracking-widest">
              {currentStep < 3 ? `${currentStep + 1} / 4` : ''}
            </span>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-2 rounded-lg border border-[#2a2a2a] text-[#888] text-sm hover:border-[#444] hover:text-white transition-all"
              >
                Nueva cotización
              </button>
            )}
          </div>

          <div className="fixed sm:hidden bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-[#0a0a0a]/95 backdrop-blur border-t border-[#1a1a1a] flex items-center justify-between gap-3 z-50">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#555]"
              >
                <ArrowLeft size={14} />
                Atrás
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-black text-sm font-semibold disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#2a2a2a] text-[#888] text-sm"
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
