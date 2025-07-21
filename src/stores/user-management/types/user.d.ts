export interface IUser {
  id: number;
  userName: string;
  userPassword: string;
  employeeId: number;
  employeeName: string;
  profileId: number;
  isLocked: boolean;
  passwordExpiredDate: Date;
  lockedDate: Date;
  lastLoginDate: Date;
  lastErrorDate: Date;
  errorCount: number;
  isActive: boolean;
}
