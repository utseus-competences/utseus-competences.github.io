<template>
  <div class="learning-path">
    <div class="container">
      <div class="page-header">
        <h1>Your Learning Path</h1>
        <p>Step-by-step course recommendations based on your career goal</p>
      </div>

      <div v-if="!store.selectedCareer" class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>No Career Selected</h3>
        <p>Please select a career goal first to generate your personalized learning path.</p>
        <router-link to="/careers" class="btn btn-primary">Explore Careers</router-link>
      </div>

      <div v-else-if="store.learningPath.length === 0" class="empty-state">
        <div class="empty-icon">✅</div>
        <h3>Excellent Coverage!</h3>
        <p>You have strong competency coverage for {{ store.selectedCareer.name }}.</p>
        <p v-if="store.matchPercentage < 100" class="sub-text">
          Your match score is {{ store.matchPercentage }}%. You may still benefit from additional courses.
        </p>
        <router-link to="/courses" class="btn btn-secondary">Browse More Courses</router-link>
      </div>

      <div v-else class="path-content">
        <div class="path-summary">
          <div class="summary-card">
            <span class="summary-label">Target Career</span>
            <span class="summary-value">{{ store.selectedCareer.name }}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Current Match</span>
            <span class="summary-value" :class="getMatchClass()">{{ store.matchPercentage }}%</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Recommended Steps</span>
            <span class="summary-value">{{ store.learningPath.length }}</span>
          </div>
        </div>

        <div class="path-timeline">
          <div v-for="(step, index) in store.learningPath" :key="step.id" 
               :class="['timeline-item', step.gapStatus]">
            <div class="timeline-marker">
              <span class="step-number">{{ index + 1 }}</span>
            </div>
            <div class="timeline-content">
              <div class="step-header">
                <h4>{{ step.name }}</h4>
                <span :class="['status-badge', step.gapStatus]">{{ step.gapStatus }}</span>
              </div>
              <p v-if="step.nameCn" class="step-cn">{{ step.nameCn }}</p>
              <div class="step-meta">
                <span class="credits">{{ step.credits }} credits</span>
                <span class="level">{{ step.level }}</span>
                <span class="primary-bc">Focus: {{ step.primaryBC }}</span>
              </div>
              <p class="step-reason">
                This course strengthens <strong>{{ step.primaryBC }}</strong>, 
                which is a {{ step.gapStatus }} gap in your profile.
              </p>
              <div class="bc-contributions">
                <span v-for="(value, bc) in step.bcContribution" :key="bc" 
                      v-if="value > 0"
                      class="bc-tag">
                  {{ bc }}: +{{ value }}
                </span>
              </div>
              <button 
                @click="store.toggleCourse(step.id)"
                :class="['btn', store.isCourseSelected(step.id) ? 'btn-primary' : 'btn-secondary']"
              >
                {{ store.isCourseSelected(step.id) ? '✓ Added to Plan' : 'Add to My Plan' }}
              </button>
            </div>
          </div>
        </div>

        <div class="path-actions">
          <router-link to="/dashboard" class="btn btn-primary">
            ← Back to Dashboard
          </router-link>
          <button @click="addAllToPlan" class="btn btn-secondary" v-if="hasUnselected">
            Add All Remaining to Plan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

const hasUnselected = computed(() => {
  return store.learningPath.some(step => !store.isCourseSelected(step.id))
})

function getMatchClass() {
  if (store.matchPercentage >= 80) return 'good'
  if (store.matchPercentage >= 60) return 'medium'
  return 'low'
}

function addAllToPlan() {
  store.learningPath.forEach(step => {
    if (!store.isCourseSelected(step.id)) {
      store.toggleCourse(step.id)
    }
  })
}
</script>

<style scoped>
.learning-path {
  padding-bottom: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--color-text-light);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

.sub-text {
  font-size: 0.9rem;
}

.path-content {
  max-width: 800px;
  margin: 0 auto;
}

.path-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: var(--color-surface);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--color-border);
}

.summary-label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.summary-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.summary-value.good { color: var(--color-success); }
.summary-value.medium { color: var(--color-warning); }
.summary-value.low { color: var(--color-danger); }

.path-timeline {
  position: relative;
  padding-left: 3rem;
}

.path-timeline::before {
  content: '';
  position: absolute;
  left: 1.25rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-border);
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.timeline-marker {
  position: absolute;
  left: -2.25rem;
  top: 0;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--color-surface);
  border: 3px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-text-light);
  z-index: 1;
}

.timeline-item.critical .timeline-marker {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.timeline-item.important .timeline-marker {
  border-color: var(--color-warning);
  color: var(--color-warning);
}

.timeline-item.minor .timeline-marker {
  border-color: var(--color-info);
  color: var(--color-info);
}

.timeline-content {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.step-header h4 {
  margin: 0;
  color: var(--color-primary);
}

.status-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  font-weight: 600;
}

.status-badge.critical { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }
.status-badge.important { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
.status-badge.minor { background: rgba(59, 130, 246, 0.1); color: var(--color-info); }

.step-cn {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
}

.step-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
}

.credits, .level, .primary-bc {
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.step-reason {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.bc-contributions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.bc-tag {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
}

.path-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .path-summary {
    grid-template-columns: 1fr;
  }
  
  .path-timeline {
    padding-left: 2rem;
  }
  
  .timeline-marker {
    left: -1.75rem;
    width: 2rem;
    height: 2rem;
    font-size: 0.85rem;
  }
}
</style>
