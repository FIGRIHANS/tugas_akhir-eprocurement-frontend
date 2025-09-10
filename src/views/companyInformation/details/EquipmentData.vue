<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">
        {{ $t('vendorProfile.data', { field: $t('vendorProfile.equipment') }) }}
      </h3>
    </div>

    <div class="flex flex-col gap-4 pb-4">
      <div class="card-table">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>{{ $t('vendorProfile.equipmentName') }}</th>
              <th>{{ $t('vendorProfile.brand') }}</th>
              <th>{{ $t('vendorProfile.yom') }}</th>
              <th>{{ $t('vendorProfile.licenseNumber') }}</th>
              <th>{{ $t('vendorProfile.capacity') }}</th>
              <th>{{ $t('vendorProfile.condition') }}</th>
              <th>{{ $t('vendorProfile.ownershipStatus') }}</th>
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

      <div class="flex flex-row items-center justify-between px-4">
        <div class="flex flex-row items-center gap-2">
          {{ $t('general.show') }}
          <UiSelect v-model="pagination.pageSize" :options="pageSizeOptions" class="w-16" />
          {{ $t('general.perPage', pagination.total) }}
        </div>

        <LPagination
          :totalItems="pagination.total"
          :pageSize="pagination.pageSize"
          :currentPage="pagination.currentPage"
          @pageChange="setPagePagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import { useEquipmentDataStore } from '@/stores/vendor/vendor'

import UiBadge from '@/components/ui/atoms/badge/UiBadge.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'

import { formatDateYear } from '@/composables/date-format'

const props = defineProps<{ vendorId: number | undefined }>()

const equipmentDataStore = useEquipmentDataStore()

const pageSizeOptions = ref([
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
  { value: 20, text: '20' },
  { value: 50, text: '50' },
])
const pagination = ref({
  pageSize: 10,
  currentPage: 1,
  total: 10,
})

const dataResponse = computed(() => {
  const { items, total } = equipmentDataStore.data

  pagination.value.total = total

  return items
})

const setPagePagination = async (page: number) => {
  pagination.value.currentPage = page
}

watchEffect(async () => {
  try {
    await equipmentDataStore.getData(
      Number(props.vendorId),
      pagination.value.currentPage,
      pagination.value.pageSize,
    )
  } catch (error) {
    console.error(error)
  }
})
</script>
