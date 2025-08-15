<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { computed, inject, onMounted, ref, watch } from 'vue'
import {
  type ErrorExportPersonnelDataType,
  type PayloadExportPersonnelDataType,
} from './types/expertPersonnelData'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useRefStore } from '@/stores/vendor/reference'
import type { IReferenceList } from '@/stores/vendor/types/reference'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import RadioCustom from '@/components/ui/atoms/radio/RadioCustom.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { checkEmptyStatus } from '@/composables/validation'
import { useLoginStore } from '@/stores/views/login'
import { useRoute } from 'vue-router'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import UiLoading from '@/components/UiLoading.vue'
import { useExpertPersonnelDataStore } from '@/stores/vendor/vendor'
import { cloneDeep } from 'lodash'
import { defaultPayload, defaultPayloadError } from './static'

const props = defineProps<{ id: number }>()
const emit = defineEmits(['onSuccess', 'onError', 'onClose'])
const mode = inject<'add' | 'view' | 'edit'>('mode')

const route = useRoute()

const lookupStore = useVendorMasterDataStore()
const refStore = useRefStore()
const userStore = useLoginStore()
const uploadStore = useVendorUploadStore()
const expertStore = useExpertPersonnelDataStore()

const cvTableCols = ['', 'Start', 'until', 'file', 'description']

const genderOptions = [
  { text: 'Male', value: 'male' },
  { text: 'Female', value: 'female' },
]

const tab = ref({
  active: 'personal_information',
  items: [
    { label: 'Personal Information', value: 'personal_information', icon: 'user' },
    { label: 'CV Details', value: 'cv_details', icon: 'document' },
  ],
})

const nationalityOptions = computed(() =>
  lookupStore.countryList.map((item) => ({
    ...item,
    value: item.countryID,
    text: item.countryName,
  })),
)

const employmentOptions = ref<IReferenceList[]>([])
const educationOptions = ref<IReferenceList[]>([])
const certificateType = ref<IReferenceList[]>([])

const uploadLoading = ref<boolean>(false)
const submitLoading = ref<boolean>(false)

const payload = ref<PayloadExportPersonnelDataType>(cloneDeep(defaultPayload))
const payloadError = ref<ErrorExportPersonnelDataType>(cloneDeep(defaultPayloadError))

const closeModal = () => {
  payload.value = cloneDeep(defaultPayload)
  payloadError.value = cloneDeep(defaultPayloadError)
  tab.value.active = 'personal_information'
  emit('onClose')
}

const nextStep = () => {
  payload.value.vendorID = Number(route.params.id)
  payload.value.user = userStore.userData?.profile.employeeName as string

  const exludedPayload = [
    'isActive',
    'isTemporary',
    'refVendorID',
    'action',
    'email',
    'yearOfExperience',
    'id',
    'certificates',
  ]

  payloadError.value = checkEmptyStatus(payload.value) as ErrorExportPersonnelDataType

  const filteredError = Object.fromEntries(
    Object.entries(payloadError.value).filter(([key]) => !exludedPayload.includes(key)),
  )
  const hasError = Object.values(filteredError).some((item) => item === true)

  if (!hasError) {
    tab.value.active = 'cv_details'
  }
}

const addCertificate = (code: number) => {
  payload.value.certificates.push({
    id: 0,
    description: '',
    docUrl: '',
    endDate: '',
    isActive: true,
    startDate: '',
    type: code,
    vendorExpertId: 0,
  })
}

const onDownload = async (path: string) => {
  try {
    const file = await uploadStore.preview(path)
    const link = URL.createObjectURL(file)
    window.open(link, '_blank')
    setTimeout(() => URL.revokeObjectURL(link), 1000)
  } catch (err) {
    if (err instanceof Error) {
      alert('Failed to download document. Please try again later.')
    }
  }
}

const removeCertificate = (index: number, code: number) => {
  // get datanya dan hapus target
  const targetCertificate = payload.value.certificates.filter((c) => c.type === code)
  targetCertificate.splice(index, 1)

  // hapus dulu certificate dengan code yang dikirim
  payload.value.certificates = payload.value.certificates.filter((c) => c.type !== code)
  payload.value.certificates = [...payload.value.certificates, ...targetCertificate]
}

