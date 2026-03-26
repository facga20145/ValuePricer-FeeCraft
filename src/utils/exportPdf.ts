import { jsPDF } from 'jspdf'
import type { CalculatorState, PriceResult } from '../types'
import { formatCurrency } from './calculator'

const BLACK  = [10, 10, 10]   as const
const DARK   = [30, 30, 30]   as const
const MID    = [100, 100, 100] as const
const LIGHT  = [180, 180, 180] as const
const RULE   = [220, 220, 220] as const

function rule(doc: jsPDF, y: number, x1 = 20, x2 = 190) {
  doc.setDrawColor(...RULE)
  doc.setLineWidth(0.25)
  doc.line(x1, y, x2, y)
}

function label(doc: jsPDF, text: string, x: number, y: number) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...LIGHT)
  doc.text(text.toUpperCase(), x, y)
}

function value(doc: jsPDF, text: string, x: number, y: number, align: 'left' | 'right' = 'left') {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...DARK)
  doc.text(text, x, y, { align })
}

export function exportToPdf(state: CalculatorState, result: PriceResult) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const { projectType, estimatedHours, riskBuffer, valueLevers } = state
  const { suggestedPrice, minPrice, maxPrice, basePrice, valueMultiplier, breakdown } = result
  const totalHours = estimatedHours * (1 + riskBuffer / 100)
  const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...BLACK)
  doc.text('ValuePricer', 20, 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MID)
  doc.text(`Fecha: ${date}`, 190, 22, { align: 'right' })

  rule(doc, 28)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...LIGHT)
  doc.text('COTIZACIÓN', 20, 38)
  doc.text(projectType!.name.toUpperCase(), 190, 38, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(34)
  doc.setTextColor(...BLACK)
  doc.text(formatCurrency(suggestedPrice), 20, 55)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...MID)
  doc.text(`Rango  ${formatCurrency(minPrice)} — ${formatCurrency(maxPrice)}`, 20, 63)
  doc.text(`Multiplicador ×${valueMultiplier}`, 190, 63, { align: 'right' })

  rule(doc, 72)

  let y = 84

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...BLACK)
  doc.text('DESGLOSE', 20, y - 6)

  breakdown.forEach((item) => {
    label(doc, item.label, 20, y)
    const amount = `${item.isMultiplier && item.amount > 0 ? '+' : ''}${formatCurrency(item.amount)}`
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(item.isMultiplier && item.amount > 0 ? 50 : 30, 30, 30)
    doc.text(amount, 190, y, { align: 'right' })
    y += 10
  })

  rule(doc, y)
  y += 7

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...BLACK)
  doc.text('Total', 20, y)
  doc.text(formatCurrency(suggestedPrice), 190, y, { align: 'right' })

  y += 18
  rule(doc, y - 6)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...BLACK)
  doc.text('HORAS', 20, y)

  y += 10
  const hoursRows = [
    ['Estimadas', `${estimatedHours}h`],
    ['Buffer de riesgo', `+${riskBuffer}%`],
    ['Total con buffer', `${totalHours.toFixed(1)}h`],
    ['Tarifa base', `$${projectType!.baseHourlyRate}/h`],
    ['Coste base (tiempo)', formatCurrency(basePrice)],
  ]

  hoursRows.forEach((row) => {
    label(doc, row[0], 20, y)
    value(doc, row[1], 190, y, 'right')
    y += 9
  })

  y += 8
  rule(doc, y - 4)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...BLACK)
  doc.text('FACTORES DE VALOR', 20, y + 4)

  y += 14
  const levers = [
    { label: 'Impacto al negocio', v: valueLevers.businessImpact },
    { label: 'Valor estratégico',  v: valueLevers.strategicValue },
    { label: 'Urgencia',           v: valueLevers.urgency },
    { label: 'Exclusividad',       v: valueLevers.exclusivity },
  ]

  levers.forEach((lever) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...MID)
    doc.text(lever.label, 20, y)

    doc.setFillColor(...RULE)
    doc.rect(80, y - 3, 90, 2, 'F')

    doc.setFillColor(...DARK)
    doc.rect(80, y - 3, (90 * lever.v) / 5, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...DARK)
    doc.text(`${lever.v}/5`, 190, y, { align: 'right' })

    y += 10
  })

  rule(doc, 278)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...LIGHT)
  doc.text('ValuePricer · FeeCraft', 20, 285)
  doc.text('Precio basado en valor, no en horas', 190, 285, { align: 'right' })

  doc.save(`cotizacion-${projectType!.name.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}
