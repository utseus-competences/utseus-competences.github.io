<template>
  <div class="recommendation-panel">
    <div v-if="store.recommendations.length === 0" class="empty-state">
      <p v-if="!store.selectedCareer">Select a career to get recommendations.</p>
      <p v-else-if="store.matchPercentage >= 90">Strong coverage for this career.</p>
      <p v-else>Add courses to see personalized recommendations.</p>
    </div>
    
    <div v-else class="recommendations-list">
      <div v-for="rec in store.recommendations.slice(0, 5)" :key="rec.bc" 
           :class="['recommendation-item', rec.status]">
        <div class="rec-header">
          <div class="rec-bc">
            <span class="bc-label" 
                  @mouseenter="(e) => showTooltip(e.target, getBCDescription(rec.bc))"
                  @mouseleave="hideTooltip">{{ rec.bc }}</span>
            <span class="gap-badge">Gap: {{ rec.gap }}</span>
          </div>
          <span :class="['status-badge', rec.status]">{{ rec.status }}</span>
        </div>
        <p class="rec-reason">{{ rec.reason }}</p>
        <div class="rec-courses">
          <div v-for="course in rec.courses" :key="course.id" 
               :class="['rec-course', { selected: store.isCourseSelected(course.id) }]"
               @click="store.toggleCourse(course.id)"
               :title="course.name">
            <div class="course-checkbox">
              <input 
                type="checkbox" 
                :checked="store.isCourseSelected(course.id)"
                @click.stop
                @change="store.toggleCourse(course.id)"
              />
            </div>
            <div class="course-details">
              <span class="course-name">{{ course.name }}</span>
              <span class="course-contribution">+{{ course.contributionToBC }} {{ rec.bc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import { showTooltip, hideTooltip } from '../composables/useTooltip.js'

const store = useAppStore()

function getBCDescription(bcId) {
  const bc = store.competencies.bc[bcId]
  return bc ? `${bc.name}: ${bc.description}` : bcId
}
</script>

<style scoped>
.recommendation-panel {
  padding: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 1.5rem;
  color: var(--color-text-light);
  background: #f8f9fa;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recommendation-item {
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-left: 3px solid transparent;
}

.recommendation-item.critical { border-left-color: var(--color-danger); }
.recommendation-item.important { border-left-color: var(--color-warning); }
.recommendation-item.minor { border-left-color: var(--color-info); }

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.rec-bc {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.bc-label {
  font-weight: 600;
  color: var(--color-text);
  cursor: help;
}

.gap-badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  background: rgba(192, 57, 43, 0.1);
  color: var(--color-danger);
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.status-badge {
  font-size: 0.65rem;
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  font-weight: 600;
}

.status-badge.critical { background: rgba(192, 57, 43, 0.1); color: var(--color-danger); }
.status-badge.important { background: rgba(243, 156, 18, 0.1); color: var(--color-warning); }
.status-badge.minor { background: rgba(41, 128, 185, 0.1); color: var(--color-info); }

.rec-reason {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.rec-courses {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.rec-course {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  background: #f8f9fa;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.1s;
  border: 1px solid transparent;
}

.rec-course:hover {
  background: #e9ecef;
  border-color: var(--color-border);
}

.rec-course.selected {
  background: #d4edda;
  border-color: var(--color-success);
}

.course-checkbox {
  display: flex;
  align-items: center;
}

.course-details {
  display: flex;
  justify-content: space-between;
  flex: 1;
  gap: 1rem;
  min-width: 0;
}

.course-name {
  font-size: 0.85rem;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-contribution {
  font-size: 0.75rem;
  color: var(--color-accent);
  font-weight: 500;
  white-space: nowrap;
}
</style>
