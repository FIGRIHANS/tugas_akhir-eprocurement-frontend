export interface IBlacklist {
  items: IBlacklistItem[]
  total: number
  page: number
  pageSize: number
}

export interface IBlacklistItem {
  vendorId: string
  vendorName: string
  masaBlacklistId: string
  masaBlacklist: string
  startDate: string
  endDate: string
  blacklistDescription: string
  docUrl: string
  status: string
}
