<template>
  <div>
    <Breadcrumb title="WHT - Unifikasi (BPU)" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px] bg-white">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-[24px]">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-gray-800">WHT - Unifikasi (BPU)</h1>
          <p class="text-xs text-gray-500 font-medium italic">Manage withholding tax drafts and DJP synchronization.</p>
        </div>
        <div class="flex gap-3">
          <UiInputSearch
            v-model="search"
            placeholder="Search Counterpart/Bupot"
            @search="onSearch"
          />
          <button class="btn btn-primary" @click="router.push('/wht-unifikasi/create')">
            <i class="ki-filled ki-plus-circle !text-lg"></i>
            Create New BPU
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto list__table mt-[24px]">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[100px] text-center">
                Action
              </th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[120px]">
                Tax Period
              </th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[200px]">
                Counterpart Name
              </th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px]">NPWP/NIK</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px]">
                Tax Object Code
              </th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px] text-right">
                Tax Base (DPP)
              </th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px] text-right">
                PPh Amount
              </th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px]">Status</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[180px]">
                No. Bupot
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="text-center">
              <td colspan="9" class="py-10">
                <span class="loading loading-spinner loading-md text-primary"></span>
                <p class="mt-2 text-gray-500 font-medium">Fetching BPU data...</p>
              </td>
            </tr>
            <tr v-else-if="bpuList.length === 0" class="text-center">
              <td colspan="9" class="py-10 text-gray-400 italic">No BPU records found.</td>
            </tr>
            <tr v-for="item in bpuList" :key="item.id">
              <td>
                <div class="flex gap-1 justify-center">
                  <!-- DRAFT Actions -->
                  <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'DRAFT'">
                    <button
                      class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px] tooltip tooltip-right"
                      data-tip="Upload to DJP"
                      @click="handleUpload(item)"
                    >
                      <i class="ki-filled ki-cloud-change !text-lg"></i>
                    </button>
                    <button
                      class="btn btn-outline btn-icon btn-danger w-[32px] h-[32px] tooltip tooltip-right"
                      data-tip="Delete Draft"
                      @click="confirmDelete(item)"
                    >
                      <i class="ki-filled ki-trash !text-lg"></i>
                    </button>
                  </template>

                  <!-- IN PROGRESS Actions -->
                  <template v-if="isInProgress(item.status || item.fgStatus)">
                    <button
                      class="btn btn-outline btn-icon btn-warning w-[32px] h-[32px] tooltip tooltip-right"
                      data-tip="Verify Status"
                      @click="handleVerify(item)"
                    >
                      <i class="ki-filled ki-arrow-circle-right !text-lg"></i>
                    </button>
                  </template>

                  <!-- DONE Actions -->
                  <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'NORMAL-DONE'">
                    <button
                      class="btn btn-outline btn-icon btn-danger w-[32px] h-[32px] tooltip tooltip-right"
                      data-tip="Cancel Bupot"
                      @click="confirmBatal(item)"
                    >
                      <i class="ki-filled ki-cross-circle !text-lg"></i>
                    </button>
                  </template>

                  <button
                    class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px] tooltip tooltip-right"
                    data-tip="View Details"
                    @click="viewDetail(item)"
                  >
                    <i class="ki-filled ki-eye !text-lg"></i>
                  </button>
                </div>
              </td>
              <td>{{ item.masaPajak || '-' }}/{{ item.tahunPajak || '-' }}</td>
              <td>{{ item.namaPenerima || item.nama || '-' }}</td>
              <td>{{ item.npwpPenerima || item.npwp || '-' }}</td>
              <td>{{ item.kodeObjekPajak || '-' }}</td>
              <td class="text-right">{{ formatCurrency(item.dpp || 0) }}</td>
              <td class="text-right text-danger">
                {{ formatCurrency(item.pphDipotong || 0) }}
                <div v-if="item.tarif" class="text-[10px] text-gray-500 italic">
                  Rate: {{ item.tarif }}%
                </div>
              </td>
              <td>
                <div class="flex flex-col gap-1 items-start">
                  <span :class="getStatusBadge(item.status || item.fgStatus)">
                    {{ item.status || item.fgStatus || 'UNKNOWN' }}
                  </span>
                  <span
                    v-if="item.errorMsg"
                    class="text-[10px] text-danger italic max-w-[150px] truncate"
                    :title="item.errorMsg"
                  >
                    {{ item.errorMsg }}
                  </span>
                </div>
              </td>
              <td class="font-bold text-primary">
                {{ item.nomorBuktiPotong || item.noBupot || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="bpuList.length > 0" class="flex items-center justify-between mt-[24px]">
        <p class="text-sm text-gray-500">
          Showing <b>{{ bpuList.length }}</b> of <b>{{ totalBpu }}</b> entries
        </p>
        <LPagination
          :totalItems="totalBpu"
          :pageSize="limit"
          :currentPage="page"
          @page-change="onPageChange"
        />
      </div>
    </div>

    <ModalConfirmation
      :open="showDeleteModal"
      id="delete-bpu-modal"
      title="Delete Draft BPU"
      :text="`Are you sure you want to delete this draft BPU for ${selectedItem?.nama}? This action cannot be undone.`"
      type="warning"
      @submit="handleDelete"
      @cancel="showDeleteModal = false"
      :loading="submitting"
    />

    <ModalConfirmation
      :open="showBatalModal"
      id="cancel-bpu-modal"
      title="Cancel Bupot DJP"
      :text="`This will cancel the official tax certificate for ${selectedItem?.namaPenerima || selectedItem?.nama}. Continue?`"
      type="danger"
      @submit="handleBatal"
      @cancel="showBatalModal = false"
      :loading="submitting"
    />

    <ModalConfirmation
      :open="showUploadConfirmModal"
      id="upload-bpu-modal"
      title="Upload to DJP"
      :text="`Ready to submit BPU for ${selectedItem?.namaPenerima || selectedItem?.nama || 'this record'} to DJP? This will officially record the tax withholding.`"
      type="confirm"
      @submit="handleUploadSubmit"
      @cancel="showUploadConfirmModal = false"
      :loading="submitting"
    >
      <div class="w-full flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <label class="form-label text-xs uppercase text-gray-500 font-bold"
            >Passphrase (PX-Internal)</label
          >
          <div class="relative">
            <input
              v-model="passphrase"
              :type="showPassphrase ? 'text' : 'password'"
              class="input w-full border-gray-200 focus:border-primary shadow-sm pr-10"
              placeholder="Enter your PX-Internal passphrase"
            />
            <button
              type="button"
              class="btn btn-icon btn-sm absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              @click="showPassphrase = !showPassphrase"
            >
              <i
                :class="[
                  'ki-filled',
                  showPassphrase ? 'ki-eye-slash' : 'ki-eye',
                  'text-gray-500',
                ]"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </ModalConfirmation>

    <!-- Notifications -->
    <ModalNotification
      :open="showNotificationModal"
      :id="'bpu-notif-modal'"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="showNotificationModal = false"
    />

    <!-- Detail View removed in favor of full-page navigation -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import BpuService, { type BpuContent } from '@/services/bpu.service'
import moment from 'moment'

const router = useRouter()

const routes = ref<routeTypes[]>([
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'WHT - Unifikasi (BPU)', to: '/wht-unifikasi' },
])

