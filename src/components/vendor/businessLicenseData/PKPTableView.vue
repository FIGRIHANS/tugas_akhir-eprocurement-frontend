<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const startDate = ref<string | Date | null>(null)
const endDate = ref<string | Date | null>(null)
</script>

<template>
  <div class="my-6">
    <h2 class="text-lg font-semibold text-slate-700">Business License Data - PKP</h2>

    <div class="mt-6">
      <table class="table align-middle border">
        <thead>
          <tr>
            <th class="text-nowrap">Business License</th>
            <th class="text-nowrap">License Number / Description</th>
            <th class="text-nowrap">Valid From (Start Date)</th>
            <th class="text-nowrap">Valid Until (End Date)</th>
            <th class="text-nowrap">Document</th>
            <th class="text-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>NIB</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="nibDocument"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>NPWP</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="npwpDocument"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>SPPKP</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="sppkpDocument"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>SIUP/SBU</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="siupSbuDocument"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>SIUJK</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="siujkDocument"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>Lapor SPT</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="sptDocument"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>Company Profile</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="companyProfileDocument"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>Authorized Distributor Center</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="authorizedDistributorDocument"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>Front Photo of Company</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="frontCompanyPhoto"
                accepted-files=".jpg,.jpeg,.png"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td>Back Photo of Company</td>
            <td>
              <UiInput placeholder="License Number / Description" />
            </td>
            <td>
              <DatePicker v-model="startDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <DatePicker v-model="endDate" format="dd MM yyyy" placeholder="Pilih Tanggal" />
            </td>
            <td>
              <UiFileUpload
                name="backCompanyPhoto"
                accepted-files=".jpg,.jpeg,.png"
                placeholder="Upload file"
              />
            </td>
            <td>
              <UiButton outline>
                <UiIcon variant="duotone" name="pencil"></UiIcon>
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
