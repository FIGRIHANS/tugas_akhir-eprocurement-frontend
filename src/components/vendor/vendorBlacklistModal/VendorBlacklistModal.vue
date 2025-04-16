<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import type { IVendorBlacklistModalProps } from './types/vendorBlacklistModal'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'
import { ref } from 'vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'

defineProps<IVendorBlacklistModalProps>()
const open = defineModel()
const period = ref<string>('')
const file = ref<File>()
const reason = ref<string>('')
const tglMulai = ref('')
const tglSelesai = ref('')

const handleSubmit = () => {
  console.log(file.value)
}
</script>
<template>
  <UiModal v-model="open" title="Blacklist Vendor" size="sm">
    <form action="" class="space-y-4" @submit.prevent="handleSubmit">
      <div class="relative">
        <label for="period" class="absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500"
          >Period</label
        >
        <select id="period" v-model="period" class="select">
          <option disabled value="">Pilih periode</option>
          <option value="permanent">Permanent</option>
          <option value="temporary">Temporary</option>
        </select>
      </div>
      <div v-if="period === `temporary`" class="flex gap-3 max-w-full">
        <DatePicker
          v-model="tglMulai"
          :error="false"
          class="flex-1"
          placeholder="Start Date"
          label="Start Date"
        />
        <DatePicker
          v-model="tglSelesai"
          :error="false"
          class="flex-1"
          placeholder="End Date"
          label="End Date"
        />
      </div>
      <div class="flex rounded-md overflow-hidden border border-primary">
        <label
          for="file"
          class="flex items-center px-3 text-primary bg-opacity-20 bg-blue-400 flex-1"
        >
          <div>{{ file ? file.name : 'Upload supporting files' }}</div>
          <input
            type="file"
            name="file"
            id="file"
            hidden
            @input="file = ($event.target as HTMLInputElement)?.files?.[0]"
          />
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
