<script lang="ts" setup>
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'
import { ref } from 'vue'

defineProps<{ open: boolean; id?: string | number; namaVendor: string }>()
defineEmits(['close'])
const reason = ref<string>('')
</script>
<template>
  <UiModal :open="open" @close="$emit('close')" :title="`Deactive Vendor ${namaVendor}`">
    <form @submit.prevent="">
      <UiTextArea placeholder="Enter Reason" label="Reason" :model-value="reason" />
      <div class="flex gap-3">
        <UiButton
          class="flex-1 justify-center"
          :outline="true"
          type="button"
          @click="$emit('close')"
        >
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="danger">
          <UiIcon name="cross-circle" variant="duotone" />
          <span>Deactive</span>
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
