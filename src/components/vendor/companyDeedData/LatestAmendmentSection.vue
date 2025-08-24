<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

import type { IVendorLegalDocumentPayload } from '@/stores/vendor/types/vendor'
import { useCompanyDeedDataStore } from '@/stores/vendor/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useLoginStore } from '@/stores/views/login'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

const vendorLegalDocStore = useCompanyDeedDataStore()
const userLoginStore = useLoginStore()
const uploadStore = useVendorUploadStore()
const vendorMasterDataStore = useVendorMasterDataStore()

const route = useRoute()

const showSuccessModal = ref<boolean>(false)
const showErrorModal = ref<boolean>(false)
const mode = ref<'add' | 'edit' | 'delete'>('add')
const showDeleteModal = ref<boolean>(false)
const apiErrorMessage = ref<string>('')
const isDownloadLoading = ref<boolean>(false)
const isSaveLoading = ref<boolean>(false)

const AMENDMENT_DOCUMENT_TYPE = 3116

const vendorAmendmentPayload = reactive<IVendorLegalDocumentPayload>({
  id: 0,
  vendorID: Number(route.params.id),
  filename: '',
  filesize: 0,
  documentURL: '',
  documentType: AMENDMENT_DOCUMENT_TYPE,
  documentNo: '',
  documentDate: new Date(),
  notaryName: '',
  notaryLocation: 0,
  user: '',
  isActive: true,
  isTemporary: true,
  refVendorId: 0,
  action: 0,
})

const errors = reactive({
  documentNo: '',
  notaryName: '',
  documentURL: '',
  documentDate: '',
  notaryLocation: '',
})

/* ===== UI helpers: tombol dinamis ===== */
const isEditing = computed(() => mode.value === 'edit' || vendorAmendmentPayload.id > 0)
const submitLabel = computed(() => (isEditing.value ? 'Update' : 'Add'))
const submitIcon = computed(() => (isEditing.value ? 'notepad-edit' : 'plus-circle'))

/* ===== Validasi & util ===== */
const validateForm = () => {
  let isValid = true
  errors.documentNo = ''
  errors.notaryName = ''
  errors.documentURL = ''
  errors.documentDate = ''
  errors.notaryLocation = ''

  if (!vendorAmendmentPayload.documentNo) {
    errors.documentNo = 'Document no is required'; isValid = false
  }
  if (!vendorAmendmentPayload.notaryName) {
    errors.notaryName = 'Notary name is required'; isValid = false
  }
  if (!vendorAmendmentPayload.documentURL) {
    errors.documentURL = 'Document URL is required'; isValid = false
  }
  if (!vendorAmendmentPayload.notaryLocation) {
    errors.notaryLocation = 'Notary location is required'; isValid = false
  }
  return isValid
}

const resetForm = () => {
  Object.assign(vendorAmendmentPayload, {
    id: 0,
    vendorID: Number(route.params.id),
    filename: '',
    filesize: 0,
    documentURL: '',
    documentType: AMENDMENT_DOCUMENT_TYPE,
    documentNo: '',
    documentDate: new Date(),
    notaryName: '',
    notaryLocation: 0,
    user: '',
    isActive: true,
    isTemporary: true,
    refVendorId: 0,
    action: 0,
  } as IVendorLegalDocumentPayload)
  mode.value = 'add'
}

/* ===== Handlers ===== */
const onUploadFile = async (file: File) => {
  if (!file) return
  const formData = new FormData()
  formData.append('FormFile', file)
  formData.append('Actioner', userLoginStore.userData?.profile.profileId.toString() || '0')
  try {
    const response = await uploadStore.upload(formData)
    vendorAmendmentPayload.filename = response?.name as string
    vendorAmendmentPayload.documentURL = response?.path as string
    vendorAmendmentPayload.filesize = file.size
    errors.documentURL = ''
  } catch {
    alert('File upload failed, please try again')
  }
}

const handleSave = async () => {
  // mode otomatis dari payload.id (edit kalau id > 0)
  mode.value = vendorAmendmentPayload.id ? 'edit' : 'add'
  if (!validateForm()) return

  try {
    isSaveLoading.value = true
    await vendorLegalDocStore.postVendorLegalDocument(vendorAmendmentPayload)
    await vendorLegalDocStore.getVendorLegalDocument(Number(route.params.id))
    showSuccessModal.value = true
    resetForm()
  } catch (err) {
    if (axios.isAxiosError(err)) {
      apiErrorMessage.value =
        err.response?.data?.result?.message || 'Terjadi kesalahan tidak terduga. Silahkan coba lagi'
    } else {
      apiErrorMessage.value = 'Terjadi kesalahan saat menyimpan data. Silahkan coba lagi'
    }
    showErrorModal.value = true
  } finally {
    isSaveLoading.value = false
  }
}

