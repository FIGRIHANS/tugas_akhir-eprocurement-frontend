<script setup lang="ts">
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import UiLoading from '@/components/UiLoading.vue'
import { formatDate } from '@/composables/date-format'
import { useShareunits, useTypeShareholders } from '@/stores/vendor/reference'
import type { IShareholderPayload } from '@/stores/vendor/types/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useCompanyDeedDataStore } from '@/stores/vendor/vendor'
import { useLoginStore } from '@/stores/views/login'
import axios from 'axios'
import moment from 'moment'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'

const shareholderSchema = z.object({
  ownerName: z.string().min(1, 'Shareholder Name is required'),
  ownerID: z.string().min(1, 'ID Number is required'),
  ownerIDUrl: z.string().optional(),
  ownerDOB: z.date(),
  quantity: z.number().min(1, 'Nominal Share Value is required'),
  unitID: z.number().min(1, 'Share Unit is required'),
  position: z.string().min(1, 'Position / Role is required'),
})

const errors = reactive<{ [key: string]: string }>({})

const shareholdersStore = useCompanyDeedDataStore()
const uploadStore = useVendorUploadStore()
const userLoginStore = useLoginStore()
const typeShareholders = useTypeShareholders()
const shareUnits = useShareunits()

const route = useRoute()

const modalTitle = ref<string>('Add new shareolders')
const isModalOpen = ref<boolean>(false)
const isSaveLoading = ref<boolean>(false)
const mode = ref<'add' | 'edit' | 'delete'>('add')
const showSuccessModal = ref<boolean>(false)
const showErrorModal = ref<boolean>(false)
const showDeleteModal = ref<boolean>(false)
const apiErrorMessage = ref<string>('')
const isDownloadLoading = ref<boolean>(false)

const shareHoldersError = ref<string[]>([])

const payload = reactive<IShareholderPayload>({
  stockID: 0,
  vendorID: Number(route.params.id),
  ownerName: '',
  ownerID: '',
  ownerIDUrl: '',
  ownerDOB: new Date(),
  quantity: 0,
  unitID: 0,
  unitCurrencyID: 0,
  user: '',
  isActive: true,
  tmpBlacklist: true,
  position: '',
  isTemporary: true,
  refVendorID: 0,
  action: 0,
  stockTypeID: 0,
})

const handleOpenModal = () => {
  mode.value = 'add'
  modalTitle.value = 'Add new shareholders'
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
  shareHoldersError.value = []
  Object.assign(payload, {
    stockID: 0,
    vendorID: Number(route.params.id),
    ownerName: '',
    ownerID: '',
    ownerIDUrl: '',
    ownerDOB: new Date(),
    quantity: 0,
    unitID: 0,
    unitCurrencyID: 0,
    user: '',
    isActive: true,
    tmpBlacklist: true,
    position: '',
    isTemporary: true,
    refVendorID: 0,
    action: 0,
    stockTypeID: 0,
  })
}

const handleSubmit = async () => {
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  const result = shareholderSchema.safeParse({
    ownerName: payload.ownerName,
    ownerID: payload.ownerID,
    ownerIDUrl: payload.ownerIDUrl,
    ownerDOB: payload.ownerDOB,
    quantity: Number(payload.quantity),
    unitID: Number(payload.unitID),
    position: payload.position,
  })

  if (!result.success) {
    if (result.error && result.error.issues) {
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message
        }
      })
    }
    return
  }

  try {
    isSaveLoading.value = true

    const payloadToSend = {
      ...payload,
      quantity: Number(payload.quantity),
    }

    await shareholdersStore.postShareholders(payloadToSend)
    handleCloseModal()
    showSuccessModal.value = true
    shareholdersStore.getShareholders(Number(route.params.id))
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.data && err.response.data.result) {
        const errorMessage = err.response.data.result.message
        apiErrorMessage.value = errorMessage
      } else {
        apiErrorMessage.value = 'Terjadi kesalahan tidak terduga. Silahkan coba lagi.'
      }
    } else {
      apiErrorMessage.value = 'Terjadi kesalahan saat menyimpan data. Silahkan coba lagi'
    }
    showErrorModal.value = true
  } finally {
    isSaveLoading.value = false
  }
}

const handleDelete = async () => {
  try {
    isSaveLoading.value = true

    const payloadToSend = {
      ...payload,
      quantity: Number(payload.quantity),
      isActive: false,
    }

    await shareholdersStore.postShareholders(payloadToSend)
    handleCloseModal()
    showSuccessModal.value = true
    showDeleteModal.value = false
    shareholdersStore.getShareholders(Number(route.params.id))
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.data && err.response.data.result) {
        const errorMessage = err.response.data.result.message
        apiErrorMessage.value = errorMessage
      } else {
        apiErrorMessage.value = 'Terjadi kesalahan tidak terduga. Silahkan coba lagi.'
      }
    } else {
      apiErrorMessage.value = 'Terjadi kesalahan saat mengapus data. Silahkan coba lagi'
    }
    showErrorModal.value = true
  } finally {
    isSaveLoading.value = false
  }
}