const npwpPemotong = computed(() => '1091031210969728') // Static for now as per docs, ideally from user profile
const nikSigner = '3172022407830008' // From appsettings/docs

// State
const bpuList = ref<BpuContent[]>([])
const totalBpu = ref(0)
const loading = ref(false)
const submitting = ref(false)
const search = ref('')
const page = ref(1)
const limit = ref(10)
const selectedItem = ref<BpuContent | null>(null)
const passphrase = ref('Pajak123@@')
const showPassphrase = ref(false)

// Modal States
const showDeleteModal = ref(false)
const showBatalModal = ref(false)
const showUploadConfirmModal = ref(false)
const showNotificationModal = ref(false)

// Notification State
const notifTitle = ref('')
const notifText = ref('')
const notifType = ref<'success' | 'error' | 'warning' | 'info'>('success')

// Methods
const fetchBpuList = async () => {
  loading.value = true
  try {
    const res = await BpuService.getList({
      npwpPemotong: npwpPemotong.value,
      page: page.value,
      limit: limit.value,
      search: search.value,
    })
    bpuList.value = res.result.content.items || []
    totalBpu.value = res.result.content.total || 0
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  page.value = 1
  fetchBpuList()
}

const onPageChange = (v: number) => {
  page.value = v
  fetchBpuList()
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val)
}

