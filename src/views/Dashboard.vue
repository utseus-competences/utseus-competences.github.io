<template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>Career Competency Dashboard</h1>
        <p>Analyze your skills and get personalized recommendations</p>
      </div>

      <div class="dashboard-grid">
        <!-- Left Column -->
        <div class="dashboard-col">
          <div class="card">
            <div class="card-title">Career Goal</div>
            <CareerSelector v-model="selectedCareer" />
          </div>

          <div class="card">
            <div class="card-title">Course Selection</div>
            <CourseSelector />
          </div>
        </div>

        <!-- Right Column -->
        <div class="dashboard-col">
          <div class="card" v-if="store.selectedCareer">
            <div class="card-title">Competency Radar</div>
            <div class="radar-legend">
              <span class="legend-item target"><span class="dot"></span> Target Career</span>
              <span class="legend-item current"><span class="dot"></span> Your Current</span>
            </div>
            <BCRadarChart :width="380" :height="380" />
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
        </div>
      </div>

      <!-- Recommendations Section -->
      <div class="card recommendations-card" v-if="store.selectedCareer">
        <div class="card-title">Course Recommendations</div>
        <RecommendationPanel />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: var(--color-text-light);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.radar-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-item .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-item.target .dot {
  background: #3b82f6;
}

.legend-item.current .dot {
  background: #10b981;
}

.empty-radar {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-light);
}

.recommendations-card {
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
