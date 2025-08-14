<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Expert Personnel Data</h3>

      <UiButton variant="primary" data-modal-toggle="#modal-expert-personnel">
        <UiIcon name="plus-circle" variant="duotone" />
        Add
      </UiButton>
    </div>

    <div class="card-table">
      <table class="table align-middle">
        <thead>
          <tr>
            <th class="w-[70px]"></th>
            <th>Name</th>
            <th>Highest Education Level</th>
            <th>Position / Role</th>
            <th>Years of Experience</th>
            <th>Expertise / Skills</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                  <UiIcon name="dots-vertical" />
                </button>

                <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                  <div class="menu menu-default flex flex-col w-full text-sm">
                    <div class="menu-item text-primary" @click="downloadFile">
                      <span class="menu-link">
                        <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                        Download
                      </span>
                    </div>
                    <div class="menu-item text-warning" @click="editData">
                      <span class="menu-link">
                        <UiIcon name="notepad-edit" variant="duotone" class="menu-icon" />
                        Edit
                      </span>
                    </div>
                    <div class="menu-item text-danger" @click="deleteData">
                      <span class="menu-link">
                        <UiIcon name="cross-circle" variant="duotone" class="menu-icon" />
                        Hapus
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>Luffy</td>
            <td>S1</td>
            <td>Manager</td>
            <td>1</td>
            <td>Time Management</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div
    class="modal"
    data-modal="true"
    data-modal-backdrop-static="true"
    id="modal-expert-personnel"
  >
    <div
      class="modal-content modal-center-y"
      :class="currentStep === 1 ? 'max-w-4xl' : 'max-w-7xl'"
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

        <div v-if="currentStep === 1" class="grid grid-cols-2 gap-4 w-full">
          <UiInput
            v-model="payload.contractName"
            label="Contract Name"
            placeholder="Contract Name"
            required
            :error="payloadError.contractName"
          />
          <DatePicker
            v-model="payload.dateOfBirth"
            placeholder="Select"
            format="dd MM yyyy"
            label="Date of Birth"
            required
            label-top
            :error="payloadError.dateOfBirth"
          />
          <RadioCustom
            v-model="payload.gender"
            label="Gender"
            name="gender"
            :options="genderOptions"
            inline
            size="sm"
            required
            :error="payloadError.gender"
          />
          <UiInput
            v-model="payload.address"
            label="Address"
            placeholder="Address"
            required
            :error="payloadError.address"
          />
          <UiSelect
            v-model="payload.highestEducationId"
            label="Highest Education Level"
            placeholder="--Highest Education Level * --"
            :options="options"
            required
            :error="payloadError.highestEducationId"
          />
          <UiSelect
            v-model="payload.nationalityId"
            label="Nationality"
            placeholder="--Nationality--"
            :options="options"
            required
            :error="payloadError.nationalityId"
          />
          <UiInput
            v-model="payload.position"
            label="Position / Role"
            placeholder="Position / Role"
            required
            :error="payloadError.position"
          />
          <RadioCustom
            v-model="payload.employmentStatusId"
            label="Employment Status"
            name="employment status"
            :options="employmentOptions"
            inline
            size="sm"
            required
            :error="payloadError.employmentStatusId"
          />
          <UiInput
            v-model="payload.skills"
            label="Expertise / Skills"
            placeholder="Elaborate Expertise / Skills"
            required
            class="col-span-2"
            :error="payloadError.skills"
          />
        </div>

        <div v-else class="flex flex-col gap-4 w-full">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Years of Experience</h3>

              <UiButton variant="primary" @click="addRow('experience')">
                <UiIcon name="plus-circle" variant="duotone" />
                Add
              </UiButton>
            </div>
            <div class="card-table">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>Start</th>
                    <th>Until</th>
                    <th>File</th>
                    <th>Job Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in yearsOfExperienceList" :key="index">
                    <td class="align-top">
                      <div class="flex flex-row items-center gap-4">
                        <UiButton
                          variant="primary"
                          @click="editModalTableData(index, 'certificate')"
                        >
                          <UiIcon
                            :name="item.isEdit ? 'check-circle' : 'notepad-edit'"
                            variant="duotone"
                          />
                        </UiButton>
                        <UiButton variant="danger" outline @click="deleteRow(index, 'certificate')">
                          <UiIcon name="cross-circle" variant="duotone" />
                        </UiButton>
                      </div>
                    </td>
                    <td class="align-top">
                      <DatePicker
                        v-model="yearsOfExperienceList[index].issuedDate"
                        format="dd MM yyyy"
                        @update:modelValue="changeFormatDate(index, 'experience', 'issued')"
                        :disabled="!item.isEdit"
                      />
                    </td>
                    <td class="align-top">
                      <DatePicker
                        v-model="yearsOfExperienceList[index].expiredDate"
                        format="dd MM yyyy"
                        @update:modelValue="changeFormatDate(index, 'experience', 'expired')"
                        :disabled="!item.isEdit"
                      />
                    </td>
                    <td class="align-top">
                      <UiFileUpload
                        :name="`${index}`"
                        :text-length="18"
                        :max-size="16000000"
                        accepted-files=".jpg,.jpeg.,.png,.pdf,application/zip"
                        @addedFile="(file: File) => uploadFile(file, index, 'experience')"
                        :disabled="!item.isEdit"
                      />
                      <span class="text-danger text-[10px]"
                        >*jpg, jpeg, png, pdf, zip / max : 16 MB</span
                      >
                    </td>
                    <td class="align-top">
                      <UiInput
                        v-model="yearsOfExperienceList[index].description"
                        placeholder="Job Description"
                        :disabled="!item.isEdit"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Education</h3>

              <UiButton variant="primary" @click="addRow('education')">
                <UiIcon name="plus-circle" variant="duotone" />
                Add
              </UiButton>
            </div>
            <div class="card-table">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>Start</th>
                    <th>Until</th>
                    <th>File</th>
                    <th>Job Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in educationList" :key="index">
                    <td class="align-top">
                      <div class="flex flex-row items-center gap-4">
                        <UiButton
                          variant="primary"
                          @click="editModalTableData(index, 'certificate')"
                        >
                          <UiIcon
                            :name="item.isEdit ? 'check-circle' : 'notepad-edit'"
                            variant="duotone"
                          />
                        </UiButton>
                        <UiButton variant="danger" outline @click="deleteRow(index, 'certificate')">
                          <UiIcon name="cross-circle" variant="duotone" />
                        </UiButton>
                      </div>
                    </td>
                    <td class="align-top">
                      <DatePicker
                        v-model="educationList[index].issuedDate"
                        format="dd MM yyyy"
                        @update:modelValue="changeFormatDate(index, 'education', 'issued')"
                        :disabled="!item.isEdit"
                      />
                    </td>
                    <td class="align-top">
                      <DatePicker
                        v-model="educationList[index].expiredDate"
                        format="dd MM yyyy"
                        @update:modelValue="changeFormatDate(index, 'education', 'expired')"
                        :disabled="!item.isEdit"
                      />
                    </td>
                    <td class="align-top">
                      <UiFileUpload
                        :name="`${index}`"
                        :text-length="18"
                        :max-size="16000000"
                        accepted-files=".jpg,.jpeg.,.png,.pdf,application/zip"
                        @addedFile="(file: File) => uploadFile(file, index, 'education')"
                        :disabled="!item.isEdit"
                      />
                      <span class="text-danger text-[10px]"
                        >*jpg, jpeg, png, pdf, zip / max : 16 MB</span
                      >
                    </td>
                    <td class="align-top">
                      <UiInput
                        v-model="educationList[index].description"
                        placeholder="Job Description"
                        :disabled="!item.isEdit"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Certifite Expertise / SKills</h3>

              <UiButton variant="primary" @click="addRow('certificate')">
                <UiIcon name="plus-circle" variant="duotone" />
                Add
              </UiButton>
            </div>
            <div class="card-table">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>Start</th>
                    <th>Until</th>
                    <th>File</th>
                    <th>Job Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in certificateList" :key="index">
                    <td class="align-top">
                      <div class="flex flex-row items-center gap-4">
                        <UiButton
                          variant="primary"
                          @click="editModalTableData(index, 'certificate')"
                        >
                          <UiIcon
                            :name="item.isEdit ? 'check-circle' : 'notepad-edit'"
                            variant="duotone"
                          />
                        </UiButton>
                        <UiButton variant="danger" outline @click="deleteRow(index, 'certificate')">
                          <UiIcon name="cross-circle" variant="duotone" />
                        </UiButton>
                      </div>
                    </td>
                    <td class="align-top">
                      <DatePicker
                        v-model="certificateList[index].issuedDate"
                        format="dd MM yyyy"
                        @update:modelValue="changeFormatDate(index, 'certificate', 'issued')"
                        :disabled="!item.isEdit"
                      />
                    </td>
                    <td class="align-top">
                      <DatePicker
                        v-model="certificateList[index].expiredDate"
                        format="dd MM yyyy"
                        @update:modelValue="changeFormatDate(index, 'certificate', 'expired')"
                        :disabled="!item.isEdit"
                      />
                    </td>
                    <td class="align-top">
                      <UiFileUpload
                        :name="`${index}`"
                        :text-length="18"
                        :max-size="16000000"
                        accepted-files=".jpg,.jpeg.,.png,.pdf,application/zip"
                        @addedFile="(file: File) => uploadFile(file, index, 'certificate')"
                        :disabled="!item.isEdit"
                      />
                      <span class="text-danger text-[10px]"
                        >*jpg, jpeg, png, pdf, zip / max : 16 MB</span
                      >
                    </td>
                    <td class="align-top">
                      <UiInput
                        v-model="certificateList[index].description"
                        placeholder="Job Description"
                        :disabled="!item.isEdit"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 1" class="flex flex-row justify-end items-center gap-4 w-full">
          <UiButton variant="primary" outline data-modal-dismiss="true" @click="closeModal">
            <UiIcon name="black-left" variant="filled" />
            Cancel
          </UiButton>
          <UiButton variant="primary" @click="nextStep">
            <UiIcon name="black-right" variant="duotone" />
            Next
          </UiButton>
        </div>
        <div v-else class="flex flex-row justify-end items-center gap-4 w-full">
          <UiButton variant="primary" outline @click="currentStep = 1">
            <UiIcon name="black-left" variant="filled" />
            Back
          </UiButton>
          <UiButton variant="primary">
            <UiIcon name="file-added" variant="duotone" />
            Save
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type {
  CvDetailsCategory,
  ErrorExportPersonnelDataType,
  FieldCvDetailsType,
  PayloadExportPersonnelDataType,
} from './types/expertPersonnelData'

