import { createRouter, createWebHistory } from 'vue-router'
import KTComponent from '../metronic/core/index.spa'
import KTLayout from '../metronic/app/layouts/demo1'

/** Layouts */
import LayoutBase from '@/layout/LayoutBase.vue'
import LayoutWithSidebar from '@/layout/LayoutWithSidebar.vue'

/** Route Modules */
import vendor from './modules/vendor'
import registration from './modules/registration'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutBase,
      children: [
        ...registration,
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/DashboardView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: LayoutWithSidebar,
      children: [...vendor],
    },
  ],
})

// Re-init metronic every time the route changes
router.beforeEach(() => {
  KTComponent.init()
  KTLayout.init()
})

export default router
