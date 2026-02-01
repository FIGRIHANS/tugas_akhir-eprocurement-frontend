export interface ErpHeader {
  id: string // connectionCode
  companyCode: string
  description: string
  erp?: string
  client?: string
  clientId: string
  status?: string
  processGroup?: string
  connectionMethod: string
  connectorDriver: string
  destinationName: string
  appServerHost: string
  user: string
  password: string
  language: string
}
