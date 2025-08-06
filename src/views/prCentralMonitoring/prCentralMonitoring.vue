<template>
  <div>
    <Breadcrumb title="PR Central Monitoring" :routes="routes" />
    <section name="chart" class="flex flex-row gap-[24px]">
      <ChartCard name="Open" :data="chardData"/>
      <ChartCard name="Tender Progress" :data="chardData2"/>
      <ChartCard name="Tender Closed" :data="chardData3"/>
      <ChartCard name="SAP PO Created" :data="chardData"/>
    </section>
    <section v-if="isFiltering">
        <div class="flex flex-row mt-[24px] align-center p-[8px] gap-[24px]">
            <span class="text-black text-xl">Filter</span>

            <div v-if="filter.purchReq != ''" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
                <span>Purch Req</span>
                <span class="text-black">{{ filter.purchReq }}</span>
                <button class="text-gray-500 hover:text-gray-700 focus:outline-none" @click="filter.purchReq = '', isFiltering = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="filter.prScenario != ''" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
                <span>PR Scenario</span>
                <span class="text-black">{{ filter.prScenario }}</span>
                <button class="text-gray-500 hover:text-gray-700 focus:outline-none" @click="filter.prScenario = '', isFiltering = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div  v-if="filter.tenderSattus != ''" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
                <span>Tender Status</span>
                <span class="text-black">{{ filter.tenderSattus }}</span>
                <button class="text-gray-500 hover:text-gray-700 focus:outline-none" @click="filter.tenderSattus = '', isFiltering = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="filter.materialNo != ''" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
                <span>Material No</span>
                <span class="text-black">{{ filter.materialNo }}</span>
                <button class="text-gray-500 hover:text-gray-700 focus:outline-none"  @click="filter.materialNo = '', isFiltering = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="filter.deliveryDate != ''" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
                <span>Delivery Date</span>
                <span class="text-black">{{ filter.deliveryDate }}</span>
                <button class="text-gray-500 hover:text-gray-700 focus:outline-none"  @click="filter.deliveryDate = '', isFiltering = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="filter.materialGroup != ''" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
                <span>Material Group</span>
                <span class="text-black">{{ filter.materialGroup }}</span>
                <button class="text-gray-500 hover:text-gray-700 focus:outline-none" @click="filter.materialGroup = '' , isFiltering = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <button class="text-gray-500 hover:text-gray-700 focus:outline-none" @click="resetFilter">
                Reset Filter
            </button>
        </div>
    </section>
    <section name="table" class="border rounded-md mt-[24px] p-[24px] flex flex-col gap-[24px] justify-center bg-white">
        <div class="flex flex-row gap-[24px] justify-between w-full">
            <div>
                <InputSearch placeholder="Search" v-model="search" />
            </div>
            <div class="flex flex-row gap-[8px]">
                <UiButton outline variant="primary" @click="isModalFilterOpen = true"><i class="ki-duotone ki-filter"></i> Filter</UiButton>
                <UiButton outline variant="primary" ><i class="ki-duotone ki-printer"></i>Export Data</UiButton>
                <UiButton outline variant="primary" ><i class="ki-duotone ki-arrows-circle"></i>SAP Sync</UiButton>
            </div>
        </div>
        <div class="scrollable-x-auto">
            <table class="table align-middle">
                <thead>
                    <tr class="text-nowrap border-b border-primary">
                        <th>
                            <input 
                                class="checkbox checkbox-sm"
                                type="checkbox"
                                v-model="selectAll"
                            />
                        </th>
                        <th>Purch Req</th>
                        <th>PR Scenario</th>
                        <th>PR Item No</th>
                        <th>PO Item No</th>
                        <th>PO</th>
                        <th>Tender Status</th>
                        <th>Material No</th>
                        <th>Material Desc</th>
                        <th>Qty</th>
                        <th>UoM</th>
                        <th>Delivery Category</th>
                        <th>Material Group</th>
                        <th>Plant</th>
                        <th>S Loc</th>
                        <th>Purch Group</th>
                        <th>Agreement</th>
                        <th>Info Record</th>
                        <th>Indicator</th>
                        <th>Creation Indicator</th>
                        <th>Account Assignment Category</th>
                        <th>Asset No</th>
                    </tr>
                </thead>
                <tbody>
                <!-- <tr v-if="loading">
                    <td colspan="7" class="text-center">
                    <UiLoading />
                    </td>
                </tr>

                <tr v-else-if="error">
                    <td colspan="7" class="text-center text-red-500">
                    {{ error }}
                    </td>
                </tr> -->

                <tr v-if="!prData.length">
                    <td colspan="7" class="text-center">No data found.</td>
                </tr>

                    <tr
                        v-else
                        v-for="(item) in prData"
                        :key="item.id"
                        class="text-nowrap"
                        >
                        <td>
                            <input
                            class="checkbox checkbox-sm"
                            type="checkbox"
                            :value="item.id"
                            v-model="selectedItems"
                            />
                        </td>
                        <td>{{ item.purchReq }}</td>
                        <td>{{ item.prScenario }}</td>
                        <td>{{ item.prItemNo }}</td>
                        <td>{{ item.poItemNo || '-' }}</td>
                        <td>{{ item.po || '-' }}</td>
                        <td>{{ item.tenderStatus }}</td>
                        <td>{{ item.materialNo }}</td>
                        <td>{{ item.materialDesc }}</td>
                        <td>{{ item.qty }}</td>
                        <td>{{ item.uom }}</td>
                        <td>{{ item.deliveryCategory }}</td>
                        <td>{{ item.materialGroup }}</td>
                        <td>{{ item.plant }}</td>
                        <td>{{ item.sLoc }}</td>
                        <td>{{ item.purchGroup }}</td>
                        <td>{{ item.agreement || '-' }}</td>
                        <td>{{ item.infoRecord || '-' }}</td>
                        <td>{{ item.indicator || '-' }}</td>
                        <td>{{ item.creationIndicator }}</td>
                        <td>{{ item.accountAssignmentCategory }}</td>
                        <td>{{ item.assetNo }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="card-footer">
            <div>
                Tampilkan {{ '10' }} data dari total data
                {{ '100' }}
            </div>
            <LPagination
                :current-page="page"
                :page-size="10"
                :total-items="100"
                @page-change="handlePageChange"
            />
        </div>
    </section>
  </div>

  <UiModal
    v-if="isModalFilterOpen"
    v-model="isModalFilterOpen"
    title="Filter"
    @update:model-value="handleCancel"
    size="xs"
  >
    <div class="space-y-5 mt-[24px]">
      <UiSelect label="Purchasing Req" :options="lookupPurchList" text-key="text" value-key="key" v-model="filter.purchReq"/>
      <UiSelect label="Pr Scenario" :options="lookupPrScenario" text-key="text" value-key="key" v-model="filter.prScenario"/>
      <UiSelect label="Tender Status" :options="lookupTenderStatus" text-key="text" value-key="key" v-model="filter.tenderSattus"/>
      <UiSelect label="Material No" :options="lookupMaterialNo" text-key="text" value-key="key" v-model="filter.materialNo"/>
      <UiInput label="Delivery Date" type="date" v-model="filter.deliveryDate"/>
      <UiSelect label="Material Group" :options="lookupMaterialGroup" text-key="text" value-key="key" v-model="filter.materialGroup"/>
    </div>
    <div class="flex flex-row gap-[8px] justify-center mt-[24px]">
        <UiButton variant="primary" outline @click="resetFilter()"><i class="ki-duotone ki-arrows-circle"></i>Reset</UiButton>
        <UiButton variant="primary" @click="getFilter()"><i class="ki-filled ki-check-circle"></i>Terapkan</UiButton>
    </div>
  </UiModal>

</template>

<script lang="ts" setup>
import LPagination from '@/components/pagination/LPagination.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import InputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import ChartCard from '@/views/prCentralMonitoring/prMonitoring/chartCard.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { ref, computed, watch, reactive } from 'vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'

const search = ref('')
const selectedItems = ref<number[]>([]);
const page = ref(1)
const isModalFilterOpen = ref(false)
const isFiltering = ref(false)

const filter = reactive(
    {
        purchReq: '',
        prScenario: '',
        tenderSattus: '',
        materialNo: '',
        deliveryDate: '',
        materialGroup: ''
    }
)


const lookupPurchList = ref<{text: string, key: string}[]>([])  
const lookupPrScenario = ref<{text: string, key: string}[]>([]) 
const lookupTenderStatus = ref<{text: string, key: string}[]>([]) 
const lookupMaterialNo = ref<{text: string, key: string}[]>([]) 
const lookupMaterialGroup = ref<{text: string, key: string}[]>([])     

const prData = ref([
  {
    id: 1,
    purchReq: 'PR-001',
    prScenario: 'A',
    prItemNo: '10',
    poItemNo: null,
    po: null,
    tenderStatus: 'Open',
    materialNo: 'MAT-1001',
    materialDesc: 'Tinta Printer Epson',
    qty: 5,
    uom: 'PCS',
    deliveryCategory: 'Standard',
    materialGroup: 'GRP-01',
    plant: 'P001',
    sLoc: 'S001',
    purchGroup: 'PG10',
    agreement: null,
    infoRecord: 'IR-123',
    indicator: 'X',
    creationIndicator: 'A',
    accountAssignmentCategory: 'K',
    assetNo: 'ASSET-10'
  },
  {
    id: 2,
    purchReq: 'PR-002',
    prScenario: 'B',
    prItemNo: '20',
    poItemNo: 'PO-001',
    po: 'PO-001',
    tenderStatus: 'Awarded',
    materialNo: 'MAT-1002',
    materialDesc: 'Kertas A4 80gsm',
    qty: 100,
    uom: 'BOX',
    deliveryCategory: 'Express',
    materialGroup: 'GRP-02',
    plant: 'P002',
    sLoc: 'S002',
    purchGroup: 'PG20',
    agreement: 'AGR-456',
    infoRecord: null,
    indicator: '',
    creationIndicator: 'B',
    accountAssignmentCategory: 'A',
    assetNo: 'ASSET-20'
  },
  {
    id: 3,
    purchReq: 'PR-003',
    prScenario: 'A',
    prItemNo: '30',
    poItemNo: null,
    po: null,
    tenderStatus: 'Draft',
    materialNo: 'MAT-1003',
    materialDesc: 'Pena Gel Hitam',
    qty: 20,
    uom: 'PCS',
    deliveryCategory: 'Standard',
    materialGroup: 'GRP-01',
    plant: 'P001',
    sLoc: 'S001',
    purchGroup: 'PG10',
    agreement: null,
    infoRecord: null,
    indicator: 'Y',
    creationIndicator: 'A',
    accountAssignmentCategory: 'K',
    assetNo: 'ASSET-30'
  },
  {
    id: 4,
    purchReq: 'PR-004',
    prScenario: 'C',
    prItemNo: '40',
    poItemNo: 'PO-002',
    po: 'PO-002',
    tenderStatus: 'Awarded',
    materialNo: 'MAT-1004',
    materialDesc: 'CPU Core i7',
    qty: 2,
    uom: 'UNIT',
    deliveryCategory: 'Standard',
    materialGroup: 'GRP-03',
    plant: 'P003',
    sLoc: 'S003',
    purchGroup: 'PG30',
    agreement: null,
    infoRecord: 'IR-789',
    indicator: '',
    creationIndicator: 'C',
    accountAssignmentCategory: 'A',
    assetNo: 'ASSET-40'
  },
]);

const chardData = ref(
    {
        total: 10,
        data: [
          { label: "0-5 Days", count: 5, color: "green" },
          { label: "6-10 Days", count: 3, color: "orange" },
          { label: ">10 Days", count: 2, color: "purple" }
        ]
    }
);
const chardData2 = ref(
    {
        total: 30,
        data: [
          { label: "0-5 Days", count: 10, color: "green" },
          { label: "6-10 Days", count: 15, color: "orange" },
          { label: ">10 Days", count: 5, color: "purple" }
        ]
    }
);
const chardData3 = ref(
    {
        total: 40,
        data: [
          { label: "0-5 Days", count: 25, color: "green" },
          { label: "6-10 Days", count: 10, color: "orange" },
          { label: ">10 Days", count: 5, color: "purple" }
        ]
    }
);

const routes = ref<routeTypes[]>([
  {
    name: 'PR Central Management',
    to: '/tender/central'
  }
])

const handleCancel = () => {
  isModalFilterOpen.value = false
}

const handlePageChange = (page: number) => {
    console.log(page);
    
//   const query = { ...route.query, page }
//   router.replace({ query })
}

const selectAll = computed({
  get() {
    return prData.value.length > 0 && selectedItems.value.length === prData.value.length;
  },
  set(value) {
    if (value) {
      selectedItems.value = prData.value.map(item => item.id);
    } else {
      selectedItems.value = [];
    }
  }
});

const isIndeterminate = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < prData.value.length;
});

