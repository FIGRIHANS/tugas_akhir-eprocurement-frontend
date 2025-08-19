export interface IBlacklist {
  items: IBlacklistItem[]
  total: number
  page: number
  pageSize: number
}

export interface IBlacklistItem {
  blacklistId: number
  vendorId: string
  vendorName: string
  masaBlacklistId: number
  masaBlacklist: string
  startDate: string
  endDate: string
  blacklistDescription: string
  docUrl: string
  status: string
  approvalStatus: number
  approvalBy: string
  sendApprovalDate: string
}

export interface IBlacklistApprovalPayload {
  BlacklistId: number
  ApproveStatus: number
  ApprovalNote: string
  ApproveById: number
  ApproveByName: string
}
