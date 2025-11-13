<template>
  <div class="overview">
    <div class="stats-grid">
      <div class="stat-card stat-card--income">
        <div class="stat-icon">💵</div>
        <div class="stat-content">
          <h3 class="stat-label">Total Income</h3>
          <p class="stat-value">${{ totalIncome.toLocaleString() }}</p>
        </div>
      </div>

      <div class="stat-card stat-card--expenses">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3 class="stat-label">Total Expenses</h3>
          <p class="stat-value">${{ totalExpenses.toLocaleString() }}</p>
        </div>
      </div>

      <div class="stat-card stat-card--balance" :style="{ borderColor: budgetHealth.color }">
        <div class="stat-icon">💳</div>
        <div class="stat-content">
          <h3 class="stat-label">Balance</h3>
          <p class="stat-value" :style="{ color: budgetHealth.color }">
            ${{ balance.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>

    <div class="budget-health" :style="{ borderLeftColor: budgetHealth.color }">
      <h3>Budget Health</h3>
      <p>{{ budgetHealth.message }}</p>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ 
            width: `${Math.min((totalExpenses / totalIncome) * 100, 100)}%`,
            backgroundColor: budgetHealth.color
          }"
        />
      </div>
      <p class="progress-text">
        {{ ((totalExpenses / totalIncome) * 100).toFixed(1) }}% of income spent
      </p>
    </div>

    <div v-if="expensesChartData.length > 0" class="chart-section">
      <PieChart 
        :data="expensesChartData"
        title="Expenses by Category"
        :height="350"
      />
    </div>
    <div v-else class="empty-state">
      <p>No expense data available. Start adding expenses to see your budget breakdown.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PieChart from './PieChart.vue'
import { useBudget } from '~/composables/useBudget'
import { computed } from 'vue'

const { totalIncome, totalExpenses, balance, expensesByCategory } = useBudget()

const expensesChartData = computed(() => 
  Object.entries(expensesByCategory.value).map(([category, amount]) => ({
    label: category,
    value: amount
  }))
)

const budgetHealth = computed(() => {
  const percentage = (totalExpenses.value / totalIncome.value) * 100
  if (percentage <= 70) return { status: 'healthy', color: 'var(--color-success)', message: 'Great job! You\'re within budget.' }
  if (percentage <= 90) return { status: 'warning', color: 'var(--color-warning)', message: 'You\'re approaching your budget limit.' }
  return { status: 'danger', color: 'var(--color-danger)', message: 'Warning! You\'re over budget.' }
})
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

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
  transition: all var(--transition-fast);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
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
  line-height: 1;
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
  color: var(--color-text);
}

.budget-health {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-left: 4px solid;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.budget-health h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-xl);
}

.budget-health p {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-secondary);
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.progress-fill {
  height: 100%;
  transition: width var(--transition-base);
  border-radius: var(--radius-xl);
}

.progress-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-align: right;
}

.chart-section {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-state {
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
