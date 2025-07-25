<template>
  <div class="space-y-3">
    <div class="card">
      <div class="card-header">
        <h2 class="text-md font-bold text-slate-800">Payment Information</h2>
        <div class="flex">
          <UiButton variant="primary" outline @click="openModal()">
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
                        <button class="menu-link" @click="handleDropdown(item.id, 'delete')">
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
                  :disabled="!item.urlAccountDifferences"
                  @click="downloadFile(item.urlAccountDifferences)"
                >
                  <UiIcon name="cloud-download" variant="duotone" />
                </UiButton>
              </td>
              <td class="text-center">
                <UiButton
                  icon
                  outline
                  size="sm"
                  :disabled="!item.urlFirstPage"
                  @click="downloadFile(item.urlFirstPage)"
                >
                  <UiIcon name="cloud-download" variant="duotone" />
                </UiButton>
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

    <UiModal :title="modalTitle" v-model="isModalOpen" @update:model-value="closeModal" size="lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <UiFormGroup hide-border>
          <UiInput
            label="Bank Account Number"
            placeholder="Enter Bank Account Number"
            required
            :readonly="mode === 'view'"
            v-model="payload.request.vendorBankDetail.accountNo"
          />

          <UiCheckbox
            label="Holder's name is different from the company name."
            v-model="payload.request.vendorBankDetail.isHolderNameDifferent"
          />

          <UiFileUpload
            v-if="payload.request.vendorBankDetail.isHolderNameDifferent"
            name="accountCover"
            accepted-files=".jpg,.jpeg,.png,.pdf"
            placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
          />

          <UiSelect
            label="Bank Key"
            placeholder="Select"
            :options="bankOptions"
            valueKey="bankKey"
            textKey="bankNameAccount"
            required
            :disabled="mode === 'view' || isBankNotRegistered"
          />
          <UiInput
            v-if="isBankNotRegistered"
            label="Bank Name"
            placeholder="Bank Name"
            required
            v-model="payload.request.bankDetailDto.bankName"
          />
          <UiInput
            v-if="isBankNotRegistered"
            label="Bank Key"
            placeholder="Bank Key"
            required
            v-model="payload.request.bankDetailDto.bankKey"
          />
          <UiInput label="Bank Address" placeholder="Bank Address" required />
        </UiFormGroup>
        <UiFormGroup hide-border>
          <UiInput
            label="Account Holder Name"
            placeholder="Enter full name as written in bank book"
            required
            v-model="payload.request.vendorBankDetail.accountName"
          />
          <UiSelect
            label="Currency"
            placeholder="Select"
            :options="currencyOptions"
            valueKey="currencyCode"
            textKey="currencyName"
            required
            v-model="payload.request.vendorBankDetail.currencySymbol"
          />
          <UiFileUpload
            v-if="payload.request.vendorBankDetail.isHolderNameDifferent"
            name="accountDiscrepancyStatement"
            accepted-files=".jpg,.jpeg,.png,.pdf"
            placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
          />

          <UiCheckbox
            label="Bank not registered."
            v-model="isBankNotRegistered"
            @update:mode-value="console.log('Bank not registered:')"
          />

          <UiInput
            v-if="isBankNotRegistered"
            label="Bank Branch"
            placeholder="Bank Branch"
            required
            v-model="payload.request.bankDetailDto.branch"
          />
          <UiInput
            v-if="isBankNotRegistered"
            label="Swift Code"
            placeholder="Swift Code"
            required
          />
        </UiFormGroup>
      </div>
      <div class="mt-4 w-full flex justify-end items-center gap-2">
        <UiButton outline @click="closeModal">
          <UiIcon name="black-left-line" />
          <span>Cancel</span>
        </UiButton>
        <UiButton variant="primary" @click="handleSubmit">
          <UiIcon name="file-added" variant="duotone" />
          <span>Save</span>
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { type CurrencyListType } from '@/stores/master-data/types/vendor-master-data'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import type { IPaymentPayload } from '@/stores/vendor/types/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useVendorPaymentStore } from '@/stores/vendor/vendor'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// store
const paymentDataStore = useVendorPaymentStore()
const uploadStore = useVendorUploadStore()
const lookupStore = useVendorMasterDataStore()

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
      currencySymbol: '',
      bankAddress: '',
      bankKey: '',
      countryId: 0,
      isBankRegistered: true,
      isHolderNameDifferent: false,
      urlBankAccountDeclaration: '',
      urlDoc: '',
    },
    id: 0,
    vendorId: Number(route.params.id),
    updateBy: '',
  },
}

const modalTitle = ref('Add Payment Information')
const isModalOpen = ref(false)
const isDownloadLoading = ref(false)
const mode = ref<'add' | 'view' | 'edit' | 'delete'>('add')
const selectedPaymentId = ref<number | null>(null)

const isBankNotRegistered = ref(false)

// payload
const payload = ref<IPaymentPayload>({ ...defaultPayload })

const currencyOptions = computed<CurrencyListType>(() => lookupStore.currencyList)
const bankOptions = computed(() => lookupStore.bankList)

const closeModal = () => {
  isModalOpen.value = false
  payload.value = { ...defaultPayload }
}

const openModal = () => {
  isModalOpen.value = true
  mode.value = 'add'
  modalTitle.value = 'Add Payment Information'
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
    case 'delete':
      modalTitle.value = 'Delete Payment Information'
      break
  }
}

const handleSubmit = () => {
  if (mode.value === 'add') {
    handleAdd()
  }

  if (mode.value === 'edit') {
    handleUpdate()
  }
}

const handleAdd = async () => {
  console.log('Adding payment information:', payload.value)
}

const handleUpdate = async () => {}

const handleDelete = async () => {}

watch(isBankNotRegistered, (value) => {
  payload.value.request.vendorBankDetail.isBankRegistered = !value
})

onMounted(async () => {
  await paymentDataStore.getData(route.params.id as string)
  await lookupStore.getVendorCurrency()
  await lookupStore.getVendorBanks()
})
</script>
