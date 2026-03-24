import { useState } from 'react'
import { FileText, Copy, Check, Zap, TrendingUp, Shield } from 'lucide-react'
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

  const marginProtected = Math.round(((suggestedPrice - minPrice) / suggestedPrice) * 100)

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">Tu cotización</h1>
      <p className="text-slate-400 text-center text-sm mb-8">
        Basada en el valor que entregas, no solo el tiempo. Hemos calculado el punto de
        equilibrio óptimo para tu proyecto.
      </p>

      {/* Main layout: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Left: Price + Range */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-6">
            <div className="text-xs font-semibold text-violet-300 uppercase tracking-widest mb-3">
              Precio sugerido
            </div>
            <div className="text-6xl font-bold text-white mb-1">
              {formatCurrency(suggestedPrice)}
            </div>
            <div className="text-violet-300 text-sm">{projectName}</div>
          </div>

          {/* Range card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Rango de Negociación</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-slate-300 mb-3">
              <span>{formatCurrency(minPrice)}</span>
              <span>{formatCurrency(maxPrice)}</span>
            </div>
            <div className="relative h-2 rounded-full overflow-visible" style={{ background: 'linear-gradient(to right, #4c1d95 0%, #7c3aed 50%, #4c1d95 100%)' }}>
              <div className="absolute inset-0 bg-white/5 rounded-full" />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                style={{ left: `${rangePercent}%` }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-violet-400 rounded-full border-2 border-white shadow-lg shadow-violet-500/50" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg">
                    {formatCurrency(suggestedPrice)}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              Este rango te permite flexibilidad sin comprometer tu rentabilidad mínima.
            </p>
          </div>
        </div>

        {/* Right: Breakdown + Actions */}
        <div className="space-y-4">
          {/* Breakdown */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.08] flex items-center gap-2">
              <FileText size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Desglose
              </span>
            </div>
            <div className="p-5 space-y-3">
              {breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-slate-300">
                      {item.isMultiplier ? 'Multiplicador de valor' : 'Coste Base (Tiempo)'}
                    </div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                    {item.isMultiplier && (
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full mt-1">
                        ×{valueMultiplier}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-bold ${
                    item.isMultiplier && item.amount > 0 ? 'text-amber-400'
                    : 'text-white'
                  }`}>
                    {item.isMultiplier && item.amount > 0 ? '+' : ''}
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-white/[0.08] flex justify-between">
                <span className="text-sm font-bold text-white">Total sugerido</span>
                <span className="text-sm font-bold text-violet-400">{formatCurrency(suggestedPrice)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleExportPdf}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-semibold text-sm transition-all"
          >
            <FileText size={16} strokeWidth={1.5} />
            Exportar PDF
          </button>
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border font-semibold text-sm transition-all ${
              copied
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-white/[0.1] bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08]'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado' : 'Copiar propuesta'}
          </button>
        </div>
      </div>

      {/* Benefit cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: Zap,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10',
            title: 'Entrega Optimizada',
            desc: 'El cálculo contempla un margen de maniobra para revisiones rápidas.',
          },
          {
            icon: TrendingUp,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            title: 'ROI Proyectado',
            desc: 'Tu tarifa refleja el valor de negocio generado para el cliente.',
          },
          {
            icon: Shield,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            title: 'Tarifa Protegida',
            desc: `Incluso en el rango bajo, mantienes un margen de beneficio del ${marginProtected}%.`,
          },
        ].map(({ icon: Icon, color, bg, title, desc }) => (
          <div key={title} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={14} className={color} />
            </div>
            <div className="text-xs font-semibold text-white mb-1">{title}</div>
            <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
