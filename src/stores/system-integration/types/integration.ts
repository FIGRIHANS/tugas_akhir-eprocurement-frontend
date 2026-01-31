export interface IntegrationDefinitionRow {
  id: string
  label: string
  evoq: string
  sap: string
  status: 'Active' | 'Inactive'
}

export interface IntegrationDefinitionGroup {
  uid: string
  id: string
  name: string
  relation: '1 to 1' | '1 to N'
  rows: IntegrationDefinitionRow[]
}

export interface Integration {
  code: string // unique per ERP
  client: string
  processIntegration: string
  services: string
  type: string
  source: string
  destination: string
  transactionCode: string
  connection: string
  technicalObject: string
  fieldMapping: string
  integrationStatus: string
  connectionTest: string
  definition: IntegrationDefinitionGroup[]
}
