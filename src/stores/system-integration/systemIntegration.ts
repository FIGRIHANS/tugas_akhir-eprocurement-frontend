import { defineStore } from 'pinia'
import type { IntegrationItem } from './types/integration-item'

export const useIntegrationStore = defineStore('integration', {
  state: () => ({
    integrationList: [] as IntegrationItem[],
  }),

  actions: {
    addIntegration(item: IntegrationItem) {
      this.integrationList.push(item)
    },

    setIntegrationList(list: IntegrationItem[]) {
      this.integrationList = list
    },

    reset() {
      this.integrationList = []
    },

    updateIntegration(item: IntegrationItem) {
      this.integrationList = this.integrationList.map((i) =>
        i.code === item.code ? { ...item } : i,
      )
    },
  },
})
