<template>
  <div class="gap-analysis">
    <div v-if="!store.selectedCareer" class="empty-state">
      <p>Please select a career goal to see your gap analysis.</p>
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
        <h4>Competency Breakdown</h4>
        <div class="bc-list">
          <div v-for="(data, bc) in store.gapAnalysis" :key="bc" 
               :class="['bc-item', data.status]">
            <div class="bc-header">
              <span class="bc-name">{{ bc }} - {{ getBCName(bc) }}</span>
              <span :class="['bc-status', data.status]">{{ data.status }}</span>
            </div>
            <div class="bc-bar">
              <div class="bar-track">
                <div class="bar-current" :style="{ width: (data.current / 3 * 100) + '%' }"></div>
                <div class="bar-target" :style="{ left: (data.target / 3 * 100) + '%' }"></div>
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
  if (percentage >= 80) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  if (percentage >= 60) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
}
</script>

<style scoped>
.gap-analysis {
  padding: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-light);
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.match-score {
  display: flex;
  justify-content: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-md);
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
}

.score-label {
  font-size: 0.85rem;
  opacity: 0.9;
}

.gap-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.summary-item {
  text-align: center;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: #f8fafc;
}

.summary-item.satisfied { border-top: 3px solid var(--color-success); }
.summary-item.minor { border-top: 3px solid var(--color-info); }
.summary-item.important { border-top: 3px solid var(--color-warning); }
.summary-item.critical { border-top: 3px solid var(--color-danger); }

.summary-count {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.summary-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.bc-breakdown h4 {
  margin-bottom: 1rem;
}

.bc-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bc-item {
  padding: 1rem;
  border-radius: var(--radius-md);
  background: #f8fafc;
  border-left: 4px solid transparent;
}

.bc-item.satisfied { border-left-color: var(--color-success); }
.bc-item.minor { border-left-color: var(--color-info); }
.bc-item.important { border-left-color: var(--color-warning); }
.bc-item.critical { border-left-color: var(--color-danger); }

.bc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.bc-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.bc-status {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  font-weight: 600;
}

.bc-status.satisfied { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.bc-status.minor { background: rgba(59, 130, 246, 0.1); color: var(--color-info); }
.bc-status.important { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
.bc-status.critical { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }

.bc-bar {
  margin-top: 0.5rem;
}

.bar-track {
  position: relative;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: visible;
}

.bar-current {
  height: 100%;
  background: var(--color-success);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-target {
  position: absolute;
  top: -4px;
  width: 4px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 2px;
  transform: translateX(-50%);
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.bc-gap {
  font-size: 0.8rem;
  color: var(--color-danger);
  margin-top: 0.5rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .gap-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
