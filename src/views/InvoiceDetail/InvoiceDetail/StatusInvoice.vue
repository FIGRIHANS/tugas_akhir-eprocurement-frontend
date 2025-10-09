<template>
  <div class="status">
    <!-- verified -->
    <div v-if="(props.statusCode === 2 && route.query.type === '1') || props.statusCode === 3" class="status__box--approved">
      <i class="ki-outline ki-shield-tick text-primary text-[36px]"></i>
      <div>
        <p class="text-[15px] font-semibold mb-[4px]">Successfully Verified</p>
        <p class="text-[13px] font-medium text-gray-700">
          The invoice has been successfully verified. Next, go to invoice approval for further action.
        </p>
      </div>
    </div>

    <!-- approved -->
    <div v-if="props.statusCode === 4" class="status__box--approved">
      <i class="ki-outline ki-shield-tick text-primary text-[36px]"></i>
      <div>
        <p class="text-[15px] font-semibold mb-[4px]">Successfully Approved</p>
        <p class="text-[13px] font-medium text-gray-700">
          The invoice has been successfully approved. Next, send the invoice to SAP for processing.
        </p>
      </div>
    </div>

    <!-- reject -->
    <div v-if="props.statusCode === 5" class="status__box--reject">
      <i class="ki-duotone ki-shield-cross text-danger text-[36px]"></i>
      <div>
        <p class="text-[15px] font-semibold mb-[4px]">Successfully Rejected Invoice</p>
        <p class="text-[13px] font-medium text-danger">
          The invoice has been rejected and returned to submitter.
        </p>
      </div>
    </div>

    <!-- sap -->
    <div v-if="props.statusCode === 7" class="status__box--approved">
      <SapLogo class="w-[72px] h-[36px]" />
      <div>
        <p class="text-[15px] font-semibold mb-[4px]">Successfully Send to SAP</p>
        <p class="text-[13px] font-medium text-gray-700">
          The invoice has been successfully send to SAP.
        </p>
      </div>
    </div>

    <div v-if="props.statusCode === 5" class="mt-[24px]">
      <UiTextArea v-model="reason" label="Reason" disabled />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'
import SapLogo from './StatusInvoice/SapLogo.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const props = defineProps<{
  statusCode: number
}>()

const route = useRoute()
const reason = ref<string>('')
const verificationApi = useInvoiceVerificationStore()

const detailInvoice = computed(() => verificationApi.detailInvoice)
const detailInvoiceNonPo = computed(() => verificationApi.detailNonPoInvoice)

const checkIsNonPo = () => {
  return route.query.invoiceType === 'no_po'
}

const getRejectReason = () => {
  if (!detailInvoice.value && !detailInvoiceNonPo.value) return

  const list = checkIsNonPo() ? detailInvoiceNonPo.value : detailInvoice.value
  const index = list?.workflow.findIndex((item) => item.stateCode === 5)

  if (index !== -1) reason.value = list.workflow[index].actionerNotes
}

watch(
  () => [detailInvoice.value, detailInvoiceNonPo.value],
  () => {
    getRejectReason()
  },
  {
    deep: true
  }
)

onMounted(() => {
  getRejectReason()
})
</script>

<style lang="scss" scoped>
@use '../styles/status-invoice.scss';
</style>
