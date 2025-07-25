<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h2 class="text-md font-bold text-slate-800">Payment Information</h2>
        <div class="flex">
          <UiButton variant="primary" outline @click="openModal()">
            <UiIcon variant="duotone" name="plus-circle" />
            Add Data</UiButton
          >
        </div>
      </div>
      <div class="card-body">
        <table class="table align-middle text-gray-700">
          <thead class="border-b-2 border-b-primary">
            <tr>
              <th></th>
              <th class="text-nowrap">No</th>
              <th class="text-nowrap">Account No.</th>
              <th class="text-nowrap">Account Holder Name</th>
              <th class="text-nowrap">SwiftCode</th>
              <th class="text-nowrap">Account Discrepancy Statement</th>
              <th class="text-nowrap">Account Cover</th>
              <th class="text-nowrap">Currentcy</th>
              <th class="text-nowrap">Bank Key</th>
              <th class="text-nowrap">Bank Name</th>
              <th class="text-nowrap">Bank Branch</th>
              <th class="text-nowrap">Bank Address</th>
            </tr>
          </thead>
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
          <UiInput label="Bank Account Number" placeholder="Enter Bank Account Number" />

          <UiCheckbox
            label="Holder's name is different from the company name."
            v-model="isHolderNameDifferent"
          />

          <UiFileUpload
            v-if="isHolderNameDifferent"
            name="accountCover"
            accepted-files=".jpg,.jpeg,.png,.pdf"
            placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
          />

          <UiSelect
            label="Bank Key"
            placeholder="Select"
            :options="[]"
            valueKey="value"
            textKey="text"
            required
          />
          <UiInput label="Bank Name" placeholder="Bank Name" required />
          <UiInput v-if="isBankNotRegistered" label="Bank Key" placeholder="Bank Key" required />
          <UiInput
            v-if="isBankNotRegistered"
            label="Bank Address"
            placeholder="Bank Address"
            required
          />
        </UiFormGroup>
        <UiFormGroup hide-border>
          <UiInput
            label="Account Holder Name"
            placeholder="Enter full name as written in bank book"
            required
          />
          <UiSelect
            label="Currency"
            placeholder="Select"
            :options="currencyOptions"
            valueKey="value"
            textKey="text"
            required
          />
          <UiFileUpload
            v-if="isHolderNameDifferent"
            name="accountDiscrepancyStatement"
            accepted-files=".jpg,.jpeg,.png,.pdf"
            placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
          />

          <UiCheckbox label="Bank not registered." v-model="isBankNotRegistered" />

          <UiInput
            v-if="isBankNotRegistered"
            label="Bank Branch"
            placeholder="Bank Branch"
            required
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
        <UiButton outline>Cancel</UiButton>
        <UiButton variant="primary">Save</UiButton>
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
import { ref } from 'vue'

const modalTitle = ref('Add Payment Information')
const isModalOpen = ref(false)

// New ref for "Bank not registered" checkbox
const isBankNotRegistered = ref(false)

// New ref for "Holder's name is different" checkbox
const isHolderNameDifferent = ref(false)

const currencyOptions = [
  { value: 'USD', text: 'US Dollar' },
  { value: 'EUR', text: 'Euro' },
  { value: 'IDR', text: 'Rupiah' },
]

const closeModal = () => {
  isModalOpen.value = false
  // Optionally reset checkbox states when closing the modal
  isBankNotRegistered.value = false
  isHolderNameDifferent.value = false
}

const openModal = () => {
  isModalOpen.value = true
}
</script>
