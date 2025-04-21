<script lang="ts" setup>
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import FilterDropdown from './filterDropdown/FilterDropdown.vue'
import { useReferenceStore } from '@/stores/vendor/reference'

const reference = useReferenceStore()

const route = useRoute()

const filters = reactive({
  ApprovalStatusName: '',
  CompanyCategoryName: '',
  tglPendaftaranAwal: '',
  tglPendaftaranAkhir: '',
})

watch(
  () => route.query,
  (query) => {
    filters.ApprovalStatusName = (query.ApprovalStatusName as string) || ''
    filters.CompanyCategoryName = (query.CompanyCategoryName as string) || ''
    filters.tglPendaftaranAwal = (query.tglPendaftaranAwal as string) || ''
    filters.tglPendaftaranAkhir = (query.tglPendaftaranAkhir as string) || ''
  },
)

onMounted(() => {
  reference.getReference('APPROVAL_STATUS')
})
</script>
<template>
  <FilterDropdown :filters="filters">
    <UiSelect label="Status" placeholder="Pilih" v-model="filters.ApprovalStatusName">
      <option v-for="status in reference.referenceList" :key="status.value" :value="status.value">
        {{ status.value }}
      </option>
    </UiSelect>
    <UiSelect label="Categori" placeholder="Pilih" v-model="filters.CompanyCategoryName">
      <option value="PKP">PKP</option>
    </UiSelect>
    <DatePicker
      label="Tanggal Pendaftaran Awal"
      label-class="text-[11px]"
      v-model="filters.tglPendaftaranAwal"
    />
    <DatePicker
      label="Tanggal Pendaftaran Akhir"
      label-class="text-[11px]"
      v-model="filters.tglPendaftaranAkhir"
    />
  </FilterDropdown>
</template>
