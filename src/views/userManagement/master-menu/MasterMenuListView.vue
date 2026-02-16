<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiModal from '@/components/modal/UiModal.vue'
import { ref, computed } from 'vue'
import { useMenuStore } from '@/stores/user-management/menu'
import { useRouter } from 'vue-router'

interface IMenu {
  id: number
  menuName: string
  menuIcon: string
  menuUrl: string
  parentId: number
  sequential: number
  tier: string
}

const store = useMenuStore()
const router = useRouter()

const search = ref('')
const pageSize = ref(10)
const currentPage = ref(1)

const onPageChange = (page: number) => {
  currentPage.value = page
}

const filteredMenus = computed(() => {
  // Basic Search
  if (!search.value) return store.menus
  return store.menus.filter(
    (m) =>
      m.menuName.toLowerCase().includes(search.value.toLowerCase()) ||
      m.menuUrl.toLowerCase().includes(search.value.toLowerCase()),
  )
})

// Delete Logic
const showDeleteModal = ref(false)
const menuToDelete = ref<IMenu | null>(null)
const isDeleting = ref(false)

const openDeleteModal = (menu: IMenu) => {
  menuToDelete.value = menu
  showDeleteModal.value = true
}

const handleProcessDelete = () => {
  if (menuToDelete.value) {
    isDeleting.value = true
    // Simulate API call
    setTimeout(() => {
      store.deleteMenu(menuToDelete.value.id)
      isDeleting.value = false
      showDeleteModal.value = false
      menuToDelete.value = null
    }, 500)
  }
}

const handleAction = (action: string, menu: IMenu) => {
  if (action === 'Delete') {
    openDeleteModal(menu)
  } else if (action === 'Detail') {
    // Navigate to Detail Page
    router.push({
      name: 'user-management-master-menu-detail',
      params: { id: menu.id },
    })
  } else {
    alert(`${action} on menu ID ${menu.id}`)
  }
}
</script>

<template>
  <div>
    <BreadcrumbView
      title="Master Menu"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Master Menu', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">List Menu</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search Menu" />
            <UiButton
              variant="primary"
              @click="router.push({ name: 'user-management-master-menu-add' })"
            >
              <UiIcon variant="duotone" name="plus" />
              Add Menu
            </UiButton>
          </div>
        </div>
      </div>

      <div class="card-body">
        <table class="table align-middle text-gray-700">
          <thead>
            <tr>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500"></th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Menu Name</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Menu Icon</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Menu Url</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Parent ID</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Sequential</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Tier</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredMenus.length === 0">
              <td colspan="9" class="text-center py-4">No menus found.</td>
            </tr>
            <tr
              v-for="menu in filteredMenus"
              :key="menu.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td>
                <div
                  class="dropdown"
                  data-dropdown="true"
                  data-dropdown-trigger="click"
                  data-dropdown-placement="bottom-end"
                >
                  <UiButton
                    class="dropdown-toggle"
                    variant="light"
                    :outline="true"
                    :icon="true"
                    size="sm"
                  >
                    <UiIcon name="dots-vertical" />
                  </UiButton>
                  <div class="dropdown-content w-auto p-4 space-y-2">
                    <div class="flex flex-col space-y-2">
                      <UiButton
                        variant="light"
                        class="border-none justify-start"
                        :outline="true"
                        size="md"
                        @click="handleAction('Detail', menu)"
                      >
                        <UiIcon name="eye" class="mr-2 text-teal-500" />
                        Detail
                      </UiButton>
                      <UiButton
                        variant="light"
                        class="border-none justify-start"
                        :outline="true"
                        size="md"
                        @click="handleAction('Edit', menu)"
                      >
                        <UiIcon name="pencil" class="mr-2 text-yellow-500" />
                        Edit
                      </UiButton>
                      <UiButton
                        variant="light"
                        class="border-none text-red-500 hover:text-red-600 justify-start"
                        :outline="true"
                        size="md"
                        @click="handleAction('Delete', menu)"
                      >
                        <UiIcon name="trash" class="mr-2" />
                        Delete
                      </UiButton>
                    </div>
                  </div>
                </div>
              </td>
              <td class="font-medium text-gray-800">{{ menu.menuName }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <UiIcon :name="menu.menuIcon" variant="duotone" class="text-xl text-gray-500" />
                  <span class="text-gray-600">{{ menu.menuIcon }}</span>
                </div>
              </td>
              <td>{{ menu.menuUrl }}</td>
              <td>{{ menu.parentId }}</td>
              <td>{{ menu.sequential }}</td>
              <td>{{ menu.tier }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer flex justify-between items-center">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select class="form-select form-select-sm w-20" v-model="pageSize">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span>per page</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">
            {{ (currentPage - 1) * pageSize + 1 }}-{{
              Math.min(currentPage * pageSize, filteredMenus.length)
            }}
            of {{ filteredMenus.length }}
          </span>
          <LPagination
            :totalItems="filteredMenus.length"
            :pageSize="pageSize"
            :currentPage="currentPage"
            @page-change="onPageChange"
          />
        </div>
      </div>
    </div>
    <!-- Delete Modal -->
    <UiModal v-model="showDeleteModal" size="sm">
      <div class="text-center mb-6">
        <UiIcon
          name="cross-circle"
          variant="duotone"
          class="text-[150px] text-danger text-center"
        />
      </div>
      <h3 class="text-center text-lg font-medium">Are you sure to delete this menu?</h3>
      <p class="text-center text-base text-gray-600 mb-5">
        This action will permanently remove
        <strong v-if="menuToDelete">{{ menuToDelete.menuName }}</strong
        >.
      </p>
      <div class="flex gap-3 px-8 mb-3">
        <UiButton
          outline
          @click="showDeleteModal = false"
          class="flex-1 flex items-center justify-center"
        >
          <UiIcon name="black-left-line" />
          <span>Cancel</span>
        </UiButton>
        <UiButton
          variant="danger"
          class="flex-1 flex items-center justify-center"
          @click="handleProcessDelete"
          :disabled="isDeleting"
        >
          <template v-if="isDeleting">
            <span>Deleting...</span>
          </template>
          <template v-else>
            <UiIcon name="cross-circle" variant="duotone" />
            <span>Delete</span>
          </template>
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
