<template>
  <div class="card">
    <div class="card-header">
      <div class="w-full flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Select Profile</h2>
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
              :value="profile.profileName"
              :id="profile.profileName"
              v-model="selectedProfile"
            />
            <label class="form-check-label" :for="profile.profileName">{{ profile.profileName }}</label>
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
              :value="profile.profileName"
              :id="profile.profileName + '_col2'"
              v-model="selectedProfile"
            />
            <label class="form-check-label" :for="profile.profileName + '_col2'">{{ profile.profileName }}</label>
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
import { computed, onMounted, ref } from 'vue'

const searchKeyword = ref('')
const selectedProfile = ref<string | null>(null)

const userProfileStore = useUserProfileStore()

onMounted(() => {
  userProfileStore.getAllUserProfiles()
})

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
</script>
