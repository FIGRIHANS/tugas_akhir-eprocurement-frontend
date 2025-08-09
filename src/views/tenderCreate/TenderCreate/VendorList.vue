<template>
  <div v-if="form" class="border rounded-md p-[24px]">
    <div class="flex align-items-center justify-between mb-[24px]">
      <div class="input w-[250px]">
        <i class="ki-filled ki-magnifier"></i>
        <input v-model="search" placeholder="Cari data" type="text" />
      </div>
      <div>
        <button class="btn btn-primary" @click="showAddVendor">
          Add vendor
          <i class="ki-duotone ki-questionnaire-tablet"></i>
        </button>
      </div>
    </div>
    <div v-if="form.vendorList.length === 0" class="text-sm h-[120px] text-center text-gray-800">
      <p>You must add the vendor first.</p>
      <p>The vendor will be displayed here.</p>
    </div>
    <div v-else class="vendor-list__table">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="vendor-list__field-base !border-b-blue-500"
              :class="{
                'vendor-list__field-base--action': index === 0,
                'vendor-list__field-base--name': item === 'Vendor Name',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in form.vendorList" :key="data.id">
            <td>
              <button
                class="btn btn-icon btn-outline btn-danger w-[32px] h-[32px]"
                @click="deleteItem(index)"
              >
                <i class="ki-duotone ki-trash !text-lg"></i>
              </button>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-primary">
                {{ data.status }}
              </span>
            </td>
            <td>{{ data.vendorCode }}</td>
            <td>
              <span class="badge badge-pill badge-outline" :class="colorRank(data.rank)">
                {{ data.rank }}
              </span>
            </td>
            <td>{{ data.vendorName }}</td>
            <td>
              <span class="badge badge-pill badge-outline badge-warning">
                {{ data.totalScore }}
              </span>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-primary">
                {{ data.productQuality }}
              </span>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-success">
                {{ data.leadTimeSupply }}
              </span>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-primary">
                {{ data.afterSalesWarranty }}
              </span>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-primary">
                {{ data.orderAbsorption }}
              </span>
            </td>
            <td>{{ data.totalPo }}</td>
            <td>{{ data.yearlySpanding }}</td>
            <td>{{ data.currency }}</td>
            <td>{{ data.existingContract }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="form.vendorList.length !== 0" class="mt-[24px] text-sm">
      Tampilkan {{ form.vendorList.length }} data dari total data {{ form.vendorList.length }}
    </div>
    <AddVendorModal @setItem="setItemVendor" />
  </div>
  <section class="mt-[16px]">
    <UiButton @click="showAnalytic()">
      Vendor Smart Analysis <i class="ki-duotone ki-artificial-intelligence"></i
    ></UiButton>
  </section>
  <section v-if="showAnalysis !== false" name="smart-analysis scrollable-x-auto" class="mt-5">
    <table class="table-border text-gray-700 font-medium text-sm">
      <thead class="table-border">
        <tr>
          <th rowspan="4" class="header-category table-border">Nama</th>
          <th colspan="6" class="header-category table-border bg-blue-200">Kategori Analisis</th>
        </tr>
        <tr>
          <th colspan="2" class="header-category table-border">Profil Vendor</th>
          <th colspan="2" class="header-category table-border">Kinerja Umum</th>
          <th colspan="2" class="header-category table-border">Rekomendasi AI</th>
        </tr>
        <tr>
          <th colspan="6" class="header-category table-border bg-blue-200">Metrik Terstruktur</th>
        </tr>
        <tr>
          <th class="header-category table-border">Length of Services</th>
          <th class="header-category table-border">Total Spending</th>
          <th class="header-category table-border">KPI Utama (3 tahun)</th>
          <th class="header-category table-border">Kepatuhan SLA</th>
          <th class="header-category table-border">Analisis High-Level</th>
          <th class="header-category table-border">Analisis Negosiasi Kontrak</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in filteredAnalytic" :key="data.vendor_id">
          <td class="text-center">{{ data.vendor_name }}</td>
          <td class="text-center">{{ data.lengh_of_sevice }}</td>
          <td class="text-center">{{ data.total_spending }}</td>
          <td class="text-center">
            {{ data.main_kpi }}<br />
            <span class="badge badge-pill badge-outline badge-danger">{{ data.kpi_quality }}</span>
          </td>
          <td>
            Kualitas: {{ data.sla_quality }} <br />
            Pengiriman: {{ data.sla_delivery }}
          </td>
          <td>
            <strong>{{ data.risk }}</strong> {{ data.high_level }}
          </td>
          <td>
            {{ data.contract_negotiation }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, defineAsyncComponent } from 'vue'
import { KTModal } from '@/metronic/core'
import type { FormTypes } from '../types/tenderCreate'
import type { TableItemTypes } from '../types/vendorList'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const AddVendorModal = defineAsyncComponent(() => import('./VendorList/AddVendor.vue'))

const form = inject<FormTypes>('form')
const search = ref<string>('')
const showAnalysis = ref<boolean>(false)
const filteredAnalytic = ref<typeof analysisData.value>([])

const columns = reactive<string[]>([
  'Action',
  'Status',
  'Vendor Code',
  'Rank',
  'Vendor Name',
  'Total Score',
  'Product Quality',
  'Lead Time Supply',
  'After Sales Warranty',
  'Order Absorption',
  'Total PO',
  'Yearly Spending',
  'Currency',
  'Existing Contract',
])

const analysisData = ref([
  {
    vendor_id: '1',
    vendor_name: 'PT Walldorf Grosshandel Tbk',
    total_spending: '$100.000',
    lengh_of_sevice: '5 Tahun',
    main_kpi: 'Rata-rata 80%',
    kpi_quality: 'menurun',
    sla_quality: 'Buruk',
    sla_delivery: 'Baik',
    high_level:
      'Walaupun pengeluaran signifikan dan hubungan jangka panjang, kinerja menurun konsisten. Ada risiko finansial dan operasional jika tren ini berlanjut.',
    risk: 'Berisiko Tinggi.',
    contract_negotiation:
      'Harga: Negosiasikan untuk membekukan harga atau menuntut penurunan 3-5% SLA: Perkuat penalti untuk setiap insiden kualitas Term Condition: Tambahkan opsi pembatalan tanpa penalti jika kualitas tidak terpenuhi.',
  },
  {
    vendor_id: '2',
    vendor_name: 'PT Heilzenberg',
    total_spending: '$25.000',
    lengh_of_sevice: '1 Tahun',
    main_kpi: 'Rata-rata 95%',
    kpi_quality: 'Meningkat',
    sla_quality: 'Sabgat Baik',
    sla_delivery: 'Sangat Baik',
    high_level:
      ' Meskipun hubungan baru, performa yang solid dan kepatuhan yang tinggi menjadikannya kandidat ideal untuk proyek penting.',
    risk: 'Potensial Tinggi.',
    contract_negotiation:
      'Harga: Pertimbangkan untuk menawarkan diskon volume untuk mendorong pengeluaran yang lebih besar. SLA: Kunci standar SLA saat ini dalam kontrak jangka panjang Term Condition: Pertimbangkan perpanjangan kontrak otomatis sebagai insentif',
  },
  {
    vendor_id: '3',
    vendor_name: 'PT Surya Emas',
    total_spending: '$80.000',
    lengh_of_sevice: '3 tahun',
    main_kpi: 'Rata-rata 92%',
    kpi_quality: 'Stabil',
    sla_quality: 'Baik',
    sla_delivery: 'Buruk',
    high_level:
      'Memiliki rekam jejak yang stabil, namun masalah di area pengiriman menunjukkan adanya risiko operasional yang perlu ditangani.',
    risk: 'Perlu Diperhatikan',
    contract_negotiation:
      'Harga: Negosiasikan diskon kecil sebagai imbalan untuk komitmen perbaikan masalah pengiriman. SLA: Tambahkan target pengiriman yang lebih agresif dengan penalti yang jelas. Term Condition: Tambahkan klausul yang mewajibkan vendor menyediakan rencana perbaikan.',
  },
  // {
  //   vendor_id: '3',
  //   vendor_name: null,
  //   lengh_of_sevice: null,
  //   main_kpi: null,
  //   sla: null,
  //   high_level: null,
  //   contreact_negotiation: null,
  // },
])

const colorRank = (rank: string) => {
  const lib = {
    '1': 'badge-success',
    '2': 'badge-primary',
    '3': 'badge-warning',
    '4': 'badge-danger',
  } as { [key: string]: string }
  return lib[rank]
}

const showAnalytic = () => {
  if (form) {
    const vendorIds = form.vendorList.map((data) => data.id)
    filteredAnalytic.value = analysisData.value.filter((data) => vendorIds.includes(data.vendor_id))
    showAnalysis.value = true
  }
}

const deleteItem = (index: number) => {
  form?.vendorList.splice(index, 1)
}

const showAddVendor = () => {
  const idModal = document.querySelector('#add_vendor_tender_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const setItemVendor = (items: TableItemTypes[]) => {
  for (const data of items) {
    form?.vendorList.push({ ...data, isSelected: false })
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/vendorList.scss';
.header-category {
  text-align: center;
  font-weight: bold;
}
</style>
