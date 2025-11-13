import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '~/stores/budget'

describe('Budget Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty state', () => {
    const store = useBudgetStore()
    expect(store.expenses).toEqual([])
    expect(store.income).toEqual([])
  })

  it('adds an expense', () => {
    const store = useBudgetStore()
    store.addExpense({
      description: 'Test Expense',
      amount: 100,
      category: 'Food & Dining',
      date: new Date().toISOString()
    })

    expect(store.expenses).toHaveLength(1)
    expect(store.expenses[0]!.description).toBe('Test Expense')
    expect(store.expenses[0]!.amount).toBe(100)
  })

  it('updates an expense', () => {
    const store = useBudgetStore()
    
    store.addExpense({
      description: 'Original',
      amount: 100,
      category: 'Food',
      date: new Date().toISOString()
    })

    const expenseId = store.expenses[0]!.id
    
    store.updateExpense(expenseId, {
      description: 'Updated',
      amount: 150
    })

    expect(store.expenses[0]!.description).toBe('Updated')
    expect(store.expenses[0]!.amount).toBe(150)
    expect(store.expenses[0]!.category).toBe('Food') // Unchanged
  })

  it('does not update non-existent expense', () => {
    const store = useBudgetStore()
    
    store.addExpense({
      description: 'Test',
      amount: 100,
      category: 'Food',
      date: new Date().toISOString()
    })

    const originalLength = store.expenses.length
    store.updateExpense('non-existent-id', { amount: 200 })

    expect(store.expenses.length).toBe(originalLength)
    expect(store.expenses[0]!.amount).toBe(100) // Unchanged
  })

  it('removes an expense', () => {
    const store = useBudgetStore()
    store.addExpense({
      description: 'Test Expense',
      amount: 100,
      category: 'Food & Dining',
      date: new Date().toISOString()
    })

    const expenseId = store.expenses[0]!.id
    store.removeExpense(expenseId)

    expect(store.expenses).toHaveLength(0)
  })

  it('adds income', () => {
    const store = useBudgetStore()
    store.addIncome({
      description: 'Salary',
      amount: 5000,
      source: 'Salary',
      date: new Date().toISOString()
    })

    expect(store.income).toHaveLength(1)
    expect(store.income[0]!.description).toBe('Salary')
    expect(store.income[0]!.amount).toBe(5000)
  })

  it('updates income', () => {
    const store = useBudgetStore()
    
    store.addIncome({
      description: 'Original Salary',
      amount: 5000,
      source: 'Job',
      date: new Date().toISOString()
    })

    const incomeId = store.income[0]!.id
    
    store.updateIncome(incomeId, {
      description: 'Updated Salary',
      amount: 5500
    })

    expect(store.income[0]!.description).toBe('Updated Salary')
    expect(store.income[0]!.amount).toBe(5500)
    expect(store.income[0]!.source).toBe('Job') // Unchanged
  })

  it('does not update non-existent income', () => {
    const store = useBudgetStore()
    
    store.addIncome({
      description: 'Salary',
      amount: 5000,
      source: 'Job',
      date: new Date().toISOString()
    })

    const originalLength = store.income.length
    store.updateIncome('non-existent-id', { amount: 6000 })

    expect(store.income.length).toBe(originalLength)
    expect(store.income[0]!.amount).toBe(5000) // Unchanged
  })

  it('calculates total expenses correctly', () => {
    const store = useBudgetStore()
    store.addExpense({
      description: 'Expense 1',
      amount: 100,
      category: 'Food & Dining',
      date: new Date().toISOString()
    })
    store.addExpense({
      description: 'Expense 2',
      amount: 200,
      category: 'Transportation',
      date: new Date().toISOString()
    })

    expect(store.totalExpenses).toBe(300)
  })

  it('calculates total income correctly', () => {
    const store = useBudgetStore()
    store.addIncome({
      description: 'Income 1',
      amount: 1000,
      source: 'Salary',
      date: new Date().toISOString()
    })
    store.addIncome({
      description: 'Income 2',
      amount: 500,
      source: 'Freelance',
      date: new Date().toISOString()
    })

    expect(store.totalIncome).toBe(1500)
  })

  it('calculates balance correctly', () => {
    const store = useBudgetStore()
    store.addIncome({
      description: 'Salary',
      amount: 5000,
      source: 'Salary',
      date: new Date().toISOString()
    })
    store.addExpense({
      description: 'Rent',
      amount: 1500,
      category: 'Housing',
      date: new Date().toISOString()
    })

    expect(store.balance).toBe(3500)
  })

  it('groups expenses by category', () => {
    const store = useBudgetStore()
    store.addExpense({
      description: 'Grocery',
      amount: 100,
      category: 'Food & Dining',
      date: new Date().toISOString()
    })
    store.addExpense({
      description: 'Restaurant',
      amount: 50,
      category: 'Food & Dining',
      date: new Date().toISOString()
    })
    store.addExpense({
      description: 'Gas',
      amount: 75,
      category: 'Transportation',
      date: new Date().toISOString()
    })

    expect(store.expensesByCategory['Food & Dining']).toBe(150)
    expect(store.expensesByCategory['Transportation']).toBe(75)
  })

  it('groups income by source', () => {
    const store = useBudgetStore()
    store.addIncome({
      description: 'Monthly Salary',
      amount: 5000,
      source: 'Salary',
      date: new Date().toISOString()
    })
    store.addIncome({
      description: 'Freelance Project',
      amount: 1200,
      source: 'Freelance',
      date: new Date().toISOString()
    })

    expect(store.incomeBySource['Salary']).toBe(5000)
    expect(store.incomeBySource['Freelance']).toBe(1200)
  })

  it('clears all data', () => {
    const store = useBudgetStore()
    store.addExpense({
      description: 'Test',
      amount: 100,
      category: 'Food & Dining',
      date: new Date().toISOString()
    })
    store.addIncome({
      description: 'Test',
      amount: 1000,
      source: 'Salary',
      date: new Date().toISOString()
    })

    store.clearAllData()

    expect(store.expenses).toEqual([])
    expect(store.income).toEqual([])
  })
})
