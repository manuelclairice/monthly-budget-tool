import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from '~/components/Tabs.vue'

describe('Tabs Component', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1', icon: '📊' },
    { id: 'tab2', label: 'Tab 2', icon: '💰' },
    { id: 'tab3', label: 'Tab 3', icon: '📈' }
  ]

  it('renders all tabs', () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: mockTabs,
        modelValue: 'tab1'
      }
    })

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
    expect(wrapper.text()).toContain('Tab 1')
    expect(wrapper.text()).toContain('Tab 2')
    expect(wrapper.text()).toContain('Tab 3')
  })

  it('sets the first tab as active by default', () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: mockTabs
      }
    })

    const firstTab = wrapper.find('[role="tab"]')
    expect(firstTab.attributes('aria-selected')).toBe('true')
  })

  it('emits update:modelValue when tab is clicked', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: mockTabs,
        modelValue: 'tab1'
      }
    })

    const secondTab = wrapper.findAll('[role="tab"]')[1]!
    await secondTab.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tab2'])
  })

  it('applies active class to selected tab', () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: mockTabs,
        modelValue: 'tab2'
      }
    })

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs[1]!.classes()).toContain('tab--active')
    expect(tabs[0]!.classes()).not.toContain('tab--active')
  })

  it('handles keyboard navigation with arrow keys', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: mockTabs,
        modelValue: 'tab1'
      }
    })

    const firstTab = wrapper.find('[role="tab"]')
    await firstTab.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tab2'])
  })

  it('displays tab icons when provided', () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: mockTabs,
        modelValue: 'tab1'
      }
    })

    expect(wrapper.text()).toContain('📊')
    expect(wrapper.text()).toContain('💰')
  })

  it('disables tabs when disabled prop is true', () => {
    const disabledTabs = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2', disabled: true }
    ]

    const wrapper = mount(Tabs, {
      props: {
        tabs: disabledTabs,
        modelValue: 'tab1'
      }
    })

    const secondTab = wrapper.findAll('[role="tab"]')[1]!
    expect(secondTab.attributes('disabled')).toBeDefined()
    expect(secondTab.classes()).toContain('tab--disabled')
  })
})
