import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface IMenu {
  id: number
  menuName: string
  menuIcon: string
  menuUrl: string
  parentId: number
  sequential: number
  tier: string
}

export const useMenuStore = defineStore('menuStore', () => {
  // Initial Dummy Data
  const menus = ref<IMenu[]>([
    {
      id: 1,
      menuName: 'Dashboard',
      menuIcon: 'element-11',
      menuUrl: 'usermanagement.dashboard.user',
      parentId: 18,
      sequential: 5,
      tier: 'pages/master/*',
    },
    {
      id: 2,
      menuName: 'Bill / Invoice',
      menuIcon: 'bill',
      menuUrl: 'usermanagement.bill.list',
      parentId: 20,
      sequential: 12,
      tier: 'pages/master/*',
    },
    {
      id: 3,
      menuName: 'User Profile',
      menuIcon: 'user',
      menuUrl: 'usermanagement.user.profile',
      parentId: 12,
      sequential: 8,
      tier: 'pages/master/*',
    },
    {
      id: 4,
      menuName: 'Vendor Manage',
      menuIcon: 'users',
      menuUrl: 'usermanagement.vendor.manage',
      parentId: 0,
      sequential: 1,
      tier: 'pages/master/*',
    },
    {
      id: 5,
      menuName: 'Reporting',
      menuIcon: 'document',
      menuUrl: 'usermanagement.reporting',
      parentId: 0,
      sequential: 4,
      tier: 'pages/master/*',
    },
  ])

  const addMenu = (menu: Omit<IMenu, 'id'>) => {
    // Simulate ID generation
    const newId = menus.value.length > 0 ? Math.max(...menus.value.map((m) => m.id)) + 1 : 1
    menus.value.unshift({ ...menu, id: newId })
    return true
  }

  const deleteMenu = (id: number) => {
    menus.value = menus.value.filter((m) => m.id !== id)
  }

  return {
    menus,
    addMenu,
    deleteMenu,
  }
})
