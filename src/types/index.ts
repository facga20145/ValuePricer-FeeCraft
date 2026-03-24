export interface ProjectType {
  id: string
  name: string
  description: string
  baseHourlyRate: number
}

export interface ValueLevers {
  businessImpact: number
  urgency: number
  exclusivity: number
  strategicValue: number
}

export interface CalculatorState {
  projectType: ProjectType | null
  estimatedHours: number
  riskBuffer: number
  valueLevers: ValueLevers
}

export interface PriceResult {
  basePrice: number
  valueMultiplier: number
  suggestedPrice: number
  minPrice: number
  maxPrice: number
  breakdown: PriceBreakdownItem[]
}

export interface PriceBreakdownItem {
  label: string
  amount: number
  isMultiplier?: boolean
}
