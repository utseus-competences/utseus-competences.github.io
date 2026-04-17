<template>
  <div class="radar-chart-container">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const props = defineProps({
  width: { type: Number, default: 400 },
  height: { type: Number, default: 400 },
  showTarget: { type: Boolean, default: true },
  showCurrent: { type: Boolean, default: true }
})

const canvasRef = ref(null)
const store = useAppStore()

const bcList = computed(() => Object.keys(store.competencies.bc))

function drawChart() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const centerX = props.width / 2
  const centerY = props.height / 2
  const radius = Math.min(centerX, centerY) - 50
  
  // Clear canvas
  ctx.clearRect(0, 0, props.width, props.height)
  
  const numAxes = bcList.value.length
  const angleStep = (Math.PI * 2) / numAxes
  
  // Draw grid circles
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath()
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    for (let j = 0; j < numAxes; j++) {
      const angle = j * angleStep - Math.PI / 2
      const r = (radius / 3) * i
      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r
      if (j === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }
  
  // Draw axes and labels
  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  bcList.value.forEach((bc, i) => {
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    // Draw axis line
    ctx.beginPath()
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()
    
    // Draw label
    const labelX = centerX + Math.cos(angle) * (radius + 25)
    const labelY = centerY + Math.sin(angle) * (radius + 25)
    ctx.fillStyle = '#475569'
    ctx.fillText(bc, labelX, labelY)
  })
  
  // Draw target career data
  if (props.showTarget && store.selectedCareer) {
    drawDataLayer(ctx, centerX, centerY, radius, angleStep, store.selectedCareer.bcWeights, 'rgba(59, 130, 246, 0.2)', '#3b82f6')
  }
  
  // Draw current student data
  if (props.showCurrent) {
    drawDataLayer(ctx, centerX, centerY, radius, angleStep, store.currentBC, 'rgba(16, 185, 129, 0.2)', '#10b981')
  }
}

function drawDataLayer(ctx, centerX, centerY, radius, angleStep, data, fillColor, strokeColor) {
  const numAxes = bcList.value.length
  
  ctx.beginPath()
  bcList.value.forEach((bc, i) => {
    const value = data[bc] || 0
    const angle = i * angleStep - Math.PI / 2
    const r = (radius / 3) * value
    const x = centerX + Math.cos(angle) * r
    const y = centerY + Math.sin(angle) * r
    
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  
  ctx.fillStyle = fillColor
  ctx.fill()
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 2
  ctx.stroke()
  
  // Draw points
  bcList.value.forEach((bc, i) => {
    const value = data[bc] || 0
    const angle = i * angleStep - Math.PI / 2
    const r = (radius / 3) * value
    const x = centerX + Math.cos(angle) * r
    const y = centerY + Math.sin(angle) * r
    
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = strokeColor
    ctx.fill()
  })
}

onMounted(() => {
  drawChart()
})

watch(() => [store.currentBC, store.selectedCareer, props.showTarget, props.showCurrent], () => {
  drawChart()
}, { deep: true })
</script>

<style scoped>
.radar-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
