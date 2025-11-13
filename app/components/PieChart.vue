<template>
  <div class="pie-chart">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <div class="chart-container" :style="{ height: `${height}px` }">
      <canvas
        ref="canvasRef"
        role="img"
        :aria-label="`Pie chart showing ${title || 'data distribution'}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type PropType } from 'vue'
import { Chart, registerables, type ChartConfiguration } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

export interface ChartDataItem {
  label: string
  value: number
  color?: string
}

interface Props {
  data: ChartDataItem[]
  title?: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: 300
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)

const chartColors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#14b8a6', // teal
  '#6366f1'  // indigo
]

const chartData = computed(() => ({
  labels: props.data.map(item => item.label),
  datasets: [{
    data: props.data.map(item => item.value),
    backgroundColor: props.data.map((item, index) => 
      item.color || chartColors[index % chartColors.length]
    ),
    borderWidth: 2,
    borderColor: '#ffffff',
    hoverOffset: 10
  }]
}))

const chartConfig = computed<ChartConfiguration<'pie'>>(() => ({
  type: 'pie',
  data: chartData.value,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: $${value.toLocaleString()} (${percentage}%)`
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeInOutQuart'
    }
  }
}))

const initChart = () => {
  if (!canvasRef.value) return

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  // Create new chart
  chartInstance.value = new Chart(canvasRef.value, chartConfig.value)
}

const updateChart = () => {
  if (!chartInstance.value) {
    initChart()
    return
  }

  // Update existing chart
  chartInstance.value.data = chartData.value
  chartInstance.value.update('active')
}

onMounted(() => {
  initChart()
})

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// Cleanup on unmount
const onUnmounted = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
}

defineExpose({
  chart: chartInstance
})
</script>

<style scoped>
.pie-chart {
  width: 100%;
}

.chart-title {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text);
}

.chart-container {
  position: relative;
  width: 100%;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
