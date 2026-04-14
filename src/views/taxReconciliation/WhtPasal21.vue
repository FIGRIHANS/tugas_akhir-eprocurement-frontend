<template>
  <div>
    <Breadcrumb title="WHT - Pasal 21" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px] bg-white text-gray-800">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-[24px]">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-gray-800">WHT - Pasal 21</h1>
          <p class="text-xs text-gray-500 font-medium italic">Manage PPh 21 Non-Employee (Final & Non-Final) drafts and DJP synchronization.</p>
        </div>
        <div class="flex gap-3">
          <!-- Feature Toggle -->
          <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
            <button
              :class="['px-3 py-2 font-medium transition-colors', feature === 'tdkfinal' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50']"
              @click="setFeature('tdkfinal')"
            >Non-Final</button>
            <button
              :class="['px-3 py-2 font-medium transition-colors', feature === 'final' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50']"
              @click="setFeature('final')"
            >Final</button>
          </div>
          <UiInputSearch v-model="search" placeholder="Search Counterpart/Bupot" @search="onSearch" />
          <button class="btn btn-primary" @click="router.push('/wht-pasal-21/create')">
            <i class="ki-filled ki-plus-circle !text-lg"></i>
            Create New PPh21
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto list__table mt-[24px]">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[100px] text-center">Action</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[120px]">Tax Period</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[200px]">Counterpart Name</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px]">NPWP/NIK</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px]">Tax Object Code</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px] text-right">Gross Income</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px] text-right">PPh Withheld</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[150px]">Status</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 min-w-[180px]">No. Bupot</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="text-center">
              <td colspan="9" class="py-10">
                <span class="loading loading-spinner loading-md text-primary"></span>
                <p class="mt-2 text-gray-500 font-medium">Fetching PPh21 data...</p>
              </td>
            </tr>
            <tr v-else-if="pphList.length === 0" class="text-center">
              <td colspan="9" class="py-10 text-gray-400 italic">No PPh21 records found.</td>
            </tr>
            <tr v-for="item in pphList" :key="item.id">
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
              <td class="text-right">{{ formatCurrency(Number(item.penghasilanKotor) || 0) }}</td>
              <td class="text-right text-danger">
                {{ formatCurrency(Number(item.pphDipotong) || 0) }}
                <div v-if="item.tarif && Number(item.tarif) > 0" class="text-[10px] text-gray-500 italic">
                  Rate: {{ item.tarif }}%
                </div>
              </td>
              <td>
                <div class="flex flex-col gap-1 items-start">
                  <span :class="getStatusBadge(item.status || item.fgStatus)">
                    {{ item.status || item.fgStatus || 'UNKNOWN' }}
                  </span>
                  <span
                    v-if="item.errorMessage || item.errorMsg"
                    class="text-[10px] text-danger italic max-w-[150px] truncate"
                    :title="item.errorMessage || item.errorMsg || ''"
                  >{{ item.errorMessage || item.errorMsg }}</span>
                </div>
              </td>
              <td class="font-bold text-primary">{{ item.nomorBupot || item.nomorBuktiPotong || item.noBupot || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pphList.length > 0" class="flex items-center justify-between mt-[24px]">
        <p class="text-sm text-gray-500">
          Showing <b>{{ pphList.length }}</b> of <b>{{ totalPph }}</b> entries
        </p>
        <LPagination
          :totalItems="totalPph"
          :pageSize="limit"
          :currentPage="page"
          @page-change="onPageChange"
        />
      </div>
    </div>

    <!-- Delete Modal -->
    <ModalConfirmation
      :open="showDeleteModal"
      id="delete-pph-modal"
      title="Delete Draft PPh21"
      :text="`Are you sure you want to delete this draft PPh21 for ${selectedItem?.namaPenerima || selectedItem?.nama}? This action cannot be undone.`"
      type="warning"
      @submit="handleDelete"
      @cancel="showDeleteModal = false"
      :loading="submitting"
    />

    <!-- Cancel Modal -->
    <ModalConfirmation
      :open="showBatalModal"
      id="cancel-pph-modal"
      title="Cancel PPh21 DJP"
      :text="`This will cancel the official tax certificate for ${selectedItem?.namaPenerima || selectedItem?.nama}. Continue?`"
      type="danger"
      @submit="handleBatal"
      @cancel="showBatalModal = false"
      :loading="submitting"
    />

    <!-- Upload Modal -->
    <ModalConfirmation
      :open="showUploadConfirmModal"
      id="upload-pph-modal"
      title="Upload to DJP"
      :text="`Ready to submit PPh 21 for ${selectedItem?.namaPenerima || selectedItem?.nama || 'this record'} to DJP?`"
      type="confirm"
      @submit="handleUploadSubmit"
      @cancel="showUploadConfirmModal = false"
      :loading="submitting"
    >
      <div class="w-full flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <label class="form-label text-xs uppercase text-gray-500 font-bold">Passphrase (PX-Internal)</label>
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
              <i :class="['ki-filled', showPassphrase ? 'ki-eye-slash' : 'ki-eye', 'text-gray-500']"></i>
            </button>
          </div>
        </div>
      </div>
    </ModalConfirmation>

    <!-- Notifications -->
    <ModalNotification
      :open="showNotificationModal"
      id="pph-notif-modal"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="showNotificationModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import Pph21Service, { type Pph21Content } from '@/services/pph21.service'
import moment from 'moment'

const router = useRouter()

const routes = ref<routeTypes[]>([
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'WHT - Pasal 21', to: '/wht-pasal-21' },
])

const npwpPemotong = '1091031210969728'
const nikSigner = '3172022407830008'

// State
const pphList = ref<Pph21Content[]>([])
const totalPph = ref(0)
const loading = ref(false)
const submitting = ref(false)
const search = ref('')
const page = ref(1)
const limit = ref(10)
const feature = ref<'tdkfinal' | 'final'>('tdkfinal')
const selectedItem = ref<Pph21Content | null>(null)
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

// Auto-close success modal after 2.5s
const showSuccessNotif = (title: string, text: string) => {
  notifTitle.value = title
  notifText.value = text
  notifType.value = 'success'
  showNotificationModal.value = true
  setTimeout(() => {
    showNotificationModal.value = false
  }, 2500)
}

// Methods
const fetchPphList = async () => {
  loading.value = true
  try {
    const res = await Pph21Service.getList({
      npwpPemotong,
      page: page.value,
      limit: limit.value,
      search: search.value,
      feature: feature.value,
    })
    pphList.value = res.result.content.items || []
    totalPph.value = res.result.content.total || 0
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const setFeature = (val: 'tdkfinal' | 'final') => {
  feature.value = val
  page.value = 1
  fetchPphList()
}

const onSearch = () => {
  page.value = 1
  fetchPphList()
}

const onPageChange = (v: number) => {
  page.value = v
  fetchPphList()
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val)
}

const getStatusBadge = (status: string | null | undefined) => {
  if (!status) return 'badge badge-light px-2 font-semibold'
  const s = status.toUpperCase()
  if (s === 'DRAFT') return 'badge badge-light-primary px-2 font-semibold'
  if (s === 'NORMAL-DONE') return 'badge badge-success px-2 font-bold'
  if (s.includes('PROGRESS') || s === 'SUBMITTED') return 'badge badge-light-warning px-2 font-semibold'
  if (s === 'ERROR') return 'badge badge-light-danger px-2 font-bold'
  return 'badge badge-light px-2'
}

const isInProgress = (status: string | null | undefined) => {
  if (!status) return false
  const s = status.toUpperCase()
  return s === 'SUBMITTED' || s.includes('SIGNING_IN_PROGRESS') || s.includes('SUBMITTED-')
}

// Actions
const handleUpload = (item: Pph21Content) => {
  selectedItem.value = item
  passphrase.value = 'Pajak123@@'
  showUploadConfirmModal.value = true
}

const handleUploadSubmit = async () => {
  if (!selectedItem.value) return
  submitting.value = true
  try {
    await Pph21Service.upload({
      id: selectedItem.value.id,  // Local DB id — backend maps to PxId for Pajak Express
      npwpNikPenandatangan: nikSigner,
      passphrase: passphrase.value,
    })
    showUploadConfirmModal.value = false
    fetchPphList()
    showSuccessNotif('Upload Success', 'PPh21 has been uploaded and is being processed by DJP.')
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Upload Failed'
    notifText.value = 'Failed to submit the PPh21 to DJP. Please check the error message.'
    notifType.value = 'error'
    showNotificationModal.value = true
  } finally {
    submitting.value = false
  }
}

const handleVerify = async (item: Pph21Content) => {
  try {
    await Pph21Service.verify({
      id: item.pxId,
      npwpPemotong,
      feature: item.feature || feature.value,
    })
    fetchPphList()
    showSuccessNotif('DJP Sync Success', 'Status has been synchronized successfully.')
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Sync Failed'
    notifText.value = 'Could not synchronize status with DJP at this time.'
    notifType.value = 'error'
    showNotificationModal.value = true
  }
}

const confirmDelete = (item: Pph21Content) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!selectedItem.value) return
  submitting.value = true
  try {
    await Pph21Service.deleteDraft({ id: selectedItem.value.id })  // Local DB id — backend maps to PxId
    showDeleteModal.value = false
    fetchPphList()
    showSuccessNotif('Draft Deleted', 'The draft record has been removed.')
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Delete Failed'
    notifText.value = 'Failed to delete the draft. Please try again.'
    notifType.value = 'error'
    showNotificationModal.value = true
  } finally {
    submitting.value = false
  }
}

