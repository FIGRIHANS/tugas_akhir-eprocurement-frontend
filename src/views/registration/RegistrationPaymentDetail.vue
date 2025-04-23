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
        <!-- <div class="card-body flex flex-col gap-4 scrollable h-[635px] py-0 my-4 pr-4 mr-2">
          <h2 class="card-title">Mohon Diperhatikan!</h2>
          <p class="font-medium">
            Syarat dan Ketentuan dalam Sistem E-Procurement PT Arya Noble untuk Vendor
          </p>
          <p>Dengan ini:</p>
          <ol class="list-decimal pl-4">
            <li>
              Mengajukan permohonan keikutsertaan untuk menjadi penyedia barang/jasa dalam sistem
              E-Procurement PT Arya Noble yang selanjutnya dalam surat pernyataan ini disebut
              sebagai vendor.
            </li>
            <li>
              Bersedia memberikan segala dokumen dan informasi yang benar, masih berlaku, dan sah
              secara hukum dari Perusahaan. Bilamana dikemudian hari ditemukan bahwa dokumen dan
              informasi yang kami berikan tidak benar dan tidak sah, maka kami bersedia dikenakan
              sanksi moral dan sanksi administrasi, dikeluarkan dari “Daftar Vendor” dalam sistem
              E-Procurement PT Arya Noble, serta dituntut ganti rugi dan/atau pidana sesuai dengan
              ketentuan dan peraturan perundang-undangan yang berlaku.
            </li>
            <li>
              Bersedia mematuhi dan melaksanakan persyaratan, ketentuan, prosedur maupun instruksi
              yang berlaku bagi vendor.
            </li>
            <li>Mengakui integritas proses E-Procurement PT Arya Noble.</li>
            <li>
              Bersedia berpartisipasi atau turut serta dalam proses tender yang dilaksanakan melalui
              sistem E-Procurement PT Arya Noble.
            </li>
            <li>
              Menyetujui bahwa user ID dan password yang diperoleh merupakan representasi vendor
              atas segala aktivitas dalam sistem E-Procurement PT Arya Noble.
            </li>
            <li>
              Sebagai vendor bertanggung jawab untuk menjaga kerahasiaan user ID dan password, serta
              bertanggung jawab penuh untuk semua aktivitas yang dilakukan dengan menggunakan user
              ID dan password yang dimaksud.
            </li>
            <li>
              Membebaskan PT Arya Noble beserta para stafnya dari:
              <ul class="list-disc pl-4">
                <li>Setiap penyalahgunaan user ID dan password dari vendor.</li>
                <li>
                  Setiap kerusakan dan/atau kerugian baik langsung maupun tidak langsung, namun
                  tidak terbatas pada kehilangan keuntungan, kegunaan data, atau kerugian
                  non-material yang ditimbulkan oleh:
                  <ul class="list-disc pl-4">
                    <li>Penggunaan atau ketidakmampuan menggunakan sistem.</li>
                    <li>Penggunaan akses yang tidak sah maupun pengiriman data.</li>
                    <li>Pernyataan atau tindakan dari pihak ketiga dalam sistem.</li>
                    <li>Hal-hal yang berhubungan dengan sistem.</li>
                  </ul>
                </li>
                <li>
                  Setiap tuntutan dari pihak ketiga sehubungan dengan proses e-procurement dan atau
                  keterangan/dokumen yang dimasukkan oleh vendor ke dalam sistem atau melalui
                  sistem.
                </li>
                <li>
                  Setiap penggunaan dan/atau penyambungan sistem di luar ketentuan oleh vendor.
                </li>
                <li>
                  Setiap pelanggaran atas Syarat dan Ketentuan serta instruksi-instruksi dari PT
                  Arya Noble atau pelanggaran terhadap hak-hak pihak lain.
                </li>
                <li>
                  Kegagalan pelaksanaan sistem E-Procurement yang disebabkan oleh keadaan kahar
                  (force majeure) yaitu sesuatu yang di luar kekuasaan PT Arya Noble dan termasuk
                  juga namun tidak terbatas pada bencana alam, pemogokan, huru-hara, perang,
                  penyakit menular, peraturan-peraturan pemerintah yang diterapkan setelah kejadian,
                  kebakaran, kegagalan/kerusakan saluran telekomunikasi, ketiadaan tenaga listrik,
                  gempa bumi, atau kejadian-kejadian malapetaka lainnya.
                </li>
              </ul>
            </li>
            <li>
              Bersedia terikat dan menghargai seluruh proses yang berjalan beserta dokumen yang
              sudah diserahkan selama kegiatan E-Procurement.
            </li>
            <li>
              Bersedia untuk tidak membuka, mengeluarkan maupun memberikan setiap informasi dan data
              kepada pihak ketiga, dan/atau penggunaannya dengan cara bagaimanapun oleh vendor baik
              langsung maupun tidak langsung terhadap setiap informasi dan data yang berhubungan
              dengan kegiatan E-Procurement PT Arya Noble.
            </li>
            <li>
              Vendor sebagai pemilik user ID dan password mengakui bahwa pengiriman data/penawaran
              yang dilakukan melalui sistem E-Procurement PT Arya Noble merupakan proses yang sah
              secara hukum.
            </li>
            <li>
              Mengakui bahwa data dan/atau catatan-catatan yang valid dan sah untuk dasar evaluasi
              proses tender adalah data dan/atau catatan-catatan yang terekam (recorded) di dalam
              server sistem E-Procurement PT Arya Noble.
            </li>
          </ol>
        </div> -->
        <div
          class="term-condition card-body flex flex-col gap-4 scrollable h-[635px] py-0 my-4 pr-4 mr-2"
          v-html="termCondition?.termCondition"
        ></div>
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

const termCondition = computed(() => vendorMasterDataStore.termCondition)
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
  await vendorMasterDataStore.getVendorTermCondition()
  await vendorMasterDataStore.getVendorBanks()
  await vendorMasterDataStore.getVendorCurrency()
})
</script>