const handleEdit = (id: number) => {
  const data = vendorLegalDocStore.vendorLegalDocData.find(
    (item: IVendorLegalDocumentPayload) => item.id === id,
  )
  if (data) {
    Object.assign(vendorAmendmentPayload, data)
    mode.value = 'edit' // mengubah tombol jadi Update
  }
}

const handleDelete = (id: number) => {
  const data = vendorLegalDocStore.vendorLegalDocData.find(
    (item: IVendorLegalDocumentPayload) => item.id === id,
  )
  if (data) {
    Object.assign(vendorAmendmentPayload, data)
    mode.value = 'delete'
    showDeleteModal.value = true
  }
}

const handleProcessDelete = async () => {
  try {
    isSaveLoading.value = true
    const payloadToSend = { ...vendorAmendmentPayload, isActive: false }
    await vendorLegalDocStore.postVendorLegalDocument(payloadToSend)
    showDeleteModal.value = false
    showSuccessModal.value = true
    await vendorLegalDocStore.getVendorLegalDocument(Number(route.params.id))
    resetForm()
  } catch (err) {
    if (axios.isAxiosError(err)) {
      apiErrorMessage.value =
        err.response?.data?.result?.message || 'Terjadi kesalahan tidak terduga. Silahkan coba lagi'
    } else {
      apiErrorMessage.value = 'Terjadi kesalahan saat menghapus data. Silahkan coba lagi'
    }
    showErrorModal.value = true
  } finally {
    isSaveLoading.value = false
  }
}

const handleDownload = async (path: string) => {
  isDownloadLoading.value = true
  try {
    const file = await uploadStore.preview(path)
    const link = URL.createObjectURL(file)
    window.open(link, '_blank')
    setTimeout(() => URL.revokeObjectURL(link), 1000)
  } catch {
    alert('Failed to download document. Please try again later.')
  } finally {
    isDownloadLoading.value = false
  }
}