const uploadFile = async (file: File, index: number, code: number) => {
  if (!file) return
  const formDataFile = new FormData()
  formDataFile.append('FormFile', file)
  formDataFile.append('Actioner', userStore.userData?.profile.profileId.toString() || '0')

  try {
    uploadLoading.value = true
    const response = await uploadStore.upload(formDataFile)

    // target certificate
    const targetCertificate = payload.value.certificates.filter((c) => c.type === code)

    // update value docUrl target dengan index yang dikirim
    targetCertificate[index].docUrl = response?.path as string

    // hapus dulu certificate
    payload.value.certificates = payload.value.certificates.filter((c) => c.type !== code)

    // assign payload dengan data terbaru
    payload.value.certificates = [...payload.value.certificates, ...targetCertificate]
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      alert('File upload failed. Please try again.')
    }
  } finally {
    uploadLoading.value = false
  }
}

const getEmployeeStatus = () => {
  refStore.getReference('EMPLOYMENT_STATUS').then((response) => {
    if (!response.result.isError) employmentOptions.value = response.result.content
  })
}

const getEducation = () => {
  refStore.getReference('EDUCATION_TYPE').then((response) => {
    if (!response.result.isError) educationOptions.value = response.result.content
  })
}

const getCert = () => {
  refStore.getReference('EXPERTS_CERT_TYPE').then((response) => {
    if (!response.result.isError) certificateType.value = response.result.content
  })
}

const calculateYOE = () => {
  const expArray = payload.value.certificates.filter((c) => c.type === 3128)
  let start = ''
  let end = ''
  let yearsOfExperience = 0
  if (expArray.length > 0) {
    // Filter out empty or invalid dates
    const startDates = expArray
      .map((c) => c.startDate)
      .filter(Boolean)
      .map((d) => new Date(d))
    const endDates = expArray
      .map((c) => c.endDate)
      .filter(Boolean)
      .map((d) => new Date(d))

    if (startDates.length > 0) {
      start = new Date(Math.min(...startDates.map((d) => d.getTime()))).toISOString()
    }

    if (endDates.length > 0) {
      end = new Date(Math.max(...endDates.map((d) => d.getTime()))).toISOString()
    }

    if (start && end) {
      const startDateObj = new Date(start)
      const endDateObj = new Date(end)
      const diff = endDateObj.getTime() - startDateObj.getTime()
      yearsOfExperience = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
      payload.value.yearOfExperience = yearsOfExperience
    }
  }
}

const onSubmit = async () => {
  calculateYOE()
  submitLoading.value = true

  try {
    await expertStore.update(payload.value)

    emit('onSuccess')
    await expertStore.getData(Number(route.params.id))
  } catch (error) {
    if (error instanceof Error) {
      emit('onError')
    }
  } finally {
    submitLoading.value = false
    closeModal()
  }
}