const getLookup = () => {
const allPurchReq = prData.value.map(item => item.purchReq);
const allprScenario = prData.value.map(item => item.prScenario);
const alltenderStatus= prData.value.map(item => item.tenderStatus);
const allmaterialNo = prData.value.map(item => item.materialNo);
const allmaterialGroup = prData.value.map(item => item.materialGroup);

const uniquePurchReqSet = new Set(allPurchReq);
const uniquePrScenario = new Set(allprScenario);
const uniqueaTenderStatus = new Set(alltenderStatus);
const uniqueMaterialNo = new Set(allmaterialNo);
const uniqueMaterialGroup = new Set(allmaterialGroup);

    lookupPurchList.value = Array.from(uniquePurchReqSet).map(value => ({
        text: value,
        key: value
    }));
    
    lookupPrScenario.value = Array.from(uniquePrScenario).map(value => ({
        text: value,
        key: value
    }));

    lookupTenderStatus.value = Array.from(uniqueaTenderStatus).map(value => ({
        text: value,
        key: value
    }));

    lookupMaterialNo.value = Array.from(uniqueMaterialNo).map(value => ({
        text: value,
        key: value
    }));

    lookupMaterialGroup.value = Array.from(uniqueMaterialGroup).map(value => ({
        text: value,
        key: value
    }));
}

getLookup()

const hasActiveFilter = () => {
    const values = Object.values(filter); 
    isFiltering.value = values.some(value => value !== '' && value !== null);
};

const resetFilter = () => {
    filter.deliveryDate = ''
    filter.materialGroup = ''
    filter.materialNo = ''
    filter.prScenario = ''
    filter.purchReq = ''
    filter.tenderSattus = ''

    isModalFilterOpen.value = false
    isFiltering.value = false
}

const getFilter = () => {
    hasActiveFilter()
    isModalFilterOpen.value = false
}

// watch(filter, () => {
//     hasActiveFilter()
// }, { immediate: true })

watch(selectedItems, () => {

  const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]');
  if (selectAllCheckbox) {
    (selectAllCheckbox as HTMLInputElement).indeterminate = isIndeterminate.value;
  }
}, { immediate: true });
</script>

