<template>
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-xl w-full max-w-4xl shadow-lg">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b">
                <h3 class="text-lg font-semibold text-gray-800">
                    Add Integration
                </h3>
                <button @click="close">
                    <i class="ki-filled ki-cross text-xl"></i>
                </button>
            </div>
            <div class="rounded-lg  p-[4px] flex items-center gap-[4px] mx-5 mt-3">
                <button class="btn btn-primary" :class="{
                    'btn-clear info__header': invoiceTypeTab !== 'header',
                }" @click="setTab('header')">
                    Header
                </button>
                <button class="btn btn-primary" :class="{
                    'btn-clear info__header': invoiceTypeTab !== 'definition',
                }" @click="setTab('definition')">
                    Definition
                </button>
            </div>

            <!-- Body -->
            <div class="p-6" v-if="invoiceTypeTab === 'header'">
                <div class="grid grid-cols-2 gap-6">
                    <!-- LEFT -->
                    <div class="space-y-4">
                        <UiInput v-model="form.code" label="Code" placeholder="IV01" />

                        <UiSelect v-model="form.client" label="Client" :options="clientOptions"
                            placeholder="Select Client" />

                        <UiInput v-model="form.processIntegration" label="Process Integration" />

                        <UiSelect v-model="form.services" label="Services" :options="serviceOptions" />

                        <UiSelect v-model="form.type" label="Type" :options="typeOptions" />

                        <UiInput v-model="form.source" label="Source" />
                        <UiInput v-model="form.destination" label="Destination" />
                    </div>

                    <!-- RIGHT -->
                    <div class="space-y-4">
                        <UiInput v-model="form.transactionCode" label="Transaction Code" />

                        <UiSelect v-model="form.connection" label="Connection" :options="connectionOptions" />

                        <UiInput v-model="form.technicalObject" label="Technical Object" />

                        <UiSelect v-model="form.fieldMapping" label="Field Mapping" :options="statusOptions" />

                        <UiSelect v-model="form.integrationStatus" label="Integration Status"
                            :options="statusOptions" />

                        <UiSelect v-model="form.connectionTest" label="Connection Test"
                            :options="connectionTestOptions" />
                    </div>
                </div>
            </div>

            <div class="p-6" v-if="invoiceTypeTab === 'definition'">
                <div class="pb-5">
                    <h3 class="card-title">Integration Mapping Form</h3>
                </div>

                <div class="space-y-4">

                    <!-- ========================= -->
                    <!--        IS_HEADER         -->
                    <!-- ========================= -->
                    <div class="accordion-item border rounded-lg">
                        <button class="accordion-header" @click="toggle('isHeader')">
                            <span class="font-semibold">IS_HEADER (1 to 1)</span>
                            <i class="ki-filled ki-down" :class="{ 'rotate-180': open.isHeader }"></i>
                        </button>

                        <div v-show="open.isHeader" class="accordion-body p-4 space-y-5">

                            <!-- ROW: Invoice Date -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Invoice Date</div>
                                <UiInput class="col-span-3" label="Invoice Data"
                                    v-model="definition.header.invoiceDate" />
                                <UiInput class="col-span-3" label="EVOQ" value="InvoiceDate" disabled />
                                <UiInput class="col-span-2" label="SAP Field" value="DOC_DATE" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                            <!-- ROW: Posting Date -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Posting Date</div>
                                <UiInput class="col-span-3" v-model="definition.header.postingDate"
                                    label="Invoice Data" />
                                <UiInput class="col-span-3" value="PostingDate" label="EVOQ" disabled />
                                <UiInput class="col-span-2" value="PSTNG_DATE" label="SAP Field" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                            <!-- ROW: Company Code -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Company Code</div>
                                <UiInput class="col-span-3" label="Invoice Data"
                                    v-model="definition.header.companyCode" />
                                <UiInput class="col-span-3" label="EVOQ" value="CompanyCode" disabled />
                                <UiInput class="col-span-2" label="SAP Field" value="COMP_CODE" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                            <!-- ROW: Vendor Master -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Vendor Master</div>
                                <UiInput class="col-span-3" v-model="definition.header.vendorMaster"
                                    label="Invoice Data" />
                                <UiInput class="col-span-3" value="VendorId" label="EVOQ" disabled />
                                <UiInput class="col-span-2" value="VENDOR_NO" label="SAP Field" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                            <!-- ROW: Subtotal -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Subtotal</div>
                                <UiInput class="col-span-3" v-model="definition.header.subtotal" label="Invoice Data" />
                                <UiInput class="col-span-3" value="TotalGrossAmount" label="EVOQ" disabled />
                                <UiInput class="col-span-2" value="GROSS_AMOUNT" label="SAP Field" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                            <!-- ROW: Currency -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Currency</div>
                                <UiInput class="col-span-3" v-model="definition.header.currency" label="Invoice Data" />
                                <UiInput class="col-span-3" value="CurrCode" label="EVOQ" disabled />
                                <UiInput class="col-span-2" value="CURRENCY" label="SAP Field" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                        </div>
                    </div>

                    <!-- ========================= -->
                    <!--        IT_ITEM           -->
                    <!-- ========================= -->
                    <div class="accordion-item border rounded-lg">
                        <button class="accordion-header" @click="toggle('itItem')">
                            <span class="font-semibold">IT_ITEM (1 to N)</span>
                            <i class="ki-filled ki-down" :class="{ 'rotate-180': open.itItem }"></i>
                        </button>

                        <div v-show="open.itItem" class="accordion-body p-4 space-y-5">

                            <!-- ROW: PO Number -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">PO Number</div>
                                <UiInput class="col-span-3" v-model="definition.item.poNumber" label="Invoice Data" />
                                <UiInput class="col-span-3" value="PONo" label="EVOQ" disabled />
                                <UiInput class="col-span-2" value="EBELN" label="SAP Field" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                            <!-- ROW: Quantity -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Quantity</div>
                                <UiInput class="col-span-3" v-model="definition.item.quantity" label="Invoice Data" />
                                <UiInput class="col-span-3" value="Quantity" label="EVOQ" disabled />
                                <UiInput class="col-span-2" value="MENGE" label="SAP Field" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                            <!-- ROW: Item Amount -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Item Amount</div>
                                <UiInput class="col-span-3" v-model="definition.item.amount" label="Invoice Data" />
                                <UiInput class="col-span-3" value="ItemAmount" label="EVOQ" disabled />
                                <UiInput class="col-span-2" value="WRBTR" label="SAP Field" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                            <!-- ROW: Unit -->
                            <div class="grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-3 font-semibold">Unit</div>
                                <UiInput class="col-span-3" v-model="definition.item.unit" label="Invoice Data" />
                                <UiInput class="col-span-3" value="Uom" label="EVOQ" disabled />
                                <UiInput class="col-span-2" value="PO_UNIT" label="SAP Field" disabled />
                                <span class="col-span-1 text-success font-semibold">Active</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <!-- FOOTER -->
            <div class="flex justify-end gap-3 px-6 py-4 border-t">
                <button class="btn btn-light" @click="close">Cancel</button>
                <button class="btn btn-primary" @click="submit">
                    Save Integration
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'

