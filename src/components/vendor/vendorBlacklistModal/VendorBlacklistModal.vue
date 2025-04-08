<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import type { IVendorBlacklistModalProps } from './types/vendorBlacklistModal'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'
import { ref } from 'vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
defineProps<IVendorBlacklistModalProps>()
defineEmits(['close'])

const period = ref<string>('')
const file = ref<File>()
const reason = ref<string>('')

const handleSubmit = () => {}
</script>
<template>
  <UiModal :open="open" @close="$emit('close')" title="Blacklist Vendor" size="sm">
    <form action="" class="space-y-4" @submit.prevent="handleSubmit">
      <UiSelect label="Blacklist Period" v-model="period"></UiSelect>
      <div class="flex rounded-md overflow-hidden border border-primary">
        <label
          for="file"
          class="flex items-center px-3 text-primary bg-opacity-20 bg-blue-400 flex-1"
        >
          <div>Upload supporting files</div>
          <input type="file" name="file" id="file" hidden />
        </label>
        <button
          type="button"
          class="h-10 bg-primary text-white flex items-center justify-center px-3 border border-primary"
        >
          Upload file
        </button>
      </div>
      <UiTextArea label="Reason" :model-value="reason" placeholder="Enter reason" />
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
          <span>Blacklist</span>
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
