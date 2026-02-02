import { defineStore } from 'pinia'
// import type { ErpHeader } from './types/erp'

export const useSystemConfigurationStore = defineStore('systemIntegration', {
  state: () => ({
    configurations: [
      {
        header: {
          configCode: 'IVOX001',
          companyCode: 'MF00',
          companyName: 'Petrosea',
          description: 'Invoice Configuration - PO Normal Head Office',
          systemClient: 'PRD',
          invoiceGroup: '1',
          invoiceType: '3',
          isOcr: true,
          isQr: true,
          isPjap: true,
          is3WayMatching: true,
          source: '4',
          workflowId: 'WF001',
          erpIntegration: '',
          pogrIntegration: '',
        },
        integrations: [
          {
            code: 'IV01',
            client: 'PRD',
            processIntegration: 'Invoice Posting With PO',
            poType: 'ZP01',
            poDescription: 'Invoice Posting With PO',
            technicalObject: 'ZFM_INVPO_MIRO',
            fieldMapping: 'Active',
            integrationStatus: 'Active',
            connectionTest: 'Active',
            definition: [
              {
                id: crypto.randomUUID(),
                name: 'IS_HEADER',
                relation: '1 to 1',
                open: true,
                rows: [
                  {
                    id: crypto.randomUUID(),
                    label: 'Invoice Date',
                    evoq: 'InvoiceDate',
                    sap: 'DOC_DATE',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Posting Date',
                    evoq: 'PostingDate',
                    sap: 'PSTNG_DATE',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Company Code',
                    evoq: 'CompanyCode',
                    sap: 'COMP_CODE',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Vendor Master',
                    evoq: 'VendorId',
                    sap: 'VENDOR_NO',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Subtotal',
                    evoq: 'TotalGrossAmount',
                    sap: 'GROSS_AMOUNT',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Currency',
                    evoq: 'CurrCode',
                    sap: 'CURRENCY',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Invoice Vendor No',
                    evoq: 'DocumentNo',
                    sap: 'REF_DOC_NO',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Payment Term',
                    evoq: 'PaymentTerm',
                    sap: 'PMNTTRMS',
                    status: 'Active',
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                name: 'IT_ITEM',
                relation: '1 to N',
                open: true,
                rows: [
                  {
                    id: crypto.randomUUID(),
                    label: 'PO Number',
                    evoq: 'PONo',
                    sap: 'EBELN',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'PO Item',
                    evoq: 'POItem',
                    sap: 'EBELP',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Quantity',
                    evoq: 'Quantity',
                    sap: 'MENGE',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Item Amount',
                    evoq: 'ItemAmount',
                    sap: 'WRBTR',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Unit',
                    evoq: 'Uom',
                    sap: 'PO_UNIT',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Currency',
                    evoq: 'CurrCode',
                    sap: 'WAERS',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'GR Document No',
                    evoq: 'GRDocumentNo',
                    sap: 'GR_BELNR',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'GR Document Date',
                    evoq: 'GRDocumentDate',
                    sap: 'GR_GJAHR',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'GR Document Item',
                    evoq: 'GRDocumentItem',
                    sap: 'GR_ZEILE',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Tax Code',
                    evoq: 'TaxCode',
                    sap: 'TAX_CODE',
                    status: 'Active',
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        header: {
          configCode: 'IVOX002',
          companyCode: 'MF01',
          companyName: 'Petrosea',
          description: 'Invoice Configuration - PO Credit Card Branch Office',
          systemClient: 'QAS',
          invoiceGroup: 'Invoice With PO',
          invoiceType: 'QR',
          isOcr: false,
          isQr: true,
          isPjap: false,
          is3WayMatching: true,
          source: 'FTP',
          workflowId: 'WF003',
          erpIntegration: 'SAP-QAS',
          pogrIntegration: 'Active',
        },
        integrations: [
          {
            code: 'IV02',
            client: 'QAS',
            processIntegration: 'Invoice Posting With PO Credit Card',
            poType: 'ZP02',
            poDescription: 'Invoice Posting PO Credit Card',
            technicalObject: 'ZFM_INVPO_CC',
            fieldMapping: 'Active',
            integrationStatus: 'Active',
            connectionTest: 'Inactive',
            definition: [
              {
                id: crypto.randomUUID(),
                name: 'IS_HEADER',
                relation: '1 to 1',
                open: false,
                rows: [
                  {
                    id: crypto.randomUUID(),
                    label: 'Invoice Date',
                    evoq: 'InvoiceDate',
                    sap: 'DOC_DATE',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Posting Date',
                    evoq: 'PostingDate',
                    sap: 'PSTNG_DATE',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Company Code',
                    evoq: 'CompanyCode',
                    sap: 'COMP_CODE',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Vendor ID',
                    evoq: 'VendorId',
                    sap: 'LIFNR',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Invoice Amount',
                    evoq: 'TotalAmount',
                    sap: 'WRBTR',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Currency',
                    evoq: 'Currency',
                    sap: 'WAERS',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Reference Document',
                    evoq: 'ReferenceNo',
                    sap: 'XBLNR',
                    status: 'Active',
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                name: 'IT_ITEM',
                relation: '1 to N',
                open: true,
                rows: [
                  {
                    id: crypto.randomUUID(),
                    label: 'PO Number',
                    evoq: 'PONumber',
                    sap: 'EBELN',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'PO Item',
                    evoq: 'POItem',
                    sap: 'EBELP',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Amount',
                    evoq: 'Amount',
                    sap: 'NETWR',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Tax Code',
                    evoq: 'TaxCode',
                    sap: 'MWSKZ',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'Cost Center',
                    evoq: 'CostCenter',
                    sap: 'KOSTL',
                    status: 'Active',
                  },
                  {
                    id: crypto.randomUUID(),
                    label: 'GL Account',
                    evoq: 'GlAccount',
                    sap: 'HKONT',
                    status: 'Active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }),

  /* ================= GETTERS ================= */
  getters: {
    /* ========= TABLE LIST ========= */
    erpList: (state) =>
      state.configurations.map((e) => ({
        configurationCode: e.header.configCode,
        companyCode: e.header.companyCode,
        companyName: e.header.companyName ?? '-', // jika belum ada
        systemClient: e.header.systemClient,
        invoiceGroup: e.header.invoiceGroup,
        invoiceType: e.header.invoiceType,

        ocr: e.header.isOcr ? 'Active' : 'Inactive',
        qrCode: e.header.isQr ? 'Active' : 'Inactive',
        pjapValidation: e.header.isPjap ? 'Active' : 'Inactive',
        erp3WayMatching: e.header.is3WayMatching ? 'Active' : 'Inactive',

        source: e.header.source,
        workflowId: e.header.workflowId,
      })),

    /* ========= RAW ========= */
    getErps: (state) => state.configurations,

    /* ========= ERP DETAIL ========= */
    getErpByConfigCode: (state) => (configCode: string) =>
      state.configurations.find((e) => e.header.configCode === configCode) ?? null,

    /* ========= INTEGRATION ========= */
    getIntegrationsByConfigCode: (state) => (configCode: string) =>
      state.configurations.find((e) => e.header.configCode === configCode)?.integrations ?? [],

    getIntegration: (state) => (configCode: string, integrationCode: string) =>
      state.configurations
        .find((e) => e.header.configCode === configCode)
        ?.integrations.find((i) => i.code === integrationCode) ?? null,
  },

  /* ================= ACTIONS ================= */
  actions: {
    addErp(header: any) {
      this.configurations.push({
        header,
        integrations: [],
      })
    },

    updateErp(configCode: string, payload: any) {
      const erp = this.configurations.find((e) => e.header.configCode === configCode)
      if (!erp) return

      erp.header = {
        ...erp.header,
        ...payload,
      }
    },

    deleteErp(configCode: string) {
      this.configurations = this.configurations.filter((e) => e.header.configCode !== configCode)
    },

    addIntegration(configCode: string, integration: any) {
      const erp = this.configurations.find((e) => e.header.configCode === configCode)
      if (!erp) return
      erp.integrations.push(integration)
    },

    updateIntegration(configCode: string, integration: any) {
      const erp = this.configurations.find((e) => e.header.configCode === configCode)
      if (!erp) return

      const idx = erp.integrations.findIndex((i) => i.code === integration.code)
      if (idx !== -1) erp.integrations[idx] = integration
    },
  },
})
