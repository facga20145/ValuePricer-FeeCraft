import type { CalculatorState } from '../types'

const STORAGE_KEY = 'feecraft_history'
const MAX_HISTORY = 5

export interface SavedQuote {
  id: string
  date: string
  projectName: string
  suggestedPrice: number
  state: CalculatorState
}

export function saveQuote(state: CalculatorState, suggestedPrice: number): void {
  if (!state.projectType) return

  const history = getHistory()
  const newQuote: SavedQuote = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('es-ES'),
    projectName: state.projectType.name,
    suggestedPrice,
    state,
  }

  const updated = [newQuote, ...history].slice(0, MAX_HISTORY)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function getHistory(): SavedQuote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
