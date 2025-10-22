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
  employeeEmail: null
  positionName: string
  companyCode: null
  costCenter: null
  isActive: boolean
  createdBy: number
  createdUtcDate: Date
  updatedBy: number
  updatedUtcdate: Date
}
