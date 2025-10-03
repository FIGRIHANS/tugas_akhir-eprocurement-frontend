<script lang="ts" setup>
import { computed, reactive, ref, watch, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

import type { IVendorLegalDocumentPayload } from '@/stores/vendor/types/vendor'
import { useCompanyDeedDataStore } from '@/stores/vendor/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useLoginStore } from '@/stores/views/login'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import moment from 'moment'
import LPagination from '@/components/pagination/LPagination.vue'

const companyDeedDataStore = useCompanyDeedDataStore()
const userLoginStore = useLoginStore()
const uploadStore = useVendorUploadStore()
const vendorMasterDataStore = useVendorMasterDataStore()
const { t } = useI18n()

const route = useRoute()

const pageSizeOptions = ref([
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
  { value: 20, text: '20' },
  { value: 50, text: '50' },
])

const paginationLatestAmandmentDataStore = ref({
  pageSize: 10,
  currentPage: 1,
  total: 10,
})

const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const mode = ref<'add' | 'edit' | 'delete'>('add')
const showDeleteModal = ref(false)
const apiErrorMessage = ref('')
const isDownloadLoading = ref(false)
const isSaveLoading = ref(false)
const modalUploadFailed = ref<boolean>(false)

const fileUploaderRef = ref<InstanceType<typeof UiFileUpload> | null>(null)

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

const isEditing = computed(() => mode.value === 'edit' || vendorAmendmentPayload.id > 0)
const submitLabel = computed(() =>
  isEditing.value ? t('companyDeed.latestAmendment.save') : t('companyDeed.latestAmendment.add'),
)
const submitIcon = computed(() => (isEditing.value ? 'file-added' : 'plus-circle'))

const toNumber = (v: unknown) => (v === null || v === undefined || v === '' ? 0 : Number(v))

const resolveNotaryLocationId = (data: {
  notaryLocation?: any
  cityName?: string
  notaryLocationName?: string
}) => {
  if (typeof data.notaryLocation === 'number' && data.notaryLocation > 0) return data.notaryLocation
  const name = (data.cityName || data.notaryLocationName || '').toString().trim().toLowerCase()
  if (!name) return 0
  const hit = vendorMasterDataStore.cityList?.find((c: any) => c.cityName?.toLowerCase() === name)
  return hit?.cityID ?? 0
}

/* ===== Validasi ===== */
const validateForm = () => {
  let isValid = true
  errors.documentNo = ''
  errors.notaryName = ''
  errors.documentURL = ''
  errors.documentDate = ''
  errors.notaryLocation = ''

  if (!vendorAmendmentPayload.documentNo) {
    errors.documentNo = t('companyDeed.latestAmendment.validation.documentNoRequired')
    isValid = false
  }
  if (!vendorAmendmentPayload.notaryName) {
    errors.notaryName = t('companyDeed.latestAmendment.validation.notaryNameRequired')
    isValid = false
  }
  if (!vendorAmendmentPayload.documentURL) {
    errors.documentURL = t('companyDeed.latestAmendment.validation.documentRequired')
    isValid = false
  }
  if (!toNumber(vendorAmendmentPayload.notaryLocation)) {
    errors.notaryLocation = t('companyDeed.latestAmendment.validation.notaryLocationRequired')
    isValid = false
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

  fileUploaderRef.value?.clear()
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
    vendorAmendmentPayload.notaryLocation = toNumber(vendorAmendmentPayload.notaryLocation) // pastikan number
    await companyDeedDataStore.postVendorLegalDocument(vendorAmendmentPayload)
    await companyDeedDataStore.getVendorLegalDocument(
      Number(route.params.id),
      paginationLatestAmandmentDataStore.value.currentPage,
      paginationLatestAmandmentDataStore.value.pageSize,
      3116,
    )

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
  const data = companyDeedDataStore.latestAmendmentData.items.find(
    (item) => (item as unknown as IVendorLegalDocumentPayload).id === id,
  )

  if (data) {
    Object.assign(vendorAmendmentPayload, data)
    vendorAmendmentPayload.notaryLocation = toNumber(
      resolveNotaryLocationId({
        notaryLocation: (data as any).notaryLocation,
        cityName: (data as any).cityName,
        notaryLocationName: (data as any).notaryLocationName,
      }),
    )
    mode.value = 'edit'
  }
}

const handleDelete = (id: number) => {
  const data = companyDeedDataStore.latestAmendmentData.items.find(
    (item) => (item as unknown as IVendorLegalDocumentPayload).id === id,
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
    await companyDeedDataStore.postVendorLegalDocument(payloadToSend)
    showDeleteModal.value = false
    showSuccessModal.value = true
    await companyDeedDataStore.getVendorLegalDocument(
      Number(route.params.id),
      paginationLatestAmandmentDataStore.value.currentPage,
      paginationLatestAmandmentDataStore.value.pageSize,
      3116,
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

const handleUploadFailed = () => {
  modalUploadFailed.value = true
}

/** Pastikan cityList tersedia; kalau store punya action loader, panggil di sini */
onMounted(async () => {
  if (
    !vendorMasterDataStore.cityList?.length &&
    typeof vendorMasterDataStore.getVendorCities === 'function'
  ) {
    try {
      await vendorMasterDataStore.getVendorCities()
    } catch {}
  }
})

/** Jika cityList datang belakangan (async) dan kita sedang edit, re-map lagi supaya select terisi */
watch(
  () => vendorMasterDataStore.cityList,
  (list) => {
    if (!list?.length) return
    if (mode.value === 'edit') {
      vendorAmendmentPayload.notaryLocation = toNumber(
        resolveNotaryLocationId({
          notaryLocation: vendorAmendmentPayload.notaryLocation,
          cityName: (vendorAmendmentPayload as any).cityName,
          notaryLocationName: (vendorAmendmentPayload as any).notaryLocationName,
        }),
      )
    }
  },
  { immediate: false },
)

const setPageLatestAmandmentData = async (page: number) => {
  paginationLatestAmandmentDataStore.value.currentPage = page
}

const latestAmandmentData = computed(() => {
  const { items, total } = companyDeedDataStore.latestAmendmentData

  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  paginationLatestAmandmentDataStore.value.total = total

  const activeItems = (items ?? []).filter((i) => i?.isActive === true)

  return activeItems as typeof items
})

watchEffect(async () => {
  try {
    await companyDeedDataStore.getVendorLegalDocument(
      Number(route.params.id),
      paginationLatestAmandmentDataStore.value.currentPage,
      paginationLatestAmandmentDataStore.value.pageSize,
      3116,
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
          {{ $t('companyDeed.latestAmendment.title') }}
        </h3>
      </div>
    </div>

    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 mb-8">
        <UiFormGroup hide-border>
          <UiInput
            :label="$t('companyDeed.latestAmendment.documentNo')"
            :placeholder="$t('companyDeed.latestAmendment.documentNo')"
            row
            v-model="vendorAmendmentPayload.documentNo"
            :error="errors.documentNo !== ''"
            :hintText="errors.documentNo"
          />
          <UiInput
            :label="$t('companyDeed.latestAmendment.notaryName')"
            :placeholder="$t('companyDeed.latestAmendment.notaryName')"
            row
            v-model="vendorAmendmentPayload.notaryName"
            :error="errors.notaryName !== ''"
            :hintText="errors.notaryName"
          />
        </UiFormGroup>

        <UiFormGroup hide-border>
          <UiSelect
            :label="$t('companyDeed.latestAmendment.notaryLocation')"
            :placeholder="'-- ' + $t('companyDeed.latestAmendment.notaryLocation') + ' --'"
            :options="
              vendorMasterDataStore.cityList?.map((item) => ({
                value: item.cityID,
                label: item.cityName,
              }))
            "
            value-key="value"
            text-key="label"
            row
            v-model.number="vendorAmendmentPayload.notaryLocation"
            :error="errors.notaryLocation !== ''"
            :hintText="errors.notaryLocation"
          />
          <UiFileUpload
            ref="fileUploaderRef"
            name="latestAmmendmentDocumentUrl"
            :label="$t('companyDeed.latestAmendment.document')"
            :placeholder="$t('companyDeed.shareholders.uploadPlaceholder')"
            :hint-text="$t('companyDeed.common.uploadHint')"
            @added-file="onUploadFile($event)"
            @upload-failed="handleUploadFailed()"
            :max-size="16000000"
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
            <th class="text-nowrap">{{ $t('companyDeed.latestAmendment.documentNo') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.latestAmendment.documentDate') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.latestAmendment.notaryName') }}</th>
            <th class="text-nowrap">{{ $t('companyDeed.latestAmendment.notaryLocation') }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- loading -->
          <tr v-if="companyDeedDataStore.vendorLegalDocLoading">
            <td colspan="5" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- error -->
          <tr v-else-if="companyDeedDataStore.vendorLegalDocError">
            <td colspan="5" class="text-center">
              {{ companyDeedDataStore.vendorLegalDocError }}
            </td>
          </tr>

          <!-- empty -->
          <tr v-else-if="!latestAmandmentData?.length">
            <td colspan="5" class="text-center">{{ $t('companyDeed.common.noData') }}</td>
          </tr>

          <!-- data -->
          <tr v-else v-for="doc in latestAmandmentData" :key="doc.id" class="font-normal text-sm">
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
                        <span class="menu-title"> {{ $t('companyDeed.common.download') }} </span>
                      </button>
                    </li>
                    <li class="menu-item">
                      <button class="menu-link" @click="handleEdit(doc.id)">
                        <span class="menu-icon">
                          <UiIcon variant="duotone" name="notepad-edit" class="!text-warning" />
                        </span>
                        <span class="menu-title">
                          {{ $t('companyDeed.shareholders.edit_action') }}
                        </span>
                      </button>
                    </li>
                    <li class="menu-item">
                      <button class="menu-link" @click="handleDelete(doc.id)">
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
            <td class="text-nowrap">{{ doc.documentNo }}</td>
            <td class="text-nowrap">{{ moment(doc.documentDate).format('MMM dd, yyyy') }}</td>
            <td class="text-nowrap">{{ doc.notaryName ?? doc.value }}</td>
            <td class="text-nowrap">{{ doc.cityName }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex flex-row items-center justify-between px-4">
        <div class="flex flex-row items-center gap-2">
          {{ $t('companyDeed.common.show') }}
          <UiSelect
            v-model="paginationLatestAmandmentDataStore.pageSize"
            :options="pageSizeOptions"
            class="w-16"
          />
          {{ $t('companyDeed.common.perPage') }} {{ $t('companyDeed.common.from') }}
          {{ paginationLatestAmandmentDataStore.total }} {{ $t('companyDeed.common.data') }}
        </div>

        <LPagination
          :totalItems="paginationLatestAmandmentDataStore.total"
          :pageSize="paginationLatestAmandmentDataStore.pageSize"
          :currentPage="paginationLatestAmandmentDataStore.currentPage"
          @pageChange="setPageLatestAmandmentData"
        />
      </div>
    </div>

    <!-- modal success -->
    <UiModal v-model="showSuccessModal" size="sm">
      <div class="text-center mb-6">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">{{ $t('companyDeed.common.hooray') }}</h3>
        <p class="text-center text-base text-gray-600 mb-5">
          {{ $t('companyDeed.common.successMessage') }}
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
        {{ $t('companyDeed.common.failed') }}
        {{
          mode == 'delete'
            ? $t('companyDeed.common.failedDelete')
            : mode === 'edit'
              ? $t('companyDeed.common.failedChange')
              : $t('companyDeed.common.failedAdd')
        }}
        {{ $t('companyDeed.common.document') }}!
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
          @click="handleProcessDelete"
          :disabled="isSaveLoading"
        >
          <UiLoading variant="white" v-if="isSaveLoading" />
          <UiIcon name="cross-circle" variant="duotone" v-else />
          <span>{{ $t('companyDeed.common.delete') }}</span>
        </UiButton>
      </div>
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
  </div>
</template>
