<template>
  <div class="career-explorer">
    <div class="container">
      <div class="page-header">
        <h1>Career Explorer</h1>
        <p>Explore engineering career paths after obtaining your UTSEUS/UT master degree and their competency requirements</p>
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
              <span v-for="bc in career.coreFocus.slice(0, 3)" :key="bc" class="focus-badge tooltip" :data-tooltip="getBCDescription(bc)">
                {{ bc }}
              </span>
            </div>
          </div>
          
          <div class="career-weights">
            <div v-for="bc in bcList" :key="bc"
                 class="weight-item">
              <span class="weight-bc tooltip" :data-tooltip="getBCDescription(bc)">{{ bc }}</span>
              <div class="weight-bar">
                <div class="weight-fill" :style="{ width: Math.min(100, (career.bcWeights[bc] || 0) / 12 * 100) + '%' }"></div>
              </div>
              <span class="weight-value">{{ career.bcWeights[bc] || 0 }}</span>
            </div>
          </div>
          
          <router-link to="/" class="btn btn-primary btn-block" @click.stop>
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
  router.push('/')
}

const bcList = ['BC1', 'BC2', 'BC3', 'BC4', 'BC5', 'BC6', 'BC7', 'BC8', 'BC9', 'BC10', 'BC11']

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

function getBCDescription(bcId) {
  const bc = store.competencies.bc[bcId]
  return bc ? `${bc.name}: ${bc.description}` : bcId
}
</script>

<style scoped>
.career-explorer {
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

.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.career-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  border: 1px solid var(--color-border-light);
  transition: all 0.15s;
  cursor: pointer;
}

.career-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.career-card.selected {
  border-color: var(--color-primary);
  background: #f8f9fa;
}

.career-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.625rem;
}

.career-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
}

.category-badge {
  font-size: 0.65rem;
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid transparent;
}

.category-badge.m1 { background: rgba(44, 62, 80, 0.08); color: var(--color-m1); border-color: rgba(44, 62, 80, 0.2); }
.category-badge.m2 { background: rgba(142, 68, 173, 0.08); color: var(--color-m2); border-color: rgba(142, 68, 173, 0.2); }
.category-badge.m3 { background: rgba(22, 160, 133, 0.08); color: var(--color-m3); border-color: rgba(22, 160, 133, 0.2); }
.category-badge.m4 { background: rgba(211, 84, 0, 0.08); color: var(--color-m4); border-color: rgba(211, 84, 0, 0.2); }

.career-description {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.875rem;
  line-height: 1.5;
}

.career-focus {
  font-size: 0.8rem;
  margin-bottom: 0.875rem;
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
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: help;
}

.career-weights {
  margin-bottom: 1rem;
}

.weight-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.375rem;
  font-size: 0.8rem;
}

.weight-bc {
  width: 35px;
  font-weight: 500;
  color: var(--color-text);
  cursor: help;
}

.weight-bar {
  flex: 1;
  height: 5px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.weight-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
}

.weight-value {
  width: 24px;
  text-align: right;
  color: var(--color-text-light);
  font-size: 0.75rem;
}

.btn-block {
  width: 100%;
  text-align: center;
  font-size: 0.85rem;
  padding: 0.5rem;
}
</style>
