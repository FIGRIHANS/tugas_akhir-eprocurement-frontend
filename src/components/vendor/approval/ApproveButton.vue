<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { ref } from 'vue'
import successImg from '@/assets/success.svg'
import { useApprovalStore } from '@/stores/vendor/approval'
import { useLoginStore } from '@/stores/views/login'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const approvalStore = useApprovalStore()
const userStore = useLoginStore()

const router = useRouter()
const route = useRoute()

const props = defineProps<{ id: string | number; nama: string }>()
const modal = ref(false)
const successModal = ref(false)
const errorModal = ref(false)

const reason = ref('')
const inputError = ref<string[]>([])

const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const handleApprove = async () => {
  if (!reason.value) {
    inputError.value = [...inputError.value, 'reason']
    return
  }

  loading.value = true
  error.value = null
  // call api here
  try {
    await approvalStore.approve({
      vendorId: props.id as string,
      approvalStatus: 1, //for approved
      approvalById: userStore.userData?.profile.employeeId.toString() as string,
      approvalByName: userStore.userData?.profile.employeeName as string,
      approvalByPosition: userStore.userData?.profile.positionName as string,
      approvalNote: reason.value,
    })

    modal.value = false
    successModal.value = true
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value =
          err.response?.data.result.message ??
          'Vendor Data could not be approve due to a system error or invalid data.'
        modal.value = false
        errorModal.value = true
      }
    }
  } finally {
    loading.value = false
  }
}

const handleSuccess = () => {
  approvalStore.getApproval({})
  router.replace({ name: route.name })
}
</script>
<template>
  <UiButton size="sm" :icon="true" @click="modal = !modal">
    <UiIcon name="check-circle" variant="duotone" />
  </UiButton>

  <UiModal v-model="modal" size="sm" title="Vendor Approval">
    <form @submit.prevent="handleApprove">
      <div class="relative">
        <label for="reason" class="block absolute -mt-2 ml-2 text-gray-500 bg-white px-1">
          Reason <span class="text-danger">*</span>
        </label>
        <textarea
          id="reason"
          class="textarea textarea-lg"
          :class="{ 'border-danger': inputError.includes('reason') }"
          rows="6"
          v-model="reason"
        ></textarea>
      </div>
      <span class="text-danger text-xs" v-if="inputError.includes('reason')">
        Reason is required
      </span>
      <div class="flex gap-3 mt-5">
        <UiButton class="flex-1 justify-center" :outline="true" @click="modal = !modal">
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" :disabled="loading">
          <span v-if="loading">Progress</span>
          <template v-else>
            <UiIcon name="check-circle" variant="duotone" />
            <span>Approve</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <UiModal v-model="successModal" size="sm" @update:model-value="handleSuccess">
    <img :src="successImg" alt="confirmation" class="mx-auto w-[202px] h-auto mb-5" />
    <h3 class="text-center text-lg font-medium">Vendor {{ nama }} successfully approved</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      The Vendor has been successfully approved.
    </p>
  </UiModal>

  <UiModal v-model="errorModal" size="sm" @update:model-value="handleSuccess">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">Failed to approve Vendor data!</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ error }}
    </p>
  </UiModal>
</template>
