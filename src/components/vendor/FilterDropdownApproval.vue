<script setup lang="ts">
import { reactive, watch } from 'vue'
import FilterDropdown from './filterDropdown/FilterDropdown.vue'
import UiSelect from '../ui/atoms/select/UiSelect.vue'
import { useRoute } from 'vue-router'
import DatePicker from '../datePicker/DatePicker.vue'

const route = useRoute()
const filters = reactive({
  status: '',
  categori: '',
  izinUsaha: '',
  tglDiKirim: '',
  jenis: '',
})

watch(
  () => route.query,
  (query) => {
    filters.status = (query.status as string) || ''
    filters.categori = (query.categori as string) || ''
    filters.izinUsaha = (query.izinUsaha as string) || ''
    filters.tglDiKirim = (query.tglDiKirim as string) || ''
    filters.jenis = (query.jenis as string) || ''
  },
)
</script>
<template>
  <FilterDropdown :filters="filters">
    <!-- status -->
    <UiSelect label="Status" placeholder="Pilih Status" v-model="filters.status">
      <option value="On Proccess">On Proccess</option>
    </UiSelect>

    <!-- category -->
    <UiSelect label="Category" placeholder="Pilih" v-model="filters.categori">
      <option value="PKP">PKP</option>
      <option value="non-PKP">Non PKP</option>
    </UiSelect>

    <!-- izin usaha -->
    <UiSelect label="Izin Usaha" placeholder="Pilih" v-model="filters.izinUsaha">
      <option value="1">1</option>
    </UiSelect>

    <DatePicker
      label="Tanggal Approval Verifikasi dikirim"
      v-model="filters.tglDiKirim"
      label-class="text-[11px]"
    />
  </FilterDropdown>
</template>
