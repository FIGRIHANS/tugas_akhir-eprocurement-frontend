<template>
    <div>
        <Breadcrumb title="Cas Advance" :routes="routes" />
        <hr class="-mx-[24px] mb-[24px]" />

        <div class="border border-gray-200 rounded-xl p-[24px]">
            <div class="flex justify-between align-items-center gap-[8px]">
                <h1>Cas Advance</h1>
                <div class="flex align-items-center gap-3">
                    <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />
                    <FilterList :data="filterForm" @setData="setDataFilter" ref="filterChild" />
                    <!-- <button class="btn btn-primary ml-auto" @click="goAdd()">
                        <i class="ki-duotone ki-plus-circle"></i>
                        Add Invoice
                    </button> -->

                </div>
            </div>
            <div class="flex overflow-x-auto gap-3 mb-5 items-center" v-if="filteredPayload.length > 0">
                <div class="font-medium text-lg text-gray-800">Filter</div>
                <div v-for="items in filteredPayload" :key="items.key">
                    <div class="btn btn-light btn-sm" v-if="items.value !== ''">
                        <span class="text-gray-500"> {{ items.key }} </span>
                        <span class="font-semibold">
                            <p v-if="items.key === 'Status'">
                                {{
                                    StatusInvoice.find((item) => item.value.toString() === items.value.toString())
                                        ?.label
                                }}
                            </p>
                            <p v-else-if="items.key === 'Company Code'">
                                {{
                                    companyCodeList.find((item) => item.code.toString() === filterForm.companyCode)
                                        ?.name
                                }}
                            </p>
                            <p v-else-if="items.key === 'Invoice Type'">
                                {{
                                    invoicePoTypeList.find((item) => item.code.toString() === filterForm.invoiceType)
                                        ?.name
                                }}
                            </p>
                            <p v-else>{{ filterForm.date }}</p>
                        </span>
                        <i class="ki-filled ki-cross" @click="deleteFilter(items.key)"></i>
                    </div>
                </div>
                <UiButton variant="light" size="sm" class="btn-clear" @click="resetFilter()">
                    {{ $t('vendor.masterFilters.reset') }}
                </UiButton>
            </div>
            <div class="overflow-x-auto list__table mt-[24px]">
                <table class="table align-middle text-gray-700 font-medium text-sm">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in columns" :key="index"
                                class="!border-b-blue-500 !bg-blue-100 !text-blue-500 whitespace-nowrap" :class="{
                                    'list__long ': index !== 0,
                                    'cursor-pointer': item,
                                    '!text-blue-700': item === sortColumnName && sortBy !== '',
                                }" @click="sortColumn(item)">
                                {{ item }}
                                <i v-if="item" class="ki-filled ki-arrow-up-down"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="poList?.length === 0">
                            <td colspan="10" class="text-center">No data found.</td>
                        </tr>
                        <tr v-for="(row, index) in list" :key="index">
                            <td class="whitespace-nowrap">
                                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click"
                                    data-dropdown-placement="bottom-end">
                                    <UiButton class="dropdown-toggle" variant="light" :outline="false" :icon="true"
                                        size="sm">
                                        <i class="ki-filled ki-dots-vertical"></i>
                                    </UiButton>
                                    <div class="dropdown-content w-auto p-4 space-y-2">
                                        <div class="flex flex-col space-y-2">
                                            <UiButton variant="light" class="border-none" :outline="true" size="md"
                                                :disabled="row.status === 'Not Realized'" @click="goViewCasDetail(row)">
                                                <UiIcon name="eye" class="mr-2" />
                                                Detail CAS
                                            </UiButton>
                                            <UiButton variant="light" class="border-none" :outline="true" size="md"
                                                @click="openWorkflowModal(row)">
                                                <UiIcon name="data" class="mr-2" />
                                                Workflow
                                            </UiButton>
                                            <UiButton v-if="row.status === 'Not Realized'" variant="light"
                                                class="border-none " :outline="true" size="md"
                                                @click="goAddCasRealization(row)">
                                                <UiIcon name="plus" class="mr-2" />
                                                Add CAS Realization
                                            </UiButton>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="whitespace-nowrap">{{ row.casNo }}</td>
                            <td class="whitespace-nowrap">
                                <span class="badge" :class="statusBadgeClass(row.status)">
                                    {{ row.status }}
                                </span>
                            </td>
                            <td class="whitespace-nowrap">{{ row.vendorName }}</td>
                            <td class="whitespace-nowrap">{{ row.companyCode }}</td>
                            <td class="whitespace-nowrap">{{ useFormatIdr(row.totalGrossAmount) }}</td>
                            <td class="whitespace-nowrap">{{ useFormatIdr(row.totalNetAmount) }}</td>
                            <td class="whitespace-nowrap">{{ row.paymentDateCas }}</td>
                            <td class="whitespace-nowrap">{{ row.casRealizationNo || '-' }}</td>
                            <td class="whitespace-nowrap">{{ row.realizationDate || '-' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex items-center justify-between mt-[24px]">
                <p class="m-0 text-sm">
                    Tampilkan
                    {{ pageSize * currentPage > poList.length ? poList.length : pageSize * currentPage }} data
                    dari total data {{ poList.length }}
                </p>
                <LPagination :totalItems="poList.length" :pageSize="pageSize" :currentPage="currentPage"
                    @pageChange="setPage" />
            </div>
            <DetailVerificationModal type="po" @loadDetail="loadData" @setClearId="viewDetailId = ''" />
        </div>
    </div>
    <div class="modal" data-modal="true" id="cas_workflow_modal">
        <div class="modal-content max-w-[900px] modal-center-y">
            <div class="modal-header">
                <h3 class="modal-title text-lg font-semibold text-gray-700">
                    Cas Advance - Verification Detail
                </h3>
                <button class="btn btn-xs btn-icon btn-light btn-clear" data-modal-dismiss="true">
                    <i class="ki-duotone ki-cross"></i>
                </button>
            </div>
            <div class="modal-body p-[0px] pb-[16px]">
                <div class="border border-gray-200 text-center text-lg font-semibold text-gray-700">
                    No Invoice : {{ selectedCasNo || '-' }}
                </div>
                <table class="table align-middle text-gray-700 font-medium text-sm">
                    <thead>
                        <tr>
                            <td v-for="(item, index) in workflowColumns" :key="index" class="detail-approval__column">
                                {{ item }}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in workflowRows" :key="index" class="text-sm font-normal">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.department }}</td>
                            <td>{{ item.actionerName }}</td>
                            <td>{{ item.verificationDate }}</td>
                            <td>
                                <span class="badge" :class="workflowStatusClass(item.status)">
                                    {{ item.status }}
                                </span>
                            </td>
                            <td>{{ item.description }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { filterListTypes } from '../invoice/types/invoiceList'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr } from '@/composables/currency'
import { cloneDeep } from 'lodash'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRouter } from 'vue-router'
import { KTModal } from '@/metronic/core'

const invoiceMasterApi = useInvoiceMasterDataStore()

const router = useRouter()

const FilterList = defineAsyncComponent(() => import('./casFilter.vue'))
const DetailVerificationModal = defineAsyncComponent(
    () => import('./casDetailVerificationModal.vue'),
)

const routes = ref<routeTypes[]>([
    {
        name: 'Cas Advance',
        to: '/cash-advance',
    },
])

const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const invoicePoTypeList = computed(() => invoiceMasterApi.invoicePoType)

const invoiceApi = useInvoiceSubmissionStore()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
type CasAdvanceRow = {
    casNo: string
    status: string
    vendorName: string
    companyCode: string
    totalGrossAmount: number
    totalNetAmount: number
    paymentDateCas: string
    casRealizationNo?: string
    realizationDate?: string
}

const allRows = ref<CasAdvanceRow[]>([])
const list = ref<CasAdvanceRow[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const filteredPayload = ref([])
const filterChild = ref(null)
const viewDetailId = ref('')
const selectedCasNo = ref('')
const workflowColumns = ref<string[]>([
    'No.',
    'Department',
    'Actioner Name',
    'Verification Date',
    'Status',
    'Description',
])
const workflowRows = ref([
    {
        department: 'Finance AP Officer',
        actionerName: 'Christian Danny Wiguna',
        verificationDate: '2026/02/03',
        status: 'Verified',
        description: '-',
    },
    {
        department: 'Accounting & Tax',
        actionerName: 'Mochamad Zakaria',
        verificationDate: '2026/02/03',
        status: 'Verified',
        description: '-',
    },
    {
        department: 'Finance AP Supervisor',
        actionerName: 'Ilyus Al Faqih',
        verificationDate: '2026/02/03',
        status: 'Approved',
        description: '-',
    },
])

const loadData = async () => {
    try {
        await invoiceApi.getPoDetail(viewDetailId.value)
    } catch (error) {
        console.error('Error loading PO detail:', error)
    }
}

const StatusInvoice = ref([
    { value: 'Not Realized', label: 'Not Realized' },
    { value: 'Realized', label: 'Realized' },
    { value: 'In Process Realization', label: 'In Process Realization' },
])

const filterForm = reactive<filterListTypes>({
    status: '',
    date: '',
    companyCode: '',
    invoiceType: '',
})

const columns = ref<string[]>([
    'Action',
    'CAS No.',
    'Status',
    'Vendor Name',
    'Company Code',
    'Total Gross Amount',
    'Total Nett Amount',
    'Payment Date CAS',
    'CAS Realization No.',
    'Realization Date',
])

const poList = computed(() => allRows.value)


const statusBadgeClass = (status: string) => {
    if (status === 'Realized') return 'badge-success'
    if (status === 'In Process Realization') return 'badge-warning'
    return 'badge-secondary'
}

const workflowStatusClass = (status: string) => {
    if (status === 'Approved') return 'badge-success'
    if (status === 'Verified') return 'badge-success'
    return 'badge-secondary'
}

// const randomStatus = () => {
//   const pool = [true, false]
//   return pool[Math.floor(Math.random() * pool.length)]
// }

const setList = (listData: CasAdvanceRow[]) => {
    const result: CasAdvanceRow[] = []
    for (const [index, item] of listData.entries()) {
        const start = currentPage.value * pageSize.value - pageSize.value
        const end = currentPage.value * pageSize.value - 1
        if (index >= start && index <= end) {
            result.push(item)
        }
    }
    list.value = result
}

const setPage = (value: number) => {
    currentPage.value = value
    sortColumn(null)
}

const callList = () => {
    const demoData: CasAdvanceRow[] = [
        {
            casNo: 'MF00CA2026000006',
            status: 'Not Realized',
            vendorName: 'PT GOLDEN RAMA EXPRESS',
            companyCode: 'MF00',
            totalGrossAmount: 2000000,
            totalNetAmount: 2000000,
            paymentDateCas: '2026/02/01',
            casRealizationNo: '',
            realizationDate: '-',
        },
        {
            casNo: 'MF00CA2026000005',
            status: 'Realized',
            vendorName: 'PT GOLDEN RAMA EXPRESS',
            companyCode: 'MF00',
            totalGrossAmount: 2000000,
            totalNetAmount: 2000000,
            paymentDateCas: '2026/02/01',
            casRealizationNo: 'MF00LB2026000001',
            realizationDate: '2026/02/06',
        },
        {
            casNo: 'MF00CA2026000004',
            status: 'In Process Realization',
            vendorName: 'PT GOLDEN RAMA EXPRESS',
            companyCode: 'MF00',
            totalGrossAmount: 2000000,
            totalNetAmount: 2000000,
            paymentDateCas: '2026/02/01',
            casRealizationNo: '',
            realizationDate: '-',
        },
    ]
    let result = demoData

    const q = search.value.trim().toLowerCase()
    if (q) {
        result = result.filter((row) =>
            row.casNo.toLowerCase().includes(q) ||
            row.vendorName.toLowerCase().includes(q) ||
            row.companyCode.toLowerCase().includes(q) ||
            row.status.toLowerCase().includes(q),
        )
    }

    if (filterForm.status) {
        result = result.filter((row) => row.status === filterForm.status)
    }
    if (filterForm.companyCode) {
        result = result.filter((row) => row.companyCode === filterForm.companyCode)
    }
    if (filterForm.date) {
        result = result.filter((row) => row.paymentDateCas === filterForm.date)
    }

    allRows.value = result
    setList(result)
}

const setDataFilter = (data: filterListTypes) => {
    const filteredData: { key: string; value: string | number }[] = []

    if (data.status !== '') {
        filteredData.push({
            key: 'Status',
            value: data.status,
        })
    }

    if (data.date !== '') {
        filteredData.push({
            key: 'Date',
            value: data.date,
        })
    }

    if (data.companyCode && data.companyCode.trim() !== '') {
        filteredData.push({
            key: 'Company Code',
            value: data.companyCode,
        })
    }

    filteredPayload.value = filteredData
    filterForm.status = data.status
    filterForm.date = data.date
    filterForm.companyCode = data.companyCode
    callList()
}

const goSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        callList()
    }
}

