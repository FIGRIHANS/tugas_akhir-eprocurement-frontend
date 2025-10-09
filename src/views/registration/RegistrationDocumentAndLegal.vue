<template>
  <div class="flex flex-col gap-[24px] mb-[24px]">
    <UiFormGroup :title="$t('registration.companyCategory')" :grid="4">
      <UiSelect
        v-model="documentAndLegal.kategori"
        :label="$t('registration.category')"
        :placeholder="$t('registration.select')"
        :options="translatedCompanyCategoryList"
        text-key="companyCategoryName"
        value-key="companyCategoryId"
      />
    </UiFormGroup>

    <div class="card min-w-full">
      <div class="card-table">
        <table class="table table-border align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th class="w-32">{{ $t('registration.businessLicense') }}</th>
              <th>{{ $t('registration.licenseNo') }}</th>
              <th>{{ $t('registration.validStart') }}</th>
              <th>{{ $t('registration.validEnd') }}</th>
              <th>{{ $t('registration.document') }}</th>
              <th>{{ $t('general.action') }}</th>
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
                  :max-length="[12, 27].includes(item.licenseId) ? 16 : 9999"
                />
                <span v-if="item.licenseId === 12" class="text-danger text-[10px]"
                  >*{{ $t('registration.hintTaxNumber') }}</span
                >
                <span v-else-if="item.licenseId === 27" class="text-danger text-[10px]"
                  >*{{ $t('registration.hintIdCard') }}</span
                >
              </td>
              <td class="align-top">
                <DatePicker
                  v-model="documentAndLegal.fields[index].issuedDate"
                  format="dd MM yyyy"
                  :error="documentAndLegal.fields[index]?.issuedDateError"
                  class="!w-48"
                />
              </td>
              <td class="align-top">
                <DatePicker
                  v-model="documentAndLegal.fields[index].expiredDate"
                  format="dd MM yyyy"
                  :error="documentAndLegal.fields[index]?.expiredDateError"
                  class="!w-48"
                  :disabled="documentAndLegal.fields[index]?.issuedDate ? false : true"
                  :min-date="documentAndLegal.fields[index]?.issuedDate"
                />
              </td>
              <td class="align-top">
                <UiFileUpload
                  :name="item.licenseName"
                  :text-length="15"
                  :max-size="16000000"
                  :placeholder="
                    fileList[index].file.name === 'placeholder.txt' ? '' : fileList[index].file.name
                  "
                  accepted-files=".jpg,.jpeg.,.png,.pdf,application/zip"
                  class="w-48"
                  :error="documentAndLegal.fields[index]?.uploadUrlError"
                  @addedFile="(file) => uploadFile(file, index, 'default')"
                  @upload-failed="(val) => (modalUploadFailed = val)"
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
              <td class="text-center">{{ $t('general.noData') }}</td>
              <td class="text-center">{{ $t('general.noData') }}</td>
              <td class="text-center">{{ $t('general.noData') }}</td>
              <td class="text-center">{{ $t('general.noData') }}</td>
              <td class="text-center">{{ $t('general.noData') }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="documentAndLegal.kategori" class="flex flex-col gap-[24px]">
      <hr class="border-gray-300" />

      <div class="flex flex-row items-center gap-2">
        <h2 class="font-semibold leading-[25px]">{{ $t('registration.otherDocument') }}</h2>
        <div class="relative">
          <UiIcon name="information-1" variant="outline" class="text-primary text-xl peer" />
          <div
            class="tooltip absolute bg-primary font-medium w-44 p-3 left-1/2 -translate-x-1/2 -top-14 text-[13px] text-center text-white peer-hover:block"
          >
            {{ $t('registration.hintOtherDocument') }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <UiButton
          icon
          outline
          class="w-fit px-4 py-2 flex flex-row gap-2 items-center"
          @click="addAnotherDocument"
        >
          <i class="ki-filled ki-plus-circle"></i>
          {{ $t('general.add', { field: $t('registration.document') }) }}
        </UiButton>
        <span class="text-danger text-xs">{{ $t('registration.hintAddDocument') }}</span>
      </div>

      <div class="card min-w-full">
        <div class="card-table">
          <table class="table table-border align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th class="w-32">{{ $t('registration.businessLicense') }}</th>
                <th>{{ $t('registration.licenseNo') }}</th>
                <th>{{ $t('registration.validStart') }}</th>
                <th>{{ $t('registration.validEnd') }}</th>
                <th>{{ $t('registration.document') }}</th>
                <th>{{ $t('general.action') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(_, index) in documentAndLegal.anotherDocuments" :key="index">
                <td class="align-top">
                  <UiInput v-model="documentAndLegal.anotherDocuments[index].documentName" />
                </td>
                <td class="align-top">
                  <UiInput v-model="documentAndLegal.anotherDocuments[index].documentNo" />
                </td>
                <td class="align-top">
                  <DatePicker
                    v-model="documentAndLegal.anotherDocuments[index].issuedDate"
                    format="dd MM yyyy"
                    class="!w-48"
                  />
                </td>
                <td class="align-top">
                  <DatePicker
                    v-model="documentAndLegal.anotherDocuments[index].expiredDate"
                    format="dd MM yyyy"
                    class="!w-48"
                    :disabled="documentAndLegal.anotherDocuments[index]?.issuedDate ? false : true"
                    :min-date="documentAndLegal.anotherDocuments[index]?.issuedDate"
                  />
                </td>
                <td class="align-top">
                  <UiFileUpload
                    :name="`${index}`"
                    :text-length="15"
                    :max-size="16000000"
                    :placeholder="
                      fileOtherDocumentList[index]?.file.name === 'placeholder.txt'
                        ? ''
                        : fileOtherDocumentList[index]?.file.name
                    "
                    accepted-files=".jpg,.jpeg.,.png,.pdf,application/zip"
                    class="w-48"
                    @addedFile="(file) => uploadFile(file, index, 'other doc')"
                    @upload-failed="(val) => (modalUploadFailed = val)"
                  />
                  <span class="text-danger text-[10px]"
                    >*jpg, jpeg, png, pdf, zip / max : 16 MB</span
                  >
                </td>
                <td class="flex flex-row items-center gap-2">
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
                  <UiButton
                    v-if="!['loading', 'success'].includes(fileOtherDocumentList?.[index]?.status)"
                    icon
                    outline
                    @click="addFile(index, 'other doc')"
                  >
                    <i class="ki-filled ki-exit-up"></i>
                  </UiButton>
                  <UiButton
                    v-if="!['loading', 'success'].includes(fileOtherDocumentList?.[index]?.status)"
                    variant="danger"
                    icon
                    outline
                    @click="deleteFile(index)"
                  >
                    <i class="ki-filled ki-cross-circle"></i>
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
          <li>{{ $t('registration.docLegalFirstHint') }}</li>
          <li>{{ $t('registration.docLegalSecondHint') }}</li>
        </ul>
      </div>
    </div>
  </div>

  <ModalConfirmation
    :open="modalUploadFailed"
    id="doc-legal-upload-error"
    type="danger"
    :title="$t('general.uploadFile')"
    :text="$t('general.fileSizeExceed')"
    no-submit
    static
    :cancel="() => (modalUploadFailed = false)"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useUploadStore } from '@/stores/general/upload'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import tr from '@/composables/translator'

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()
const uploadStore = useUploadStore()

const documentAndLegal = computed(() => registrationVendorStore.documentAndLegal)
const companyCategoryList = computed(() => vendorMasterDataStore.companyCategoryList)
const translatedCompanyCategoryList = computed(() => {
  return companyCategoryList.value.map((item) => {
    return {
      ...item,
      companyCategoryName: tr(item.companyCategoryName),
    }
  })
})
const selectedCategory = ref<number>(registrationVendorStore.documentAndLegal.kategori)
const tableItems = computed(() => vendorMasterDataStore.companyLicense)

const fileList = computed(() => registrationVendorStore.fileList)
const fileOtherDocumentList = computed(() => registrationVendorStore.fileOtherDocumentList)
const modalUploadFailed = ref<boolean>(false)

const uploadFile = (file: File, index: number, type: 'default' | 'other doc') => {
  if (type === 'default') {
    registrationVendorStore.fileList.splice(index, 1, {
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

const deleteFile = (index: number) => {
  registrationVendorStore.documentAndLegal.anotherDocuments.splice(index, 1)
}

const addFile = async (index: number, type: 'default' | 'other doc') => {
  const typeDefault = type === 'default' && fileList.value[index]?.file.name !== 'placeholder.txt'
  const typeOther =
    type === 'other doc' && fileOtherDocumentList.value[index]?.file.name !== 'placeholder.txt'

  try {
    if (typeDefault) {
      registrationVendorStore.fileList[index].status = 'loading'

      const response = await uploadStore.uploadFile(fileList.value[index].file, 0)

      registrationVendorStore.documentAndLegal.fields[index].uploadUrl = response.path

      registrationVendorStore.fileList[index].status = 'success'
    } else if (typeOther) {
      registrationVendorStore.fileOtherDocumentList[index].status = 'loading'

      const response = await uploadStore.uploadFile(fileOtherDocumentList.value[index].file, 0)

      registrationVendorStore.documentAndLegal.anotherDocuments[index].uploadUrl = response.path

      registrationVendorStore.fileOtherDocumentList[index].status = 'success'
    }
  } catch (error) {
    console.error(error)
  }
}

const addAnotherDocument = () => {
  if (registrationVendorStore.documentAndLegal.anotherDocuments.length !== 5) {
    registrationVendorStore.documentAndLegal.anotherDocuments.push({
      documentName: '',
      documentNo: '',
      description: '',
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

onMounted(() => {
  vendorMasterDataStore.getVendorCompanyCategory()
})

watch(
  () => documentAndLegal.value.kategori,
  async () => {
    if (documentAndLegal.value.kategori !== 0) {
      await vendorMasterDataStore.getVendorCompanyLicense(documentAndLegal.value.kategori)

      registrationVendorStore.documentAndLegal.anotherDocuments = []

      selectedCategory.value = documentAndLegal.value.kategori
      registrationVendorStore.documentAndLegal.fields = tableItems.value.map((item) => ({
        licenseId: item.licenseId,
        licenseNo: '',
        description: '',
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

      registrationVendorStore.fileList = registrationVendorStore.documentAndLegal.fields.map(
        () => ({
          file: new File([''], 'placeholder.txt'),
          status: 'notUpload',
        }),
      )
    }
  },
)
</script>