<script setup lang="ts">
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiModal from '@/components/modal/UiModal.vue'
import LPagination from '@/components/pagination/LPagination.vue'
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
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { useI18n } from 'vue-i18n'
import tr from '@/composables/translator'
const { t } = useI18n()

const shareholderSchema = z.object({
  ownerName: z.string().min(1, 'Shareholder Name is required'),
  ownerID: z.string().min(1, 'ID Number is required'),
  ownerIDUrl: z.string().optional(),
  ownerDOB: z.date(),
  quantity: z.number().min(1, 'Nominal Share Value is required'),
  unitID: z.number().min(1, 'Share Unit is required'),
  position: z.string().min(1, 'Position / Role is required'),
})

const pageSizeOptions = ref([
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
  { value: 20, text: '20' },
  { value: 50, text: '50' },
])

const errors = reactive<{ [key: string]: string }>({})

const uploadStore = useVendorUploadStore()
const userLoginStore = useLoginStore()
const typeShareholders = useTypeShareholders()
const shareUnits = useShareunits()
const companyDeedDataStore = useCompanyDeedDataStore()
const shareUnitsOptions = computed(() => {
  return shareUnits.data?.map((item) => ({ label: tr(item.value), value: Number(item.code) })) || []
})

const route = useRoute()

const modalTitle = computed(() => {
  return mode.value === 'edit'
    ? t('companyDeed.shareholders.edit')
    : t('companyDeed.shareholders.addNew')
})
const isModalOpen = ref<boolean>(false)
const isSaveLoading = ref<boolean>(false)
const mode = ref<'add' | 'edit' | 'delete'>('add')
const showSuccessModal = ref<boolean>(false)
const showErrorModal = ref<boolean>(false)
const showDeleteModal = ref<boolean>(false)
const apiErrorMessage = ref<string>('')
const isDownloadLoading = ref<boolean>(false)
const modalUploadFailed = ref<boolean>(false)

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

    await companyDeedDataStore.postShareholders(payloadToSend)

    // await changeDataEmailStore.sendEmail({
    //   recepientName: adminStore.data?.vendorName || '',
    //   recepients: {
    //     emailTo: adminStore.data?.vendorEmail || '',
    //     emailCc: '',
    //     emailBcc: '',
    //   },
    // })

    handleCloseModal()
    showSuccessModal.value = true
    companyDeedDataStore.getShareholders(
      Number(route.params.id),
      paginationShareholders.value.currentPage,
      paginationShareholders.value.pageSize,
    )
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

    await companyDeedDataStore.postShareholders(payloadToSend)
    handleCloseModal()
    showSuccessModal.value = true
    showDeleteModal.value = false
    companyDeedDataStore.getShareholders(
      Number(route.params.id),
      paginationShareholders.value.currentPage,
      paginationShareholders.value.pageSize,
    )
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

  const shareholderData = companyDeedDataStore.shareholdersData.items.find(
    (item) => (item as unknown as IShareholderPayload).stockID === id,
  ) as unknown as IShareholderPayload | undefined

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

const shareholderData = computed(() => {
  const { items, total } = companyDeedDataStore.shareholdersData

  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  paginationShareholders.value.total = total

  const activeItems = (items ?? []).filter((i) => i?.isActive === true)

  return activeItems as typeof items
})

const paginationShareholders = ref({
  pageSize: 10,
  currentPage: 1,
  total: 10,
})

const setPageShareholders = async (page: number) => {
  paginationShareholders.value.currentPage = page
}

const handleUploadFailed = () => {
  modalUploadFailed.value = true
}

