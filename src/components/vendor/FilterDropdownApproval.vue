<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import FilterDropdown from './filterDropdown/FilterDropdown.vue'
import UiSelect from '../ui/atoms/select/UiSelect.vue'
import { useRoute } from 'vue-router'
import { useReferenceStore } from '@/stores/vendor/reference'
import { useVendorCategoryStore } from '@/stores/vendor/category'
import { useBusinessFieldStore } from '@/stores/vendor/businessField'
import { mysqlFormat } from '@/core/utils/format'

const route = useRoute()

const statusRef = useReferenceStore()
const categoryRef = useVendorCategoryStore()
const businessFields = useBusinessFieldStore()

const approvalDate = ref<Date | null>(null)
const filters = reactive({
  ApprovalStatusName: '',
  CompanyCategoryName: '',
  BusinessFieldName: '',
  SendApprovalDate: mysqlFormat(approvalDate),
})

const bsnField = computed(() => {
  const field = businessFields.businessFields.map((item) => item.businessFieldName)
  return [...new Set(field)]
})

watch(
  () => route.query,
  (query) => {
    filters.ApprovalStatusName = (query.ApprovalStatusName as string) || ''
    filters.CompanyCategoryName = (query.CompanyCategoryName as string) || ''
    filters.BusinessFieldName = (query.BusinessFieldName as string) || ''
    approvalDate.value = (query.SendApprovalDate as string)
      ? new Date(query.SendApprovalDate as string)
      : null
  },
)

onMounted(() => {
  statusRef.getReference('APPROVAL_STATUS')
  categoryRef.getCategories()
  businessFields.getBusinessFields()
})
</script>
<template>
  <FilterDropdown :filters="filters">
    <!-- status -->
    <UiSelect label="Status" placeholder="Pilih Status" v-model="filters.ApprovalStatusName">
      <option v-for="status in statusRef.referenceList" :key="status.code" :value="status.value">
        {{ status.value }}
      </option>
    </UiSelect>

    <!-- category -->
    <UiSelect label="Category" placeholder="Pilih" v-model="filters.CompanyCategoryName">
      <option
        v-for="category in categoryRef.categories"
        :key="category.companyCategoryId"
        :value="category.companyCategoryName"
      >
        {{ category.companyCategoryName }}
      </option>
    </UiSelect>

    <!-- izin usaha -->
    <UiSelect label="Izin Usaha" placeholder="Pilih" v-model="filters.BusinessFieldName">
      <option v-for="businessField in bsnField" :key="businessField" :value="businessField">
        {{ businessField }}
      </option>
    </UiSelect>
    <div class="min-w-[0px] w-full">
      <VueDatePicker v-model="approvalDate" class="w-full">
        <template #dp-input="{ value }">
          <div class="input relative">
            <div
              :class="[
                'absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500 text-[11px] font-normal',
              ]"
            >
              Tanggal Approval Verifikasi Dikirim
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
