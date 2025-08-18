<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'
import UiLoading from '@/components/UiLoading.vue'
import { KTModal } from '@/metronic/core'
import { useBlacklistStore } from '@/stores/vendor/blacklist'
import type { IBlacklistApprovalPayload } from '@/stores/vendor/types/blacklist'
import { useLoginStore } from '@/stores/views/login'
import { ref } from 'vue'

type Props = {
  id: number
}

const props = defineProps<Props>()
const emit = defineEmits(['onSuccess', 'onError', 'onClose'])

const userStore = useLoginStore()
const blacklistStore = useBlacklistStore()

const payload = ref<IBlacklistApprovalPayload>({
  BlacklistId: 0,
  ApproveStatus: 2, //reject
  ApprovalNote: '',
  ApproveById: 0,
  ApproveByName: '',
})
const payloadError = ref<string[]>([])
const loading = ref(false)

const onClose = () => {
  const idModal = document.querySelector('#modal-reject')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  payloadError.value = []
}

const onSubmit = async () => {
  if (!payload.value.ApprovalNote) {
    payloadError.value.push('ApprovalNote')
    return
  }

  payload.value = {
    ...payload.value,
    BlacklistId: props.id,
    ApproveById: Number(userStore.userData?.profile.employeeId),
    ApproveByName: userStore.userData?.profile.employeeName as string,
    ApproveStatus: 2,
  }

  loading.value = true

  try {
    await blacklistStore.approval(payload.value)
    emit('onSuccess')
  } catch (error) {
    if (error instanceof Error) {
      emit('onError')
    }
  } finally {
    loading.value = false
    onClose()
  }
}
</script>

<template>
  <div class="modal" data-modal="true" id="modal-reject" data-modal-backdrop-static="true">
    <div class="modal-content modal-center-y w-full md:w-[500px]">
      <div class="modal-header">
        <h3 class="modal-title text-lg">Reject Blacklist Vendor Request</h3>
      </div>
      <div class="modal-body">
        <form @submit.prevent="onSubmit">
          <UiFormGroup hide-border>
            <div>
              <UiTextArea
                v-model="payload.ApprovalNote"
                label="Reason"
                placeholder="Reason"
                required
                :error="payloadError.includes('ApprovalNote')"
              />
              <span v-if="payloadError.includes('ApprovalNote')" class="form-hint !text-danger"
                >Reason required</span
              >
            </div>
          </UiFormGroup>
          <ui-form-group hide-border :grid="2" class="mt-2">
            <UiButton
              outline
              type="button"
              class="flex items-center justify-center"
              @click="onClose"
            >
              <UiIcon name="black-left-line" variant="duotone" />
              <span>Cancel</span>
            </UiButton>
            <UiButton
              variant="danger"
              type="submit"
              class="flex items-center justify-center"
              :disabled="loading"
            >
              <UiLoading variant="white" v-if="loading" />
              <UiIcon v-else name="cross-circle" variant="duotone" />
              <span>Reject</span>
            </UiButton>
          </ui-form-group>
        </form>
      </div>
    </div>
  </div>
</template>
