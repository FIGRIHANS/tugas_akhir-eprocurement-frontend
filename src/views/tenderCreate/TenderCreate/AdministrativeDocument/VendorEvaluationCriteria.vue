<template>
  <div class="border rounded-xl">
    <div v-if="!props.isManual" class="py-[10px] px-[24px] flex align-items-center">
      <label class="form-label max-w-fit h-fit self-center mr-[24px] text-xs">
        Select Automatic Criteria
      </label>
      <select v-model="selectedTemplate" class="select w-[227px]">
        <option v-for="item of dummyOption" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="criteria__table">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="criteria__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
              :class="{
                'criteria__field-base--description': item === 'Item Description',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) of result" :key="index">
            <td>
              <button
                v-if="isManual"
                class="btn btn-icon btn-outline btn-danger w-[32px] h-[32px]"
                @click="deleteItem(index)"
              >
                <i class="ki-duotone ki-trash !text-lg"></i>
              </button>
            </td>

            <td>
              <div v-if="isManual">
                <UiInput v-model="data.evaluationType" />
              </div>
              <span v-else>{{ data.evaluationType }}</span>
            </td>
            <td>
              <div v-if="isManual">
                <UiSelect
                  v-model="data.evaluationObject"
                  :options="dummyOption"
                  text-key="name"
                  value-key="id"
                  class="w-[150px]"
                />
              </div>
              <span v-else>{{ data.evaluationObject }}</span>
            </td>
            <td>
              <div v-if="isManual">
                <UiInput v-model="data.evaluationItem" />
              </div>
              <span v-else>{{ data.evaluationItem }}</span>
            </td>
            <td>
              <div v-if="isManual">
                <UiInput v-model="data.weight" />
              </div>
              <span v-else>{{ data.weight }}</span>
            </td>
            <td>
              <div v-if="isManual">
                <UiInput v-model="data.description" />
              </div>
              <span v-else>{{ data.description }}</span>
            </td>
            <td>
              <div v-if="isManual">
                <UiInput v-model="data.expectedSla" />
              </div>
              <span v-else>{{ data.expectedSla }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button v-if="props.isManual" class="btn btn-primary my-[10px] mx-[24px]" @click="addNewLine">
      Add Criteria
      <i class="ki-duotone ki-plus-circle"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { CriteriaTypes } from '../../types/tenderCreate'

import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'

const props = defineProps<{
  modelValue: CriteriaTypes[]
  isManual?: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const selectedTemplate = ref<string>('')
const result = ref<CriteriaTypes[]>([])

const dummyOption = ref([
  {
    id: '1',
    name: 'Raw Material',
    children: [
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Kualitas Produk\/Layanan',
        weight: '20%',
        description:
          'Kualitas produk atau layanan yang diberikan, bebas dari cacat atau kesalahan.',
        expectedSla: 'Tingkat cacat (defect rate) < 1%',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Ketepatan Waktu Pengiriman',
        weight: '15%',
        description: 'Kepatuhan vendor terhadap jadwal pengiriman yang telah disepakati.',
        expectedSla: 'Tingkat pengiriman tepat waktu > 98%',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Kepatuhan SLA',
        weight: '15%',
        description: 'Kepatuhan terhadap semua persyaratan SLA lainnya dalam kontrak.',
        expectedSla: 'Tingkat kepatuhan keseluruhan > 95%',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Komunikasi & Responsivitas',
        weight: '10%',
        description:
          'Seberapa cepat dan efektif vendor merespons pertanyaan, masalah, atau permintaan.',
        expectedSla: 'Waktu respons (response time) < 2 jam kerja',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Manajemen Masalah',
        weight: '10%',
        description: 'Efektivitas vendor dalam menyelesaikan masalah yang muncul.',
        expectedSla: 'Waktu penyelesaian (resolution time) < 24 jam kerja',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Inovasi & Peningkatan',
        weight: '10%',
        description: 'Kemampuan vendor untuk memberikan ide atau solusi baru untuk peningkatan.',
        expectedSla: 'Minimal 1 ide inovasi per tahun',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Kepatuhan Regulasi',
        weight: '10%',
        description: 'Kepatuhan vendor terhadap semua peraturan dan standar industri yang berlaku.',
        expectedSla: 'Nol pelanggaran regulasi',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Dukungan Teknis',
        weight: '10%',
        description: 'Ketersediaan dan kualitas dukungan teknis yang diberikan.',
        expectedSla: 'Ketersediaan dukungan 24\/7',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Kompetitif Harga',
        weight: '20%',
        description: 'Perbandingan harga vendor dengan harga pasar atau vendor lain.',
        expectedSla: 'Harga di bawah rata-rata pasar 5%',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Stabilitas Keuangan',
        weight: '20%',
        description: 'Kesehatan dan stabilitas keuangan vendor untuk memastikan keberlanjutan.',
        expectedSla: 'Tidak ada masalah hukum\/finansial besar',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Struktur Biaya',
        weight: '15%',
        description: 'Kejelasan dan transparansi struktur biaya yang ditawarkan.',
        expectedSla: 'Rincian biaya transparan dan terperinci',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Termin Pembayaran',
        weight: '15%',
        description: 'Fleksibilitas dan syarat pembayaran yang ditawarkan.',
        expectedSla: 'Termin pembayaran 30 hari',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Prakiraan Biaya',
        weight: '10%',
        description: 'Akurasi vendor dalam memperkirakan biaya di awal.',
        expectedSla: 'Akurasi prakiraan biaya > 95%',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Nilai Tambah',
        weight: '10%',
        description: 'Layanan atau fitur tambahan yang diberikan tanpa biaya ekstra.',
        expectedSla: 'Diskon volume > 5%',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Fleksibilitas Harga',
        weight: '5%',
        description: 'Kesediaan vendor untuk negosiasi harga.',
        expectedSla: 'Bersedia negosiasi ulang setiap tahun',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Raw Material',
        evaluationItem: 'Diskon Volume',
        weight: '5%',
        description: 'Ketersediaan diskon untuk pembelian dalam jumlah besar.',
        expectedSla: 'Diskon volume untuk setiap kenaikan 10%',
      },
    ],
  },
  {
    id: '2',
    name: 'Fixed Asset',
    children: [
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Harga Beli Mesin',
        weight: '30%',
        description: 'Harga total mesin, dibandingkan dengan harga pasar dan pesaing.',
        expectedSla: 'Harga < 5% dari rata-rata pasar.',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Biaya Kepemilikan (TCO)',
        weight: '20%',
        description:
          'Analisis biaya total kepemilikan, termasuk biaya perawatan, suku cadang, dan energi.',
        expectedSla: 'Biaya perawatan tahunan < 5% dari harga beli.',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Stabilitas Keuangan Vendor',
        weight: '15%',
        description:
          'Kesehatan keuangan vendor untuk menjamin keberlanjutan dukungan jangka panjang.',
        expectedSla: 'Laporan keuangan audit 3 tahun terakhir stabil.',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Termin Pembayaran',
        weight: '15%',
        description: 'Fleksibilitas dan syarat pembayaran yang ditawarkan.',
        expectedSla: 'Termin pembayaran 90 hari setelah instalasi.',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Nilai Investasi',
        weight: '10%',
        description: 'Estimasi nilai jual kembali atau umur ekonomis mesin.',
        expectedSla: 'Umur ekonomis mesin > 10 tahun.',
      },
      {
        evaluationType: 'Technical Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Fleksibilitas Negosiasi',
        weight: '10%',
        description: 'Kesediaan vendor untuk negosiasi harga, garansi, dan termin.',
        expectedSla: 'Bersedia negosiasi minimal 3 poin kontrak.',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Kualitas Mesin',
        weight: '30%',
        description: 'Kualitas, durabilitas, dan spesifikasi teknis mesin sesuai kontrak.',
        expectedSla: 'Tingkat kegagalan (failure rate) < 1% dalam tahun pertama.',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Ketepatan Waktu Pengiriman',
        weight: '20%',
        description: 'Kepatuhan vendor pada jadwal pengiriman dan instalasi mesin.',
        expectedSla: 'Pengiriman dan instalasi selesai 100% tepat waktu.',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Dukungan & Pelatihan',
        weight: '15%',
        description: 'Kualitas pelatihan yang diberikan kepada operator dan tim teknis.',
        expectedSla: 'Menyediakan 40 jam pelatihan teknis.',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Garansi & Layanan Purna Jual',
        weight: '15%',
        description: 'Kejelasan dan cakupan garansi serta layanan purna jual yang ditawarkan.',
        expectedSla: 'Waktu respons perbaikan < 24 jam.',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Dokumentasi Teknis',
        weight: '10%',
        description: 'Kelengkapan dan kejelasan manual, panduan teknis, dan sertifikasi.',
        expectedSla: 'Seluruh dokumen teknis lengkap saat serah terima.',
      },
      {
        evaluationType: 'Commercial Evaluation',
        evaluationObject: 'Fixed Asset',
        evaluationItem: 'Keselamatan',
        weight: '10%',
        description: 'Kepatuhan mesin terhadap standar keselamatan industri yang berlaku.',
        expectedSla: 'Sertifikasi keselamatan (misalnya, CE, ANSI) lengkap.',
      },
    ],
  },
  {
    id: '3',
    name: 'Services',
    children: [],
  },
  {
    id: '4',
    name: 'Labor & Supply',
    children: [],
  },
  {
    id: '5',
    name: 'Finished Product',
    children: [],
  },
  {
    id: '6',
    name: 'Safety Tools',
    children: [],
  },
])

const columns = ref<string[]>([
  'Action',
  'Evaluation Type',
  'Evaluation Object',
  'Evaluation Item',
  'Weight',
  'Description',
  'Expected SLA',
])

const addNewLine = () => {
  const data = {
    evaluationType: '',
    evaluationObject: '',
    evaluationItem: '',
    weight: '',
    description: '',
    expectedSla: '',
  }
  result.value.push(data)
}

const deleteItem = (index: number) => {
  result.value.splice(index, 1)
}

watch(
  () => props.modelValue,
  () => {
    result.value = props.modelValue
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => result.value,
  () => {
    emits('update:modelValue', result.value)
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => selectedTemplate.value,
  () => {
    const index = dummyOption.value.findIndex((item) => item.id === selectedTemplate.value)
    if (index !== -1) {
      result.value = dummyOption.value[index].children
    }
  },
  {
    immediate: true,
  },
)
</script>
