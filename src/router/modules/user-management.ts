export default [
  {
    path: '/user-management/user',
    name: 'list-user',
    component: () => import('@/views/userManagement/list-user/ListUserTable.vue'),
  },
  {
    path: '/user-management/user/form',
    name: 'list-user-form',
    redirect: { name: 'user_detail' },
    component: () => import('@/views/userManagement/list-user/ListUserForm.vue'),
    children: [
      {
        path: 'detail',
        name: 'user_detail',
        component: () => import('@/views/userManagement/list-user/sections/UserDetailStep.vue'),
      },
      {
        path: 'profile',
        name: 'user_profile',
        component: () => import('@/views/userManagement/list-user/sections/UserProfileStep.vue'),
      },
      {
        path: 'authorization',
        name: 'user_authorization',
        component: () =>
          import('@/views/userManagement/list-user/sections/UserAuthorizationStep.vue'),
      },
      {
        path: 'role',
        name: 'user_role',
        component: () => import('@/views/userManagement/list-user/sections/UserRoleStep.vue'),
      },
    ],
  },
  {
    path: '/user-management/master-profile',
    name: 'master-profile',
    component: () => import('@/views/userManagement/list-user/ListUserTable.vue'),
  },
  {
    path: '/user-management/master-role',
    name: 'master-role',
    component: () => import('@/views/userManagement/list-user/ListUserTable.vue'),
  },
  {
    path: '/user-management/report-user-authorization',
    name: 'master-role',
    component: () => import('@/views/userManagement/list-user/ListUserTable.vue'),
  },
]
