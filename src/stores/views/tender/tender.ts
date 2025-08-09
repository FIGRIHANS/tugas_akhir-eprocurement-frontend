import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTenderStore = defineStore('tender', () => {
  const negoId = ref<string>('')

  return {
    negoId
  }
})