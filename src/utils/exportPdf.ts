import { jsPDF } from 'jspdf'
import type { CalculatorState, PriceResult } from '../types'
import { formatCurrency } from './calculator'

export function exportToPdf(state: CalculatorState, result: PriceResult) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const { projectType, estimatedHours, riskBuffer, valueLevers } = state
  const { suggestedPrice, minPrice, maxPrice, basePrice, valueMultiplier, breakdown } = result

  const totalHours = estimatedHours * (1 + riskBuffer / 100)

  const violet = [109, 40, 217] as const
  const violetLight = [139, 92, 246] as const
  const gray = [107, 114, 128] as const
  const dark = [17, 24, 39] as const
  const white = [255, 255, 255] as const

  doc.setFillColor(...violet)
  doc.rect(0, 0, 210, 46, 'F')

  doc.setFillColor(...violetLight)
  doc.rect(0, 38, 210, 8, 'F')

  doc.setTextColor(...white)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('ValuePricer', 20, 20)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(196, 181, 253)
  doc.text('FeeCraft — Precio basado en valor, no en horas', 20, 28)
  doc.text(`Generado el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, 20, 35)

  doc.setTextColor(...white)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(projectType!.name.toUpperCase(), 155, 28, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(196, 181, 253)
  doc.text(`$${projectType!.baseHourlyRate}/h base`, 155, 35, { align: 'right' })

  doc.setFillColor(245, 243, 255)
  doc.roundedRect(15, 54, 180, 36, 5, 5, 'F')
  doc.setDrawColor(...violetLight)
  doc.roundedRect(15, 54, 180, 36, 5, 5, 'S')

  doc.setTextColor(...violet)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('PRECIO SUGERIDO', 25, 64)

  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.text(formatCurrency(suggestedPrice), 25, 79)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.text('Rango de negociación', 125, 64)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...dark)
  doc.text(`${formatCurrency(minPrice)} — ${formatCurrency(maxPrice)}`, 125, 72)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...violet)
  doc.text(`Multiplicador ×${valueMultiplier}`, 125, 80)

  let y = 104
  doc.setTextColor(...dark)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Desglose del precio', 15, y)
  doc.setDrawColor(229, 231, 235)
  doc.line(15, y + 4, 195, y + 4)

  y += 14
  doc.setFontSize(9)

  breakdown.forEach((item) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text(item.label, 15, y)

    const amountStr = `${item.isMultiplier && item.amount > 0 ? '+' : ''}${formatCurrency(item.amount)}`
    doc.setFont('helvetica', 'bold')

    if (item.isMultiplier && item.amount > 0) {
      doc.setTextColor(22, 163, 74)
    } else if (item.isMultiplier && item.amount < 0) {
      doc.setTextColor(220, 38, 38)
    } else {
      doc.setTextColor(...dark)
    }

    doc.text(amountStr, 195, y, { align: 'right' })
    y += 9
  })

  doc.setDrawColor(229, 231, 235)
  doc.line(15, y, 195, y)
  y += 7

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...dark)
  doc.text('Total sugerido', 15, y)
  doc.setTextColor(...violet)
  doc.text(formatCurrency(suggestedPrice), 195, y, { align: 'right' })

  y += 18
  doc.setTextColor(...dark)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Estimación de horas', 15, y)
  doc.setDrawColor(229, 231, 235)
  doc.line(15, y + 4, 195, y + 4)

  y += 14
  doc.setFontSize(9)

  const hoursData = [
    ['Horas estimadas', `${estimatedHours}h`],
    ['Buffer de riesgo', `+${riskBuffer}%`],
    ['Total con buffer', `${totalHours.toFixed(1)}h`],
  ]
  const rateData = [
    ['Tarifa base', `$${projectType!.baseHourlyRate}/h`],
    ['Precio base (tiempo)', formatCurrency(basePrice)],
  ]

  hoursData.forEach((row, i) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text(row[0], 15, y + i * 8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...dark)
    doc.text(row[1], 80, y + i * 8)
  })

  rateData.forEach((row, i) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text(row[0], 110, y + i * 8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...dark)
    doc.text(row[1], 195, y + i * 8, { align: 'right' })
  })

  y += 32
  doc.setTextColor(...dark)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Value Levers', 15, y)
  doc.setDrawColor(229, 231, 235)
  doc.line(15, y + 4, 195, y + 4)

  y += 14
  const leversData = [
    { label: 'Impacto al negocio', value: valueLevers.businessImpact },
    { label: 'Valor estratégico', value: valueLevers.strategicValue },
    { label: 'Urgencia', value: valueLevers.urgency },
    { label: 'Exclusividad', value: valueLevers.exclusivity },
  ]

  doc.setFontSize(9)
  leversData.forEach((lever, i) => {
    const col = i % 2 === 0 ? 15 : 110
    const row = y + Math.floor(i / 2) * 18

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text(lever.label, col, row)

    const barWidth = 72
    doc.setFillColor(229, 231, 235)
    doc.roundedRect(col, row + 3, barWidth, 4, 2, 2, 'F')
    doc.setFillColor(...violet)
    doc.roundedRect(col, row + 3, (barWidth * lever.value) / 5, 4, 2, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...violet)
    doc.text(`${lever.value}/5`, col + barWidth + 4, row + 6)
  })

  doc.setFillColor(245, 243, 255)
  doc.rect(0, 277, 210, 20, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.text('Generado con ValuePricer · FeeCraft — precio basado en valor, no en horas', 105, 287, { align: 'center' })

  doc.save(`cotizacion-${projectType!.name.toLowerCase().replace(/\s/g, '-')}.pdf`)
}
