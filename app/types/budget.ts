export interface BudgetTransaction {
  id: string
  description: string
  amount: number
  date: string
}

export interface Expense extends BudgetTransaction {
  category: string
}

export interface Income extends BudgetTransaction {
  source: string
}

export interface BudgetState {
  expenses: Expense[]
  income: Income[]
}

export interface MonthlyBudgetSnapshot {
  month: string // Format: YYYY-MM (e.g., "2025-10")
  expenses: Expense[]
  income: Income[]
  totalExpenses: number
  totalIncome: number
  balance: number
  expensesByCategory: Record<string, number>
  incomeBySource: Record<string, number>
  archivedAt: string // ISO timestamp
}

export interface BudgetHistoryState {
  currentMonth: string
  previousMonths: Record<string, MonthlyBudgetSnapshot> // Key: YYYY-MM
}
