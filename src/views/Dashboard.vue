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

          <div class="card course-card">
            <CourseSelector />
          </div>
        </div>

        <!-- Right Column - Analysis -->
        <div class="dashboard-main">
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

          <div class="card" v-if="store.selectedCareer">
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
}

.dashboard-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.career-card {
  flex-shrink: 0;
}

.course-card {
  flex: 1;
  min-height: 0;
  padding: 1rem;
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

@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  
  .dashboard-sidebar {
    max-height: none;
  }
  
  .course-card {
    max-height: 500px;
  }
}
</style>
