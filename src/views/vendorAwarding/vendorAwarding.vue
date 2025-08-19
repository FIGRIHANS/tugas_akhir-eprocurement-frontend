<template>
  <div>
    <Breadcrumb title="Vendor Awarding" :routes="routes" />
    <div
      v-if="tenderStatus === 'closed'"
      class="flex items-center gap-2 p-4 rounded-md bg-violet-50 text-violet-800 ring-1 ring-violet-300 my-4"
    >
      <i class="ki-duotone ki-information-2 text-2xl"></i>
      <span class="font-semibold">Tender Has Closed</span>
    </div>
    <section name="Stepper" class="border rounded-md p-[24px] flex justify-center">
      <div>
        <StepperStatusTender activeName="Vendor Awarding" role="admin" />
      </div>
    </section>
    <section class="px-5">
      <AwardingDraft :data="tenderEvoStore.dummyData" />
    </section>
    <section class="py-5 flex justify-end">
      <UiButton> Approve Evaluation </UiButton>
    </section>
    <section>
      <ParticipatingVendor class="mt-[24px]" />
    </section>
    <!-- <section
      name="table"
      class="border rounded-md mt-[24px] p-[24px] flex flex-col gap-[24px] justify-center bg-white"
    >
      <div class="flex flex-row gap-[24px] justify-start w-full">
        <div>
          <InputSearch placeholder="Search" v-model="search" />
        </div>
      </div>

      <div class="scrollable-x-auto">
        <table class="table align-middle">
          <thead>
            <tr class="text-nowrap border-b">
              <th class="flex items-center justify-center !bg-blue-100 !text-blue-500"></th>
              <th class="!bg-blue-100 !text-blue-500">Status</th>
              <th class="!bg-blue-100 !text-blue-500">Vendor Code</th>
              <th class="!bg-blue-100 !text-blue-500">Rank</th>
              <th class="!bg-blue-100 !text-blue-500">Vendor Name</th>
              <th class="!bg-blue-100 !text-blue-500">Total Score</th>
              <th class="!bg-blue-100 !text-blue-500">Product Quality</th>
              <th class="!bg-blue-100 !text-blue-500">Lead Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data.length">
              <td colspan="7" class="text-center">No data found.</td>
            </tr>

            <tr v-else v-for="item in data" :key="item.id" class="text-nowrap">
              <td class="flex items-center justify-center">
                <div
                  v-if="item.status.name === 'Award' && tenderStatus === 'closed'"
                  class="bg-yellow-100 text-yellow-600 flex flex-row justify-center align-center p-[6px] w-[50px]"
                >
                  <i class="ki-duotone ki-award text-2xl"></i>
                </div>
                <input
                  v-else
                  class="checkbox checkbox-sm"
                  type="checkbox"
                  :value="item.id"
                  :checked="selectedItems === item.id"
                  @change="handleCheckboxChange(item.id)"
                />
              </td>
              <td>
                <UiChips :color="item.status.color" :text="item.status.name" />
              </td>
              <td>{{ item.vendorCode }}</td>
              <td><UiChips :color="item.rank.color" :text="item.rank.number" /></td>
              <td>{{ item.vendorName || '-' }}</td>
              <td><UiChips :color="item.totalScore.color" :text="item.totalScore.score" /></td>
              <td>
                <UiChips :color="item.productQuality.color" :text="item.productQuality.score" />
              </td>
              <td><UiChips :color="item.leadTime.color" :text="item.leadTime.score" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section> -->
    <section name="button-wrapper">
      <div class="mt-[24px] flex flex-row justify-start">
        <UiButton
          v-if="currentStatus === 3"
          variant="primary"
          :disabled="selectedItems === null"
          @click="currentStatus = 2"
          outline
        >
          <i class="ki-filled ki-arrow-left"></i> Back</UiButton
        >
      </div>
      <div class="mt-[24px] flex flex-row justify-end">
        <UiButton
          v-if="currentStatus === 1"
          variant="primary"
          :disabled="selectedItems === null"
          @click="serAwardedVendor()"
        >
          Award <i class="ki-duotone ki-ranking"></i
        ></UiButton>
        <UiButton
          v-if="currentStatus === 2"
          variant="primary"
          :disabled="selectedItems === null"
          @click="closeTender"
        >
          Close Tender <i class="ki-duotone ki-ranking"></i
        ></UiButton>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
//   import LPagination from '@/components/pagination/LPagination.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import InputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiChips from '@/components/ui/atoms/chips/UiChips.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import { ref } from 'vue'
import StepperStatusTender from '@/components/stepperStatusTender/StepperStatusTender.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import AwardingDraft from '@/views/tenderReportNegotiation/tenderReportNegotiation/AwardingDraft.vue'
import { useTenderEvoStore } from '@/stores/tender-evo/tenderNegotiation'
import ParticipatingVendor from '../tenderReportNegotiation/tenderReportNegotiation/ParticipatingVendor.vue'

const tenderEvoStore = useTenderEvoStore()

const search = ref('')
const selectedItems = ref<number | null>(null)
const currentStatus = ref<number>(1)
const tenderStatus = ref<string>('open')
//   const page = ref(1)

const data = ref([
  {
    id: 1,
    status: {
      name: 'invited',
      color: 'green',
    },
    vendorCode: '1060',
    rank: {
      number: 1,
      color: 'green',
    },
    vendorName: 'PT Walldorf Grosshandel Tbk',
    totalScore: {
      score: 78,
      color: 'yellow',
    },
    productQuality: {
      score: 80,
      color: 'blue',
    },
    leadTime: {
      score: 90,
      color: 'green',
    },
  },
  {
    id: 2,
    status: {
      name: 'Invited',
      color: 'green',
    },
    vendorCode: '1070',
    rank: {
      number: 2,
      color: 'yellow',
    },
    vendorName: 'PT Sommer GmbHTbk',
    totalScore: {
      score: 75,
      color: 'yellow',
    },
    productQuality: {
      score: 78,
      color: 'yellow',
    },
    leadTime: {
      score: 85,
      color: 'green',
    },
  },
])

const routes = ref<routeTypes[]>([
  {
    name: 'Vendor Awarding',
    to: '/vendor/awarding',
  },
])

const serAwardedVendor = () => {
  const selectedData = data.value.find((item) => item.id === selectedItems.value)

  if (selectedData) {
    selectedData.status.name = 'Award'
    selectedData.status.color = 'blue'
  }

  currentStatus.value = 2
}

const closeTender = () => {
  tenderStatus.value = 'closed'
  currentStatus.value = 3
}

const handleCheckboxChange = (id: number) => {
  // Jika item yang sama sudah dipilih, batalkan centangnya.
  // Jika item lain dipilih, ganti dengan item yang baru.
  if (selectedItems.value === id) {
    selectedItems.value = null
  } else {
    selectedItems.value = id
  }
}

// const isIndeterminate = computed(() => {
//   return selectedItems.value.length > 0 && selectedItems.value.length < data.value.length
// })

// watch(filter, () => {
//     hasActiveFilter()
// }, { immediate: true })

// watch(
//   selectedItems,
//   () => {
//     const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]')
//     if (selectAllCheckbox) {
//       ;(selectAllCheckbox as HTMLInputElement).indeterminate = isIndeterminate.value
//     }
//   },
//   { immediate: true },
// )
</script>
