<template>
  <Teleport to="body">
    <UiModal
      v-model="isOpen"
      size="sm"
      hide-header
      class="!z-[9999]"
    >
      <div class="flex flex-col items-center gap-[30px] px-[20px] py-[10px]">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">
            Invoice Successfully {{ props.isDraft ? 'Drafted' : 'Submitted' }}
          </p>
          <p class="text-[13px] font-normal text-gray-600">
            {{
              props.isDraft
                ? 'Your invoice has been saved as a draft. You can review and make any necessary changes before submitting it for approval'
                : 'The invoice you sent is currently under review. Further information will be provided via notification.'
            }}
          </p>
        </div>
        <button type="button" class="btn btn-primary" @click="closeModal">OK</button>
      </div>
    </UiModal>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

const props = defineProps<{
  isDraft: boolean
  modelValue: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [value: boolean]
  afterClose: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emits('update:modelValue', value)
    if (!value) emits('afterClose')
  },
})

const closeModal = () => {
  isOpen.value = false
}
</script>

<style scoped>
:deep(.fixed.inset-0) {
  z-index: 9999 !important;
}
</style>
