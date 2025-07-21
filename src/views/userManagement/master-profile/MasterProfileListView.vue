<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useUserProfileStore } from '@/stores/user-management/profile'
import { computed, onMounted, reactive, ref } from 'vue'
import type { IProfile } from '@/stores/user-management/types/profile'

const search = ref('')
const userProfileStore = useUserProfileStore()
const isModalOpen = ref(false)
const profilePayload = reactive<{
  profileId: number
  profileName: string
  isActive: boolean
}>({
  profileId: 0,
  profileName: '',
  isActive: true,
})

const profileNameError = ref('')
const isSaving = ref(false)

const modalTitle = computed(() =>
  profilePayload.profileId === 0 ? 'Add New Profile' : 'Edit Profile',
)

const filteredProfiles = computed(() => {
  if (!userProfileStore.profiles?.items) {
    return []
  }
  const searchTerm = search.value.toLowerCase()
  if (searchTerm) {
    return userProfileStore.profiles.items.filter((profile) =>
      profile.profileName.toLowerCase().includes(searchTerm),
    )
  }
  return userProfileStore.profiles.items.filter((profile) =>
    profile.profileName.toLowerCase().includes(searchTerm),
  )
})

const resetProfilePayload = () => {
  profilePayload.profileId = 0
  profilePayload.profileName = ''
  profilePayload.isActive = true
  profileNameError.value = ''
}

const closeAnyOpenDropdown = () => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  })
  document.body.dispatchEvent(event)
}

const openProfileModal = (profile?: IProfile) => {
  closeAnyOpenDropdown()
  if (profile) {
    Object.assign(profilePayload, profile)
  } else {
    resetProfilePayload()
  }
  isModalOpen.value = true
}

const closeProfileModal = () => {
  isModalOpen.value = false
  resetProfilePayload()
}

const validateProfileName = () => {
  if (!profilePayload.profileName.trim()) {
    profileNameError.value = 'Profile name cannot be empty!'
    return false
  }
  profileNameError.value = ''
  return true
}

const saveProfile = async () => {
  if (!validateProfileName()) {
    return
  }

  isSaving.value = true
  try {
    await userProfileStore.postUserProfile(profilePayload)
    closeProfileModal()
    alert(
      profilePayload.profileId === 0
        ? 'Profile added successfully!'
        : 'Profile updated successfully!',
    )
    await userProfileStore.getAllUserProfiles()
  } catch (error: unknown) {
    console.error('Failed to save profile:', error)
    alert(`Failed to save profile: ${error || 'Unknown error'}`)
  } finally {
    isSaving.value = false
  }
}

const deleteProfile = async (profile: IProfile) => {
  if (!confirm(`Are you sure you want to delete profile "${profile.profileName}"?`)) {
    return
  }

  try {
    await userProfileStore.postUserProfile({
      profileId: profile.profileId,
      profileName: profile.profileName,
      isActive: false,
    })
    alert('Profile deleted successfully!')
    await userProfileStore.getAllUserProfiles()
  } catch (error: unknown) {
    console.error('Failed to delete profile:', error)
    alert(`Failed to delete profile: ${error || 'Unknown error'}`)
  }
}

onMounted(() => {
  userProfileStore.getAllUserProfiles()
})
</script>

<template>
  <div>
    <BreadcrumbView
      title="Master Profile"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Master Profile', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">Master Profile</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search Profile" />
            <UiButton variant="primary" @click="openProfileModal()">
              <UiIcon variant="duotone" name="plus" />
              Add Profile</UiButton
            >
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="userProfileStore.loading" class="text-center py-4">Loading profiles...</div>
        <div v-else-if="userProfileStore.error" class="text-center py-4 text-red-500">
          Error: {{ userProfileStore.error }}
        </div>
        <table v-else-if="filteredProfiles.length > 0" class="table align-middle text-gray-700">
          <thead class="">
            <tr>
              <th></th>
              <th class="text-nowrap">Profile ID</th>
              <th class="text-nowrap">Profile Name</th>
              <th class="text-nowrap">Created Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="profile in filteredProfiles" :key="profile.profileId">
              <td>
                <div class="flex items-center space-x-3">
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
                          class="border-none"
                          :outline="true"
                          size="md"
                          @click="openProfileModal(profile)"
                        >
                          <UiIcon name="pencil" class="mr-2" />
                          Edit Profile
                        </UiButton>
                        <UiButton
                          variant="light"
                          class="border-none text-red-500 hover:text-red-600"
                          :outline="true"
                          size="md"
                          @click="deleteProfile(profile)"
                        >
                          <UiIcon name="trash" class="mr-2" />
                          Delete Profile
                        </UiButton>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ profile.profileId }}</td>
              <td>{{ profile.profileName }}</td>
              <td>{{ new Date(profile.createdUtcDate).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center py-4">No profiles found.</div>
      </div>
    </div>

    <UiModal
      :title="modalTitle"
      v-model="isModalOpen"
      @update:model-value="closeProfileModal"
      size="sm"
    >
      <UiInput
        label="Profile Name"
        placeholder="Enter profile name"
        row
        required
        v-model="profilePayload.profileName"
        :error="profileNameError !== ''"
        :hint-text="profileNameError"
      />
      <div class="mt-4 w-full gap-2 justify-end items-center flex">
        <UiButton outline @click="closeProfileModal">Cancel</UiButton>
        <UiButton variant="primary" @click="saveProfile" :disabled="isSaving">
          <span v-if="isSaving">Saving...</span>
          <span v-else>Save</span>
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

<style scoped></style>
