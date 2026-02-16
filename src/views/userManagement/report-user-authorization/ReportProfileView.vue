<template>
  <div class="grid grid-cols-2 gap-12">
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-semibold">Profile</h2>
          <UiInputSearch placeholder="Search profile" v-model="searchKeyword" />
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Profile ID</th>
              <th>Profile Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="profile in filteredProfiles"
              :key="profile.profileId"
              @click="selectProfile(profile.profileId)"
              :class="{
                'cursor-pointer': true,
                'bg-primary text-white': profile.profileId === selectedProfileId,
              }"
            >
              <td>{{ profile.profileId }}</td>
              <td>{{ profile.profileName }}</td>
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
          <h2 class="text-lg font-semibold">List of Role</h2>
          <span v-if="selectedProfileName" class="text-sm text-gray-500">
            (Profile: {{ selectedProfileName }})
          </span>
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 20%">Role ID</th>
              <th style="width: 80%">Role Name</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredRoles.length > 0">
              <tr v-for="role in filteredRoles" :key="role.roleId">
                <td>{{ role.roleId }}</td>
                <td>{{ role.roleName }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="2" class="text-center">
                  {{
                    selectedProfileId
                      ? 'Tidak ada role untuk profil ini.'
                      : 'Pilih profil untuk melihat daftar role.'
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
import { ref, computed, onMounted } from 'vue'
import { useUserProfileStore } from '@/stores/user-management/profile'

const profileStore = useUserProfileStore()

// Dummy Roles Data as requested
const dummyRoles = ref([
  { roleId: '80021', roleName: 'Invoice Admin', profileId: 1 },
  { roleId: '80022', roleName: 'Invoice Verification PO', profileId: 1 },
  { roleId: '80023', roleName: 'Invoice Approver PO', profileId: 2 },
  { roleId: '80024', roleName: 'User Review', profileId: 2 },
  { roleId: '80025', roleName: 'Submitter Invoice', profileId: 3 },
  { roleId: '80026', roleName: 'System Admin', profileId: 1 },
  { roleId: '80027', roleName: 'Invoice Verification Non PO', profileId: 4 },
  { roleId: '80028', roleName: 'Invoice Approver Non PO', profileId: 4 },
])

const searchKeyword = ref('')
const selectedProfileId = ref<number | null>(null)

// Computed property untuk memfilter profil berdasarkan keyword pencarian
const filteredProfiles = computed(() => {
  const items = profileStore.profiles.items
  if (!searchKeyword.value) {
    return items
  }
  const lowerCaseKeyword = searchKeyword.value.toLowerCase()
  return items.filter(
    (profile) =>
      profile.profileName.toLowerCase().includes(lowerCaseKeyword) ||
      profile.profileId.toString().includes(lowerCaseKeyword),
  )
})

// Computed property untuk memfilter roles berdasarkan profil yang dipilih
// Note: Karena ini dummy, kita asumsikan mapping sederhana atau tampilkan semua jika belum ada mapping real
const filteredRoles = computed(() => {
  if (selectedProfileId.value === null) {
    return []
  }
  // Simple simulation: Distribute roles based on simulated profileId match
  // In real app, this would filter based on actual profile-role relation
  // For now, let's just show some roles for demo matching the requested data structure (assuming profileId matches)
  return dummyRoles.value.filter((role) => role.profileId === (selectedProfileId.value! % 4) + 1)
  // Modulo used to ensure data shows up for various profile IDs since we don't know real IDs
})

// Computed property untuk mendapatkan nama profil yang dipilih
const selectedProfileName = computed(() => {
  const profile = profileStore.profiles.items.find((p) => p.profileId === selectedProfileId.value)
  return profile ? profile.profileName : ''
})

// Fungsi untuk memilih profil
const selectProfile = (profileId: number) => {
  selectedProfileId.value = profileId
}

onMounted(async () => {
  // Fetch Profiles
  if (profileStore.profiles.items.length === 0) {
    await profileStore.getAllUserProfiles({ page: 1, pageSize: 100, searchText: '' })
  }
})
</script>

<style scoped></style>
