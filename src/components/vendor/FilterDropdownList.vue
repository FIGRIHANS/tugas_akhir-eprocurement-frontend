<script lang="ts" setup>
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import FilterDropdown from './filterDropdown/FilterDropdown.vue'

const route = useRoute()

const filters = reactive({
  status: '',
  kategori: '',
  izinUsaha: '',
  tglPendaftaranAwal: '',
  tglPendaftaranAkhir: '',
  izinUsahaExp: '',
})

watch(
  () => route.query,
  (query) => {
    filters.status = (query.status as string) || ''
    filters.kategori = (query.kategori as string) || ''
    filters.izinUsaha = (query.izinUsaha as string) || ''
    filters.izinUsahaExp = (query.izinUsahaExp as string) || ''
    filters.tglPendaftaranAwal = (query.tglPendaftaranAwal as string) || ''
    filters.tglPendaftaranAkhir = (query.tglPendaftaranAkhir as string) || ''
  },
)
</script>
<template>
  <FilterDropdown :filters="filters">
    <UiSelect label="Status" placeholder="Pilih">
      <option value="PKP">PKP</option>
    </UiSelect>
    <UiSelect label="Kategori" placeholder="Pilih">
      <option value="on process">On Process</option>
    </UiSelect>
    <UiSelect label="Izin Usaha" placeholder="Pilih">
      <option value="1">Izin usaha</option>
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
    <UiInput label="Izin Usaha Expired" v-model="filters.izinUsahaExp" />
  </FilterDropdown>
</template>
