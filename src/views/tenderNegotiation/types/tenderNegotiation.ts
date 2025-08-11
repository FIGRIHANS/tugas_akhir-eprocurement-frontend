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
  history_id: number
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
  totalAmount: number
  totalCurrency: string
  discAmount: number
  discCurrency: string
  technicalNegotiation: string
  finalAmount: number
  finalCurrency: string
}

export interface returnData {
  expectedDicValueAdmin: number
  expectedDicValueVendor: number
  expectedDiscAdmin: string
  expectedDiscDiffPerc: string
  expectedDiscDiffValue: number
  expectedDiscVendor: string
  finalAmountAdmin: number
  finalAmountDiff: number
  finalAmountVendor: number
  totalAmountAdmin: number
  totalAmountVariance: number
  totalAmountVendor: number
}
