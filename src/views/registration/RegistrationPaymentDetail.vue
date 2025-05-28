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
            label="No Rekening"
            placeholder="Masukkan no rekening"
            row
            required
            :error="paymentDetail.accountNoError"
          />

          <div class="flex flex-col gap-6">
            <UiInput
              v-model="paymentDetail.accountName"
              label="Nama Pemilik Akun"
              placeholder="Nama lengkap sesuai buku tabungan"
              row
              required
              :error="paymentDetail.accountNameError"
            />

            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <div class="w-2/5"></div>
              <UiCheckbox
                v-model="paymentDetailFlagging.isNotSameAsCompany"
                label="Nama pemilik rekening berbeda dengan nama perusahaan"
              />
            </div>
          </div>
          <UiFileUpload
            v-if="paymentDetailFlagging.isNotSameAsCompany"
            name="Pernyataan Perbedaan Rekening"
            label="Pernyataan Perbedaan Rekening"
            placeholder="Pilih"
            acceptedFiles=".pdf"
            @addedFile="(file) => uploadFile(file, 'different account')"
            required
            :error="paymentDetail.urlAccountDifferencesError"
          />
          <UiFileUpload
            v-if="paymentDetailFlagging.isNotSameAsCompany"
            name="Halaman Pertama Buku Tabungan"
            label="Halaman Pertama Buku Tabungan"
            placeholder="Pilih"
            acceptedFiles=".pdf"
            @addedFile="(file) => uploadFile(file, 'first page')"
            required
            :error="paymentDetail.urlFirstPageError"
          />
          <UiSelect
            v-model="paymentDetail.currencyId"
            label="Mata Uang"
            placeholder="Pilih"
            row
            required
            :options="currencyList"
            :error="paymentDetail.currencyIdError"
          />
          <div class="flex flex-col gap-6">
            <UiSelect
              v-model="paymentDetail.bankId"
              label="Bank Key"
              placeholder="Pilih"
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
                label="Bank belum terdaftar"
              />
            </div>
          </div>
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
          <UiInput
            v-if="paymentDetailFlagging.bankNotRegistered"
            v-model="paymentDetail.bankName"
            label="Nama Bank"
            placeholder="Nama Bank"
            row
            required
            :error="paymentDetail.bankNameError"
          />
          <UiInput
            v-if="paymentDetailFlagging.bankNotRegistered"
            v-model="paymentDetail.branch"
            label="Cabang Bank"
            placeholder="Cabang Bank"
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
            label="Alamat Bank"
            placeholder="Jl. ABC..."
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
        label="Baca dan setuju terhadap syarat dan ketentuan tender - eProcurement PT Arya Noble"
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
            <span class="font-semibold text-primary">Perhatian</span>
            <p class="font-medium text-sm">
              Vendor yang berminat mengikuti tender cukup satu kali registerasi dan pastikan data
              yang anda inputkan valid. Data calon vendor yang tidak bisa dipertanggung jawabkan
              dapat dikenakan sanksi oleh PT Arya Noble
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useUploadStore } from '@/stores/general/upload'

import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiCaptcha from '@/components/ui/atoms/captcha/UiCaptcha.vue'

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()
const uploadStore = useUploadStore()

const paymentDetail = computed(() => registrationVendorStore.paymentDetail)
const paymentDetailFlagging = computed(() => registrationVendorStore.paymentDetailFlagging)

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

onMounted(async () => {
  await vendorMasterDataStore.getVendorTermCondition()
  await vendorMasterDataStore.getVendorBanks()
  await vendorMasterDataStore.getVendorCurrency()
})
</script>
