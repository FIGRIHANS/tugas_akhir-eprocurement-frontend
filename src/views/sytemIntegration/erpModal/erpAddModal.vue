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

                <div class=" space-y-4">

                    <!-- CUSTOMER -->
                    <div class="accordion-item">
                        <button class="accordion-header" @click="toggle('customer')">
                            <span>Customer</span>
                            <i class="ki-filled ki-down" :class="{ 'rotate-180': open.customer }"></i>
                        </button>

                        <div v-show="open.customer" class="accordion-body">
                            <div class="grid grid-cols-2 gap-4">
                                <UiInput v-model="definition.customer.firstName" label="First Name" />
                                <UiInput v-model="definition.customer.lastName" label="Last Name" />
                            </div>
                        </div>
                    </div>

                    <!-- ORDER -->
                    <div class="accordion-item">
                        <button class="accordion-header" @click="toggle('order')">
                            <span>Order</span>
                            <i class="ki-filled ki-down" :class="{ 'rotate-180': open.order }"></i>
                        </button>

                        <div v-show="open.order" class="accordion-body">
                            <div class="grid grid-cols-3 gap-4">
                                <UiInput v-model="definition.order.itemNo" label="Item No" />
                                <UiInput v-model="definition.order.price" label="Price" type="number" />
                                <UiInput v-model="definition.order.noOfItems" label="No Of Items" type="number" />
                            </div>
                        </div>
                    </div>

                    <!-- BILLING ADDRESS -->
                    <div class="accordion-item">
                        <button class="accordion-header" @click="toggle('billing')">
                            <span>Billing Address</span>
                            <i class="ki-filled ki-down" :class="{ 'rotate-180': open.billing }"></i>
                        </button>

                        <div v-show="open.billing" class="accordion-body">
                            <div class="grid grid-cols-2 gap-4">
                                <UiInput v-model="definition.billing.street" label="Street" />
                                <UiInput v-model="definition.billing.city" label="City" />
                                <UiInput v-model="definition.billing.state" label="State" />
                                <UiInput v-model="definition.billing.zip" label="Zip Code" />
                                <UiInput v-model="definition.billing.country" label="Country" />
                            </div>
                        </div>
                    </div>

                    <!-- DELIVERY ADDRESS -->
                    <div class="accordion-item">
                        <button class="accordion-header" @click="toggle('delivery')">
                            <span>Delivery Address</span>
                            <i class="ki-filled ki-down" :class="{ 'rotate-180': open.delivery }"></i>
                        </button>

                        <div v-show="open.delivery" class="accordion-body">
                            <div class="grid grid-cols-2 gap-4">
                                <UiInput v-model="definition.delivery.street" label="Street" />
                                <UiInput v-model="definition.delivery.city" label="City" />
                                <UiInput v-model="definition.delivery.state" label="State" />
                                <UiInput v-model="definition.delivery.zip" label="Zip Code" />
                                <UiInput v-model="definition.delivery.country" label="Country" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Footer -->
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

const setTab = (tab: 'header' | 'definition') => {
    invoiceTypeTab.value = tab
}

const open = ref({
    customer: true,
    order: false,
    billing: false,
    delivery: false,
})

const toggle = (key: keyof typeof open.value) => {
    open.value[key] = !open.value[key]
}

const definition = ref({
    customer: {
        firstName: '',
        lastName: '',
    },
    order: {
        itemNo: '',
        price: '',
        noOfItems: '',
    },
    billing: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    },
    delivery: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
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