<script lang="ts" setup>
import { reactive } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { IVendorLegalDocumentPayload } from '@/stores/vendor/types/vendor'

const vendorLegalDocPayload = reactive<IVendorLegalDocumentPayload>({
  id: 0,
  vendorID: 0,
  filename: '',
  filesize: 0,
  documentURL: '',
  documentType: 0,
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

const handleSave = () => {
  console.log(vendorLegalDocPayload)
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="w-full flex justify-between items-center">
        <h3 class="text-lg font-semibold text-slate-800">Company Deed Data</h3>
      </div>
    </div>
    <div class="card-body">
      <div class="space-y-6 mb-6">
        <div class="flex items-center gap-20">
          <p class="text-sm text-slate-700">Company Category</p>
          <p class="text-sm text-slate-700">PKP</p>
        </div>
        <div class="flex items-center gap-20">
          <p class="text-sm text-slate-700">Company Address</p>
          <p class="text-sm text-slate-700">Jalan Bandung</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 mb-8">
        <UiFormGroup hide-border>
          <UiInput
            label="Number"
            placeholder="Number"
            row
            v-model="vendorLegalDocPayload.documentNo"
          />
          <UiInput
            label="Notary"
            placeholder="Notary full name"
            row
            v-model="vendorLegalDocPayload.notaryName"
          />
          <UiFileUpload name="file" label="File" placeholder="Upload file" hint-text="*jpg, jpeg, png, pdf, zip / max : 16 MB" />
        </UiFormGroup>
        <UiFormGroup hide-border>
          <DatePicker
            v-model="vendorLegalDocPayload.documentDate"
            label="Letter Date"
            format="dd MM yyyy"
            placeholder="Pilih Tanggal"
          />
          <UiSelect
            label="Notary Office Location"
            placeholder="Select"
            :options="[]"
            row
            v-model="vendorLegalDocPayload.notaryLocation"
          />
          <div class="flex justify-end items-center">
            <UiButton variant="primary" @click="handleSave">
              <UiIcon variant="duotone" name="plus-circle" />
              Add
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
            <th class="text-nowrap">Notary</th>
            <th class="text-nowrap">Notary Office Location</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>