watch(
  () => props.id,
  async (newId) => {
    const selectedItem = expertStore.data.find((data) => data.id === newId)

    if (selectedItem) {
      const certificates = await expertStore.getCertificates(selectedItem.id)
      payload.value = {
        ...payload.value,
        name: selectedItem.name,
        address: selectedItem.address,
        dateOfBirth: selectedItem.dateOfBirth,
        education: selectedItem.education,
        expertise: selectedItem.expertise,
        gender: selectedItem.gender.toLocaleLowerCase(),
        id: selectedItem.id,
        nationality: selectedItem.nationality,
        position: selectedItem.position,
        status: selectedItem.status,
        certificates: !certificates.result.isError
          ? certificates?.result?.content?.map((certi) => ({
              vendorExpertId: certi.vendorExpertsID,
              description: certi.description,
              docUrl: certi.docUrl,
              endDate: certi.endDate,
              id: certi.id,
              isActive: certi.isActive,
              startDate: certi.startDate,
              type: certi.type,
            }))
          : [],
      }
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

onMounted(() => {
  lookupStore.getVendorCountries()
  getEmployeeStatus()
  getEducation()
  getCert()
})
</script>

<template>
  <div
    class="modal"
    data-modal="true"
    data-modal-backdrop-static="true"
    id="modal-expert-personnel"
  >
    <div
      class="modal-content modal-center-y"
      :class="tab.active === 'personal_information' ? 'max-w-4xl' : 'max-w-7xl'"
    >
      <div class="modal-header">
        <h3 class="modal-title text-lg">Experience Data</h3>
      </div>

      <div class="modal-body !py-5 flex flex-col items-center gap-4">
        <div class="tabs">
          <div
            v-for="item in tab.items"
            :key="item.value"
            class="tab"
            :class="item.value === tab.active ? 'active' : ''"
          >
            <div
              class="size-5 rounded-full flex items-center justify-center"
              :class="item.value === tab.active ? 'bg-primary' : 'bg-gray-600'"
            >
              <UiIcon
                :name="item.icon"
                variant="solid"
                class="!text-xs"
                :class="item.value === tab.active ? '!text-white' : '!text-primary-light'"
              />
            </div>
            {{ item.label }}
          </div>
        </div>

        <div v-if="tab.active === 'personal_information'" class="grid grid-cols-2 gap-4 w-full">
          <UiInput
            v-model="payload.name"
            label="Contract Name"
            placeholder="Contract Name"
            required
            :error="payloadError.name"
            :hint-text="payloadError.name ? 'Name Required' : ''"
            :readonly="mode === 'view'"
          />
          <div>
            <DatePicker
              v-model="payload.dateOfBirth"
              placeholder="Select"
              format="dd MM yyyy"
              label="Date of Birth"
              required
              label-top
              :error="payloadError.dateOfBirth"
              @update:model-value="
                payload.dateOfBirth = $event ? new Date($event).toISOString() : ''
              "
              :disabled="mode === 'view'"
              :max-date="new Date(new Date().setFullYear(new Date().getFullYear() - 17))"
            />
            <span class="form-hint !text-danger">
              {{ payloadError.dateOfBirth ? 'date of birth Required' : '' }}
            </span>
          </div>
          <div>
            <RadioCustom
              v-model="payload.gender"
              label="Gender"
              name="gender"
              :options="genderOptions"
              inline
              size="sm"
              required
              :error="payloadError.gender"
              :disabled="mode === 'view'"
            />
            <span class="form-hint !text-danger">
              {{ payloadError.gender ? 'gender Required' : '' }}
            </span>
          </div>
          <UiInput
            v-model="payload.address"
            label="Address"
            placeholder="Address"
            required
            :error="payloadError.address"
            :hint-text="payloadError.address ? 'address Required' : ''"
            :readonly="mode === 'view'"
          />
          <UiSelect
            v-model="payload.education"
            label="Highest Education Level"
            placeholder="--Highest Education Level * --"
            :options="educationOptions"
            text-key="value"
            value-key="value"
            required
            :error="payloadError.education"
            :hint-text="payloadError.education ? 'education Required' : ''"
            :disabled="mode === 'view'"
          />
          <UiSelect
            v-model="payload.nationality"
            label="Nationality"
            placeholder="--Nationality--"
            :options="nationalityOptions"
            text-key="text"
            value-key="value"
            required
            :error="payloadError.nationality"
            :hint-text="payloadError.nationality ? 'nationality Required' : ''"
            :disabled="mode === 'view'"
          />
          <UiInput
            v-model="payload.position"
            label="Position / Role"
            placeholder="Position / Role"
            required
            :error="payloadError.position"
            :hint-text="payloadError.position ? 'position Required' : ''"
            :readonly="mode === 'view'"
          />
          <div>
            <RadioCustom
              v-model="payload.status"
              label="Employment Status"
              name="employment status"
              :options="employmentOptions"
              inline
              size="sm"
              required
              :error="payloadError.status"
              text-key="value"
              value-key="code"
              @update:model-value="payload.status = Number($event)"
            />
            <span class="form-hint !text-danger">
              {{ payloadError.status ? 'Employment status Required' : '' }}
            </span>
          </div>
          <UiInput
            v-model="payload.expertise"
            label="Expertise / Skills"
            placeholder="Elaborate Expertise / Skills"
            required
            class="col-span-2"
            :error="payloadError.expertise"
            :hint-text="payloadError.expertise ? 'expertise Required' : ''"
            :readonly="mode === 'view'"
          />
        </div>

        <div v-if="tab.active === 'cv_details'" class="space-y-4 w-full">
          <!-- years of experience -->
          <div class="card" v-for="certificate in certificateType" :key="certificate.code">
            <div class="card-header">
              <div class="card-title">{{ certificate.value }}</div>
              <UiButton @click="addCertificate(Number(certificate.code))" v-if="mode !== 'view'">
                <UiIcon name="plus-circle" variant="duotone" />
                <span>Add</span>
              </UiButton>
            </div>
            <div class="card-table scrollable-x-auto">
              <table class="table align-top">
                <thead>
                  <tr>
                    <th class="capitalize" v-for="col in cvTableCols" :key="col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(subCertificate, index) in payload.certificates.filter(
                      (c) => c.type === Number(certificate.code),
                    )"
                    :key="`sub-${index}`"
                    :id="'sub' + index"
                  >
                    <td>
                      <UiButton
                        v-if="mode !== 'view'"
                        icon
                        variant="danger"
                        outline
                        @click="removeCertificate(index, subCertificate.type)"
                      >
                        <UiIcon name="cross-circle" variant="duotone" />
                      </UiButton>
                    </td>
                    <td>
                      <DatePicker
                        v-model="subCertificate.startDate"
                        teleport
                        @update:model-value="
                          $event ? (subCertificate.startDate = new Date($event).toISOString()) : ''
                        "
                        :disabled="mode === 'view'"
                        :max-date="new Date()"
                      />
                    </td>
                    <td>
                      <DatePicker
                        v-model="subCertificate.endDate"
                        teleport
                        @update:model-value="
                          $event ? (subCertificate.endDate = new Date($event).toISOString()) : ''
                        "
                        :disabled="mode === 'view'"
                      />
                    </td>
                    <td>
                      <UiButton
                        outline
                        v-if="mode === 'view'"
                        @click="onDownload(subCertificate.docUrl)"
                      >
                        <UiIcon name="cloud-download" variant="duotone" />
                        Download
                      </UiButton>
                      <UiFileUpload
                        v-else
                        placeholder="Upload file"
                        :name="`docUrl${index}${subCertificate.type}`"
                        accepted-files=".jpg,.jpeg,.png,.pdf"
                        @added-file="uploadFile($event, index, subCertificate.type)"
                        @upload-failed="console.log('gagal')"
                        :disabled="uploadLoading"
                        hint-text="*jpg, jpeg, png, pdf, zip / max : 16 MB"
                        :max-size="16000000"
                      />
                    </td>
                    <td>
                      <UiInput
                        placeholder="Description"
                        v-model="subCertificate.description"
                        :readonly="mode === 'view'"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          v-if="tab.active === 'personal_information'"
          class="flex flex-row justify-end items-center gap-4 w-full"
        >
          <UiButton variant="primary" outline data-modal-dismiss="true" @click="closeModal">
            <UiIcon name="black-left" variant="filled" />
            Cancel
          </UiButton>
          <UiButton variant="primary" @click="nextStep">
            Next
            <UiIcon name="black-right" variant="duotone" />
          </UiButton>
        </div>
        <div v-else class="flex flex-row justify-end items-center gap-4 w-full">
          <UiButton variant="primary" outline @click="tab.active = 'personal_information'">
            <UiIcon name="black-left" variant="filled" />
            Back
          </UiButton>

          <UiButton
            variant="primary"
            @click="onSubmit"
            :disabled="submitLoading"
            v-if="mode !== 'view'"
          >
            <UiLoading v-if="submitLoading" variant="white" />
            <UiIcon v-else name="file-added" variant="duotone" />
            Save
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
