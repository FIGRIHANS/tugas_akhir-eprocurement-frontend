<script setup lang="ts">
import LPagination from '@/components/pagination/LPagination.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiLoading from '@/components/UiLoading.vue'
import VendorBlacklistFilters from '@/components/vendor/filterButton/VendorBlacklistFilters.vue'
import FilterDropdownBlacklist from '@/components/vendor/FilterDropdownBlacklist.vue'
import { formatDate } from '@/composables/date-format'
import { useBlacklistStore } from '@/stores/vendor/blacklist'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModalRemove from './components/ModalRemove.vue'
import ModalSuccess from './components/ModalSuccess.vue'
import ModalError from './components/ModalError.vue'
import { KTModal } from '@/metronic/core'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const start = computed(
  () => blacklistStore.blacklist.pageSize * (blacklistStore.blacklist.page - 1) + 1,
)
const end = computed(
  () =>
    blacklistStore.blacklist.pageSize * (blacklistStore.blacklist.page - 1) +
    blacklistStore.blacklist.items.length,
)
const total = computed(() => blacklistStore.blacklist.total)
const tableCols = computed(() => [
  t('vendorBlacklist.table.columns.actions'),
  t('vendorBlacklist.table.columns.companyName'),
  t('vendorBlacklist.table.columns.type'),
  t('vendorBlacklist.table.columns.startDate'),
  t('vendorBlacklist.table.columns.endDate'),
  t('vendorBlacklist.table.columns.blacklistDescription'),
  t('vendorBlacklist.table.columns.document'),
  t('vendorBlacklist.table.columns.status'),
])

const route = useRoute()
const router = useRouter()
const blacklistStore = useBlacklistStore()
const uploadStore = useVendorUploadStore()

const search = ref('')
const selectedId = ref(0)

const handleSearch = debounce((value: string) => {
  const query = { ...route.query }

  if (!value) {
    delete query.searchQuery
    router.push({ query: { ...query, page: 1 } })
    return
  }
  router.push({ query: { ...query, searchQuery: value, page: 1 } })
}, 500)

const handlePageChange = (page: number) => {
  const query = { ...route.query, page }
  router.replace({ query })
}

const onDownload = async (url: string) => {
  try {
    const file = await uploadStore.preview(url)
    const link = URL.createObjectURL(file)
    window.open(link, '_blank')
    setTimeout(() => URL.revokeObjectURL(link), 1000)
  } catch (err) {
    if (err instanceof Error) alert('Failed to download document. Please try again later.')
  }
}

const openModalRemove = (blacklistId: number) => {
  selectedId.value = blacklistId
  const id = document.querySelector('#modal-remove')
  const modal = KTModal.getInstance(id as HTMLElement)
  modal.show()
}

const onSuccess = () => {
  blacklistStore.getBlacklist(route.query, 1)

  const idModal = document.querySelector('#modal-success')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const onError = () => {
  const idModal = document.querySelector('#modal-error')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

watch(search, handleSearch)

watch(
  () => route.query,
  (query) => {
    search.value = (query.searchQuery as string) || ''

    blacklistStore.getBlacklist(query, 1)
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <div class="card">
    <div class="card-header">
      <UiInputSearch :placeholder="$t('general.search', { field: 'Vendor' })" v-model="search" />
      <FilterDropdownBlacklist />
    </div>
    <div class="card-body scrollable-x-auto">
      <VendorBlacklistFilters />
      <table class="table align-middle">
        <thead>
          <tr class="text-nowrap border-b-2 border-primary">
            <th v-for="col in tableCols" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- show loading -->
          <tr v-if="blacklistStore.loading">
            <td :colspan="tableCols.length" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- show error -->
          <tr v-else-if="blacklistStore.error">
            <td :colspan="tableCols.length" class="text-center text-danger">
              {{ blacklistStore.error }}
            </td>
          </tr>

          <!-- show message if there are no data -->
          <tr v-else-if="!blacklistStore.blacklist.items.length">
            <td :colspan="tableCols.length" class="text-center">
              {{ $t('vendorBlacklist.table.noData') }}
            </td>
          </tr>

          <tr
            v-else
            v-for="item in blacklistStore.blacklist.items"
            :key="item.vendorId"
            class="text-nowrap"
          >
            <td>
              <UiButton outline icon size="sm" @click="openModalRemove(item.blacklistId)">
                <UiIcon name="check-circle" variant="duotone" />
              </UiButton>
            </td>
            <td>{{ item.vendorName }}</td>
            <td>{{ item.masaBlacklist }}</td>
            <td>{{ item.startDate ? formatDate(item.startDate) : '-' }}</td>
            <td>{{ item.endDate ? formatDate(item.endDate) : '-' }}</td>
            <td>{{ item.blacklistDescription }}</td>
            <td>
              <UiButton v-if="item.docUrl" size="sm" outline @click="onDownload(item.docUrl)">
                <UiIcon name="cloud-download" variant="duotone" />
                {{ $t('vendorBlacklist.actions.download') }}
              </UiButton>
              <span v-else>-</span>
            </td>
            <td>
              <UiButton :outline="true" variant="danger" size="sm"> {{ item.status }} </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer" v-show="blacklistStore.blacklist.items.length">
      <div class="text-sm text-gray-800">
        {{ $t('vendor.pagination.show', { start, end, total }) }}
      </div>
      <LPagination
        :total-items="Number(blacklistStore.blacklist.total)"
        :current-page="Number(blacklistStore.blacklist.page)"
        :page-size="Number(blacklistStore.blacklist.pageSize)"
        @page-change="handlePageChange"
      />
    </div>

    <ModalRemove
      :id="selectedId"
      @on-close="selectedId = 0"
      @on-error="onError"
      @on-success="onSuccess"
    />
    <ModalSuccess
      id="modal-success"
      :title="$t('vendorBlacklist.modal.remove.success.title')"
      :text="$t('vendorBlacklist.modal.remove.success.message')"
    />
    <ModalError
      id="modal-error"
      :title="$t('vendorBlacklist.modal.remove.error.title')"
      :text="$t('vendorBlacklist.modal.remove.error.message')"
    />
  </div>
</template>
