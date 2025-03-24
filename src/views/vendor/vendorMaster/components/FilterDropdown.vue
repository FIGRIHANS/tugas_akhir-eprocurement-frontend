<script lang="ts" setup>
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const filters = reactive({
  status: '',
  kategori: '',
  izinUsaha: '',
  tglPendaftaranAwal: '',
  tglPendaftaranAkhir: '',
  izinUsahaExp: '',
})

const handleFilter = () => {
  const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
  router.push({ query })
}

const handleReset = () => {
  Object.keys(filters).forEach((key) => {
    filters[key as keyof typeof filters] = ''
  })
  router.replace({ query: {} })
}

watch(
  () => route.query,
  (query) => {
    Object.keys(filters).forEach((key) => {
      filters[key as keyof typeof filters] = query[key]?.toString() || ''
    })
  },
  { immediate: true },
)
</script>
<template>
  <form @submit.prevent="handleFilter">
    <div class="flex items-center space-x-3">
      <div
        class="dropdown"
        data-dropdown="true"
        data-dropdown-trigger="click"
        data-dropdown-placement="bottom-end"
      >
        <UiButton class="dropdown-toggle">
          <UiIcon variant="outline" name="filter" />
          <span>Filter</span>
        </UiButton>
        <div class="dropdown-content w-full max-w-60 p-4 space-y-5">
          <h1 class="text-lg font-semibold text-gray-700 mb-5">Filter</h1>
          <UiSelect label="Status" placeholder="Pilih">
            <option>Select Status</option>
          </UiSelect>
          <UiSelect label="Kategori" placeholder="Pilih">
            <option>Select Status</option>
          </UiSelect>
          <UiSelect label="Izin Usaha" placeholder="Pilih">
            <option>Select Status</option>
          </UiSelect>
          <div class="relative">
            <label
              class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-5"
            >
              Tanggal Pendaftaran Awal
            </label>
            <DatePicker
              :model-value="filters.tglPendaftaranAwal"
              @update:model-value="filters.tglPendaftaranAwal = $event.toString()"
            />
          </div>
          <div class="relative">
            <label
              class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-5"
            >
              Tanggal Pendaftaran Akhir
            </label>
            <DatePicker
              :model-value="filters.tglPendaftaranAkhir"
              @update:model-value="filters.tglPendaftaranAkhir = $event.toString()"
            />
          </div>
          <UiInput label="Izin Usaha Expired" v-model="filters.izinUsahaExp" />
          <div class="flex items-center space-x-3">
            <UiButton
              :outline="true"
              class="flex-1"
              type="reset"
              @click="handleReset"
              data-dropdown-dismiss="true"
            >
              <UiIcon variant="filled" name="arrows-circle" />
              Reset
            </UiButton>
            <UiButton class="flex-1" data-dropdown-dismiss="true">
              <UiIcon variant="filled" name="check-circle" />
              Terapkan
            </UiButton>
          </div>
        </div>
      </div>
      <UiButton :outline="true">
        <UiIcon variant="filled" name="printer" />
        Export Data Vendor
      </UiButton>
    </div>
  </form>
</template>
