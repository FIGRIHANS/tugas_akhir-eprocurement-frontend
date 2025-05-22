<template>
  <UiModal v-model="modalOpen" title="Notify Vendor" size="sm">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="relative">
        <label
          for="remarks"
          class="absolute -mt-2 ml-2 px-1 bg-white text-gray-500"
          :class="{ '!text-danger': inputError.includes('remarks') }"
        >
          Remarks <span class="text-danger">*</span>
        </label>
        <textarea
          v-model="remarks"
          class="textarea"
          :class="{ 'border-danger': inputError.includes('remarks') }"
          rows="5"
          id="remarks"
        ></textarea>
        <span v-if="inputError.includes('remarks')" class="text-danger text-sm font-medium"
          >Remarks is Required</span
        >
      </div>
      <div class="flex gap-3">
        <UiButton
          class="flex-1 justify-center"
          :outline="true"
          type="button"
          @click="modalOpen = !modalOpen"
        >
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="warning" :disabled="loading">
          <span v-if="loading">Progress</span>
          <template v-else>
            <UiIcon name="notification-bing" variant="duotone" />
            <span>Notify</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { ref } from 'vue'

// models
const modalOpen = defineModel('open')
const modalSuccessOpen = defineModel('success')

// refs
const remarks = ref<string>('')
const loading = ref<boolean>(false)
const inputError = ref<string[]>([])

// functions
const handleSubmit = async () => {
  if (!remarks.value) {
    inputError.value.push('remarks')
    return
  }

  modalOpen.value = false
  modalSuccessOpen.value = true
}
</script>
