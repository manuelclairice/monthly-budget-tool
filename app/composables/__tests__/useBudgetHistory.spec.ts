import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetHistory } from '../useBudgetHistory'
import { useBudgetStore } from '~/stores/budget'

describe('useBudgetHistory Composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    
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

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getCurrentMonth', () => {
    it('returns current month in YYYY-MM format', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const { getCurrentMonth } = useBudgetHistory()
      expect(getCurrentMonth()).toBe('2025-11')
    })

    it('pads single-digit months with zero', () => {
      const mockDate = new Date('2025-03-15')
      vi.setSystemTime(mockDate)

      const { getCurrentMonth } = useBudgetHistory()
      expect(getCurrentMonth()).toBe('2025-03')
    })
  })

  describe('getPreviousMonth', () => {
    it('returns previous month correctly', () => {
      const { getPreviousMonth } = useBudgetHistory()
      expect(getPreviousMonth('2025-11')).toBe('2025-10')
    })

    it('handles year rollback correctly', () => {
      const { getPreviousMonth } = useBudgetHistory()
      expect(getPreviousMonth('2025-01')).toBe('2024-12')
    })

    it('uses current month when no argument provided', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const { getPreviousMonth } = useBudgetHistory()
      expect(getPreviousMonth()).toBe('2025-10')
    })
  })

  describe('formatMonthDisplay', () => {
    it('formats month string for display', () => {
      const { formatMonthDisplay } = useBudgetHistory()
      const formatted = formatMonthDisplay('2025-10')
      expect(formatted).toBe('October 2025')
    })
  })

  describe('checkAndHandleMonthChange', () => {
    it('initializes currentMonth on first use', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const store = useBudgetStore()
      const { checkAndHandleMonthChange } = useBudgetHistory()

      const changed = checkAndHandleMonthChange()

      expect(changed).toBe(false)
      expect(store.currentMonth).toBe('2025-11')
    })

    it('detects month change and archives data', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const store = useBudgetStore()
      store.currentMonth = '2025-10' // Previous month stored
      
      // Add some data to be archived
      store.addExpense({
        description: 'Test',
        amount: 100,
        category: 'Food',
        date: '2025-10-15'
      })

      const { checkAndHandleMonthChange } = useBudgetHistory()
      const changed = checkAndHandleMonthChange()

      expect(changed).toBe(true)
      expect(store.currentMonth).toBe('2025-11')
      expect(store.previousMonths['2025-10']).toBeDefined()
      expect(store.expenses).toHaveLength(0) // Current month reset
    })

    it('does not archive if no data exists', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const store = useBudgetStore()
      store.currentMonth = '2025-10'

      const { checkAndHandleMonthChange } = useBudgetHistory()
      const changed = checkAndHandleMonthChange()

      expect(changed).toBe(false)
      expect(store.currentMonth).toBe('2025-11')
      expect(Object.keys(store.previousMonths)).toHaveLength(0)
    })

    it('does nothing when month has not changed', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const store = useBudgetStore()
      store.currentMonth = '2025-11'

      const { checkAndHandleMonthChange } = useBudgetHistory()
      const changed = checkAndHandleMonthChange()

      expect(changed).toBe(false)
    })
  })

  describe('archiveCurrentMonth', () => {
    it('creates and stores a snapshot', () => {
      const store = useBudgetStore()
      store.currentMonth = '2025-10'
      
      store.addIncome({
        description: 'Salary',
        amount: 5000,
        source: 'Job',
        date: '2025-10-01'
      })

      const { archiveCurrentMonth } = useBudgetHistory()
      archiveCurrentMonth()

      const archived = store.previousMonths['2025-10']
      expect(archived).toBeDefined()
      expect(archived!.totalIncome).toBe(5000)
      expect(archived!.income).toHaveLength(1)
    })
  })

  describe('hasPreviousMonth', () => {
    it('returns false when no previous month exists', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const { hasPreviousMonth } = useBudgetHistory()
      expect(hasPreviousMonth.value).toBe(false)
    })

    it('returns true when previous month exists', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const store = useBudgetStore()
      store.archiveMonth({
        month: '2025-10',
        expenses: [],
        income: [],
        totalExpenses: 1500,
        totalIncome: 5000,
        balance: 3500,
        expensesByCategory: {},
        incomeBySource: {},
        archivedAt: new Date().toISOString()
      })

      const { hasPreviousMonth } = useBudgetHistory()
      expect(hasPreviousMonth.value).toBe(true)
    })
  })

  describe('monthComparison', () => {
    it('returns null when no previous month exists', () => {
      const { monthComparison } = useBudgetHistory()
      expect(monthComparison.value).toBeNull()
    })

    it('calculates comparison correctly', () => {
      const mockDate = new Date('2025-11-15')
      vi.setSystemTime(mockDate)

      const store = useBudgetStore()
      
      // Archive October data
      store.archiveMonth({
        month: '2025-10',
        expenses: [],
        income: [],
        totalExpenses: 1000,
        totalIncome: 4000,
        balance: 3000,
        expensesByCategory: {},
        incomeBySource: {},
        archivedAt: new Date().toISOString()
      })

      // Set current November data
      store.addIncome({
        description: 'Salary',
        amount: 5000,
        source: 'Job',
        date: '2025-11-01'
      })

      store.addExpense({
        description: 'Rent',
        amount: 1500,
        category: 'Housing',
        date: '2025-11-01'
      })

      const { monthComparison } = useBudgetHistory()
      const comparison = monthComparison.value

      expect(comparison).not.toBeNull()
      expect(comparison!.income.current).toBe(5000)
      expect(comparison!.income.previous).toBe(4000)
      expect(comparison!.income.difference).toBe(1000)
      expect(comparison!.income.percentChange).toBe('25.0')

      expect(comparison!.expenses.current).toBe(1500)
      expect(comparison!.expenses.previous).toBe(1000)
      expect(comparison!.expenses.difference).toBe(500)
      expect(comparison!.expenses.percentChange).toBe('50.0')

      expect(comparison!.balance.current).toBe(3500)
      expect(comparison!.balance.previous).toBe(3000)
      expect(comparison!.balance.difference).toBe(500)
    })
  })

  describe('archivedMonths', () => {
    it('returns sorted list of archived months (newest first)', () => {
      const store = useBudgetStore()

      store.archiveMonth({
        month: '2025-09',
        expenses: [],
        income: [],
        totalExpenses: 1000,
        totalIncome: 4000,
        balance: 3000,
        expensesByCategory: {},
        incomeBySource: {},
        archivedAt: '2025-10-01T00:00:00.000Z'
      })

      store.archiveMonth({
        month: '2025-10',
        expenses: [],
        income: [],
        totalExpenses: 1200,
        totalIncome: 4500,
        balance: 3300,
        expensesByCategory: {},
        incomeBySource: {},
        archivedAt: '2025-11-01T00:00:00.000Z'
      })

      const { archivedMonths } = useBudgetHistory()
      
      expect(archivedMonths.value).toHaveLength(2)
      expect(archivedMonths.value[0]!.month).toBe('2025-10') // Newest first
      expect(archivedMonths.value[1]!.month).toBe('2025-09')
    })
  })

  describe('startNewMonth', () => {
    it('archives current data and resets', () => {
      const mockDate = new Date('2025-11-01')
      vi.setSystemTime(mockDate)

      const store = useBudgetStore()
      store.currentMonth = '2025-10'
      
      store.addExpense({
        description: 'Test',
        amount: 100,
        category: 'Food',
        date: '2025-10-15'
      })

      const { startNewMonth } = useBudgetHistory()
      startNewMonth()

      expect(store.currentMonth).toBe('2025-11')
      expect(store.expenses).toHaveLength(0)
      expect(store.income).toHaveLength(0)
      expect(store.previousMonths['2025-10']).toBeDefined()
    })
  })
})
