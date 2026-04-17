<template>
  <div class="gap-analysis">
    <div v-if="!store.selectedCareer" class="empty-state">
      <p>Select a career goal to see your gap analysis.</p>
    </div>
    
    <div v-else-if="!store.gapAnalysis" class="empty-state">
      <p>Add some courses to see your competency analysis.</p>
    </div>
    
    <div v-else class="analysis-content">
      <div class="match-score">
        <div class="score-circle" :style="{ background: getScoreGradient() }">
          <span class="score-value">{{ store.matchPercentage }}%</span>
          <span class="score-label">Match</span>
        </div>
      </div>
      
      <div class="gap-summary">
        <div v-for="(count, status) in store.statusSummary" :key="status" 
             :class="['summary-item', status]">
          <span class="summary-count">{{ count }}</span>
          <span class="summary-label">{{ getStatusLabel(status) }}</span>
        </div>
      </div>
      
      <div class="bc-breakdown">
        <h4>Competency Details</h4>
        <div class="bc-list">
          <div v-for="(data, bc) in store.gapAnalysis" :key="bc" 
               :class="['bc-item', data.status]">
            <div class="bc-header">
              <span class="bc-name tooltip" :data-tooltip="getBCDescription(bc)">{{ bc }} - {{ getBCName(bc) }}</span>
              <span :class="['bc-status', data.status]">{{ data.status }}</span>
            </div>
            <div class="bc-bar">
              <div class="bar-track">
                <div class="bar-current" :style="{ width: Math.min(100, (data.target > 0 ? data.current / data.target * 100 : 0)) + '%' }"></div>
              </div>
              <div class="bar-labels">
                <span>Current: {{ data.current }}</span>
                <span>Target: {{ data.target }}</span>
              </div>
            </div>
            <div v-if="data.diff > 0" class="bc-gap">
              Gap: +{{ data.diff }} needed
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

function getBCName(bcId) {
  return store.competencies.bc[bcId]?.shortDesc || bcId
}

function getBCDescription(bcId) {
  const bc = store.competencies.bc[bcId]
  return bc ? `${bc.name}: ${bc.description}` : bcId
}

function getStatusLabel(status) {
  const labels = {
    satisfied: 'Satisfied',
    minor: 'Minor Gap',
    important: 'Important Gap',
    critical: 'Critical Gap'
  }
  return labels[status] || status
}

function getScoreGradient() {
  const percentage = store.matchPercentage
  if (percentage >= 80) return '#27ae60'
  if (percentage >= 60) return '#f39c12'
  return '#c0392b'
}
</script>

<style scoped>
.gap-analysis {
  padding: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.match-score {
  display: flex;
  justify-content: center;
}

.score-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.score-label {
  font-size: 0.7rem;
  opacity: 0.9;
}

.gap-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.summary-item {
  text-align: center;
  padding: 0.625rem;
  border-radius: var(--radius-sm);
  background: #f8f9fa;
  border: 1px solid var(--color-border-light);
}

.summary-item.satisfied { border-top: 2px solid var(--color-success); }
.summary-item.minor { border-top: 2px solid var(--color-info); }
.summary-item.important { border-top: 2px solid var(--color-warning); }
.summary-item.critical { border-top: 2px solid var(--color-danger); }

.summary-count {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}

.summary-label {
  font-size: 0.65rem;
  color: var(--color-text-light);
  text-transform: uppercase;
}

.bc-breakdown h4 {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.bc-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.bc-item {
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  background: #f8f9fa;
  border-left: 3px solid transparent;
}

.bc-item.satisfied { border-left-color: var(--color-success); }
.bc-item.minor { border-left-color: var(--color-info); }
.bc-item.important { border-left-color: var(--color-warning); }
.bc-item.critical { border-left-color: var(--color-danger); }

.bc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
}

.bc-name {
  font-weight: 500;
  font-size: 0.85rem;
  cursor: help;
}

.bc-status {
  font-size: 0.65rem;
  padding: 0.15rem 0.35rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  font-weight: 600;
}

.bc-status.satisfied { background: rgba(39, 174, 96, 0.1); color: var(--color-success); }
.bc-status.minor { background: rgba(41, 128, 185, 0.1); color: var(--color-info); }
.bc-status.important { background: rgba(243, 156, 18, 0.1); color: var(--color-warning); }
.bc-status.critical { background: rgba(192, 57, 43, 0.1); color: var(--color-danger); }

.bc-bar {
  margin-top: 0.375rem;
}

.bar-track {
  position: relative;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.bar-current {
  height: 100%;
  background: var(--color-success);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.bar-target {
  position: absolute;
  top: -2px;
  width: 3px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 2px;
  transform: translateX(-50%);
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--color-text-light);
  margin-top: 0.2rem;
}

.bc-gap {
  font-size: 0.75rem;
  color: var(--color-danger);
  margin-top: 0.375rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .gap-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
