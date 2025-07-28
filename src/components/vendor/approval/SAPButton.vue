<script setup lang="ts">
import LogoSAP from '@/assets/svg/LogoSAP.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useApprovalStore } from '@/stores/vendor/approval'
import { useLoginStore } from '@/stores/views/login'
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const approvalStore = useApprovalStore()
const userStore = useLoginStore()

const props = defineProps<{ id: number }>()

const modalSuccess = ref<boolean>(false)
const modalError = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const isSent = ref<boolean>(false)

const handleSend = async () => {
  loading.value = true
  error.value = null

  try {
    await approvalStore.sendSAP({ vendorId: props.id })
    isSent.value = true
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value =
          err.response?.data.result?.message ??
          'Vendor Data could not be sent to SAP due to a system error or invalid data.'
        modalError.value = true
      }
    }
  } finally {
    loading.value = false
  }
}

const handleApprove = async () => {
  try {
    await approvalStore.approve({
      vendorId: props.id.toString(),
      approvalById: userStore.userData?.profile.employeeId.toString() as string,
      approvalByName: userStore.userData?.profile.employeeName as string,
      approvalByPosition: userStore.userData?.profile.positionName as string,
      approvalStatus: 3,
      approvalNote: 'Send to SAP', // No note needed for sending to SAP
    })
    modalSuccess.value = true
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value =
          err.response?.data.result?.message ??
          'Vendor Data could not be sent to SAP due to a system error or invalid data.'
        modalError.value = true
      }
    }
  }
}

const handleClose = () => {
  router.replace({ name: route.name })
  approvalStore.getApproval({})
}

watch(isSent, (value) => {
  if (value) {
    handleApprove()
  }
})
</script>

<template>
  <UiButton @click="handleSend" :disabled="loading">
    <span v-if="loading">Progress</span>
    <template v-else>
      <UiIcon name="paper-plane" variant="duotone" />
      <span class="text-nowrap">Send to SAP</span>
    </template>
  </UiButton>

  <UiModal v-model="modalSuccess" size="sm" @update:model-value="handleClose">
    <LogoSAP class="mx-auto mb-5" />
    <h3 class="text-center text-lg font-medium">Vendor Successfully Send to SAP</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      Vendor information has been submitted to SAP.
    </p>
  </UiModal>

  <UiModal v-model="modalError" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">Failed to Send to SAP</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ error }}
    </p>
  </UiModal>
</template>