const handleDropdown = (id: number, newMode: 'add' | 'edit' | 'delete') => {
  mode.value = newMode
  isModalOpen.value = true

  switch (newMode) {
    case 'edit':
      modalTitle.value = 'Edit shareholders'
      break
    default:
      break
  }

  const shareholderData = shareholdersStore.shareholdersData.find(
    (item: IShareholderPayload) => item.stockID === id,
  )

  if (shareholderData) {
    Object.assign(payload, {
      ...shareholderData,
      unitID: shareholderData.unitID != null ? Number(shareholderData.unitID) : 0,
      stockTypeID: shareholderData.stockTypeID != null ? Number(shareholderData.stockTypeID) : 0,
      ownerDOB: shareholderData.ownerDOB
        ? new Date(shareholderData.ownerDOB as unknown as string)
        : new Date(),
    })
  }
}

const handleDeleteModal = (item: IShareholderPayload) => {
  showDeleteModal.value = true
  Object.assign(payload, item)
}

const uploadFile = async (file: File) => {
  if (!file) return

  const formData = new FormData()
  formData.append('FormFile', file)
  formData.append('Actioner', userLoginStore.userData?.profile.profileId.toString() || '0')

  try {
    const response = await uploadStore.upload(formData)

    payload.ownerIDUrl = response?.path as string
  } catch (err) {
    if (err instanceof Error) {
      alert('File upload failed, please try again')
    }
  }
}

const handleDownload = async (path: string) => {
  isDownloadLoading.value = true

  try {
    const file = await uploadStore.preview(path)
    const link = URL.createObjectURL(file)
    window.open(link, '_blank')
    setTimeout(() => URL.revokeObjectURL(link), 1000)
  } catch (err) {
    if (err instanceof Error) {
      alert('Failed to download document. Please try again later.')
    }
  } finally {
    isDownloadLoading.value = false
  }
}

const formatNumber = (num: number) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

