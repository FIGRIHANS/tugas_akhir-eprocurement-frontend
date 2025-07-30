<script setup lang="ts">
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputTel from '@/components/ui/atoms/input-telephone/UiInputTel.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import type { IExperiencePayload } from '@/stores/vendor/types/experience'
import { cloneDeep } from 'lodash'
import { computed, onMounted, ref } from 'vue'
import { defaultFormData } from './static'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useLoginStore } from '@/stores/views/login'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { checkEmptyValues } from '@/composables/validation'
withDefaults(
  defineProps<{
    mode?: 'create' | 'edit' | 'view'
  }>(),
  {
    mode: 'create',
  },
)
const open = defineModel()
const lookupStore = useVendorMasterDataStore()
const userStore = useLoginStore()
const uploadStore = useVendorUploadStore()

const formData = ref<IExperiencePayload>(cloneDeep(defaultFormData))
const uploadError = ref<string>('')
const formError = ref<string[]>([])

// computed props
const countryOptions = computed(() =>
  lookupStore.countryList.map((item) => ({
    ...item,
    label: item.countryName,
    value: item.countryID,
  })),
)
const stateOptions = computed(() => lookupStore.provinceList)
const cityOptions = computed(() => lookupStore.cityList)
const currencyOptions = computed(() =>
  lookupStore.currencyList.map((item) => ({
    value: item.currencyId,
    label: `${item.currencyCode} - ${item.currencyName}`,
  })),
)
const businessFieldOptions = computed(() => lookupStore.businessFieldList)
const subBusinessFieldOptions = computed(() => {
  const businessField = lookupStore.businessFieldList.find(
    (field) => field.businessFieldID === formData.value.field,
  )

  if (businessField) {
    return businessField.subBusiness
  }

  return []
})

// functions
const onUploadFile = async (file: File) => {
  if (!file) return

  uploadError.value = ''
  const formDataFile = new FormData()
  formDataFile.append('FormFile', file)
  formDataFile.append('Actioner', userStore.userData?.profile.profileId.toString() || '0')

  try {
    const response = await uploadStore.upload(formDataFile)
    formData.value.documentURL = response?.path as string
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      alert('File upload failed. Please try again.')
    }
  }
}

const onSelecCountry = (countryId: number) => {
  lookupStore.getVendorProvince(countryId)
}

const onSelectState = (provinceId: number) => {
  lookupStore.getVendorCities(provinceId)
}

const onSubmit = async () => {
  formError.value = checkEmptyValues(formData.value)

  if (formError.value.length) return

  console.log(formData.value)
}

const onCloseModal = () => {
  open.value = false
  formData.value = cloneDeep(defaultFormData)
  formError.value = []
}

onMounted(() => {
  lookupStore.getVendorCountries()
  lookupStore.getVendorBusinessFields()
  lookupStore.getVendorCurrency()
})
</script>

