<template>
  <div class="course-selector">
    <div class="selector-header">
      <h3>Select Your Courses</h3>
      <div class="selector-actions">
        <button @click="selectAll" class="btn btn-secondary btn-sm">Select All</button>
        <button @click="clearAll" class="btn btn-secondary btn-sm">Clear</button>
      </div>
    </div>
    
    <div class="level-tabs">
      <button 
        v-for="level in levels" 
        :key="level.value"
        @click="currentLevel = level.value"
        :class="['tab-btn', { active: currentLevel === level.value }]"
      >
        {{ level.label }}
      </button>
    </div>
    
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search courses..."
        class="search-input"
      />
    </div>
    
    <div class="courses-list">
      <div 
        v-for="course in filteredCourses" 
        :key="course.id"
        :class="['course-item', { selected: isSelected(course.id) }]"
        @click="toggleCourse(course.id)"
      >
        <div class="course-checkbox">
          <input 
            type="checkbox" 
            :checked="isSelected(course.id)"
            @click.stop
            @change="toggleCourse(course.id)"
          />
        </div>
        <div class="course-info">
          <div class="course-name">{{ course.name }}</div>
          <div v-if="course.nameCn" class="course-name-cn">{{ course.nameCn }}</div>
          <div class="course-meta">
            <span class="course-credits">{{ course.credits }} credits</span>
            <span class="bc-contributions">
              <span 
                v-for="(value, bc) in course.bcContribution" 
                :key="bc"
                v-if="value > 0"
                class="bc-tag"
                :style="{ backgroundColor: getBCColor(bc), opacity: 0.2 + (value * 0.25) }"
              >
                {{ bc }}:{{ value }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="selection-summary">
      <strong>{{ store.selectedCourses.length }}</strong> courses selected
      <span v-if="store.selectedCourses.length > 0" class="summary-detail">
        (Total: {{ totalCredits }} credits)
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
const currentLevel = ref('all')
const searchQuery = ref('')

const levels = [
  { value: 'all', label: 'All Courses' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate' }
]

const filteredCourses = computed(() => {
  let courses = store.courses
  
  if (currentLevel.value !== 'all') {
    courses = courses.filter(c => c.level === currentLevel.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    courses = courses.filter(c => 
      c.name.toLowerCase().includes(query) ||
      (c.nameCn && c.nameCn.toLowerCase().includes(query))
    )
  }
  
  return courses
})

const totalCredits = computed(() => {
  return store.selectedCourses.reduce((sum, courseId) => {
    const course = store.courses.find(c => c.id === courseId)
    return sum + (course?.credits || 0)
  }, 0)
})

function isSelected(courseId) {
  return store.isCourseSelected(courseId)
}

function toggleCourse(courseId) {
  store.toggleCourse(courseId)
}

function selectAll() {
  const ids = filteredCourses.value.map(c => c.id)
  store.selectCourses([...new Set([...store.selectedCourses, ...ids])])
}

function clearAll() {
  store.clearSelection()
}

function getBCColor(bcId) {
  const module = store.competencies.bc[bcId]?.module
  return store.competencies.modules[module]?.color || '#666'
}
</script>

<style scoped>
.course-selector {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.selector-header h3 {
  margin: 0;
}

.selector-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.85rem;
}

.level-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-text-light);
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.tab-btn.active {
  background: var(--color-primary);
  color: white;
}

.search-box {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.courses-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.course-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background 0.15s;
}

.course-item:last-child {
  border-bottom: none;
}

.course-item:hover {
  background: #f8fafc;
}

.course-item.selected {
  background: #eff6ff;
}

.course-checkbox {
  padding-top: 0.25rem;
}

.course-info {
  flex: 1;
}

.course-name {
  font-weight: 500;
  color: var(--color-text);
}

.course-name-cn {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.course-credits {
  color: var(--color-text-light);
}

.bc-contributions {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.bc-tag {
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text);
}

.selection-summary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
  color: var(--color-text-light);
}

.summary-detail {
  margin-left: 0.5rem;
}
</style>
