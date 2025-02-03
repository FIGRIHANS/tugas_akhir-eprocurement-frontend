import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavbarUtilsStore = defineStore('navbarUtils', () => {
  const isFull = ref(false)

  const setFull = () => {
    isFull.value = true
  }

  const setNotFull = () => {
    isFull.value = false
  }

  return { isFull, setFull, setNotFull }
})
