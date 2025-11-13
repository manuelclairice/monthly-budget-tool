<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1 class="app-title">💰 Monthly Budget Planner</h1>
        <p class="app-subtitle">Track your income and expenses with ease</p>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <Tabs 
          v-model="currentTab" 
          :tabs="tabs"
          class="budget-tabs"
        />

        <div class="tab-content">
          <BudgetOverview v-if="currentTab === 'overview'" />
          <ExpensesView v-else-if="currentTab === 'expenses'" />
          <IncomeView v-else-if="currentTab === 'income'" />
          <ReportsView v-else-if="currentTab === 'reports'" />
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Monthly Budget Planner. Built with Nuxt 4.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Tabs from '~/components/Tabs.vue'
import BudgetOverview from '~/components/BudgetOverview.vue'
import ExpensesView from '~/components/ExpensesView.vue'
import IncomeView from '~/components/IncomeView.vue'
import ReportsView from '~/components/ReportsView.vue'
import { useBudget } from '~/composables/useBudget'

// Meta tags
useHead({
  title: 'Monthly Budget Planner',
  meta: [
    { name: 'description', content: 'Track and manage your monthly budget with ease' }
  ]
})

// Initialize budget data
const { initializeBudget } = useBudget()
initializeBudget()

const currentTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'expenses', label: 'Expenses', icon: '💰' },
  { id: 'income', label: 'Income', icon: '💵' },
  { id: 'reports', label: 'Reports', icon: '📈' }
]
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: var(--spacing-2xl) 0;
  box-shadow: var(--shadow-md);
}

.app-title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: 700;
}

.app-subtitle {
  margin: var(--spacing-sm) 0 0;
  opacity: 0.9;
  font-size: var(--font-size-lg);
}

.main {
  flex: 1;
  padding: var(--spacing-2xl) 0;
}

.budget-tabs {
  margin-bottom: var(--spacing-xl);
}

.tab-content {
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.footer p {
  margin: 0;
}
</style>