import { formatDatePayload } from '@/composables/date-format'

import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import RadioCustom from '@/components/ui/atoms/radio/RadioCustom.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'

const options = [
  { text: 'Opsi 1', value: 'opsi 1' },
  { text: 'Opsi 2', value: 'opsi 2' },
  { text: 'Opsi 3', value: 'opsi 3' },
]
const genderOptions = [
  { text: 'Male', value: 'male' },
  { text: 'Female', value: 'female' },
]
const employmentOptions = [
  { text: 'Contract', value: 'contract' },
  { text: 'Internship', value: 'internship' },
  { text: 'Permanent', value: 'permanent' },
]

const currentStep = ref<1 | 2>(1)
const tab = ref({
  active: 'personal_information',
  items: [
    { label: 'Personal Information', value: 'personal_information', icon: 'user' },
    { label: 'CV Details', value: 'cv_details', icon: 'document' },
  ],
})
const payload = ref<PayloadExportPersonnelDataType>({
  contractName: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  highestEducationId: '',
  highestEducationName: '',
  nationalityId: '',
  nationalityName: '',
  position: '',
  employmentStatusId: '',
  employmentStatusName: '',
  skills: '',
})
const payloadError = ref<ErrorExportPersonnelDataType>({
  contractName: false,
  dateOfBirth: false,
  gender: false,
  address: false,
  highestEducationId: false,
  nationalityId: false,
  position: false,
  employmentStatusId: false,
  skills: false,
})
const yearsOfExperienceList = ref<FieldCvDetailsType[]>([])
const educationList = ref<FieldCvDetailsType[]>([])
const certificateList = ref<FieldCvDetailsType[]>([])

