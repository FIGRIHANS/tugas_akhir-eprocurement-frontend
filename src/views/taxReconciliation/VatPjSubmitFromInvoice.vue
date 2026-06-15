<template>
  <div class="pb-20 animate-in fade-in duration-300">
    <Breadcrumb title="Invoice Queue Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="space-y-6">
      
      <!-- Invoice Details Card -->
      <div class="card">
        <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
          <h3 class="card-title text-base font-semibold text-gray-800">Invoice Information</h3>
          <span
            :class="
              invoiceNo && !invoiceNo.startsWith('NPO')
                ? 'badge badge-light-primary px-2 font-semibold text-xs'
                : 'badge badge-light-warning px-2 font-semibold text-xs'
            "
          >
            {{ invoiceNo && !invoiceNo.startsWith('NPO') ? 'PO' : 'Non-PO' }}
          </span>
        </div>
        
        <div class="card-body flex flex-col gap-[16px]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
              <span class="text-xs text-gray-500 font-medium">Invoice No (NSFP)</span>
              <span class="text-sm font-bold text-primary">{{ invoiceNo || '—' }}</span>
            </div>
            <div class="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
              <span class="text-xs text-gray-500 font-medium">Invoice Date</span>
              <span class="text-sm font-semibold text-gray-800">{{ formattedInvoiceDate }}</span>
            </div>
            <div class="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
              <span class="text-xs text-gray-500 font-medium">Vendor Name</span>
              <span class="text-sm font-semibold text-gray-800">{{ vendorName || '—' }}</span>
            </div>
            <div class="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
              <span class="text-xs text-gray-500 font-medium">Vendor NPWP</span>
              <span class="text-sm font-semibold text-gray-800">{{ formattedNpwp }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tax Summary Card -->
      <div class="card">
        <div class="card-header py-[17px] flex items-center justify-between">
          <h3 class="card-title text-base font-semibold text-gray-800">Financial Summary</h3>
        </div>
        <div class="card-body flex flex-col gap-[16px]">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600">Tax Base (DPP)</span>
            <span class="text-sm font-semibold text-gray-800">{{ fmt(dppNum) }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600 font-semibold text-primary">VAT / PPN (12%)</span>
            <span class="text-base font-bold text-primary">{{ fmt(vatNum) }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-sm text-gray-600">Total Invoice Amount</span>
            <span class="text-base font-bold text-gray-800">{{ fmt(dppNum + vatNum) }}</span>
          </div>
        </div>
      </div>

      <!-- Status & Validation Card -->
      <div class="card">
        <div class="card-header py-[17px]">
          <h3 class="card-title text-base font-semibold text-gray-800">Reconciliation Match Status</h3>
        </div>
        <div class="card-body">
          <div class="p-4 rounded-xl border flex items-start gap-3" :class="statusBannerClass">
            <i class="ki-filled text-2xl shrink-0 mt-0.5" :class="statusIconClass"></i>
            <div class="space-y-1">
              <h4 class="font-bold text-sm">{{ statusTitle }}</h4>
              <p class="text-xs leading-relaxed">{{ statusDescription }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="pt-8 border-t border-gray-200 flex items-center justify-between">
        <button
          type="button"
          class="btn btn-outline btn-primary"
          @click="goBack"
        >
          <i class="ki-filled ki-arrow-left"></i>
          Back to List
        </button>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="btn btn-outline btn-danger px-6"
            :disabled="loadingSubmit || loadingReject"
            @click="handleReject"
          >
            <span v-if="loadingReject" class="loading loading-spinner loading-sm mr-2"></span>
            <i v-else class="ki-filled ki-cross-circle"></i>
            Reject to Vendor
          </button>
          <button
            type="button"
            class="btn btn-primary px-8"
            :disabled="loadingSubmit || loadingReject"
            @click="submitUpload"
          >
            <span v-if="loadingSubmit" class="loading loading-spinner loading-sm mr-2"></span>
            <i v-else class="ki-filled ki-verify"></i>
            Post Credit to DJP
          </button>
        </div>
      </div>

    </div>
  </div>

  <ModalConfirmation
    :open="showConfirmModal"
    id="vat-pj-action-confirm-modal"
    :type="confirmType"
    :title="confirmTitle"
    :text="confirmText"
    :submitButtonText="confirmSubmitButtonText"
    :cancelButtonText="confirmCancelButtonText"
    :loading="confirmLoading"
    :no-cancel="noCancel"
    :no-submit="noSubmit"
    @submit="handleConfirmSubmit"
    @cancel="handleConfirmCancel"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import moment from 'moment'
import vatApi from '@/core/utils/vatApi'
import { postVatInUpload } from '@/core/utils/vatPxInvoiceApi'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

const route = useRoute()
const router = useRouter()

const routes = computed<routeTypes[]>(() => [
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'VAT (Pajak Masukan)', to: '/vat-in-reconciliation' },
  { name: 'Invoice Queue Detail', to: '#' },
])

// Query variables passed from list view
const invoiceId = computed(() => String(route.query.invoiceId || '').trim())
const invoiceNo = computed(() => String(route.query.invoiceNo || ''))
const documentNo = computed(() => String(route.query.documentNo || ''))
const vendorName = computed(() => String(route.query.vendorName || ''))
const vendorNpwp = computed(() => String(route.query.vendorNpwp || ''))

const dppNum = computed(() => {
  const v = route.query.dpp
  return v ? Number(v) : 0
})

const vatNum = computed(() => {
  const v = route.query.vatAmount
  return v ? Number(v) : 0
})

// Sandbox testing overrides
const customFpNo = ref('')
const npwpPembeli = ref('1091031210969728')
const userIdSigner = ref('3172022407830008')
const kanal = ref('14')

// Loading states
const loadingSubmit = ref(false)
const loadingReject = ref(false)

const formattedInvoiceDate = computed(() => {
  const dateStr = route.query.invoiceDate
  if (!dateStr) return '—'
  const m = moment(dateStr)
  return m.isValid() ? m.format('DD/MM/YYYY') : '—'
})

const formattedNpwp = computed(() => {
  const raw = vendorNpwp.value.replace(/\D/g, '')
  if (raw.length === 15) {
    return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}.${raw.slice(8, 9)}.${raw.slice(9, 12)}.${raw.slice(12)}`
  }
  return vendorNpwp.value || '—'
})

// Dynamic Match Status computing based on Invoice values (For demo and reconciliation overview)
const isMatch = computed(() => {
  if (invoiceNo.value.includes('113')) return 'mismatch'
  if (invoiceNo.value.includes('114')) return 'match'
  return 'not_matched'
})

const statusBannerClass = computed(() => {
  if (isMatch.value === 'match') return 'bg-emerald-50 border-emerald-200 text-emerald-800'
  if (isMatch.value === 'mismatch') return 'bg-rose-50 border-rose-200 text-rose-800'
  return 'bg-amber-50 border-amber-200 text-amber-800'
})

const statusIconClass = computed(() => {
  if (isMatch.value === 'match') return 'ki-check-circle text-emerald-600'
  if (isMatch.value === 'mismatch') return 'ki-cross-circle text-rose-600'
  return 'ki-information-2 text-amber-600'
})

const statusTitle = computed(() => {
  if (isMatch.value === 'match') return 'Match Success'
  if (isMatch.value === 'mismatch') return 'VAT Amount Mismatch'
  return 'Not Yet Matched'
})

const statusDescription = computed(() => {
  if (isMatch.value === 'match') {
    return 'Nilai PPN di Invoice cocok dengan Faktur Pajak Masukan di Pajak Express sandbox.'
  }
  if (isMatch.value === 'mismatch') {
    return `Terdapat perbedaan PPN! PPN di Invoice adalah ${fmt(vatNum.value)}, sedangkan Faktur Pajak terdaftar di DJP bernilai ${fmt(72018000)}.`
  }
  return 'Faktur Pajak Masukan belum dicocokkan atau belum ditemukan di database DJP.'
})

function fmt(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function applySandboxFp(fp: string) {
  customFpNo.value = fp
}

const showConfirmModal = ref(false)
const confirmType = ref<'danger' | 'warning' | 'confirm' | 'success'>('confirm')
const confirmTitle = ref('')
const confirmText = ref('')
const confirmSubmitButtonText = ref('Submit')
const confirmCancelButtonText = ref('Cancel')
const confirmLoading = ref(false)
const noCancel = ref(false)
const noSubmit = ref(false)
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
  } else {
    showConfirmModal.value = false
  }
}

const handleConfirmCancel = () => {
  showConfirmModal.value = false
}

const showMessage = (title: string, text: string, type: 'success' | 'danger') => {
  confirmType.value = type
  confirmTitle.value = title
  confirmText.value = text
  confirmSubmitButtonText.value = 'Close'
  noCancel.value = true
  noSubmit.value = false
  pendingConfirmAction = null
  showConfirmModal.value = true
}

const showConfirm = (title: string, text: string, type: 'confirm' | 'warning', submitText: string, onConfirm: () => Promise<void>) => {
  confirmType.value = type
  confirmTitle.value = title
  confirmText.value = text
  confirmSubmitButtonText.value = submitText
  confirmCancelButtonText.value = 'Batal'
  noCancel.value = false
  noSubmit.value = false
  pendingConfirmAction = onConfirm
  showConfirmModal.value = true
}

async function submitUpload() {
  const finalFp = (customFpNo.value || invoiceNo.value || '').trim()
  if (!finalFp) {
    showMessage('Error', 'Nomor Faktur Pajak tidak ditemukan.', 'danger')
    return
  }

  showConfirm(
    'Post Credit?',
    'Apakah Anda yakin ingin melakukan Post Credit kredensial pengkreditan ke DJP Coretax?',
    'confirm',
    'Ya, Kirim',
    async () => {
      loadingSubmit.value = true
      try {
        const today = moment()
        const pjPayload = {
          fgPermintaan: 2,
          npwpPembeli: npwpPembeli.value,
          userId: userIdSigner.value,
          kanal: kanal.value,
          konfirmasiFakturMasukan: {
            konfirmasiPengkreditan: 'CREDITED',
            nomorFaktur: finalFp,
            masaPajak: today.format('MM'),
            tahunPajak: today.format('YYYY'),
          },
        }

        await postVatInUpload({
          payload: pjPayload,
          invoiceId: invoiceId.value ? Number(invoiceId.value) : 0,
          npwpPenjual: vendorNpwp.value.replace(/\D/g, ''),
          namaVendor: vendorName.value || undefined,
          tanggalFaktur: today.format('YYYY-MM-DD'),
          dpp: dppNum.value > 0 ? dppNum.value : undefined,
          ppn: vatNum.value > 0 ? vatNum.value : undefined,
        })

        // Show success and redirect on close
        setTimeout(() => {
          showMessage('Success', 'Kredensial pengkreditan berhasil dikirim (Post Credit) ke DJP Coretax!', 'success')
          pendingConfirmAction = async () => {
            router.push({ name: 'vatInReconciliation' })
          }
        }, 300)
      } catch (e: any) {
        showMessage('Error', 'Gagal melakukan Post Credit: ' + (e.response?.data?.message || e.message), 'danger')
      } finally {
        loadingSubmit.value = false
      }
    }
  )
}

async function handleReject() {
  if (!invoiceId.value) return
  
  showConfirm(
    'Reject Invoice',
    `Apakah Anda yakin ingin menolak (Reject) Invoice No: ${documentNo.value || invoiceNo.value} dari antrean Pajak?`,
    'warning',
    'Ya, Reject!',
    async () => {
      loadingReject.value = true
      try {
        const res = await vatApi.post(`/vat/vat-in/reject/${invoiceId.value}`)
        if (res.status === 200 || res.data?.isError === false) {
          setTimeout(() => {
            showMessage('Success', 'Invoice berhasil ditolak (Reject) dari antrean Pajak.', 'success')
            pendingConfirmAction = async () => {
              router.push({ name: 'vatInReconciliation' })
            }
          }, 300)
        } else {
          showMessage('Error', 'Gagal menolak Invoice: ' + (res.data?.message || 'Error pada server.'), 'danger')
        }
      } catch (error: any) {
        showMessage('Error', 'Gagal menolak Invoice: ' + (error.response?.data?.message || error.message), 'danger')
      } finally {
        loadingReject.value = false
      }
    }
  )
}

function goBack() {
  router.push({ name: 'vatInReconciliation' })
}
</script>

<style scoped lang="scss">
.badge-light-primary {
  background-color: #f1faff;
  color: #009ef7;
}
.badge-light-warning {
  background-color: #fff8dd;
  color: #ffc700;
}
</style>
