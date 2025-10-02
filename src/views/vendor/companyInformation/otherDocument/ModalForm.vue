<script setup lang="ts">
import DatePicker from '@/components/datePicker/DatePicker.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiLoading from '@/components/UiLoading.vue'
import { checkEmptyValues } from '@/composables/validation'
import useOtherDocStore from '@/stores/vendor/otherDocuments'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useLoginStore } from '@/stores/views/login'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type Props = {
  id?: number
  vendorId: number
}

const props = defineProps<Props>()
const emit = defineEmits(['onSuccess', 'onError'])
const model = defineModel()

const userStore = useLoginStore()
const otherDocStore = useOtherDocStore()
const uploadStore = useVendorUploadStore()
const { t } = useI18n()

const formData = ref({
  id: 0,
  vendorID: props.vendorId,
  documentName: '',
  documentNo: '',
  documentUrl: null,
  expiredUTCDate: null,
  issuedUTCDate: null,
  validDate: null,
  remark: 'Other document',
  isActive: true,
})
const formError = ref<string[]>([])
const uploadError = ref('')
const uploadLoading = ref(false)
const submitLoading = ref(false)
const fileSizeErrorModal = ref(false)

const selectedItem = computed(() => otherDocStore.data.find((item) => item.id === props.id))

const onSelectDate = () => {
  const UTCDate = new Date(formData.value.expiredUTCDate).toISOString()

  formData.value.expiredUTCDate = UTCDate
  formData.value.issuedUTCDate = UTCDate
  formData.value.validDate = UTCDate
}

const onSubmit = async () => {
  formError.value = checkEmptyValues(formData.value)

  formError.value = formError.value.filter(
    (form) => !['id', 'expiredUTCDate', 'issuedUTCDate', 'validDate', 'documentUrl'].includes(form),
  )

  console.log(formError.value)

  // check jika ada error
  if (formError.value.length) return

  try {
    submitLoading.value = true
    await otherDocStore.update(formData.value)
    emit('onSuccess')
  } catch (error) {
    if (error instanceof Error) {
      emit('onError')
    }
  } finally {
    submitLoading.value = false
    model.value = false
  }
}

const handleUploadFailed = () => {
  fileSizeErrorModal.value = true
}

const onUploadFile = async (file: File) => {
  if (!file) return
  uploadError.value = ''
  const formDataFile = new FormData()
  formDataFile.append('FormFile', file)
  formDataFile.append('Actioner', userStore.userData?.profile.profileId.toString() || '0')

  try {
    uploadLoading.value = true
    const response = await uploadStore.upload(formDataFile)
    formData.value.documentUrl = response?.path as string
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      alert('File upload failed. Please try again.')
    }
  } finally {
    uploadLoading.value = false
  }
}

onMounted(() => {
  if (props.id) {
    formData.value.id = props.id
    formData.value.documentName = selectedItem.value?.documentName as string
    formData.value.documentNo = selectedItem.value?.documentNo as string
    formData.value.documentUrl = selectedItem.value?.documentUrl as string
    formData.value.expiredUTCDate = selectedItem.value?.expiredUTCDate as string
  }
})
</script>

<template>
  <UiModal v-model="model" :title="t('otherDocumentData.modal.form.title')">
    <form @submit.prevent="onSubmit">
      <UiFormGroup hide-border>
        <!-- document name -->
        <UiInput
          :label="t('otherDocumentData.modal.form.labels.documentName')"
          required
          v-model="formData.documentName"
          :error="formError.includes('documentName')"
          :hint-text="
            formError.includes('documentName')
              ? t('otherDocumentData.validation.documentNameRequired')
              : ''
          "
        />

        <!-- Document Number -->
        <UiInput
          :label="t('otherDocumentData.modal.form.labels.documentNo')"
          required
          v-model="formData.documentNo"
          :error="formError.includes('documentNo')"
          :hint-text="
            formError.includes('documentNo')
              ? t('otherDocumentData.validation.documentNoRequired')
              : ''
          "
        />

        <!-- Available Until -->
        <div class="relative">
          <span
            class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-10"
          >
            {{ t('otherDocumentData.modal.form.labels.availableUntil') }}
          </span>
          <DatePicker
            :placeholder="t('otherDocumentData.modal.form.placeholders.startDate')"
            v-model="formData.expiredUTCDate"
            @update:model-value="onSelectDate"
          />
        </div>

        <!-- upload -->
        <UiFileUpload
          accepted-files=".jpg,.jpeg,.png,.pdf,.zip"
          name="file"
          :placeholder="t('otherDocumentData.modal.form.placeholders.upload')"
          @added-file="onUploadFile"
          @upload-failed="handleUploadFailed"
          :disabled="uploadLoading"
          :max-size="16000000"
          :hint-text="t('otherDocumentData.modal.form.uploadHint')"
        />
      </UiFormGroup>
      <div class="flex justify-end gap-3 mt-3">
        <UiButton outline type="button" @click="model = false">
          <UiIcon name="black-left-line" />
          <span>{{ t('otherDocumentData.buttons.cancel') }}</span>
        </UiButton>
        <UiButton variant="primary" type="submit" :disabled="submitLoading || uploadLoading">
          <UiLoading variant="white" v-if="submitLoading" />
          <UiIcon name="file-added" variant="duotone" v-else />
          <span>{{ t('otherDocumentData.buttons.save') }}</span>
        </UiButton>
      </div>
    </form>

    <!-- File Size Error Modal -->
    <ModalConfirmation
      :open="fileSizeErrorModal"
      id="file-size-error"
      type="danger"
      :title="t('otherDocumentData.modal.fileSizeError.title')"
      :text="t('otherDocumentData.modal.fileSizeError.message')"
      no-cancel
      static
      :submit-button-text="t('otherDocumentData.buttons.close')"
      :submit="() => (fileSizeErrorModal = false)"
    />
  </UiModal>
</template>
