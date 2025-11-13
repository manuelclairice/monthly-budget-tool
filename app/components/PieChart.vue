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
  '#00B4D8', // Cyan
  '#7B68EE', // Purple
  '#FF6B9D', // Pink
  '#FFB347', // Orange
  '#A8E6CF', // Mint
  '#4CC9F0', // Sky blue
  '#C77DFF', // Lavender
  '#FFC6FF', // Light pink
  '#06D6A0', // Teal green
  '#FFD60A'  // Yellow
]

const chartData = computed(() => ({
  labels: props.data.map(item => item.label),
  datasets: [{
    data: props.data.map(item => item.value),
    backgroundColor: props.data.map((item, index) => 
      item.color || chartColors[index % chartColors.length]
    ),
    borderWidth: 4,
    borderColor: '#FFFFFF',
    hoverOffset: 16,
    hoverBorderColor: '#FFFFFF',
    hoverBorderWidth: 6
  }]
}))

const chartConfig = computed(() => ({
  type: 'pie' as const,
  data: chartData.value,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart' as const
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: 'Poppins, sans-serif',
            weight: 500 as const
          },
          usePointStyle: true,
          pointStyle: 'circle' as const,
          color: '#212529',
          boxWidth: 12,
          boxHeight: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: €${value.toLocaleString()} (${percentage}%)`
          }
        },
        backgroundColor: 'rgba(33, 37, 41, 0.95)',
        padding: 16,
        cornerRadius: 12,
        titleFont: {
          size: 15,
          weight: 600 as const,
          family: 'Poppins, sans-serif'
        },
        bodyFont: {
          size: 14,
          family: 'Poppins, sans-serif'
        },
        borderColor: 'rgba(0, 180, 216, 0.2)',
        borderWidth: 2
      }
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
  margin: 0 0 var(--spacing-xl) 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  font-family: var(--font-display);
}

.chart-container {
  position: relative;
  width: 100%;
  padding: var(--spacing-md);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(0, 180, 216, 0.02) 0%, rgba(123, 104, 238, 0.02) 100%);
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
