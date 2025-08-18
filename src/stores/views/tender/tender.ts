import axios from 'axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTenderStore = defineStore('tender', () => {
  const negoId = ref<string>('')
  const listGold = ref([])

  const getGold = async () => {
    const response = await axios.get('https://prices.lbma.org.uk/json/gold_am.json')
    const data = response.data

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    listGold.value = data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((d: any) => new Date(d.d) >= oneMonthAgo)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((d: any) => [d.d, d.v[0]])
  }

  return {
    negoId,
    listGold,
    getGold
  }
})