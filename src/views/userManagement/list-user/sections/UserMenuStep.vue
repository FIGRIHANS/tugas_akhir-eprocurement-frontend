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
              type="radio"
              :value="profile.id"
              :id="profile.profileName"
              v-model="selectedProfileId"
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
              type="radio"
              :value="profile.id"
              :id="profile.profileName + '_col2'"
              v-model="selectedProfileId"
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
import { useUserProfileStore } from '@/stores/user-management/profile'
import { computed, onMounted, ref, watch } from 'vue'

const searchKeyword = ref('')
// Ganti selectedProfile menjadi selectedProfileId untuk menyimpan ID
const selectedProfileId = ref<number | null>(null)

const userProfileStore = useUserProfileStore()

// Mendefinisikan interface untuk prop profilePayload
interface ProfilePayload {
  profileId: number
  profileName: string
  isActive: boolean
}

const props = defineProps<{
  profilePayload: ProfilePayload
}>()

const emit = defineEmits<{
  'update:profile-payload': [payload: ProfilePayload]
}>()

onMounted(() => {
  const body = {
    page: 1,
    pageSize: 100,
    searchText: '',
  }
  userProfileStore.getAllUserProfiles(body)
  // Inisialisasi selectedProfileId dari prop saat komponen dimuat
  selectedProfileId.value = props.profilePayload.profileId
})

// Gunakan watch untuk memperbarui selectedProfileId saat prop profilePayload.profileId berubah
watch(
  () => props.profilePayload.profileId,
  (newVal) => {
    selectedProfileId.value = newVal
  },
)

const filteredProfiles = computed(() => {
  if (!userProfileStore.profiles?.items) {
    return []
  }

  const searchTerm = searchKeyword.value.toLowerCase()

  if (searchTerm) {
    return userProfileStore.profiles.items.filter((profile) =>
      profile.profileName.toLowerCase().includes(searchTerm),
    )
  }

  return userProfileStore.profiles.items
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

// Fungsi untuk memperbarui profilePayload saat radio button diubah
const updateProfilePayload = () => {
  const selectedProfileData = filteredProfiles.value.find(
    (profile) => profile.id === selectedProfileId.value,
  )
  if (selectedProfileData) {
    const newProfilePayload: ProfilePayload = {
      profileId: selectedProfileData.id,
      profileName: selectedProfileData.profileName,
      isActive: selectedProfileData.isActive, // Asumsi isActive ada di data profil
    }
    emit('update:profile-payload', newProfilePayload)
  }
}
</script>

<style scoped></style>
