<template>
  <div class="career-explorer">
    <div class="container">
      <div class="page-header">
        <h1>Career Explorer</h1>
        <p>Discover 20+ engineering career paths and their required competencies</p>
      </div>

      <div class="careers-grid">
        <div v-for="career in store.careers" :key="career.id" 
             :class="['career-card', { selected: store.selectedCareerId === career.id }]"
             @click="selectCareer(career.id)">
          <div class="career-header">
            <h3>{{ career.name }}</h3>
            <span :class="['category-badge', getCategoryClass(career.category)]">
              {{ career.category }}
            </span>
          </div>
          <p class="career-description">{{ career.description }}</p>
          
          <div class="career-focus">
            <strong>Core Focus:</strong>
            <div class="focus-badges">
              <span v-for="bc in career.coreFocus.slice(0, 3)" :key="bc" class="focus-badge">
                {{ bc }}
              </span>
            </div>
          </div>
          
          <div class="career-weights">
            <div v-for="(weight, bc) in getTopWeights(career.bcWeights)" :key="bc" 
                 class="weight-item">
              <span class="weight-bc">{{ bc }}</span>
              <div class="weight-bar">
                <div class="weight-fill" :style="{ width: (weight / 3 * 100) + '%' }"></div>
              </div>
              <span class="weight-value">{{ weight }}</span>
            </div>
          </div>
          
          <router-link to="/dashboard" class="btn btn-primary btn-block" @click.stop>
            Select & Analyze
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

function selectCareer(careerId) {
  store.selectCareer(careerId)
  router.push('/dashboard')
}

function getTopWeights(weights) {
  return Object.entries(weights)
    .filter(([_, val]) => val >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
}

function getCategoryClass(category) {
  const map = {
    'Artificial Intelligence': 'm2',
    'Robotics': 'm1',
    'CPS': 'm1',
    'Industrial Internet': 'm1',
    'Autonomous Systems': 'm1',
    'Manufacturing': 'm3',
    'Control Systems': 'm1',
    'Data Science': 'm2',
    'Signal Processing': 'm1',
    'Research': 'm2',
    'Mechatronics': 'm1',
    'Automation': 'm3',
    'Embedded Systems': 'm1',
    'Quality Engineering': 'm4',
    'Sustainability': 'm4',
    'Aerospace': 'm1',
    'Healthcare Technology': 'm4',
    'Product Management': 'm3',
    'Energy': 'm4',
    'Entrepreneurship': 'm2'
  }
  return map[category] || 'm1'
}
</script>

<style scoped>
.career-explorer {
  padding-bottom: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--color-text-light);
}

.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.career-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 2px solid var(--color-border);
  transition: all 0.2s;
  cursor: pointer;
}

.career-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.career-card.selected {
  border-color: var(--color-primary);
  background: #eff6ff;
}

.career-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.career-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-primary);
}

.category-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  white-space: nowrap;
}

.category-badge.m1 { background: rgba(59, 130, 246, 0.1); color: var(--color-m1); }
.category-badge.m2 { background: rgba(139, 92, 246, 0.1); color: var(--color-m2); }
.category-badge.m3 { background: rgba(16, 185, 129, 0.1); color: var(--color-m3); }
.category-badge.m4 { background: rgba(245, 158, 11, 0.1); color: var(--color-m4); }

.career-description {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.career-focus {
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.focus-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.375rem;
}

.focus-badge {
  background: var(--color-primary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.career-weights {
  margin-bottom: 1.25rem;
}

.weight-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

.weight-bc {
  width: 35px;
  font-weight: 500;
  color: var(--color-text);
}

.weight-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.weight-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
}

.weight-value {
  width: 20px;
  text-align: right;
  color: var(--color-text-light);
}

.btn-block {
  width: 100%;
  text-align: center;
}
</style>
