<template>
  <div class="course-explorer">
    <div class="container">
      <div class="page-header">
        <h1>Course Explorer</h1>
        <p>Browse all UTSEUS courses and their competency contributions</p>
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
              <th @click="handleSort('name')" class="sortable">Course Name{{ getSortIndicator('name') }}</th>
              <th @click="handleSort('level')" class="center sortable">Level{{ getSortIndicator('level') }}</th>
              <th @click="handleSort('credits')" class="center sortable">Credits{{ getSortIndicator('credits') }}</th>
              <th v-for="bc in displayedBCs" :key="bc" @click="handleSort(bc)" class="center bc-col tooltip sortable" :data-tooltip="getBCDescription(bc)">
                {{ bc }}{{ getSortIndicator(bc) }}
              </th>
              <th class="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in filteredCourses" :key="course.id" 
                :class="{ selected: store.isCourseSelected(course.id) }">
              <td>
                <div class="course-name-cell" :title="course.name">
                  <strong>{{ course.name }}</strong>
                  <span v-if="course.nameCn" class="course-name-cn">{{ course.nameCn }}</span>
                </div>
              </td>
              <td class="center">
                <span :class="['level-badge', course.level, 'tooltip']" :data-tooltip="course.level === 'undergraduate' ? 'Undergraduate (B3/B4)' : 'Graduate (Master)'">
                  {{ course.level === 'undergraduate' ? 'UG' : 'GR' }}
                </span>
              </td>
              <td class="center">{{ course.credits }}</td>
              <td v-for="bc in displayedBCs" :key="bc" class="center">
                <span v-if="course.bcContribution[bc]" 
                      :class="['bc-value', 'level-' + course.bcContribution[bc], 'tooltip']"
                      :data-tooltip="bc + ': ' + getBCDescription(bc) + ' (Level ' + course.bcContribution[bc] + ')'">
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

const sortConfig = ref({
  key: null,
  direction: 'asc'
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

  // Apply sorting
  if (sortConfig.value.key) {
    courses.sort((a, b) => {
      let valA = a[sortConfig.value.key]
      let valB = b[sortConfig.value.key]
      
      // Handle BC columns
      if (sortConfig.value.key.startsWith('BC')) {
        valA = a.bcContribution[sortConfig.value.key] || 0
        valB = b.bcContribution[sortConfig.value.key] || 0
      }
      
      if (valA < valB) return sortConfig.value.direction === 'asc' ? -1 : 1
      if (valA > valB) return sortConfig.value.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  return courses
})

function getBCDescription(bcId) {
  const bc = store.competencies.bc[bcId]
  return bc ? `${bc.name}: ${bc.description}` : bcId
}

function handleSort(key) {
  if (sortConfig.value.key === key) {
    // Toggle direction if same key
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    // New key, default to ascending
    sortConfig.value.key = key
    sortConfig.value.direction = 'asc'
  }
}

function getSortIndicator(key) {
  if (sortConfig.value.key !== key) return ''
  return sortConfig.value.direction === 'asc' ? ' ↑' : ' ↓'
}
</script>

<style scoped>
.course-explorer {
  padding-bottom: 2rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin-bottom: 0.25rem;
  font-size: 1.5rem;
}

.page-header p {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-group label {
  font-size: 0.8rem;
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
  border-radius: var(--radius-sm);
  width: 100%;
  font-size: 0.9rem;
}

.courses-table-container {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  overflow-x: auto;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.courses-table th,
.courses-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.courses-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  font-size: 0.8rem;
}

.courses-table tbody tr:hover {
  background: #f8f9fa;
}

.courses-table tbody tr.selected {
  background: #e8f4f8;
}

.center {
  text-align: center;
}

.bc-col {
  min-width: 45px;
  cursor: help;
}

.course-name-cell {
  display: flex;
  flex-direction: column;
  max-width: 300px;
}

.course-name-cell strong {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.course-name-cn {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.level-badge {
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 500;
  cursor: help;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #e9ecef;
}

.level-badge.undergraduate {
  background: rgba(41, 128, 185, 0.1);
  color: var(--color-info);
}

.level-badge.graduate {
  background: rgba(142, 68, 173, 0.1);
  color: var(--color-m2);
}

.bc-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: help;
}

.bc-value.level-1 { background: rgba(41, 128, 185, 0.15); color: var(--color-info); }
.bc-value.level-2 { background: rgba(41, 128, 185, 0.35); color: var(--color-info); }
.bc-value.level-3 { background: rgba(41, 128, 185, 0.7); color: white; }
.bc-value.empty { color: #bdc3c7; }

.summary-bar {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  color: var(--color-text-light);
  font-size: 0.85rem;
  border: 1px solid var(--color-border-light);
}

.btn {
  padding: 0.25rem 0.625rem;
  font-size: 0.8rem;
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
