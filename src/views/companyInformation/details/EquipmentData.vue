<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Equipment Data</h3>
    </div>

    <div class="card-table">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Brand / Type</th>
            <th>Year of Manufacture</th>
            <th>Serial / License Number</th>
            <th>Capacity (Tonnage)</th>
            <th>Condition</th>
            <th>Ownership Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in dataResponse">
            <td>{{ data.name }}</td>
            <td>{{ data.brand }}</td>
            <td>{{ formatDateYear(data.mfgDate) }}</td>
            <td>{{ data.serialNo }}</td>
            <td>{{ data.capacity }}</td>
            <td>{{ data.conditionName }}</td>
            <td>
              <UiBadge variant="success" size="sm" outline>{{ data.ownershipName }}</UiBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { useEquipmentDataStore } from '@/stores/vendor/vendor'

import UiBadge from '@/components/ui/atoms/badge/UiBadge.vue'

import { formatDateYear } from '@/composables/date-format'

const props = defineProps<{ vendorId: number | undefined }>()

const equipmentDataStore = useEquipmentDataStore()

const dataResponse = computed(() => equipmentDataStore.data)

onMounted(() => {
  equipmentDataStore.getData(Number(props.vendorId))
})

watch(
  () => props.vendorId,
  () => {
    equipmentDataStore.getData(Number(props.vendorId))
  },
)
</script>
