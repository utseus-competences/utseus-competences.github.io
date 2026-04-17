import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import careersData from '../data/careers.json'
import coursesData from '../data/courses.json'
import competenciesData from '../data/competencies.json'
import bcToCoursesData from '../data/bcToCourses.json'
import { 
  calculateCurrentBC, 
  calculateGap, 
  generateRecommendations,
  calculateMatchPercentage,
  generateLearningPath,
  getStatusSummary
} from '../core/gapEngine'

export const useAppStore = defineStore('app', () => {
  // State
  const selectedCareerId = ref(null)
  const selectedCourses = ref([])
  const currentView = ref('home')

  // Getters
  const careers = computed(() => careersData)
  const courses = computed(() => coursesData)
  const competencies = computed(() => competenciesData)
  const bcToCourses = computed(() => bcToCoursesData)

  const selectedCareer = computed(() => {
    return careersData.find(c => c.id === selectedCareerId.value) || null
  })

  const currentBC = computed(() => {
    return calculateCurrentBC(selectedCourses.value, coursesData)
  })

  const gapAnalysis = computed(() => {
    if (!selectedCareer.value) return null
    return calculateGap(selectedCareer.value, currentBC.value)
  })

  const recommendations = computed(() => {
    if (!gapAnalysis.value) return []
    return generateRecommendations(
      gapAnalysis.value, 
      bcToCoursesData, 
      coursesData, 
      selectedCourses.value
    )
  })

  const matchPercentage = computed(() => {
    if (!gapAnalysis.value) return 0
    return calculateMatchPercentage(gapAnalysis.value)
  })

  const learningPath = computed(() => {
    return generateLearningPath(recommendations.value)
  })

  const statusSummary = computed(() => {
    if (!gapAnalysis.value) return null
    return getStatusSummary(gapAnalysis.value)
  })

  // Actions
  function selectCareer(careerId) {
    selectedCareerId.value = careerId
  }

  function toggleCourse(courseId) {
    const index = selectedCourses.value.indexOf(courseId)
    if (index > -1) {
      selectedCourses.value.splice(index, 1)
    } else {
      selectedCourses.value.push(courseId)
    }
  }

  function selectCourses(courseIds) {
    selectedCourses.value = [...courseIds]
  }

  function clearSelection() {
    selectedCourses.value = []
  }

  function isCourseSelected(courseId) {
    return selectedCourses.value.includes(courseId)
  }

  function getCourseBCContribution(courseId) {
    const course = coursesData.find(c => c.id === courseId)
    return course?.bcContribution || {}
  }

  function getBCCourses(bcId, limit = 5) {
    const courseIds = bcToCoursesData[bcId] || []
    return courseIds
      .map(id => coursesData.find(c => c.id === id))
      .filter(Boolean)
      .slice(0, limit)
  }

  return {
    // State
    selectedCareerId,
    selectedCourses,
    currentView,
    
    // Getters
    careers,
    courses,
    competencies,
    bcToCourses,
    selectedCareer,
    currentBC,
    gapAnalysis,
    recommendations,
    matchPercentage,
    learningPath,
    statusSummary,
    
    // Actions
    selectCareer,
    toggleCourse,
    selectCourses,
    clearSelection,
    isCourseSelected,
    getCourseBCContribution,
    getBCCourses
  }
})
