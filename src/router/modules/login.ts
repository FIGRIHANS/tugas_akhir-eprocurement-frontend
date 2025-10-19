export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      middleware: 'loginAuth',
    },
    component: () => import('@/views/login/LoginView.vue'),
  },
  {
    path: '/user-set-new-password',
    name: 'setUserNewPassword',
    component: () => import('@/views/setNewPassword/SetNewPasswordView.vue'),
  },
  {
    path: '/set-new-password',
    name: 'setNewPassword',
    component: () => import('@/views/setNewPassword/SetNewPasswordView.vue'),
  },
]
