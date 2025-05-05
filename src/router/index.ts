import { createRouter, createWebHistory } from 'vue-router'
import KTComponent from '../metronic/core/index.spa'
import KTLayout from '../metronic/app/layouts/demo1'

/** Layouts */
import LayoutBase from '@/layout/LayoutBase.vue'
import LayoutWithSidebar from '@/layout/LayoutWithSidebar.vue'

/** Route Modules */
import dashboard from './modules/dashboard'
import vendor from './modules/vendor'
import registration from './modules/registration'
import invoice from './modules/invoice'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      children: [...dashboard, ...vendor, ...invoice],
      meta: {
        middleware: 'auth',
      }
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        middleware: 'loginAuth',
      },
      component: () => import('@/views/LoginView.vue'),
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
