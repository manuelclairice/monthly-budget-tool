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
            <label for="amount">Amount (€)</label>
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
        <!-- Edit Mode -->
        <template v-if="editingId === expense.id">
          <div class="edit-form">
            <div class="form-group">
              <label :for="`edit-description-${expense.id}`">Description</label>
              <input
                :id="`edit-description-${expense.id}`"
                v-model="editForm.description"
                type="text"
                required
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label :for="`edit-amount-${expense.id}`">Amount (€)</label>
                <input
                  :id="`edit-amount-${expense.id}`"
                  v-model.number="editForm.amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              <div class="form-group">
                <label :for="`edit-category-${expense.id}`">Category</label>
                <select :id="`edit-category-${expense.id}`" v-model="editForm.category">
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
            </div>
            <div class="edit-actions">
              <button class="btn btn-primary btn-sm" @click="saveEdit(expense.id)">
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
          <div class="expense-icon">
            <span class="material-symbols-rounded">{{ getCategoryIcon(expense.category) }}</span>
          </div>
          <div class="expense-details">
            <h4>{{ expense.description }}</h4>
            <p class="expense-meta">
              {{ expense.category }} • {{ formatDate(expense.date) }}
            </p>
          </div>
          <div class="expense-amount">
            €{{ expense.amount.toLocaleString() }}
          </div>
          <button
            class="btn-icon btn-icon--edit"
            @click="startEdit(expense)"
            :aria-label="`Edit ${expense.description}`"
            title="Edit expense"
          >
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button
            class="btn-icon btn-icon--delete"
            @click="removeExpense(expense.id)"
            :aria-label="`Delete ${expense.description}`"
            title="Delete expense"
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
import type { Expense } from '~/types/budget'

const { addExpense, removeExpense, updateExpense, expenses } = useBudget()

const showForm = ref(false)
const editingId = ref<string | null>(null)

const newExpense = ref({
  description: '',
  amount: 0,
  category: 'Food & Dining'
})

const editForm = ref({
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

const startEdit = (expense: Expense) => {
  editingId.value = expense.id
  editForm.value = {
    description: expense.description,
    amount: expense.amount,
    category: expense.category
  }
}

const saveEdit = (id: string) => {
  if (editForm.value.description && editForm.value.amount > 0) {
    updateExpense(id, {
      description: editForm.value.description,
      amount: editForm.value.amount,
      category: editForm.value.category
    })
    cancelEdit()
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {
    description: '',
    amount: 0,
    category: 'Food & Dining'
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
    'Food & Dining': 'restaurant',
    'Transportation': 'directions_car',
    'Housing': 'home',
    'Utilities': 'bolt',
    'Entertainment': 'videogame_asset',
    'Healthcare': 'medical_services',
    'Shopping': 'shopping_bag',
    'Other': 'category'
  }
  return icons[category] || 'category'
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

.expense-form {
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-accent);
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

.expenses-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  border: 1px solid var(--color-accent);
  border-left-width: 4px;
}

.expense-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
  border-left-color: var(--color-primary-dark);
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

.expense-icon {
  font-size: 2rem;
  line-height: 1;
  color: var(--color-primary);
  transition: transform var(--transition-fast);
}

.expense-item:hover .expense-icon {
  transform: scale(1.1);
}

.expense-icon .material-symbols-rounded {
  font-size: 2rem;
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
