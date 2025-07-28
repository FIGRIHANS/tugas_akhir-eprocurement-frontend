<script setup lang="ts">
import { type PropType, ref, computed } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { ILicense } from '@/stores/vendor/types/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'

const uploadStore = useVendorUploadStore()

const props = defineProps({
  licenses: {
    type: Array as PropType<ILicense[]>,
    default: () => [],
  },
})

const emit = defineEmits(['update:licenses'])

const editingLicenseId = ref<string | null>(null)

const localLicenses = computed({
  get: () => props.licenses,
  set: (newValue) => {
    emit('update:licenses', newValue)
  },
})

const updateLicense = (license: ILicense) => {
  console.log('Updating License: ', license)
  const index = localLicenses.value.findIndex((item) => item.licenseId === license.licenseId)
  if (index !== -1) {
    const updatedArray = [...localLicenses.value]
    updatedArray[index] = { ...license }
    emit('update:licenses', updatedArray)
  }
  editingLicenseId.value = null
}

const deleteLicense = (licenseId: string) => {
  console.log('Deleting License: ', licenseId)
  const updatedArray = localLicenses.value.filter((item) => String(item.licenseId) !== licenseId)
  emit('update:licenses', updatedArray)
  editingLicenseId.value = null
}

const startEditing = (licenseId: string) => {
  editingLicenseId.value = licenseId
}
</script>

<template>
  <div class="my-6">
    <div class="card">
      <div class="card-body">
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
              <!-- Use localLicenses for iteration -->
              <tr v-for="item in localLicenses" :key="item.licenseId">
                <td>{{ item?.licenseName }}</td>
                <td>
                  <UiInput
                    placeholder="License Number / Description"
                    v-model="item.licenseNo"
                    :disabled="editingLicenseId !== String(item.licenseId)"
                  />
                </td>
                <td>
                  <DatePicker
                    v-model="item.issuedUTCDate"
                    format="dd MM yyyy"
                    placeholder="Pilih Tanggal"
                    :disabled="editingLicenseId !== String(item.licenseId)"
                  />
                </td>
                <td>
                  <DatePicker
                    v-model="item.expiredUTCDate"
                    format="dd MM yyyy"
                    placeholder="Pilih Tanggal"
                    :disabled="editingLicenseId !== String(item.licenseId)"
                  />
                </td>
                <td>
                  <UiFileUpload
                    name="nibDocument"
                    accepted-files=".jpg,.jpeg,.png,.pdf"
                    v-model="item.documentUrl"
                    placeholder="Upload file"
                    :disabled="editingLicenseId !== String(item.licenseId)"
                  />
                </td>
                <td>
                  <template v-if="editingLicenseId === String(item.licenseId)">
                    <UiButton variant="primary" @click="updateLicense(item)" size="sm" class="me-2">
                      <UiIcon variant="duotone" name="check-circle"></UiIcon>
                    </UiButton>
                    <UiButton
                      variant="danger"
                      @click="deleteLicense(String(item.licenseId))"
                      size="sm"
                    >
                      <UiIcon variant="duotone" name="trash"></UiIcon>
                    </UiButton>
                  </template>
                  <template v-else>
                    <UiButton outline @click="startEditing(String(item.licenseId))" size="sm">
                      <UiIcon variant="duotone" name="pencil"></UiIcon>
                    </UiButton>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
