<script setup lang="ts">
import { ref } from 'vue'
import successImg from '@/assets/success.svg'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiModal from '@/components/modal/UiModal.vue'
import { useApprovalStore } from '@/stores/vendor/approval'
import { useLoginStore } from '@/stores/views/login'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ id: string | number; nama: string }>()
const approvalStore = useApprovalStore()
const userStore = useLoginStore()

const router = useRouter()
const route = useRoute()

const modalReject = ref(false)
const modalSuccess = ref(false)
const reason = ref('')
const inputError = ref<string[]>([])

const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const handleReject = async () => {
  if (!reason.value.trim()) {
    inputError.value.push('reason')
    return
  }

  loading.value = true
  error.value = null

  try {
    await approvalStore.approve({
      vendorId: props.id as string,
      approvalStatus: 2,
      approvalById: userStore.userData?.profile.employeeId.toString() as string,
      approvalByName: userStore.userData?.profile.employeeName as string,
      approvalByPosition: userStore.userData?.profile.positionName as string,
      approvalNote: reason.value,
    })

    modalReject.value = false
    modalSuccess.value = true
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.result.message || 'Failed to reject approval Vendor'
      }
    }
  } finally {
    loading.value = false
  }
}

const handleSuccess = () => {
  approvalStore.getApproval({})
  router.replace(route.fullPath)
}
</script>
<template>
  <UiButton
    size="sm"
    :icon="true"
    variant="danger"
    :outline="true"
    @click="modalReject = !modalReject"
  >
    <UiIcon name="cross-circle" variant="duotone" />
  </UiButton>
  <UiModal v-model="modalReject" :title="`Reject vendor ${nama}`" size="sm">
    <form @submit.prevent="handleReject" class="space-y-3">
      <div class="relative mb-3">
        <label
          for="reason"
          class="absolute bg-white top-0 left-0 ml-2 -mt-2 text-sm text-gray-600 px-1"
          >Reason <span class="text-danger">*</span></label
        >
        <textarea id="reason" class="textarea" rows="6" v-model="reason" required></textarea>
      </div>
      <div v-if="inputError.includes('reason')" class="text-xs text-danger">Reason is required</div>
      <div class="flex gap-3">
        <UiButton
          class="flex-1 justify-center"
          :outline="true"
          type="button"
          @click="modalReject = !modalReject"
        >
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="danger" :disabled="loading">
          <span v-if="loading">Progress</span>
          <template v-else>
            <UiIcon name="cross-circle" variant="duotone" />
            <span>Reject</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <UiModal v-model="modalSuccess" size="sm" @update:model-value="handleSuccess">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Rejected</h3>
    <p class="text-gray-600 text-center mb-3">Vendor has been successfully Rejected</p>
  </UiModal>
</template>
