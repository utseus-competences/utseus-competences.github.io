import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import CourseExplorer from '../views/CourseExplorer.vue'
import CareerExplorer from '../views/CareerExplorer.vue'
import LearningPath from '../views/LearningPath.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/courses',
    name: 'CourseExplorer',
    component: CourseExplorer
  },
  {
    path: '/careers',
    name: 'CareerExplorer',
    component: CareerExplorer
  },
  {
    path: '/path',
    name: 'LearningPath',
    component: LearningPath
  }
]

const router = createRouter({
  history: createWebHistory('/utseus-competences.github.io/'),
  routes
})

export default router