watchEffect(async () => {
  try {
    await companyDeedDataStore.getShareholders(
      Number(route.params.id),
      paginationShareholders.value.currentPage,
      paginationShareholders.value.pageSize,
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
        <h3 class="text-lg font-semibold text-slate-800">
          {{ $t('companyDeed.shareholders.title') }}
        </h3>
        <UiButton variant="primary" @click="handleOpenModal">
          <UiIcon variant="duotone" name="plus-circle" />
          {{ $t('companyDeed.shareholders.add') }}
        </UiButton>
      </div>
    </div>
    <div class="card-body overflow-auto">
      <table class="table align-middle text-gray-700">
        <thead>
          <tr>
            <th class="text-nowrap"></th>
            <th class="text-nowrap">{{ $t('companyDeed.shareholders.type') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.shareholders.name') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.shareholders.birthDate') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.shareholders.nominalShare') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.shareholders.shareUnit') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.shareholders.idNumber') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.shareholders.idCopy') }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- show loading -->
          <tr v-if="companyDeedDataStore.shareholdersLoading">
            <td colspan="7" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- show error message -->
          <tr v-else-if="companyDeedDataStore.shareholdersError">
            <td colspan="7" class="text-center">
              {{ companyDeedDataStore.shareholdersError }}
            </td>
          </tr>

          <!-- show message if there are no data -->
          <tr v-else-if="!companyDeedDataStore.shareholdersData.items.length">
            <td colspan="7" class="text-center">{{ $t('companyDeed.common.noData') }}</td>
          </tr>

          <!-- show data start -->
          <template v-if="!companyDeedDataStore.shareholdersLoading">
            <tr v-for="(item, index) in shareholderData" :key="index" class="text-nowrap">
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
                          <span class="menu-title"> {{ $t('companyDeed.common.download') }} </span>
                        </button>
                      </li>
                      <li class="menu-item">
                        <button class="menu-link" @click="handleDropdown(item.stockID, 'edit')">
                          <span class="menu-icon">
                            <UiIcon variant="duotone" name="notepad-edit" class="!text-warning" />
                          </span>
                          <span class="menu-title">
                            {{ $t('companyDeed.shareholders.edit_action') }}
                          </span>
                        </button>
                      </li>
                      <li class="menu-item">
                        <button
                          class="menu-link"
                          @click="handleDeleteModal(item as unknown as IShareholderPayload)"
                        >
                          <span class="menu-icon">
                            <UiIcon variant="duotone" name="cross-circle" class="!text-danger" />
                          </span>
                          <span class="menu-title">
                            {{ $t('companyDeed.shareholders.delete_action') }}
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
              <td>{{ item.typeShareholders }}</td>
              <td>{{ item.ownerName }}</td>
              <td>{{ moment(item.ownerDOB).format('MMM dd, yyyy') }}</td>
              <td>{{ formatNumber(item.quantity) }}</td>
              <td>{{ item.shareUnit }}</td>
              <td>{{ item.ownerID }}</td>
              <td>
                <AttachmentView
                  v-if="item.ownerIDUrl"
                  class="cursor-pointer"
                  :file-data="{ name: item.ownerID, path: item.ownerIDUrl }"
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
    <div class="p-5 flex flex-row items-center justify-between px-4">
      <div class="flex flex-row items-center gap-2">
        {{ $t('companyDeed.common.show') }}
        <UiSelect
          v-model="paginationShareholders.pageSize"
          :options="pageSizeOptions"
          class="w-16"
        />
        {{ $t('companyDeed.common.perPage') }} {{ $t('companyDeed.common.from') }}
        {{ paginationShareholders.total }} data
      </div>

      <LPagination
        :totalItems="paginationShareholders.total"
        :pageSize="paginationShareholders.pageSize"
        :currentPage="paginationShareholders.currentPage"
        @pageChange="setPageShareholders"
      />
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
          :label="$t('companyDeed.shareholders.type')"
          :placeholder="'--' + $t('companyDeed.shareholders.type') + '--'"
          :required="true"
          :options="
            typeShareholders.data?.map((item) => ({
              label: tr(item.value),
              value: Number(item.code),
            })) || []
          "
          value-key="value"
          text-key="label"
          v-model="payload.stockTypeID"
        />
        <DatePicker
          :placeholder="$t('companyDeed.shareholders.birthDate')"
          v-model="payload.ownerDOB"
          :format="'MMM dd, yyyy'"
        />
        <UiFileUpload
          name="shareholderFile"
          :placeholder="$t('companyDeed.shareholders.uploadPlaceholder')"
          @added-file="uploadFile($event)"
          @upload-failed="handleUploadFailed()"
          :max-size="16000000"
        />
        <UiInput
          :label="$t('companyDeed.shareholders.nominalShare')"
          :required="true"
          :placeholder="$t('companyDeed.shareholders.nominalShare')"
          v-model="payload.quantity"
          :error="!!errors.quantity"
          :hintText="errors.quantity"
        />
      </UiFormGroup>
      <UiFormGroup hide-border>
        <UiInput
          :label="$t('companyDeed.shareholders.name')"
          :placeholder="$t('companyDeed.shareholders.name')"
          :required="true"
          v-model="payload.ownerName"
          :error="!!errors.ownerName"
          :hintText="errors.ownerName"
        />
        <UiInput
          :label="$t('companyDeed.shareholders.idNumber')"
          :placeholder="$t('companyDeed.shareholders.idNumber')"
          :required="true"
          v-model="payload.ownerID"
          :error="!!errors.ownerID"
          :hintText="errors.ownerID"
        />
        <UiSelect
          :label="$t('companyDeed.shareholders.shareUnit')"
          :placeholder="'--' + $t('companyDeed.shareholders.shareUnit') + '--'"
          :required="true"
          :options="shareUnitsOptions"
          value-key="value"
          text-key="label"
          v-model="payload.unitID"
          :error="!!errors.unitID"
          :hintText="errors.unitID"
        />
        <UiInput
          :label="$t('companyDeed.shareholders.position')"
          :placeholder="$t('companyDeed.shareholders.position')"
          :required="true"
          v-model="payload.position"
          :error="!!errors.position"
          :hintText="errors.position"
        />
      </UiFormGroup>
    </div>

    <div class="mt-4 w-full gap-2 justify-end items-center flex">
      <UiButton outline @click="handleCloseModal">{{
        $t('companyDeed.shareholders.cancel')
      }}</UiButton>
      <UiButton variant="primary" @click="handleSubmit" :disabled="isSaveLoading">
        <span v-if="isSaveLoading">{{ $t('companyDeed.shareholders.saving') }}</span>
        <span v-else>{{ $t('companyDeed.shareholders.save') }}</span>
      </UiButton>
    </div>
  </UiModal>

  <!-- delete modal -->
  <UiModal v-model="showDeleteModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">{{ $t('companyDeed.common.deleteTitle') }}</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ $t('companyDeed.common.deleteMessage') }}
    </p>
    <div class="flex gap-3 px-8 mb-3">
      <UiButton
        outline
        @click="showDeleteModal = false"
        class="flex-1 flex items-center justify-center"
      >
        <UiIcon name="black-left-line" />
        <span>{{ $t('companyDeed.common.cancel') }}</span>
      </UiButton>
      <UiButton
        variant="danger"
        class="flex-1 flex items-center justify-center"
        @click="handleDelete"
        :disabled="isSaveLoading"
      >
        <UiLoading variant="white" v-if="isSaveLoading" />
        <UiIcon name="cross-circle" variant="duotone" v-else />
        <span>{{ $t('companyDeed.common.delete') }}</span>
      </UiButton>
    </div>
  </UiModal>

  <!-- success modal -->
  <UiModal v-model="showSuccessModal" size="sm">
    <div class="text-center mb-6">
      <ModalSuccessLogo class="mx-auto" />
      <h3 class="text-center text-lg font-medium">{{ $t('companyDeed.common.hooray') }}</h3>
      <p class="text-center text-base text-gray-600 mb-5">
        {{ $t('companyDeed.common.successMessage') }}
      </p>
    </div>
  </UiModal>

  <!-- error modal -->
  <UiModal v-model="showErrorModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">
      {{ $t('companyDeed.common.failed') }}
      {{
        mode == 'delete'
          ? $t('companyDeed.common.failedDelete')
          : mode === 'edit'
            ? $t('companyDeed.common.failedChange')
            : $t('companyDeed.common.failedAdd')
      }}
      {{ $t('companyDeed.common.shareholders') }}!
    </h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ apiErrorMessage }}
    </p>
  </UiModal>

  <ModalConfirmation
    :open="modalUploadFailed"
    id="other-doc-upload-error"
    type="danger"
    :title="$t('companyDeed.common.uploadFailed')"
    :text="$t('companyDeed.common.fileSizeExceeds')"
    no-submit
    static
    :cancel="() => (modalUploadFailed = false)"
  />
</template>
