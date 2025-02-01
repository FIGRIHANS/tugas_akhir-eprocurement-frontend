export default [
  {
    path: '/registration',
    name: 'registration',
    redirect: { name: 'registration-information' },
    component: () => import('@/views/registration/RegistrationWrapper.vue'),
    children: [
      {
        path: 'information',
        name: 'registration-information',
        component: () => import('@/views/registration/RegistrationInformation.vue'),
      },
    ],
  },
]
