import type { CalculatorState, PriceResult, ValueLevers } from '../types'

function computeValueMultiplier(levers: ValueLevers): number {
  const { businessImpact, urgency, exclusivity, strategicValue } = levers

  const weightedScore =
    businessImpact * 0.35 +
    strategicValue * 0.30 +
    urgency * 0.20 +
    exclusivity * 0.15

  const multiplier = 0.8 + ((weightedScore - 1) / 4) * 2.2

  return Math.round(multiplier * 100) / 100
}

export function calculatePrice(state: CalculatorState): PriceResult | null {
  const { projectType, estimatedHours, riskBuffer, valueLevers } = state

  if (!projectType || estimatedHours <= 0) return null

  const totalHours = estimatedHours * (1 + riskBuffer / 100)
  const basePrice = Math.round(totalHours * projectType.baseHourlyRate)
  const valueMultiplier = computeValueMultiplier(valueLevers)
  const suggestedPrice = Math.round(basePrice * valueMultiplier)

  const minPrice = Math.round(suggestedPrice * 0.85)
  const maxPrice = Math.round(suggestedPrice * 1.15)

  const breakdown = [
    {
      label: `${totalHours.toFixed(1)}h × $${projectType.baseHourlyRate}/h`,
      amount: basePrice,
    },
    {
      label: `Multiplicador de valor (×${valueMultiplier})`,
      amount: suggestedPrice - basePrice,
      isMultiplier: true,
    },
  ]

  return { basePrice, valueMultiplier, suggestedPrice, minPrice, maxPrice, breakdown }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
