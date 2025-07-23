<script setup lang="ts">
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { ref } from 'vue'

const letterDate = ref('')
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-lg font-semibold text-slate-800">Company Deed Data</h3>
    </div>
    <div class="card-body">
      <!-- shareholder table -->
      <div class="card">
        <div class="card-header">
          <div class="w-full flex justify-between items-center">
            <h3 class="text-lg font-semibold text-slate-800">Shareholders</h3>
            <UiButton variant="primary">
              <UiIcon variant="duotone" name="plus-circle" />
              Add
            </UiButton>
          </div>
        </div>
        <div class="card-body">
          <table class="table align-middle">
            <thead>
              <tr>
                <th class="text-nowrap"></th>
                <th class="text-nowrap">Type</th>
                <th class="text-nowrap">Shareholder Name</th>
                <th class="text-nowrap">Date of Birth / Company Establishment Date</th>
                <th class="text-nowrap">Nominal Value</th>
                <th class="text-nowrap">Share Unit</th>
                <th class="text-nowrap">No KTP</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <!-- company deed data table -->
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
              <UiInput label="Number" placeholder="Number" row />
              <UiInput label="Notary" placeholder="Notary full name" row />
              <UiFileUpload name="file" label="File" placeholder="Upload file" />
            </UiFormGroup>
            <UiFormGroup hide-border>
              <DatePicker
                v-model="letterDate"
                label="Letter Date"
                format="dd MM yyyy"
                placeholder="Pilih Tanggal"
              />
              <UiSelect label="Notary Office Location" placeholder="Select" :options="[]" row />
              <div class="flex justify-end items-center">
                <UiButton variant="primary">
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
      <!-- latest amandment data table -->
      <div class="card">
        <div class="card-header">
          <div class="w-full flex justify-between items-center">
            <h3 class="text-lg font-semibold text-slate-800">Latest Amendment Data</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-20 mb-8">
            <UiFormGroup hide-border>
              <UiInput label="Number" placeholder="Number" row />
              <UiInput label="Notary" placeholder="Notary full name" row />
            </UiFormGroup>
            <UiFormGroup hide-border>
              <UiSelect label="Notary Office Location" placeholder="Select" :options="[]" row />
              <UiFileUpload name="file" label="File" placeholder="Upload file" />
              <div class="flex justify-end items-center">
                <UiButton variant="primary">
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
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <!-- ratification by kemkumham -->
      <div class="card">
        <div class="card-header">
          <div class="w-full flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-slate-800">Ratification by Kemkumham</h3>
              <p class="text-red-500 text-xs">Specifically for companies with PT legal entity status</p>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-20 mb-8">
            <UiFormGroup hide-border>
              <UiInput label="Number" placeholder="Number" row />
              <UiFileUpload name="file" label="File" placeholder="Upload file" />
            </UiFormGroup>
            <UiFormGroup hide-border>
              <UiSelect label="Letter Date" placeholder="Select" :options="[]" row />
              <div class="flex justify-end items-center">
                <UiButton variant="primary">
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
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