const downloadFile = () => {
  console.log('downloadFile')
}

const editData = () => {
  console.log('editData')
}

const deleteData = () => {
  console.log('deleteData')
}

const closeModal = () => {
  Object.keys(payload.value).map((key) => {
    payload.value[key as keyof PayloadExportPersonnelDataType] = ''
  })
  Object.keys(payloadError.value).map((key) => {
    payloadError.value[key as keyof ErrorExportPersonnelDataType] = false
  })
  yearsOfExperienceList.value = []
  educationList.value = []
  certificateList.value = []
}

const nextStep = () => {
  Object.entries(payload.value).map(([key, value]) => {
    if (!['highestEducationName', 'nationalityName', 'employmentStatusName'].includes(key)) {
      payloadError.value[key as keyof ErrorExportPersonnelDataType] = value === ''
    }
  })

  const hasError = Object.values(payloadError.value).some((item) => item === true)

  if (!hasError) {
    payload.value = {
      ...payload.value,
      dateOfBirth: formatDatePayload(payload.value.dateOfBirth),
      highestEducationName: options.find((item) => item.value === payload.value.highestEducationId)!
        .text,
      nationalityName: options.find((item) => item.value === payload.value.nationalityId)!.text,
      employmentStatusName: employmentOptions.find(
        (item) => item.value === payload.value.employmentStatusId,
      )!.text,
    }

    currentStep.value = 2
  }
}

