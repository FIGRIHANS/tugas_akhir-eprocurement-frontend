<script lang="ts" setup>
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

import type { IVendorLegalDocumentPayload } from '@/stores/vendor/types/vendor'
import { useCompanyDeedDataStore, useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useLoginStore } from '@/stores/views/login'
import moment from 'moment'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import { useChangeDataEmailStore } from '@/stores/vendor/email-change-data'

const companyDeedDataStore = useCompanyDeedDataStore()
const uploadStore = useVendorUploadStore()
const userLoginStore = useLoginStore()
const adminStore = useVendorAdministrationStore()
const changeDataEmailStore = useChangeDataEmailStore()

const route = useRoute()

const pageSizeOptions = ref([
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
  { value: 20, text: '20' },
  { value: 50, text: '50' },
])

const paginationRatificationDataStore = ref({
  pageSize: 10,
  currentPage: 1,
  total: 10,
})

const fileUploaderRef = ref<InstanceType<typeof UiFileUpload> | null>(null)

const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const showDeleteModal = ref(false)
const apiErrorMessage = ref('')
const isDownloadLoading = ref(false)
const isSaveLoading = ref(false)
const mode = ref<'add' | 'edit' | 'delete'>('add')

const RATIFICATION_DOCUMENT_TYPE = 3117

const payload = reactive<IVendorLegalDocumentPayload>({
  id: 0,
  vendorID: Number(route.params.id),
  filename: '',
  filesize: 0,
  documentURL: '',
  documentType: RATIFICATION_DOCUMENT_TYPE,
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
  documentURL: '',
  documentDate: '',
})

/* ==== UI helpers: label & ikon tombol dinamis ==== */
const isEditing = computed(() => mode.value === 'edit' || payload.id > 0)
const submitLabel = computed(() => (isEditing.value ? 'Save' : 'Add'))
const submitIcon = computed(() => (isEditing.value ? 'file-added' : 'plus-circle'))

/* ==== Validasi & Util ==== */
const validateForm = () => {
  let ok = true
  errors.documentNo = ''
  errors.documentURL = ''
  errors.documentDate = ''

  if (!payload.documentNo) {
    errors.documentNo = 'Number is required'
    ok = false
  }
  if (!payload.documentDate) {
    errors.documentDate = 'Letter date is required'
    ok = false
  }
  if (!payload.documentURL) {
    errors.documentURL = 'File is required'
    ok = false
  }
  return ok
}

const onUploadFile = async (file: File) => {
  if (!file) return
  const formData = new FormData()
  formData.append('FormFile', file)
  formData.append('Actioner', userLoginStore.userData?.profile.profileId.toString() || '0')
  try {
    const res = await uploadStore.upload(formData)
    payload.documentURL = res?.path as string
    payload.filename = res?.name as string
    payload.filesize = file.size
    errors.documentURL = ''
  } catch {
    alert('File upload failed, please try again')
  }
}

