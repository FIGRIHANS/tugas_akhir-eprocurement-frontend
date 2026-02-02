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

    <TabUserDetail
      v-model:activeTab="tabNow"
      :can-click-detail="canClickDetail"
      :can-click-profile="canClickProfile"
      :can-click-authorization="canClickAuthorization"
      :can-click-role="canClickRole"
      class="-mx-[24px]"
    />

    <div class="grid grid-cols-12 gap-4 mt-6">
      <div class="col-span-12">
        <component
          :is="contentComponent"
          :user-payload="userPayload"
          :profile-payload="profilePayload"
          :role-payload="rolePayload"
          @update:user-payload="userPayload = $event"
          @update:profile-payload="profilePayload = $event"
          @update:role-payload="rolePayload = $event"
          @update:is-form-valid="isFormValid = $event"
        />
      </div>
    </div>

    <div class="flex justify-between items-center mt-8 mb-8">
      <UiButton :disabled="false" @click="handleBack" outline>
        <span class="ki-outline ki-arrow-left mr-2 align-middle inline-block"></span>
        Back
      </UiButton>
      <UiButton
        :disabled="tabNow === 'detail' ? !isFormValid : false"
        variant="primary"
        @click="handleNext"
      >
        {{ isLastStep ? 'Submit' : 'Next' }}
        <span class="ki-outline ki-arrow-right ml-2 align-middle inline-block"></span>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import TabUserDetail from '@/components/userListNav/TabUserDetail.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { ref, computed, type Component, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user-management/user'

const UserDetailComponent = defineAsyncComponent(
  () => import('./sections/UserDetailStep.vue'),
)
const UserProfileComponent = defineAsyncComponent(
  () => import('./sections/UserProfileStep.vue'),
)
const UserAuthorizationComponent = defineAsyncComponent(
  () => import('./sections/UserAuthorizationStep.vue'),
)
const UserRoleComponent = defineAsyncComponent(
  () => import('./sections/UserRoleStep.vue'),
)

const userStore = useUserStore()
const router = useRouter()

const tabNow = ref<string>('detail')

const tabList = ['detail', 'profile', 'authorization', 'role']

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

const isFormValid = ref<boolean>(false)

const currentStepIndex = computed(() => {
  return tabList.findIndex((item) => item === tabNow.value)
})

const isFirstStep = computed(() => currentStepIndex.value === 0)
const isLastStep = computed(() => currentStepIndex.value === tabList.length - 1)

const canClickDetail = computed(() => true)
const canClickProfile = computed(() => currentStepIndex.value >= 1)
const canClickAuthorization = computed(() => currentStepIndex.value >= 2)
const canClickRole = computed(() => currentStepIndex.value >= 3)

const contentComponent = computed(() => {
  const components = {
    detail: UserDetailComponent,
    profile: UserProfileComponent,
    authorization: UserAuthorizationComponent,
    role: UserRoleComponent,
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const handleBack = () => {
  if (isFirstStep.value) {
    router.push('/user-management/user')
  } else {
    const prevIndex = currentStepIndex.value - 1
    tabNow.value = tabList[prevIndex]
  }
}

const handleNext = () => {
  if (tabNow.value === 'profile') {
    userPayload.value.profileId = profilePayload.value.profileId
  } else if (tabNow.value === 'role') {
    userPayload.value.selectedRoleIds = rolePayload.value.selectedRoleIds
  }

  if (!isLastStep.value) {
    const nextIndex = currentStepIndex.value + 1
    tabNow.value = tabList[nextIndex]
    window.scrollTo({ top: 0, behavior: 'smooth' } as ScrollToOptions)
  } else {
    handleSubmit()
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
</script>

<style scoped></style>
