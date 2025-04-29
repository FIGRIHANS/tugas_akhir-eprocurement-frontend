<script setup lang="ts">
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import FilterButton from '@/components/vendor/filterButton/FilterButton.vue'
import FilterDropdownBlacklist from '@/components/vendor/FilterDropdownBlacklist.vue'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const search = ref('')
const page = ref(1)

const handleSearch = debounce((value) => {
  const query = { ...route.query }
  if (!value) {
    delete query.SearchQuery
    router.replace({ query: { ...query, page: 1 } })
    return
  }

  router.replace({ query: { ...query, SearchQuery: value, page: 1 } })
}, 500)

const handlePageChange = (page: number) => {
  const query = { ...route.query, page }
  router.replace({ query })
}

watch(search, handleSearch)
</script>
<template>
  <div class="card">
    <div class="card-header">
      <UiInputSearch v-model="search" placeholder="Cari Vendor" />
      <FilterDropdownBlacklist />
    </div>
    <div class="card-body scrollable-x-auto">
      <FilterButton />
      <table class="table align-middle">
        <thead>
          <tr class="text-nowrap border-b-2 border-primary">
            <th>Action</th>
            <th>Nama Perusahaan</th>
            <th>Tipe</th>
            <th>Tanggal Mulai</th>
            <th>Tanggal Selesai</th>
            <th>Keterangan Blacklist</th>
            <th>Dokumen</th>
            <th>Status</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="card-footer">
      <div>
        Tampilkan {{ '10' }} data dari total data
        {{ '100' }}
      </div>
      <LPagination
        :current-page="page"
        :page-size="10"
        :total-items="100"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
