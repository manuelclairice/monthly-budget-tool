<template>
  <div class="income-view">
    <div class="header-actions">
      <h2>Income</h2>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : '+ Add Income' }}
      </button>
    </div>

    <div v-if="showForm" class="income-form">
      <h3>Add New Income</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="description">Description</label>
          <input
            id="description"
            v-model="newIncome.description"
            type="text"
            placeholder="e.g., Monthly salary"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="amount">Amount ($)</label>
            <input
              id="amount"
              v-model.number="newIncome.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div class="form-group">
            <label for="source">Source</label>
            <select id="source" v-model="newIncome.source">
              <option v-for="src in sources" :key="src" :value="src">
                {{ src }}
              </option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          Add Income
        </button>
      </form>
    </div>

    <div v-if="incomeItems.length === 0" class="empty-state">
      <p>No income recorded yet. Click "Add Income" to get started.</p>
    </div>

    <div v-else class="income-list">
      <div
        v-for="income in incomeItems"
        :key="income.id"
        class="income-item"
      >
        <div class="income-icon">{{ getSourceIcon(income.source) }}</div>
        <div class="income-details">
          <h4>{{ income.description }}</h4>
          <p class="income-meta">
            {{ income.source }} • {{ formatDate(income.date) }}
          </p>
        </div>
        <div class="income-amount">
          ${{ income.amount.toLocaleString() }}
        </div>
        <button
          class="btn-delete"
          @click="removeIncome(income.id)"
          aria-label="Delete income"
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

const { addIncome, removeIncome, incomeItems } = useBudget()

const showForm = ref(false)
const newIncome = ref({
  description: '',
  amount: 0,
  source: 'Salary'
})

const sources = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Gift',
  'Other'
]

const handleSubmit = () => {
  if (newIncome.value.description && newIncome.value.amount > 0) {
    addIncome({
      ...newIncome.value,
      date: new Date().toISOString()
    })
    
    // Reset form
    newIncome.value = {
      description: '',
      amount: 0,
      source: 'Salary'
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

const getSourceIcon = (source: string) => {
  const icons: Record<string, string> = {
    'Salary': '💼',
    'Freelance': '💻',
    'Investment': '📈',
    'Business': '🏢',
    'Gift': '🎁',
    'Other': '💰'
  }
  return icons[source] || '💰'
}
</script>

<style scoped>
.income-view {
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

.income-form {
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.income-form h3 {
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

.income-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.income-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-success);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.income-item:hover {
  box-shadow: var(--shadow-md);
}

.income-icon {
  font-size: 2rem;
  line-height: 1;
}

.income-details {
  flex: 1;
}

.income-details h4 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
}

.income-meta {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.income-amount {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-success);
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

  .income-item {
    flex-wrap: wrap;
  }

  .income-amount {
    width: 100%;
    text-align: right;
  }
}
</style>
