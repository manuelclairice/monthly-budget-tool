<template>
  <div class="reports-view">
    <h2>Financial Reports</h2>

    <div class="insights-grid">
      <div class="insight-card">
        <h3>💡 Key Insights</h3>
        <ul>
          <li>
            <strong>Savings Rate:</strong> {{ savingsRate }}% of your income
          </li>
          <li>
            <strong>Average Expense:</strong> ${{ averageExpense.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
          </li>
          <li>
            <strong>Average Income:</strong> ${{ averageIncome.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
          </li>
          <li v-if="topExpenseCategory">
            <strong>Top Expense Category:</strong> {{ topExpenseCategory.category }} 
            (${{ topExpenseCategory.amount.toLocaleString() }})
          </li>
        </ul>
      </div>

      <div class="insight-card">
        <h3>📊 Summary</h3>
        <ul>
          <li>Total Transactions: {{ expenses.length + incomeItems.length }}</li>
          <li>Expense Entries: {{ expenses.length }}</li>
          <li>Income Entries: {{ incomeItems.length }}</li>
          <li>Expense Categories: {{ Object.keys(expensesByCategory).length }}</li>
          <li>Income Sources: {{ Object.keys(incomeBySource).length }}</li>
        </ul>
      </div>
    </div>

    <div class="charts-grid">
      <div v-if="expensesChartData.length > 0" class="chart-card">
        <PieChart 
          :data="expensesChartData"
          title="Expenses by Category"
          :height="300"
        />
      </div>
      <div v-else class="empty-chart">
        <p>No expense data available</p>
      </div>

      <div v-if="incomeChartData.length > 0" class="chart-card">
        <PieChart 
          :data="incomeChartData"
          title="Income by Source"
          :height="300"
        />
      </div>
      <div v-else class="empty-chart">
        <p>No income data available</p>
      </div>
    </div>

    <div class="comparison-card">
      <h3>Income vs. Expenses Comparison</h3>
      <div class="comparison-bars">
        <div class="comparison-bar">
          <div class="bar-label">
            <span>Income</span>
            <span class="bar-value">${{ totalIncome.toLocaleString() }}</span>
          </div>
          <div class="bar-container">
            <div 
              class="bar-fill bar-fill--income"
              :style="{ width: '100%' }"
            />
          </div>
        </div>

        <div class="comparison-bar">
          <div class="bar-label">
            <span>Expenses</span>
            <span class="bar-value">${{ totalExpenses.toLocaleString() }}</span>
          </div>
          <div class="bar-container">
            <div 
              class="bar-fill bar-fill--expenses"
              :style="{ 
                width: totalIncome > 0 ? `${(totalExpenses / totalIncome) * 100}%` : '0%' 
              }"
            />
          </div>
        </div>

        <div class="comparison-bar">
          <div class="bar-label">
            <span>Balance</span>
            <span class="bar-value" :class="{ 'negative': balance < 0 }">
              ${{ balance.toLocaleString() }}
            </span>
          </div>
          <div class="bar-container">
            <div 
              class="bar-fill bar-fill--balance"
              :style="{ 
                width: totalIncome > 0 ? `${Math.abs(balance / totalIncome) * 100}%` : '0%',
                backgroundColor: balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PieChart from './PieChart.vue'
import { useBudget } from '~/composables/useBudget'
import { computed } from 'vue'

const { 
  totalIncome, 
  totalExpenses, 
  balance, 
  expensesByCategory,
  incomeBySource,
  expenses,
  incomeItems
} = useBudget()

const expensesChartData = computed(() => 
  Object.entries(expensesByCategory.value).map(([category, amount]) => ({
    label: category,
    value: amount
  }))
)

const incomeChartData = computed(() => 
  Object.entries(incomeBySource.value).map(([source, amount]) => ({
    label: source,
    value: amount
  }))
)

const averageExpense = computed(() => {
  return expenses.value.length > 0 
    ? totalExpenses.value / expenses.value.length 
    : 0
})

const averageIncome = computed(() => {
  return incomeItems.value.length > 0 
    ? totalIncome.value / incomeItems.value.length 
    : 0
})

const topExpenseCategory = computed(() => {
  const entries = Object.entries(expensesByCategory.value)
  if (entries.length === 0) return null
  
  return entries.reduce((max, [category, amount]) => {
    return amount > max.amount ? { category, amount } : max
  }, { category: '', amount: 0 })
})

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0
  return ((balance.value / totalIncome.value) * 100).toFixed(1)
})
</script>


<style scoped>
.reports-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.reports-view h2 {
  margin: 0;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.insight-card {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.insight-card h3 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-xl);
}

.insight-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.insight-card li {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
}

.insight-card li:last-child {
  border-bottom: none;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.chart-card {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
  color: var(--color-text-secondary);
  min-height: 350px;
}

.comparison-card {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.comparison-card h3 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-xl);
}

.comparison-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.comparison-bar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.bar-value {
  color: var(--color-text);
}

.bar-value.negative {
  color: var(--color-danger);
}

.bar-container {
  width: 100%;
  height: 24px;
  background-color: var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width var(--transition-base);
  border-radius: var(--radius-md);
}

.bar-fill--income {
  background-color: var(--color-success);
}

.bar-fill--expenses {
  background-color: var(--color-warning);
}

.bar-fill--balance {
  background-color: var(--color-primary);
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