interface IntegrationItem {
    code: string
    client: string
    processIntegration: string
    services: string
    type: string
    source: string
    destination: string
    transactionCode: string
    connection: string
    technicalObject: string
    fieldMapping: string
    integrationStatus: string
    connectionTest: string
}

defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', value: IntegrationItem): void
}>()

const invoiceTypeTab = ref<'header' | 'definition'>('header')



const open = ref({
    isHeader: true,
    itItem: false,
})

const mappingStatusOptions = [
    { text: 'Active', value: 'Active' },
    { text: 'Inactive', value: 'Inactive' },
]

const definition = ref({
    header: {
        invoiceDate: '',
        postingDate: '',
        companyCode: '',
        vendorMaster: '',
        subtotal: '',
        currency: '',
        invoiceVendorNo: '',
        paymentTerm: '',
    },
    item: {
        poNumber: '',
        poItem: '',
        quantity: '',
        amount: '',
        unit: '',
        currency: '',
        grDocumentNo: '',
        grDocumentDate: '',
        grDocumentItem: '',
        taxCode: '',
    },
})

const form = ref<IntegrationItem>({
    code: '',
    client: '',
    processIntegration: '',
    services: '',
    type: '',
    source: '',
    destination: '',
    transactionCode: '',
    connection: 'RFC',
    technicalObject: '',
    fieldMapping: 'Active',
    integrationStatus: 'Active',
    connectionTest: 'Success',
})

const toggle = (key: keyof typeof open.value) => {
    open.value[key] = !open.value[key]
}

const setTab = (tab: 'header' | 'definition') => {
    invoiceTypeTab.value = tab
}

const close = () => {
    emit('update:modelValue', false)
}

const submit = () => {
    emit('submit', { ...form.value })
    reset()
    close()
}

const reset = () => {
    form.value = {
        code: '',
        client: '',
        processIntegration: '',
        services: '',
        type: '',
        source: '',
        destination: '',
        transactionCode: '',
        connection: 'RFC',
        technicalObject: '',
        fieldMapping: 'Active',
        integrationStatus: 'Active',
        connectionTest: 'Success',
    }
}

/* Options */
const clientOptions = [
    { text: 'PRD', value: 'PRD' },
    { text: 'DEV', value: 'DEV' },
    { text: 'QA', value: 'QA' },
]

const serviceOptions = [
    { text: 'Transaction', value: 'Transaction' },
    { text: 'Master Data', value: 'Master Data' },
]

const typeOptions = [
    { text: 'Outbound', value: 'Outbound' },
    { text: 'Inbound', value: 'Inbound' },
]

const connectionOptions = [
    { text: 'RFC', value: 'RFC' },
    { text: 'API', value: 'API' },
]

const statusOptions = [
    { text: 'Active', value: 'Active' },
    { text: 'Not Active', value: 'Not Active' },
]

const connectionTestOptions = [
    { text: 'Success', value: 'Success' },
    { text: 'Failed', value: 'Failed' },
]
</script>

<style scoped>
.accordion-item {
    @apply border border-gray-200 rounded-lg overflow-hidden;
}

.accordion-header {
    @apply w-full flex justify-between items-center px-5 py-4 bg-gray-50 font-semibold text-gray-700 hover:bg-gray-100 transition;
}

.accordion-body {
    @apply px-5 py-4 bg-white;
}
</style>