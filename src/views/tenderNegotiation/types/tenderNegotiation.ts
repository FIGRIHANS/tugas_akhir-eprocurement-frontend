export interface TableNegotiationTypes {
  tenderRequestNumber: string
  type: string
  deliveryDate: string
  plant: string
  materialGroup: string
  itemNo: string
  tenderPrice: number
  material: string
  materialDescription: string
  quantity: string
  buttonPrice: string
  uom: string
}

export interface NegotiationEntitiesTypes {
  prNo: string
  ItemNo: number
  Material: string
  MaterialDesc: string
  Quantity: number
  UoM: string
  UnitPrice: number
  unitCurrency: string
  ExpDisc: string
  ExpectedDisc: number
  ExpPricePerUnit: number
  TotalGrossAmount: number
  TotalDisc: number
  TotalNettAmount: number
  VendorPurposeDisc: string
  VendorDiscAmount: number
  VendorPricePerUnit: number
  vendorTotalGross: number
  vendorTotalDisc: number
  vendorTOtalNett: number
  VarNettAmount: number
  varNettCurrency: string
}

export interface tableNegotiationHistoryTypes {
  historyId: number
  iteration: string
  status: string
  type: string
  expectedDisc: string
  vendorPurposedDisc: string
  totalAmount: string
  totalCurrency: string
  discAmount: string
  discCurrency: string
  technicalNegotiation: string
  finalAmount: string
  finalCurrency: string
}
