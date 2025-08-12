export interface TableItemTypes {
  id: string
  purchaseRequisitionNo: string
  sourcingType: string
  deliveryDate: string
  plant: string
  materialGroup: string
  itemNo: string
  material: string
  materialDescription: string
  quantity: number
  bottomPrice: number
  uom: string
  currency: string
  isSelected: boolean
}

export interface SourcingRequestitionTypes {
  id: string
  sourcingType: string
  purchaseRequisitionNo: string
  division: string
  plant: string
  department: string
  requestor: string
  materialGroup: string
  itemNo: string
  material: string
  materialDescription: string
  quantity: number
  uom: string
  bottomPrice: number
  currency: string
  deliveryDate: string
  type: string
  isSelected: boolean
}