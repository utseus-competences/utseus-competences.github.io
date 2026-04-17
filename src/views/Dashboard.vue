<template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Analyze your competency gaps and get course recommendations at UTSEUS</p>
      </div>

      <div class="dashboard-layout">
        <!-- Left Column - Course Selection (Full Height) -->
        <div class="dashboard-sidebar">
          <div class="card career-card">
            <div class="card-title">Career Goal</div>
            <CareerSelector v-model="selectedCareer" />
          </div>

          <CourseSelector />
        </div>

        <!-- Right Column - Analysis -->
        <div class="dashboard-main">
          <div class="card" v-if="store.selectedCareer">
            <div class="card-title">Career Details</div>
            <div class="career-details">
              <div class="career-details-header">
                <h3>{{ store.selectedCareer.name }}</h3>
                <span class="badge" :class="getCategoryClass(store.selectedCareer.category)">
                  {{ store.selectedCareer.category }}
                </span>
              </div>
              <p class="career-details-description">{{ store.selectedCareer.description }}</p>
              <div class="career-details-focus">
                <strong>Core Focus:</strong>
                <div class="focus-tags">
                  <span v-for="bc in store.selectedCareer.coreFocus" :key="bc" class="focus-tag tooltip" :data-tooltip="getBCDescription(bc)">
                    {{ bc }} - {{ getBCName(bc) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="card" v-if="store.selectedCareer">
            <div class="card-title">Competency Radar</div>
            <div class="radar-legend">
              <span class="legend-item target"><span class="dot"></span> Target</span>
              <span class="legend-item current"><span class="dot"></span> Current</span>
            </div>
            <BCRadarChart :width="350" :height="350" />
          </div>
          
          <div class="card" v-else>
            <div class="card-title">Competency Radar</div>
            <div class="empty-radar">
              <p>Select a career to view your competency radar chart</p>
            </div>
          </div>

          <div class="card">
            <div class="card-title">Gap Analysis</div>
            <GapAnalysis />
          </div>

          <div class="card recommendations-card" v-if="store.selectedCareer">
            <div class="card-title">Recommendations</div>
            <RecommendationPanel />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import CareerSelector from '../components/CareerSelector.vue'
import CourseSelector from '../components/CourseSelector.vue'
import BCRadarChart from '../components/BCRadarChart.vue'
import GapAnalysis from '../components/GapAnalysis.vue'
import RecommendationPanel from '../components/RecommendationPanel.vue'

const store = useAppStore()
const selectedCareer = computed({
  get: () => store.selectedCareerId || '',
  set: (val) => store.selectCareer(val || null)
})

function getBCName(bcId) {
  return store.competencies.bc[bcId]?.shortDesc || bcId
}

function getBCDescription(bcId) {
  const bc = store.competencies.bc[bcId]
  return bc ? `${bc.name}: ${bc.description}` : bcId
}

function getCategoryClass(category) {
  const map = {
    'Artificial Intelligence': 'badge-m2',
    'Robotics': 'badge-m1',
    'CPS': 'badge-m1',
    'Industrial Internet': 'badge-m1',
    'Autonomous Systems': 'badge-m1',
    'Manufacturing': 'badge-m3',
    'Control Systems': 'badge-m1',
    'Data Science': 'badge-m2',
    'Signal Processing': 'badge-m1',
    'Research': 'badge-m2',
    'Mechatronics': 'badge-m1',
    'Automation': 'badge-m3',
    'Embedded Systems': 'badge-m1',
    'Quality Engineering': 'badge-m4',
    'Sustainability': 'badge-m4',
    'Aerospace': 'badge-m1',
    'Healthcare Technology': 'badge-m4',
    'Product Management': 'badge-m3',
    'Energy': 'badge-m4',
    'Entrepreneurship': 'badge-m2'
  }
  return map[category] || 'badge-m1'
}
</script>

<style scoped>
.dashboard {
  padding-bottom: 2rem;
}

.dashboard-header {
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  margin-bottom: 0.25rem;
  font-size: 1.5rem;
}

.dashboard-header p {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin: 0;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 1.25rem;
  align-items: start;
}

.dashboard-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: sticky;
  top: 0.5rem;
  height: calc(100vh - 30px);
}

.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.career-card {
  flex-shrink: 0;
}


.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  border: 1px solid var(--color-border-light);
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.875rem;
  color: var(--color-text);
}

.radar-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.legend-item .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-item.target .dot {
  background: #3498db;
}

.legend-item.current .dot {
  background: #27ae60;
}

.empty-radar {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.career-details-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.career-details-header h3 {
  margin: 0;
  color: var(--color-primary);
  font-size: 1rem;
}

.career-details-description {
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
  line-height: 1.5;
  font-size: 0.85rem;
}

.career-details-focus {
  font-size: 0.85rem;
}

.focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.375rem;
}

.focus-tag {
  background: var(--color-primary);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  cursor: help;
  position: relative;
}

.recommendations-card {
  background: linear-gradient(135deg, #f0f9f4 0%, #d4edda 100%);
  border-left: 4px solid #27ae60;
}

@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  
  .dashboard-sidebar {
    position: static;
    height: auto;
    max-height: 600px;
  }
}
</style>
