<template>
  <div class="modal" data-modal="true" id="rir_detail_verification_modal">
    <div class="modal-content max-w-[900px] modal-center-y">
      <div class="modal-header">
        <h3 class="modal-title text-lg font-semibold text-gray-700">
          Recurring Invoice Reminder - {{ props.detail?.invoiceReminder }}
        </h3>
        <button class="btn btn-xs btn-icon btn-light btn-clear" data-modal-dismiss="true">
          <i class="ki-duotone ki-cross"></i>
        </button>
      </div>
      <div class="modal-body p-[16px]">
        <div class="space-y-6">
          <div class="border-b pb-4">
            <h4 class="text-md font-semibold text-gray-700 mb-4">Detail Informasi</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-normal text-gray-500">Invoice Reminder</label>
                <p class="text-sm font-semibold text-gray-700">{{ props.detail?.invoiceReminder }}</p>
              </div>
              <div>
                <label class="text-xs font-normal text-gray-500">Due Date</label>
                <p class="text-sm font-semibold text-gray-700">{{ formatDate(props.detail?.dueDate) }}</p>
              </div>
              <div>
                <label class="text-xs font-normal text-gray-500">Status</label>
                <p class="text-sm font-semibold text-gray-700">
                  <span class="badge" :class="getStatusBadgeClass(props.detail?.status)">
                    {{ props.detail?.status }}
                  </span>
                </p>
              </div>
              <div>
                <label class="text-xs font-normal text-gray-500">Periode</label>
                <p class="text-sm font-semibold text-gray-700">{{ props.detail?.periode }}</p>
              </div>
            </div>
          </div>

          <div class="border-b pb-4">
            <h4 class="text-md font-semibold text-gray-700 mb-4">Detail Aktivitas</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-normal text-gray-500">Invoice Type</label>
                <p class="text-sm font-semibold text-gray-700">{{ props.detail?.invoiceType }}</p>
              </div>
              <div>
                <label class="text-xs font-normal text-gray-500">Activity Code</label>
                <p class="text-sm font-semibold text-gray-700">{{ props.detail?.activityCode }}</p>
              </div>
              <div class="col-span-2">
                <label class="text-xs font-normal text-gray-500">Activity Name</label>
                <p class="text-sm font-semibold text-gray-700">{{ props.detail?.activityName }}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-md font-semibold text-gray-700 mb-4">Detail Jumlah</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-normal text-gray-500">Billed Amount</label>
                <p class="text-sm font-semibold text-gray-700">{{ formatCurrency(props.detail?.billedAmount) }}</p>
              </div>
              <div>
                <label class="text-xs font-normal text-gray-500">Aging Days</label>
                <p class="text-sm font-semibold text-gray-700">{{ props.detail?.agingDays }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-light" data-modal-dismiss="true">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface RecurringInvoiceReminder {
  invoiceReminder: string
  dueDate: string
  status: string
  periode: string
  invoiceType: string
  activityCode: string
  activityName: string
  billedAmount: number
  agingDays: string
}

const props = defineProps<{
  detail?: RecurringInvoiceReminder
}>()

const formatDate = (date?: string) => {
  if (!date) return '-'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
  return new Date(date).toLocaleDateString('de-DE', options)
}

const formatCurrency = (amount?: number) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const getStatusBadgeClass = (status?: string) => {
  switch (status) {
    case 'Open':
      return 'bg-yellow-50 text-yellow-700'
    case 'Paid':
      return 'bg-emerald-50 text-emerald-700'
    case 'Pending':
      return 'bg-blue-50 text-blue-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}
</script>
