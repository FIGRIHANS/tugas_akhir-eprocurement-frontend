<script lang="ts" setup>
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import FilterDropdown from './filterDropdown/FilterDropdown.vue'
import { useVendorCategoryStore } from '@/stores/vendor/category'
import { useApprovalStatusStore } from '@/stores/vendor/reference'
import { formattoMySQL } from '@/core/utils/format'

const route = useRoute()
const categories = useVendorCategoryStore()
const verifStatus = useApprovalStatusStore()

const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)

const filters = reactive({
  status: '',
  categoryId: '',
  startDate: computed(() => (startDate.value ? formattoMySQL(startDate.value) : '')),
  endDate: computed(() => (endDate.value ? formattoMySQL(endDate.value) : '')),
})

watch(
  () => route.query,
  (query) => {
    filters.status = (query.status as string) || ''
    filters.categoryId = (query.CompanyCategoryName as string) || ''
    startDate.value = query.startDate ? new Date(query.startDate as string) : null
    endDate.value = query.endDate ? new Date(query.endDate as string) : null
  },
)

onMounted(() => {
  categories.getCategories()
  verifStatus.getStatus()
})
</script>
<template>
  <FilterDropdown :filters="filters">
    <UiSelect label="Status" placeholder="Pilih" v-model="filters.status">
      <option v-for="item in verifStatus.approvalStatus" :key="item.code" :value="item.value">
        {{ item.value }}
      </option>
    </UiSelect>
    <UiSelect label="Categori" placeholder="Pilih" v-model="filters.categoryId">
      <option
        v-for="category in categories.categories"
        :key="category.companyCategoryId"
        :value="category.companyCategoryId"
      >
        {{ category.companyCategoryName }}
      </option>
    </UiSelect>
    <div class="min-w-[0px] w-full">
      <VueDatePicker v-model="startDate" class="w-full">
        <template #dp-input="{ value }">
          <div class="input relative">
            <div
              :class="[
                'absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500 text-[11px] font-normal',
              ]"
            >
              Tanggal Pendaftaran Awal
            </div>
            <input :placeholder="'Select'" :value="value" readonly class="min-w-[0px]" />
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
              Tanggal Pendaftaran Akhir
            </div>
            <input :placeholder="'Select'" :value="value" readonly class="min-w-[0px]" />
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
