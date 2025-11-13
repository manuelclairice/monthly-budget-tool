import { defineStore } from 'pinia'
import type { BudgetState, Expense, Income } from '~/types/budget'

const STORAGE_KEY = 'monthly-budget-data'

export const useBudgetStore = defineStore('budget', {
  state: (): BudgetState => ({
    expenses: [],
    income: []
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

    saveToStorage() {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            expenses: this.expenses,
            income: this.income
          }))
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
          }
        } catch (error) {
          console.error('Failed to load budget data:', error)
        }
      }
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
