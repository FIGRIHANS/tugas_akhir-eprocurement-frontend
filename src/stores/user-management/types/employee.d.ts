export interface IEmployeePayload {
  employeeId: number
  EmployeeName: string
  EmployeeEmail: string
  PositionName: string
  CompanyCode: string
  CostCenter?: string
  isActive?: boolean
}

export interface IEmployee {
  id: number
  employeeId: number
  employeeName: string
  employeeEmail: string | null
  positionName: string
  companyCode: string | null
  costCenter: string | null
  isActive: boolean
  profileId?: number
  createdBy: number
  createdUtcDate: Date
  updatedBy: number
  updatedUtcdate: Date
}
