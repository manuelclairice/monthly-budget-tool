<template>
  <div class="overview">
    <div class="stats-grid">
      <div 
        class="stat-card stat-card--clickable stat-card--income" 
        role="button"
        tabindex="0"
        @click="$emit('navigate-to-tab', 'income')"
        @keydown.enter="$emit('navigate-to-tab', 'income')"
        @keydown.space.prevent="$emit('navigate-to-tab', 'income')"
        aria-label="View Income details"
        title="Click to view Income"
      >
        <div class="stat-icon stat-icon--income">
          <span class="material-symbols-rounded">account_balance_wallet</span>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Income</p>
          <p class="stat-value">€{{ totalIncome.toLocaleString() }}</p>
        </div>
      </div>

      <div 
        class="stat-card stat-card--clickable stat-card--expenses"
        role="button"
        tabindex="0"
        @click="$emit('navigate-to-tab', 'expenses')"
        @keydown.enter="$emit('navigate-to-tab', 'expenses')"
        @keydown.space.prevent="$emit('navigate-to-tab', 'expenses')"
        aria-label="View Expenses details"
        title="Click to view Expenses"
      >
        <div class="stat-icon stat-icon--expenses">
          <span class="material-symbols-rounded">payments</span>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Expenses</p>
          <p class="stat-value">€{{ totalExpenses.toLocaleString() }}</p>
        </div>
      </div>

      <div class="stat-card stat-card--balance" :style="{ borderColor: budgetHealth.color }">
        <div class="stat-icon stat-icon--balance">
          <span class="material-symbols-rounded">account_balance</span>
        </div>
        <div class="stat-content">
          <p class="stat-label">Balance</p>
          <p class="stat-value" :style="{ color: budgetHealth.color }">
            €{{ balance.toLocaleString() }}
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

defineEmits<{
  'navigate-to-tab': [tabId: string]
}>()

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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  min-height: 140px;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  opacity: 0.05;
  transition: all var(--transition-slow);
}

.stat-card--income::before {
  background: var(--color-success);
  transform: translate(40%, -40%);
}

.stat-card--expenses::before {
  background: var(--color-warning);
  transform: translate(40%, -40%);
}

.stat-card--balance::before {
  background: var(--color-primary);
  transform: translate(40%, -40%);
}

.stat-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-6px);
  border-color: transparent;
}

.stat-card:hover::before {
  transform: translate(20%, -20%) scale(1.2);
  opacity: 0.1;
}

.stat-card--clickable {
  cursor: pointer;
  user-select: none;
}

.stat-card--clickable:active {
  transform: translateY(-3px) scale(0.98);
}

.stat-card--clickable:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  font-size: var(--icon-xl);
  flex-shrink: 0;
  transition: all var(--transition-bounce);
  position: relative;
  z-index: 1;
}

.stat-icon::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: var(--radius-xl);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.stat-card:hover .stat-icon::after {
  opacity: 0.2;
}

.stat-icon--income {
  background: linear-gradient(135deg, rgba(6, 214, 160, 0.15) 0%, rgba(168, 230, 207, 0.15) 100%);
  color: var(--color-success);
  box-shadow: 0 4px 16px rgba(6, 214, 160, 0.2);
}

.stat-icon--income::after {
  background: var(--color-success);
  box-shadow: 0 8px 24px rgba(6, 214, 160, 0.3);
}

.stat-icon--expenses {
  background: linear-gradient(135deg, rgba(255, 179, 71, 0.15) 0%, rgba(255, 179, 71, 0.25) 100%);
  color: var(--color-warning);
  box-shadow: 0 4px 16px rgba(255, 179, 71, 0.2);
}

.stat-icon--expenses::after {
  background: var(--color-warning);
  box-shadow: 0 8px 24px rgba(255, 179, 71, 0.3);
}

.stat-icon--balance {
  background: linear-gradient(135deg, rgba(0, 180, 216, 0.15) 0%, rgba(144, 224, 239, 0.15) 100%);
  color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(0, 180, 216, 0.2);
}

.stat-icon--balance::after {
  background: var(--color-primary);
  box-shadow: 0 8px 24px rgba(0, 180, 216, 0.3);
}

.stat-card--clickable:hover .stat-icon {
  transform: scale(1.15) rotate(-5deg);
}

.stat-content {
  flex: 1;
  min-width: 0;
  z-index: 1;
}

.stat-label {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-value {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text);
  line-height: 1;
  letter-spacing: -0.03em;
  font-family: var(--font-display);
}

.budget-health {
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, white 0%, rgba(0, 180, 216, 0.05) 100%);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xl);
  position: relative;
  overflow: hidden;
}

.budget-health::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--color-success) 0%, var(--color-warning) 50%, var(--color-danger) 100%);
}

.budget-health h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  font-family: var(--font-display);
}

.budget-health p {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: var(--font-size-base);
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: var(--color-background);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--color-border);
  position: relative;
}

.progress-fill {
  height: 100%;
  transition: width var(--transition-slow);
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--color-success) 0%, var(--color-warning) 70%, var(--color-danger) 100%);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  border-radius: var(--radius-full);
}

.progress-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-align: right;
  color: var(--color-text);
  margin: 0;
}

.chart-section {
  padding: var(--spacing-2xl);
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
}

.chart-section:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.empty-state {
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--color-text-secondary);
  background: linear-gradient(135deg, white 0%, rgba(0, 180, 216, 0.03) 100%);
  border-radius: var(--radius-2xl);
  border: 2px dashed var(--color-border);
  font-weight: 500;
  font-size: var(--font-size-base);
}

.empty-state::before {
  content: '📊';
  display: block;
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .stat-card {
    padding: var(--spacing-xl);
    min-height: 120px;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    font-size: var(--icon-lg);
  }
  
  .stat-value {
    font-size: var(--font-size-3xl);
  }
  
  .budget-health {
    padding: var(--spacing-xl);
  }
  
  .chart-section {
    padding: var(--spacing-lg);
  }
}
</style>
