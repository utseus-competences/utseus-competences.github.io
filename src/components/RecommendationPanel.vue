<template>
  <div class="recommendation-panel">
    <h3>Recommended Courses</h3>
    
    <div v-if="store.recommendations.length === 0" class="empty-state">
      <p v-if="!store.selectedCareer">Select a career to get recommendations.</p>
      <p v-else-if="store.matchPercentage >= 90">Great job! You have strong coverage for this career.</p>
      <p v-else>Add some courses to see personalized recommendations.</p>
    </div>
    
    <div v-else class="recommendations-list">
      <div v-for="rec in store.recommendations.slice(0, 5)" :key="rec.bc" 
           :class="['recommendation-item', rec.status]">
        <div class="rec-header">
          <div class="rec-bc">
            <span class="bc-label">{{ rec.bc }}</span>
            <span class="gap-badge">Gap: {{ rec.gap }}</span>
          </div>
          <span :class="['status-badge', rec.status]">{{ rec.status }}</span>
          </div>
        <p class="rec-reason">{{ rec.reason }}</p>
        <div class="rec-courses">
          <div v-for="course in rec.courses" :key="course.id" 
               :class="['rec-course', { selected: store.isCourseSelected(course.id) }]"
               @click="store.toggleCourse(course.id)">
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
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
</script>

<style scoped>
.recommendation-panel {
  padding: 1rem;
}

.recommendation-panel h3 {
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
  background: #f8fafc;
  border-radius: var(--radius-md);
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 4px solid transparent;
}

.recommendation-item.critical { border-left-color: var(--color-danger); }
.recommendation-item.important { border-left-color: var(--color-warning); }
.recommendation-item.minor { border-left-color: var(--color-info); }

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.rec-bc {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bc-label {
  font-weight: 600;
  color: var(--color-text);
}

.gap-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #fee2e2;
  color: var(--color-danger);
  border-radius: var(--radius-sm);
  font-weight: 500;
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

.rec-reason {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.rec-courses {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rec-course {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: #f8fafc;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.rec-course:hover {
  background: #f1f5f9;
  border-color: var(--color-border);
}

.rec-course.selected {
  background: #dbeafe;
  border-color: var(--color-primary);
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
}

.course-name {
  font-size: 0.9rem;
  color: var(--color-text);
}

.course-contribution {
  font-size: 0.8rem;
  color: var(--color-primary);
  font-weight: 500;
  white-space: nowrap;
}
</style>
