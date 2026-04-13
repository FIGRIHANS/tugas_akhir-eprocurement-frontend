import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(false)

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const setCollapsed = (value: boolean) => {
    isCollapsed.value = value
  }

  return { isCollapsed, toggleSidebar, setCollapsed }
})
