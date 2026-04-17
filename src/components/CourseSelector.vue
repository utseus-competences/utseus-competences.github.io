<template>
  <div class="course-selector">
    <div class="selector-header">
      <h3>Select UTSEUS Courses</h3>
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
        :class="['course-item', 'tooltip', { selected: isSelected(course.id) }]"
        @click="toggleCourse(course.id)"
        :data-tooltip="getCourseTooltip(course)"
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
          <div class="course-name" :title="course.name">{{ course.name }}</div>
          <div v-if="course.nameCn" class="course-name-cn">{{ course.nameCn }}</div>
          <div class="course-meta">
            <span class="course-credits">{{ course.credits }} credits</span>
            <span class="bc-contributions">
              <span 
                v-for="(value, bc) in course.bcContribution" 
                :key="bc"
                v-if="value > 0"
                class="bc-tag tooltip"
                :data-tooltip="getBCDescription(bc)"
                :style="{ backgroundColor: getBCColor(bc), opacity: 0.15 + (value * 0.25) }"
              >
                {{ bc }}:{{ value }}
              </span>
            </span>
          </div>
        </div>
      </div>
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
  { value: 'undergraduate', label: 'Undergraduate (B3/B4)' },
  { value: 'graduate', label: 'Graduate (Master)' }
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

function getBCDescription(bcId) {
  const bc = store.competencies.bc[bcId]
  return bc ? `${bc.name}: ${bc.description}` : bcId
}

function getCourseTooltip(course) {
  return Object.entries(course.bcContribution)
    .filter(([_, value]) => value > 0)
    .map(([bc, value]) => {
      const bcName = store.competencies.bc[bc]?.name || bc
      return `${bc}: ${bcName} (+${value})`
    })
    .join('\n')
}
</script>

<style scoped>
.course-selector {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  border: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.875rem;
  flex-shrink: 0;
}

.selector-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.selector-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.625rem;
  font-size: 0.8rem;
}

.level-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border-light);
  padding-bottom: 0.5rem;
  flex-shrink: 0;
}

.tab-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-light);
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-weight: 400;
  font-size: 0.85rem;
}

.tab-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.search-box {
  margin-bottom: 0.75rem;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.courses-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  min-height: 0;
}

.course-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background 0.1s;
}

.course-item:last-child {
  border-bottom: none;
}

.course-item:hover {
  background: #f8f9fa;
}

.course-item.selected {
  background: #e8f4f8;
}

.course-checkbox {
  padding-top: 0.125rem;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-name {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-name-cn {
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin-top: 0.125rem;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.375rem;
  font-size: 0.75rem;
}

.course-credits {
  color: var(--color-text-light);
  white-space: nowrap;
}

.bc-contributions {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.bc-tag {
  padding: 0.125rem 0.375rem;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: help;
}

</style>
