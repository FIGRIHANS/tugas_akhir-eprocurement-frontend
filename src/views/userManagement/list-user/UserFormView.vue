<template>
  <div>
    <BreadcrumbView
      title="Add New User"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'List User', to: '/user-management/user' },
        { name: 'Add New User', to: '#' },
      ]"
    />

    <UiTab
      v-model="tab.active"
      :items="tab.items"
      class="justify-center bg-secondary-active mb-7.5"
      numbering
      step
      @update:model-value="changeTab"
    />

    <div class="max-w-6xl mx-auto p-4">
      <UserDetailStep
        v-if="tab.active === 'detail_user'"
        :user-payload="userPayload"
        @update:user-payload="userPayload = $event"
      />
      <UserProfileStep
        v-else-if="tab.active === 'profile'"
        :profile-payload="profilePayload"
        @update:profile-payload="profilePayload = $event"
      />
      <UserAuthorizationStep v-else-if="tab.active === 'authorization'" />
      <UserRoleStep
        v-else-if="tab.active === 'role'"
        :role-payload="rolePayload"
        @update:role-payload="rolePayload = $event"
      />

      <div class="flex justify-between items-center gap-3 mt-8">
        <UiButton outline @click="handleCancel">Cancel </UiButton>
        <div class="flex gap-3 items-center">
          <UiButton :disabled="isFirstStep" @click="handleBack" outline> Back </UiButton>
          <UiButton variant="primary" @click="handleNext">
            {{ isLastStep ? 'Submit' : 'Next' }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import UserDetailStep from './sections/UserDetailStep.vue'
import UserProfileStep from './sections/UserProfileStep.vue'
import UserAuthorizationStep from './sections/UserAuthorizationStep.vue'
import UserRoleStep from './sections/UserRoleStep.vue'
import { useUserStore } from '@/stores/user-management/user'

const userStore = useUserStore()
const router = useRouter()

const tab = reactive({
  active: 'detail_user',
  items: [
    { label: 'Detail User', value: 'detail_user', disabled: false },
    { label: 'Profile', value: 'profile', disabled: false },
    { label: 'Authorization', value: 'authorization', disabled: false },
    { label: 'Role', value: 'role', disabled: false },
  ],
})

interface UserPayload {
  userName: string
  userPassword: string
  userPasswordConfirm: string
  employeeName: string
  isActive: boolean
  employeeId: number
  profileId: number
  selectedRoleIds: string[]
}

const userPayload = ref<UserPayload>({
  userName: '',
  userPassword: '',
  userPasswordConfirm: '',
  employeeName: '',
  isActive: true,
  employeeId: 0,
  profileId: 0,
  selectedRoleIds: [],
})

interface ProfilePayload {
  profileId: number
  profileName: string
  isActive: boolean
}

const profilePayload = ref<ProfilePayload>({
  profileId: 0,
  profileName: '',
  isActive: true,
})

interface RolePayload {
  selectedRoleIds: string[]
}

const rolePayload = ref<RolePayload>({
  selectedRoleIds: [],
})

const currentStepIndex = computed(() => {
  return tab.items.findIndex((item) => item.value === tab.active)
})

const isFirstStep = computed(() => currentStepIndex.value === 0)
const isLastStep = computed(() => currentStepIndex.value === tab.items.length - 1)

const changeTab = (value: string) => {
  tab.active = value
}

const handleCancel = () => {
  router.push('/user-management/user')
}

const handleBack = () => {
  if (!isFirstStep.value) {
    const prevStep = tab.items[currentStepIndex.value - 1]
    tab.active = prevStep.value
  }
}

const handleSubmit = async () => {
  try {
    await userStore.storeUserData(userPayload.value)
    router.push('/user-management/user')
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

const handleNext = () => {
  if (tab.active === 'profile') {
    userPayload.value.profileId = profilePayload.value.profileId
  } else if (tab.active === 'role') {
    userPayload.value.selectedRoleIds = rolePayload.value.selectedRoleIds
  }

  if (!isLastStep.value) {
    const nextStep = tab.items[currentStepIndex.value + 1]
    tab.active = nextStep.value
  } else {
    userPayload.value.profileId = profilePayload.value.profileId
    userPayload.value.selectedRoleIds = rolePayload.value.selectedRoleIds
    handleSubmit()
  }
}
</script>

<style scoped></style>
