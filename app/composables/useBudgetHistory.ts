import { computed } from 'vue'
import { useBudgetStore } from '~/stores/budget'
import type { MonthlyBudgetSnapshot } from '~/types/budget'

/**
 * Composable for managing budget history across months
 * Handles automatic month detection, archival, and retrieval of previous month data
 */
export function useBudgetHistory() {
  const budgetStore = useBudgetStore()

  /**
   * Get current month in YYYY-MM format
   */
  const getCurrentMonth = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }

  /**
   * Get previous month in YYYY-MM format
   */
  const getPreviousMonth = (monthStr?: string): string => {
    const baseMonth = monthStr || getCurrentMonth()
    const parts = baseMonth.split('-')
    const year = parseInt(parts[0]!, 10)
    const month = parseInt(parts[1]!, 10)
    const date = new Date(year, month - 1, 1)
    date.setMonth(date.getMonth() - 1)
    
    const prevYear = date.getFullYear()
    const prevMonth = String(date.getMonth() + 1).padStart(2, '0')
    return `${prevYear}-${prevMonth}`
  }

  /**
   * Format month string for display (e.g., "2025-10" -> "October 2025")
   */
  const formatMonthDisplay = (monthStr: string): string => {
    const parts = monthStr.split('-')
    const year = parseInt(parts[0]!, 10)
    const month = parseInt(parts[1]!, 10)
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  /**
   * Create a snapshot of current budget data
   */
  const createSnapshot = (month: string): MonthlyBudgetSnapshot => {
    return {
      month,
      expenses: [...budgetStore.expenses],
      income: [...budgetStore.income],
      totalExpenses: budgetStore.totalExpenses,
      totalIncome: budgetStore.totalIncome,
      balance: budgetStore.balance,
      expensesByCategory: { ...budgetStore.expensesByCategory },
      incomeBySource: { ...budgetStore.incomeBySource },
      archivedAt: new Date().toISOString()
    }
  }

  /**
   * Archive current month's budget data
   */
  const archiveCurrentMonth = (targetMonth?: string): void => {
    const month = targetMonth || budgetStore.currentMonth
    const snapshot = createSnapshot(month)
    budgetStore.archiveMonth(snapshot)
  }

  /**
   * Reset current month data (typically when starting a new month)
   */
  const resetCurrentMonth = (): void => {
    budgetStore.expenses = []
    budgetStore.income = []
    budgetStore.saveToStorage()
  }

  /**
   * Archive current month and reset for new month
   */
  const startNewMonth = (): void => {
    archiveCurrentMonth()
    const newMonth = getCurrentMonth()
    budgetStore.currentMonth = newMonth
    resetCurrentMonth()
  }

  /**
   * Check if month has changed and handle automatic archival
   */
  const checkAndHandleMonthChange = (): boolean => {
    const currentSystemMonth = getCurrentMonth()
    const storedCurrentMonth = budgetStore.currentMonth

    // First time initialization
    if (!storedCurrentMonth) {
      budgetStore.currentMonth = currentSystemMonth
      budgetStore.saveToStorage()
      return false
    }

    // Month has changed
    if (currentSystemMonth !== storedCurrentMonth) {
      // Only archive if there's data
      if (budgetStore.expenses.length > 0 || budgetStore.income.length > 0) {
        startNewMonth()
        return true
      } else {
        // No data, just update the month
        budgetStore.currentMonth = currentSystemMonth
        budgetStore.saveToStorage()
        return false
      }
    }

    return false
  }

  /**
   * Get previous month's data
   */
  const previousMonthData = computed((): MonthlyBudgetSnapshot | null => {
    const prevMonth = getPreviousMonth()
    return budgetStore.previousMonths[prevMonth] || null
  })

  /**
   * Get all archived months sorted by date (newest first)
   */
  const archivedMonths = computed((): MonthlyBudgetSnapshot[] => {
    return Object.values(budgetStore.previousMonths)
      .sort((a, b) => b.month.localeCompare(a.month))
  })

  /**
   * Check if previous month data exists
   */
  const hasPreviousMonth = computed((): boolean => {
    return previousMonthData.value !== null
  })

  /**
   * Get month data by month string (YYYY-MM)
   */
  const getMonthData = (monthStr: string): MonthlyBudgetSnapshot | null => {
    return budgetStore.previousMonths[monthStr] || null
  }

  /**
   * Calculate comparison between current and previous month
   */
  const monthComparison = computed(() => {
    const prev = previousMonthData.value
    if (!prev) return null

    const current = {
      totalIncome: budgetStore.totalIncome,
      totalExpenses: budgetStore.totalExpenses,
      balance: budgetStore.balance
    }

    const incomeDiff = current.totalIncome - prev.totalIncome
    const expensesDiff = current.totalExpenses - prev.totalExpenses
    const balanceDiff = current.balance - prev.balance

    const incomePercentChange = prev.totalIncome > 0 
      ? ((incomeDiff / prev.totalIncome) * 100).toFixed(1)
      : '0'
    
    const expensesPercentChange = prev.totalExpenses > 0
      ? ((expensesDiff / prev.totalExpenses) * 100).toFixed(1)
      : '0'

    return {
      income: {
        current: current.totalIncome,
        previous: prev.totalIncome,
        difference: incomeDiff,
        percentChange: incomePercentChange
      },
      expenses: {
        current: current.totalExpenses,
        previous: prev.totalExpenses,
        difference: expensesDiff,
        percentChange: expensesPercentChange
      },
      balance: {
        current: current.balance,
        previous: prev.balance,
        difference: balanceDiff
      }
    }
  })

  return {
    // State
    previousMonthData,
    archivedMonths,
    hasPreviousMonth,
    monthComparison,
    currentMonth: computed(() => budgetStore.currentMonth),

    // Methods
    getCurrentMonth,
    getPreviousMonth,
    formatMonthDisplay,
    archiveCurrentMonth,
    startNewMonth,
    checkAndHandleMonthChange,
    getMonthData,
    resetCurrentMonth
  }
}
