<script lang="ts" setup>
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import FilterDropdown from './filterDropdown/FilterDropdown.vue'
import { useVendorCategoryStore } from '@/stores/vendor/category'
import { useVerificationStatus } from '@/stores/vendor/reference'
import { formattoMySQL } from '@/core/utils/format'

const route = useRoute()
const categories = useVendorCategoryStore()
const verificationStatusStore = useVerificationStatus()

const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)

const filters = reactive({
  statusId: '',
  categoryId: '',
  startDate: computed(() => (startDate.value ? formattoMySQL(startDate.value, false) : '')),
  endDate: computed(() => (endDate.value ? formattoMySQL(endDate.value, false) : '')),
})

const statusOptions = computed(() => {
  return verificationStatusStore.data.map((item) => ({
    text: item.value,
    value: item.code,
  }))
})

const categoryOptions = computed(() =>
  categories.categories.map((item) => ({
    text: item.companyCategoryName,
    value: item.companyCategoryId,
  })),
)

watch(
  () => route.query,
  (query) => {
    filters.statusId = (query.statusId as string) || ''
    filters.categoryId = (query.categoryId as string) || ''
    startDate.value = query.startDate ? new Date(query.startDate as string) : null
    endDate.value = query.endDate ? new Date(query.endDate as string) : null
  },
)

onMounted(() => {
  categories.getCategories()
  verificationStatusStore.get()
})
</script>
<template>
  <FilterDropdown :filters="filters">
    <UiSelect
      label="Status"
      :placeholder="$t('general.select')"
      v-model="filters.statusId"
      :options="statusOptions"
    />

    <UiSelect
      :label="$t('vendor.masterFilters.category')"
      :placeholder="$t('general.select')"
      v-model="filters.categoryId"
      :options="categoryOptions"
    />

    <div class="min-w-[0px] w-full">
      <VueDatePicker v-model="startDate" class="w-full">
        <template #dp-input="{ value }">
          <div class="input relative">
            <div
              :class="[
                'absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500 text-[11px] font-normal',
              ]"
            >
              {{ $t('vendor.masterFilters.registrationStartDate') }}
            </div>
            <input
              :placeholder="$t('general.select')"
              :value="value"
              readonly
              class="min-w-[0px]"
            />
            <button class="btn btn-icon" type="button">
              <i class="ki-filled ki-calendar"></i>
            </button>
          </div>
        </template>
      </VueDatePicker>
    </div>

    <div class="min-w-[0px] w-full">
      <VueDatePicker v-model="endDate" class="w-full">
        <template #dp-input="{ value }">
          <div class="input relative">
            <div
              :class="[
                'absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500 text-[11px] font-normal',
              ]"
            >
              {{ $t('vendor.masterFilters.registrationEndDate') }}
            </div>
            <input
              :placeholder="$t('general.select')"
              :value="value"
              readonly
              class="min-w-[0px]"
            />
            <button class="btn btn-icon" type="button">
              <i class="ki-filled ki-calendar"></i>
            </button>
          </div>
        </template>
      </VueDatePicker>
    </div>
  </FilterDropdown>
</template>

<style lang="scss" scoped>
@use '@/components/datePicker/styles/datepicker.scss';
</style>
