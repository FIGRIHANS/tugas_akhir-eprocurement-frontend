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
import { useI18n } from 'vue-i18n'

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
const { t } = useI18n()
const lookupStore = useVendorMasterDataStore()
const userStore = useLoginStore()
const uploadStore = useVendorUploadStore()
const experienceStore = useExperienceStore()

// ref bantuan
const businessFieldId = ref<number>(0)

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
      alert(t('experienceData.error.uploadFailed'))
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
    businessFieldId: businessFieldId.value,
  })

  // remove excluded key
  formError.value = formError.value.filter((field) => !excludedFields.includes(field))

  if (formData.value.stateLocation !== 360) {
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
    formData.value.stateLocation = selectedItem.countryId
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
    :title="t('experienceData.modal.form.title')"
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
        {{ t('experienceData.projectType.completed') }}
      </UiButton>
      <UiButton
        class="flex-1 flex items-center justify-center"
        :variant="formData.experienceType === 3154 ? 'primary' : 'light'"
        @click="formData.experienceType = 3154"
      >
        {{ t('experienceData.projectType.ongoing') }}
      </UiButton>
    </div>

    <form @submit.prevent="onSubmit">
      <UiFormGroup hide-border :grid="2" class="mt-3">
        <!-- contract name -->
        <UiInput
          required
          :placeholder="t('experienceData.form.placeholders.contractName')"
          :label="t('experienceData.form.labels.contractName')"
          v-model="formData.contractName"
          :error="formError.includes('contractName')"
          :hint-text="
            formError.includes('contractName') ? t('experienceData.validation.contractName') : ''
          "
        />

        <!-- institution -->
        <UiInput
          :label="t('experienceData.form.labels.agency')"
          :placeholder="t('experienceData.form.placeholders.agency')"
          required
          v-model="formData.agency"
          :error="formError.includes('agency')"
          :hint-text="formError.includes('agency') ? t('experienceData.validation.agency') : ''"
        />

        <!-- Business Sector -->
        <UiSelect
          :label="t('experienceData.form.labels.businessField')"
          :options="businessFieldOptions"
          text-key="businessFieldName"
          value-key="businessFieldID"
          :placeholder="t('experienceData.form.placeholders.businessField')"
          v-model="businessFieldId"
          required
          :error="formError.includes('businessFieldId')"
          :hint-text="
            formError.includes('businessFieldId')
              ? t('experienceData.validation.businessField')
              : ''
          "
        />

        <!-- Sub business sector -->
        <UiSelect
          :label="t('experienceData.form.labels.subBusiness')"
          required
          :options="subBusinessFieldOptions"
          text-key="subBusinessFieldName"
          value-key="subBusinessFieldID"
          :placeholder="t('experienceData.form.placeholders.subBusiness')"
          v-model="formData.field"
          :error="formError.includes('field')"
          :hint-text="formError.includes('field') ? t('experienceData.validation.subBusiness') : ''"
          :disabled="!businessFieldId"
        />

        <!-- Country -->
        <UiSelect
          :label="t('experienceData.form.labels.country')"
          :options="countryOptions"
          text-key="label"
          value-key="value"
          :placeholder="t('experienceData.form.placeholders.country')"
          @update:model-value="onSelectCountry(Number($event))"
          v-model="formData.stateLocation"
          required
          :error="formError.includes('stateLocation')"
          :hint-text="
            formError.includes('stateLocation') ? t('experienceData.validation.country') : ''
          "
        />

        <UiFormGroup hide-border :grid="2">
          <!-- Province -->
          <UiSelect
            :label="t('experienceData.form.labels.province')"
            :options="stateOptions"
            text-key="provinceName"
            value-key="provinceID"
            :placeholder="t('experienceData.form.placeholders.province')"
            @update:model-value="onSelectState(Number($event))"
            v-model="formData.provinceLocation"
            :disabled="!formData.stateLocation"
            :hint-text="
              formError.includes('provinceLocation') ? t('experienceData.validation.province') : ''
            "
            required
            :error="formError.includes('provinceLocation')"
          />

          <!-- City -->
          <UiSelect
            :label="t('experienceData.form.labels.city')"
            :required="formData.stateLocation === 360"
            :options="cityOptions"
            text-key="cityName"
            value-key="cityID"
            :placeholder="t('experienceData.form.placeholders.city')"
            v-model="formData.location"
            :error="formError.includes('location')"
            :hint-text="formError.includes('location') ? t('experienceData.validation.city') : ''"
            :disabled="!formData.provinceLocation"
          />
        </UiFormGroup>

        <!-- Address -->
        <UiInput
          :label="t('experienceData.form.labels.address')"
          :placeholder="t('experienceData.form.placeholders.address')"
          required
          v-model="formData.address"
          :error="formError.includes('address')"
          :hint-text="formError.includes('address') ? t('experienceData.validation.address') : ''"
        />

        <!-- Phone Number -->
        <UiInputTel
          :label="t('experienceData.form.labels.phoneNumber')"
          :placeholder="t('experienceData.form.placeholders.phoneNumber')"
          required
          v-model="formData.agencyTelpNo"
          :error="formError.includes('agencyTelpNo')"
          :hint-text="
            formError.includes('agencyTelpNo') ? t('experienceData.validation.phoneNumber') : ''
          "
        />

        <UiFormGroup hide-border :grid="2">
          <!-- Contract Number -->
          <UiInput
            :label="t('experienceData.form.labels.contractNumber')"
            :placeholder="t('experienceData.form.placeholders.contractNumber')"
            required
            v-model="formData.contractNo"
            :error="formError.includes('contractNo')"
            :hint-text="
              formError.includes('contractNo') ? t('experienceData.validation.contractNumber') : ''
            "
          />

          <!-- Currency -->
          <UiSelect
            :label="t('experienceData.form.labels.currency')"
            required
            :options="currencyOptions"
            text-key="label"
            value-key="value"
            :placeholder="t('experienceData.form.placeholders.currency')"
            v-model="formData.expCurrID"
            :error="formError.includes('expCurrID')"
            :hint-text="
              formError.includes('expCurrID') ? t('experienceData.validation.currency') : ''
            "
          />
        </UiFormGroup>

        <!-- Contract Value -->
        <UiInput
          :label="t('experienceData.form.labels.contractValue')"
          :placeholder="t('experienceData.form.placeholders.contractValue')"
          type="number"
          required
          v-model="formData.contractValue"
          :error="formError.includes('contractValue')"
          :hint-text="
            formError.includes('contractValue') ? t('experienceData.validation.contractValue') : ''
          "
        />

        <!-- Start date -->
        <div class="relative">
          <span
            class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-10"
          >
            {{ t('experienceData.form.labels.startDate') }} <span class="text-danger">*</span>
          </span>
          <DatePicker
            :placeholder="t('experienceData.form.placeholders.startDate')"
            v-model="formData.startDate"
            :error="formError.includes('startDate')"
            @update:model-value="formData.startDate = new Date($event).toISOString()"
            format="dd/MM/yyyy"
          />
          <span v-if="formError.includes('startDate')" class="form-hint !text-danger">
            {{ t('experienceData.validation.startDate') }}
          </span>
        </div>

        <!-- End Date -->
        <div class="relative">
          <span
            class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-10"
          >
            {{ t('experienceData.form.labels.endDate') }} <span class="text-danger">*</span>
          </span>
          <DatePicker
            :placeholder="t('experienceData.form.placeholders.endDate')"
            v-model="formData.endDate"
            :error="formError.includes('endDate')"
            @update:model-value="formData.endDate = new Date($event).toISOString()"
            format="dd/MM/yyyy"
          />
          <span v-if="formError.includes('endDate')" class="form-hint !text-danger">
            {{ t('experienceData.validation.endDate') }}
          </span>
        </div>

        <!-- Description -->
        <UiInput
          :label="t('experienceData.form.labels.description')"
          :placeholder="t('experienceData.form.placeholders.description')"
          required
          v-model="formData.remark"
          :error="formError.includes('remark')"
          :hint-text="
            formError.includes('remark') ? t('experienceData.validation.description') : ''
          "
        />

        <!-- upload -->
        <UiFileUpload
          accepted-files=".jpg,.jpeg,.png,.pdf,.zip"
          name="file"
          :placeholder="t('experienceData.form.placeholders.upload')"
          @added-file="onUploadFile"
          :hint-text="
            uploadError
              ? t('experienceData.error.uploadError')
              : formError.includes('documentURL')
                ? t('experienceData.validation.document')
                : ''
          "
          :error="formError.includes('documentURL')"
          :disabled="uploadLoading"
        />
      </UiFormGroup>

      <div class="flex justify-end gap-3 mt-4">
        <UiButton outline type="button" @click="onCloseModal">
          <UiIcon name="black-left-line" />
          <span>{{ t('experienceData.buttons.cancel') }}</span>
        </UiButton>
        <UiButton variant="primary" type="submit" :disabled="submitLoading || uploadLoading">
          <UiLoading variant="white" v-if="submitLoading" />
          <UiIcon name="file-added" variant="duotone" v-else />
          <span>{{ t('experienceData.buttons.save') }}</span>
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