const resetForm = () => {
  Object.assign(payload, {
    id: 0,
    vendorID: Number(route.params.id),
    filename: '',
    filesize: 0,
    documentURL: '',
    documentType: RATIFICATION_DOCUMENT_TYPE,
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

  fileUploaderRef.value?.clear()
}

/* ==== Handlers ==== */
const handleSave = async () => {
  mode.value = payload.id ? 'edit' : 'add'
  if (!validateForm()) return
  try {
    isSaveLoading.value = true
    await companyDeedDataStore.postVendorLegalDocument(payload)
    await companyDeedDataStore.getVendorLegalDocument(
      Number(route.params.id),
      paginationRatificationDataStore.value.currentPage,
      paginationRatificationDataStore.value.pageSize,
      3117,
    )

    // await changeDataEmailStore.sendEmail({
    //   recepientName: adminStore.data?.vendorName || '',
    //   recepients: {
    //     emailTo: adminStore.data?.vendorEmail || '',
    //     emailCc: '',
    //     emailBcc: '',
    //   },
    // })

    showSuccessModal.value = true

    fileUploaderRef.value?.clear()

    resetForm()
  } catch (err) {
    if (axios.isAxiosError(err)) {
      apiErrorMessage.value =
        err.response?.data?.result?.message || 'An unexpected error occurred. Please try again'
    } else {
      apiErrorMessage.value = 'An error occurred while saving data. Please try again'
    }
    showErrorModal.value = true
  } finally {
    isSaveLoading.value = false
  }
}

const handleEdit = (id: number) => {
  const data = companyDeedDataStore.ratificationData.items.find(
    (item) => (item as unknown as IVendorLegalDocumentPayload).id === id,
  )
  if (data) {
    Object.assign(payload, data)
    mode.value = 'edit' // -> tombol jadi "Update"
  }
}

const handleAskDelete = (id: number) => {
  const data = companyDeedDataStore.vendorLegalDocData.items.find(
    (item) => (item as unknown as IVendorLegalDocumentPayload).id === id,
  )
  if (data) Object.assign(payload, data)
  mode.value = 'delete'
  showDeleteModal.value = true
}

const handleProcessDelete = async () => {
  try {
    isSaveLoading.value = true
    const toSend = { ...payload, isActive: false }
    await companyDeedDataStore.postVendorLegalDocument(toSend)
    showDeleteModal.value = false
    showSuccessModal.value = true
    await companyDeedDataStore.getVendorLegalDocument(
      Number(route.params.id),
      paginationRatificationDataStore.value.currentPage,
      paginationRatificationDataStore.value.pageSize,
      3117,
    )
    resetForm()
  } catch (err) {
    if (axios.isAxiosError(err)) {
      apiErrorMessage.value =
        err.response?.data?.result?.message || 'An unexpected error occurred. Please try again'
    } else {
      apiErrorMessage.value = 'An error occurred while deleting data. Please try again'
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

const setPageRatification = async (page: number) => {
  paginationRatificationDataStore.value.currentPage = page
}

const ratificationData = computed(() => {
  const { items, total } = companyDeedDataStore.ratificationData

  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  paginationRatificationDataStore.value.total = total

  const activeItems = (items ?? []).filter((i) => i?.isActive === true)

  return activeItems as typeof items
})

watchEffect(async () => {
  try {
    await companyDeedDataStore.getVendorLegalDocument(
      Number(route.params.id),
      paginationRatificationDataStore.value.currentPage,
      paginationRatificationDataStore.value.pageSize,
      3117,
    )
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="w-full flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-slate-800">Ratification by Kemkumham</h3>
          <p class="text-red-500 text-xs">Specifically for companies with PT legal entity status</p>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 mb-8">
        <UiFormGroup hide-border>
          <UiInput
            label="Number"
            placeholder="Number"
            row
            v-model="payload.documentNo"
            :error="errors.documentNo !== ''"
            :hintText="errors.documentNo"
          />
          <UiFileUpload
            ref="fileUploaderRef"
            name="ratificationDocumentUrl"
            label="File"
            placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
            hint-text="*jpg, jpeg, png, pdf, zip / max : 16 MB"
            @added-file="onUploadFile($event)"
          />
          <p v-if="errors.documentURL" class="text-xs text-red-500 mt-1">
            {{ errors.documentURL }}
          </p>
        </UiFormGroup>

        <UiFormGroup hide-border>
          <DatePicker
            v-model="payload.documentDate"
            label="Letter Date"
            placeholder="Select Date"
            :format="'MMM dd, yyyy'"
          />
          <p v-if="errors.documentDate" class="text-xs text-red-500 mt-1">
            {{ errors.documentDate }}
          </p>

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
          </tr>
        </thead>
        <tbody>
          <!-- loading -->
          <tr v-if="companyDeedDataStore.vendorLegalDocLoading">
            <td colspan="3" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- error -->
          <tr v-else-if="companyDeedDataStore.vendorLegalDocError">
            <td colspan="3" class="text-center">
              {{ companyDeedDataStore.vendorLegalDocError }}
            </td>
          </tr>

          <!-- empty -->
          <tr v-else-if="!ratificationData?.length">
            <td colspan="3" class="text-center">No data</td>
          </tr>

          <!-- data -->
          <tr v-else v-for="doc in ratificationData" :key="doc.id" class="font-normal text-sm">
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
                      <button class="menu-link" @click="handleAskDelete(doc.id)">
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
            <td class="text-nowrap">{{ moment(doc.documentDate).format('MMM dd, yyyy') }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex flex-row items-center justify-between px-4">
        <div class="flex flex-row items-center gap-2">
          Show
          <UiSelect
            v-model="paginationRatificationDataStore.pageSize"
            :options="pageSizeOptions"
            class="w-16"
          />
          per page from {{ paginationRatificationDataStore.total }} data
        </div>

        <LPagination
          :totalItems="paginationRatificationDataStore.total"
          :pageSize="paginationRatificationDataStore.pageSize"
          :currentPage="paginationRatificationDataStore.currentPage"
          @pageChange="setPageRatification"
        />
      </div>
    </div>

    <!-- Success -->
    <UiModal v-model="showSuccessModal" size="sm">
      <div class="text-center mb-6">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">Hooray!</h3>
        <p class="text-center text-base text-gray-600 mb-5">
          The data has been successfully updated in the admin system
        </p>
      </div>
    </UiModal>

    <!-- Error -->
    <UiModal v-model="showErrorModal" size="sm">
      <div class="text-center mb-6">
        <UiIcon
          name="cross-circle"
          variant="duotone"
          class="text-[150px] text-danger text-center"
        />
      </div>
      <h3 class="text-center text-lg font-medium">
        Failed to {{ mode == 'delete' ? 'Delete' : mode === 'edit' ? 'Change' : 'Add' }} document!
      </h3>
      <p class="text-center text-base text-gray-600 mb-5">
        {{ apiErrorMessage }}
      </p>
    </UiModal>

    <!-- Confirm Delete -->
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
