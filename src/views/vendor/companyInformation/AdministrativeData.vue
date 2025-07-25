<script lang="ts" setup>
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputTel from '@/components/ui/atoms/input-telephone/UiInputTel.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiLoading from '@/components/UiLoading.vue'
import { checkEmptyValues } from '@/composables/validation'
import {
  type ProvinceListType,
  type CountryListType,
  type CityListType,
  type CurrencyListType,
} from '@/stores/master-data/types/vendor-master-data'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { type IAdministration, type IAdministrationPayload } from '@/stores/vendor/types/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { useLoginStore } from '@/stores/views/login'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import questionImg from '@/assets/question-alt.svg'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

const adminStore = useVendorAdministrationStore()
const uploadStore = useVendorUploadStore()
const lookupStore = useVendorMasterDataStore()
const userStore = useLoginStore()
const route = useRoute()

const downloadLoading = ref<boolean>(false)
const mode = ref<'view' | 'edit'>('view')
const administrationData = ref<IAdministration>(adminStore.data!)
const editPayload = ref<IAdministrationPayload | undefined>(undefined)
const errorFields = ref<string[]>([])
const saveLoading = ref<boolean>(false)
const confirmModal = ref<boolean>(false)
const successModal = ref<boolean>(false)
const errorModal = ref<boolean>(false)

const countryOptions = computed<CountryListType>(() => lookupStore.countryList)
const stateOptions = computed<ProvinceListType>(() => lookupStore.provinceList)
const cityOptions = computed<CityListType>(() => lookupStore.cityList)
const currencyOptions = computed<CurrencyListType>(() =>
  lookupStore.currencyList.map((item) => ({
    ...item,
    label: `${item.currencyName} (${item.currencyCode})`,
  })),
)

const handleCancel = () => {
  if (adminStore.data) {
    administrationData.value = {
      ...adminStore.data,
    }
  }
  mode.value = 'view'
}

const handleDoneEdit = () => {
  editPayload.value = {
    vendorId: adminStore.data?.vendorId ?? 0,
    cityId: administrationData.value.cityId,
    companyAddress: administrationData.value.addressCompanyDetail,
    companyGroup: administrationData.value.groupCompany,
    companyName: administrationData.value.vendorName,
    currencySymbol: administrationData.value.currencySymbol,
    emailUser: administrationData.value.userEmail,
    npwpNo: administrationData.value.npwp,
    npwpUrl: adminStore.data?.npwpUrl ?? '',
    updatedBy: userStore.userData?.profile.employeeName ?? '',
    vendorPhone: administrationData.value.vendorPhone,
    vendorWebsite: administrationData.value.vendorWebsite,
  }
  errorFields.value = checkEmptyValues(editPayload.value)

  if (errorFields.value.length > 0) {
    return
  }

  mode.value = 'view'
}

const handleSave = async () => {
  saveLoading.value = true

  if (!editPayload.value) {
    editPayload.value = {
      vendorId: adminStore.data?.vendorId ?? 0,
      cityId: administrationData.value.cityId,
      companyAddress: administrationData.value.addressCompanyDetail,
      companyGroup: administrationData.value.groupCompany,
      companyName: administrationData.value.vendorName,
      currencySymbol: administrationData.value.currencySymbol,
      emailUser: administrationData.value.userEmail,
      npwpNo: administrationData.value.npwp,
      npwpUrl: adminStore.data?.npwpUrl ?? '',
      updatedBy: userStore.userData?.profile.employeeName ?? '',
      vendorPhone: administrationData.value.vendorPhone,
      vendorWebsite: administrationData.value.vendorWebsite,
    }
  }

  try {
    await adminStore.update(editPayload.value!)

    successModal.value = true
    confirmModal.value = false
  } catch (error) {
    if (error instanceof Error) {
      errorModal.value = true
      confirmModal.value = false
    }
  } finally {
    saveLoading.value = false
  }
}

const selectCountry = () => {
  administrationData.value.countryName = countryOptions.value.find(
    (item) => item.countryID === administrationData.value.countryId,
  )?.countryName as string

  lookupStore.getVendorProvince(administrationData.value.countryId)
}

const selectState = () => {
  administrationData.value.stateName = stateOptions.value.find(
    (item) => item.provinceID === administrationData.value.stateId,
  )?.provinceName as string

  lookupStore.getVendorCities(administrationData.value.stateId)
}

const selectCity = () => {
  administrationData.value.cityName = cityOptions.value.find(
    (item) => item.cityID === administrationData.value.cityId,
  )?.cityName as string
}

const selectCurrency = () => {
  const selectedCurrency = currencyOptions.value.find(
    (item) => item.currencyId === administrationData.value.currencyId,
  )
  administrationData.value.currencyLabel = selectedCurrency?.currencyName as string
  administrationData.value.currencySymbol = selectedCurrency?.currencyCode as string
}

