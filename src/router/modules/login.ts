export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      middleware: 'loginAuth',
    },
    component: () => import('@/views/login/LoginView.vue')
  },
  {
    path: '/set-new-password',
    name: 'setNewPassword',
    component: () => import('@/views/setNewPassword/SetNewPasswordView.vue')
  }
]