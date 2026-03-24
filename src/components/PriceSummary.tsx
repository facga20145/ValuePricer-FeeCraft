import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import type { PriceResult, CalculatorState } from '../types'
import { formatCurrency } from '../utils/calculator'
import { exportToPdf } from '../utils/exportPdf'

interface Props {
  result: PriceResult
  state: CalculatorState
  onSave: () => void
}

export function PriceSummary({ result, state, onSave }: Props) {
  const { suggestedPrice, minPrice, maxPrice, breakdown, valueMultiplier } = result
  const [copied, setCopied] = useState(false)

  const projectName = state.projectType!.name
  const totalHours = state.estimatedHours * (1 + state.riskBuffer / 100)
  const rangePercent = ((suggestedPrice - minPrice) / (maxPrice - minPrice)) * 100
  const marginProtected = Math.round(((suggestedPrice - minPrice) / suggestedPrice) * 100)

  const handleCopy = async () => {
    const text = [
      `Cotización — ${projectName}`,
      ``,
      `Precio sugerido: ${formatCurrency(suggestedPrice)}`,
      `Rango: ${formatCurrency(minPrice)} — ${formatCurrency(maxPrice)}`,
      ``,
      `Desglose:`,
      ...breakdown.map((item) =>
        `  • ${item.label}: ${item.isMultiplier && item.amount > 0 ? '+' : ''}${formatCurrency(item.amount)}`
      ),
      ``,
      `Horas totales: ${totalHours.toFixed(1)}h (incluye +${state.riskBuffer}% buffer)`,
      `Multiplicador de valor: ×${valueMultiplier}`,
      ``,
      `Generado con ValuePricer · FeeCraft`,
    ].join('\n')

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportPdf = () => {
    exportToPdf(state, result)
    onSave()
  }

  return (
    <div className="price-reveal">
      <div className="mb-10 sm:mb-12 pb-10 sm:pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="text-[10px] text-[#666] uppercase tracking-widest mb-4 font-medium">Precio sugerido</div>
        <div className="text-6xl sm:text-7xl font-bold text-white tracking-tighter mb-2 leading-none">
          {formatCurrency(suggestedPrice)}
        </div>
        <div className="text-[#555] text-sm font-light mt-2">{projectName}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-8">
        <div>
          <div className="text-[10px] text-[#666] uppercase tracking-widest mb-5 font-medium">Rango de negociación</div>
          <div className="flex justify-between text-sm text-[#888] mb-4 font-light">
            <span>{formatCurrency(minPrice)}</span>
            <span>{formatCurrency(maxPrice)}</span>
          </div>
          <div className="relative h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${rangePercent}%`,
                background: 'rgba(255,255,255,0.5)',
                transition: 'width 0.3s ease',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${rangePercent}%`, transition: 'left 0.3s ease' }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-lg shadow-white/20" style={{ marginTop: 0 }} />
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-black text-xs font-bold whitespace-nowrap tracking-tight px-2 py-0.5 rounded-md bg-white"
              >
                {formatCurrency(suggestedPrice)}
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            {[
              { label: 'Margen protegido', value: `${marginProtected}%` },
              { label: 'Horas totales',    value: `${totalHours.toFixed(1)}h` },
              { label: 'Multiplicador',    value: `×${valueMultiplier}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-[#666] font-light">{label}</span>
                <span className="text-xs text-[#aaa] font-medium tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#666] uppercase tracking-widest mb-5 font-medium">Desglose</div>
          <div className="space-y-3.5">
            {breakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-start">
                <span className="text-sm text-[#888] font-light">{item.label}</span>
                <span className={`text-sm font-semibold tabular-nums tracking-tight ${item.isMultiplier && item.amount > 0 ? 'text-white' : 'text-[#aaa]'}`}>
                  {item.isMultiplier && item.amount > 0 ? '+' : ''}
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm font-semibold text-[#aaa] tracking-tight">Total</span>
              <span className="text-base font-bold text-white tabular-nums tracking-tight">{formatCurrency(suggestedPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleExportPdf}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
        >
          <FileText size={14} strokeWidth={2} />
          Exportar PDF
        </button>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
            border: copied ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.2s ease',
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium active:scale-[0.98] ${copied ? 'text-white' : 'text-[#555] hover:text-[#aaa]'}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado' : 'Copiar propuesta'}
        </button>
      </div>
    </div>
  )
}
