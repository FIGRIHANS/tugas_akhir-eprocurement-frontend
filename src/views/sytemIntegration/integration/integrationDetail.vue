<template>
    <div>
        <div class="min-h-screen bg-gray-100 flex flex-col" v-if="integrationDetail">
            <!-- PAGE HEADER -->
            <div class="bg-white border-b px-6 py-4">
                <h1 class="text-xl font-semibold text-gray-800">
                    Detail Integration
                </h1>
            </div>

            <!-- TAB -->
            <div class="bg-white px-6 pt-4">
                <div class="rounded-lg p-[4px] flex items-center gap-[4px]">
                    <button class="btn btn-primary" :class="{ 'btn-clear info__header': invoiceTypeTab !== 'header' }"
                        @click="invoiceTypeTab = 'header'">
                        Header
                    </button>

                    <button class="btn btn-primary"
                        :class="{ 'btn-clear info__header': invoiceTypeTab !== 'definition' }"
                        @click="invoiceTypeTab = 'definition'">
                        Definition
                    </button>
                </div>
            </div>

            <!-- CONTENT -->
            <div class="flex-1 overflow-y-auto p-6">

                <!-- ================= HEADER (dummy) ================= -->
                <div v-if="invoiceTypeTab === 'header'" class="bg-white rounded-xl shadow p-6">
                    <div class="grid grid-cols-2 gap-8">

                        <!-- LEFT -->
                        <div class="space-y-5">
                            <div>
                                <label class="form-label">Code</label>
                                <UiInput v-model="form.code" disabled />
                            </div>

                            <div>
                                <label class="form-label">Client</label>
                                <UiSelect v-model="form.client" :options="clientOptions" disabled />
                            </div>

                            <div>
                                <label class="form-label">Process Integration</label>
                                <UiInput v-model="form.processIntegration" disabled />
                            </div>

                            <div>
                                <label class="form-label">Services</label>
                                <UiSelect v-model="form.services" :options="serviceOptions" disabled />
                            </div>

                            <div>
                                <label class="form-label">Type</label>
                                <UiSelect v-model="form.type" :options="typeOptions" disabled />
                            </div>

                            <div>
                                <label class="form-label">Source</label>
                                <UiInput v-model="form.source" disabled />
                            </div>

                            <div>
                                <label class="form-label">Destination</label>
                                <UiInput v-model="form.destination" disabled />
                            </div>
                        </div>

                        <!-- RIGHT -->
                        <div class="space-y-5">
                            <div>
                                <label class="form-label">Transaction Code</label>
                                <UiInput v-model="form.transactionCode" disabled />
                            </div>

                            <div>
                                <label class="form-label">Connection</label>
                                <UiSelect v-model="form.connection" :options="connectionOptions" disabled />
                            </div>

                            <div>
                                <label class="form-label">Technical Object</label>
                                <UiInput v-model="form.technicalObject" disabled />
                            </div>

                            <div>
                                <label class="form-label">Field Mapping</label>
                                <UiSelect v-model="form.fieldMapping" :options="statusOptions" disabled />
                            </div>

                            <div>
                                <label class="form-label">Integration Status</label>
                                <UiSelect v-model="form.integrationStatus" :options="statusOptions" disabled />
                            </div>

                            <div>
                                <label class="form-label">Connection Test</label>
                                <UiSelect v-model="form.connectionTest" :options="connectionTestOptions" disabled />
                            </div>
                        </div>

                    </div>
                </div>


                <!-- ================= DEFINITION ================= -->
                <div v-if="invoiceTypeTab === 'definition'" class="bg-white rounded-xl shadow p-6 space-y-4">

                    <!-- ADD GROUP -->
                    <div class="flex justify-end">
                        <!-- <button class="btn btn-primary" @click="addGroup">
                            + Add Group
                        </button> -->
                    </div>

                    <!-- TABLE -->
                    <div class="overflow-x-auto border border-gray-300">
                        <table class="min-w-full border-collapse text-sm">
                            <thead class="bg-blue-200">
                                <tr>
                                    <th class="border px-3 py-2"></th>
                                    <th class="border px-3 py-2">Relation</th>
                                    <th class="border px-3 py-2">Invoice Data</th>
                                    <th class="border px-3 py-2">EVOQ</th>
                                    <th class="border px-3 py-2">SAP Field</th>
                                    <th class="border px-3 py-2">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                <!-- GROUP -->
                                <template v-for="group in mappingGroups" :key="group.id">
                                    <!-- GROUP HEADER -->
                                    <tr class="bg-gray-100 font-semibold cursor-pointer hover:bg-gray-200"
                                        @click="group.open = !group.open">
                                        <td class="border px-3 py-2">
                                            <div class="flex items-center gap-2">
                                                <span class="transition-transform" :class="{ 'rotate-90': group.open }">
                                                    ▶
                                                </span>

                                                <!-- GROUP NAME (editable) -->
                                                <input v-model="group.name"
                                                    class="bg-transparent border-b border-gray-400 focus:outline-none"
                                                    disabled />
                                            </div>
                                        </td>

                                        <!-- RELATION -->
                                        <td class="border px-3 py-2 text-center">
                                            <select v-model="group.relation" class="form-select" @click.stop disabled>
                                                <option value="1 to 1">1 to 1</option>
                                                <option value="1 to N">1 to N</option>
                                                <option value="N to 1">N to 1</option>
                                            </select>
                                        </td>

                                        <td colspan="3" class="border"></td>

                                        <!-- DELETE GROUP -->
                                        <td class="border px-3 py-2 text-center">
                                            <!-- <UiButton class="btn-icon btn-outline btn-sm btn-danger"
                                                @click.stop="removeGroup(group.id)">
                                                <i class="ki-filled ki-trash"></i>
                                            </UiButton> -->
                                        </td>
                                    </tr>

                                    <!-- ROWS -->
                                    <tr v-for="row in group.rows" :key="row.id" v-show="group.open">
                                        <td class="border"></td>
                                        <td class="border"></td>

                                        <td class="border px-3 py-2">
                                            <input v-model="row.label" class="form-input w-full" disabled />
                                        </td>

                                        <td class="border px-3 py-2">
                                            <input v-model="row.evoq" class="form-input w-full" disabled />
                                        </td>

                                        <td class="border px-3 py-2">
                                            <input v-model="row.sap" class="form-input w-full" disabled />
                                        </td>

                                        <td class="border px-3 py-2 flex items-center gap-2">
                                            <select v-model="row.status" class="form-select w-full" disabled>
                                                <option>Active</option>
                                                <option>Inactive</option>
                                            </select>

                                            <!-- <UiButton class="btn-icon btn-outline btn-xs btn-danger"
                                                @click="removeRow(group, row.id)">
                                                <i class="ki-filled ki-trash"></i>
                                            </UiButton> -->
                                        </td>
                                    </tr>

                                    <!-- ADD ROW -->
                                    <tr v-show="group.open">
                                        <!-- <td colspan="6" class="border px-3 py-2 bg-gray-50">
                                            <button class="text-blue-600" @click="addRow(group)">
                                                + Add Line
                                            </button>
                                        </td> -->
                                    </tr>

                                </template>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- FOOTER -->
            <div class="bg-white border-t px-6 py-4 flex justify-end gap-3">
                <button class="btn btn-light" @click="goBack()">Cancel</button>
            </div>
        </div>
        <div v-if="!integrationDetail" class="text-center py-10 text-gray-500">
            Integration data not found
        </div>
    </div>
</template>

<script setup lang="ts">
// import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import { ref, computed } from 'vue'
import { useIntegrationStore } from '@/stores/system-integration/systemIntegration'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import type { IntegrationItem } from '@/stores/system-integration/types/integration-item'

const route = useRoute()
const router = useRouter()

const integrationStore = useIntegrationStore()

const code = route.params.id

const integrationDetail = computed(() =>
    integrationStore.integrationList.find(i => i.code === code)
)

const form = computed<IntegrationItem>(() => (integrationDetail.value ?? {}) as IntegrationItem)

const invoiceTypeTab = ref<'header' | 'definition'>('header')

const mappingGroups = computed(() =>
    integrationDetail.value?.definition ?? []
)

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


const goBack = () => {
    router.back()
}

</script>

<style scoped>
.form-input {
    @apply border rounded px-2 py-1 w-full;
}

.form-select {
    @apply border rounded px-2 py-1;
}
</style>