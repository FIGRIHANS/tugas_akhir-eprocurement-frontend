<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import FilterDropdown from './filterDropdown/FilterDropdown.vue'
import UiSelect from '../ui/atoms/select/UiSelect.vue'
import { useRoute } from 'vue-router'
import { useApprovalStatusStore } from '@/stores/vendor/reference'
import { useVendorCategoryStore } from '@/stores/vendor/category'
import moment from 'moment'

const route = useRoute()

const statusRef = useApprovalStatusStore()
const categoryRef = useVendorCategoryStore()

const approvalDate = ref<Date | null>(null)
const filters = reactive({
  ApprovalStatusName: '',
  CompanyCategoryName: '',
  SendApprovalDate: computed(() =>
    approvalDate.value ? moment(approvalDate.value).format('YYYY-MM-DD') : '',
  ),
})

const statusOptions = computed(() =>
  statusRef.approvalStatus.map((item) => ({
    text: item.value,
    value: item.value,
  })),
)

const categoryOptions = computed(() =>
  categoryRef.categories.map((item) => ({
    text: item.companyCategoryName,
    value: item.companyCategoryName,
  })),
)

watch(
  () => route.query,
  (query) => {
    filters.ApprovalStatusName = (query.ApprovalStatusName as string) || ''
    filters.CompanyCategoryName = (query.CompanyCategoryName as string) || ''
    approvalDate.value = (query.SendApprovalDate as string)
      ? new Date(query.SendApprovalDate as string)
      : null
  },
  {
    immediate: true,
    deep: true,
  },
)

onMounted(() => {
  statusRef.getStatus()
  categoryRef.getCategories()
})
</script>
<template>
  <FilterDropdown :filters="filters">
    <!-- status -->
    <UiSelect
      label="Status"
      placeholder="select"
      v-model="filters.ApprovalStatusName"
      :options="statusOptions"
    />

    <!-- category -->
    <UiSelect
      label="Category"
      placeholder="Select"
      v-model="filters.CompanyCategoryName"
      :options="categoryOptions"
    />

    <div class="min-w-[0px] w-full">
      <VueDatePicker v-model="approvalDate" class="w-full">
        <template #dp-input="{ value }">
          <div class="input relative">
            <div
              :class="[
                'absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500 text-[11px] font-normal',
              ]"
            >
              Approval Date Sent
            </div>
            <input :placeholder="'Select'" :value="value" readonly class="min-w-[0px]" />
            <button class="btn btn-icon">
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
