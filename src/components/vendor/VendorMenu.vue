<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { ref } from 'vue'
import VendorVerificationModal from './verificationModal/VendorVerificationModal.vue'
import VendorBlacklistModal from './vendorBlacklistModal/VendorBlacklistModal.vue'
import UiModal from '../modal/UiModal.vue'
import successImg from '@/assets/success.svg'
import NotifyVendorModal from './notifyVendorModal/NotifyVendorModal.vue'

defineProps<{ id: string | number; name: string }>()
const verificationModalOpen = ref<boolean>(false)
const blacklistModalOpen = ref<boolean>(false)
const blacklistSuccessOpen = ref<boolean>(false)
const notifyVendorModalOpen = ref<boolean>(false)
const notifyVendorSuccessModalOpen = ref<boolean>(false)
</script>
<template>
  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
    <UiButton :outline="true" :icon="true" variant="secondary" class="dropdown-toggle">
      <UiIcon variant="outline" name="dots-vertical" />
    </UiButton>
    <div class="dropdown-content w-full max-w-60 space-y-5">
      <ul class="menu menu-default flex flex-col gap-2" data-dropdown-dismiss="true">
        <li class="menu-item">
          <RouterLink class="menu-link" :to="`/vendor-master/${id}/verification`">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="eye" />
            </span>
            <span class="menu-title"> Detail Vendor </span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <button class="menu-link" @click="verificationModalOpen = true">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="data" />
            </span>
            <span class="menu-title"> Detail Verifikasi </span>
          </button>
        </li>
        <div class="border-b border-b-gray-200"></div>
        <li class="menu-item">
          <button class="menu-link" @click="notifyVendorModalOpen = true">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="notification-bing" class="!text-warning" />
            </span>
            <span class="menu-title !text-warning"> Notify Vendor </span>
          </button>
        </li>
        <li class="menu-item">
          <button class="menu-link" @click="blacklistModalOpen = true">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="cross-circle" class="!text-red-600" />
            </span>
            <span class="menu-title !text-red-600"> Blacklist </span>
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

  <NotifyVendorModal
    v-model:open="notifyVendorModalOpen"
    v-model:success="notifyVendorSuccessModalOpen"
    v-if="notifyVendorModalOpen"
  />

  <UiModal v-if="blacklistSuccessOpen" v-model="blacklistSuccessOpen" size="sm">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Successfully Blacklisted</h3>
    <p class="text-gray-600 text-center mb-3">
      The vendor has been added to the blacklist and is no longer active in the system.
    </p>
  </UiModal>
  <UiModal v-if="notifyVendorSuccessModalOpen" v-model="notifyVendorSuccessModalOpen" size="sm">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Successfully Notified</h3>
    <p class="text-gray-600 text-center mb-3">
      Your remark has been delivered via email to the vendor’s contact.
    </p>
  </UiModal>
</template>
