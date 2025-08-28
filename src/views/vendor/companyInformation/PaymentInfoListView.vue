<template>
  <div class="space-y-3">
    <div class="card">
      <div class="card-header">
        <h2 class="text-md font-bold text-slate-800">Payment Information</h2>
        <div class="flex">
          <UiButton variant="primary" outline @click="openModal">
            <UiIcon variant="duotone" name="plus-circle" />
            <span>Add Data</span>
          </UiButton>
        </div>
      </div>
      <div class="card-body card-table scrollable-x-auto">
        <table class="table align-middle text-gray-700">
          <thead class="border-b-2 border-b-primary">
            <tr class="text-nowrap">
              <th></th>
              <th class="text-nowrap">No</th>
              <th class="text-nowrap">Account No.</th>
              <th class="text-nowrap">Account Holder Name</th>
              <th class="text-nowrap">SwiftCode</th>
              <th class="text-nowrap">Account Discrepancy Statement</th>
              <th class="text-nowrap">Account Cover</th>
              <th class="text-nowrap">Currency</th>
              <th class="text-nowrap">Bank Key</th>
              <th class="text-nowrap">Bank Name</th>
              <th class="text-nowrap">Bank Branch</th>
              <th class="text-nowrap">Bank Address</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paymentDataStore.data" :key="index" class="text-nowrap">
              <td class="text-center">
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <UiButton outline icon size="sm" variant="secondary" class="dropdown-toggle">
                    <UiIcon name="dots-vertical" />
                  </UiButton>
                  <div class="dropdown-content w-full max-w-60 space-y-5">
                    <ul class="menu menu-default flex flex-col gap-2" data-dropdown-dismiss="true">
                      <li class="menu-item">
                        <button class="menu-link" @click="handleDropdown(item.id, 'view')">
                          <span class="menu-icon">
                            <UiIcon variant="duotone" name="eye" class="!text-primary" />
                          </span>
                          <span class="menu-title"> View Data </span>
                        </button>
                      </li>
                      <li class="menu-item">
                        <button class="menu-link" @click="handleDropdown(item.id, 'edit')">
                          <span class="menu-icon">
                            <UiIcon variant="duotone" name="notepad-edit" class="!text-warning" />
                          </span>
                          <span class="menu-title"> Edit </span>
                        </button>
                      </li>
                      <li class="menu-item">
                        <button class="menu-link" @click="handleDeleteModal(item.id)">
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
              <td>{{ index + 1 }}</td>
              <td>{{ item.accountNo }}</td>
              <td>{{ item.accountName }}</td>
              <td>{{ item.bankSwiftCode }}</td>
              <td class="text-center">
                <UiButton
                  icon
                  outline
                  size="sm"
                  v-if="item.urlAccountDifferences"
                  @click="downloadFile(item.urlAccountDifferences)"
                >
                  <UiIcon name="cloud-download" variant="duotone" />
                </UiButton>
                <span v-else>-</span>
              </td>
              <td class="text-center">
                <UiButton
                  icon
                  outline
                  size="sm"
                  v-if="item.urlFirstPage"
                  @click="downloadFile(item.urlFirstPage)"
                >
                  <UiIcon name="cloud-download" variant="duotone" />
                </UiButton>
                <span v-else>-</span>
              </td>
              <td>{{ item.currencySymbol }}</td>
              <td>{{ item.bankCode }}</td>
              <td>{{ item.bankName }}</td>
              <td>{{ item.branch }}</td>
              <td>{{ item.bankAddress }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="w-full flex justify-end items-center">
      <div class="flex items-center gap-4">
        <UiButton variant="primary" outline>
          <UiIcon variant="duotone" name="black-left" />
          Back</UiButton
        >
        <UiButton variant="primary">
          <UiIcon variant="duotone" name="plus" />
          Save</UiButton
        >
      </div>
    </div>

    <!-- Form modal -->
    <UiModal
      :title="modalTitle"
      v-model="isModalOpen"
      @update:model-value="closeModal"
      size="lg"
      static
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <UiFormGroup hide-border>
          <UiInput
            label="Bank Account Number"
            placeholder="Enter Bank Account Number"
            required
            :disabled="mode === 'view'"
            v-model="payload.request.vendorBankDetail.accountNo"
            :error="bankDetailError.includes('accountNo')"
            :hint-text="bankDetailError.includes('accountNo') ? 'Account Number required' : ''"
          />

          <div class="h-[40px]">
            <UiCheckbox
              label="Holder's name is different from the company name."
              v-model="payload.request.vendorBankDetail.isHolderNameDifferent"
              :disabled="mode === 'view'"
            />
          </div>

          <div class="relative" v-if="payload.request.vendorBankDetail.isHolderNameDifferent">
            <div
              class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]"
            >
              Account Cover
              <span class="text-danger"> *</span>
            </div>
            <UiFileUpload
              name="accountCover"
              accepted-files=".jpg,.jpeg,.png,.pdf"
              placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
              :error="bankDetailError.includes('urlFirstPage')"
              :hint-text="bankDetailError.includes('urlFirstPage') ? 'Account Cover required' : ''"
              @addedFile="uploadFile($event, 'first page')"
              :disabled="mode === 'view'"
            />
          </div>

          <UiSelect
            label="Bank Key"
            placeholder="Select"
            :options="bankOptions"
            valueKey="bankKey"
            textKey="label"
            required
            :disabled="mode === 'view' || isBankNotRegistered"
            v-model="payload.request.vendorBankDetail.bankKey"
            :error="bankDetailError.includes('bankKey')"
            :hint-text="bankDetailError.includes('bankKey') ? 'Bank Key required' : ''"
          />
          <UiInput
            v-if="isBankNotRegistered"
            label="Bank Name"
            placeholder="Bank Name"
            required
            v-model="payload.request.bankDetailDto.bankName"
            :error="bankDtoError.includes('bankName')"
            :hint-text="bankDtoError.includes('bankName') ? 'Bank Name required' : ''"
            :disabled="mode === 'view'"
          />
          <UiInput
            v-if="isBankNotRegistered"
            label="Bank Key"
            placeholder="Bank Key"
            required
            v-model="payload.request.bankDetailDto.bankKey"
            :error="bankDtoError.includes('bankKey')"
            :hint-text="bankDtoError.includes('bankKey') ? 'Bank Key required' : ''"
            :disabled="mode === 'view'"
          />

          <!-- bank addres utk bank yang terdaftar -->
          <UiInput
            v-model="payload.request.vendorBankDetail.bankAddress"
            label="Bank Address"
            placeholder="Bank Address"
            required
            :error="bankDetailError.includes('bankAddress')"
            :hint-text="bankDetailError.includes('bankAddress') ? 'Bank Address required' : ''"
            v-if="!isBankNotRegistered"
            :disabled="mode === 'view'"
          />

          <!-- bank address utk bank yang belum terdaftar -->
          <UiInput
            v-model="payload.request.bankDetailDto.address"
            label="Bank Address"
            placeholder="Bank Address"
            required
            :error="bankDtoError.includes('address')"
            :hint-text="bankDtoError.includes('address') ? 'Bank Address required' : ''"
            v-if="isBankNotRegistered"
            @update:model-value="payload.request.vendorBankDetail.bankAddress = $event"
            :disabled="mode === 'view'"
          />
        </UiFormGroup>
        <UiFormGroup hide-border>
          <UiInput
            label="Account Holder Name"
            placeholder="Enter full name as written in bank book"
            required
            v-model="payload.request.vendorBankDetail.accountName"
            :error="bankDetailError.includes('accountName')"
            :hint-text="bankDetailError.includes('accountName') ? 'Account Name required' : ''"
            :disabled="mode === 'view'"
          />
          <UiSelect
            label="Currency"
            placeholder="Select"
            :options="currencyOptions"
            valueKey="currencyCode"
            textKey="label"
            required
            v-model="payload.request.vendorBankDetail.currencySymbol"
            :error="bankDetailError.includes('currencySymbol')"
            :hint-text="bankDetailError.includes('currencySymbol') ? 'Currency required' : ''"
            :disabled="mode === 'view'"
          />

          <div class="relative" v-if="payload.request.vendorBankDetail.isHolderNameDifferent">
            <div
              class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]"
            >
              Account Discrepancy Statement
              <span class="text-danger"> *</span>
            </div>
            <UiFileUpload
              name="accountDiscrepancyStatement"
              accepted-files=".jpg,.jpeg,.png,.pdf"
              placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
              :error="bankDetailError.includes('urlAccountDifferences')"
              :hint-text="
                bankDetailError.includes('urlAccountDifferences')
                  ? 'Account Difference required'
                  : ''
              "
              @addedFile="uploadFile($event, 'different account')"
              :disabled="mode === 'view'"
            />
          </div>

          <div class="h-[40px]">
            <UiCheckbox
              label="Bank not registered."
              v-model="isBankNotRegistered"
              @update:mode-value="console.log('Bank not registered:')"
              :disabled="mode === 'view'"
            />
          </div>

          <UiSelect
            v-if="isBankNotRegistered"
            label="Bank Country"
            placeholder="Select"
            :options="countryOptions"
            valueKey="value"
            textKey="label"
            required
            v-model="payload.request.bankDetailDto.bankCountryCode"
            :error="bankDtoError.includes('bankCountryCode')"
            :hint-text="bankDtoError.includes('bankCountryCode') ? 'Country required' : ''"
            :disabled="mode === 'view'"
          />

          <UiInput
            v-if="isBankNotRegistered"
            label="Bank Branch"
            placeholder="Bank Branch"
            required
            v-model="payload.request.bankDetailDto.branch"
            :error="bankDtoError.includes('branch')"
            :hint-text="bankDtoError.includes('branch') ? 'Branch required' : ''"
            :disabled="mode === 'view'"
          />
          <UiInput
            v-if="isBankNotRegistered"
            label="Swift Code"
            placeholder="Swift Code"
            required
            v-model="payload.request.bankDetailDto.swiftCode"
            :error="bankDtoError.includes('swiftCode')"
            :hint-text="bankDtoError.includes('swiftCode') ? 'Swift Code required' : ''"
            :disabled="mode === 'view'"
          />
        </UiFormGroup>
      </div>
      <div class="mt-4 w-full flex justify-end items-center gap-2">
        <UiButton outline @click="closeModal">
          <UiIcon name="black-left-line" />
          <span>Cancel</span>
        </UiButton>
        <UiButton
          variant="primary"
          @click="handleSubmit"
          :disabled="isSaveLoading"
          v-if="mode !== 'view'"
        >
          <UiLoading variant="white" v-if="isSaveLoading" />
          <UiIcon name="file-added" variant="duotone" v-else />
          <span>Save</span>
        </UiButton>
      </div>
    </UiModal>

    <!-- Delete Modal -->
    <UiModal v-model="deleteModal" size="sm">
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
          @click="deleteModal = false"
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

    <!-- Success Modal -->
    <UiModal v-model="successModal" size="sm" @update:model-value="handleSuccess">
      <ModalSuccessLogo class="mx-auto" />
      <h3 class="text-center text-lg font-medium">Hooray!</h3>
      <p class="text-center text-base text-gray-600 mb-5">
        The data has been successfully updated in the admin system.
      </p>
    </UiModal>

    <!-- Error Modal -->
    <UiModal v-model="errorModal" size="sm">
      <div class="text-center mb-6">
        <UiIcon
          name="cross-circle"
          variant="duotone"
          class="text-[150px] text-danger text-center"
        />
      </div>
      <h3 class="text-center text-lg font-medium">
        Failed to {{ mode == 'delete' ? 'Delete' : mode === 'edit' ? 'Change' : 'Add' }} Payment
        Information!
      </h3>
      <p class="text-center text-base text-gray-600 mb-5">
        Failed to change Payment Information. Please try again later or contact support if the
        problem persists.
      </p>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiLoading from '@/components/UiLoading.vue'
