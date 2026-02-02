import { defineStore } from 'pinia'
// import type { ErpHeader } from './types/erp'

export const useSystemIntegrationStore = defineStore('systemIntegration', {
  state: () => ({
    erps: [
      {
        header: {
          id: 'EVOSAP01',
          companyCode: 'MF00',
          companyName: 'Petrosea',
          systemClient: 'PRD',
          // erp: 'SAP',
          processGroup: 'Invoice Management',
          status: 'Active',
          lastChange: '03/06/2025 11/10/15',
          connectionCode: 'EVOSAP01',
          description: 'SAP PRD Connection MF00',
          erp: 'sap_hana_2020',
          client: 'PRD',
          clientId: '120',
          connectionMethod: 'RFC',
          connectorDriver: '.net connector Versi XX121',
          destinationName: 'IDES-NEW',
          appServerHost: '192.168.5.50',
          user: 'TMS_EVOQ',
          password: 'Teamwork2026!!!',
          language: 'EN',
        },
        integrations: [
          {
            code: 'IV01',
            client: 'PRD',
            processIntegration: 'Invoice Posting With PO',
            services: 'Transaction',
            type: 'Outbound',
            source: 'EVOQ',
            destination: 'SAP',
            transactionCode: 'MIRO',
            connection: 'RFC',
            technicalObject: 'ZFM_INVPO_MIRO',
            fieldMapping: 'Active',
            integrationStatus: 'Active',
            connectionTest: 'Success',
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
          id: 'EVOSAP02',
          companyCode: 'MF00',
          companyName: 'Petrosea',
          systemClient: 'PRD',
          // erp: 'SAP',
          processGroup: 'Vendor Management',
          status: 'Active',
          lastChange: '03/06/2025 11/10/15',
          connectionCode: 'EVOSAP02',
          description: 'SAP PRD Connection MF00',
          erp: 'sap_hana_2020',
          client: 'PRD',
          clientId: '120',
          connectionMethod: 'RFC',
          connectorDriver: '.net connector Versi XX121',
          destinationName: 'IDES-NEW',
          appServerHost: '192.168.5.50',
          user: 'TMS_EVOQ',
          password: 'Teamwork2026!!!',
          language: 'EN',
        },
        integrations: [], // BELUM ADA integration
      },
    ],
  }),

  /* ================= GETTERS ================= */
  getters: {
    /* ERP LIST (untuk table) */
    erpList: (state) =>
      state.erps.map((e) => {
        // NORMALISASI integrations → array
        const integrations = Array.isArray(e.integrations)
          ? e.integrations
          : Object.keys(e.integrations || {}).length
            ? [e.integrations]
            : []

        const inbound = integrations.filter((i) => i.type === 'Inbound').length
        const outbound = integrations.filter((i) => i.type === 'Outbound').length

        return {
          connectionCode: e.header.connectionCode, // ⬅️ pakai field yang benar
          companyCode: e.header.companyCode,
          companyName: e.header.companyName,
          systemClient: e.header.systemClient,
          erp: e.header.erp,
          processGroup: e.header.processGroup,
          status: e.header.status,
          totalIntegration: integrations.length,
          inbound,
          outBound: outbound,
          lastChange: e.header.lastChange,
        }
      }),

    getErps: (state) => state.erps,

    /* ERP DETAIL */
    getErpById: (state) => (id: string) => state.erps.find((e) => e.header.id === id),

    /* INTEGRATION */
    getIntegrationsByErp: (state) => (erpId: string) =>
      state.erps.find((e) => e.header.id === erpId)?.integrations ?? [],

    getIntegration: (state) => (erpId: string, code: string) =>
      state.erps.find((e) => e.header.id === erpId)?.integrations.find((i) => i.code === code),

    getIntegrationByCode: (state) => (erpId: string, integrationCode: string) => {
      const erp = state.erps.find((e) => e.header.id === erpId)
      if (!erp) return null

      // NORMALISASI integrations → array
      const integrations = Array.isArray(erp.integrations)
        ? erp.integrations
        : Object.keys(erp.integrations || {}).length
          ? [erp.integrations]
          : []

      return integrations.find((i) => i.code === integrationCode) ?? null
    },
  },

  /* ================= ACTIONS ================= */
  actions: {
    addErp(header: any) {
      this.erps.push({
        header,
        integrations: [],
      })
    },

    updateErp(erpId: string, payload: any) {
      const erp = this.erps.find((e) => e.header.id === erpId)
      if (!erp) return

      erp.header = {
        ...erp.header,
        ...payload,
        lastChange: new Date().toLocaleString(),
      }
    },
    deleteErp(erpId: string) {
      console.log('DELETE ERP ID:', erpId)
      console.log(
        'BEFORE:',
        this.erps.map((e) => e.header.id),
      )

      this.erps = this.erps.filter((e) => e.header.id !== erpId)

      console.log(
        'AFTER:',
        this.erps.map((e) => e.header.id),
      )
    },

    addIntegration(erpId: string, integration: any) {
      const erp = this.erps.find((e) => e.header.id === erpId)
      if (!erp) return
      erp.integrations.push(integration)
    },

    updateIntegration(erpId: string, integration: any) {
      const erp = this.erps.find((e) => e.header.id === erpId)
      if (!erp) return

      const idx = erp.integrations.findIndex((i) => i.code === integration.code)
      if (idx !== -1) erp.integrations[idx] = integration
    },
  },
})
