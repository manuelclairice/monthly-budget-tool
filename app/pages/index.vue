<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1 class="app-title">
              <span class="material-symbols-rounded title-icon">account_balance_wallet</span>
              Monthly Budget Planner
            </h1>
            <p class="app-subtitle">Track your income and expenses with ease</p>
          </div>
          <div class="header-right">
            <div v-if="user" class="user-menu">
              <button @click="showUserDropdown = !showUserDropdown" class="user-button">
                <span class="material-symbols-rounded">account_circle</span>
                <span class="user-name">{{ userDisplayName }}</span>
                <span class="material-symbols-rounded dropdown-icon">arrow_drop_down</span>
              </button>
              <div v-if="showUserDropdown" class="user-dropdown">
                <div class="user-info">
                  <p class="user-email">{{ user.email }}</p>
                </div>
                <button @click="handleSignOut" class="dropdown-item" :disabled="loading">
                  <span class="material-symbols-rounded">logout</span>
                  <span>{{ loading ? 'Signing out...' : 'Sign Out' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import Tabs from '~/components/Tabs.vue'
import BudgetOverview from '~/components/BudgetOverview.vue'
import ExpensesView from '~/components/ExpensesView.vue'
import IncomeView from '~/components/IncomeView.vue'
import ReportsView from '~/components/ReportsView.vue'
import PreviousMonthView from '~/components/PreviousMonthView.vue'
import { useBudget } from '~/composables/useBudget'
import { useBudgetHistory } from '~/composables/useBudgetHistory'

definePageMeta({
  middleware: 'auth'
})

// Meta tags
useHead({
  title: 'Monthly Budget Planner',
  meta: [
    { name: 'description', content: 'Track and manage your monthly budget with ease' }
  ]
})

// Auth
const { user, signOut, loading } = useAuth()
const showUserDropdown = ref(false)

const userDisplayName = computed(() => {
  if (!user.value) return ''
  return user.value.user_metadata?.full_name || user.value.email?.split('@')[0] || 'User'
})

const handleSignOut = async () => {
  showUserDropdown.value = false
  await signOut()
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu')) {
      showUserDropdown.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  return () => document.removeEventListener('click', handleClickOutside)
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
}

.header-left {
  flex: 1;
}

.header-right {
  position: relative;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
}

.user-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.dropdown-icon {
  font-size: var(--icon-sm);
  transition: transform var(--transition-fast);
}

.user-button:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  min-width: 240px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
  animation: dropdownSlide 0.2s ease-out;
  z-index: var(--z-dropdown);
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.user-email {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  word-break: break-all;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.dropdown-item:hover:not(:disabled) {
  background: var(--color-surface);
  color: var(--color-accent);
}

.dropdown-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dropdown-item .material-symbols-rounded {
  font-size: var(--icon-md);
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

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .user-button {
    width: 100%;
    justify-content: center;
  }

  .user-dropdown {
    left: 0;
    right: 0;
  }

  .user-name {
    display: none;
  }
}
</style>
