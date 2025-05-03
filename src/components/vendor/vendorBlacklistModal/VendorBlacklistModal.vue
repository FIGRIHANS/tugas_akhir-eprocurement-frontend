<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import type { IVendorBlacklistModalProps } from './types/vendorBlacklistModal'
import { onMounted, ref } from 'vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useBlacklistPeriodStore } from '@/stores/vendor/reference'
import { useVendorUploadStore, type IUploadResponse } from '@/stores/vendor/upload'
import UiLoading from '@/components/UiLoading.vue'

const periodStore = useBlacklistPeriodStore()
const uploadStore = useVendorUploadStore()

defineProps<IVendorBlacklistModalProps>()
const open = defineModel()
const period = ref<string>('')
const file = ref<File>()
const reason = ref<string>('')
const tglMulai = ref<Date>()
const tglSelesai = ref<Date>()
const uploadedFile = ref<IUploadResponse>()
const inputError = ref<string[]>([])

const handleUpload = async () => {
  const formData = new FormData()
  formData.append('FormFile', file.value as File)
  formData.append('Actioner', '')
  formData.append('FolderName', '')
  formData.append('FileName', file.value?.name as string)

  uploadedFile.value = await uploadStore.upload(formData)
}

const handleSubmit = () => {
  inputError.value = []

  if (!period.value) {
    inputError.value.push('period')
  }

  if (period.value === 'temporary') {
    if (!tglMulai.value) {
      inputError.value.push('tglMulai')
    }
    if (!tglSelesai.value) {
      inputError.value.push('tglSelesai')
    }
  }

  if (!reason.value) {
    inputError.value.push('reason')
  }
}

onMounted(periodStore.getPeriod)
</script>
<template>
  <UiModal v-model="open" title="Blacklist Vendor" size="sm">
    <form action="" class="space-y-4" @submit.prevent="handleSubmit">
      <div class="relative">
        <label for="period" class="absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500">
          Period
        </label>
        <select id="period" v-model="period" class="select" required>
          <option disabled value="">Select period</option>
          <option v-for="item in periodStore.period" :key="item.code" :value="item.code">
            {{ item.value }}
          </option>
        </select>
        <span v-if="inputError.includes('period')">Period is Required</span>
      </div>
      <div v-if="period === `0`" class="flex gap-3 max-w-full">
        <VueDatePicker v-model="tglMulai" class="w-full">
          <template #dp-input="{ value }">
            <div class="input relative">
              <div
                :class="[
                  'absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500 text-[11px] font-normal',
                ]"
              >
                Start Date
              </div>
              <input :placeholder="'Select'" :value="value" readonly class="min-w-[0px]" />
              <button class="btn btn-icon" type="button">
                <i class="ki-filled ki-calendar"></i>
              </button>
            </div>
            <span v-if="inputError.includes('tglMulai')">Start Date is Required</span>
          </template>
        </VueDatePicker>
        <VueDatePicker v-model="tglSelesai" class="w-full">
          <template #dp-input="{ value }">
            <div class="input relative">
              <div
                :class="[
                  'absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500 text-[11px] font-normal',
                ]"
              >
                End Date
              </div>
              <input :placeholder="'Select'" :value="value" readonly class="min-w-[0px]" />
              <button class="btn btn-icon" type="button">
                <i class="ki-filled ki-calendar"></i>
              </button>
            </div>
          </template>
          <span v-if="inputError.includes('tglSelesai')">End Date is Required</span>
        </VueDatePicker>
      </div>
      <div class="flex rounded-md overflow-hidden border border-primary">
        <label
          for="file"
          class="flex items-center px-3 text-primary bg-opacity-20 bg-blue-400 flex-1 cursor-pointer"
        >
          <div>{{ file ? file.name : 'Upload supporting files' }}</div>
          <input
            type="file"
            name="file"
            id="file"
            hidden
            :disabled="uploadStore.loading"
            @input="file = ($event.target as HTMLInputElement)?.files?.[0]"
          />
        </label>
        <button
          type="button"
          class="h-10 bg-primary text-white flex items-center justify-center px-3 border border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleUpload"
          :disabled="uploadStore.loading || !file"
        >
          <UiLoading size="sm" v-if="uploadStore.loading" />
          <span v-else>Upload</span>
        </button>
      </div>
      <span class="text-danger text-[12px]" v-if="uploadStore.error">{{ uploadStore.error }}</span>
      <span class="text-success text-[12px]" v-if="uploadedFile?.name">Upload file success</span>
      <div class="relative">
        <label for="reason" class="absolute -mt-2 ml-2 px-1 text-gray-500 bg-white">
          Reason <span class="text-danger">*</span>
        </label>
        <textarea
          id="reason"
          v-model="reason"
          class="textarea textarea-lg"
          rows="6"
          required
        ></textarea>
        <span v-if="inputError.includes('reason')">Reason is Required</span>
      </div>
      <div class="flex gap-3">
        <UiButton class="flex-1 justify-center" :outline="true" type="button" @click="open = !open">
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

<style lang="scss" scoped>
@use '@/components/datePicker/styles/datepicker.scss';
</style>