import { checkEmptyValues } from '@/composables/validation'
import { type CurrencyListType } from '@/stores/master-data/types/vendor-master-data'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import type { IPaymentPayload } from '@/stores/vendor/types/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useVendorPaymentStore } from '@/stores/vendor/vendor'
import { useLoginStore } from '@/stores/views/login'
import { cloneDeep } from 'lodash'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// store
const paymentDataStore = useVendorPaymentStore()
const uploadStore = useVendorUploadStore()
const lookupStore = useVendorMasterDataStore()
const userStore = useLoginStore()

const route = useRoute()

const defaultPayload: IPaymentPayload = {
  request: {
    bankDetailDto: {
      bankCountryCode: '',
      address: '',
      bankKey: '',
      bankName: '',
      branch: '',
      swiftCode: '',
    },
    vendorBankDetail: {
      accountNo: '',
      accountName: '',
      urlAccountDifferences: '',
      urlFirstPage: '',
      urlDoc: '',
      urlBankAccountDeclaration: '',
      currencySymbol: '',
      bankAddress: '',
      bankKey: '',
      countryId: 0,
      isBankRegistered: true,
      isHolderNameDifferent: false,
    },
    id: 0,
    vendorId: Number(route.params.id),
    updateBy: userStore.userData?.profile.employeeName || '',
  },
}

