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
