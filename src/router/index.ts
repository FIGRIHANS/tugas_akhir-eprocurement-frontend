import { createRouter, createWebHistory } from 'vue-router'
import KTComponent from '../metronic/core/index.spa'
import KTLayout from '../metronic/app/layouts/demo1'

/** Layouts */
import LayoutBase from '@/layout/LayoutBase.vue'
import LayoutWithSidebar from '@/layout/LayoutWithSidebar.vue'

/** Route Modules */
import login from './modules/login'
import vendor from './modules/vendor'
import registration from './modules/registration'
import invoice from './modules/invoice'
import dashboard from './modules/dashboard'
import userManagement from './modules/userManagement'
import workflowConfig from './modules/workflowConfig'
import companyInformation from './modules/company-information'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...login,
    {
      path: '/',
      component: LayoutBase,
      children: [
        ...registration,
        {
          path: '/',
          name: 'landing-page',
          component: () => import('@/views/LandingPage.vue'),
        },
      ],
    },
    {
      path: '/',
      component: LayoutWithSidebar,
      children: [...vendor, ...invoice, ...dashboard, ...userManagement, ...companyInformation, ...workflowConfig],
      meta: {
        middleware: 'auth',
      },
    },

    // Empty State
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error/404',
    },
    {
      path: '/error/:code?',
      name: 'error',
      component: () => import('@/views/EmptyState.vue'),
    },
  ],
})

// Re-init metronic every time the route changes
router.beforeEach(() => {
  KTComponent.init()
  KTLayout.init()
})

export default router
