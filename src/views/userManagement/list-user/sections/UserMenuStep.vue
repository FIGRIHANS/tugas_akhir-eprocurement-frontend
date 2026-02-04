<template>
  <div class="card">
    <div class="card-header">
      <div class="w-full flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Select Menu</h2>
        <UiInputSearch placeholder="Search" v-model="searchKeyword" />
      </div>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-2 gap-12 mb-[24px]">
        <UiFormGroup hide-border>
          <div
            v-for="profile in profilesColumn1"
            :key="profile.id"
            class="form-check form-check-custom form-check-solid"
          >
            <input
              class="form-check-input mr-2"
              type="checkbox"
              :value="profile.id"
              :id="profile.profileName + '_c1'"
              v-model="selectedProfileIds"
              @change="updateProfilePayload"
            />
            <label class="form-check-label" :for="profile.profileName">{{
              profile.profileName
            }}</label>
          </div>
        </UiFormGroup>

        <UiFormGroup hide-border>
          <div
            v-for="profile in profilesColumn2"
            :key="profile.id"
            class="form-check form-check-custom form-check-solid"
          >
            <input
              class="form-check-input mr-2"
              type="checkbox"
              :value="profile.id"
              :id="profile.profileName + '_c2'"
              v-model="selectedProfileIds"
              @change="updateProfilePayload"
            />
            <label class="form-check-label" :for="profile.profileName + '_col2'">{{
              profile.profileName
            }}</label>
          </div>
        </UiFormGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { computed, onMounted, ref, watch } from 'vue'

const searchKeyword = ref('')
// Ganti selectedProfile menjadi selectedProfileId untuk menyimpan ID
const selectedProfileIds = ref<number[]>([])

// Dummy menu/profile list (replacing API)
const dummyProfiles = ref([
  { id: 1, profileName: 'Dashboard', isActive: true },
  { id: 2, profileName: 'Bill / Invoice', isActive: true },
  { id: 3, profileName: 'User Profile', isActive: true },
  { id: 4, profileName: 'Vendor Manage', isActive: true },
  { id: 5, profileName: 'Reporting', isActive: true },
])

// Mendefinisikan interface untuk prop profilePayload
interface ProfilePayload {
  profileId: number
  profileName: string
  isActive: boolean
  // optional array when multiple menus selected
  profileIds?: number[]
}

const props = defineProps<{
  profilePayload: ProfilePayload
}>()

const emit = defineEmits<{
  'update:profile-payload': [payload: ProfilePayload]
}>()

onMounted(() => {
  // Inisialisasi selectedProfileIds dari prop saat komponen dimuat
  selectedProfileIds.value = props.profilePayload?.profileId ? [props.profilePayload.profileId] : []
})

// Gunakan watch untuk memperbarui selectedProfileId saat prop profilePayload.profileId berubah
watch(
  () => props.profilePayload.profileId,
  (newVal) => {
    selectedProfileIds.value = newVal ? [newVal] : []
  },
)

const filteredProfiles = computed(() => {
  const profiles = dummyProfiles.value
  if (!profiles) return []
  const searchTerm = searchKeyword.value.toLowerCase()
  if (searchTerm) {
    return profiles.filter((profile) => profile.profileName.toLowerCase().includes(searchTerm))
  }
  return profiles
})

const profilesColumn1 = computed(() => {
  const profiles = filteredProfiles.value
  const mid = Math.ceil(profiles.length / 2)
  return profiles.slice(0, mid)
})

const profilesColumn2 = computed(() => {
  const profiles = filteredProfiles.value
  const mid = Math.ceil(profiles.length / 2)
  return profiles.slice(mid)
})

// Fungsi untuk memperbarui profilePayload saat checkbox diubah (multiple selection)
const updateProfilePayload = () => {
  const selected = filteredProfiles.value.filter((p) => selectedProfileIds.value.includes(p.id))
  const profileIds = selectedProfileIds.value.slice()
  const firstId = profileIds.length > 0 ? profileIds[0] : 0
  const profileName = selected.length === 1 ? selected[0].profileName : profileIds.length > 1 ? selected.map(s => s.profileName).join(', ') : ''

  const newProfilePayload: ProfilePayload = {
    profileId: firstId,
    profileName: profileName,
    isActive: selected.length > 0 ? selected[0].isActive : true,
    profileIds: profileIds,
  }
  emit('update:profile-payload', newProfilePayload)
}
</script>

<style scoped></style>
