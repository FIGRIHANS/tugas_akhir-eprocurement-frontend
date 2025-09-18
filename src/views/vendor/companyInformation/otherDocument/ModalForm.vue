<script setup lang="ts">
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiLoading from '@/components/UiLoading.vue'
import { checkEmptyValues } from '@/composables/validation'
import { useChangeDataEmailStore } from '@/stores/vendor/email-change-data'
import useOtherDocStore from '@/stores/vendor/otherDocuments'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { useLoginStore } from '@/stores/views/login'
import { computed, onMounted, ref } from 'vue'

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
const adminStore = useVendorAdministrationStore()
const changeDataEmailStore = useChangeDataEmailStore()

const formData = ref({
  id: 0,
  vendorID: props.vendorId,
  documentName: '',
  documentNo: '',
  documentUrl: '',
  expiredUTCDate: '',
  issuedUTCDate: '',
  validDate: '',
  remark: 'Other document',
  isActive: true,
})
const formError = ref<string[]>([])
const uploadError = ref('')
const uploadLoading = ref(false)
const submitLoading = ref(false)

const selectedItem = computed(() => otherDocStore.data.find((item) => item.id === props.id))

const onSelectDate = () => {
  const UTCDate = new Date(formData.value.expiredUTCDate).toISOString()

  formData.value.expiredUTCDate = UTCDate
  formData.value.issuedUTCDate = UTCDate
  formData.value.validDate = UTCDate
}

const onSubmit = async () => {
  formError.value = checkEmptyValues(formData.value)

  formError.value = formError.value.filter((form) => !['id'].includes(form))

  // check jika ada error
  if (formError.value.length) return

  try {
    submitLoading.value = true
    await otherDocStore.update(formData.value)

    await changeDataEmailStore.sendEmail({
      recepientName: adminStore.data.vendorName || '',
      recepients: {
        emailTo: adminStore.data.vendorEmail,
        emailCc: '',
        emailBcc: ''
      }
    })

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
  <UiModal v-model="model" title="Other Document">
    <form @submit.prevent="onSubmit">
      <UiFormGroup hide-border>
        <!-- document name -->
        <UiInput label="Document Name" required v-model="formData.documentName"
          :error="formError.includes('documentName')"
          :hint-text="formError.includes('documentName') ? 'Document name required' : ''" />

        <!-- Document Number -->
        <UiInput label="Document Number" required v-model="formData.documentNo"
          :error="formError.includes('documentNo')"
          :hint-text="formError.includes('documentNo') ? 'Document number required' : ''" />

        <!-- Available Until -->
        <div class="relative">
          <span class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-10">
            Available Until <span class="text-danger">*</span>
          </span>
          <DatePicker placeholder="Start Date" v-model="formData.expiredUTCDate"
            :error="formError.includes('expiredUTCDate')" @update:model-value="onSelectDate" />
          <span v-if="formError.includes('expiredUTCDate')" class="form-hint !text-danger">
            Expired date required
          </span>
        </div>

        <!-- upload -->
        <UiFileUpload accepted-files=".jpg,.jpeg,.png,.pdf,.zip" name="file"
          placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)" @added-file="onUploadFile" :hint-text="uploadError
            ? 'An error accoured, please try again'
            : formError.includes('documentUrl')
              ? 'Document required'
              : ''
            " :error="formError.includes('documentUrl')" :disabled="uploadLoading" />
      </UiFormGroup>
      <div class="flex justify-end gap-3 mt-3">
        <UiButton outline type="button" @click="model = false">
          <UiIcon name="black-left-line" />
          <span>Cancel</span>
        </UiButton>
        <UiButton variant="primary" type="submit" :disabled="submitLoading || uploadLoading">
          <UiLoading variant="white" v-if="submitLoading" />
          <UiIcon name="file-added" variant="duotone" v-else />
          <span>Save</span>
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
