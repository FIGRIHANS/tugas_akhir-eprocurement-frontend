<template>
  <div class="flex flex-rows justify-center gap-6 mb-3">
    <div class="w-2/3 flex flex-col items-center gap-6">
      <div class="card w-full">
        <div class="card-header">
          <h3 class="card-title">Payment Detail</h3>
        </div>

        <div class="card-body flex flex-col gap-6">
          <UiInput
            v-model="paymentDetail.noRekening"
            label="No Rekening"
            placeholder="Masukkan no rekening"
            row
            required
            :error="paymentDetail.noRekeningError"
          />

          <div class="flex flex-col gap-6">
            <UiInput
              v-model="paymentDetail.namaPemilikAkun"
              label="Nama Pemilik Akun"
              placeholder="Nama lengkap sesuai buku tabungan"
              row
              required
              :error="paymentDetail.namaPemilikAkunError"
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
            label="Pernyataan Perbedaan Rekening"
            placeholder="Pilih"
            acceptedFiles=".pdf"
            @addedFile="(file) => uploadFile(file, 'different account')"
            required
            :error="paymentDetail.perbedaanRekeningError"
          />
          <UiFileUpload
            v-if="paymentDetailFlagging.isNotSameAsCompany"
            label="Halaman Pertama Buku Tabungan"
            placeholder="Pilih"
            acceptedFiles=".pdf"
            @addedFile="(file) => uploadFile(file, 'first page')"
            required
            :error="paymentDetail.halamanPertamaError"
          />
          <UiFileUpload
            label="Surat pernyataan rekening bank"
            placeholder="Pilih"
            acceptedFiles=".pdf"
            required
            hint-text="*Informasi surat pernyataan harus ada KOP surat dan tanda tangan direktur"
            @addedFile="(file) => uploadFile(file, 'statement letter')"
            :error="paymentDetail.suratPernyataanError"
          />
          <UiSelect
            v-model="paymentDetail.mataUang"
            label="Mata Uang"
            placeholder="Pilih"
            row
            required
            :options="currencyList"
            :error="paymentDetail.mataUangError"
          />
          <div class="flex flex-col gap-6">
            <UiSelect
              v-model="paymentDetail.bankKey"
              label="Bank Key"
              placeholder="Pilih"
              row
              :options="bankList"
              valueKey="bankCode"
              textKey="bankName"
              :required="!paymentDetailFlagging.bankNotRegistered"
              :disabled="paymentDetailFlagging.bankNotRegistered"
              :error="paymentDetail.bankKeyError"
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
            v-model="paymentDetail.namaBank"
            label="Nama Bank"
            placeholder="Nama Bank"
            row
            required
            :error="paymentDetail.namaBankError"
          />
          <UiInput
            v-if="paymentDetailFlagging.bankNotRegistered"
            v-model="paymentDetail.cabangBank"
            label="Cabang Bank"
            placeholder="Cabang Bank"
            row
            required
            :error="paymentDetail.cabangBankError"
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
            v-model="paymentDetail.alamatBank"
            label="Alamat Bank"
            placeholder="Jl. ABC..."
            row
            required
            :error="paymentDetail.alamatBankError"
          />
        </div>
      </div>

      <div class="card bg-gray-100">
        <div class="card-body flex flex-col gap-4 scrollable h-[635px] py-0 my-4 pr-4 mr-2">
          <h3 class="card-title">Syarat dan Ketentuan</h3>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget nibh pulvinar,
            commodo tellus non, molestie orci. Cras ac euismod diam. Integer ornare ipsum dolor, sed
            euismod diam sagittis a. Praesent dapibus vestibulum massa, id sollicitudin leo iaculis
            eu. Nunc blandit, quam eget sodales faucibus, quam erat lobortis orci, quis rhoncus sem
            est id tortor. Vestibulum tempor velit non nibh fringilla, volutpat tristique ex
            pulvinar. Morbi lacinia purus placerat sapien posuere, a convallis leo dictum. Vivamus
            tristique massa ut porttitor interdum. Aliquam finibus ante ac justo tincidunt auctor.
            Duis nec elit libero. Sed eget diam eget velit posuere elementum. Vivamus finibus libero
            quis dapibus ultrices.
          </p>

          <p>
            Vestibulum non quam a velit volutpat laoreet ut sed metus. Quisque quis blandit libero,
            et efficitur justo. Fusce sagittis libero non lacus laoreet, ac hendrerit lorem
            elementum. Aliquam consequat nisl odio, vel rhoncus sapien rutrum ac. Donec ut tempus
            tellus, ac consectetur enim. Sed mollis, nisl quis luctus lobortis, est orci facilisis
            sapien, vulputate dignissim elit libero vel massa. Vestibulum imperdiet elit ut ornare
            mollis. Integer a mauris urna. Donec cursus urna vitae nulla posuere, et tempor mauris
            elementum. Nullam libero magna, imperdiet a molestie convallis, posuere ut neque.
          </p>

          <p>
            Aliquam diam tellus, fringilla et convallis eu, viverra sit amet mauris. Nam a aliquam
            nisi. Cras finibus accumsan lacus, at fermentum magna lobortis sed. Curabitur dui urna,
            auctor vel pretium in, euismod eget justo. In diam neque, convallis non tristique ac,
            placerat vel libero. Aliquam lacinia justo sit amet laoreet elementum. Sed dignissim,
            nulla eget posuere varius, nunc lorem dignissim sapien, non tempor diam ante eu quam.
          </p>

          <p>
            Duis maximus, felis non consectetur vulputate, dolor lacus scelerisque risus, sed
            finibus lectus nulla eu erat. Etiam interdum at nunc nec feugiat. Donec sagittis magna
            turpis, id maximus velit pulvinar sit amet. Sed dapibus facilisis lobortis. Donec ac
            luctus dolor. Suspendisse gravida aliquet diam, sed vehicula tortor pretium at. Donec
            convallis magna eget nibh viverra vehicula. Phasellus efficitur euismod massa, eget
            gravida ligula convallis id. Curabitur sollicitudin id tortor a luctus. Etiam ipsum
            urna, rhoncus non lectus sed, scelerisque facilisis ligula. Quisque rutrum, nunc nec
            semper viverra, purus dolor mattis dui, sit amet placerat nisi libero in augue. Mauris
            egestas, velit vel tincidunt ornare, nibh justo bibendum felis, dapibus semper lectus
            tellus sit amet metus. Vestibulum egestas eros eu aliquam ultricies.
          </p>

          <p>
            Pellentesque dictum euismod nulla a posuere. Mauris ullamcorper dolor ante. Sed in
            ligula eget tortor aliquet dapibus et eleifend nibh. Donec a accumsan metus, eget
            pharetra ligula. Nullam fermentum turpis eget velit rhoncus vestibulum. Integer rutrum
            arcu quis condimentum varius. Donec aliquam hendrerit quam vel scelerisque. Nunc vel
            orci aliquet, gravida ex nec, dapibus nunc. Nullam gravida tellus ut ante tempus
            tristique. Etiam interdum molestie eros, ac semper ipsum. Duis et tellus dictum, tempus
            dui vel, viverra diam. Maecenas a metus nec velit luctus volutpat. Donec luctus, ligula
            ac sagittis lobortis, leo est egestas eros, sit amet blandit tellus ipsum vitae turpis.
          </p>
        </div>
      </div>

      <UiCheckbox
        v-model="paymentDetailFlagging.acceptTermCondition"
        label="Baca dan setuju terhadap syarat dan ketentuan tender - eProcurement PT Datesea"
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
              dapat dikenakan sanksi oleh PT Datasea
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiCaptcha from '@/components/ui/atoms/captcha/UiCaptcha.vue'

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()

const paymentDetail = computed(() => registrationVendorStore.paymentDetail)
const paymentDetailFlagging = computed(() => registrationVendorStore.paymentDetailFlagging)

const bankList = computed(() => vendorMasterDataStore.bankList)
const currencyList = computed(() =>
  vendorMasterDataStore.currencyList.map((item) => ({
    value: item.currencyCode,
    text: `${item.currencyName} (${item.currencyCode})`,
  })),
)

const uploadFile = async (
  file: File,
  type: 'different account' | 'first page' | 'statement letter',
) => {
  try {
    const response = await vendorMasterDataStore.uploadFile({
      FormFile: file,
      Actioner: 'anonym',
      FolderName: 'registration',
      FileName: file.name,
    })

    if (type === 'different account') {
      registrationVendorStore.paymentDetail.perbedaanRekening = response.url
    }

    if (type === 'first page') {
      registrationVendorStore.paymentDetail.halamanPertama = response.url
    }

    if (type === 'statement letter') {
      registrationVendorStore.paymentDetail.suratPernyataan = response.url
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await vendorMasterDataStore.getVendorBanks()
  await vendorMasterDataStore.getVendorCurrency()
})
</script>
