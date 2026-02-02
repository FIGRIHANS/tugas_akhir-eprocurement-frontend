export type IntegrationItem = {
  code: string
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

  definition?: MappingGroup[]
}

export type MappingRow = {
  id: string
  label: string
  evoq: string
  sap: string
  status: 'Active' | 'Inactive'
}

export type MappingGroup = {
  id: string
  name: string
  relation: '1 to 1' | '1 to N' | 'N to 1'
  mappings?: MappingRow[]
  rows?: MappingRow[]
  open?: boolean
}
