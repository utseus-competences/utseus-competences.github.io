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
          <span v-for="bc in selectedCareer.coreFocus" :key="bc" class="focus-tag tooltip" :data-tooltip="getBCDescription(bc)">
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
.career-selector {
  width: 100%;
}

.selector-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: var(--color-text);
  font-size: 0.9rem;
}

.career-dropdown {
  width: 100%;
  max-width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

.career-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.preview-header h3 {
  margin: 0;
  color: var(--color-primary);
  font-size: 1rem;
}

.preview-description {
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
  line-height: 1.5;
  font-size: 0.85rem;
}

.core-focus {
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
</style>