const filteredShareholders = computed(() =>
  shareholdersStore.shareholdersData?.filter((item: IShareholderPayload) => item.isActive === true),
)
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="w-full flex justify-between items-center">
        <h3 class="text-lg font-semibold text-slate-800">Shareholders</h3>
        <UiButton variant="primary" @click="handleOpenModal">
          <UiIcon variant="duotone" name="plus-circle" />
          Add
        </UiButton>
      </div>
    </div>
    <div class="card-body overflow-auto">
      <table class="table align-middle text-gray-700">
        <thead>
          <tr>
            <th class="text-nowrap"></th>
            <th class="text-nowrap">Type</th>
            <th class="text-nowrap">Shareholder Name</th>
            <th class="text-nowrap">Date of Birth / Company Establishment Date</th>
            <th class="text-nowrap">Nominal Value</th>
            <th class="text-nowrap">Share Unit</th>
            <th class="text-nowrap">No KTP/Paspor/NPWP</th>
            <th class="text-nowrap">File</th>
          </tr>
        </thead>
        <tbody>
          <!-- show loading -->
          <tr v-if="shareholdersStore.shareholdersLoading">
            <td colspan="7" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- show error message -->
          <tr v-else-if="shareholdersStore.shareholdersError">
            <td colspan="7" class="text-center">
              {{ shareholdersStore.shareholdersError }}
            </td>
          </tr>

          <!-- show message if there are no data -->
          <tr v-else-if="!shareholdersStore.shareholdersData.length">
            <td colspan="7" class="text-center">No data</td>
          </tr>

          <!-- show data start -->
          <template v-if="!shareholdersStore.shareholdersLoading">
            <tr v-for="(item, index) in filteredShareholders" :key="index" class="text-nowrap">
              <td class="text-center">
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <UiButton outline icon size="sm" variant="secondary" class="dropdown-toggle">
                    <UiIcon name="dots-vertical" />
                  </UiButton>
                  <div class="dropdown-content w-full max-w-60 space-y-5">
                    <ul class="menu menu-default flex flex-col gap-2" data-dropdown-dismiss="true">
                      <li class="menu-item">
                        <button class="menu-link" @click="handleDownload(item.ownerIDUrl)">
                          <span class="menu-icon">
                            <UiIcon variant="duotone" name="arrow-down" class="!text-primary" />
                          </span>
                          <span class="menu-title"> Download </span>
                        </button>
                      </li>
                      <li class="menu-item">
                        <button class="menu-link" @click="handleDropdown(item.stockID, 'edit')">
                          <span class="menu-icon">
                            <UiIcon variant="duotone" name="notepad-edit" class="!text-warning" />
                          </span>
                          <span class="menu-title"> Edit </span>
                        </button>
                      </li>
                      <li class="menu-item">
                        <button class="menu-link" @click="handleDeleteModal(item)">
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
              <td>{{ item.isActive ? 'Active' : 'Inactive' }}</td>
              <td>{{ item.ownerName }}</td>
              <td>{{ moment(item.ownerDOB).format('DD MMMM YYYY') }}</td>
              <td>{{ formatNumber(item.quantity) }}</td>
              <td>{{ item.shareUnit }}</td>
              <td>{{ item.ownerID }}</td>
              <td>
                <AttachmentView
                  v-if="item.ownerIDUrl"
                  class="cursor-pointer"
                  :file-data="{ name: item.description, path: item.docUrl }"
                  :upload-date="
                    formatDate(item.modifiedDate ? item.modifiedDate : item.createdDate)
                  "
                  @click="handleDownload(item.ownerIDUrl)"
                />
                <span v-else>-</span>
              </td>
            </tr>
          </template>
          <!-- show data end -->
        </tbody>
      </table>
    </div>
  </div>

  <!-- modal -->
  <UiModal
    :title="modalTitle"
    v-model="isModalOpen"
    @update:model-value="handleCloseModal"
    size="lg"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiFormGroup hide-border>
        <UiSelect
          label="Type shareholders"
          placeholder="--Type Shareholders--"
          :required="true"
          :options="
            typeShareholders.data?.map((item) => ({
              label: item.value,
              value: Number(item.code),
            })) || []
          "
          value-key="value"
          text-key="label"
          v-model="payload.stockTypeID"
        />
        <DatePicker placeholder="Date of birth" v-model="payload.ownerDOB" />
        <UiFileUpload
          name="shareholderFile"
          accepted-files=".jpg,.jpeg,.png,pdf"
          placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
          @added-file="uploadFile($event)"
        />
        <UiInput
          label="Nominal Share Value"
          :required="true"
          placeholder="Nominal Share Value"
          v-model="payload.quantity"
          :error="!!errors.quantity"
          :hintText="errors.quantity"
        />
      </UiFormGroup>
      <UiFormGroup hide-border>
        <UiInput
          label="Shareholder Name"
          placeholder="Name"
          :required="true"
          v-model="payload.ownerName"
          :error="!!errors.ownerName"
          :hintText="errors.ownerName"
        />
        <UiInput
          label="No. Identitas"
          placeholder="ID Number"
          :required="true"
          v-model="payload.ownerID"
          :error="!!errors.ownerID"
          :hintText="errors.ownerID"
        />
        <UiSelect
          label="Share Unit"
          placeholder="--Share Unit--"
          :required="true"
          :options="
            shareUnits.data?.map((item) => ({ label: item.value, value: Number(item.code) })) || []
          "
          value-key="value"
          text-key="label"
          v-model="payload.unitID"
          :error="!!errors.unitID"
          :hintText="errors.unitID"
        />
        <UiInput
          label="Position / Role"
          placeholder="Position / Role"
          :required="true"
          v-model="payload.position"
          :error="!!errors.position"
          :hintText="errors.position"
        />
      </UiFormGroup>
    </div>

    <div class="mt-4 w-full gap-2 justify-end items-center flex">
      <UiButton outline @click="handleCloseModal">Cancel</UiButton>
      <UiButton variant="primary" @click="handleSubmit" :disabled="isSaveLoading">
        <span v-if="isSaveLoading">Saving...</span>
        <span v-else>Save</span>
      </UiButton>
    </div>
  </UiModal>

  <!-- delete modal -->
  <UiModal v-model="showDeleteModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
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
        @click="handleDelete"
        :disabled="isSaveLoading"
      >
        <UiLoading variant="white" v-if="isSaveLoading" />
        <UiIcon name="cross-circle" variant="duotone" v-else />
        <span>Delete</span>
      </UiButton>
    </div>
  </UiModal>

  <!-- success modal -->
  <UiModal v-model="showSuccessModal" size="sm">
    <div class="text-center mb-6">
      <ModalSuccessLogo class="mx-auto" />
      <h3 class="text-center text-lg font-medium">Hooray!</h3>
      <p class="text-center text-base text-gray-600 mb-5">
        The data has been successfully updated in the admin system
      </p>
    </div>
  </UiModal>

  <!-- error modal -->
  <UiModal v-model="showErrorModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">
      Failed to {{ mode == 'delete' ? 'Delete' : mode === 'edit' ? 'Change' : 'Add' }} Shareholders!
    </h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ apiErrorMessage }}
    </p>
  </UiModal>
</template>
