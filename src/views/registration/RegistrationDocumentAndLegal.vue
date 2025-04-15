<template>
  <div class="flex flex-col gap-[24px] mb-[24px]">
    <UiFormGroup title="Kategori Perusahaan" :grid="4">
      <UiSelect
        v-model="documentAndLegal.kategori"
        label="Kategori"
        placeholder="Pilih"
        :options="companyCategoryList"
        text-key="companyCategoryName"
        value-key="companyCategoryId"
      />
    </UiFormGroup>

    <div class="card min-w-full">
      <div class="card-table">
        <table class="table table-border align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th>{{ selectedCategory === 4 ? 'Business Permit' : 'Izin Usaha' }}</th>
              <th class="w-56">
                {{
                  selectedCategory === 4
                    ? 'License No. / Description'
                    : 'No Izin Usaha / Keterangan'
                }}
              </th>
              <th class="w-56">
                {{ selectedCategory === 4 ? 'Valid (Start Date)' : 'Berlaku (Tanggal Mulai)' }}
              </th>
              <th class="w-56">
                {{
                  selectedCategory === 4 ? 'Valid (Completion Date)' : 'Berlaku (Tanggal Selesai)'
                }}
              </th>
              <th class="w-56">{{ selectedCategory === 4 ? 'Document' : 'Dokumen' }}</th>
              <th class="w-10">Action</th>
            </tr>
          </thead>

          <tbody v-if="documentAndLegal.kategori">
            <tr v-for="(item, index) in tableItems" :key="item.id">
              <td>
                {{ item.licenseName }}
                <span v-if="checkIsRequired(item.licenseId)" class="text-danger">*</span>
              </td>
              <td class="align-top">
                <UiInput
                  v-model="documentAndLegal.fields[index].licenseNo"
                  :error="documentAndLegal.fields[index]?.licenseNoError"
                />
                <span v-if="item.licenseId === 17" class="text-danger text-[10px]"
                  >*Jika no NIB berlaku selamanya silahkan isi tanggal selesai 01/01/9999</span
                >
                <span v-if="item.licenseId === 12" class="text-danger text-[10px]"
                  >*Batas upload NPWP sebanyak 3 kali</span
                >
              </td>
              <td class="align-top">
                <DatePicker
                  v-model="documentAndLegal.fields[index].issuedDate"
                  format="dd/MM/yyyy"
                  :error="documentAndLegal.fields[index]?.issuedDateError"
                />
              </td>
              <td class="align-top">
                <DatePicker
                  v-model="documentAndLegal.fields[index].expiredDate"
                  format="dd/MM/yyyy"
                  :error="documentAndLegal.fields[index]?.expiredDateError"
                />
              </td>
              <td class="align-top">
                <UiFileUpload
                  :name="item.licenseName"
                  :text-length="18"
                  :max-size="16000000"
                  accepted-files=".jpg,.jpeg.,.png,.pdf,application/zip"
                  class="w-56"
                  :error="documentAndLegal.fields[index]?.uploadUrlError"
                  @addedFile="(file) => uploadFile(file, index, 'default')"
                />
                <span class="text-danger text-[10px]">*jpg, jpeg, png, pdf, zip / max : 16 MB</span>
              </td>
              <td>
                <div
                  v-if="fileList?.[index]?.status === 'loading'"
                  class="rounded-full border-2 size-8 border-primary border-t-primary-light animate-spin text-xs"
                ></div>
                <UiIcon
                  v-else-if="fileList?.[index]?.status === 'success'"
                  name="check-circle"
                  variant="filled"
                  class="text-success text-4xl"
                />
                <UiButton v-else icon outline @click="addFile(index, 'default')">
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

    <div v-if="documentAndLegal.kategori" class="flex flex-col gap-[24px]">
      <hr class="border-gray-300" />

      <div class="flex flex-row items-center gap-2">
        <h2 class="font-semibold leading-[25px]">
          {{ selectedCategory === 4 ? 'Other Document' : 'Dokumen Lainnya' }}
        </h2>
        <div class="relative">
          <UiIcon name="information-1" variant="outline" class="text-primary text-xl peer" />
          <div
            class="tooltip absolute bg-primary font-medium w-44 p-3 left-1/2 -translate-x-1/2 -top-14 text-[13px] text-center text-white peer-hover:block"
          >
            {{
              selectedCategory === 4 ? 'Maximum add 5 documents' : 'Maksimal menambahkan 5 dokumen'
            }}
          </div>
        </div>
      </div>

      <UiButton
        icon
        outline
        class="w-fit px-4 py-2 flex flex-row gap-2 items-center"
        @click="addAnotherDocument"
      >
        <i class="ki-filled ki-plus-circle"></i> Add Document
      </UiButton>

      <div class="card min-w-full">
        <div class="card-table">
          <table class="table table-border align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th>{{ selectedCategory === 4 ? 'Document Name' : 'Nama Dokumen' }}</th>
                <th class="w-56">
                  {{
                    selectedCategory === 4
                      ? 'License No. / Description'
                      : 'No Izin Usaha / Keterangan'
                  }}
                </th>
                <th class="w-56">
                  {{ selectedCategory === 4 ? 'Valid (Start Date)' : 'Berlaku (Tanggal Mulai)' }}
                </th>
                <th class="w-56">
                  {{
                    selectedCategory === 4 ? 'Valid (Completion Date)' : 'Berlaku (Tanggal Selesai)'
                  }}
                </th>
                <th class="w-56">{{ selectedCategory === 4 ? 'Document' : 'Dokumen' }}</th>
                <th class="w-10">Action</th>
              </tr>
            </thead>

            <tbody v-if="documentAndLegal.kategori">
              <tr v-for="(document, index) in documentAndLegal.anotherDocuments" :key="index">
                <td>{{ selectedCategory === 4 ? 'Other Document' : 'Dokumen Lainnya' }}</td>
                <td class="align-top">
                  <UiInput v-model="documentAndLegal.anotherDocuments[index].licenseNo" />
                </td>
                <td class="align-top">
                  <DatePicker
                    v-model="documentAndLegal.anotherDocuments[index].issuedDate"
                    format="dd/MM/yyyy"
                  />
                </td>
                <td class="align-top">
                  <DatePicker
                    v-model="documentAndLegal.anotherDocuments[index].expiredDate"
                    format="dd/MM/yyyy"
                  />
                </td>
                <td class="align-top">
                  <UiFileUpload
                    :name="`${index}`"
                    :text-length="18"
                    :max-size="16000000"
                    accepted-files=".jpg,.jpeg.,.png,.pdf,application/zip"
                    class="w-56"
                    @addedFile="(file) => uploadFile(file, index, 'other doc')"
                  />
                  <span class="text-danger text-[10px]"
                    >*jpg, jpeg, png, pdf, zip / max : 16 MB</span
                  >
                </td>
                <td>
                  <div
                    v-if="fileOtherDocumentList?.[index]?.status === 'loading'"
                    class="rounded-full border-2 size-8 border-primary border-t-primary-light animate-spin text-xs"
                  ></div>
                  <UiIcon
                    v-else-if="fileOtherDocumentList?.[index]?.status === 'success'"
                    name="check-circle"
                    variant="filled"
                    class="text-success text-4xl"
                  />
                  <UiButton v-else icon outline @click="addFile(index, 'other doc')">
                    <i class="ki-filled ki-exit-up"></i>
                  </UiButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
