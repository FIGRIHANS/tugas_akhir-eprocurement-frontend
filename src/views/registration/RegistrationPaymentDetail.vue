<template>
  <div class="flex flex-rows justify-center gap-6 mb-3">
    <div class="w-2/3 flex flex-col items-center gap-6">
      <div class="card w-full">
        <div class="card-header">
          <h3 class="card-title">Payment Detail</h3>
        </div>

        <div class="card-body flex flex-col gap-6">
          <UiInput
            v-model="paymentDetail.accountNo"
            label="Bank Account Number"
            placeholder="Enter bank account number"
            row
            required
            :error="paymentDetail.accountNoError"
          />

          <div class="flex flex-col gap-6">
            <UiInput
              v-model="paymentDetail.accountName"
              label="Account Holder Name"
              placeholder="Enter full name as written in bank book"
              row
              required
              :error="paymentDetail.accountNameError"
            />

            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <div class="w-2/5"></div>
              <UiCheckbox
                v-model="paymentDetailFlagging.isNotSameAsCompany"
                label="Holder's name is different from the company name"
              />
            </div>
          </div>
          <UiFileUpload
            v-if="paymentDetailFlagging.isNotSameAsCompany"
            name="Account Discrepancy Statement"
            label="Account Discrepancy Statement"
            placeholder="Account Discrepancy Statement"
            acceptedFiles=".pdf"
            :max-size="16000000"
            @addedFile="(file) => uploadFile(file, 'different account')"
            required
            :error="paymentDetail.urlAccountDifferencesError"
            @upload-failed="(val) => (modalUploadFailed = val)"
          />
          <UiFileUpload
            v-if="paymentDetailFlagging.isNotSameAsCompany"
            name="Account Cover"
            label="Account Cover"
            placeholder="Account Cover"
            acceptedFiles=".pdf"
            :max-size="16000000"
            @addedFile="(file) => uploadFile(file, 'first page')"
            required
            :error="paymentDetail.urlFirstPageError"
            @upload-failed="(val) => (modalUploadFailed = val)"
          />
          <UiSelect
            v-model="paymentDetail.currencyId"
            label="Currency"
            placeholder="Select"
            row
            required
            :options="currencyList"
            :error="paymentDetail.currencyIdError"
          />
          <div class="flex flex-col gap-6">
            <UiSelect
              v-model="paymentDetail.bankId"
              label="Bank Key"
              placeholder="Select"
              row
              :options="bankList"
              valueKey="bankKey"
              textKey="textLabel"
              :required="!paymentDetailFlagging.bankNotRegistered"
              :disabled="paymentDetailFlagging.bankNotRegistered"
              :error="paymentDetail.bankIdError"
            />

            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <div class="w-2/5"></div>
              <UiCheckbox
                v-model="paymentDetailFlagging.bankNotRegistered"
                label="Bank not registered"
              />
            </div>
          </div>
          <div class="flex flex-col gap-6">
            <UiInput
              v-if="paymentDetailFlagging.bankNotRegistered"
              v-model="paymentDetail.bankKey"
              label="Bank Key"
              placeholder="AMBV0"
              row
              required
              hint-text="*5 uppercase alphanumeric characters (e.g., AMBV0), must match official bank and unique."
              :error="paymentDetail.bankKeyError"
            />

            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <div class="w-2/5"></div>
              <div class="card bg-primary-light border border-primary w-full">
                <div class="card-body p-4">
                  <p class="text-sm">
                    For vendors whose banks are not registered yet, <br />
                    please contact the following email: <br />
                    Non-Marketing: <br />
                    <span class="text-primary">Laelani.Sabila@genero.co.id</span> <br /><br />

                    Marketing: <br />
                    <span class="text-primary">athaya.matanra@aryanoble.co.id</span> <br />
                    <span class="text-primary">putri.suryansyah@aryanoble.co.id</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <UiSelect
            v-if="paymentDetailFlagging.bankNotRegistered"
            v-model="paymentDetail.bankCountryCode"
            label="Bank Country"
            placeholder="Select"
            row
            :options="countryList"
            required
            :error="paymentDetail.bankCountryCodeError"
          />
          <UiInput
            v-if="paymentDetailFlagging.bankNotRegistered"
            v-model="paymentDetail.bankName"
            label="Bank Name"
            placeholder="Enter bank name"
            row
            required
            :error="paymentDetail.bankNameError"
          />
          <UiInput
            v-if="paymentDetailFlagging.bankNotRegistered"
            v-model="paymentDetail.branch"
            label="Bank Branch"
            placeholder="Enter bank branch"
            row
            required
            :error="paymentDetail.branchError"
          />
          <UiInput
            v-if="paymentDetailFlagging.bankNotRegistered"
            v-model="paymentDetail.swiftCode"
            label="SwiftCode"
            placeholder="SwiftCode"
            row
            required
            :error="paymentDetail.swiftCodeError"
          />
          <UiInput
            v-model="paymentDetail.bankAddress"
            label="Bank Address"
            placeholder="Enter bank address"
            row
            required
            :error="paymentDetail.bankAddressError"
          />
        </div>
      </div>

      <div class="card bg-gray-100">
        <div
          class="term-condition card-body flex flex-col gap-4 scrollable h-[635px] py-0 my-4 pr-4 mr-2"
          v-html="termCondition?.termCondition"
        ></div>
      </div>

      <UiCheckbox
        v-model="paymentDetailFlagging.acceptTermCondition"
        label="I have read and agree to the terms and conditions of PT Arya Noble’s e-Procurement system"
      />

      <div class="card w-fit justify-center">
        <div class="card-body px-5">
          <UiCaptcha v-model="paymentDetailFlagging.captcha" />
        </div>
      </div>

      <div class="card bg-primary-light border border-primary">
        <div class="card-body p-4 flex flex-row items-center gap-4 text-primary">
          <UiIcon variant="duotone" name="information" class="text-4xl" />

          <div class="flex flex-col gap-1">
            <span class="font-semibold text-primary">Note</span>
            <p class="font-medium text-sm">
              Vendors who wish to participate in tendering only need to register once. Please make
              sure all submitted data is valid. PT Arya Noble is not responsible for any
              consequences resulting from invalid or unverifiable vendor data, and such vendors may
              be subject to sanctions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalConfirmation
    :open="modalUploadFailed"
    id="payment-upload-error"
    type="danger"
    title="Upload Failed"
    text="File size exceeds the maximum limit of 16 MB. Please choose a smaller file."
    no-submit
    static
    :cancel="() => (modalUploadFailed = false)"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useUploadStore } from '@/stores/general/upload'

