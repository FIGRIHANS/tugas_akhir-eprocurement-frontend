<template>
  <div>
    <Breadcrumb title="Vendor Awarding" :routes="routes" />
    <section name="Stepper" class="border rounded-md p-[24px] flex justify-center">
      <div>
        <StepperStatusTender activeName="Vendor Awarding" />
      </div>
    </section>
    <section
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
              <th class="flex items-center justify-center">
                <input class="checkbox checkbox-sm" type="checkbox" v-model="selectAll" />
              </th>
              <th>Status</th>
              <th>Vendor Code</th>
              <th>Rank</th>
              <th>Vendor Name</th>
              <th>Total Score</th>
              <th>Product Quality</th>
              <th>Lead Time</th>
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

            <tr v-if="!data.length">
              <td colspan="7" class="text-center">No data found.</td>
            </tr>

            <tr v-else v-for="item in data" :key="item.id" class="text-nowrap">
              <td class="flex items-center justify-center">
                <input
                  v-if="item.status.name != 'Award'"
                  class="checkbox checkbox-sm"
                  type="checkbox"
                  :value="item.id"
                  v-model="selectedItems"
                />
                <div
                  v-else
                  class="bg-yellow-100 text-yellow-600 flex flex-row justify-center align-center p-[6px] w-[50px]"
                >
                  <i class="ki-duotone ki-award text-2xl"></i>
                </div>
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
      <!-- <div class="card-footer">
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
          </div> -->
    </section>
    <section name="button-wrapper">
      <div class="mt-[24px] flex flex-row justify-start">
        <UiButton
          v-if="currentStatus === 3"
          variant="primary"
          :disabled="selectedItems.length === 0"
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
          :disabled="selectedItems.length === 0"
          @click="currentStatus = 2"
        >
          Award <i class="ki-duotone ki-ranking"></i
        ></UiButton>
        <UiButton
          v-if="currentStatus === 2"
          variant="primary"
          :disabled="selectedItems.length === 0"
          @click="currentStatus = 3"
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
import { ref, computed, watch } from 'vue'
import StepperStatusTender from '@/components/stepperStatusTender/StepperStatusTender.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const search = ref('')
const selectedItems = ref<number[]>([])
const currentStatus = ref<number>(1)
//   const page = ref(1)

const data = ref([
  {
    id: 1,
    status: {
      name: 'Award',
      color: 'blue',
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
])

const routes = ref<routeTypes[]>([
  {
    name: 'Vendor Awarding',
    to: '/vendor/awarding',
  },
])

const selectAll = computed({
  get() {
    return data.value.length > 0 && selectedItems.value.length === data.value.length
  },
  set(value) {
    if (value) {
      selectedItems.value = data.value.map((item) => item.id)
    } else {
      selectedItems.value = []
    }
  },
})

const isIndeterminate = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < data.value.length
})

// watch(filter, () => {
//     hasActiveFilter()
// }, { immediate: true })

watch(
  selectedItems,
  () => {
    const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]')
    if (selectAllCheckbox) {
      ;(selectAllCheckbox as HTMLInputElement).indeterminate = isIndeterminate.value
    }
  },
  { immediate: true },
)
</script>
