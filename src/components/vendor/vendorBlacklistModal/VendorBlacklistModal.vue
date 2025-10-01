<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import type { IVendorBlacklistModalProps } from './types/vendorBlacklistModal'
import { computed, onMounted, ref } from 'vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useBlacklistPeriodStore } from '@/stores/vendor/reference'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import UiLoading from '@/components/UiLoading.vue'
import { useVendorStore } from '@/stores/vendor/vendor'
import axios from 'axios'
import { isArray } from 'lodash'
import { useLoginStore } from '@/stores/views/login'
import type { UploadFileResponse } from '@/stores/general/types/upload'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import { formatDatePayload } from '@/composables/date-format'
import UiTextarea from '@/components/ui/atoms/textarea/UiTextarea.vue'

const periodStore = useBlacklistPeriodStore()
const uploadStore = useVendorUploadStore()
const vendorStore = useVendorStore()
const userStore = useLoginStore()

const props = defineProps<IVendorBlacklistModalProps>()
const open = defineModel('open')
const modalSuccess = defineModel('success')
const period = ref<string>('')
const file = ref<File>()
const reason = ref<string>('')
const tglMulai = ref<string>('')
const tglSelesai = ref<string>('')
const uploadedFile = ref<UploadFileResponse>()
const inputError = ref<string[]>([])

const loading = ref<boolean>(false)
const error = ref<unknown>(null)

const periodOpions = computed(() =>
  periodStore.period.map((item) => ({
    text: item.value,
    value: item.code,
  })),
)

const handleSelectPeriod = () => {
  tglMulai.value = ''
  tglSelesai.value = ''
}

const handleUpload = async () => {
  const formData = new FormData()
  formData.append('FormFile', file.value as File)
  formData.append('Actioner', userStore.userData?.profile.profileId.toString() || '0')

  uploadedFile.value = await uploadStore.upload(formData)
}

const handleSubmit = async () => {
  inputError.value = []

  if (!period.value) {
    inputError.value.push('period')
  }

  if (period.value === '0') {
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

  if (inputError.value.length) {
    return
  }

  try {
    loading.value = true
    error.value = null

    await vendorStore.blacklistVendor({
      VendorId: Number(props.id),
      BlacklistDescription: reason.value,
      BlacklistTypeID: Number(period.value),
      CreatedBy: userStore.userData?.profile.employeeId.toString(),
      DocUrl: uploadedFile.value?.path,
      EndDate: tglSelesai.value,
      StartDate: tglMulai.value,
    })

    modalSuccess.value = true
    open.value = false
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.result.content
      }
    }
  } finally {
    loading.value = false
  }
}

onMounted(periodStore.getPeriod)
</script>
<template>
  <UiModal v-model="open" :title="$t('vendorBlacklist.modal.blacklist.title')" size="sm">
    <form action="" class="space-y-4" @submit.prevent="handleSubmit">
      <!-- period -->
      <UiSelect
        v-model="period"
        :placeholder="$t('vendorBlacklist.modal.blacklist.fields.selectType')"
        :label="$t('vendorBlacklist.modal.blacklist.fields.blacklistType')"
        :options="periodOpions"
        text-key="text"
        value-key="value"
        required
        :hint-text="
          inputError.includes('period')
            ? $t('vendorBlacklist.modal.blacklist.validation.blacklistTypeRequired')
            : ''
        "
        :error="inputError.includes('period')"
        @update:model-value="handleSelectPeriod"
      />

      <!-- start date and end date -->
      <UiFormGroup :grid="2" hide-border v-if="period === `0`">
        <div class="relative">
          <div
            :class="[
              'absolute z-10 top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500 text-[11px] font-normal',
            ]"
          >
            {{ $t('vendorBlacklist.modal.blacklist.fields.startDate') }}
          </div>
          <DatePicker
            v-model="tglMulai"
            required
            format="dd/MM/yyyy"
            @update:model-value="tglMulai = $event ? formatDatePayload($event) : ''"
          />
        </div>
        <DatePicker
          v-model="tglSelesai"
          required
          format="dd/MM/yyyy"
          @update:model-value="tglSelesai = $event ? formatDatePayload($event) : ''"
        />
      </UiFormGroup>

      <!-- file -->
      <div>
        <div class="flex rounded-md overflow-hidden border border-primary">
          <label
            for="file"
            class="flex items-center px-3 text-primary bg-opacity-20 bg-blue-400 flex-1 cursor-pointer"
          >
            <div>
              {{ file ? file.name : $t('vendorBlacklist.modal.blacklist.fields.uploadFiles') }}
            </div>
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
            <span v-else>{{ $t('vendorBlacklist.modal.blacklist.buttons.upload') }}</span>
          </button>
        </div>
        <span class="text-danger text-[12px]" v-if="uploadStore.error">{{
          uploadStore.error
        }}</span>
        <span class="text-success text-[12px]" v-if="uploadedFile?.name">{{
          $t('vendorBlacklist.modal.blacklist.messages.uploadSuccess')
        }}</span>
      </div>

      <!-- reason -->
      <div class="relative">
        <UiTextarea
          v-model="reason"
          label="Reason"
          required
          :error="inputError.includes('reason')"
          :hint-text="inputError.includes('reason') ? 'Reason is Required' : ''"
        />
        <span class="form-hint !text-danger">
          {{ inputError.includes('reason') ? 'Reason Required' : '' }}
        </span>
      </div>

      <div class="bg-red-100 border border-red-200 px-2 py-3 rounded-lg text-danger" v-if="error">
        <ul v-if="isArray(error)">
          <li v-for="err in error" :key="err">{{ err }}</li>
        </ul>
      </div>
      <div class="flex gap-3">
        <UiButton class="flex-1 justify-center" :outline="true" type="button" @click="open = !open">
          <UiIcon name="black-left-line" variant="duotone" />
          <span>{{ $t('vendorBlacklist.modal.blacklist.buttons.cancel') }}</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="danger" :disabled="loading">
          <span v-if="loading">{{ $t('vendorBlacklist.modal.blacklist.buttons.progress') }}</span>
          <template v-else>
            <UiIcon name="cross-circle" variant="duotone" />
            <span>{{ $t('vendorBlacklist.modal.blacklist.buttons.blacklist') }}</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>

<style lang="scss" scoped>
@use '@/components/datePicker/styles/datepicker.scss';
</style>
