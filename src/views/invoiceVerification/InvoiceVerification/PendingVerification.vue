<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch v-model="search" placeholder="Cari Invoice" class="w-[250px]" @keypress="goSearch" />
      <FilterList :data="filterForm" @setData="setDataFilter" />
    </div>
    <div class="mt-[24px]">
      <div class="pending__table overflow-x-auto">
        <table class="table align-middle text-gray-700 rounded-xl font-medium text-sm">
          <thead>
            <tr>
              <th v-for="(item, index) in columns" class="pending__column" :key="index">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(parent, index) in list" :key="index">
              <tr>
                <td class="flex justify-between items-center gap-[24px]">
                  <button class="btn btn-outline btn-primary btn-icon w-[32px] h-[32px]"
                    @click="openDetailInvoice(parent.invoiceUId)">
                    <i class="ki-filled ki-eye !text-lg"></i>
                  </button>
                  <button class="btn btn-outline btn-primary btn-icon w-[32px] h-[32px]"
                    @click="openDetailVerification(parent.invoiceUId)">
                    <i class="ki-duotone ki-data !text-lg"></i>
                  </button>
                  <button class="btn btn-icon btn-outline btn-primary w-[21px] h-[21px]"
                    @click="parent.isOpenChild = !parent.isOpenChild">
                    <i v-if="!parent.isOpenChild" class="ki-filled ki-right !text-[9px]"></i>
                    <i v-else class="ki-filled ki-down !text-[9px]"></i>
                  </button>
                </td>
                <td>{{ parent.invoiceNo || '-' }}</td>
                <td>
                  <span class="badge badge-outline" :class="colorBadge(parent.statusCode)">
                    {{ parent.statusName }}
                  </span>
                </td>
                <td>{{ parent.invoiceTypeName || '-' }}</td>
                <td>{{ parent.companyCode || '-' }}</td>
                <td>{{ useFormatIdr(parent.whtBaseAmount) || '-' }}</td>
                <td>{{ useFormatIdr(parent.vatAmount) || '-' }}</td>
                <td>{{ useFormatIdr(parent.whtAmount) || '-' }}</td>
                <td>{{ useFormatIdr(parent.totalNetAmount) || '-' }}</td>
                <td>{{ parent.taxNo || '-' }}</td>
                <td>{{ parent.documentNo || '-' }}</td>
                <td>
                  {{
                    parent.estimatedPaymentDate
                      ? moment(parent.estimatedPaymentDate).format('YYYY/MM/DD')
                      : '-'
                  }}
                </td>
                <td>
                  {{
                    parent.invoiceDate
                      ? moment(parent.invoiceDate).format('YYYY/MM/DD HH:mm:ss')
                      : '-'
                  }}
                </td>
                <td>{{ parent.notes || '-' }}</td>
              </tr>
              <tr v-show="parent.isOpenChild">
                <td></td>
                <td colspan="5" class="!pt-[0px]">
                  <table class="table table-bordered table-sm mb-0">
                    <thead>
                      <tr class="border-b">
                        <th v-for="(item, index) in columnsChild" :key="index">
                          {{ item }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(sub, index) in parent.pOs" :key="index">
                        <tr>
                          <td>{{ sub.poNo || '-' }}</td>
                          <td>{{ sub.grDocumentNo || '-' }}</td>
                          <td>{{ sub.itemText || '-' }}</td>
                          <td>{{ useFormatIdr(sub.itemAmount) || '-' }}</td>
                          <td>{{ sub.quantity || '-' }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="flex items-center gap-[16px] mt-[24px]">
        <div class="flex items-center">
          <div class="bg-primary rounded-md p-[7px] w-[40px] h-[40px] flex items-center justify-center">
            <i class="ki-filled ki-eye text-white text-[24px]"></i>
          </div>
          <p class="ml-[8px]">: View Detail invoice</p>
        </div>
        <div class="flex items-center">
          <div
            class="bg-primary-light border border-primary-clarity rounded-md p-[7px] w-[40px] h-[40px] flex items-center justify-center">
            <i class="ki-duotone ki-data text-primary text-[24px]"></i>
          </div>
          <p class="ml-[8px]">: Verification Detail Invoice</p>
        </div>
      </div>
      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0 text-sm">
          Tampilkan
          {{
            pageSize * currentPage > verifList.length ? verifList.length : pageSize * currentPage
          }}
          data dari total data {{ verifList.length }}
        </p>
        <LPagination :totalItems="verifList.length" :pageSize="pageSize" :currentPage="currentPage"
          @pageChange="setPage" />
      </div>
    </div>
    <DetailVerificationModal @loadDetail="loadData" @setClearId="viewDetailId = ''" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import type { filterListTypes } from '../types/pendingVerification'
import type { ListPoTypes } from '@/stores/views/invoice/types/verification'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { KTModal } from '@/metronic/core'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useFormatIdr } from '@/composables/currency'
import moment from 'moment'

const DetailVerificationModal = defineAsyncComponent(() => import('./DetailVerificationModal.vue'))
const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))

const invoiceApi = useInvoiceSubmissionStore()
const verificationApi = useInvoiceVerificationStore()
const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<ListPoTypes[]>([])
const viewDetailId = ref<string>('')

const filterForm = reactive<filterListTypes>({
  status: 1,
  date: '',
  companyCode: '',
  invoiceType: '',
})

const columns = ref<string[]>([
  '',
  'Submitted Document No',
  'Status',
  'Invoice Type',
  'Company Code',
  'Base Amount',
  'VAT Ammount',
  'WHT Amount',
  'Total Net Amount',
  'No Tax Invoice',
  'Invoice Vendor No.',
  'Estimated Payment Date',
  'Invoice Submission Date',
  'Description',
])

const columnsChild = ref(['No PO', 'No GR', 'Item Description', 'Item Amount', 'Quantity'])

const verifList = computed(() => verificationApi.listPo)

const colorBadge = (statusCode: number) => {
  const list = {
    1: 'badge-info',
    5: 'badge-danger',
    3: 'badge-success',
  } as { [key: number]: string }
  return list[statusCode]
}

const setPage = (value: number) => {
  currentPage.value = value
  setList()
}

const openDetailInvoice = (invoiceId: string) => {
  router.push({
    name: 'invoiceDetail',
    query: {
      id: invoiceId,
      type: '1',
    },
  })
}

const openDetailVerification = (invoiceId: string) => {
  viewDetailId.value = invoiceId
  const idModal = document.querySelector('#detail_verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    callList()
  }
}

const setList = () => {
  const result: ListPoTypes[] = []
  for (const [index, item] of verifList.value.entries()) {
    const start = currentPage.value * pageSize.value - pageSize.value
    const end = currentPage.value * pageSize.value - 1
    if (index >= start && index <= end) {
      result.push(item)
    }
  }
  list.value = result
}

const callList = () => {
  list.value = []
  verificationApi
    .getListPo({
      statusCode: filterForm.status || 1,
      companyCode: filterForm.companyCode,
      invoiceTypeCode: Number(filterForm.invoiceType),
      invoiceDate: filterForm.date,
      searchText: search.value,
    })
    .finally(() => {
      setList()
    })
}

const setDataFilter = (data: filterListTypes) => {
  filterForm.status = data.status
  filterForm.date = data.date
  filterForm.companyCode = data.companyCode
  filterForm.invoiceType = data.invoiceType
  callList()
}

const loadData = () => {
  invoiceApi.getPoDetail(viewDetailId.value)
}

onMounted(() => {
  callList()
})
</script>

<style lang="scss" scoped>
@use '../styles/pending-verification.scss';
</style>
