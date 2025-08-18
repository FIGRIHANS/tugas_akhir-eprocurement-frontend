<script setup lang="ts">
import LPagination from '@/components/pagination/LPagination.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiLoading from '@/components/UiLoading.vue'
import FilterButton from '@/components/vendor/filterButton/FilterButton.vue'
import FilterDropdownBlacklist from '@/components/vendor/FilterDropdownBlacklist.vue'
import { formatDate } from '@/composables/date-format'
import { useBlacklistStore } from '@/stores/vendor/blacklist'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModalReject from './components/ModalReject.vue'
import { KTModal } from '@/metronic/core'
import ModalSuccess from './components/ModalSuccess.vue'
import ModalError from './components/ModalError.vue'
import ModalApprove from './components/ModalApprove.vue'

const tableCols = [
  'Actions',
  'Company Name',
  'Type',
  'Start Date',
  'End Date',
  'Blacklist Description',
  'Document',
]

const blacklistStore = useBlacklistStore()
const uploadStore = useVendorUploadStore()

const route = useRoute()
const router = useRouter()
const search = ref('')
const selectedId = ref(0)
const mode = ref<'approve' | 'reject'>('approve')

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

const openModalReject = (blacklistId: number) => {
  selectedId.value = blacklistId
  const id = document.querySelector('#modal-reject')
  const modal = KTModal.getInstance(id as HTMLElement)
  modal.show()
  mode.value = 'reject'
}

const openModalApprove = (blacklistId: number) => {
  selectedId.value = blacklistId
  const id = document.querySelector('#modal-approve')
  const modal = KTModal.getInstance(id as HTMLElement)
  modal.show()
  mode.value = 'approve'
}

const onSuccess = () => {
  const id = document.querySelector(`#modal-success`)
  const modal = KTModal.getInstance(id as HTMLElement)
  modal.show()

  blacklistStore.getBlacklist(route.query, 0)
}

const onError = () => {
  const id = document.querySelector(`#modal-error`)
  const modal = KTModal.getInstance(id as HTMLElement)
  modal.show()
}

watch(search, handleSearch)

watch(
  () => route.query,
  (query) => {
    blacklistStore.getBlacklist(query, 0)
    search.value = (query.searchQuery as string) || ''
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
      <UiInputSearch v-model="search" placeholder="Search Vendor" />
      <FilterDropdownBlacklist />
    </div>
    <div class="card-body scrollable-x-auto">
      <FilterButton />
      <table class="table align-middle">
        <thead>
          <tr class="text-nowrap border-b-2 border-primary">
            <th v-for="col in tableCols" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- loading -->
          <tr v-if="blacklistStore.loading">
            <td :colspan="tableCols.length" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- error -->
          <tr v-else-if="blacklistStore.error">
            <td :colspan="tableCols.length" class="text-center text-danger font-medium">
              {{ blacklistStore.error }}
            </td>
          </tr>

          <!-- empty data -->
          <tr v-else-if="!blacklistStore.blacklist.items.length" class="text-center">
            <td :colspan="tableCols.length">No data</td>
          </tr>

          <!-- show data -->
          <tr
            v-else
            v-for="item in blacklistStore.blacklist.items"
            :key="item.blacklistId"
            class="text-nowrap"
          >
            <td>
              <div class="flex gap-2">
                <UiButton size="sm" icon @click="openModalApprove(item.blacklistId)">
                  <UiIcon name="check-circle" variant="duotone" />
                </UiButton>
                <UiButton
                  size="sm"
                  outline
                  icon
                  variant="danger"
                  @click="openModalReject(item.blacklistId)"
                >
                  <UiIcon name="cross-circle" variant="duotone" />
                </UiButton>
              </div>
            </td>
            <td>{{ item.vendorName }}</td>
            <td>{{ item.masaBlacklist }}</td>
            <td>{{ item.startDate ? formatDate(item.startDate) : '-' }}</td>
            <td>{{ item.endDate ? formatDate(item.endDate) : '-' }}</td>
            <td>
              <p class="max-w-[700px]">{{ item.blacklistDescription }}</p>
            </td>
            <td>
              <UiButton v-if="item.docUrl" size="sm" outline @click="onDownload(item.docUrl)">
                <UiIcon name="cloud-download" variant="duotone" />
                Download
              </UiButton>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer">
      <div>
        Showing {{ blacklistStore.blacklist.pageSize * (blacklistStore.blacklist.page - 1) + 1 }} to
        {{
          blacklistStore.blacklist.pageSize * (blacklistStore.blacklist.page - 1) +
          blacklistStore.blacklist.items.length
        }}
        of {{ blacklistStore.blacklist.total }} entries
      </div>
      <LPagination
        :total-items="Number(blacklistStore.blacklist.total)"
        :current-page="Number(blacklistStore.blacklist.page)"
        :page-size="Number(blacklistStore.blacklist.pageSize)"
        @page-change="handlePageChange"
      />
    </div>

    <ModalApprove
      :id="selectedId"
      @on-close="selectedId = 0"
      @on-success="onSuccess"
      @on-error="onError"
    />

    <ModalReject
      :id="selectedId"
      @on-close="selectedId = 0"
      @on-success="onSuccess"
      @on-error="onError"
    />

    <ModalSuccess :mode="mode" />

    <ModalError :mode="mode" />
  </div>
</template>
