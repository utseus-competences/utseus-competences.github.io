<template>
  <div class="radar-chart-container">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
    <div class="radar-tooltip" v-if="tooltip.show" :style="tooltip.style">
      {{ tooltip.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const props = defineProps({
  width: { type: Number, default: 350 },
  height: { type: Number, default: 350 },
  showTarget: { type: Boolean, default: true },
  showCurrent: { type: Boolean, default: true }
})

const canvasRef = ref(null)
const store = useAppStore()

const bcList = computed(() => Object.keys(store.competencies.bc))

const tooltip = ref({
  show: false,
  text: '',
  style: {}
})

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
  
  // Calculate max value for scaling
  const maxValue = Math.max(
    12, // Minimum scale
    ...Object.values(store.selectedCareer?.bcWeights || {}),
    ...Object.values(store.currentBC)
  )
  
  // Draw grid circles (3 levels)
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath()
    ctx.strokeStyle = '#e9ecef'
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
  ctx.font = '11px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  bcList.value.forEach((bc, i) => {
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    // Draw axis line
    ctx.beginPath()
    ctx.strokeStyle = '#dee2e6'
    ctx.lineWidth = 1
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()
    
    // Draw label
    const labelX = centerX + Math.cos(angle) * (radius + 20)
    const labelY = centerY + Math.sin(angle) * (radius + 20)
    ctx.fillStyle = '#5d6d7e'
    ctx.fillText(bc, labelX, labelY)
  })
  
  // Draw target career data
  if (props.showTarget && store.selectedCareer) {
    drawDataLayer(ctx, centerX, centerY, radius, angleStep, store.selectedCareer.bcWeights, 'rgba(44, 62, 80, 0.15)', '#2c3e50', maxValue)
  }
  
  // Draw current student data
  if (props.showCurrent) {
    drawDataLayer(ctx, centerX, centerY, radius, angleStep, store.currentBC, 'rgba(39, 174, 96, 0.15)', '#27ae60', maxValue)
  }
}

function drawDataLayer(ctx, centerX, centerY, radius, angleStep, data, fillColor, strokeColor, maxValue) {
  const numAxes = bcList.value.length
  
  ctx.beginPath()
  bcList.value.forEach((bc, i) => {
    const value = data[bc] || 0
    const angle = i * angleStep - Math.PI / 2
    const r = (radius / maxValue) * value
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
    const r = (radius / maxValue) * value
    const x = centerX + Math.cos(angle) * r
    const y = centerY + Math.sin(angle) * r
    
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = strokeColor
    ctx.fill()
  })
}

function handleMouseMove(e) {
  const canvas = canvasRef.value
  if (!canvas || !store.selectedCareer) return
  
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const centerX = props.width / 2
  const centerY = props.height / 2
  const radius = Math.min(centerX, centerY) - 50
  const maxValue = Math.max(
    12,
    ...Object.values(store.selectedCareer?.bcWeights || {}),
    ...Object.values(store.currentBC)
  )
  const angleStep = (Math.PI * 2) / bcList.value.length
  
  // Check if mouse is near any BC point
  let found = false
  bcList.value.forEach((bc, i) => {
    if (found) return
    
    const targetValue = store.selectedCareer.bcWeights[bc] || 0
    const currentValue = store.currentBC[bc] || 0
    const angle = i * angleStep - Math.PI / 2
    
    // Check target point
    const targetR = (radius / maxValue) * targetValue
    const targetX = centerX + Math.cos(angle) * targetR
    const targetY = centerY + Math.sin(angle) * targetR
    const distTarget = Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2)
    
    if (distTarget < 10) {
      const bcData = store.competencies.bc[bc]
      tooltip.value = {
        show: true,
        text: `${bc}: ${bcData?.name || bc}\nTarget: ${targetValue}`,
        style: {
          left: e.clientX - rect.left + 10 + 'px',
          top: e.clientY - rect.top - 30 + 'px'
        }
      }
      found = true
      return
    }
    
    // Check current point
    const currentR = (radius / maxValue) * currentValue
    const currentX = centerX + Math.cos(angle) * currentR
    const currentY = centerY + Math.sin(angle) * currentR
    const distCurrent = Math.sqrt((x - currentX) ** 2 + (y - currentY) ** 2)
    
    if (distCurrent < 10) {
      const bcData = store.competencies.bc[bc]
      tooltip.value = {
        show: true,
        text: `${bc}: ${bcData?.name || bc}\nCurrent: ${currentValue}`,
        style: {
          left: e.clientX - rect.left + 10 + 'px',
          top: e.clientY - rect.top - 30 + 'px'
        }
      }
      found = true
    }
  })
  
  if (!found) {
    tooltip.value.show = false
  }
}

function handleMouseLeave() {
  tooltip.value.show = false
}

onMounted(() => {
  drawChart()
  const canvas = canvasRef.value
  if (canvas) {
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
  }
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
  position: relative;
}

canvas {
  max-width: 100%;
  height: auto;
  cursor: crosshair;
}

.radar-tooltip {
  position: absolute;
  background: rgba(44, 62, 80, 0.95);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: pre-line;
  pointer-events: none;
  z-index: 100;
  line-height: 1.4;
}
</style>
