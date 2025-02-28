<template>
  <div class="flex flex-col gap-[24px] mb-[24px]">
    <UiFormGroup title="Kategori Perusahaan" :grid="4">
      <UiSelect
        v-model="documentAndLegal.bagian"
        label="Bagian"
        placeholder="Pilih"
        :options="partOfOptions"
        text-key="label"
      />
    </UiFormGroup>

    <div class="card min-w-full">
      <div class="card-table">
        <table class="table table-border align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th>Izin Usaha</th>
              <th class="w-56">No Izin Usaha</th>
              <th class="w-56">Berlaku (Tanggal Mulai)</th>
              <th class="w-56">Berlaku (Tanggal Selesai)</th>
              <th class="w-56">Dokumen</th>
              <th class="w-10">Action</th>
            </tr>
          </thead>

          <tbody v-if="documentAndLegal.bagian">
            <tr v-for="item in tableItems" :key="item.field">
              <td class="text-center">{{ item.value }}</td>
              <td class="align-top">
                <UiInput v-model="documentAndLegal.fields[item.field].noIzin" />
                <span v-if="item.field === 'nib'" class="text-danger text-[10px]"
                  >*Jika no NIB berlaku selamanya silahkan isi tanggal selesai 01/01/9999</span
                >
                <span v-if="item.field === 'npwp'" class="text-danger text-[10px]"
                  >*Batas upload NPWP sebanyak 3 kali</span
                >
                <button
                  v-if="['spfp', 'paktaIntegritas'].includes(item.field)"
                  class="btn btn-link text-primary text-xs"
                >
                  Download template disini
                </button>
              </td>
              <td class="align-top">
                <UiInput v-model="documentAndLegal.fields[item.field].tanggalMulai" />
              </td>
              <td class="align-top">
                <UiInput v-model="documentAndLegal.fields[item.field].tanggalSelesai" />
              </td>
              <td class="align-top">
                <UiFileUpload
                  :name="item.field"
                  :text-length="18"
                  :max-size="16000000"
                  accepted-files=".jpg,.jpeg.,.png,.pdf,application/zip"
                  class="w-56"
                  @addedFile="(file) => uploadFile(file)"
                />
                <span class="text-danger text-[10px]">*jpg, jpeg, png, pdf, zip / max : 16 MB</span>
              </td>
              <td>
                <UiButton icon outline>
                  <i class="ki-filled ki-exit-up"></i>
                </UiButton>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td class="text-center">No Data</td>
              <td class="text-center">No Data</td>
              <td class="text-center">No Data</td>
              <td class="text-center">No Data</td>
              <td class="text-center">No Data</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card bg-primary-light border border-primary">
      <div class="card-body p-4 flex flex-row items-center gap-4 text-primary">
        <UiIcon variant="duotone" name="information" class="text-4xl" />

        <ul class="list-disc list-inside font-medium text-sm">
          <li>Pastikan anda klik tombol upload setelah pilih dokumen</li>
          <li>Dokumen berbintang wajib diisi</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const registrationVendorStore = useRegistrationVendorStore()

const documentAndLegal = computed(() => registrationVendorStore.documentAndLegal)
const partOfOptions = ref([
  { value: 'pkp', label: 'PKP' },
  { value: 'non-pkp', label: 'Non PKP' },
  { value: 'khusus', label: 'Khusus' },
])
const tableItems = computed(() => {
  const selectedPartOf = documentAndLegal.value.bagian
  let items = [{ value: 'NPWP', field: 'npwp' }]

  if (selectedPartOf === 'pkp' || selectedPartOf === 'non-pkp') {
    items.splice(0, 0, { value: 'NIB', field: 'nib' })
    items.push({ value: 'Pakta Integritas', field: 'paktaIntegritas' })
  }

  if (selectedPartOf === 'pkp') {
    items.splice(2, 0, { value: 'SPPKP', field: 'sppkp' }, { value: 'SPFP', field: 'spfp' })
  }

  if (selectedPartOf === 'non-pkp') {
    items.splice(2, 0, { value: 'Surat Pernyataan Non PKP', field: 'suratNonPkp' })
  }

  return items
})

const uploadFile = async (file: Blob) => {
  try {
    console.log('file', file)
  } catch (error) {
    console.error(error)
  }
}
</script>
