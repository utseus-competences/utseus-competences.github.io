<template>
  <div class="career-selector">
    <label class="selector-label">Select Your Career Goal after UTSEUS/UT master degree</label>
    <select v-model="selectedId" @change="onCareerChange" class="career-dropdown">
      <option value="">-- Choose a career --</option>
      <optgroup v-for="(careers, category) in careersByCategory" :key="category" :label="category">
        <option v-for="career in careers" :key="career.id" :value="career.id">
          {{ career.name }}
        </option>
      </optgroup>
    </select>
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

</style>
