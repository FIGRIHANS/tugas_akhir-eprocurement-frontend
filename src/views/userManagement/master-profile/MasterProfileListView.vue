<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiLoading from '@/components/UiLoading.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

import { useUserProfileStore } from '@/stores/user-management/profile'
import { computed, onMounted, reactive, ref } from 'vue'
import type { IProfile } from '@/stores/user-management/types/profile'
import LPagination from '@/components/pagination/LPagination.vue'

const search = ref('')
const userProfileStore = useUserProfileStore()

const isModalOpen = ref(false)
const showSuccessModal = ref(false)
const showDeleteModal = ref(false)

const profileToDelete = ref<IProfile | null>(null)
const isDeleting = ref(false)

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
  const items = userProfileStore.profiles?.items ?? []
  const q = search.value.trim().toLowerCase()
  if (!q) return items
  return items.filter((p) => p.profileName.toLowerCase().includes(q))
})

const resetProfilePayload = () => {
  profilePayload.profileId = 0
  profilePayload.profileName = ''
  profilePayload.isActive = true
  profileNameError.value = ''
}

const closeAnyOpenDropdown = () => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
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
  if (!validateProfileName()) return
  isSaving.value = true
  try {
    await userProfileStore.postUserProfile(profilePayload)
    closeProfileModal()
    showSuccessModal.value = true
    await userProfileStore.getAllUserProfiles({
      page: 1,
      pageSize: 10,
    })
  } catch (error: unknown) {
    console.error('Failed to save profile:', error)
    alert(`Failed to save profile: ${String(error) || 'Unknown error'}`)
  } finally {
    isSaving.value = false
  }
}

function openDeleteModal(profile: IProfile) {
  closeAnyOpenDropdown()
  profileToDelete.value = profile
  showDeleteModal.value = true
}

async function handleProcessDelete() {
  if (!profileToDelete.value) return
  isDeleting.value = true
  try {
    await userProfileStore.postUserProfile({
      profileId: profileToDelete.value.profileId,
      profileName: profileToDelete.value.profileName,
      isActive: false,
    })
    showDeleteModal.value = false
    profileToDelete.value = null
    await userProfileStore.getAllUserProfiles({
      page: 1,
      pageSize: 10,
    })
  } catch (error: unknown) {
    console.error('Failed to delete profile:', error)
    alert(`Failed to delete profile: ${String(error) || 'Unknown error'}`)
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  userProfileStore.getAllUserProfiles({
    page: 1,
    pageSize: 10,
  })
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
              Add Profile
            </UiButton>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div v-if="userProfileStore.loading" class="text-center py-4">Loading profiles...</div>
        <div v-else-if="userProfileStore.error" class="text-center py-4 text-red-500">
          Error: {{ userProfileStore.error }}
        </div>

        <table v-else-if="filteredProfiles.length > 0" class="table align-middle text-gray-700">
          <thead>
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
                          @click="openDeleteModal(profile)"
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
        <LPagination
          :totalItems="userProfileStore.profiles.total"
          :pageSize="userProfileStore.profiles.pageSize"
          :currentPage="userProfileStore.profiles.page"
          @page-change="userProfileStore.changePage"
        />
      </div>
    </div>

    <!-- Add/Edit modal -->
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

    <!-- success modal -->
    <UiModal v-model="showSuccessModal" size="sm">
      <div class="text-center mb-6">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">Yeayyy</h3>
        <p class="text-center text-base text-gray-600 mb-5">Profile successfully created</p>
      </div>
    </UiModal>

    <!-- delete confirm modal -->
    <UiModal v-model="showDeleteModal" size="sm">
      <div class="text-center mb-6">
        <UiIcon
          name="cross-circle"
          variant="duotone"
          class="text-[150px] text-danger text-center"
        />
      </div>
      <h3 class="text-center text-lg font-medium">Are you sure to delete this profile?</h3>
      <p class="text-center text-base text-gray-600 mb-5">
        This action will permanently deactivate
        <strong v-if="profileToDelete">{{ profileToDelete.profileName }}</strong
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
          <UiLoading v-if="isDeleting" variant="white" />
          <template v-else>
            <UiIcon name="cross-circle" variant="duotone" />
            <span>Delete</span>
          </template>
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

<style scoped></style>