const getStatusBadge = (status: string) => {
  if (!status) return 'badge badge-light px-2'
  const s = status.toUpperCase()
  if (s === 'DRAFT') return 'badge badge-light-primary px-2'
  if (s === 'NORMAL-DONE') return 'badge badge-success px-2 font-bold'
  if (s.includes('PROGRESS') || s === 'SUBMITTED') return 'badge badge-light-warning px-2'
  if (s === 'ERROR') return 'badge badge-light-danger px-2 font-bold'
  return 'badge badge-light px-2'
}

const isInProgress = (status: string) => {
  if (!status) return false
  const s = status.toUpperCase()
  return s === 'SUBMITTED' || s.includes('SIGNING_IN_PROGRESS') || s.includes('SUBMITTED-')
}

// Actions
const handleUpload = (item: BpuContent) => {
  selectedItem.value = item
  passphrase.value = ''
  showUploadConfirmModal.value = true
}

const handleUploadSubmit = async () => {
  if (!selectedItem.value) return
  submitting.value = true
  try {
    await BpuService.upload({ 
      id: selectedItem.value.pxId, 
      npwpNikPenandatangan: nikSigner,
      passphrase: passphrase.value 
    })
    showUploadConfirmModal.value = false
    fetchBpuList()
    
    notifTitle.value = 'Upload Success'
    notifText.value = 'BPU has been uploaded and is currently being processed by DJP.'
    notifType.value = 'success'
    showNotificationModal.value = true
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Upload Failed'
    notifText.value = 'Failed to submit the BPU to DJP. Please check the error message.'
    notifType.value = 'error'
    showNotificationModal.value = true
  } finally {
    submitting.value = false
  }
}

const handleVerify = async (item: BpuContent) => {
  try {
    await BpuService.verify({ 
      id: item.pxId,
      npwpPemotong: npwpPemotong.value,
      tahunPajak: item.tahunPajak || moment().format('YYYY'),
      noBupot: item.nomorBuktiPotong || '',
      idBupot: item.idBupot || '',
      fgJnsBupot: 'BPU'
    })
    fetchBpuList()
    
    notifTitle.value = 'DJP Sync Success'
    notifText.value = 'Status have been synchronized. The Bupot is now official.'
    notifType.value = 'success'
    showNotificationModal.value = true
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Sync Failed'
    notifText.value = 'Could not synchronize status with DJP at this time.'
    notifType.value = 'error'
    showNotificationModal.value = true
  }
}

const confirmDelete = (item: BpuContent) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!selectedItem.value) return
  submitting.value = true
  try {
    await BpuService.deleteDraft({ id: selectedItem.value.pxId })
    showDeleteModal.value = false
    fetchBpuList()
    
    notifTitle.value = 'Draft Deleted'
    notifText.value = 'The draft record has been removed from the list.'
    notifType.value = 'success'
    showNotificationModal.value = true
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Delete Failed'
    notifType.value = 'error'
    showNotificationModal.value = true
  } finally {
    submitting.value = false
  }
}

const confirmBatal = (item: BpuContent) => {
  selectedItem.value = item
  showBatalModal.value = true
}

const handleBatal = async () => {
  if (!selectedItem.value) return
  submitting.value = true
  try {
    await BpuService.batalkan({
      id: selectedItem.value.pxId,
      tglPembatalan: moment().format('DDMMYYYY'),
      npwpNikPenandatangan: nikSigner,
    })
    showBatalModal.value = false
    fetchBpuList()
    
    notifTitle.value = 'Document Cancelled'
    notifText.value = 'The tax document has been officially cancelled on DJP.'
    notifType.value = 'success'
    showNotificationModal.value = true
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Cancellation Failed'
    notifType.value = 'error'
    showNotificationModal.value = true
  } finally {
    submitting.value = false
  }
}

const viewDetail = (item: BpuContent) => {
  router.push({
    name: 'whtUnifikasiDetail',
    params: { id: item.id },
    state: { item: item as any }
  })
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(
  () => search.value,
  () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      page.value = 1
      fetchBpuList()
    }, 500)
  }
)

onMounted(() => {
  fetchBpuList()
})
</script>

<style lang="scss" scoped>
.text-danger {
  color: #f1416c;
}
.badge-success {
  background-color: #e8fff3;
  color: #50cd89;
}
.badge-light-primary {
  background-color: #f1faff;
  color: #009ef7;
}
.badge-light-warning {
  background-color: #fff8dd;
  color: #ffc700;
}
.badge-light-danger {
  background-color: #fff5f8;
  color: #f1416c;
}
</style>
