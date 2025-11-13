<template>
  <div class="expenses-view">
    <div class="header-actions">
      <h2>Expenses</h2>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : '+ Add Expense' }}
      </button>
    </div>

    <div v-if="showForm" class="expense-form">
      <h3>Add New Expense</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="description">Description</label>
          <input
            id="description"
            v-model="newExpense.description"
            type="text"
            placeholder="e.g., Grocery shopping"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="amount">Amount ($)</label>
            <input
              id="amount"
              v-model.number="newExpense.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" v-model="newExpense.category">
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          Add Expense
        </button>
      </form>
    </div>

    <div v-if="expenses.length === 0" class="empty-state">
      <p>No expenses recorded yet. Click "Add Expense" to get started.</p>
    </div>

    <div v-else class="expenses-list">
      <div
        v-for="expense in expenses"
        :key="expense.id"
        class="expense-item"
      >
        <div class="expense-icon">{{ getCategoryIcon(expense.category) }}</div>
        <div class="expense-details">
          <h4>{{ expense.description }}</h4>
          <p class="expense-meta">
            {{ expense.category }} • {{ formatDate(expense.date) }}
          </p>
        </div>
        <div class="expense-amount">
          ${{ expense.amount.toLocaleString() }}
        </div>
        <button
          class="btn-delete"
          @click="removeExpense(expense.id)"
          aria-label="Delete expense"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBudget } from '~/composables/useBudget'

const { addExpense, removeExpense, expenses } = useBudget()

const showForm = ref(false)
const newExpense = ref({
  description: '',
  amount: 0,
  category: 'Food & Dining'
})

const categories = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Other'
]

const handleSubmit = () => {
  if (newExpense.value.description && newExpense.value.amount > 0) {
    addExpense({
      ...newExpense.value,
      date: new Date().toISOString()
    })
    
    // Reset form
    newExpense.value = {
      description: '',
      amount: 0,
      category: 'Food & Dining'
    }
    showForm.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'Food & Dining': '🍔',
    'Transportation': '🚗',
    'Housing': '🏠',
    'Utilities': '💡',
    'Entertainment': '🎮',
    'Healthcare': '⚕️',
    'Shopping': '🛍️',
    'Other': '📦'
  }
  return icons[category] || '📦'
}
</script>

<style scoped>
.expenses-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions h2 {
  margin: 0;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

.btn-block {
  width: 100%;
}

.expense-form {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.expense-form h3 {
  margin: 0 0 var(--spacing-lg) 0;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color var(--transition-fast);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.expenses-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.expense-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.expense-item:hover {
  box-shadow: var(--shadow-md);
}

.expense-icon {
  font-size: 2rem;
  line-height: 1;
}

.expense-details {
  flex: 1;
}

.expense-details h4 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
}

.expense-meta {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.expense-amount {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
}

.btn-delete {
  padding: var(--spacing-sm);
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  opacity: 0.6;
  transition: all var(--transition-fast);
}

.btn-delete:hover {
  opacity: 1;
  transform: scale(1.1);
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
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .expense-item {
    flex-wrap: wrap;
  }

  .expense-amount {
    width: 100%;
    text-align: right;
  }
}
</style>
