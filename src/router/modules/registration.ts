export default [
  {
    path: '/registration',
    name: 'registration',
    redirect: { name: 'registration__information' },
    component: () => import('@/views/registration/RegistrationWrapper.vue'),
    children: [
      {
        path: 'information',
        name: 'registration__information',
        component: () => import('@/views/registration/RegistrationInformation.vue'),
      },
      {
        path: 'contact',
        name: 'registration__contact',
        component: () => import('@/views/registration/RegistrationContact.vue'),
      },
      {
        path: 'document-and-legal',
        name: 'registration__document-and-legal',
        component: () => import('@/views/registration/RegistrationDocumentAndLegal.vue'),
      },
      {
        path: 'payment-detail',
        name: 'registration__payment-detail',
        component: () => import('@/views/registration/RegistrationPaymentDetail.vue'),
      },
    ],
  },
]
