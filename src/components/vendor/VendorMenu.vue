<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { ref } from 'vue'
import VendorVerificationModal from './verificationModal/VendorVerificationModal.vue'
import VendorBlacklistModal from './vendorBlacklistModal/VendorBlacklistModal.vue'
import UiModal from '../modal/UiModal.vue'
import successImg from '@/assets/success.svg'
import { useRouter } from 'vue-router'

defineProps<{ id: string | number; name: string; email: string; status: number }>()
const router = useRouter()
const verificationModalOpen = ref<boolean>(false)
const blacklistModalOpen = ref<boolean>(false)
const blacklistSuccessOpen = ref<boolean>(false)

const handleSuccess = () => {
  router.replace({ name: 'vendor-list' })
}
</script>
<template>
  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
    <UiButton :outline="true" :icon="true" variant="secondary" class="dropdown-toggle">
      <UiIcon variant="outline" name="dots-vertical" />
    </UiButton>
    <div class="dropdown-content w-full max-w-60 space-y-5">
      <ul class="menu menu-default flex flex-col gap-2" data-dropdown-dismiss="true">
        <li class="menu-item">
          <RouterLink class="menu-link" :to="`/vendor/master/${id}`">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="eye" />
            </span>
            <span class="menu-title"> Vendor Detail </span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <button class="menu-link" @click="verificationModalOpen = true">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="data" />
            </span>
            <span class="menu-title"> Verification Detail </span>
          </button>
        </li>
        <div class="border-b border-b-gray-200"></div>
        <li class="menu-item">
          <button
            class="menu-link disabled:cursor-not-allowed"
            @click="blacklistModalOpen = true"
            :disabled="status === 2"
          >
            <span class="menu-icon">
              <UiIcon
                variant="duotone"
                name="cross-circle"
                :class="{
                  '!text-red-600': status !== 2,
                  '!text-gray-600': status === 2,
                }"
              />
            </span>
            <span
              class="menu-title"
              :class="{
                '!text-red-600': status !== 2,
                '!text-gray-600': status === 2,
              }"
            >
              Blacklist
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>

  <VendorVerificationModal
    :id="id"
    :name="name"
    v-model="verificationModalOpen"
    v-if="verificationModalOpen"
  />

  <VendorBlacklistModal
    :id="id"
    v-model:open="blacklistModalOpen"
    v-model:success="blacklistSuccessOpen"
    v-if="blacklistModalOpen"
  />

  <UiModal
    v-if="blacklistSuccessOpen"
    v-model="blacklistSuccessOpen"
    size="sm"
    @update:model-value="handleSuccess"
  >
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Successfully Blacklisted</h3>
    <p class="text-gray-600 text-center mb-3">
      The vendor has been added to the blacklist and is no longer active in the system.
    </p>
  </UiModal>
</template>
