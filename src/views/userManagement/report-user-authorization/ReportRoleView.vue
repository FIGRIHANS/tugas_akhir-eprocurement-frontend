<template>
  <div class="grid grid-cols-2 gap-12">
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-semibold">Role</h2>
          <UiInputSearch placeholder="Search role" v-model="searchKeyword" />
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Profile ID</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="profile in filteredProfiles"
              :key="profile.id"
              @click="selectProfile(profile.id)"
              :class="{
                'cursor-pointer': true,
                'bg-blue-600 text-white': profile.id === selectedProfileId,
              }"
            >
              <td>{{ profile.id }}</td>
              <td>{{ profile.name }}</td>
            </tr>
            <tr v-if="filteredProfiles.length === 0">
              <td colspan="2" class="text-center">Tidak ada profil ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-semibold">List of User</h2>
          <span v-if="selectedProfileName" class="text-sm text-gray-500">
            (Profile: {{ selectedProfileName }})
          </span>
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredUsers.length > 0">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="2" class="text-center">
                  {{
                    selectedProfileId
                      ? 'Tidak ada pengguna untuk profil ini.'
                      : 'Pilih profil untuk melihat daftar pengguna.'
                  }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { ref, computed } from 'vue'

// Data dummy untuk profil
const profiles = ref([
  { id: 1, name: 'Administrator' },
  { id: 2, name: 'Editor' },
  { id: 3, name: 'Viewer' },
  { id: 4, name: 'Developer' },
])

// Data dummy untuk pengguna
const users = ref([
  { id: 101, name: 'Alice', profileId: 1 },
  { id: 102, name: 'Bob', profileId: 1 },
  { id: 103, name: 'Charlie', profileId: 2 },
  { id: 104, name: 'David', profileId: 2 },
  { id: 105, name: 'Eve', profileId: 3 },
  { id: 106, name: 'Frank', profileId: 4 },
  { id: 107, name: 'Grace', profileId: 1 },
])

const searchKeyword = ref('')
const selectedProfileId = ref<number | null>(null)

// Computed property untuk memfilter profil berdasarkan keyword pencarian
const filteredProfiles = computed(() => {
  if (!searchKeyword.value) {
    return profiles.value
  }
  const lowerCaseKeyword = searchKeyword.value.toLowerCase()
  return profiles.value.filter(
    (profile) =>
      profile.name.toLowerCase().includes(lowerCaseKeyword) ||
      profile.id.toString().includes(lowerCaseKeyword),
  )
})

// Computed property untuk memfilter pengguna berdasarkan profil yang dipilih
const filteredUsers = computed(() => {
  if (selectedProfileId.value === null) {
    return []
  }
  return users.value.filter((user) => user.profileId === selectedProfileId.value)
})

// Computed property untuk mendapatkan nama profil yang dipilih
const selectedProfileName = computed(() => {
  const profile = profiles.value.find((p) => p.id === selectedProfileId.value)
  return profile ? profile.name : ''
})

// Fungsi untuk memilih profil
const selectProfile = (profileId: number) => {
  selectedProfileId.value = profileId
}
</script>

<style scoped></style>
