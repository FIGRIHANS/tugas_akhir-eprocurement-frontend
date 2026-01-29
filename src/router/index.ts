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
import companyInfomartion from './modules/companyInfomartion'
import workflowConfig from './modules/workflowConfig'
import requisition from './modules/requisition'
import analyticDashboard from './modules/analyticDashboard'
import digitalReceiving from './modules/digitalReceiving'
import deliveryNotes from './modules/deliveryNotes'
import taxReconciliation from './modules/taxReconciliation'
import systemIntegration from './modules/systemIntegration'

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
      children: [
        ...vendor,
        ...invoice,
        ...dashboard,
        ...userManagement,
        ...companyInfomartion,
        ...workflowConfig,
        ...requisition,
        ...analyticDashboard,
        ...digitalReceiving,
        ...deliveryNotes,
        ...taxReconciliation,
        ...systemIntegration
        // {
        //   path: '/health-check',
        //   name: 'health-check',
        //   component: () => import('@/views/HealthCheck.vue'),
        //   meta: {
        //     pageTitle: 'Health Check',
        //   },
        // },
      ],
      meta: {
        middleware: 'auth',
      },
    },

    // // ==============================
    // // PUBLIC ROUTES (No Auth Required) - For Testing
    // // ==============================
    // {
    //   path: '/test',
    //   component: LayoutWithSidebar,
    //   children: [
    //     {
    //       path: 'receiving-confirmation-list',
    //       name: 'testReceivingConfirmationList',
    //       component: () => import('@/views/receivingConfirmation/ReceivingConfirmationList.vue'),
    //       meta: {
    //         pageTitle: 'Receiving Confirmation List (Test)',
    //       },
    //     },
    //     {
    //       path: 'receiving-confirmation-detail/:id',
    //       name: 'testReceivingConfirmationDetail',
    //       component: () => import('@/views/receivingConfirmation/ReceivingConfirmationDetail.vue'),
    //       meta: {
    //         pageTitle: 'Receiving Confirmation Detail (Test)',
    //       },
    //     },
    //     {
    //       path: 'receiving-confirmation-create',
    //       name: 'testReceivingConfirmationCreate',
    //       component: () => import('@/views/receivingConfirmation/ReceivingConfirmationCreate.vue'),
    //       meta: {
    //         pageTitle: 'Receiving Confirmation Create (Test)',
    //       },
    //     },
    //   ],
    //   // Tidak ada middleware: 'auth'
    // },

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
