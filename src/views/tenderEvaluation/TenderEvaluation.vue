<template>
  <div>
    <Breadcrumb title="Evaluation" :routes="routes" />
    <div class="border rounded-lg p-[24px]">
      <StepperStatusTender activeName="Vendor Awarding" />
    </div>
    <div class="mt-[24px] border rounded-lg p-[24px]">
      <AwardingDraft :data="tenderEvoStore.dummyData" @updateCount="updateData" />
    </div>
    <div class="mt-[24px] border rounded-lg p-[24px]">
      <VendorTable :data="dummyData" />
    </div>
    <div class="mt-[24px] border rounded-lg p-[24px]">
      <DetailVendorTable
        :data="dummyDataDetail"
        :columns-parent="columns"
        :columns-child="childColumns"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import VendorTable from './TenderEvaluation/VendorTable.vue'
import DetailVendorTable from './TenderEvaluation/DetailVendorTable.vue'
import StepperStatusTender from '@/components/stepperStatusTender/StepperStatusTender.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import type { VendorListTypes, DetailVendorParentTypes } from './types/tenderEvaluation'
import { useTenderEvoStore } from '@/stores/tender-evo/tenderNegotiation'
import AwardingDraft from '../tenderReportNegotiation/tenderReportNegotiation/AwardingDraft.vue'

const tenderEvoStore = useTenderEvoStore()

const updateData = (row: any, bid: any) => {
  tenderEvoStore.updateQty(row, bid)
}

const routes = ref<routeTypes[]>([
  {
    name: 'Evaluation',
    to: '/tender/evaluation',
  },
])

const dummyData = ref<VendorListTypes[]>([
  {
    id: 1,
    vendorCode: '1060',
    rank: 1,
    vendorName: 'PT Walldorf Grosshandel Tbk',
    totalScore: 0,
    technicalEvaluation: 0,
    commercialEvaluation: 0,
    totalGrossAmount: 171000,
    vendorDisc: '30%',
    discAmout: 51300,
    totalNettAmount: 119700,
    remarks: 'Tahun kedua akan increase 10% tapi memasukkan parameter inflasi',
  },
  {
    id: 2,
    vendorCode: '2983',
    rank: 2,
    vendorName: 'PT Sommer GmbHTbk',
    totalScore: 0,
    technicalEvaluation: 0,
    commercialEvaluation: 0,
    totalGrossAmount: 171000,
    vendorDisc: '25%',
    discAmout: 42750,
    totalNettAmount: 128250,
    remarks: 'Tahun kedua ada kemungkinan increase 5%',
  },
  {
    id: 3,
    vendorCode: '8765',
    rank: 3,
    vendorName: 'PT Kreutzschmid KgaA Tbk',
    totalScore: 0,
    technicalEvaluation: 0,
    commercialEvaluation: 0,
    totalGrossAmount: 171000,
    vendorDisc: '20%',
    discAmout: 34200,
    totalNettAmount: 136800,
    remarks: 'Dapat melakukan fixed rate 3 Years',
  },
])

