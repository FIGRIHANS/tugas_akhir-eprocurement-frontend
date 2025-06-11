<template>
  <div class="modal" data-modal="true" id="detail_verification_modal">
    <div class="modal-content max-w-[821px] modal-center-y">
      <div class="modal-header">
        <h3 class="modal-title text-lg font-semibold text-gray-700">Verification Detail Invoice</h3>
        <button class="btn btn-xs btn-icon btn-light btn-clear" data-modal-dismiss="true">
          <i class="ki-duotone ki-cross"></i>
        </button>
      </div>
      <div class="modal-body p-[0px] pb-[16px]">
        <div class="border border-gray-200 text-center text-lg font-semibold text-gray-700">
          No Invoice : INV0000123
        </div>
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <td v-for="(item, index) in columns" :key="index" class="detail-approval__column">{{ item }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list?.workflow" :key="index" class="text-sm font-normal">
              <td>{{ index + 1 }}</td>
              <td>{{ item.profileName }}</td>
              <td>{{ item.actionerDate ? moment(item.actionerDate).format('DD MMMM YYYY HH:mm:ss') : '-' }}</td>
              <td>
                <span class="badge badge-outline" :class="badgeColor(item.stateCode)">
                  {{ badgeTitle(item.stateCode) }}
                </span>
              </td>
              <td class="text-right">{{ item.actionerNotes || '-' }}</td>
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
import moment from 'moment'

const emits = defineEmits(['loadDetail', 'setClearId'])

const invoiceApi = useInvoiceSubmissionStore()

const columns = ref<string[]>([
  'No.',
  'Department',
  'Verification Date',
  'Status',
  'Description'
])

const list = computed(() => invoiceApi.detailPo)

const badgeColor = (status: number) => {
  const list = {
    4: 'badge-success',
    5: 'badge-danger',
    1: 'badge-info'
  } as { [key: number]: string }
  return list[status]
}

const badgeTitle = (status: number) => {
  const list = {
    4: 'Approved',
    5: 'Rejected',
    1: 'Pending Approval'
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
@use '../styles/detail-verification.scss';
</style>
