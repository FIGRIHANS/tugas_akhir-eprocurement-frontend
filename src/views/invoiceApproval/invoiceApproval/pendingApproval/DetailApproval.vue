<template>
  <div class="modal" data-modal="true" id="detail_approval_modal">
    <div class="modal-content max-w-[821px] modal-center-y">
      <div class="modal-header">
        <h3 class="modal-title text-lg font-semibold text-gray-700">Detail Approval Invoice</h3>
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
            <tr v-for="(item, index) in list" :key="index" class="text-sm font-normal">
              <td>{{ item.approverName }}</td>
              <td>{{ item.job }}</td>
              <td>{{ item.approvalDate }}</td>
              <td>
                <span class="badge badge-outline" :class="badgeColor(item.status)">
                  {{ badgeTitle(item.status) }}
                </span>
              </td>
              <td class="text-right">{{ item.description || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { listItemTypes } from '../../types/detailApproval'

const columns = ref<string[]>([
  'Nama Approver',
  'Jabatan',
  'Tanggal Approval',
  'Status',
  'Keterangan'
])

const list = ref<listItemTypes[]>([
  {
    approverName: 'Susanti',
    job: 'Finance',
    approvalDate: '3 Maret 2021 17:30:26',
    status: 1,
    description: ''
  },
  {
    approverName: 'Susanti',
    job: 'Finance',
    approvalDate: '3 Maret 2021 17:30:26',
    status: 2,
    description: 'tidak sesuai'
  },
  {
    approverName: 'Susanti',
    job: 'Finance',
    approvalDate: '3 Maret 2021 17:30:26',
    status: 3,
    description: ''
  }
])

const badgeColor = (status: number) => {
  const list = {
    1: 'badge-success',
    2: 'badge-danger',
    3: 'badge-info'
  } as { [key: number]: string }
  return list[status]
}

const badgeTitle = (status: number) => {
  const list = {
    1: 'Approved',
    2: 'Rejected',
    3: 'Pending Approval'
  } as { [key: number]: string }
  return list[status]
}
</script>

<style lang="scss" scoped>
@use '../../styles/detail-approval.scss';
</style>
