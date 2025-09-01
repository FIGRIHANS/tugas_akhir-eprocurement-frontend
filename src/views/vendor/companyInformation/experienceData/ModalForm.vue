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
import { computed, onMounted, ref, watch } from 'vue'
import { defaultFormData, excludedFields } from './static'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useLoginStore } from '@/stores/views/login'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { checkEmptyValues } from '@/composables/validation'
import useExperienceStore from '@/stores/vendor/experience'
import UiLoading from '@/components/UiLoading.vue'

const props = withDefaults(
  defineProps<{
    mode?: 'add' | 'edit' | 'view' | 'delete'
    vendorId: number
    id?: number
  }>(),
  {
    mode: 'add',
  },
)

const emit = defineEmits(['onError', 'onSuccess'])

const open = defineModel()
const lookupStore = useVendorMasterDataStore()
const userStore = useLoginStore()
const uploadStore = useVendorUploadStore()
const experienceStore = useExperienceStore()

// ref bantuan
const businessFieldId = ref<number>(0)
const countryId = ref<number>(0)

const formData = ref<IExperiencePayload>(cloneDeep(defaultFormData))
const uploadError = ref<string>('')
const uploadLoading = ref<boolean>(false)
const formError = ref<string[]>([])
const submitLoading = ref<boolean>(false)

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
    (field) => field.businessFieldID === businessFieldId.value,
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
    uploadLoading.value = true
    const response = await uploadStore.upload(formDataFile)
    formData.value.documentURL = response?.path as string
    formData.value.uploadDate = new Date().toISOString()
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      alert('File upload failed. Please try again.')
    }
  } finally {
    uploadLoading.value = false
  }
}

const onSelectCountry = (countryId: number) => {
  formData.value.provinceLocation = 0
  lookupStore.getVendorProvince(countryId)
}

const onSelectState = (provinceId: number) => {
  formData.value.location = 0
  lookupStore.getVendorCities(provinceId)
}

const onSubmit = async () => {
  // set value for vendor id dan user
  formData.value.vendorID = props.vendorId
  formData.value.user = userStore.userData?.profile.employeeName as string

  // check empty value for each form fields
  formError.value = checkEmptyValues({
    ...formData.value,
    countryId: countryId.value,
    businessFieldId: businessFieldId.value,
  })

  // remove excluded key
  formError.value = formError.value.filter((field) => !excludedFields.includes(field))

  if (countryId.value !== 360) {
    formError.value = formError.value.filter((field) => field !== 'location')
  }

  if (formError.value.length) return

  try {
    submitLoading.value = true
    await experienceStore.update(formData.value)
    emit('onSuccess')
    onCloseModal()
  } catch (error) {
    if (error instanceof Error) {
      emit('onError')
      onCloseModal()
    }
  } finally {
    submitLoading.value = false
  }
}

const onCloseModal = () => {
  open.value = false
  formData.value = cloneDeep(defaultFormData)
  formError.value = []
}

watch(
  () => props.id,
  async (newId) => {
    const selectedItem = experienceStore.data.find((item) => item.id === Number(newId))

    if (!selectedItem || props.mode === 'add') return

    await lookupStore.getVendorProvince(selectedItem.countryId)
    await lookupStore.getVendorCities(selectedItem.provinceId)

    businessFieldId.value = selectedItem.businessFieldId
    countryId.value = selectedItem.countryId

    formData.value.id = Number(props.id)
    formData.value.contractName = selectedItem.contractName
    formData.value.address = selectedItem.address
    formData.value.agency = selectedItem.agency
    formData.value.contractValue = selectedItem.contractValue
    formData.value.field = selectedItem.field
    formData.value.experienceType = selectedItem.experienceType
    formData.value.startDate = selectedItem.startDate
    formData.value.endDate = selectedItem.endDate
    formData.value.contractNo = selectedItem.contractNo
    formData.value.agencyTelpNo = selectedItem.agencyTelpNo
    formData.value.remark = selectedItem.remark
    formData.value.documentURL = selectedItem.documentURL
    formData.value.location = selectedItem.city
    formData.value.expCurrID = selectedItem.expCurrID
    formData.value.uploadDate = selectedItem.createdDate
    formData.value.provinceLocation = selectedItem.provinceId
  },
  {
    immediate: true,
  },
)

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

    <form @submit.prevent="onSubmit">
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
          :options="businessFieldOptions"
          text-key="businessFieldName"
          value-key="businessFieldID"
          placeholder="--Business Sector Type--"
          v-model="businessFieldId"
          required
          :error="formError.includes('businessFieldId')"
          :hint-text="formError.includes('businessFieldId') ? 'Business Field required' : ''"
        />

        <!-- Sub business sector -->
        <UiSelect
          label="Sub Business Sector"
          required
          :options="subBusinessFieldOptions"
          text-key="subBusinessFieldName"
          value-key="subBusinessFieldID"
          placeholder="--Sub Business Sector--"
          v-model="formData.field"
          :error="formError.includes('field')"
          :hint-text="formError.includes('field') ? 'Sub Business Field required' : ''"
          :disabled="!businessFieldId"
        />

        <!-- Country -->
        <UiSelect
          label="Country"
          :options="countryOptions"
          text-key="label"
          value-key="value"
          placeholder="--Country--"
          @update:model-value="onSelectCountry(Number($event))"
          v-model="countryId"
          required
          :error="formError.includes('countryId')"
          :hint-text="formError.includes('countryId') ? 'Country required' : ''"
        />

        <UiFormGroup hide-border :grid="2">
          <!-- Province -->
          <UiSelect
            label="Province"
            :options="stateOptions"
            text-key="provinceName"
            value-key="provinceID"
            placeholder="--Province--"
            @update:model-value="onSelectState(Number($event))"
            v-model="formData.provinceLocation"
            :disabled="!countryId"
            :hint-text="formError.includes('provinceLocation') ? 'Province required' : ''"
            required
            :error="formError.includes('provinceLocation')"
          />

          <!-- City -->
          <UiSelect
            label="City"
            :required="countryId === 360"
            :options="cityOptions"
            text-key="cityName"
            value-key="cityID"
            placeholder="--City--"
            v-model="formData.location"
            :error="formError.includes('location')"
            :hint-text="formError.includes('location') ? 'City required' : ''"
            :disabled="!formData.provinceLocation"
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
          type="number"
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
            @update:model-value="formData.startDate = new Date($event).toISOString()"
            format="dd/MM/yyyy"
          />
          <span v-if="formError.includes('startDate')" class="form-hint !text-danger">
            Start date required
          </span>
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
            @update:model-value="formData.endDate = new Date($event).toISOString()"
            format="dd/MM/yyyy"
          />
          <span v-if="formError.includes('endDate')" class="form-hint !text-danger">
            End date required
          </span>
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
          placeholder="Upload file - (*jpg, jpeg, png, pdf / max : 16 MB)"
          @added-file="onUploadFile"
          :hint-text="
            uploadError
              ? 'An error accoured, please try again'
              : formError.includes('documentURL')
                ? 'Document required'
                : ''
          "
          :error="formError.includes('documentURL')"
          :disabled="uploadLoading"
        />
      </UiFormGroup>

      <div class="flex justify-end gap-3 mt-4">
        <UiButton outline type="button" @click="onCloseModal">
          <UiIcon name="black-left-line" />
          <span>Cancel</span>
        </UiButton>
        <UiButton variant="primary" type="submit" :disabled="submitLoading || uploadLoading">
          <UiLoading variant="white" v-if="submitLoading" />
          <UiIcon name="file-added" variant="duotone" v-else />
          <span>Save</span>
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
