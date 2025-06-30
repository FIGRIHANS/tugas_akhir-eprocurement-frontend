export default [
  {
    path: '/user-management/user',
    name: 'user-management-user-list',
    component: () => import('@/views/userManagement/list-user/UserListView.vue'),
  },
  {
    path: '/user-management/user/:id',
    name: 'user-management-user-detail',
    component: () => import('@/views/userManagement/list-user/UserDetailView.vue'),
  },
  {
    path: '/user-management/user/form',
    name: 'user-management-user-form',
    component: () => import('@/views/userManagement/list-user/UserFormView.vue'),
    children: [
      {
        path: 'user-detail',
        name: 'form-user-detail',
        component: () => import('@/views/userManagement/list-user/sections/UserDetailStep.vue'),
      },
      {
        path: 'user-profile',
        name: 'form-user-profile',
        component: () => import('@/views/userManagement/list-user/sections/UserProfileStep.vue'),
      },
      {
        path: 'user-authorization',
        name: 'form-user-authorization',
        component: () =>
          import('@/views/userManagement/list-user/sections/UserAuthorizationStep.vue'),
      },
      {
        path: 'user-role',
        name: 'form-user-role',
        component: () => import('@/views/userManagement/list-user/sections/UserRoleStep.vue'),
      },
    ],
  },
  {
    path: '/user-management/master-profile',
    name: 'user-management-master-profile',
    component: () => import('@/views/userManagement/master-profile/MasterProfileListView.vue'),
  },
  {
    path: '/user-management/master-role',
    name: 'user-management-master-role',
    component: () => import('@/views/userManagement/master-role/MasterRoleListView.vue'),
  },
]