const filteredAmendmentData = computed(() =>
  vendorLegalDocStore.vendorLegalDocData?.filter(
    (item: IVendorLegalDocumentPayload) =>
      item.isActive === true && item.documentType === AMENDMENT_DOCUMENT_TYPE,
  ),
)
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="w-full flex justify-between items-center">
        <h3 class="text-lg font-semibold text-slate-800">Latest Amendment Data</h3>
      </div>
    </div>

    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 mb-8">
        <UiFormGroup hide-border>
          <UiInput
            label="Number"
            placeholder="Number"
            row
            v-model="vendorAmendmentPayload.documentNo"
            :error="errors.documentNo !== ''"
            :hintText="errors.documentNo"
          />
          <UiInput
            label="Notary"
            placeholder="Notary full name"
            row
            v-model="vendorAmendmentPayload.notaryName"
            :error="errors.notaryName !== ''"
            :hintText="errors.notaryName"
          />
        </UiFormGroup>

        <UiFormGroup hide-border>
          <UiSelect
            label="Notary Office Location"
            placeholder="Select"
            :options="
              vendorMasterDataStore.cityList?.map((item) => ({
                value: item.cityID,
                label: item.cityName,
              }))
            "
            value-key="value"
            text-key="label"
            row
            v-model="vendorAmendmentPayload.notaryLocation"
            :error="errors.notaryLocation !== ''"
            :hintText="errors.notaryLocation"
          />
          <UiFileUpload
            name="latestAmmendmentDocumentUrl"
            label="File"
            placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
            hint-text="*jpg, jpeg, png, pdf, zip / max : 16 MB"
            @added-file="onUploadFile($event)"
          />

          <!-- Tombol dinamis: Add / Update -->
          <div class="flex justify-end items-center">
            <UiButton variant="primary" @click="handleSave" :disabled="isSaveLoading">
              <UiLoading v-if="isSaveLoading" variant="white" />
              <template v-else>
                <UiIcon variant="duotone" :name="submitIcon" />
                {{ submitLabel }}
              </template>
            </UiButton>
          </div>
        </UiFormGroup>
      </div>

      <table class="table align-middle">
        <thead>
          <tr>
            <th class="text-nowrap"></th>
            <th class="text-nowrap">Number</th>
            <th class="text-nowrap">Letter Date</th>
            <th class="text-nowrap">Notary</th>
            <th class="text-nowrap">Notary Office Location</th>
          </tr>
        </thead>
        <tbody>
          <!-- loading -->
          <tr v-if="vendorLegalDocStore.vendorLegalDocLoading">
            <td colspan="5" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- error -->
          <tr v-else-if="vendorLegalDocStore.vendorLegalDocError">
            <td colspan="5" class="text-center">
              {{ vendorLegalDocStore.vendorLegalDocError }}
            </td>
          </tr>

          <!-- empty -->
          <tr v-else-if="!filteredAmendmentData?.length">
            <td colspan="5" class="text-center">No data</td>
          </tr>

          <!-- data -->
          <tr v-else v-for="doc in filteredAmendmentData" :key="doc.id" class="font-normal text-sm">
            <td class="text-center">
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                <UiButton outline icon size="sm" variant="secondary" class="dropdown-toggle">
                  <UiIcon name="dots-vertical" />
                </UiButton>
                <div class="dropdown-content w-full max-w-60 space-y-5">
                  <ul class="menu menu-default flex flex-col gap-2" data-dropdown-dismiss="true">
                    <li class="menu-item">
                      <button class="menu-link" @click="handleDownload(doc.documentURL)">
                        <span class="menu-icon">
                          <UiIcon variant="duotone" name="arrow-down" class="!text-primary" />
                        </span>
                        <span class="menu-title"> Download </span>
                      </button>
                    </li>
                    <li class="menu-item">
                      <button class="menu-link" @click="handleEdit(doc.id)">
                        <span class="menu-icon">
                          <UiIcon variant="duotone" name="notepad-edit" class="!text-warning" />
                        </span>
                        <span class="menu-title"> Edit </span>
                      </button>
                    </li>
                    <li class="menu-item">
                      <button class="menu-link" @click="handleDelete(doc.id)">
                        <span class="menu-icon">
                          <UiIcon variant="duotone" name="cross-circle" class="!text-danger" />
                        </span>
                        <span class="menu-title"> Delete </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </td>
            <td class="text-nowrap">{{ doc.documentNo }}</td>
            <td class="text-nowrap">{{ doc.documentDate }}</td>
            <td class="text-nowrap">{{ doc.notaryName ?? doc.value }}</td>
            <td class="text-nowrap">{{ doc.cityName }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- modal success -->
    <UiModal v-model="showSuccessModal" size="sm">
      <div class="text-center mb-6">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">Hooray!</h3>
        <p class="text-center text-base text-gray-600 mb-5">
          The data has been successfully updated in the admin system
        </p>
      </div>
    </UiModal>

    <!-- modal error -->
    <UiModal v-model="showErrorModal" size="sm">
      <div class="text-center mb-6">
        <UiIcon
          name="cross-circle"
          variant="duotone"
          class="text-[150px] text-danger text-center"
        />
      </div>
      <h3 class="text-center text-lg font-medium">
        Failed to
        {{ mode == 'delete' ? 'Delete' : mode === 'edit' ? 'Change' : 'Add' }} Amendment document!
      </h3>
      <p class="text-center text-base text-gray-600 mb-5">
        {{ apiErrorMessage }}
      </p>
    </UiModal>

    <!-- modal confirm delete -->
    <UiModal v-model="showDeleteModal" size="sm">
      <div class="text-center mb-6">
        <UiIcon
          name="cross-circle"
          variant="duotone"
          class="text-[150px] text-danger text-center"
        />
      </div>
      <h3 class="text-center text-lg font-medium">Are You Sure You Want to Delete This Item?</h3>
      <p class="text-center text-base text-gray-600 mb-5">
        This action will permanently remove the selected data from the list.
      </p>
      <div class="flex gap-3 px-8 mb-3">
        <UiButton
          outline
          @click="showDeleteModal = false"
          class="flex-1 flex items-center justify-center"
        >
          <UiIcon name="black-left-line" />
          <span>Cancel</span>
        </UiButton>
        <UiButton
          variant="danger"
          class="flex-1 flex items-center justify-center"
          @click="handleProcessDelete"
          :disabled="isSaveLoading"
        >
          <UiLoading variant="white" v-if="isSaveLoading" />
          <UiIcon name="cross-circle" variant="duotone" v-else />
          <span>Delete</span>
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>
