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
          <UiInputSearch v-model="search" placeholder="Search Invoice/Buyer" @search="onSearch" />
          <button
            type="button"
            class="btn btn-outline btn-primary"
            @click="fetchData"
            :disabled="isLoading"
          >
            <i class="ki-filled ki-arrows-circle !text-base"></i>
            Reload Data
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
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">NPWP Buyer</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-right">DPP</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-right">VAT</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="8" class="text-center py-10">
                <span class="loading loading-spinner loading-md text-primary"></span>
                <p class="mt-2 text-gray-500">Loading data...</p>
              </td>
            </tr>
            <tr v-else-if="pagedData.length === 0">
              <td colspan="8" class="text-center py-10 text-gray-400 italic">
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

                  <div
                    v-if="
                      row.statusfaktur === 'DRAFT' ||
                      row.statusfaktur === 'APPROVED' ||
                      row.statusfaktur === 'CANCELED'
                    "
                    class="dropdown"
                    data-dropdown="true"
                    data-dropdown-trigger="click"
                    data-dropdown-placement="bottom-end"
                  >
                    <button class="dropdown-toggle btn btn-light btn-icon btn-sm">
                      <i class="ki-filled ki-dots-vertical !text-lg"></i>
                    </button>
                    <div class="dropdown-content w-full max-w-48 py-2">
                      <div class="menu menu-default flex flex-col w-full">
                        <div
                          v-if="row.statusfaktur === 'DRAFT'"
                          class="menu-item"
                          @click="uploadFaktur(row.id)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-filled ki-cloud-add text-primary !text-lg"></i>
                            </span>
                            <span class="menu-title">Upload to DJP</span>
                          </div>
                        </div>
                        <div
                          v-if="row.statusfaktur === 'DRAFT'"
                          class="menu-item"
                          @click="deleteFaktur(row.id)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-filled ki-trash text-danger !text-lg"></i>
                            </span>
                            <span class="menu-title">Delete Draft</span>
                          </div>
                        </div>
                        <div
                          v-if="row.statusfaktur === 'APPROVED' || row.statusfaktur === 'CANCELED'"
                          class="menu-item"
                          @click="openPreview(row)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-filled ki-file-down text-success !text-lg"></i>
                            </span>
                            <span class="menu-title">View PDF</span>
                          </div>
                        </div>
                        <div
                          v-if="row.statusfaktur === 'APPROVED'"
                          class="menu-item"
                          @click="cancelFaktur(row.id)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-filled ki-cross-circle text-danger !text-lg"></i>
                            </span>
                            <span class="menu-title">Cancel Invoice</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="font-medium">{{ row.nomorfaktur || '-' }}</td>
              <td>{{ formatDate(row.tanggalfaktur) }}</td>
              <td>{{ row.namapembeli }}</td>
              <td>{{ row.npwppembeli || '-' }}</td>
              <td class="text-right">{{ formatCurrency(row.totaldpp) }}</td>
              <td class="text-right text-primary font-semibold">
                {{ formatCurrency(row.totalppn) }}
              </td>
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
          :totalItems="filteredData.length"
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

  <UiModal v-model="showPreviewModal" title="View VAT Out PDF" size="xl">
    <div v-if="pdfLoading" class="flex flex-col items-center justify-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-500 font-medium">Generating PDF preview...</p>
    </div>
    <iframe
      v-else-if="pdfBlobUrl"
      :src="pdfBlobUrl"
      class="w-full h-[650px] rounded-lg border-0"
    ></iframe>
  </UiModal>

  <!-- Hidden Printable Faktur Pajak Template -->
  <div style="position: fixed; top: 0; left: 0; z-index: -9999; opacity: 0; pointer-events: none">
    <div
      id="faktur-print-hidden"
      style="
        width: 794px;
        height: 1122px;
        background: white;
        padding: 30px;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        color: black;
        line-height: 1.25;
        position: relative;
      "
    >
      <div
        class="faktur-container-print-only"
        style="
          border: 1px solid black;
          padding: 20px;
          height: 100%;
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        "
      >
        <div
          v-if="activeRow?.statusfaktur === 'CANCELED'"
          style="
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg);
            font-size: 80px;
            font-weight: 800;
            color: rgba(229, 62, 62, 0.15);
            border: 8px solid rgba(229, 62, 62, 0.15);
            padding: 8px 24px;
            pointer-events: none;
            z-index: 10;
            letter-spacing: 6px;
            text-transform: uppercase;
          "
        >
          CANCELED
        </div>
        <div
          v-else
          style="
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg);
            font-size: 80px;
            font-weight: 800;
            color: rgba(160, 174, 192, 0.12);
            border: 8px solid rgba(160, 174, 192, 0.12);
            padding: 8px 24px;
            pointer-events: none;
            z-index: 10;
            letter-spacing: 6px;
            text-transform: uppercase;
          "
        >
          PROFORMA
        </div>

        <div
          style="
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
          "
        >
          Faktur Pajak
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 8px">
          <tr>
            <td colspan="4" style="border: 1px solid black; padding: 5px">
              <strong>Kode dan Nomor Seri Faktur Pajak :</strong>
              {{ activeRow?.nomorfaktur || '-' }}
            </td>
          </tr>
          <tr style="font-weight: bold; background-color: #f2f2f2">
            <td colspan="4" style="border: 1px solid black; padding: 5px">Pengusaha Kena Pajak</td>
          </tr>
          <tr>
            <td colspan="4" style="border: 1px solid black; padding: 5px; line-height: 1.4">
              Nama : {{ activeRow?.namatokopenjual || '-' }}<br />
              Alamat :
              {{
                activeRow?.alamatpenjual ||
                'Kpg. Arlie no 7, RT007/RW001, TEBET BARAT, TEBET, KOTA ADM. JAKARTA SELATAN, DKI JAKARTA, 12810'
              }}<br />
              NPWP : {{ activeRow?.npwppenjual || '-' }}
            </td>
          </tr>
          <tr style="font-weight: bold; background-color: #f2f2f2">
            <td colspan="4" style="border: 1px solid black; padding: 5px">
              Pembeli Barang Kena Pajak / Penerima Jasa Kena Pajak
            </td>
          </tr>
          <tr>
            <td colspan="4" style="border: 1px solid black; padding: 5px; line-height: 1.4">
              Nama : {{ activeRow?.namapembeli || '-' }}<br />
              Alamat : {{ activeRow?.alamatpembeli || '-' }}<br />
              NPWP : {{ activeRow?.npwppembeli || '-' }}<br />
              NIK : -<br />
              Nomor Paspor : -<br />
              Identitas Lain : -<br />
              Email : {{ activeRow?.emailpembeli || '-' }}
            </td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px">
          <thead>
            <tr style="background-color: #f2f2f2; text-align: center; font-weight: bold">
              <th style="width: 5%; border: 1px solid black; padding: 5px">No</th>
              <th style="width: 15%; border: 1px solid black; padding: 5px">Kode Barang/Jasa</th>
              <th style="width: 55%; border: 1px solid black; padding: 5px">
                Nama Barang Kena Pajak / Jasa Kena Pajak
              </th>
              <th style="width: 25%; border: 1px solid black; padding: 5px">
                Harga Jual / Penggantian / Uang Muka / Termin (Rp)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid black; padding: 5px; text-align: center">1</td>
              <td style="border: 1px solid black; padding: 5px; text-align: center">000000</td>
              <td style="border: 1px solid black; padding: 5px; line-height: 1.3">
                GOODS - Sample Item<br />
                <span style="font-size: 10px; color: #555">
                  Rp {{ formatIndo(activeRow?.totaldpp) }} x 1<br />
                  Potongan Harga = Rp 0,00<br />
                  PPnBM (0%) = Rp 0,00
                </span>
              </td>
              <td style="border: 1px solid black; padding: 5px; text-align: right">
                {{ formatIndo(activeRow?.totaldpp) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black; padding: 5px; font-weight: bold">
                Harga Jual / Penggantian / Uang Muka / Termin
              </td>
              <td
                style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold"
              >
                {{ formatIndo(activeRow?.totaldpp) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black; padding: 5px">
                Dikurangi Potongan Harga
              </td>
              <td style="border: 1px solid black; padding: 5px; text-align: right">0,00</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black; padding: 5px">
                Dikurangi Uang Muka yang telah diterima
              </td>
              <td style="border: 1px solid black; padding: 5px; text-align: right">0,00</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black; padding: 5px; font-weight: bold">
                Dasar Pengenaan Pajak
              </td>
              <td
                style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold"
              >
                {{ formatIndo(activeRow?.totaldpp) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black; padding: 5px; font-weight: bold">
                Jumlah PPN (Pajak Pertambahan Nilai)
              </td>
              <td
                style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold"
              >
                {{ formatIndo(activeRow?.totalppn) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black; padding: 5px">
                Jumlah PPnBM (Pajak Penjualan atas Barang Mewah)
              </td>
              <td style="border: 1px solid black; padding: 5px; text-align: right">
                {{ formatIndo(activeRow?.totalppnbm || 0) }}
              </td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 9px; margin-top: 10px; line-height: 1.3; color: #4a5568">
          Sesuai dengan ketentuan yang berlaku, Direktorat Jenderal Pajak mengatur bahwa Faktur
          Pajak ini telah ditandatangani secara elektronik sehingga tidak diperlukan tanda tangan
          basah pada Faktur Pajak ini.
        </p>

        <table style="width: 100%; border: 0; margin-top: 15px; font-size: 11px">
          <tr>
            <td style="vertical-align: top; color: #555">{{ activeRow?.referensi || '' }}</td>
            <td style="text-align: center; width: 250px">
              <div>Jakarta, {{ formatDisplayDate(activeRow?.tanggalfaktur) }}</div>
              <div
                style="
                  margin-top: 45px;
                  font-weight: bold;
                  text-decoration: underline;
                  text-transform: uppercase;
                "
              >
                {{ activeRow?.namapenandatangan || 'RADHITYA ARIE KENPRASOJO' }}
              </div>
            </td>
          </tr>
        </table>

        <div
          style="
            font-size: 8px;
            border-top: 1px solid black;
            padding-top: 5px;
            margin-top: 25px;
            color: #4a5568;
            line-height: 1.3;
          "
        >
          <strong>PEMBERITAHUAN:</strong> Faktur Pajak ini telah dilaporkan ke Direktorat Jenderal
          Pajak dan telah memperoleh persetujuan sesuai dengan ketentuan peraturan perpajakan yang
          berlaku. PERINGATAN: PKP yang menerbitkan Faktur Pajak yang tidak sesuai dengan keadaan
          yang sebenarnya dan/atau sesungguhnya dimaksud Pasal 13 ayat (9) UU PPN dikenai sanksi
          administrasi sesuai dengan Pasal 14 ayat (4) UU KUP.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import {
  getVatOutList,
  postVatOutUpload,
  postVatOutDelete,
  postVatOutCancel,
} from '@/core/utils/vatPxInvoiceApi'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'

export default defineComponent({
  name: 'VatOutReconciliation',
  components: {
    Breadcrumb,
    LPagination,
    ModalNotification,
    ModalConfirmation,
    UiModal,
    UiInputSearch,
  },
  setup() {
    const router = useRouter()
    const tableData = ref<any[]>([])
    const isLoading = ref(false)
    const vendorNpwp = '1091031210969728'
    const search = ref('')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)

    const onSearch = () => {
      searchQuery.value = search.value
      currentPage.value = 1
    }

    const filteredData = computed(() => {
      let filtered = [...tableData.value]
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        filtered = filtered.filter((item) =>
          Object.values(item).some((val) => String(val).toLowerCase().includes(q)),
        )
      }
      return filtered
    })

    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredData.value.slice(start, end)
    })

    const activeDropdownId = ref<string | null>(null)
    const toggleDropdown = (id: string) => {
      activeDropdownId.value = activeDropdownId.value === id ? null : id
    }
    const closeAllDropdowns = () => {
      activeDropdownId.value = null
    }

    const closeDropdowns = () => {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
      document.body.dispatchEvent(event)
    }

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
      setTimeout(() => {
        showNotif.value = false
      }, 3000)
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
      closeDropdowns()
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
          const payload =
            response?.data?.result?.content || response?.data?.result || response?.data
          if (payload?.status === 'error' || response?.data?.result?.isError) {
            throw new Error(payload?.message || 'Upload failed.')
          }
          showNotification('Success', 'Invoice successfully uploaded to DJP.')
          fetchData()
        } catch (error: any) {
          const msg =
            error.response?.data?.result?.content?.message ||
            error.response?.data?.message ||
            error.message ||
            'Upload failed.'
          showNotification('Error', msg, 'danger')
        }
      }
      showConfirmModal.value = true
    }

    const deleteFaktur = (id: string) => {
      closeDropdowns()
      confirmType.value = 'warning'
      confirmTitle.value = 'Delete Draft Invoice?'
      confirmText.value = 'Are you sure you want to delete this draft invoice?'
      confirmSubmitText.value = 'Yes, Delete!'
      confirmCancelText.value = 'Cancel'

      pendingConfirmAction = async () => {
        try {
          const response = await postVatOutDelete(vendorNpwp, { id: id.toString() })
          const payload =
            response?.data?.result?.content || response?.data?.result || response?.data
          if (payload?.status === 'error' || response?.data?.result?.isError) {
            throw new Error(payload?.message || 'Delete failed.')
          }
          showNotification('Deleted!', 'Draft invoice has been deleted.')
          fetchData()
        } catch (error: any) {
          const msg =
            error.response?.data?.result?.content?.message ||
            error.response?.data?.message ||
            error.message ||
            'Delete failed.'
          showNotification('Error', msg, 'danger')
        }
      }
      showConfirmModal.value = true
    }

    const cancelFaktur = (id: string) => {
      closeDropdowns()
      confirmType.value = 'warning'
      confirmTitle.value = 'Cancel Invoice?'
      confirmText.value = 'This invoice will be cancelled on DJP server.'
      confirmSubmitText.value = 'Yes, Cancel!'
      confirmCancelText.value = 'No'

      pendingConfirmAction = async () => {
        try {
          const response = await postVatOutCancel(vendorNpwp, {
            id: id.toString(),
            revokeFlag: false,
          })
          const payload =
            response?.data?.result?.content || response?.data?.result || response?.data
          if (payload?.status === 'error' || response?.data?.result?.isError) {
            throw new Error(payload?.message || 'Cancellation failed.')
          }
          showNotification('Cancelled!', 'Invoice has been cancelled.')
          fetchData()
        } catch (error: any) {
          const msg =
            error.response?.data?.result?.content?.message ||
            error.response?.data?.message ||
            error.message ||
            'Cancellation failed.'
          showNotification('Error', msg, 'danger')
        }
      }
      showConfirmModal.value = true
    }

    const formatCurrency = (value: string | number) => {
      if (!value) return 'Rp 0'
      const val = typeof value === 'string' ? parseFloat(value) : value
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(val)
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
        case 'APPROVED':
          return 'badge badge-light-success px-2'
        case 'DRAFT':
          return 'badge badge-light-warning px-2'
        case 'CANCELED':
          return 'badge badge-light-danger px-2'
        default:
          return 'badge badge-light-secondary px-2'
      }
    }

    const handleDownloadPdf = (row: any) => {
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        showNotification('Error', 'Failed to open print window. Please allow popups.', 'danger')
        return
      }

      const formatIndo = (numStr: any) => {
        const val = parseFloat(numStr) || 0
        return new Intl.NumberFormat('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(val)
      }

      const formattedDpp = formatIndo(row.totaldpp)
      const formattedPpn = formatIndo(row.totalppn)
      const formattedPpnBm = formatIndo(row.totalppnbm || 0)

      const rawDate = row.tanggalfaktur
      let displayDate = ''
      if (rawDate) {
        const dateObj = new Date(rawDate)
        if (!isNaN(dateObj.getTime())) {
          displayDate = dateObj
            .toLocaleDateString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
            .replace(/\//g, '')
        } else if (rawDate.length === 8) {
          displayDate = rawDate
        }
      }

      const itemsHtml = `
        <tr>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">1</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">000000</td>
          <td style="border: 1px solid black; padding: 4px; font-size: 11px; line-height: 1.3;">
            GOODS - Sample Item<br/>
            Rp ${formatIndo(row.totaldpp)} x 1<br/>
            Potongan Harga = Rp 0,00<br/>
            PPnBM (0%) = Rp 0,00
          </td>
          <td style="border: 1px solid black; text-align: right; padding: 4px;">${formattedDpp}</td>
        </tr>
      `

      const htmlContent = `
        <html>
        <head>
          <title>Faktur Pajak - ${row.nomorfaktur || 'Draft'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 11px;
              color: black;
              margin: 10px;
            }
            .container {
              width: 100%;
              max-width: 750px;
              margin: 0 auto;
              border: 1px solid black;
              padding: 15px;
              position: relative;
            }
            .header-title {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              text-transform: uppercase;
            }
            .table-full {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8px;
            }
            .table-full td, .table-full th {
              border: 1px solid black;
              padding: 5px;
              vertical-align: top;
            }
            .section-title {
              font-weight: bold;
              background-color: #f2f2f2;
            }
            .watermark {
              position: absolute;
              top: 30%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-25deg);
              font-size: 75px;
              font-weight: bold;
              color: rgba(200, 200, 200, 0.4);
              pointer-events: none;
              z-index: 999;
              letter-spacing: 5px;
            }
            .footer-sign {
              margin-top: 15px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .footer-note {
              font-size: 9px;
              border-top: 1px solid black;
              padding-top: 5px;
              margin-top: 25px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="watermark">Proforma</div>
            <div class="header-title">Faktur Pajak</div>

            <table class="table-full">
              <tr>
                <td colspan="4">
                  <strong>Kode dan Nomor Seri Faktur Pajak :</strong> ${row.nomorfaktur || '-'}
                </td>
              </tr>

              <tr class="section-title">
                <td colspan="4">Pengusaha Kena Pajak</td>
              </tr>
              <tr>
                <td colspan="4" style="line-height: 1.4;">
                  Nama : ${row.namatokopenjual || '-'}<br/>
                  Alamat : ${row.alamatpenjual || 'Kpg. Arlie no 7, RT007/RW001, TEBET BARAT, TEBET, KOTA ADM. JAKARTA SELATAN, DKI JAKARTA, 12810'}<br/>
                  NPWP : ${row.npwppenjual || '-'}
                </td>
              </tr>

              <tr class="section-title">
                <td colspan="4">Pembeli Barang Kena Pajak / Penerima Jasa Kena Pajak</td>
              </tr>
              <tr>
                <td colspan="4" style="line-height: 1.4;">
                  Nama : ${row.namapembeli || '-'}<br/>
                  Alamat : ${row.alamatpembeli || '-'}<br/>
                  NPWP : ${row.npwppembeli || '-'}<br/>
                  NIK : -<br/>
                  Nomor Paspor : -<br/>
                  Identitas Lain : -<br/>
                  Email : ${row.emailpembeli || '-'}
                </td>
              </tr>
            </table>

            <table class="table-full" style="margin-top: 10px;">
              <thead>
                <tr style="background-color: #f2f2f2; text-align: center;">
                  <th style="width: 5%;">No</th>
                  <th style="width: 15%;">Kode Barang/Jasa</th>
                  <th style="width: 55%;">Nama Barang Kena Pajak / Jasa Kena Pajak</th>
                  <th style="width: 25%;">Harga Jual / Penggantian / Uang Muka / Termin (Rp)</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr>
                  <td colspan="3" style="font-weight: bold; border: 1px solid black;">Harga Jual / Penggantian / Uang Muka / Termin</td>
                  <td style="border: 1px solid black; text-align: right; font-weight: bold;">${formattedDpp}</td>
                </tr>
                <tr>
                  <td colspan="3" style="border: 1px solid black;">Dikurangi Potongan Harga</td>
                  <td style="border: 1px solid black; text-align: right;">0,00</td>
                </tr>
                <tr>
                  <td colspan="3" style="border: 1px solid black;">Dikurangi Uang Muka yang telah diterima</td>
                  <td style="border: 1px solid black; text-align: right;">0,00</td>
                </tr>
                <tr>
                  <td colspan="3" style="font-weight: bold; border: 1px solid black;">Dasar Pengenaan Pajak</td>
                  <td style="border: 1px solid black; text-align: right; font-weight: bold;">${formattedDpp}</td>
                </tr>
                <tr>
                  <td colspan="3" style="font-weight: bold; border: 1px solid black;">Jumlah PPN (Pajak Pertambahan Nilai)</td>
                  <td style="border: 1px solid black; text-align: right; font-weight: bold;">${formattedPpn}</td>
                </tr>
                <tr>
                  <td colspan="3" style="border: 1px solid black;">Jumlah PPnBM (Pajak Penjualan atas Barang Mewah)</td>
                  <td style="border: 1px solid black; text-align: right;">${formattedPpnBm}</td>
                </tr>
              </tbody>
            </table>

            <p style="font-size: 10px; margin-top: 10px; line-height: 1.3; margin-bottom: 15px;">
              Sesuai dengan ketentuan yang berlaku, Direktorat Jenderal Pajak mengatur bahwa Faktur Pajak ini telah ditandatangani secara elektronik sehingga tidak diperlukan tanda tangan basah pada Faktur Pajak ini.
            </p>

            <div class="footer-sign">
              <div>
                <span style="font-size: 10px; display: block; margin-top: 10px;">${row.referensi || ''}</span>
              </div>
              <div style="text-align: center; margin-right: 40px; font-size: 11px;">
                <span style="display: block; margin-bottom: 45px;">Jakarta, ${displayDate}</span>
                <strong style="text-decoration: underline; text-transform: uppercase;">${row.namapenandatangan || 'RADHITYA ARIE KENPRASOJO'}</strong>
              </div>
            </div>

            <div class="footer-note">
              <strong>PEMBERITAHUAN:</strong> Faktur Pajak ini telah dilaporkan ke Direktorat Jenderal Pajak dan telah memperoleh persetujuan sesuai dengan ketentuan peraturan perpajakan yang berlaku. PERINGATAN: PKP yang menerbitkan Faktur Pajak yang tidak sesuai dengan keadaan yang sebenarnya dan/atau sesungguhnya dimaksud Pasal 13 ayat (9) UU PPN dikenai sanksi administrasi sesuai dengan Pasal 14 ayat (4) UU KUP.
              <span style="float: right;">1 dari 1</span>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          <\/script>
        </body>
        </html>
      `

      printWindow.document.write(htmlContent)
      printWindow.document.close()
    }

    const showPreviewModal = ref(false)
    const activeRow = ref<any>(null)
    const pdfBlobUrl = ref('')
    const pdfLoading = ref(false)

    const loadHtml2Pdf = () => {
      return new Promise<any>((resolve) => {
        if ((window as any).html2pdf) {
          resolve((window as any).html2pdf)
          return
        }
        const script = document.createElement('script')
        script.src =
          'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
        script.onload = () => resolve((window as any).html2pdf)
        document.head.appendChild(script)
      })
    }

    const openPreview = async (row: any) => {
      closeDropdowns()
      activeRow.value = row
      showPreviewModal.value = true
      pdfLoading.value = true
      pdfBlobUrl.value = ''

      try {
        const html2pdf = await loadHtml2Pdf()
        setTimeout(() => {
          const element = document.getElementById('faktur-print-hidden')
          const opt = {
            margin: 0,
            filename: `Faktur_${row.nomorfaktur || 'Pajak'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          }

          html2pdf()
            .from(element)
            .set(opt)
            .toPdf()
            .get('pdf')
            .then((pdf: any) => {
              const blob = pdf.output('blob')
              pdfBlobUrl.value = URL.createObjectURL(blob)
              pdfLoading.value = false
            })
            .catch((err: any) => {
              console.error('Error rendering pdf', err)
              pdfLoading.value = false
            })
        }, 300)
      } catch (error) {
        console.error('Failed to load html2pdf script:', error)
        pdfLoading.value = false
      }
    }

    const formatIndo = (numStr: any) => {
      const val = parseFloat(numStr) || 0
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val)
    }

    const formatDisplayDate = (dateString: string) => {
      if (!dateString) return ''
      const dateObj = new Date(dateString)
      if (!isNaN(dateObj.getTime())) {
        return dateObj
          .toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace(/\//g, '')
      }
      return dateString
    }

    onMounted(() => {
      fetchData()
      window.addEventListener('click', closeAllDropdowns)
    })

    onUnmounted(() => {
      window.removeEventListener('click', closeAllDropdowns)
    })

    return {
      search,
      searchQuery,
      onSearch,
      filteredData,
      routes,
      tableData,
      pagedData,
      isLoading,
      currentPage,
      pageSize,
      setPage,
      fetchData,
      uploadFaktur,
      deleteFaktur,
      cancelFaktur,
      handleDownloadPdf,
      formatCurrency,
      formatDate,
      getStatusBadgeClass,
      goToDetail,
      showNotif,
      notifTitle,
      notifText,
      notifType,
      showConfirmModal,
      confirmType,
      confirmTitle,
      confirmText,
      confirmSubmitText,
      confirmCancelText,
      confirmLoading,
      handleConfirmSubmit,
      handleConfirmCancel,
      showPreviewModal,
      activeRow,
      openPreview,
      formatIndo,
      formatDisplayDate,
      pdfBlobUrl,
      pdfLoading,
      activeDropdownId,
      toggleDropdown,
    }
  },
})
</script>

<style lang="scss" scoped>
.list__table {
  th,
  td {
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

.badge-light-success {
  background-color: #e8fff3;
  color: #17c653;
}
.badge-light-warning {
  background-color: #fff8dd;
  color: #f6c000;
}
.badge-light-danger {
  background-color: #fff5f8;
  color: #f1416c;
}
.badge-light-secondary {
  background-color: #f9f9f9;
  color: #7e8299;
}

.faktur-container-preview {
  position: relative;
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 24px;
  font-family: Arial, sans-serif;
  color: #1a202c;
  overflow: hidden;
}
.faktur-header {
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.faktur-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
.faktur-table td,
.faktur-table th {
  border: 1px solid #1a202c;
  padding: 6px;
  vertical-align: top;
}
.faktur-section {
  font-weight: bold;
  background-color: #f7fafc;
}
.lh-1_5 {
  line-height: 1.5;
}
.text-2xs {
  font-size: 9px;
}
.faktur-footer {
  font-size: 8px;
  border-top: 1px solid #1a202c;
  padding-top: 6px;
  margin-top: 24px;
  color: #4a5568;
}
.watermark-text {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-25deg);
  font-size: 80px;
  font-weight: 800;
  color: rgba(160, 174, 192, 0.12);
  border: 8px solid rgba(160, 174, 192, 0.12);
  padding: 8px 24px;
  pointer-events: none;
  z-index: 10;
  letter-spacing: 6px;
  text-transform: uppercase;
}
.watermark-text.canceled {
  color: rgba(229, 62, 62, 0.15);
  border-color: rgba(229, 62, 62, 0.15);
}
</style>