<template>
  <UiModal
    v-model="open"
    size="lg"
    title="Experience Data"
    :center="false"
    static
    @update:model-value="onCloseModal"
  >
    <div class="border border-secondary-active rounded-md p-1 flex items-center gap-2">
      <UiButton
        class="flex-1 flex items-center justify-center"
        :variant="formData.experienceType === 3153 ? 'primary' : 'light'"
        @click="formData.experienceType = 3153"
      >
        Completed Projects
      </UiButton>
      <UiButton
        class="flex-1 flex items-center justify-center"
        :variant="formData.experienceType === 3154 ? 'primary' : 'light'"
        @click="formData.experienceType = 3154"
      >
        Ongoing Projects
      </UiButton>
    </div>

    <form action="" @submit.prevent="onSubmit">
      <UiFormGroup hide-border :grid="2" class="mt-3">
        <!-- contract name -->
        <UiInput
          required
          placeholder="Contract Name"
          label="Contract Name"
          v-model="formData.contractName"
          :error="formError.includes('contractName')"
          :hint-text="formError.includes('contractName') ? 'Contract Name required' : ''"
        />

        <!-- institution -->
        <UiInput
          label="Institution"
          placeholder="Institution"
          required
          v-model="formData.agency"
          :error="formError.includes('agency')"
          :hint-text="formError.includes('agency') ? 'Institution required' : ''"
        />

        <!-- Business Sector -->
        <UiSelect
          label="Business Sector Type"
          required
          :options="businessFieldOptions"
          text-key="businessFieldName"
          value-key="businessFieldID"
          placeholder="--Business Sector Type--"
          v-model="formData.field"
          :error="formError.includes('field')"
          :hint-text="formError.includes('field') ? 'Business Sector required' : ''"
        />

        <!-- Sub business sector -->
        <UiSelect
          label="Sub Business Sector"
          required
          :options="subBusinessFieldOptions"
          text-key="subBusinessFieldName"
          value-key="subBusinessFieldID"
          placeholder="--Sub Business Sector--"
          v-model="formData.fieldType"
          :error="formError.includes('fieldType')"
          :hint-text="formError.includes('fieldType') ? 'Sub Business Field required' : ''"
        />

        <!-- Country -->
        <UiSelect
          label="Country"
          required
          :options="countryOptions"
          text-key="label"
          value-key="value"
          placeholder="--Country--"
          @update:model-value="onSelecCountry(Number($event))"
          v-model="formData.stateLocation"
          :error="formError.includes('stateLocation')"
          :hint-text="formError.includes('stateLocation') ? 'Country required' : ''"
        />

        <UiFormGroup hide-border :grid="2">
          <!-- Province -->
          <UiSelect
            label="Province"
            required
            :options="stateOptions"
            text-key="provinceName"
            value-key="provinceID"
            placeholder="--Province--"
            @update:model-value="onSelectState(Number($event))"
            v-model="formData.provinceLocation"
            :error="formError.includes('provinceLocation')"
            :hint-text="formError.includes('provinceLocation') ? 'Province required' : ''"
          />

          <!-- City -->
          <UiSelect
            label="City"
            required
            :options="cityOptions"
            text-key="cityName"
            value-key="cityID"
            placeholder="--City--"
            v-model="formData.location"
            :error="formError.includes('location')"
            :hint-text="formError.includes('location') ? 'City required' : ''"
          />
        </UiFormGroup>

        <!-- Address -->
        <UiInput
          label="Address"
          placeholder="Address"
          required
          v-model="formData.address"
          :error="formError.includes('address')"
          :hint-text="formError.includes('address') ? 'Address required' : ''"
        />

        <!-- Phone Number -->
        <UiInputTel
          placeholder="Phone Number"
          required
          v-model="formData.agencyTelpNo"
          :error="formError.includes('agencyTelpNo')"
          :hint-text="formError.includes('agencyTelpNo') ? 'Phone number required' : ''"
        />

        <UiFormGroup hide-border :grid="2">
          <!-- Contract Number -->
          <UiInput
            label="Contract Number"
            placeholder="Contract Number"
            required
            v-model="formData.contractNo"
            :error="formError.includes('contractNo')"
            :hint-text="formError.includes('contractNo') ? 'Contract Number required' : ''"
          />

          <!-- Currency -->
          <UiSelect
            label="Currency"
            required
            :options="currencyOptions"
            text-key="label"
            value-key="value"
            placeholder="--Currency--"
            v-model="formData.expCurrID"
            :error="formError.includes('expCurrID')"
            :hint-text="formError.includes('expCurrID') ? 'Currency required' : ''"
          />
        </UiFormGroup>

        <!-- Contract Value -->
        <UiInput
          label="Contract Value"
          placeholder="Contract Value"
          required
          v-model="formData.contractValue"
          :error="formError.includes('contractValue')"
          :hint-text="formError.includes('contractValue') ? 'Contract Value required' : ''"
        />

        <!-- Start date -->
        <div class="relative">
          <span
            class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-10"
          >
            Start Date <span class="text-danger">*</span>
          </span>
          <DatePicker
            placeholder="Start Date"
            v-model="formData.startDate"
            :error="formError.includes('startDate')"
            :hint-text="formError.includes('startDate') ? 'Start date required' : ''"
          />
        </div>

        <!-- End Date -->
        <div class="relative">
          <span
            class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-10"
          >
            End Date <span class="text-danger">*</span>
          </span>
          <DatePicker
            placeholder="End Date"
            v-model="formData.endDate"
            :error="formError.includes('endDate')"
            :hint-text="formError.includes('endDate') ? 'End date required' : ''"
          />
        </div>

        <!-- Description -->
        <UiInput
          label="Description"
          placeholder="Description"
          required
          v-model="formData.remark"
          :error="formError.includes('remark')"
          :hint-text="formError.includes('remark') ? 'Description required' : ''"
        />

        <!-- upload -->
        <UiFileUpload
          accepted-files=".jpg,.jpeg,.png,.pdf"
          name="file"
          placeholder="Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)"
          @added-file="onUploadFile"
          :hint-text="
            uploadError
              ? 'An error accoured, please try again'
              : formError.includes('documentURL')
                ? 'Document required'
                : ''
          "
          :error="formError.includes('documentURL')"
        />
      </UiFormGroup>

      <div class="flex justify-end gap-3 mt-4">
        <UiButton outline type="button" @click="onCloseModal">
          <UiIcon name="black-left-line" />
          <span>Cancel</span>
        </UiButton>
        <UiButton variant="primary" type="submit">
          <UiLoading variant="white" />
          <UiIcon name="file-added" variant="duotone" />
          <span>Save</span>
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