import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiCaptcha from '@/components/ui/atoms/captcha/UiCaptcha.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()
const uploadStore = useUploadStore()

const paymentDetail = computed(() => registrationVendorStore.paymentDetail)
const paymentDetailFlagging = computed(() => registrationVendorStore.paymentDetailFlagging)
const modalUploadFailed = ref<boolean>(false)

const termCondition = computed(() => vendorMasterDataStore.termCondition)
const bankList = computed(() =>
  vendorMasterDataStore.bankList.map((item) => ({
    ...item,
    textLabel: `${item.bankKey} - ${item.bankNameAccount}`,
  })),
)
const currencyList = computed(() =>
  vendorMasterDataStore.currencyList.map((item) => ({
    value: item.currencyCode,
    text: `${item.currencyName} (${item.currencyCode})`,
  })),
)
const countryList = computed(() =>
  vendorMasterDataStore.countryList.map((item) => ({
    value: item.countryCode,
    text: `${item.countryCode} - ${item.countryName}`,
  })),
)

const uploadFile = async (file: File, type: 'different account' | 'first page') => {
  try {
    const response = await uploadStore.uploadFile(file, 0)

    if (type === 'different account') {
      registrationVendorStore.paymentDetail.urlAccountDifferences = response.path
    }

    if (type === 'first page') {
      registrationVendorStore.paymentDetail.urlFirstPage = response.path
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  vendorMasterDataStore.getVendorTermCondition()
  vendorMasterDataStore.getVendorBanks()
  vendorMasterDataStore.getVendorCurrency()
  vendorMasterDataStore.getVendorCountries()
})
</script>

<style scoped>
::v-deep(.term-condition ol) {
  list-style-type: decimal !important;
  padding-left: 1rem !important;
}
::v-deep(.term-condition ul) {
  list-style-type: disc !important;
  padding-left: 1rem !important;
}
</style>