const goAddCasRealization = (row: CasAdvanceRow) => {
    router.push({
        name: 'invoiceAdd',
        query: {
            type: 'cas',
            casNo: row.casNo,
            totalGrossAmount: row.totalGrossAmount,
            totalNetAmount: row.totalNetAmount,
            from: 'cas',
        },
    })
}

const goViewCasDetail = (row: CasAdvanceRow) => {
    if (row.status === 'Not Realized') return
    router.push({
        name: 'invoiceAdd',
        query: {
            type: 'non-po-view',
            casType: 'cas',
            casNo: row.casNo,
            from: 'cas',
        },
    })
}

const openWorkflowModal = (row: CasAdvanceRow) => {
    selectedCasNo.value = row.casNo
    const idModal = document.querySelector('#cas_workflow_modal')
    if (!idModal) return
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
}

const sortColumn = (columnName: string | null) => {
    const list = {
        'CAS No.': 'casNo',
        Status: 'status',
        'Vendor Name': 'vendorName',
        'Company Code': 'companyCode',
        'Total Gross Amount': 'totalGrossAmount',
        'Total Nett Amount': 'totalNetAmount',
        'Payment Date CAS': 'paymentDateCas',
        'CAS Realization No.': 'casRealizationNo',
        'Realization Date': 'realizationDate',
    } as { [key: string]: string }

    const roleSort = ['asc', 'desc', '']

    const listData = cloneDeep(poList.value)
    let result: CasAdvanceRow[] = []

    if (columnName) {
        if (sortColumnName.value !== columnName) sortBy.value = ''
        sortColumnName.value = columnName

        const indexSort = roleSort.findIndex((item) => item === sortBy.value)
        if (indexSort === -1) return setList(poList.value)
        sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

        if (!sortBy.value) return setList(poList.value)
    }

    const name = columnName || sortColumnName.value

    if (name === 'Total Gross Amount' || name === 'Total Nett Amount') {
        result = listData.sort((a, b) => {
            if (sortBy.value === 'asc') {
                return a[list[name]] - b[list[name]]
            } else {
                return b[list[name]] - a[list[name]]
            }
        })
    } else if (name === 'Payment Date CAS' || name === 'Realization Date') {
        result = listData.sort((a, b) => {
            const convA = a[list[name]] ? new Date(a[list[name]]).getTime() : 0
            const convB = b[list[name]] ? new Date(b[list[name]]).getTime() : 0
            if (sortBy.value === 'asc') {
                return convA - convB
            } else {
                return convB - convA
            }
        })
    } else {
        result = listData.sort((a, b) => {
            const convA = a[list[name]] ? a[list[name]] : ''
            const convB = b[list[name]] ? b[list[name]] : ''
            if (sortBy.value === 'asc') {
                return convA.localeCompare(convB)
            } else {
                return convB.localeCompare(convA)
            }
        })
    }

    return setList(result)
}

const deleteFilter = (key: string) => {
    const deletedData = filteredPayload.value.filter((item) => item.key !== key)
    filteredPayload.value = deletedData

    if (key === 'Status') {
        filterChild.value.resetStatus()
    } else if (key === 'Date') {
        filterChild.value.resetDate()
    } else if (key === 'Company Code') {
        filterChild.value.resetCompanyCode()
    } else {
        filterChild.value.resetInvoiceType()
    }
    filterChild.value.goFilter()
    callList()
}

const resetFilter = () => {
    filterForm.status = null
    filterChild.value.resetFilter()
    filteredPayload.value = []
    filterChild.value.goFilter()

    callList()
}

onMounted(() => {
    callList()
})
</script>

<style lang="scss" scoped>
@use '../invoice/styles/invoice-list.scss';

// Custom width for Submitted Document No column in Cas Advance
:deep(.list__table) {

    th:nth-child(2),
    td:nth-child(2) {
        min-width: 250px;
        white-space: nowrap;
    }
}
</style>
