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
            <label for="amount">Amount (€)</label>
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
        <!-- Edit Mode -->
        <template v-if="editingId === income.id">
          <div class="edit-form">
            <div class="form-group">
              <label :for="`edit-description-${income.id}`">Description</label>
              <input
                :id="`edit-description-${income.id}`"
                v-model="editForm.description"
                type="text"
                required
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label :for="`edit-amount-${income.id}`">Amount (€)</label>
                <input
                  :id="`edit-amount-${income.id}`"
                  v-model.number="editForm.amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              <div class="form-group">
                <label :for="`edit-source-${income.id}`">Source</label>
                <select :id="`edit-source-${income.id}`" v-model="editForm.source">
                  <option v-for="src in sources" :key="src" :value="src">
                    {{ src }}
                  </option>
                </select>
              </div>
            </div>
            <div class="edit-actions">
              <button class="btn btn-primary btn-sm" @click="saveEdit(income.id)">
                <span class="material-symbols-rounded btn-icon-inline">check</span>
                Save
              </button>
              <button class="btn btn-secondary btn-sm" @click="cancelEdit">
                <span class="material-symbols-rounded btn-icon-inline">close</span>
                Cancel
              </button>
            </div>
          </div>
        </template>

        <!-- View Mode -->
        <template v-else>
          <div class="income-icon">
            <span class="material-symbols-rounded">{{ getSourceIcon(income.source) }}</span>
          </div>
          <div class="income-details">
            <h4>{{ income.description }}</h4>
            <p class="income-meta">
              {{ income.source }} • {{ formatDate(income.date) }}
            </p>
          </div>
          <div class="income-amount">
            €{{ income.amount.toLocaleString() }}
          </div>
          <button
            class="btn-icon btn-icon--edit"
            @click="startEdit(income)"
            :aria-label="`Edit ${income.description}`"
            title="Edit income"
          >
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button
            class="btn-icon btn-icon--delete"
            @click="removeIncome(income.id)"
            :aria-label="`Delete ${income.description}`"
            title="Delete income"
          >
            <span class="material-symbols-rounded">delete</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBudget } from '~/composables/useBudget'
import type { Income } from '~/types/budget'

const { addIncome, removeIncome, updateIncome, incomeItems } = useBudget()

const showForm = ref(false)
const editingId = ref<string | null>(null)

const newIncome = ref({
  description: '',
  amount: 0,
  source: 'Salary'
})

const editForm = ref({
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

const startEdit = (income: Income) => {
  editingId.value = income.id
  editForm.value = {
    description: income.description,
    amount: income.amount,
    source: income.source
  }
}

const saveEdit = (id: string) => {
  if (editForm.value.description && editForm.value.amount > 0) {
    updateIncome(id, {
      description: editForm.value.description,
      amount: editForm.value.amount,
      source: editForm.value.source
    })
    cancelEdit()
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {
    description: '',
    amount: 0,
    source: 'Salary'
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
    'Salary': 'work',
    'Freelance': 'laptop_mac',
    'Investment': 'trending_up',
    'Business': 'business',
    'Gift': 'card_giftcard',
    'Other': 'payments'
  }
  return icons[source] || 'payments'
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
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon-inline {
  font-size: var(--icon-xs);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(107, 170, 158, 0.25);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(107, 170, 158, 0.3);
}

.btn-block {
  width: 100%;
}

.income-form {
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-accent);
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
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  background-color: var(--color-surface);
  color: var(--color-text);
  transition: all var(--transition-base);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(107, 170, 158, 0.1);
  background-color: var(--color-surface);
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
  position: relative;
}

.income-item:hover {
  box-shadow: var(--shadow-md);
}

.edit-form {
  width: 100%;
}

.edit-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.btn-secondary {
  background-color: var(--color-accent);
  color: var(--color-text);
  border: 1px solid var(--color-secondary);
}

.btn-secondary:hover {
  background-color: var(--color-secondary);
  color: var(--color-text);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.btn-secondary:active {
  transform: translateY(0);
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--touch-target);
  height: var(--touch-target);
  padding: 0;
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--icon-sm);
}

.btn-icon:hover {
  background-color: var(--color-accent);
  border-color: var(--color-secondary);
  transform: scale(1.05);
}

.btn-icon:active {
  transform: scale(0.95);
}

.btn-icon--edit {
  color: var(--color-primary);
}

.btn-icon--edit:hover {
  background-color: rgba(107, 170, 158, 0.1);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.btn-icon--delete {
  color: var(--color-danger);
}

.btn-icon--delete:hover {
  background-color: rgba(216, 154, 158, 0.1);
  border-color: var(--color-danger);
  color: #C5898D;
}

.income-icon {
  font-size: 2rem;
  line-height: 1;
  color: var(--color-success);
  transition: transform var(--transition-fast);
}

.income-item:hover .income-icon {
  transform: scale(1.1);
}

.income-icon .material-symbols-rounded {
  font-size: 2rem;
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
  white-space: nowrap;
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
