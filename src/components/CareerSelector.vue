<template>
  <div class="career-selector">
    <label class="selector-label">Select Your Career Goal</label>
    <select v-model="selectedId" @change="onCareerChange" class="career-dropdown">
      <option value="">-- Choose a career --</option>
      <optgroup v-for="(careers, category) in careersByCategory" :key="category" :label="category">
        <option v-for="career in careers" :key="career.id" :value="career.id">
          {{ career.name }}
        </option>
      </optgroup>
    </select>
    
    <div v-if="selectedCareer" class="career-preview">
      <div class="preview-header">
        <h3>{{ selectedCareer.name }}</h3>
        <span class="badge" :class="getCategoryClass(selectedCareer.category)">
          {{ selectedCareer.category }}
        </span>
      </div>
      <p class="preview-description">{{ selectedCareer.description }}</p>
      <div class="core-focus">
        <strong>Core Focus:</strong>
        <div class="focus-tags">
          <span v-for="bc in selectedCareer.coreFocus" :key="bc" class="focus-tag">
            {{ bc }} - {{ getBCName(bc) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'change'])

const store = useAppStore()
const selectedId = ref(props.modelValue || store.selectedCareerId || '')

watch(() => props.modelValue, (val) => {
  selectedId.value = val || ''
})

const selectedCareer = computed(() => {
  return store.careers.find(c => c.id === selectedId.value)
})

const careersByCategory = computed(() => {
  const grouped = {}
  store.careers.forEach(career => {
    if (!grouped[career.category]) {
      grouped[career.category] = []
    }
    grouped[career.category].push(career)
  })
  return grouped
})

function onCareerChange() {
  emit('update:modelValue', selectedId.value)
  emit('change', selectedId.value)
  store.selectCareer(selectedCareer.value?.id || null)
}

function getBCName(bcId) {
  return store.competencies.bc[bcId]?.shortDesc || bcId
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
.career-selector {
  width: 100%;
}

.selector-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.career-dropdown {
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.career-preview {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.preview-header h3 {
  margin: 0;
  color: var(--color-primary);
}

.preview-description {
  color: var(--color-text-light);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.core-focus {
  font-size: 0.9rem;
}

.focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.focus-tag {
  background: var(--color-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
}
</style>
