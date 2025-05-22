<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UiModal from '../modal/UiModal.vue'
import UiButton from '../ui/atoms/button/UiButton.vue'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'
import successImg from '@/assets/success.svg'

const props = defineProps<{ id: string | number; status: boolean; name: string }>()
const modalDeactive = ref(false)
const modalSuccess = ref(false)

// refs
const reason = ref<string>('')
const isChecked = ref<boolean>(props.status)
const inputError = ref<string[]>([])
const loading = ref<boolean>(false)

const handleSubmit = async () => {
  if (!reason.value) {
    inputError.value.push('reason')
    return
  }
  modalDeactive.value = false
  modalSuccess.value = true
}

const handleCancel = () => {
  modalDeactive.value = false
  isChecked.value = props.status
}

const handleChange = () => {
  modalDeactive.value = true
  isChecked.value = !isChecked.value
}

onMounted(() => {
  reason.value = ''
  inputError.value = []
})
</script>
<template>
  <label class="switch">
    <input
      name="check"
      type="checkbox"
      class="switch-on:checked:!bg-success"
      :checked="isChecked"
      @change="handleChange"
    />
    <span class="switch-label text-nowrap">{{ status ? 'Active' : 'Not Active' }}</span>
  </label>

  <!-- deactive modal -->
  <UiModal
    v-if="modalDeactive"
    v-model="modalDeactive"
    :title="`Deactive Vendor ${name}`"
    size="sm"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="relative">
        <label
          for="reason"
          class="absolute -mt-2 ml-2 px-1 bg-white text-gray-500"
          :class="{ '!text-danger': inputError.includes('reason') }"
        >
          Reason <span class="text-danger">*</span>
        </label>
        <textarea
          v-model="reason"
          class="textarea"
          :class="{ 'border-danger': inputError.includes('reason') }"
          rows="5"
          id="reason"
        ></textarea>
        <span v-if="inputError.includes('reason')" class="text-danger text-sm font-medium">
          Reason is Required
        </span>
      </div>
      <div class="flex gap-3">
        <UiButton class="flex-1 justify-center" :outline="true" type="button" @click="handleCancel">
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="danger" :disabled="loading">
          <span v-if="loading">Progress</span>
          <template v-else>
            <UiIcon name="cross-circle" variant="duotone" />
            <span>Deactive</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <!-- success modal -->
  <UiModal v-if="modalSuccess" v-model="modalSuccess" size="sm">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Successfully Deactivated</h3>
    <p class="text-gray-600 text-center mb-3">Vendor has been successfully Deactivated!.</p>
  </UiModal>
</template>
