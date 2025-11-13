<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1 class="app-title">
          <span class="material-symbols-rounded title-icon">account_balance_wallet</span>
          Monthly Budget Planner
        </h1>
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
          <BudgetOverview 
            v-if="currentTab === 'overview'" 
            @navigate-to-tab="currentTab = $event"
          />
          <ExpensesView v-else-if="currentTab === 'expenses'" />
          <IncomeView v-else-if="currentTab === 'income'" />
          <ReportsView v-else-if="currentTab === 'reports'" />
          <PreviousMonthView v-else-if="currentTab === 'previous'" />
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
import { ref, onMounted } from 'vue'
import Tabs from '~/components/Tabs.vue'
import BudgetOverview from '~/components/BudgetOverview.vue'
import ExpensesView from '~/components/ExpensesView.vue'
import IncomeView from '~/components/IncomeView.vue'
import ReportsView from '~/components/ReportsView.vue'
import PreviousMonthView from '~/components/PreviousMonthView.vue'
import { useBudget } from '~/composables/useBudget'
import { useBudgetHistory } from '~/composables/useBudgetHistory'

// Meta tags
useHead({
  title: 'Monthly Budget Planner',
  meta: [
    { name: 'description', content: 'Track and manage your monthly budget with ease' }
  ]
})

// Initialize budget data
const { initializeBudget } = useBudget()
const { checkAndHandleMonthChange } = useBudgetHistory()

onMounted(() => {
  initializeBudget()
  // Check if month has changed and handle automatic archival
  const monthChanged = checkAndHandleMonthChange()
  if (monthChanged) {
    console.log('New month detected - previous month data archived')
  }
})

const currentTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'expenses', label: 'Expenses', icon: 'payments' },
  { id: 'income', label: 'Income', icon: 'account_balance_wallet' },
  { id: 'reports', label: 'Reports', icon: 'analytics' },
  { id: 'previous', label: 'History', icon: 'history' }
]
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
}

.header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: var(--spacing-xl) 0 var(--spacing-2xl);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    var(--color-accent) 0%, 
    var(--color-accent-orange) 50%, 
    var(--color-accent-mint) 100%
  );
}

.app-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-4xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.title-icon {
  font-size: var(--icon-xl);
  animation: floatPulse 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

@keyframes floatPulse {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-4px) scale(1.05);
  }
}

.app-subtitle {
  margin: var(--spacing-sm) 0 0;
  opacity: 0.95;
  font-size: var(--font-size-lg);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.main {
  flex: 1;
  padding: var(--spacing-xl) 0 var(--spacing-2xl);
}

.budget-tabs {
  margin-bottom: var(--spacing-xl);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: var(--color-background);
  padding: var(--spacing-md) 0;
  backdrop-filter: blur(10px);
}

.tab-content {
  animation: fadeSlideIn var(--transition-base) ease-out;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-xl) 0;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.footer p {
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .app-title {
    font-size: var(--font-size-3xl);
  }
  
  .title-icon {
    font-size: var(--icon-lg);
  }
  
  .main {
    padding: var(--spacing-md) 0 calc(var(--spacing-3xl) + var(--touch-target));
  }
}
</style>
