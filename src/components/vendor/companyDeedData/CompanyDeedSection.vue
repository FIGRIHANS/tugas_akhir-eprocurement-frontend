<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { IAdministration, type IVendorLegalDocumentPayload } from '@/stores/vendor/types/vendor'
import { useCompanyDeedDataStore, useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { useRoute } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'

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

const vendorLegalDocStore = useCompanyDeedDataStore()
const adminVendorStore = useVendorAdministrationStore()

const route = useRoute()

const administrationData = ref<IAdministration>(adminVendorStore.data!)

const handleSave = () => {
  console.log(vendorLegalDocPayload)
}

onMounted(() => {
  vendorLegalDocStore.getVendorLegalDocument(Number(route.params.id))
})

console.log(vendorLegalDocStore.vendorLegalDocData)
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
          <p class="text-sm text-slate-700">{{ administrationData?.companyCategoryName }}</p>
        </div>
        <div class="flex items-center gap-20">
          <p class="text-sm text-slate-700">Company Address</p>
          <p class="text-sm text-slate-700">
            {{ administrationData?.addressCompanyDetail }}
          </p>
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
          <UiFileUpload
            name="file"
            label="File"
            placeholder="Upload file"
            hint-text="*jpg, jpeg, png, pdf, zip / max : 16 MB"
          />
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
        <tbody>
          <!-- show loading -->
          <tr v-if="vendorLegalDocStore.vendorLegalDocLoading">
            <td colspan="5" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- show error message -->
          <tr v-else-if="vendorLegalDocStore.vendorLegalDocError">
            <td colspan="5" class="text-center">
              {{ vendorLegalDocStore.vendorLegalDocError }}
            </td>
          </tr>

          <!-- show message if there are no data -->
          <tr v-else-if="!vendorLegalDocStore.vendorLegalDocData.length">
            <td colspan="5" class="text-center">No data</td>
          </tr>

          <!-- show data -->
          <tr
            v-else
            v-for="doc in vendorLegalDocStore.vendorLegalDocData"
            :key="doc.id"
            class="font-normal text-sm"
          >
            <td class="text-center">
              <UiIcon name="check" variant="duotone" />
            </td>
            <td class="text-center">{{ doc.documentNo }}</td>
            <td class="text-center">{{ doc.documentDate }}</td>
            <td class="text-center">{{ doc.notaryName }}</td>
            <td class="text-center">{{ doc.notaryLocation }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