const addRow = (type: CvDetailsCategory) => {
  const row: FieldCvDetailsType = {
    description: '',
    issuedDate: '',
    expiredDate: '',
    uploadUrl: '',
    isEdit: false,
  }

  if (type === 'experience') {
    yearsOfExperienceList.value.push(row)
  } else if (type === 'education') {
    educationList.value.push(row)
  } else if (type === 'certificate') {
    certificateList.value.push(row)
  }
}

const deleteRow = (index: number, type: CvDetailsCategory) => {
  if (type === 'experience') {
    yearsOfExperienceList.value.splice(index, 1)
  } else if (type === 'education') {
    educationList.value.splice(index, 1)
  } else if (type === 'certificate') {
    certificateList.value.splice(index, 1)
  }
}

const editModalTableData = (index: number, type: CvDetailsCategory) => {
  if (type === 'experience') {
    yearsOfExperienceList.value[index].isEdit = !yearsOfExperienceList.value[index].isEdit
  } else if (type === 'education') {
    educationList.value[index].isEdit = !educationList.value[index].isEdit
  } else if (type === 'certificate') {
    certificateList.value[index].isEdit = !certificateList.value[index].isEdit
  }
}

const changeFormatDate = (index: number, type: CvDetailsCategory, field: 'issued' | 'expired') => {
  const fieldKey = field === 'issued' ? 'issuedDate' : 'expiredDate'

  if (type === 'experience') {
    yearsOfExperienceList.value[index][fieldKey] = formatDatePayload(
      yearsOfExperienceList.value[index][fieldKey],
    )
  } else if (type === 'education') {
    educationList.value[index][fieldKey] = formatDatePayload(educationList.value[index][fieldKey])
  } else if (type === 'certificate') {
    certificateList.value[index][fieldKey] = formatDatePayload(
      certificateList.value[index][fieldKey],
    )
  }
}

const uploadFile = async (file: File, index: number, type: CvDetailsCategory) => {
  try {
    // const response = await

    // if (type === 'experience') {
    //   yearsOfExperienceList.value[index].uploadUrl
    // } else if (type === 'education') {

    //   educationList.value[index].uploadUrl
    // } else if (type === 'certificate') {
    //   certificateList.value[index].uploadUrl

    // }
    console.log('yes')
  } catch (error) {
    console.error(error)
  }
}

const submitData = async () => {
  try {
    console.log(payload.value)
  } catch (error) {
    console.error(error)
  }
}
</script>
