<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Equipment Data (Heavy Machinery)</h3>

      <UiButton variant="primary" data-modal-toggle="#modal-equipment">
        <UiIcon name="plus-circle" variant="duotone" />
        Add
      </UiButton>
    </div>

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
          <tr>
            <td>
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                  <UiIcon name="dots-vertical" />
                </button>

                <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                  <div class="menu menu-default flex flex-col w-full text-sm">
                    <div class="menu-item text-warning" @click="editData">
                      <span class="menu-link">
                        <UiIcon name="notepad-edit" variant="duotone" class="menu-icon" />
                        Edit
                      </span>
                    </div>
                    <div class="menu-item text-danger" @click="deleteData">
                      <span class="menu-link">
                        <UiIcon name="cross-circle" variant="duotone" class="menu-icon" />
                        Hapus
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>Excavator</td>
            <td>CAT</td>
            <td>2021</td>
            <td>DR 2134 KL</td>
            <td>20 Ton</td>
            <td>Good</td>
            <td>
              <UiBadge variant="success" size="sm" outline>Owned</UiBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="modal" data-modal="true" data-modal-backdrop-static="true" id="modal-equipment">
    <div class="modal-content modal-center-y max-w-4xl">
      <div class="modal-header">
        <h3 class="modal-title text-lg">Heavy Equipment</h3>
      </div>

      <div class="modal-body !py-5 flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UiInput
            v-model="payload.equipmentName"
            label="Equipment Name"
            placeholder="Equipment Name"
            required
          />
          <UiInput
            v-model="payload.brand"
            label="Brand / Type "
            placeholder="Brand / Type "
            required
          />
          <DatePicker
            v-model="payload.yearOfManufacture"
            placeholder="Select"
            format="dd MM yyyy"
            label="Year of Manufacture"
            required
            label-top
          />
          <UiInput
            v-model="payload.serialNumber"
            label="Serial Number / License Plate Number"
            placeholder="Serial Number / License Plate Number"
          />
          <UiInput
            v-model="payload.capacity"
            label="Capacity (Tonnage)"
            placeholder="Write Number"
          />
          <UiSelect
            v-model="payload.conditionId"
            label="Condition"
            placeholder="--Condition Heavy Equipment--"
            :options="[]"
            required
          />
          <UiSelect
            v-model="payload.statusId"
            label="Ownership Status"
            placeholder="--Ownership Status--"
            :options="[]"
            required
          />
        </div>

        <div class="flex flex-row justify-end items-center gap-4 w-full">
          <UiButton variant="primary" outline data-modal-dismiss="true">
            <UiIcon name="black-left" variant="filled" />
            Cancel
          </UiButton>
          <UiButton variant="primary" @click="submitData">
            <UiIcon name="file-added" variant="duotone" />
            Save
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type PayloadEquipmentDataType = {
  equipmentName: string
  brand: string
  yearOfManufacture: string
  serialNumber: string
  capacity: string
  conditionId: string
  conditionName: string
  statusId: string
  statusName: string
}

import { ref } from 'vue'

import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiBadge from '@/components/ui/atoms/badge/UiBadge.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const payload = ref<PayloadEquipmentDataType>({
  equipmentName: '',
  brand: '',
  yearOfManufacture: '',
  serialNumber: '',
  capacity: '',
  conditionId: '',
  conditionName: '',
  statusId: '',
  statusName: '',
})

const editData = () => {
  console.log('saham editData')
}

const deleteData = () => {
  console.log('saham deleteData')
}

const submitData = async () => {
  try {
    console.log(payload.value)
  } catch (error) {
    console.error(error)
  }
}
</script>
