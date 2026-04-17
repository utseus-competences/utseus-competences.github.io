<template>
  <div class="course-explorer">
    <div class="container">
      <div class="page-header">
        <h1>Course Explorer</h1>
        <p>Browse all courses and their competency contributions</p>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Level</label>
          <select v-model="filters.level">
            <option value="all">All Levels</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Competency</label>
          <select v-model="filters.bc">
            <option value="all">All Competencies</option>
            <option v-for="bc in bcList" :key="bc.id" :value="bc.id">
              {{ bc.id }} - {{ bc.shortDesc }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>Module</label>
          <select v-model="filters.module">
            <option value="all">All Modules</option>
            <option v-for="mod in modules" :key="mod.id" :value="mod.id">
              {{ mod.name }}
            </option>
          </select>
        </div>
        <div class="filter-group search-group">
          <label>Search</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Search courses..."
            class="search-input"
          />
        </div>
      </div>

      <div class="courses-table-container">
        <table class="courses-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th class="center">Level</th>
              <th class="center">Credits</th>
              <th v-for="bc in displayedBCs" :key="bc" class="center bc-col">
                {{ bc }}
              </th>
              <th class="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in filteredCourses" :key="course.id" 
                :class="{ selected: store.isCourseSelected(course.id) }">
              <td>
                <div class="course-name-cell">
                  <strong>{{ course.name }}</strong>
                  <span v-if="course.nameCn" class="course-name-cn">{{ course.nameCn }}</span>
                </div>
              </td>
              <td class="center">
                <span :class="['level-badge', course.level]">
                  {{ course.level === 'undergraduate' ? 'UG' : 'GR' }}
                </span>
              </td>
              <td class="center">{{ course.credits }}</td>
              <td v-for="bc in displayedBCs" :key="bc" class="center">
                <span v-if="course.bcContribution[bc]" 
                      :class="['bc-value', 'level-' + course.bcContribution[bc]]">
                  {{ course.bcContribution[bc] }}
                </span>
                <span v-else class="bc-value empty">-</span>
              </td>
              <td class="center">
                <button 
                  @click="store.toggleCourse(course.id)"
                  :class="['btn', store.isCourseSelected(course.id) ? 'btn-primary' : 'btn-secondary']"
                >
                  {{ store.isCourseSelected(course.id) ? 'Selected' : 'Select' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="summary-bar">
        <span>Showing {{ filteredCourses.length }} of {{ store.courses.length }} courses</span>
        <span v-if="store.selectedCourses.length > 0">
          | {{ store.selectedCourses.length }} courses selected
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

const filters = ref({
  level: 'all',
  bc: 'all',
  module: 'all',
  search: ''
})

const bcList = computed(() => Object.values(store.competencies.bc))
const modules = computed(() => Object.values(store.competencies.modules))

const displayedBCs = computed(() => {
  if (filters.value.bc === 'all') {
    return ['BC1', 'BC2', 'BC3', 'BC4', 'BC5', 'BC6', 'BC7', 'BC8', 'BC9', 'BC10', 'BC11']
  }
  return [filters.value.bc]
})

const filteredCourses = computed(() => {
  let courses = [...store.courses]

  if (filters.value.level !== 'all') {
    courses = courses.filter(c => c.level === filters.value.level)
  }

  if (filters.value.bc !== 'all') {
    courses = courses.filter(c => c.bcContribution[filters.value.bc])
  }

  if (filters.value.module !== 'all') {
    const bcIds = bcList.value.filter(bc => bc.module === filters.value.module).map(bc => bc.id)
    courses = courses.filter(c => bcIds.some(bc => c.bcContribution[bc]))
  }

  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    courses = courses.filter(c => 
      c.name.toLowerCase().includes(query) ||
      (c.nameCn && c.nameCn.toLowerCase().includes(query))
    )
  }

  return courses
})
</script>

<style scoped>
.course-explorer {
  padding-bottom: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--color-text-light);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.filter-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-light);
}

.search-group {
  flex: 1;
  min-width: 200px;
}

.search-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  width: 100%;
}

.courses-table-container {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow-x: auto;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.courses-table th,
.courses-table td {
  padding: 0.875rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.courses-table th {
  background: #f8fafc;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.courses-table tbody tr:hover {
  background: #f8fafc;
}

.courses-table tbody tr.selected {
  background: #eff6ff;
}

.center {
  text-align: center;
}

.bc-col {
  min-width: 50px;
  font-size: 0.8rem;
}

.course-name-cell {
  display: flex;
  flex-direction: column;
}

.course-name-cn {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.level-badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.level-badge.undergraduate {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.level-badge.graduate {
  background: rgba(139, 92, 246, 0.1);
  color: var(--color-m2);
}

.bc-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
}

.bc-value.level-1 { background: rgba(59, 130, 246, 0.2); color: var(--color-primary); }
.bc-value.level-2 { background: rgba(59, 130, 246, 0.4); color: var(--color-primary-dark); }
.bc-value.level-3 { background: rgba(59, 130, 246, 0.8); color: white; }
.bc-value.empty { color: #cbd5e1; }

.summary-bar {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
}
</style>
