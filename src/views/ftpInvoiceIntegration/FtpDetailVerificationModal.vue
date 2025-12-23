<template>
  <div class="modal" data-modal="true" id="detail_verification_modal">
    <div class="modal-content max-w-[900px] modal-center-y">
      <div class="modal-header">
        <h3 class="modal-title text-lg font-semibold text-gray-700">
          FTP Invoice Integration - Verification Detail
        </h3>
        <button class="btn btn-xs btn-icon btn-light btn-clear" data-modal-dismiss="true">
          <i class="ki-duotone ki-cross"></i>
        </button>
      </div>
      <div class="modal-body p-[0px] pb-[16px]">
        <div class="border border-gray-200 text-center text-lg font-semibold text-gray-700">
          No Invoice :
          {{
            props.type === 'po'
              ? invoiceDetail?.header?.invoiceNo
              : invoiceDetail?.header?.invoiceNo
          }}
        </div>
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <td v-for="(item, index) in columns" :key="index" class="detail-approval__column">
                {{ item }}
              </td>
            </tr>
          </thead>
          <tbody>
            <template v-if="invoiceDetail?.workflow?.length">
              <tr
                v-for="(item, index) in invoiceDetail.workflow"
                :key="index"
                class="text-sm font-normal"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ item.profileName }}</td>
                <td>{{ item.actionerName || '-' }}</td>
                <td>{{ formatDateYearFirst(item.actionerDate) }}</td>
                <td>
                  <span v-if="item.stateCode === 99">-</span>
                  <span v-else class="badge badge-outline" :class="badgeColor(item.stateCode)">
                    {{ item.stateName }}
                  </span>
                </td>
                <td>{{ item.actionerNotes || '-' }}</td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="6" class="text-center">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { KTModal } from '@/metronic/core'
import { formatDateYearFirst } from '@/composables/date-format'
import type { ParamsSubmissionTypes } from '@/stores/views/invoice/types/submission'

const props = defineProps<{
  type?: 'po' | 'nonpo'
}>()

const emits = defineEmits(['loadDetail', 'setClearId'])

const invoiceApi = useInvoiceSubmissionStore()

const columns = ref<string[]>([
  'No.',
  'Department',
  'Actioner Name',
  'Verification Date',
  'Status',
  'Description',
])

const invoiceDetail = computed((): ParamsSubmissionTypes | undefined => {
  return props.type === 'po' ? invoiceApi.detailPo : invoiceApi.detailNonPo
})

const badgeColor = (status: number) => {
  const list = {
    0: 'bg-gray-50 text-gray-600',
    1: 'bg-blue-50 text-blue-600',
    2: 'bg-purple-50 text-purple-600',
    3: 'bg-emerald-50 text-emerald-600',
    4: 'bg-emerald-100 text-emerald-700',
    5: 'bg-red-50 text-red-600',
    6: 'bg-gray-100 text-gray-600',
    7: 'bg-slate-50 text-slate-600',
    8: 'bg-yellow-50 text-yellow-700',
    9: 'bg-cyan-50 text-cyan-600',
    10: 'bg-emerald-500 text-white',
  } as { [key: number]: string }
  return list[status]
}

onMounted(() => {
  const idModal = document.querySelector('#detail_verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)

  modal.on('show', () => {
    emits('loadDetail')
  })

  modal.on('hide', () => {
    emits('setClearId')
  })
})
</script>

<style lang="scss" scoped>
@use '../invoice/styles/invoice-detail-verification.scss';
</style>
