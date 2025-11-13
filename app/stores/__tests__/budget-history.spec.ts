import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '../budget'
import type { MonthlyBudgetSnapshot } from '~/types/budget'

describe('Budget Store - History Features', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    } as Storage
  })

  it('initializes with empty currentMonth and previousMonths', () => {
    const store = useBudgetStore()
    expect(store.currentMonth).toBe('')
    expect(store.previousMonths).toEqual({})
  })

  it('archives a month snapshot correctly', () => {
    const store = useBudgetStore()
    
    const snapshot: MonthlyBudgetSnapshot = {
      month: '2025-10',
      expenses: [],
      income: [],
      totalExpenses: 1500,
      totalIncome: 5000,
      balance: 3500,
      expensesByCategory: { 'Food': 500, 'Rent': 1000 },
      incomeBySource: { 'Salary': 5000 },
      archivedAt: new Date().toISOString()
    }

    store.archiveMonth(snapshot)
    
    expect(store.previousMonths['2025-10']).toEqual(snapshot)
  })

  it('can store multiple months', () => {
    const store = useBudgetStore()
    
    const oct2025: MonthlyBudgetSnapshot = {
      month: '2025-10',
      expenses: [],
      income: [],
      totalExpenses: 1500,
      totalIncome: 5000,
      balance: 3500,
      expensesByCategory: {},
      incomeBySource: {},
      archivedAt: new Date().toISOString()
    }

    const sep2025: MonthlyBudgetSnapshot = {
      month: '2025-09',
      expenses: [],
      income: [],
      totalExpenses: 1200,
      totalIncome: 4800,
      balance: 3600,
      expensesByCategory: {},
      incomeBySource: {},
      archivedAt: new Date().toISOString()
    }

    store.archiveMonth(oct2025)
    store.archiveMonth(sep2025)
    
    expect(Object.keys(store.previousMonths)).toHaveLength(2)
    expect(store.previousMonths['2025-10']).toBeDefined()
    expect(store.previousMonths['2025-09']).toBeDefined()
  })

  it('saves currentMonth to storage', () => {
    const store = useBudgetStore()
    store.currentMonth = '2025-11'
    store.saveToStorage()
    
    const setItemCalls = (global.localStorage.setItem as any).mock.calls
    const mainStorageCall = setItemCalls.find((call: any) => 
      call[0] === 'monthly-budget-data'
    )
    
    expect(mainStorageCall).toBeDefined()
    const savedData = JSON.parse(mainStorageCall![1])
    expect(savedData.currentMonth).toBe('2025-11')
  })

  it('saves previousMonths to separate storage key', () => {
    const store = useBudgetStore()
    
    const snapshot: MonthlyBudgetSnapshot = {
      month: '2025-10',
      expenses: [],
      income: [],
      totalExpenses: 1500,
      totalIncome: 5000,
      balance: 3500,
      expensesByCategory: {},
      incomeBySource: {},
      archivedAt: new Date().toISOString()
    }

    store.archiveMonth(snapshot)
    
    const setItemCalls = (global.localStorage.setItem as any).mock.calls
    const historyStorageCall = setItemCalls.find((call: any) => 
      call[0] === 'monthly-budget-history'
    )
    
    expect(historyStorageCall).toBeDefined()
    const savedHistory = JSON.parse(historyStorageCall![1])
    expect(savedHistory['2025-10']).toBeDefined()
  })

  it('loads currentMonth from storage', () => {
    const mockData = JSON.stringify({
      expenses: [],
      income: [],
      currentMonth: '2025-11'
    })
    
    ;(global.localStorage.getItem as any).mockReturnValueOnce(mockData)
    
    const store = useBudgetStore()
    store.loadFromStorage()
    
    expect(store.currentMonth).toBe('2025-11')
  })

  it('loads previousMonths from storage', () => {
    const mockMainData = JSON.stringify({
      expenses: [],
      income: [],
      currentMonth: '2025-11'
    })

    const mockHistoryData = JSON.stringify({
      '2025-10': {
        month: '2025-10',
        expenses: [],
        income: [],
        totalExpenses: 1500,
        totalIncome: 5000,
        balance: 3500,
        expensesByCategory: {},
        incomeBySource: {},
        archivedAt: '2025-11-01T00:00:00.000Z'
      }
    })
    
    ;(global.localStorage.getItem as any)
      .mockReturnValueOnce(mockMainData)
      .mockReturnValueOnce(mockHistoryData)
    
    const store = useBudgetStore()
    store.loadFromStorage()
    
    expect(store.previousMonths['2025-10']).toBeDefined()
    expect(store.previousMonths['2025-10']!.totalExpenses).toBe(1500)
  })

  it('creates accurate snapshot with current data', () => {
    const store = useBudgetStore()
    
    store.addIncome({
      description: 'Salary',
      amount: 5000,
      source: 'Job',
      date: '2025-10-01'
    })

    store.addExpense({
      description: 'Rent',
      amount: 1500,
      category: 'Housing',
      date: '2025-10-15'
    })

    const snapshot: MonthlyBudgetSnapshot = {
      month: '2025-10',
      expenses: [...store.expenses],
      income: [...store.income],
      totalExpenses: store.totalExpenses,
      totalIncome: store.totalIncome,
      balance: store.balance,
      expensesByCategory: { ...store.expensesByCategory },
      incomeBySource: { ...store.incomeBySource },
      archivedAt: new Date().toISOString()
    }

    expect(snapshot.totalIncome).toBe(5000)
    expect(snapshot.totalExpenses).toBe(1500)
    expect(snapshot.balance).toBe(3500)
    expect(snapshot.expenses).toHaveLength(1)
    expect(snapshot.income).toHaveLength(1)
  })
})