const confirmBatal = (item: Pph21Content) => {
  selectedItem.value = item
  showBatalModal.value = true
}

const handleBatal = async () => {
  if (!selectedItem.value) return
  submitting.value = true
  try {
    await Pph21Service.batalkan({
      id: selectedItem.value.pxId,
      idBupot: selectedItem.value.idBupot || '',
      noBupot: selectedItem.value.nomorBupot || selectedItem.value.noBupot || '',
      masaPajak: selectedItem.value.masaPajak || '',
      tahunPajak: selectedItem.value.tahunPajak || '',
      tglPembatalan: moment().format('DDMMYYYY'),
      npwpNikPenandatangan: nikSigner,
      passphrase: 'Pajak123@@',
      namaTtd: 'Dave Navarro',
      position: 'Director',
      alamatPenandatangan: 'Jakarta',
      dcPenandatangan: '1',
      declare: '1',
    })
    showBatalModal.value = false
    fetchPphList()
    showSuccessNotif('Document Cancelled', 'The tax document has been officially cancelled on DJP.')
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Cancellation Failed'
    notifText.value = 'Could not cancel the document. Please try again.'
    notifType.value = 'error'
    showNotificationModal.value = true
  } finally {
    submitting.value = false
  }
}

const viewDetail = (item: Pph21Content) => {
  sessionStorage.setItem('pph21_detail_item', JSON.stringify(item))
  router.push({
    name: 'whtPasal21Detail',
    params: { id: item.id },
  })
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(
  () => search.value,
  () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      page.value = 1
      fetchPphList()
    }, 500)
  }
)

onMounted(() => {
  fetchPphList()
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
