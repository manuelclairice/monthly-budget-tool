import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PieChart from '~/components/PieChart.vue'

// Mock Chart.js
vi.mock('chart.js', () => {
  const ChartMock = Object.assign(
    vi.fn().mockImplementation(() => ({
      destroy: vi.fn(),
      update: vi.fn(),
      data: {}
    })),
    {
      register: vi.fn()
    }
  )
  
  return {
    Chart: ChartMock,
    registerables: []
  }
})

describe('PieChart Component', () => {
  const mockData = [
    { label: 'Category A', value: 100 },
    { label: 'Category B', value: 200 },
    { label: 'Category C', value: 150 }
  ]

  it('renders the chart container', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData
      }
    })

    expect(wrapper.find('.chart-container').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('displays the title when provided', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData,
        title: 'Test Chart'
      }
    })

    expect(wrapper.text()).toContain('Test Chart')
  })

  it('does not display title when not provided', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData
      }
    })

    expect(wrapper.find('.chart-title').exists()).toBe(false)
  })

  it('sets the correct height', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData,
        height: 400
      }
    })

    const container = wrapper.find('.chart-container')
    expect(container.attributes('style')).toContain('height: 400px')
  })

  it('uses default height when not specified', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData
      }
    })

    const container = wrapper.find('.chart-container')
    expect(container.attributes('style')).toContain('height: 300px')
  })

  it('has proper ARIA attributes for accessibility', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData,
        title: 'Expenses'
      }
    })

    const canvas = wrapper.find('canvas')
    expect(canvas.attributes('role')).toBe('img')
    expect(canvas.attributes('aria-label')).toContain('Pie chart showing Expenses')
  })
})