const download = async (path: string) => {
  downloadLoading.value = true

  try {
    const file = await uploadStore.preview(path)
    const link = URL.createObjectURL(file)
    window.open(link, '_blank')
    setTimeout(() => URL.revokeObjectURL(link), 1000)
  } catch (err) {
    console.error(err)
    alert('Failed to download document. Please try again later.')
  } finally {
    downloadLoading.value = false
  }
}

watch(
  () => adminStore.data,
  (data) => {
    if (data) {
      administrationData.value = { ...data }
      lookupStore.getVendorProvince(data.countryId)
      lookupStore.getVendorCities(data.stateId)
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

onMounted(() => {
  adminStore.getData(route.params.id as string)
  lookupStore.getVendorCountries()
  lookupStore.getVendorCurrency()
})
</script>
<template>
  <div class="space-y-5">
    <div class="card">
      <div class="card-header">
        <div class="card-title">Administration</div>
        <UiButton outline v-if="mode === 'view'" @click="mode = 'edit'">
          <UiIcon name="notepad-edit" variant="duotone" />
          <span class="font-medium">Edit Data</span>
        </UiButton>
        <div class="space-x-3" v-else>
          <UiButton variant="primary" @click="handleDoneEdit">
            <UiIcon name="check-circle" variant="duotone" />
            <span class="font-medium">Save</span>
          </UiButton>
          <UiButton variant="danger" outline @click="handleCancel">
            <UiIcon name="cross-circle" variant="duotone" />
            <span class="font-medium">Cancel</span>
          </UiButton>
        </div>
      </div>
      <div
        v-if="adminStore.loading"
        class="flex items-center justify-center text-xl text-primary py-5"
      >
        <UiLoading size="md" />
      </div>
      <div v-else-if="adminStore.error" class="flex items-center justify-center py-5">
        <span class="text-sm text-red-500 font-medium">
          {{ adminStore.error }}
        </span>
      </div>
      <div v-else-if="!adminStore.data" class="flex items-center justify-center py-5">
        <span class="text-sm font-medium"> Oops! No data </span>
      </div>
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="card-table border">
            <table class="table align-middle">
              <tbody>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Username</td>
                  <td class="text-sm font-bold text-gray-700">
                    <UiInput
                      v-model="administrationData.userName"
                      disabled
                      v-if="mode === 'edit'"
                    />
                    <span v-else>
                      {{ administrationData?.userName }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">User Email</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <UiInput
                        v-model="administrationData.userEmail"
                        :error="errorFields.includes('emailUser')"
                      />
                      <span class="text-xs text-red-500" v-if="errorFields.includes('emailUser')">
                        User Email Required
                      </span>
                    </template>
                    <span v-else>
                      {{ administrationData?.userEmail }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Company Name</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <UiInput
                        v-model="administrationData.vendorName"
                        :error="errorFields.includes('companyName')"
                      />
                      <span class="text-xs text-red-500" v-if="errorFields.includes('companyName')">
                        Company Name Required
                      </span>
                    </template>
                    <span v-else>
                      {{ administrationData?.vendorName }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Company Category</td>
                  <td class="text-sm font-bold text-gray-700">
                    <UiInput
                      v-model="administrationData.companyCategoryName"
                      disabled
                      v-if="mode === 'edit'"
                    />
                    <span v-else>
                      {{ administrationData?.companyCategoryName }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Company Group</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <UiInput
                        v-model="administrationData.groupCompany"
                        :error="errorFields.includes('companyGroup')"
                      />
                      <span
                        class="text-xs text-red-500"
                        v-if="errorFields.includes('companyGroup')"
                      >
                        group Company Required
                      </span>
                    </template>
                    <span v-else>
                      {{ administrationData?.groupCompany }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">NPWP Number</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <UiInput
                        v-model="administrationData.npwp"
                        :error="errorFields.includes('npwpNo')"
                      />
                      <span class="text-xs text-red-500" v-if="errorFields.includes('npwpNo')">
                        npwp Required
                      </span>
                    </template>
                    <span v-else>
                      {{ administrationData?.npwp }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">NPWP Document</td>
                  <td class="text-sm font-bold text-gray-700">
                    <UiButton
                      :outline="true"
                      size="sm"
                      @click="download(adminStore.data.npwpUrl)"
                      :disabled="downloadLoading"
                    >
                      <span v-if="downloadLoading">
                        <UiLoading />
                      </span>
                      <template v-else>
                        <UiIcon name="cloud-download" variant="duotone" />
                        <span>Download NPWP Document</span>
                      </template>
                    </UiButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-table border">
            <table class="table align-middle">
              <tbody>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Country</td>
                  <td class="text-sm font-bold text-gray-700">
                    <UiSelect
                      :options="countryOptions"
                      v-model="administrationData.countryId"
                      value-key="countryID"
                      text-key="countryName"
                      v-if="mode === 'edit'"
                      @update:model-value="selectCountry"
                      :error="errorFields.includes('countryId')"
                    />

                    <span v-else>
                      {{ administrationData?.countryName }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Province</td>
                  <td class="text-sm font-bold text-gray-700">
                    <UiSelect
                      :options="stateOptions"
                      v-model="administrationData.stateId"
                      value-key="provinceID"
                      text-key="provinceName"
                      v-if="mode === 'edit'"
                      @update:model-value="selectState"
                      :error="errorFields.includes('stateId')"
                    />

                    <span v-else>
                      {{ administrationData?.stateName }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Regency/City</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <UiSelect
                        :options="cityOptions"
                        v-model="administrationData.cityId"
                        value-key="cityID"
                        text-key="cityName"
                        @update:model-value="selectCity"
                        :error="errorFields.includes('cityId')"
                      />
                      <span class="text-xs text-red-500" v-if="errorFields.includes('cityId')">
                        City Required
                      </span>
                    </template>

                    <span v-else>
                      {{ administrationData?.cityName }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Telephone</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <UiInputTel
                        v-model="administrationData.vendorPhone"
                        :error="errorFields.includes('vendorPhone')"
                      />
                      <span class="text-xs text-red-500" v-if="errorFields.includes('vendorPhone')">
                        Vendor Phone Required
                      </span>
                    </template>
                    <span v-else>
                      {{ administrationData?.vendorPhone }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Vendor Email</td>
                  <td class="text-sm font-bold text-gray-700">
                    <UiInput
                      v-model="administrationData.vendorEmail"
                      v-if="mode === 'edit'"
                      readonly
                      disabled
                    />
                    <span v-else>
                      {{ administrationData?.vendorEmail }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Website</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <UiInput
                        v-model="administrationData.vendorWebsite"
                        :error="errorFields.includes('vendorWebsite')"
                      />
                      <span
                        class="text-xs text-red-500"
                        v-if="errorFields.includes('vendorWebsite')"
                      >
                        Vendor Website Required
                      </span>
                    </template>
                    <span v-else>
                      {{ administrationData?.vendorWebsite }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Currency Preference</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <UiSelect
                        :options="currencyOptions"
                        v-model="administrationData.currencyId"
                        value-key="currencyId"
                        text-key="label"
                        :error="errorFields.includes('currencySymbol')"
                        @update:model-value="selectCurrency"
                      />
                      <span
                        class="text-red-500 text-xs"
                        v-if="errorFields.includes('currencySymbol')"
                      >
                        Currency Required
                      </span>
                    </template>

                    <span v-else>
                      {{ administrationData?.currencyLabel }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm text-gray-600 font-medium w-[182px]">Company Address</td>
                  <td class="text-sm font-bold text-gray-700">
                    <template v-if="mode === 'edit'">
                      <textarea
                        class="textarea"
                        v-model="administrationData.addressCompanyDetail"
                        :class="errorFields.includes('companyAddress') ? 'border-red-500' : ''"
                      ></textarea>
                      <span
                        class="text-xs text-red-500"
                        v-if="errorFields.includes('companyAddress')"
                        >Adress Required</span
                      >
                    </template>
                    <span v-else>
                      {{ administrationData?.addressCompanyDetail }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-table border">
          <table class="table align-middle">
            <tbody>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Business Fields</td>
                <td class="text-sm text-gray-700">
                  <ul>
                    <li
                      v-for="(bf, index) in adminStore.data.businessFieldName?.split(',')"
                      :key="bf"
                    >
                      <strong> {{ index + 1 }}. {{ bf.split('(')[0]?.trim() ?? bf }}, </strong>
                      <span>{{ bf.split('(')[1]?.trim()?.replace(')', '') ?? '' }}</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
    <div class="flex gap-3 justify-end">
      <UiButton outline @click="$router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span> Back </span>
      </UiButton>
      <UiButton :disabled="mode === 'edit'" @click="confirmModal = true">
        <UiIcon name="file-added" variant="duotone" />
        <span> Save </span>
      </UiButton>
    </div>
  </div>

  <UiModal v-model="confirmModal" size="sm">
    <div class="flex flex-col justify-center items-center gap-3">
      <img :src="questionImg" alt="Confirm" class="w-32 mx-auto mb-4" />
      <h3 class="text-xl font-medium">Save</h3>
      <p class="text-sm text-center font-light">
        You are about to Save to this data. Please review your input before continuing.
      </p>
      <div class="space-x-3 mb-3">
        <UiButton outline @click="confirmModal = false" class="px-8">
          <UiIcon name="cross-circle" variant="duotone" />
          <span> Cancel </span>
        </UiButton>
        <UiButton variant="primary" @click="handleSave" :disabled="saveLoading" class="px-8">
          <UiIcon name="paper-plane" variant="duotone" />
          <span> Save </span>
        </UiButton>
      </div>
    </div>
  </UiModal>

  <UiModal v-model="successModal" size="sm">
    <ModalSuccessLogo class="mx-auto" />
    <h3 class="text-center text-lg font-medium">Administration Data Successfully Updated</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      The data has been successfully updated in the admin system.
    </p>
  </UiModal>

  <UiModal v-model="errorModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">Failed to Change Vendor data!</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      Failed to change vendor data. Please try again later or contact support if the problem
      persists.
    </p>
  </UiModal>
</template>
