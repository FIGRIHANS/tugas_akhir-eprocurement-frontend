export interface TableItemTypes {
  id: string
  status: string
  vendorCode: string
  rank: string
  vendorName: string
  totalScore: string
  productQuality: string
  leadTimeSupply: string
  afterSalesWarranty: string
  orderAbsorption: string
  totalPo: string
  yearlySpanding: string
  currency: string
  existingContract: string
  isSelected?: boolean
}

export interface ContractHistoryTypes {
  id: number
  year: string
  material: string
  materialDescription: string
  quantity: number
  uom: string
  totalContractAmount: number
  discount: number
  currency: string
  contractPrice: number
  lbma: number
  var: number
}
