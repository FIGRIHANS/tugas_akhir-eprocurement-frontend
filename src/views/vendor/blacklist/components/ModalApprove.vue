<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
import { KTModal } from '@/metronic/core'
import { useBlacklistStore } from '@/stores/vendor/blacklist'
import { useLoginStore } from '@/stores/views/login'
import { ref } from 'vue'
import information from '@/assets/svg/information.svg'
import { type IBlacklistApprovalPayload } from '@/stores/vendor/types/blacklist'

type Props = {
  id: number
}

const props = defineProps<Props>()
const emit = defineEmits(['onSuccess', 'onError', 'onClose'])

const userStore = useLoginStore()
const blacklistStore = useBlacklistStore()

const payload = ref<IBlacklistApprovalPayload>({
  BlacklistId: 0,
  ApproveStatus: 1, //approve
  ApprovalNote: 'approved',
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
  loading.value = true

  payload.value = {
    ...payload.value,
    BlacklistId: props.id,
    ApproveById: Number(userStore.userData?.profile.employeeId),
    ApproveByName: userStore.userData?.profile.employeeName as string,
  }

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
  <div class="modal" data-modal="true" id="modal-approve" data-modal-backdrop-static="true">
    <div class="modal-content modal-center-y w-full md:w-[500px]">
      <div class="modal-body py-5">
        <img :src="information" width="150" class="mx-auto mb-3" />
        <h3 class="text-center text-lg font-medium">Approve Blacklist Vendor Request?</h3>
        <p class="text-center text-base text-gray-600 mb-5">The vendor will be blacklisted</p>
        <ui-form-group hide-border :grid="2">
          <UiButton outline class="flex items-center justify-center" @click="onClose">
            <ui-icon name="black-left-line" variant="duotone" />
            <span>Cancel</span>
          </UiButton>
          <UiButton class="flex items-center justify-center" @click="onSubmit" :disabled="loading">
            <ui-loading variant="white" v-if="loading" />
            <ui-icon name="check-circle" variant="duotone" v-else />
            <span>Approve</span>
          </UiButton>
        </ui-form-group>
      </div>
    </div>
  </div>
</template>