const dummyDataDetail = ref<DetailVendorParentTypes[]>([
  {
    id: 1,
    evaluationType: 'Technical Evaluation',
    evaluationItem: '',
    weight: '60%',
    description: '',
    expectedSla: '',
    isOpenChild: false,
    children: [
      {
        evaluationItem: 'Kualitas Produk/Layanan',
        weight: '20%',
        description:
          'Kualitas produk atau layanan yang diberikan, bebas dari cacat atau kesalahan.',
        expectedSla: 'Tingkat cacat (defect rate) < 1%',
      },
      {
        evaluationItem: 'Ketepatan Waktu Pengiriman',
        weight: '15%',
        description: 'Kepatuhan vendor terhadap jadwal pengiriman yang telah disepakati.',
        expectedSla: 'Tingkat pengiriman tepat waktu > 98%',
      },
      {
        evaluationItem: 'Kepatuhan SLA',
        weight: '15%',
        description: 'Kepatuhan terhadap semua persyaratan SLA lainnya dalam kontrak.',
        expectedSla: 'Tingkat kepatuhan keseluruhan > 95%',
      },
      {
        evaluationItem: 'Komunikasi & Responsivitas',
        weight: '10%',
        description:
          'Seberapa cepat dan efektif vendor merespons pertanyaan, masalah, atau permintaan.',
        expectedSla: 'Waktu respons (response time) < 2 jam kerja',
      },
      {
        evaluationItem: 'Manajemen Masalah',
        weight: '10%',
        description: 'Efektivitas vendor dalam menyelesaikan masalah yang muncul.',
        expectedSla: 'Waktu penyelesaian (resolution time) < 24 jam kerja',
      },
      {
        evaluationItem: 'Inovasi & Peningkatan',
        weight: '10%',
        description: 'Kemampuan vendor untuk memberikan ide atau solusi baru untuk peningkatan.',
        expectedSla: 'Minimal 1 ide inovasi per tahun',
      },
      {
        evaluationItem: 'Kepatuhan Regulasi',
        weight: '10%',
        description: 'Kepatuhan vendor terhadap semua peraturan dan standar industri yang berlaku.',
        expectedSla: 'Nol pelanggaran regulasi',
      },
    ],
  },
  {
    id: 2,
    evaluationType: 'Commercial Evaluation',
    evaluationItem: '',
    weight: '40%',
    description: '',
    expectedSla: '',
    isOpenChild: false,
    children: [
      {
        evaluationItem: 'Dukungan Teknis',
        weight: '10%',
        description: 'Ketersediaan dan kualitas dukungan teknis yang diberikan.',
        expectedSla: 'Ketersediaan dukungan 24/7',
      },
      {
        evaluationItem: 'Stabilitas Keuangan',
        weight: '20%',
        description: 'Kesehatan dan stabilitas keuangan vendor untuk memastikan keberlanjutan.',
        expectedSla: 'Tidak ada masalah hukum/finansial besar',
      },
      {
        evaluationItem: 'Struktur Biaya',
        weight: '15%',
        description: 'Kejelasan dan transparansi struktur biaya yang ditawarkan.',
        expectedSla: 'Rincian biaya transparan dan terperinci',
      },
      {
        evaluationItem: 'Termin Pembayaran',
        weight: '15%',
        description: 'Fleksibilitas dan syarat pembayaran yang ditawarkan.',
        expectedSla: 'Termin pembayaran 30 hari',
      },
      {
        evaluationItem: 'Prakiraan Biaya',
        weight: '10%',
        description: 'Akurasi vendor dalam memperkirakan biaya di awal.',
        expectedSla: 'Akurasi prakiraan biaya > 95%',
      },
      {
        evaluationItem: 'Nilai Tambah',
        weight: '10%',
        description: 'Layanan atau fitur tambahan yang diberikan tanpa biaya ekstra.',
        expectedSla: 'Diskon volume > 5%',
      },
      {
        evaluationItem: 'Fleksibilitas Harga',
        weight: '5%',
        description: 'Kesediaan vendor untuk negosiasi harga.',
        expectedSla: 'Bersedia negosiasi ulang setiap tahun',
      },
      {
        evaluationItem: 'Diskon Volume',
        weight: '15%',
        description: 'Ketersediaan diskon untuk pembelian dalam jumlah besar.',
        expectedSla: 'Diskon volume untuk setiap kenaikan 10%',
      },
    ],
  },
])

const columns = ref<string[]>([
  '',
  'Evaluation Type',
  'Evaluation Item',
  'Weight',
  'Description',
  'Expected SLA',
])

const childColumns = ref<string[]>(['Evaluation Item', 'Weight', 'Description', 'Expected SLA'])

const addVendorToDetail = () => {
  for (const item of dummyData.value) {
    columns.value.push(item.vendorName)
    childColumns.value.push('Rate')
    childColumns.value.push('Score')
    for (const subItem of dummyDataDetail.value) {
      subItem[`totalRate_${item.vendorCode}`] = 0
      subItem[`totalScore_${item.vendorCode}`] = 0

      for (const subItemChild of subItem.children) {
        subItemChild[`rate_${item.vendorCode}`] = 0
        subItemChild[`score_${item.vendorCode}`] = 0
      }
    }
  }
}

watch(
  () => dummyDataDetail.value,
  () => {
    for (const item of dummyData.value) {
      for (const [index, subItem] of dummyDataDetail.value.entries()) {
        let totalRate = 0
        let totalScore = 0

        for (const subItemChild of subItem.children) {
          const getRate = subItemChild[`rate_${item.vendorCode}`]
          const getScore = subItemChild[`score_${item.vendorCode}`]
          totalRate += Number(getRate)
          totalScore += Number(getScore)
        }
        subItem[`totalRate_${item.vendorCode}`] = totalRate
        subItem[`totalScore_${item.vendorCode}`] = totalScore

        if (index === 0) {
          item.technicalEvaluation = totalScore
        } else {
          item.commercialEvaluation = totalScore
        }
      }
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => dummyData.value,
  () => {
    for (const item of dummyData.value) {
      item.totalScore = item.technicalEvaluation + item.commercialEvaluation
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(() => {
  addVendorToDetail()
})
</script>

<style lang="scss" scoped>
@use './styles/tenderEvaluation.scss';
</style>
