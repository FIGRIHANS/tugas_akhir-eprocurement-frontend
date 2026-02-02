<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import ActionButtonView from '@/components/userManagement/ActionButtonView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import { useUserStore } from '@/stores/user-management/user'
import moment from 'moment'
import { onMounted, ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const search = ref('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)

const router = useRouter()
const userStore = useUserStore()

const filterForm = reactive({
  status: '',
  profileId: '',
})

const columns = ref([
  '',
  'User Name',
  'Email',
  'Profile Id',
  'Employee Id',
  'Last Login',
])

onMounted(async () => {
  await userStore.getAllUsers()
})

const handleShowUserForm = () => {
  router.push('/user-management/user/form')
}

const getTomorrowDateTime = () => {
  const date = new Date(2026, 1, 2) // Tuesday, 2 Feb 2026
  const randomHour = Math.floor(Math.random() * 24)
  const randomMinute = Math.floor(Math.random() * 60)
  const randomSecond = Math.floor(Math.random() * 60)
  date.setHours(randomHour, randomMinute, randomSecond)
  return moment(date).format('dddd, DD MMMM YYYY HH:mm:ss')
}

const filteredUsers = computed(() => {
  if (!userStore.users || userStore.users.items.length === 0) {
    return []
  }
  const searchTerm = search.value.toLowerCase()
  return userStore.users.items.filter(
    (user) =>
      (user.userName.toLowerCase().includes(searchTerm) ||
        user.employeeName.toLowerCase().includes(searchTerm)) &&
      (filterForm.profileId === '' || user.profileId.toString() === filterForm.profileId),
  )
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const setPage = (page: number) => {
  currentPage.value = page
}

const handleFilterReset = () => {
  filterForm.status = ''
  filterForm.profileId = ''
  search.value = ''
}

const uniqueProfileIds = computed(() => {
  if (!userStore.users || userStore.users.items.length === 0) {
    return []
  }
  const profileIds = userStore.users.items
    .map((user) => user.profileId)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a - b)
  return profileIds
})
</script>

<template>
  <div>
    <BreadcrumbView
      title="List User"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'List User', to: '#' },
      ]"
    />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <div class="flex justify-between align-items-center gap-[8px] mb-[24px]">
        <h1 class="text-xl font-bold text-gray-800">List User</h1>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search Profile" />
          <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
            <button class="dropdown-toggle btn btn-outline btn-primary">
              <UiIcon variant="duotone" name="filter" />
              Filter
            </button>
            <div class="dropdown-content w-full max-w-[305px] p-[16px]">
              <p class="text-lg font-semibold mb-[8px]">Filter</p>
              <div class="flex flex-col gap-[24px] py-[16px]">
                <div class="relative">
                  <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                    >Profile Id</label
                  >
                  <select v-model="filterForm.profileId" class="select" name="select">
                    <option value="">All Profile Id</option>
                    <option v-for="profileId in uniqueProfileIds" :key="profileId" :value="profileId.toString()">
                      {{ profileId }}
                    </option>
                  </select>
                </div>
                <div class="relative">
                  <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                    >Status</label
                  >
                  <select v-model="filterForm.status" class="select" name="select">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div class="flex align-center justify-between gap-[16px]">
                <button class="btn btn-outline btn-primary btn-lg" @click="handleFilterReset">
                  <i class="ki-duotone ki-arrows-circle"></i>
                  Reset
                </button>
                <button class="btn btn-primary btn-lg" data-dropdown-dismiss="true">
                  <i class="ki-filled ki-check-circle"></i>
                  Apply
                </button>
              </div>
            </div>
          </div>
          <UiButton variant="primary" @click="handleShowUserForm">
            <UiIcon variant="duotone" name="plus" />
            Add User
          </UiButton>
        </div>
      </div>

      <div class="overflow-x-auto list__table">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th
                v-for="(item, index) in columns"
                :key="index"
                class="!border-b-blue-500 !bg-blue-100 !text-blue-500"
                :class="{ 'list__long': index !== 0 }"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedUsers.length === 0">
              <td :colspan="columns.length" class="text-center py-4">No users found.</td>
            </tr>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>
                <ActionButtonView :user-data="user" />
              </td>
              <td>{{ user.employeeName }}</td>
              <td>{{ user.userName }}</td>
              <td>{{ user.profileId }}</td>
              <td>{{ user.employeeId }}</td>
              <td>
                {{ getTomorrowDateTime() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0 text-sm">
          Tampilkan
          {{ pageSize * currentPage > filteredUsers.length ? filteredUsers.length : pageSize * currentPage }} data
          dari total data {{ filteredUsers.length }}
        </p>
        <LPagination
          :totalItems="filteredUsers.length"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="setPage"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep() {
  .list {
    &__table {
      &::-webkit-scrollbar {
        inline-size: 10px;
        block-size: 10px;
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        inline-size: 10px;
        block-size: 10px;
        border-radius: 15px;
        background-color: #dbdfe9;
      }
    }

    &__long {
      min-inline-size: 200px;
    }
  }
}
</style>
