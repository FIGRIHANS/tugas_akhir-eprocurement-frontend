export interface IUser {
  id: number;
  userName: string;
  employeeName: string;
  employeeId: number;
  profileId: number;
  lastLoginDate?: string;
}

export interface IUserInformation {
  employeeId: number;
  employeeName: string;
  email: string;
  position?: string;
  departmentName?: string;
}

export interface IUserProfile {
  profileId: number;
  profileName: string;
  lastLoginDate?: string;
}

export interface IUserAuth {
  authId: string;
  authName: string;
  authDescription?: string;
}

export interface IUserRole {
  roleId: string;
  roleName: string;
}

export interface IRoleAuth {
  role?: IUserRole;
  auths?: IUserAuth[];
}

export interface IUserDetail extends IUser {
  profile?: IUserProfile;
  roleAuths?: IRoleAuth[];
}

export interface IUserPayload {
  userName: string;
  userPassword: string;
  userPasswordConfirm: string;
  employeeName: string;
  isActive: boolean;
  employeeId: number;
  profileId: number;
  selectedRoleIds: string[];
}

export type CreateUserRequest = Omit<IUserPayload, 'userPasswordConfirm'>;
export type UpdateUserRequest = Partial<CreateUserRequest>;
