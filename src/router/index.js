import { createRouter, createWebHashHistory } from 'vue-router'
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
  history: createWebHashHistory(),
  routes
})

export default router
