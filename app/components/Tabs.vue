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
        <span v-if="tab.icon" class="material-symbols-rounded tab-icon" aria-hidden="true">
          {{ tab.icon }}
        </span>
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

  const targetTab = props.tabs[newIndex]
  if (targetTab && !targetTab.disabled) {
    selectTab(targetTab.id)
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
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  background-color: var(--color-surface);
  padding: var(--spacing-sm) 0;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.tabs-list::-webkit-scrollbar {
  display: none;
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius-xl);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  transition: all var(--transition-fast);
  position: relative;
  min-height: var(--touch-target);
  cursor: pointer;
}

.tab:hover:not(.tab--disabled) {
  color: var(--color-primary);
  background-color: rgba(0, 180, 216, 0.08);
  transform: translateY(-2px);
  border-color: var(--color-primary-light);
}

.tab:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  z-index: var(--z-base);
}

.tab--active {
  color: var(--color-primary);
  background-color: rgba(0, 180, 216, 0.08);
  font-weight: var(--font-weight-semibold);
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
}

.tab--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tab-icon {
  font-size: var(--icon-md);
  line-height: 1;
  transition: transform var(--transition-bounce);
}

.tab:hover:not(.tab--disabled) .tab-icon {
  transform: scale(1.15);
}

.tab--active .tab-icon {
  transform: scale(1.2);
  animation: iconBounce 0.6s ease-out;
}

@keyframes iconBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.2);
  }
}

.tab-label {
  line-height: 1.2;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.tab--active .tab-label {
  font-weight: var(--font-weight-bold);
}

.tab-panel {
  padding-top: var(--spacing-lg);
}

.tab-panel[hidden] {
  display: none;
}

/* Desktop: Horizontal tabs */
@media (min-width: 769px) {
  .tabs-list {
    justify-content: center;
    gap: var(--spacing-md);
  }
  
  .tab {
    flex-direction: row;
    padding: var(--spacing-md) var(--spacing-xl);
  }
  
  .tab-label {
    font-size: var(--font-size-base);
  }
}

/* Mobile: Bottom navigation bar */
@media (max-width: 768px) {
  .tabs {
    position: relative;
  }
  
  .tabs-list {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--z-sticky);
    background: white;
    border-top: 1px solid var(--color-border);
    border-bottom: none;
    border-radius: 0;
    padding: var(--spacing-xs) var(--spacing-sm) calc(var(--spacing-xs) + env(safe-area-inset-bottom));
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    justify-content: space-around;
    gap: 0;
  }
  
  .tab {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-xs);
    border-radius: var(--radius-lg);
    min-width: 0;
  }
  
  .tab-icon {
    font-size: var(--icon-lg);
  }
  
  .tab-label {
    font-size: 0.625rem;
    text-align: center;
  }
  
  .tab--active {
    transform: translateY(0);
  }
  
  .tab:hover:not(.tab--disabled) {
    transform: scale(1.05);
  }
}
</style>
