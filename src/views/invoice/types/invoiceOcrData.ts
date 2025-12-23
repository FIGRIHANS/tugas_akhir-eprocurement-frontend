// export interface invoiceOcrData {
//   FakturPajak: string
//   buyerNpwp: string
//   dpp: string
//   ppn: string
//   total: string
//   transactionDate: string
//   vendorName: string
//   vendorNpwp: string
// }

export interface invoiceOcrData {
  vendorBuyer: string
  npwpBuyer: string
  vendorSupplier: string
  npwpSupplier: string
  taxDocumentNumber: string
  taxDocumentDate: string
  dpp: string
  ppn: string
  ppnbm: string
  status: string
}