type ListDocumentType = {
  file: File
  status: 'notUpload' | 'loading' | 'success'
}

import { computed, onMounted, ref, watch } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()

const documentAndLegal = computed(() => registrationVendorStore.documentAndLegal)
const companyCategoryList = computed(() => vendorMasterDataStore.companyCategoryList)
const selectedCategory = ref<number>(registrationVendorStore.documentAndLegal.kategori)
const tableItems = computed(() => vendorMasterDataStore.companyLicense)

const fileList = ref<ListDocumentType[]>([])
const fileOtherDocumentList = ref<ListDocumentType[]>([])

const uploadFile = (file: File, index: number, type: 'default' | 'other doc') => {
  if (type === 'default') {
    fileList.value.splice(index, 1, {
      file,
      status: 'notUpload',
    })
  } else {
    fileOtherDocumentList.value.splice(index, 1, {
      file,
      status: 'notUpload',
    })
  }
}

const addFile = async (index: number, type: 'default' | 'other doc') => {
  try {
    if (type === 'default') {
      fileList.value[index].status = 'loading'

      const response = await vendorMasterDataStore.uploadFile({
        FormFile: fileList.value[index].file,
        Actioner: 'anonym',
        FolderName: 'registration',
        FileName: fileList.value[index].file.name,
      })

      registrationVendorStore.documentAndLegal.fields[index].uploadUrl = response.url
    } else {
      fileOtherDocumentList.value[index].status = 'loading'

      const response = await vendorMasterDataStore.uploadFile({
        FormFile: fileOtherDocumentList.value[index].file,
        Actioner: 'anonym',
        FolderName: 'registration',
        FileName: fileOtherDocumentList.value[index].file.name,
      })

      registrationVendorStore.documentAndLegal.anotherDocuments[index].uploadUrl = response.url
    }
  } catch (error) {
    console.error(error)
  } finally {
    if (type === 'default') {
      fileList.value[index].status = 'success'
    } else {
      fileOtherDocumentList.value[index].status = 'success'
    }
  }
}

const addAnotherDocument = () => {
  if (registrationVendorStore.documentAndLegal.anotherDocuments.length !== 5) {
    registrationVendorStore.documentAndLegal.anotherDocuments.push({
      licenseNo: '',
      issuedDate: '',
      expiredDate: '',
      uploadUrl: '',
    })
  }
}

const checkIsRequired = (licenseId: number) => {
  return (
    registrationVendorStore.requiredDocumentFields[selectedCategory.value]?.includes(licenseId) ??
    false
  )
}

onMounted(async () => {
  await vendorMasterDataStore.getVendorCompanyCategory()
})

watch(
  () => documentAndLegal.value.kategori,
  async () => {
    if (documentAndLegal.value.kategori !== 0) {
      await vendorMasterDataStore.getVendorCompanyLicense(documentAndLegal.value.kategori)

      selectedCategory.value = documentAndLegal.value.kategori
      registrationVendorStore.documentAndLegal.fields = tableItems.value.map((item) => ({
        licenseId: item.licenseId,
        licenseNo: '',
        issuedDate: '',
        expiredDate: '',
        uploadUrl: '',
        ...(registrationVendorStore.requiredDocumentFields[
          documentAndLegal.value.kategori
        ].includes(item.licenseId) && {
          licenseNoError: false,
          issuedDateError: false,
          expiredDateError: false,
          uploadUrlError: false,
        }),
      }))

      fileList.value = []
    }
  },
)
</script>