const modalTitle = ref('Add Payment Information')
const isModalOpen = ref(false)
const isDownloadLoading = ref(false)
const isSaveLoading = ref(false)
const mode = ref<'add' | 'view' | 'edit' | 'delete'>('add')
const selectedPaymentId = ref<number | null>(null)
const successModal = ref(false)
const errorModal = ref(false)
const deleteModal = ref(false)

const isBankNotRegistered = ref(false)

// validation
const bankDtoError = ref<string[]>([])
const bankDetailError = ref<string[]>([])

// payload
const payload = ref<IPaymentPayload>(cloneDeep(defaultPayload))

const currencyOptions = computed<CurrencyListType>(() =>
  lookupStore.currencyList.map((item) => ({
    ...item,
    label: `${item.currencyName} (${item.currencyCode})`,
  })),
)

const bankOptions = computed(() =>
  lookupStore.bankList.map((item) => ({
    ...item,
    label: `${item.bankKey} - ${item.bankNameAccount}`,
  })),
)

const countryOptions = computed(() =>
  lookupStore.countryList.map((item) => ({
    value: item.countryCode,
    label: `${item.countryCode} - ${item.countryName}`,
  })),
)

const closeModal = () => {
  isModalOpen.value = false
  bankDetailError.value = []
  bankDtoError.value = []
  payload.value = cloneDeep(defaultPayload)
  isBankNotRegistered.value = false
}

