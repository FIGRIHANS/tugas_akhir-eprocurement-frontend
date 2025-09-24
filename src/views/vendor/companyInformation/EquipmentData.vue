<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Equipment Data (Heavy Machinery)</h3>

      <UiButton variant="primary" data-modal-toggle="#modal-equipment">
        <UiIcon name="plus-circle" variant="duotone" />
        Add
      </UiButton>
    </div>

    <div class="flex flex-col gap-4 pb-4">
      <div class="card-table">
        <table class="table align-middle">
          <thead>
            <tr>
              <th class="w-[70px]"></th>
              <th>Equipment Name</th>
              <th>Brand / Type</th>
              <th>Year of Manufacture</th>
              <th>Serial / License Number</th>
              <th>Capacity (Tonnage)</th>
              <th>Condition</th>
              <th>Ownership Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in dataResponse">
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
                          Edit
                        </span>
                      </div>
                      <div class="menu-item text-danger" @click="deleteData(data)">
                        <span class="menu-link">
                          <UiIcon name="cross-circle" variant="duotone" class="menu-icon" />
                          Delete
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
          Show
          <UiSelect v-model="pagination.pageSize" :options="pageSizeOptions" class="w-16" />
          per page from {{ pagination.total }} data
        </div>

        <LPagination
          :totalItems="pagination.total"
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
        <h3 class="modal-title text-lg">Heavy Equipment</h3>
      </div>

      <div class="modal-body !py-5 flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UiInput
            v-model="payload.name"
            label="Equipment Name"
            placeholder="Equipment Name"
            :error="payloadError.name"
            required
          />
          <UiInput
            v-model="payload.brand"
            label="Brand / Type "
            placeholder="Brand / Type "
            :error="payloadError.brand"
            required
          />
          <DatePicker
            v-model="payload.mfgDate"
            placeholder="Select"
            format="MMMM dd, yyyy"
            label="Year of Manufacture"
            :error="payloadError.mfgDate"
            required
            label-top
          />
          <UiInput
            v-model="payload.serialNo"
            label="Serial Number / License Plate Number"
            placeholder="Serial Number / License Plate Number"
          />
          <UiInput v-model="payload.capacity" label="Capacity" placeholder="Write Number" />
          <UiSelect
            v-model="payload.condition"
            label="Condition"
            placeholder="--Condition Heavy Equipment--"
            :options="conditionTypeList"
            text-key="value"
            value-key="code"
            :error="payloadError.condition"
            required
          />
          <UiSelect
            v-model="payload.ownership"
            label="Ownership Status"
            placeholder="--Ownership Status--"
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
            Cancel
          </UiButton>
          <UiButton variant="primary" @click="checkPayload">
            <UiIcon v-if="loading" name="loading" variant="filled" class="animate-spin" />
            <UiIcon v-else name="file-added" variant="duotone" />
            Save
          </UiButton>
        </div>
      </div>
    </div>
  </div>

  <ModalConfirmation
    :open="modalTrigger.success"
    id="equipment-success"
    type="success"
    title="Equipment Data Successfully Updated"
    text="The data has been successfully updated in the admin system."
    no-cancel
    static
    submit-button-text="Ok"
    :submit="() => closeModal('success')"
  />
  <ModalConfirmation
    :open="modalTrigger.confirm"
    id="equipment-confirm"
    type="confirm"
    title="Save"
    text="You are about to Save to this data. Please review your input before continuing."
    static
    :loading="loading"
    cancel-button-text="Cancel"
    submit-button-text="Save"
    :cancel="() => closeModal('confirm')"
    :submit="submitData"
  />
  <ModalConfirmation
    :open="modalTrigger.delete"
    id="equipment-delete"
    type="danger"
    title="Are You Sure You Want to Delete This Item?"
    text="This action will permanently remove the selected data from the list."
    static
    :loading="loading"
    cancel-button-text="Cancel"
    submit-button-text="Delete"
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
import { useEquipmentDataStore, useVendorAdministrationStore } from '@/stores/vendor/vendor'
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
import { useChangeDataEmailStore } from '@/stores/vendor/email-change-data'

const vendorMasterData = useVendorMasterDataStore()
const equipmentDataStore = useEquipmentDataStore()
const loginStore = useLoginStore()
const adminStore = useVendorAdministrationStore()
const changeDataEmailStore = useChangeDataEmailStore()

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
  total: 10,
})

const conditionTypeList = computed(() => vendorMasterData.conditionTypeList)
const ownershipStatusList = computed(() => vendorMasterData.ownershipStatusList)
const dataResponse = computed(() => {
  const { items, total } = equipmentDataStore.data

  pagination.value.total = total

  return items
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
  const {
    conditionName,
    ownershipName,
    categoryName,
    createdBy,
    modifiedBy,
    createdDate,
    modifiedDate,
    ...cleanPayload
  } = value

  payload.value = {
    ...payload.value,
    ...cleanPayload,
  }

  modalForm.value.toggle()
}

const deleteData = (value: EquipmentDataType) => {
  const {
    conditionName,
    ownershipName,
    categoryName,
    createdBy,
    modifiedBy,
    createdDate,
    modifiedDate,
    ...cleanPayload
  } = value

  payload.value = {
    ...payload.value,
    ...cleanPayload,
    isActive: false,
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
    await changeDataEmailStore.sendEmail({
      recepientName: adminStore.data.vendorName,
      recepients: {
        emailTo: adminStore.data.vendorEmail,
        emailCc: '',
        emailBcc: '',
      },
    })

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
