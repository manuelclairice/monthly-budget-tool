<template>
  <div class="previous-month">
    <div v-if="!hasPreviousMonth" class="empty-state">
      <div class="empty-icon">
        <span class="material-symbols-rounded">calendar_month</span>
      </div>
      <h3>No Previous Month Data</h3>
      <p>
        Start tracking your budget! When a new month begins, your current data will be automatically archived here.
      </p>
      <p class="hint">
        Or click "Archive Current Month" to manually save your current budget data.
      </p>
      <button class="btn btn--primary" @click="handleManualArchive">
        <span class="material-symbols-rounded">archive</span>
        Archive Current Month
      </button>
    </div>

    <div v-else class="previous-month-content">
      <!-- Header with month selector -->
      <div class="month-header">
        <h2>{{ formatMonthDisplay(selectedMonth) }}</h2>
        <div v-if="archivedMonths.length > 1" class="month-selector">
          <label for="month-select">View Month:</label>
          <select id="month-select" v-model="selectedMonth" class="month-dropdown">
            <option v-for="monthData in archivedMonths" :key="monthData.month" :value="monthData.month">
              {{ formatMonthDisplay(monthData.month) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card stat-card--income">
          <div class="stat-icon">
            <span class="material-symbols-rounded">account_balance_wallet</span>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">Total Income</h3>
            <p class="stat-value">€{{ selectedMonthData?.totalIncome.toLocaleString() }}</p>
          </div>
        </div>

        <div class="stat-card stat-card--expenses">
          <div class="stat-icon">
            <span class="material-symbols-rounded">payments</span>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">Total Expenses</h3>
            <p class="stat-value">€{{ selectedMonthData?.totalExpenses.toLocaleString() }}</p>
          </div>
        </div>

        <div class="stat-card stat-card--balance" :style="{ borderColor: balanceColor }">
          <div class="stat-icon">
            <span class="material-symbols-rounded">account_balance</span>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">Balance</h3>
            <p class="stat-value" :style="{ color: balanceColor }">
              €{{ selectedMonthData?.balance.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Comparison with Current Month -->
      <div v-if="monthComparison && selectedMonth === getPreviousMonth()" class="comparison-section">
        <h3><span class="material-symbols-rounded comparison-icon">bar_chart</span> Comparison with Current Month</h3>
        <div class="comparison-grid">
          <div class="comparison-card">
            <h4>Income</h4>
            <div class="comparison-values">
              <span class="previous">Previous: €{{ monthComparison.income.previous.toLocaleString() }}</span>
              <span class="current">Current: €{{ monthComparison.income.current.toLocaleString() }}</span>
            </div>
            <div class="comparison-change" :class="changeClass(monthComparison.income.difference)">
              {{ formatChange(monthComparison.income.difference) }}
              ({{ monthComparison.income.percentChange }}%)
            </div>
          </div>

          <div class="comparison-card">
            <h4>Expenses</h4>
            <div class="comparison-values">
              <span class="previous">Previous: €{{ monthComparison.expenses.previous.toLocaleString() }}</span>
              <span class="current">Current: €{{ monthComparison.expenses.current.toLocaleString() }}</span>
            </div>
            <div class="comparison-change" :class="changeClass(monthComparison.expenses.difference, true)">
              {{ formatChange(monthComparison.expenses.difference) }}
              ({{ monthComparison.expenses.percentChange }}%)
            </div>
          </div>

          <div class="comparison-card">
            <h4>Balance</h4>
            <div class="comparison-values">
              <span class="previous">Previous: €{{ monthComparison.balance.previous.toLocaleString() }}</span>
              <span class="current">Current: €{{ monthComparison.balance.current.toLocaleString() }}</span>
            </div>
            <div class="comparison-change" :class="changeClass(monthComparison.balance.difference)">
              {{ formatChange(monthComparison.balance.difference) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <div v-if="expensesChartData.length > 0" class="chart-card">
          <h3>Expenses by Category</h3>
          <PieChart 
            :data="expensesChartData"
            title="Expenses Distribution"
            :height="300"
          />
        </div>

        <div v-if="incomeChartData.length > 0" class="chart-card">
          <h3>Income by Source</h3>
          <PieChart 
            :data="incomeChartData"
            title="Income Distribution"
            :height="300"
          />
        </div>
      </div>

      <!-- Transaction Lists -->
      <div class="transactions-section">
        <div class="transaction-list">
          <h3><span class="material-symbols-rounded list-icon list-icon--expenses">payments</span> Expenses ({{ selectedMonthData?.expenses.length }})</h3>
          <div v-if="selectedMonthData?.expenses.length === 0" class="empty-list">
            No expenses recorded
          </div>
          <div v-else class="list-items">
            <div 
              v-for="expense in selectedMonthData?.expenses" 
              :key="expense.id"
              class="list-item"
            >
              <div class="item-info">
                <span class="item-category">{{ expense.category }}</span>
                <span class="item-description">{{ expense.description }}</span>
                <span class="item-date">{{ formatDate(expense.date) }}</span>
              </div>
              <div class="item-amount">€{{ expense.amount.toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <div class="transaction-list">
          <h3><span class="material-symbols-rounded list-icon list-icon--income">account_balance_wallet</span> Income ({{ selectedMonthData?.income.length }})</h3>
          <div v-if="selectedMonthData?.income.length === 0" class="empty-list">
            No income recorded
          </div>
          <div v-else class="list-items">
            <div 
              v-for="income in selectedMonthData?.income" 
              :key="income.id"
              class="list-item"
            >
              <div class="item-info">
                <span class="item-category">{{ income.source }}</span>
                <span class="item-description">{{ income.description }}</span>
                <span class="item-date">{{ formatDate(income.date) }}</span>
              </div>
              <div class="item-amount income-amount">€{{ income.amount.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Archive Info -->
      <div class="archive-info">
        <p>
          <span class="material-symbols-rounded archive-icon">archive</span>
          Archived on {{ formatDate(selectedMonthData?.archivedAt || '') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBudgetHistory } from '~/composables/useBudgetHistory'
import PieChart from './PieChart.vue'

const {
  hasPreviousMonth,
  archivedMonths,
  formatMonthDisplay,
  getPreviousMonth,
  getMonthData,
  monthComparison,
  archiveCurrentMonth
} = useBudgetHistory()

// Selected month for viewing (defaults to most recent)
const selectedMonth = ref(getPreviousMonth())

const selectedMonthData = computed(() => {
  return getMonthData(selectedMonth.value)
})

const balanceColor = computed(() => {
  const balance = selectedMonthData.value?.balance || 0
  if (balance >= 0) return 'var(--color-success)'
  return 'var(--color-danger)'
})

const expensesChartData = computed(() => {
  if (!selectedMonthData.value) return []
  return Object.entries(selectedMonthData.value.expensesByCategory).map(([category, amount]) => ({
    label: category,
    value: amount
  }))
})

const incomeChartData = computed(() => {
  if (!selectedMonthData.value) return []
  return Object.entries(selectedMonthData.value.incomeBySource).map(([source, amount]) => ({
    label: source,
    value: amount
  }))
})

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatChange = (diff: number): string => {
  if (diff > 0) return `+€${diff.toLocaleString()}`
  if (diff < 0) return `-€${Math.abs(diff).toLocaleString()}`
  return '€0'
}

const changeClass = (diff: number, inverseColors = false): string => {
  if (diff > 0) return inverseColors ? 'negative' : 'positive'
  if (diff < 0) return inverseColors ? 'positive' : 'negative'
  return 'neutral'
}

const handleManualArchive = () => {
  archiveCurrentMonth()
  selectedMonth.value = getPreviousMonth()
}
</script>

<style scoped>
.previous-month {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Empty State */
.empty-state {
  padding: var(--spacing-3xl);
  text-align: center;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.empty-icon .material-symbols-rounded {
  font-size: 4rem;
}

.empty-state h3 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-xl);
  color: var(--color-text);
}

.empty-state p {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text-secondary);
}

.hint {
  font-style: italic;
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg) !important;
}

/* Month Header */
.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.month-header h2 {
  margin: 0;
  font-size: var(--font-size-2xl);
}

.month-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.month-dropdown {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  background-color: white;
  cursor: pointer;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-card--income {
  border-left: 4px solid var(--color-success);
}

.stat-card--expenses {
  border-left: 4px solid var(--color-warning);
}

.stat-card--balance {
  border-left: 4px solid;
}

.stat-icon {
  font-size: 2.5rem;
  color: var(--color-primary);
  transition: transform var(--transition-fast);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(-5deg);
}

.stat-icon .material-symbols-rounded {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

/* Comparison Section */
.comparison-section {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.comparison-section h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0 0 var(--spacing-lg) 0;
}

.comparison-icon {
  color: var(--color-primary);
  font-size: var(--icon-md);
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.comparison-card {
  padding: var(--spacing-lg);
  background-color: var(--color-background);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.comparison-card h4 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-lg);
}

.comparison-values {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.comparison-values .previous {
  color: var(--color-text-secondary);
}

.comparison-values .current {
  font-weight: 600;
}

.comparison-change {
  font-weight: 700;
  font-size: var(--font-size-lg);
}

.comparison-change.positive {
  color: var(--color-success);
}

.comparison-change.negative {
  color: var(--color-danger);
}

.comparison-change.neutral {
  color: var(--color-text-secondary);
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.chart-card {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.chart-card h3 {
  margin: 0 0 var(--spacing-lg) 0;
}

/* Transactions */
.transactions-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.transaction-list {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.transaction-list h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0 0 var(--spacing-lg) 0;
}

.list-icon {
  font-size: var(--icon-md);
}

.list-icon--expenses {
  color: var(--color-warning);
}

.list-icon--income {
  color: var(--color-success);
}

.empty-list {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
  font-style: italic;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-height: 400px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.item-category {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.item-description {
  font-weight: 500;
}

.item-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.item-amount {
  font-weight: 700;
  font-size: var(--font-size-lg);
  color: var(--color-danger);
}

.income-amount {
  color: var(--color-success);
}

/* Archive Info */
.archive-info {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-style: italic;
}

.archive-info p {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  margin: 0;
}

.archive-icon {
  font-size: var(--icon-sm);
  color: var(--color-primary);
}

/* Button */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn .material-symbols-rounded {
  font-size: var(--icon-sm);
}

.btn--primary {
  background-color: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .stats-grid,
  .comparison-grid,
  .charts-grid,
  .transactions-section {
    grid-template-columns: 1fr;
  }
}
</style>
