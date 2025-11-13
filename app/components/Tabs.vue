<template>
  <div class="tabs">
    <div
      role="tablist"
      aria-label="Budget sections"
      class="tabs-list"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :id="`tab-${tab.id}`"
        role="tab"
        type="button"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        :disabled="tab.disabled"
        :class="[
          'tab',
          { 
            'tab--active': activeTab === tab.id,
            'tab--disabled': tab.disabled
          }
        ]"
        @click="selectTab(tab.id, tab.disabled)"
        @keydown="handleKeydown($event, index)"
      >
        <span v-if="tab.icon" class="tab-icon" aria-hidden="true">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div
      v-for="tab in tabs"
      :key="`panel-${tab.id}`"
      :id="`panel-${tab.id}`"
      role="tabpanel"
      :aria-labelledby="`tab-${tab.id}`"
      :hidden="activeTab !== tab.id"
      class="tab-panel"
    >
      <slot :name="tab.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Tab {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

interface Props {
  tabs: Tab[]
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits<Emits>()

const activeTab = computed({
  get: () => props.modelValue || props.tabs[0]?.id || '',
  set: (value: string) => emit('update:modelValue', value)
})

const selectTab = (tabId: string, disabled?: boolean) => {
  if (disabled) return
  activeTab.value = tabId
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  const { key } = event
  let newIndex = index

  switch (key) {
    case 'ArrowLeft':
      event.preventDefault()
      newIndex = index > 0 ? index - 1 : props.tabs.length - 1
      break
    case 'ArrowRight':
      event.preventDefault()
      newIndex = index < props.tabs.length - 1 ? index + 1 : 0
      break
    case 'Home':
      event.preventDefault()
      newIndex = 0
      break
    case 'End':
      event.preventDefault()
      newIndex = props.tabs.length - 1
      break
    default:
      return
  }

  // Skip disabled tabs
  while (props.tabs[newIndex]?.disabled && newIndex !== index) {
    newIndex = key === 'ArrowLeft' || key === 'Home' 
      ? (newIndex > 0 ? newIndex - 1 : props.tabs.length - 1)
      : (newIndex < props.tabs.length - 1 ? newIndex + 1 : 0)
  }

  if (!props.tabs[newIndex]?.disabled) {
    selectTab(props.tabs[newIndex].id)
    // Focus the new tab
    const tabElements = document.querySelectorAll('[role="tab"]')
    ;(tabElements[newIndex] as HTMLElement)?.focus()
  }
}
</script>

<style scoped>
.tabs {
  width: 100%;
}

.tabs-list {
  display: flex;
  gap: var(--spacing-sm);
  border-bottom: 2px solid var(--color-border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.tabs-list::-webkit-scrollbar {
  height: 4px;
}

.tabs-list::-webkit-scrollbar-track {
  background: var(--color-surface);
}

.tabs-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
}

.tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: 500;
  white-space: nowrap;
  transition: all var(--transition-fast);
  position: relative;
  margin-bottom: -2px;
}

.tab:hover:not(.tab--disabled) {
  color: var(--color-text);
  background-color: var(--color-surface);
}

.tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
  z-index: 1;
}

.tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-icon {
  font-size: var(--font-size-lg);
  line-height: 1;
}

.tab-label {
  line-height: 1;
}

.tab-panel {
  padding-top: var(--spacing-lg);
}

.tab-panel[hidden] {
  display: none;
}

/* Mobile optimization */
@media (max-width: 640px) {
  .tab {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }
  
  .tab-icon {
    font-size: var(--font-size-base);
  }
}
</style>
