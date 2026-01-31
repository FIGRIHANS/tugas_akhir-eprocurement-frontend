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
                uid: 'grp-7f2c1a90',
                id: 'IS_HEADER',
                name: 'IS_HEADER',
                relation: '1 to 1',
                rows: [
                  {
                    id: '1',
                    label: 'Invoice Date',
                    evoq: 'InvoiceDate',
                    sap: 'DOC_DATE',
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
        integrations: {}, // BELUM ADA integration
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

    updateErp(header: any) {
      const erp = this.erps.find((e) => e.header.id === header.id)
      if (erp) erp.header = header
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
