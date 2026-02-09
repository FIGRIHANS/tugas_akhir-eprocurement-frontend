export interface ILogActivity {
  id: string
  transactionDate: string
  referenceNo: string
  actionType: 'Create' | 'Update' | 'Change' | 'Verified' | 'Approved' | 'Rejected' | 'Submitted'
  transactionType: 'PO' | 'Non PO'
  employeeName: string
  employeeEmail: string
  description?: string
}

export interface ILogActivityFilter {
  actionType: string
  transactionType: string
  employeeName: string
  dateFrom: string
  dateTo: string
}

