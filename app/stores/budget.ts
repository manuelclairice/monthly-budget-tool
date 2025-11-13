import { defineStore } from 'pinia'
import type { BudgetState, Expense, Income, MonthlyBudgetSnapshot } from '~/types/budget'

const STORAGE_KEY = 'monthly-budget-data'
const HISTORY_STORAGE_KEY = 'monthly-budget-history'

interface ExtendedBudgetState extends BudgetState {
  currentMonth: string
  previousMonths: Record<string, MonthlyBudgetSnapshot>
}

export const useBudgetStore = defineStore('budget', {
  state: (): ExtendedBudgetState => ({
    expenses: [],
    income: [],
    currentMonth: '',
    previousMonths: {}
  }),

  getters: {
    totalExpenses: (state): number => {
      return state.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    },

    totalIncome: (state): number => {
      return state.income.reduce((sum, income) => sum + income.amount, 0)
    },

    balance(): number {
      return this.totalIncome - this.totalExpenses
    },

    expensesByCategory: (state): Record<string, number> => {
      return state.expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      }, {} as Record<string, number>)
    },

    incomeBySource: (state): Record<string, number> => {
      return state.income.reduce((acc, income) => {
        acc[income.source] = (acc[income.source] || 0) + income.amount
        return acc
      }, {} as Record<string, number>)
    }
  },

  actions: {
    addExpense(expense: Omit<Expense, 'id'>) {
      const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID()
      }
      this.expenses.push(newExpense)
      this.saveToStorage()
    },

    removeExpense(id: string) {
      this.expenses = this.expenses.filter(expense => expense.id !== id)
      this.saveToStorage()
    },

    updateExpense(id: string, updates: Partial<Omit<Expense, 'id'>>) {
      const index = this.expenses.findIndex(expense => expense.id === id)
      if (index !== -1) {
        this.expenses[index] = {
          ...this.expenses[index]!,
          ...updates
        }
        this.saveToStorage()
      }
    },

    addIncome(income: Omit<Income, 'id'>) {
      const newIncome: Income = {
        ...income,
        id: crypto.randomUUID()
      }
      this.income.push(newIncome)
      this.saveToStorage()
    },

    removeIncome(id: string) {
      this.income = this.income.filter(income => income.id !== id)
      this.saveToStorage()
    },

    updateIncome(id: string, updates: Partial<Omit<Income, 'id'>>) {
      const index = this.income.findIndex(income => income.id === id)
      if (index !== -1) {
        this.income[index] = {
          ...this.income[index]!,
          ...updates
        }
        this.saveToStorage()
      }
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            expenses: this.expenses,
            income: this.income,
            currentMonth: this.currentMonth
          }))
          // Save history separately to avoid data loss
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.previousMonths))
        } catch (error) {
          console.error('Failed to save budget data:', error)
        }
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        try {
          const data = localStorage.getItem(STORAGE_KEY)
          if (data) {
            const parsed = JSON.parse(data)
            this.expenses = parsed.expenses || []
            this.income = parsed.income || []
            this.currentMonth = parsed.currentMonth || ''
          }

          // Load history
          const historyData = localStorage.getItem(HISTORY_STORAGE_KEY)
          if (historyData) {
            this.previousMonths = JSON.parse(historyData)
          }
        } catch (error) {
          console.error('Failed to load budget data:', error)
        }
      }
    },

    archiveMonth(snapshot: MonthlyBudgetSnapshot) {
      this.previousMonths[snapshot.month] = snapshot
      this.saveToStorage()
    },

    initializeSampleData() {
      // Only add sample data if there's no existing data
      if (this.expenses.length === 0 && this.income.length === 0) {
        // Sample income
        this.addIncome({
          description: 'Monthly Salary',
          amount: 5000,
          source: 'Salary',
          date: new Date().toISOString()
        })

        this.addIncome({
          description: 'Freelance Project',
          amount: 1200,
          source: 'Freelance',
          date: new Date().toISOString()
        })

        // Sample expenses
        this.addExpense({
          description: 'Rent Payment',
          amount: 1500,
          category: 'Housing',
          date: new Date().toISOString()
        })

        this.addExpense({
          description: 'Grocery Shopping',
          amount: 450,
          category: 'Food & Dining',
          date: new Date().toISOString()
        })

        this.addExpense({
          description: 'Electric Bill',
          amount: 120,
          category: 'Utilities',
          date: new Date().toISOString()
        })

        this.addExpense({
          description: 'Gas & Transportation',
          amount: 200,
          category: 'Transportation',
          date: new Date().toISOString()
        })

        this.addExpense({
          description: 'Netflix Subscription',
          amount: 15,
          category: 'Entertainment',
          date: new Date().toISOString()
        })

        this.addExpense({
          description: 'Doctor Visit',
          amount: 80,
          category: 'Healthcare',
          date: new Date().toISOString()
        })
      }
    },

    clearAllData() {
      this.expenses = []
      this.income = []
      this.saveToStorage()
    }
  }
})
