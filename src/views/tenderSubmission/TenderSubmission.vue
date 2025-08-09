<template>
  <div>
    <Breadcrumb title="Vendor Tender SubMission" :routes="routes" />

    <section name="Stepper" class="border rounded-md p-[24px] flex justify-center">
      <div>
        <StepperStatusTender v sTender activeName="Create Tender Request" role="vendor" />
      </div>
    </section>

    <section name="Card Wrapper" class="flex flex-row gap-[24px] mt-[24px]">
      <tenderCard />
    </section>

    <section
      name="table"
      class="border rounded-md mt-[24px] p-[24px] flex flex-col gap-[24px] justify-center bg-white"
    >
      <div class="flex flex-row gap-[24px] justify-between w-full">
        <div>
          <InputSearch placeholder="Search" v-model="search" />
        </div>
        <div class="flex flex-row gap-[8px]">
          <UiButton outline variant="primary"
            ><i class="ki-duotone ki-document"></i> Upload Prices</UiButton
          >
          <UiButton variant="primary">Update Prices <i class="ki-duotone ki-dollar"></i></UiButton>
        </div>
      </div>
      <div class="scrollable-x-auto">
        <table class="table align-middle">
          <thead>
            <tr class="text-nowrap border-b">
              <th class="flex items-center justify-center"></th>
              <th>Tender Request Number</th>
              <th>Type</th>
              <th>Delivery Date</th>
              <th>Plant</th>
              <th>Material Group</th>
              <th>Item No</th>
              <th>Tender Price</th>
              <th>Material</th>
              <th>Material Desc</th>
              <th>Quality</th>
              <th>Bottom Price</th>
              <th>UOM</th>
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
                  class="checkbox checkbox-sm"
                  type="checkbox"
                  :value="item.id"
                  :checked="selectedItems === item.id"
                  @change="handleCheckboxChange(item.id)"
                />
              </td>
              <td>{{ item.tenderRequestNo }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.deliveryDate }}</td>
              <td>{{ item.plan }}</td>
              <td>{{ item.materialGroup }}</td>
              <td>{{ item.itemNo }}</td>
              <td>{{ item.tenderPrice }}</td>
              <td>{{ item.material }}</td>
              <td>{{ item.materialDesc }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.bottomPrice }}</td>
              <td>{{ item.uom }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <div>
          Tampilkan {{ '10' }} data dari total data
          {{ '100' }}
        </div>
      </div>
    </section>
    <section
      class="border rounded-md mt-[24px] p-[24px] flex flex-col gap-[24px] justify-center bg-white"
    >
      <div class="flex flex-col gap-[16px]">
        <span class="font-bold">Do you want to join the tender ?</span>
        <div class="flex gap-12 w-[10%] mt-5">
          <label class="form-label flex items-center gap-2.5 text-nowrap">
            <input class="radio" name="radio2" type="radio" value="1" />
            Yes
          </label>
          <label class="form-label flex items-center gap-2.5 text-nowrap">
            <input class="radio" name="radio2" type="radio" value="2" />
            No
          </label>
        </div>
        <div class="flex">
          <label class="form-label flex items-center gap-2.5">
            <input v-model="isAccept" class="checkbox" name="check" type="checkbox" value="1" />
            <a href="#" class="text-primary underline">Read and Agree</a>to the tender terms and
            conditions - e Procurement
          </label>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatusTender from '@/components/stepperStatusTender/StepperStatusTender.vue'
import InputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import tenderCard from './card/tenderCard.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const search = ref<string>('')
const selectedItems = ref<number | null>(null)
const isAccept = ref<boolean>(false)

const data = ref([
  {
    id: 1,
    tenderRequestNo: 10002193,
    type: 'R',
    deliveryDate: '15 Okt 2024',
    plan: 'CHIP2',
    materialGroup: 4,
    itemNo: 20,
    tenderPrice: 1000,
    material: 'CH-1062',
    materialDesc: 'Macro Fertilizer Urea',
    quantity: 1000,
    bottomPrice: 97000,
    uom: 'KG',
  },
])

const handleCheckboxChange = (id: number) => {
  // Jika item yang sama sudah dipilih, batalkan centangnya.
  // Jika item lain dipilih, ganti dengan item yang baru.
  if (selectedItems.value === id) {
    selectedItems.value = null
  } else {
    selectedItems.value = id
  }
}

const routes = ref<routeTypes[]>([
  {
    name: 'Vendor Tender SubMission',
    to: '/tender/submission',
  },
])
</script>
