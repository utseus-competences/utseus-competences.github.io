<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <h1>Career-Driven Competency System</h1>
        <p class="hero-subtitle">
          Plan your engineering education at <strong>UTSEUS</strong> based on your career goals
        </p>
        <div class="hero-actions">
          <router-link to="/dashboard" class="btn btn-primary btn-lg">
            Start Analysis
          </router-link>
          <router-link to="/careers" class="btn btn-secondary btn-lg">
            Explore Careers
          </router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>How It Works</h2>
        <div class="grid grid-3">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>1. Choose Your Career</h3>
            <p>Select from 20+ engineering career paths aligned with CPS, AI, robotics, and more.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>2. Select Your Courses</h3>
            <p>Mark the courses you've taken or plan to take from our comprehensive curriculum.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>3. Get Your Analysis</h3>
            <p>See your competency gaps and receive personalized course recommendations.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="competencies-preview">
      <div class="container">
        <h2>Our 4 Competency Modules</h2>
        <p class="section-desc">11 key competencies organized into 4 comprehensive modules</p>
        <div class="grid grid-2">
          <div class="module-card" v-for="module in modules" :key="module.id">
            <div class="module-header" :style="{ backgroundColor: module.color }">
              <h3>{{ module.name }}</h3>
            </div>
            <div class="module-content">
              <p>{{ module.description }}</p>
              <div class="module-bcs">
                <span v-for="bc in getModuleBCs(module.id)" :key="bc.id" class="bc-chip">
                  {{ bc.id }}: {{ bc.shortDesc }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="quick-start">
      <div class="container">
        <h2>Ready to Start?</h2>
        <p>Select your target career and begin your competency journey</p>
        <CareerSelector v-model="selectedCareer" @change="onCareerSelect" />
        <div v-if="selectedCareer" class="quick-actions">
          <router-link to="/dashboard" class="btn btn-primary">
            View Full Analysis →
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import CareerSelector from '../components/CareerSelector.vue'

const store = useAppStore()
const router = useRouter()
const selectedCareer = ref('')

const modules = computed(() => Object.values(store.competencies.modules))

function getModuleBCs(moduleId) {
  return Object.values(store.competencies.bc).filter(bc => bc.module === moduleId)
}

function onCareerSelect() {
  if (selectedCareer.value) {
    setTimeout(() => {
      router.push('/dashboard')
    }, 300)
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-subtitle strong {
  color: #fbbf24;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-lg {
  padding: 0.875rem 2rem;
  font-size: 1.1rem;
}

.features {
  padding: 4rem 0;
  background: var(--color-surface);
}

.features h2 {
  text-align: center;
  margin-bottom: 3rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: var(--color-text-light);
  line-height: 1.6;
}

.competencies-preview {
  padding: 4rem 0;
  background: var(--color-bg);
}

.competencies-preview h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.section-desc {
  text-align: center;
  color: var(--color-text-light);
  margin-bottom: 3rem;
}

.module-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.module-header {
  padding: 1.25rem;
  color: white;
}

.module-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.module-content {
  padding: 1.25rem;
}

.module-content p {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.module-bcs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.bc-chip {
  background: #f1f5f9;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--color-text);
}

.quick-start {
  padding: 4rem 0;
  background: var(--color-surface);
  text-align: center;
}

.quick-start h2 {
  margin-bottom: 0.5rem;
}

.quick-start > .container > p {
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

.quick-actions {
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
