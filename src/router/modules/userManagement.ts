export default [
  {
    path: '/user-management/user',
    name: 'user-management-user-list',
    component: () => import('@/views/userManagement/list-user/UserListView.vue'),
  },
  {
    path: '/user-management/user/:userName',
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
  {
    path: '/user-management/master-employee',
    name: 'user-management-master-employee',
    component: () => import('@/views/userManagement/master-employee/EmployeeListView.vue'),
  },
  {
    path: '/user-management/master-employee/create',
    name: 'user-management-master-employee-create',
    component: () => import('@/views/userManagement/master-employee/EmployeeCreateView.vue'),
  },
  {
    path: '/user-management/master-employee/edit/:id',
    name: 'user-management-master-employee-edit',
    component: () => import('@/views/userManagement/master-employee/EmployeeEditView.vue'),
  },
  {
    path: '/user-management/master-employee/detail/:id',
    name: 'user-management-master-employee-detail',
    component: () => import('@/views/userManagement/master-employee/EmployeeDetailView.vue'),
  },
  {
    path: '/user-management/master-menu',
    name: 'user-management-master-menu',
    component: () => import('@/views/userManagement/master-menu/MasterMenuListView.vue'),
  },
  {
    path: '/user-management/master-menu/add',
    name: 'user-management-master-menu-add',
    component: () => import('@/views/userManagement/master-menu/MasterMenuAddView.vue'),
  },
  {
    path: '/user-management/master-menu/detail/:id',
    name: 'user-management-master-menu-detail',
    component: () => import('@/views/userManagement/master-menu/MasterMenuDetailView.vue'),
  },
  {
    path: '/user-management/report-authorization',
    name: 'user-management-report-authorization',
    component: () =>
      import('@/views/userManagement/report-user-authorization/ReportUserAuthorizationWrapper.vue'),
    redirect: { name: 'report-authorization-profile' },
    children: [
      {
        path: 'profile',
        name: 'report-authorization-profile',
        component: () =>
          import('@/views/userManagement/report-user-authorization/ReportProfileView.vue'),
      },
      {
        path: 'role-auth',
        name: 'report-authorization-role-auth',
        component: () =>
          import('@/views/userManagement/report-user-authorization/ReportRoleAuthView.vue'),
      },
      {
        path: 'role-menu',
        name: 'report-authorization-role-menu',
        component: () =>
          import('@/views/userManagement/report-user-authorization/ReportRoleMenuView.vue'),
      },
    ],
  },
]