const openModal = () => {
  mode.value = 'add'
  modalTitle.value = 'Add Payment Information'
  isModalOpen.value = true
}

const downloadFile = async (path: string) => {
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

const uploadFile = async (file: File, type: 'different account' | 'first page') => {
  if (!file) return

  const formData = new FormData()
  formData.append('FormFile', file)
  formData.append('Actioner', userStore.userData?.profile.profileId.toString() || '0')

  try {
    const response = await uploadStore.upload(formData)

    if (type === 'different account') {
      payload.value.request.vendorBankDetail.urlAccountDifferences = response?.path as string
    } else if (type === 'first page') {
      payload.value.request.vendorBankDetail.urlFirstPage = response?.path as string
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      alert('File upload failed. Please try again.')
    }
  }
}

const handleDropdown = (id: number, newMode: 'view' | 'edit' | 'delete') => {
  mode.value = newMode
  selectedPaymentId.value = id
  isModalOpen.value = true

  switch (newMode) {
    case 'view':
      modalTitle.value = 'View Payment Information'
      break
    case 'edit':
      modalTitle.value = 'Edit Payment Information'
      break
  }

  const paymentData = paymentDataStore.data.find((item) => item.id === id)
  if (paymentData) {
    payload.value.request.id = id
    payload.value.request.vendorBankDetail.accountName = paymentData.accountName
    payload.value.request.vendorBankDetail.accountNo = paymentData.accountNo
    payload.value.request.vendorBankDetail.currencySymbol = paymentData.currencySymbol
    payload.value.request.vendorBankDetail.bankAddress = paymentData.bankAddress
    payload.value.request.vendorBankDetail.isBankRegistered = paymentData.isBankRegistered
    payload.value.request.vendorBankDetail.isHolderNameDifferent = paymentData.isHolderNameDifferent
    isBankNotRegistered.value = !paymentData.isBankRegistered

    if (paymentData.isBankRegistered) {
      payload.value.request.vendorBankDetail = {
        ...payload.value.request.vendorBankDetail,
        bankKey: paymentData.bankCode,
        urlBankAccountDeclaration: paymentData.urlBankAccountDeclaration!,
      }
    } else {
      payload.value.request.bankDetailDto = {
        ...payload.value.request.bankDetailDto,
        address: paymentData.bankAddress,
        bankCountryCode: paymentData.countryCode!,
        bankKey: paymentData.bankCode,
        bankName: paymentData.bankName,
        branch: paymentData.branch,
        swiftCode: paymentData.bankSwiftCode,
      }
    }
  }
}

const handleDeleteModal = (id: number) => {
  mode.value = 'delete'
  selectedPaymentId.value = id
  deleteModal.value = true
}

// tambah atau edit bank
const handleSubmit = async () => {
  bankDetailError.value = checkEmptyValues(payload.value.request.vendorBankDetail)

  // cek jika holder name berbeda, hapus field yang tidak diperlukan
  if (!payload.value.request.vendorBankDetail.isHolderNameDifferent) {
    bankDetailError.value = bankDetailError.value.filter(
      (field) => !['urlFirstPage', 'urlAccountDifferences'].includes(field),
    )
  }

  if (!payload.value.request.vendorBankDetail.isBankRegistered) {
    bankDtoError.value = checkEmptyValues(payload.value.request.bankDetailDto)
    bankDetailError.value = bankDetailError.value.filter(
      (field) => !['bankKey', 'bankAddress'].includes(field),
    )
  }

  // hapus error utk field yang kosong
  bankDetailError.value = bankDetailError.value.filter(
    (field) =>
      ![
        'urlDoc',
        'urlBankAccountDeclaration',
        'countryId',
        'isHolderNameDifferent',
        'isBankRegistered',
      ].includes(field),
  )

  if (bankDetailError.value.length > 0 || bankDtoError.value.length > 0) return

  try {
    isSaveLoading.value = true
    await paymentDataStore.addPayment(payload.value)
    successModal.value = true
  } catch (error) {
    if (error instanceof Error) {
      errorModal.value = true
    }
  } finally {
    closeModal()
    isSaveLoading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedPaymentId.value) return

  try {
    isSaveLoading.value = true
    await paymentDataStore.deletePayment({
      request: {
        id: selectedPaymentId.value,
        updateBy: userStore.userData?.profile.employeeName as string,
      },
    })
    successModal.value = true
  } catch (error) {
    if (error instanceof Error) {
      errorModal.value = true
    }
  } finally {
    isSaveLoading.value = false
    deleteModal.value = false
  }
}

const handleSuccess = () => {
  paymentDataStore.getData(route.params.id as string)
}

watch(isBankNotRegistered, (value) => {
  payload.value.request.vendorBankDetail.isBankRegistered = !value
  payload.value.request.vendorBankDetail.bankKey = ''
})

onMounted(() => {
  paymentDataStore.getData(route.params.id as string)
  lookupStore.getVendorCurrency()
  lookupStore.getVendorBanks()
  lookupStore.getVendorCountries()
})
</script>
