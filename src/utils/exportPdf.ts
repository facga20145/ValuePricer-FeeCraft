import { jsPDF } from 'jspdf'
import type { CalculatorState, PriceResult } from '../types'
import { formatCurrency } from './calculator'

export function exportToPdf(state: CalculatorState, result: PriceResult) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const { projectType, estimatedHours, riskBuffer, valueLevers } = state
  const { suggestedPrice, minPrice, maxPrice, basePrice, valueMultiplier, breakdown } = result
  const totalHours = estimatedHours * (1 + riskBuffer / 100)
  const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  const INK    = [15, 15, 15]   as const
  const SUB    = [80, 80, 80]   as const
  const FAINT  = [160, 160, 160] as const
  const RULE_C = [230, 230, 230] as const

  const hr = (y: number) => {
    doc.setDrawColor(...RULE_C)
    doc.setLineWidth(0.3)
    doc.line(20, y, 190, y)
  }

  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...INK)
  doc.text('ValuePricer', 20, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...SUB)
  doc.text(date, 190, 20, { align: 'right' })

  hr(26)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...FAINT)
  doc.text('COTIZACIÓN', 20, 35)
  doc.text(projectType!.name.toUpperCase(), 190, 35, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(36)
  doc.setTextColor(...INK)
  doc.text(formatCurrency(suggestedPrice), 20, 52)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...SUB)
  doc.text(`Rango  ${formatCurrency(minPrice)} — ${formatCurrency(maxPrice)}`, 20, 60)
  doc.text(`Multiplicador  ×${valueMultiplier}`, 190, 60, { align: 'right' })

  hr(68)

  let y = 80

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...FAINT)
  doc.text('DESGLOSE', 20, y - 5)

  breakdown.forEach((item) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...SUB)
    doc.text(item.label, 20, y)

    const amt = `${item.isMultiplier && item.amount > 0 ? '+' : ''}${formatCurrency(item.amount)}`
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...INK)
    doc.text(amt, 190, y, { align: 'right' })
    y += 10
  })

  hr(y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...INK)
  doc.text('Total', 20, y)
  doc.text(formatCurrency(suggestedPrice), 190, y, { align: 'right' })

  y += 16
  hr(y - 4)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...FAINT)
  doc.text('HORAS', 20, y)

  y += 10
  const hoursRows: [string, string][] = [
    ['Horas estimadas',    `${estimatedHours}h`],
    ['Buffer de riesgo',   `+${riskBuffer}%`],
    ['Total con buffer',   `${totalHours.toFixed(1)}h`],
    ['Tarifa base',        `$${projectType!.baseHourlyRate}/h`],
    ['Coste base (tiempo)', formatCurrency(basePrice)],
  ]

  hoursRows.forEach(([lbl, val]) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...SUB)
    doc.text(lbl, 20, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...INK)
    doc.text(val, 190, y, { align: 'right' })
    y += 9
  })

  y += 8
  hr(y - 4)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...FAINT)
  doc.text('FACTORES DE VALOR', 20, y)

  y += 10
  const levers = [
    { label: 'Impacto al negocio', v: valueLevers.businessImpact },
    { label: 'Valor estratégico',  v: valueLevers.strategicValue },
    { label: 'Urgencia',           v: valueLevers.urgency },
    { label: 'Exclusividad',       v: valueLevers.exclusivity },
  ]

  levers.forEach((lever) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...SUB)
    doc.text(lever.label, 20, y)

    doc.setFillColor(...RULE_C)
    doc.rect(100, y - 3.5, 70, 2, 'F')
    doc.setFillColor(...INK)
    doc.rect(100, y - 3.5, (70 * lever.v) / 5, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...INK)
    doc.text(`${lever.v} / 5`, 190, y, { align: 'right' })
    y += 10
  })

  hr(277)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...FAINT)
  doc.text('ValuePricer · FeeCraft', 20, 284)
  doc.text('Precio basado en valor, no en horas', 190, 284, { align: 'right' })

  doc.save(`cotizacion-${projectType!.name.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}
