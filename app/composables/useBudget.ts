import { storeToRefs } from 'pinia'
import { useBudgetStore } from '~/stores/budget'
import type { Expense, Income } from '~/types/budget'

/**
 * Composable for managing budget data
 * Provides reactive access to budget state and actions
 */
export function useBudget() {
  const store = useBudgetStore()

  // Reactive refs from store
  const {
    expenses,
    income: incomeItems,
    totalExpenses,
    totalIncome,
    balance,
    expensesByCategory,
    incomeBySource
  } = storeToRefs(store)

  // Actions
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    store.addExpense(expense)
  }

  const removeExpense = (id: string) => {
    store.removeExpense(id)
  }

  const addIncome = (income: Omit<Income, 'id'>) => {
    store.addIncome(income)
  }

  const removeIncome = (id: string) => {
    store.removeIncome(id)
  }

  const initializeBudget = () => {
    store.loadFromStorage()
    // Uncomment to add sample data on first load
    store.initializeSampleData()
  }

  const clearAllData = () => {
    store.clearAllData()
  }

  return {
    // State
    expenses,
    incomeItems,
    totalExpenses,
    totalIncome,
    balance,
    expensesByCategory,
    incomeBySource,

    // Actions
    addExpense,
    removeExpense,
    addIncome,
    removeIncome,
    initializeBudget,
    clearAllData
  }
}
