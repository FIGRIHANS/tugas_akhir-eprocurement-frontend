<template>
  <div>
    <Breadcrumb title="VAT (Pajak Luaran)" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="card shadow-sm border border-gray-200 rounded-xl overflow-hidden bg-white">
      <!-- Header -->
      <div class="flex justify-between items-center gap-3 mb-4 flex-wrap px-[24px] pt-[24px]">
        <div class="flex flex-col gap-1">
          <h3 class="text-lg font-semibold text-gray-800 m-0">List Data</h3>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" class="btn btn-outline btn-primary" @click="fetchData" :disabled="isLoading">
            <i class="ki-filled ki-arrows-circle !text-base"></i>
            Refresh
          </button>
          <router-link to="/vat-out-reconciliation/create" class="btn btn-primary">
            <i class="ki-filled ki-plus-circle !text-lg"></i>
            Create Faktur
          </router-link>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto list__table mx-[24px] rounded-xl overflow-hidden">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center">Action</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Invoice No.</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Date</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Buyer Name</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-right">DPP</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-right">VAT</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="text-center py-10">
                <span class="loading loading-spinner loading-md text-primary"></span>
                <p class="mt-2 text-gray-500">Loading data...</p>
              </td>
            </tr>
            <tr v-else-if="pagedData.length === 0">
              <td colspan="7" class="text-center py-10 text-gray-400 italic">
                No tax invoices found.
              </td>
            </tr>
            <tr v-for="(row, index) in pagedData" :key="index" v-else>
              <td class="text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px] tooltip tooltip-right"
                    data-tip="View Detail"
                    @click="goToDetail(row.id)"
                  >
                    <i class="ki-filled ki-eye !text-lg"></i>
                  </button>
                  <button
                    v-if="row.statusfaktur === 'DRAFT'"
                    class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px] tooltip tooltip-right"
                    data-tip="Upload to DJP"
                    @click="uploadFaktur(row.id)"
                  >
                    <i class="ki-filled ki-cloud-add !text-lg"></i>
                  </button>
                  <button
                    v-if="row.statusfaktur === 'DRAFT'"
                    class="btn btn-outline btn-icon btn-danger w-[32px] h-[32px] tooltip tooltip-right"
                    data-tip="Delete Draft"
                    @click="deleteFaktur(row.id)"
                  >
                    <i class="ki-filled ki-trash !text-lg"></i>
                  </button>
                  <button
                    v-if="row.statusfaktur === 'APPROVED'"
                    class="btn btn-outline btn-icon btn-danger w-[32px] h-[32px] tooltip tooltip-right"
                    data-tip="Cancel Invoice"
                    @click="cancelFaktur(row.id)"
                  >
                    <i class="ki-filled ki-cross-circle !text-lg"></i>
                  </button>
                  <span v-if="row.statusfaktur === 'CANCELED'" class="text-gray-400 text-xs">—</span>
                </div>
              </td>
              <td class="font-medium">{{ row.nomorfaktur || '-' }}</td>
              <td>{{ formatDate(row.tanggalfaktur) }}</td>
              <td>{{ row.namapembeli }}</td>
              <td class="text-right">{{ formatCurrency(row.totaldpp) }}</td>
              <td class="text-right text-primary font-semibold">{{ formatCurrency(row.totalppn) }}</td>
              <td class="text-center">
                <span :class="getStatusBadgeClass(row.statusfaktur)">
                  {{ row.statusfaktur }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-[24px] flex-wrap gap-2 px-[24px] pb-[24px]">
        <p class="m-0 text-sm text-gray-600">
          Showing <b>{{ pagedData.length }}</b> of <b>{{ tableData.length }}</b> entries
        </p>
        <LPagination
          :totalItems="tableData.length"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="setPage"
        />
      </div>
    </div>

  </div>

  <ModalNotification
    :open="showNotif"
    id="vat-out-reconcile-notif"
    :title="notifTitle"
    :text="notifText"
    :type="notifType"
  />

  <ModalConfirmation
    :open="showConfirmModal"
    id="vat-out-confirm-modal"
    :type="confirmType"
    :title="confirmTitle"
    :text="confirmText"
    :submitButtonText="confirmSubmitText"
    :cancelButtonText="confirmCancelText"
    :loading="confirmLoading"
    @submit="handleConfirmSubmit"
    @cancel="handleConfirmCancel"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { getVatOutList, postVatOutUpload, postVatOutDelete, postVatOutCancel } from '@/core/utils/vatPxInvoiceApi'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'VatOutReconciliation',
  components: { Breadcrumb, LPagination, ModalNotification, ModalConfirmation },
  setup() {
    const router = useRouter()
    const tableData = ref<any[]>([])
    const isLoading = ref(false)
    const vendorNpwp = '1091031210969728'
    const currentPage = ref(1)
    const pageSize = ref(10)

    const routes = ref<routeTypes[]>([
      { name: 'Tax Reconciliation' },
      { name: 'VAT (Pajak Luaran)' },
    ])

    const goToDetail = (id: string) => {
      router.push(`/vat-out-reconciliation/detail/${id}`)
    }

    const showNotif = ref(false)
    const notifTitle = ref('')
    const notifText = ref('')
    const notifType = ref('success')

    const showNotification = (title: string, text: string, type: string = 'success') => {
      notifTitle.value = title
      notifText.value = text
      notifType.value = type
      showNotif.value = true
      setTimeout(() => { showNotif.value = false }, 3000)
    }

    const showConfirmModal = ref(false)
    const confirmType = ref('confirm')
    const confirmTitle = ref('')
    const confirmText = ref('')
    const confirmSubmitText = ref('')
    const confirmCancelText = ref('Cancel')
    const confirmLoading = ref(false)
    let pendingConfirmAction: (() => Promise<void>) | null = null

    const handleConfirmSubmit = async () => {
      if (pendingConfirmAction) {
        confirmLoading.value = true
        try {
          await pendingConfirmAction()
        } finally {
          confirmLoading.value = false
          showConfirmModal.value = false
        }
      }
    }

    const handleConfirmCancel = () => {
      showConfirmModal.value = false
    }

    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return tableData.value.slice(start, start + pageSize.value)
    })

    const setPage = (page: number) => {
      currentPage.value = page
    }

    const fetchData = async () => {
      isLoading.value = true
      currentPage.value = 1
      try {
        const response = await getVatOutList(vendorNpwp, { page: 1, limit: 100 })
        const payload = response.data?.result?.content || response.data?.result || response.data
        if (payload?.status === 'success' && payload?.data) {
          tableData.value = payload.data
        } else {
          tableData.value = []
        }
      } catch (error) {
        console.error('Fetch VAT Out error:', error)
        showNotification('Error', 'Failed to load tax invoices.', 'danger')
      } finally {
        isLoading.value = false
      }
    }

    const uploadFaktur = (id: string) => {
      confirmType.value = 'confirm'
      confirmTitle.value = 'Submit Invoice?'
      confirmText.value = 'This DRAFT invoice will be uploaded to DJP server.'
      confirmSubmitText.value = 'Yes, Upload!'
      confirmCancelText.value = 'Cancel'
      
      pendingConfirmAction = async () => {
        try {
          const body = {
            id: id.toString(),
            tempatPenandatangan: 'Jakarta',
            npwpNikPenandatangan: '3172022407830008',
          }
          const response = await postVatOutUpload(vendorNpwp, body)
          const payload = response?.data?.result?.content || response?.data?.result || response?.data
          if (payload?.status === 'error' || response?.data?.result?.isError) {
            throw new Error(payload?.message || 'Upload failed.')
          }
          showNotification('Success', 'Invoice successfully uploaded to DJP.')
          fetchData()
        } catch (error: any) {
          const msg = error.response?.data?.result?.content?.message || error.response?.data?.message || error.message || 'Upload failed.'
          showNotification('Error', msg, 'danger')
        }
      }
      showConfirmModal.value = true
    }

    const deleteFaktur = (id: string) => {
      confirmType.value = 'warning'
      confirmTitle.value = 'Delete Draft Invoice?'
      confirmText.value = 'Are you sure you want to delete this draft invoice?'
      confirmSubmitText.value = 'Yes, Delete!'
      confirmCancelText.value = 'Cancel'
      
      pendingConfirmAction = async () => {
        try {
          const response = await postVatOutDelete(vendorNpwp, { id: id.toString() })
          const payload = response?.data?.result?.content || response?.data?.result || response?.data
          if (payload?.status === 'error' || response?.data?.result?.isError) {
            throw new Error(payload?.message || 'Delete failed.')
          }
          showNotification('Deleted!', 'Draft invoice has been deleted.')
          fetchData()
        } catch (error: any) {
          const msg = error.response?.data?.result?.content?.message || error.response?.data?.message || error.message || 'Delete failed.'
          showNotification('Error', msg, 'danger')
        }
      }
      showConfirmModal.value = true
    }

    const cancelFaktur = (id: string) => {
      confirmType.value = 'warning'
      confirmTitle.value = 'Cancel Invoice?'
      confirmText.value = 'This invoice will be cancelled on DJP server.'
      confirmSubmitText.value = 'Yes, Cancel!'
      confirmCancelText.value = 'No'
      
      pendingConfirmAction = async () => {
        try {
          const response = await postVatOutCancel(vendorNpwp, { id: id.toString(), revokeFlag: false })
          const payload = response?.data?.result?.content || response?.data?.result || response?.data
          if (payload?.status === 'error' || response?.data?.result?.isError) {
            throw new Error(payload?.message || 'Cancellation failed.')
          }
          showNotification('Cancelled!', 'Invoice has been cancelled.')
          fetchData()
        } catch (error: any) {
          const msg = error.response?.data?.result?.content?.message || error.response?.data?.message || error.message || 'Cancellation failed.'
          showNotification('Error', msg, 'danger')
        }
      }
      showConfirmModal.value = true
    }

    const formatCurrency = (value: string | number) => {
      if (!value) return 'Rp 0'
      const val = typeof value === 'string' ? parseFloat(value) : value
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
    }

    const formatDate = (dateString: string) => {
      if (!dateString) return '-'
      if (dateString.length === 8) {
        return `${dateString.substring(0, 2)}/${dateString.substring(2, 4)}/${dateString.substring(4, 8)}`
      }
      return new Date(dateString).toLocaleDateString('id-ID')
    }

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case 'APPROVED': return 'badge badge-light-success px-2'
        case 'DRAFT':    return 'badge badge-light-warning px-2'
        case 'CANCELED': return 'badge badge-light-danger px-2'
        default:         return 'badge badge-light-secondary px-2'
      }
    }

    onMounted(() => { fetchData() })

    return { routes, tableData, pagedData, isLoading, currentPage, pageSize, setPage, fetchData, uploadFaktur, deleteFaktur, cancelFaktur, formatCurrency, formatDate, getStatusBadgeClass, goToDetail, showNotif, notifTitle, notifText, notifType, showConfirmModal, confirmType, confirmTitle, confirmText, confirmSubmitText, confirmCancelText, confirmLoading, handleConfirmSubmit, handleConfirmCancel }
  },
})
</script>

<style lang="scss" scoped>
.list__table {
  th, td {
    white-space: nowrap;
    font-family: inherit;
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
    background-color: #dbdfe9;
  }
}

.badge-light-success  { background-color: #e8fff3; color: #17c653; }
.badge-light-warning  { background-color: #fff8dd; color: #f6c000; }
.badge-light-danger   { background-color: #fff5f8; color: #f1416c; }
.badge-light-secondary { background-color: #f9f9f9; color: #7e8299; }
</style>
