export interface ResponseUser {
  profile: ProfileUser
  roleAuths: RoleAuthUser
  roleMenus: []
}

interface ProfileUser {
  userName: string
  lastLoginDate: string
  employeeId: number
  employeeName: string
  employeeEmail: string
  positionName: string
  companyCode: string
  costCenter: string
  profileId: number
  profileName: string
  vendorCode: number
  vendorName: string
}

interface RoleAuthUser {
  role: RoleUser
  auths: AuthUser[]
}

interface RoleUser {
  roleId: number
  roleName: string
}

interface AuthUser {
  authId: number
  authName: string
  authValue: string
  parentId: number
  sequential: number
  tier: number
}
