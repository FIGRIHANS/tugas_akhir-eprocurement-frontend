<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">{{ $t('equipmentData.title') }}</h3>

      <UiButton variant="primary" data-modal-toggle="#modal-equipment" @click="closeAllDropdowns">
        <UiIcon name="plus-circle" variant="duotone" />
        {{ $t('equipmentData.add') }}
      </UiButton>
    </div>

    <div class="flex flex-col gap-4 pb-4">
      <div class="card-table">
        <table class="table align-middle">
          <thead>
            <tr>
              <th class="w-[70px]"></th>
              <th>{{ $t('equipmentData.tableHeaders.equipmentName') }}</th>
              <th>{{ $t('equipmentData.tableHeaders.brandType') }}</th>
              <th>{{ $t('equipmentData.tableHeaders.yearOfManufacture') }}</th>
              <th>{{ $t('equipmentData.tableHeaders.serialLicenseNumber') }}</th>
              <th>{{ $t('equipmentData.tableHeaders.capacity') }}</th>
              <th>{{ $t('equipmentData.tableHeaders.condition') }}</th>
              <th>{{ $t('equipmentData.tableHeaders.ownershipStatus') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in dataResponse.items" :key="data.id">
              <td>
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                    <UiIcon name="dots-vertical" />
                  </button>

                  <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                    <div class="menu menu-default flex flex-col w-full text-sm">
                      <div class="menu-item text-warning" @click="editData(data)">
                        <span class="menu-link">
                          <UiIcon name="notepad-edit" variant="duotone" class="menu-icon" />
                          {{ $t('equipmentData.actions.edit') }}
                        </span>
                      </div>
                      <div class="menu-item text-danger" @click="deleteData(data)">
                        <span class="menu-link">
                          <UiIcon name="cross-circle" variant="duotone" class="menu-icon" />
                          {{ $t('equipmentData.actions.delete') }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ data.name }}</td>
              <td>{{ data.brand }}</td>
              <td>{{ formatDateYear(data.mfgDate) }}</td>
              <td>{{ data.serialNo || '-' }}</td>
              <td>{{ data.capacity }}</td>
              <td>{{ data.conditionName }}</td>
              <td>
                <UiBadge variant="success" size="sm" outline>{{ data.ownershipName }}</UiBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-row items-center justify-between px-4">
        <div class="flex flex-row items-center gap-2">
          {{ $t('equipmentData.pagination.show') }}
          <UiSelect v-model="pagination.pageSize" :options="pageSizeOptions" class="w-16" />
          {{ $t('equipmentData.pagination.perPage') }} {{ dataResponse.total }}
          {{ $t('equipmentData.pagination.data') }}
        </div>

        <LPagination
          :totalItems="dataResponse.total"
          :pageSize="pagination.pageSize"
          :currentPage="pagination.currentPage"
          @pageChange="setPagePagination"
        />
      </div>
    </div>
  </div>

  <div
    ref="modal"
    class="modal"
    data-modal="true"
    data-modal-backdrop-static="true"
    id="modal-equipment"
  >
    <div class="modal-content modal-center-y max-w-4xl">
      <div class="modal-header">
        <h3 class="modal-title text-lg">{{ $t('equipmentData.modalTitles.heavyEquipment') }}</h3>
      </div>

      <div class="modal-body !py-5 flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UiInput
            v-model="payload.name"
            :label="$t('equipmentData.form.equipmentName')"
            :placeholder="$t('equipmentData.form.equipmentNamePlaceholder')"
            :error="payloadError.name"
            required
          />
          <UiInput
            v-model="payload.brand"
            :label="$t('equipmentData.form.brandType')"
            :placeholder="$t('equipmentData.form.brandTypePlaceholder')"
            :error="payloadError.brand"
            required
          />
          <DatePicker
            v-model="payload.mfgDate"
            :placeholder="$t('equipmentData.form.select')"
            format="MMM dd, yyyy"
            :label="$t('equipmentData.form.yearOfManufacture')"
            :error="payloadError.mfgDate"
            required
            label-top
          />
          <UiInput
            v-model="payload.serialNo"
            :label="$t('equipmentData.form.serialNumber')"
            :placeholder="$t('equipmentData.form.serialNumberPlaceholder')"
          />
          <UiInput
            v-model="payload.capacity"
            :label="$t('equipmentData.form.capacity')"
            :placeholder="$t('equipmentData.form.capacityPlaceholder')"
          />
          <UiSelect
            v-model="payload.condition"
            :label="$t('equipmentData.form.condition')"
            :placeholder="$t('equipmentData.form.conditionPlaceholder')"
            :options="conditionTypeList"
            text-key="value"
            value-key="code"
            :error="payloadError.condition"
            required
          />
          <UiSelect
            v-model="payload.ownership"
            :label="$t('equipmentData.form.ownershipStatus')"
            :placeholder="$t('equipmentData.form.ownershipStatusPlaceholder')"
            :options="ownershipStatusList"
            text-key="value"
            value-key="code"
            :error="payloadError.ownership"
            required
          />
        </div>

        <div class="flex flex-row justify-end items-center gap-4 w-full">
          <UiButton variant="primary" outline @click="resetPayload" data-modal-dismiss="true">
            <UiIcon name="black-left" variant="filled" />
            {{ $t('equipmentData.buttons.cancel') }}
          </UiButton>
          <UiButton variant="primary" @click="checkPayload">
            <UiIcon v-if="loading" name="loading" variant="filled" class="animate-spin" />
            <UiIcon v-else name="file-added" variant="duotone" />
            {{ $t('equipmentData.buttons.save') }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>

  <ModalConfirmation
    :open="modalTrigger.success"
    id="equipment-success"
    type="success"
    :title="$t('equipmentData.successModal.title')"
    :text="$t('equipmentData.successModal.message')"
    no-cancel
    static
    :submit-button-text="$t('equipmentData.buttons.ok')"
    :submit="() => closeModal('success')"
  />
  <ModalConfirmation
    :open="modalTrigger.confirm"
    id="equipment-confirm"
    type="confirm"
    :title="$t('equipmentData.confirmModal.title')"
    :text="$t('equipmentData.confirmModal.message')"
    static
    :loading="loading"
    :cancel-button-text="$t('equipmentData.buttons.cancel')"
    :submit-button-text="$t('equipmentData.buttons.save')"
    :cancel="() => closeModal('confirm')"
    :submit="submitData"
  />
  <ModalConfirmation
    :open="modalTrigger.delete"
    id="equipment-delete"
    type="danger"
    :title="$t('equipmentData.deleteModal.title')"
    :text="$t('equipmentData.deleteModal.message')"
    static
    :loading="loading"
    :cancel-button-text="$t('equipmentData.buttons.cancel')"
    :submit-button-text="$t('equipmentData.buttons.delete')"
    :cancel="() => closeModal('delete')"
    :submit="submitData"
  />
</template>

<script setup lang="ts">
type PayloadEquipmentDataErrorType = {
  name: boolean
  brand: boolean
  mfgDate: boolean
  condition: boolean
  ownership: boolean
}

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { KTModal } from '@/metronic/core'

import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useEquipmentDataStore } from '@/stores/vendor/vendor'
import { useLoginStore } from '@/stores/views/login'

import type { EquipmentDataType, PayloadEquipmentDataType } from '@/stores/vendor/types/vendor'

import { formatDatePayload, formatDateYear } from '@/composables/date-format'
import { useCheckEmpty } from '@/composables/validation'

import LPagination from '@/components/pagination/LPagination.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiBadge from '@/components/ui/atoms/badge/UiBadge.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

const vendorMasterData = useVendorMasterDataStore()
const equipmentDataStore = useEquipmentDataStore()
const loginStore = useLoginStore()

const route = useRoute()
const modal = ref()
const modalForm = computed(() => KTModal.getInstance(modal.value))
const modalTrigger = ref({
  success: false,
  confirm: false,
  delete: false,
})
const loading = ref<boolean>(false)
const isNotEmpty = ref<boolean>(false)
const pageSizeOptions = ref([
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
  { value: 20, text: '20' },
  { value: 50, text: '50' },
])
const pagination = ref({
  pageSize: 10,
  currentPage: 1,
})

const conditionTypeList = computed(() => vendorMasterData.conditionTypeList)
const ownershipStatusList = computed(() => vendorMasterData.ownershipStatusList)
const dataResponse = computed(() => {
  const { items, total } = equipmentDataStore.data
  return { items, total }
})

const payload = ref<PayloadEquipmentDataType>({
  id: 0,
  vendorID: Number(route.params.id),
  name: '',
  brand: '',
  type: '',
  mfgDate: '',
  serialNo: '',
  capacity: '',
  condition: 0,
  ownership: 0,
  category: 0,
  user: loginStore.userData?.profile.userName || '',
  isActive: true,
  isTemporary: true,
  refVendorID: 0,
  action: 0,
})

const payloadError = ref<PayloadEquipmentDataErrorType>({
  name: false,
  brand: false,
  mfgDate: false,
  condition: false,
  ownership: false,
})

const closeAllDropdowns = () => {
  // Tutup semua dropdown yang sedang terbuka dengan cara yang lebih reliable
  const openDropdowns = document.querySelectorAll('[data-dropdown="true"]')
  openDropdowns.forEach((dropdown) => {
    const dropdownContent = dropdown.querySelector('.dropdown-content')
    if (dropdownContent && dropdownContent.classList.contains('show')) {
      dropdownContent.classList.remove('show')
    }
  })

  // Alternatif: gunakan event click pada document untuk menutup dropdown
  document.body.click()
}

const resetPayload = () => {
  payload.value = {
    id: 0,
    vendorID: Number(route.params.id),
    name: '',
    brand: '',
    type: '',
    mfgDate: '',
    serialNo: '',
    capacity: '',
    condition: 0,
    ownership: 0,
    category: 0,
    user: loginStore.userData?.profile.userName || '',
    isActive: true,
    isTemporary: true,
    refVendorID: 0,
    action: 0,
  }

  payloadError.value = {
    name: false,
    brand: false,
    mfgDate: false,
    condition: false,
    ownership: false,
  }
}

const closeModal = (type: 'success' | 'confirm' | 'delete') => {
  modalTrigger.value = {
    success: type === 'success' && false,
    confirm: type === 'confirm' && false,
    delete: type === 'delete' && false,
  }

  resetPayload()
}

const setPagePagination = async (page: number) => {
  pagination.value.currentPage = page
}

const getData = async () => {
  try {
    await equipmentDataStore.getData(
      Number(route.params.id),
      pagination.value.currentPage,
      pagination.value.pageSize,
    )
  } catch (error) {
    console.error(error)
  }
}

const editData = (value: EquipmentDataType) => {
  // Create clean payload by copying only needed properties
  const cleanPayload = {
    id: value.id,
    vendorID: value.vendorID,
    name: value.name,
    brand: value.brand,
    type: value.type,
    mfgDate: value.mfgDate,
    serialNo: value.serialNo,
    capacity: value.capacity,
    condition: value.condition,
    ownership: value.ownership,
    category: value.category,
    user: value.user,
    isActive: value.isActive,
    isTemporary: value.isTemporary,
    refVendorID: value.refVendorID,
    action: value.action,
  }

  payload.value = {
    ...payload.value,
    ...cleanPayload,
  }

  modalForm.value.toggle()
}

const deleteData = (value: EquipmentDataType) => {
  // Create clean payload by copying only needed properties
  const cleanPayload = {
    id: value.id,
    vendorID: value.vendorID,
    name: value.name,
    brand: value.brand,
    type: value.type,
    mfgDate: value.mfgDate,
    serialNo: value.serialNo,
    capacity: value.capacity,
    condition: value.condition,
    ownership: value.ownership,
    category: value.category,
    user: value.user,
    isActive: false, // Set to false for deletion
    isTemporary: value.isTemporary,
    refVendorID: value.refVendorID,
    action: value.action,
  }

  payload.value = {
    ...payload.value,
    ...cleanPayload,
  }

  modalTrigger.value.delete = true
}

const checkPayload = () => {
  const { name, brand, mfgDate, condition, ownership } = payload.value

  payloadError.value = {
    name: useCheckEmpty(name).isError,
    brand: useCheckEmpty(brand).isError,
    mfgDate: useCheckEmpty(mfgDate).isError,
    condition: useCheckEmpty(condition).isError,
    ownership: useCheckEmpty(ownership).isError,
  }

  isNotEmpty.value = Object.values(payloadError.value).every((value) => value === false)

  if (isNotEmpty.value) {
    modalTrigger.value.confirm = true
    modalForm.value.toggle()
  }
}

const submitData = async () => {
  const { brand, mfgDate, condition, ownership } = payload.value
  try {
    loading.value = true
    payload.value = {
      ...payload.value,
      type: brand,
      mfgDate: formatDatePayload(mfgDate),
      condition: Number(condition),
      ownership: Number(ownership),
    }

    await equipmentDataStore.postData(payload.value)

    closeModal('confirm')
    modalTrigger.value.success = true
    await getData()
  } catch (error) {
    console.error(error)
    closeModal('confirm')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getData()
  vendorMasterData.getVendorReference('CONDITION_TYPE')
  vendorMasterData.getVendorReference('OWNERSHIP_STATUS')
})

watch(
  () => loginStore.userData?.profile,
  (newVal) => {
    if (newVal) {
      payload.value = {
        ...payload.value,
        user: newVal.userName,
      }
    }
  },
)

watch(
  () => [pagination.value.currentPage, pagination.value.pageSize],
  () => {
    getData()
  },
)
</script>
