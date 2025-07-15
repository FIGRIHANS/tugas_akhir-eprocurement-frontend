<template>
    <BreadcrumbView :routes="[{ name: 'New Workflow', to: '/workflow-configuration' }]" title="Add New Workflow" />
    <section id="create-form">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    WF Header Configuration
                </h3>
            </div>
            <div class="card-body">
                <div class="flex gap-[24px]">
                    <div class="w-[50%] flex-1 p-[16px]">
                        <UiSelect label="Company Code" placeholder="Select" row valueKey="value" textKey="text" required
                            :options="companyCodes" />
                    </div>
                    <div class="w-[50%] flex-1 p-[16px]">
                        <UiSelect label="Company Code" placeholder="Company Code" row valueKey="value" textKey="text"
                            required :options="companyCodes" />
                    </div>
                </div>
                <div class="flex gap-[24px]">
                    <div class="w-[50%] flex-1 p-[16px]">
                        <UiSelect label="Process Type" placeholder="Select" row valueKey="value" textKey="text" required
                            :options="companyCodes" />
                    </div>
                    <div class="w-[50%] flex-1 p-[16px]">
                        <UiSelect label="Company Code" placeholder="Company Code" row valueKey="value" textKey="text"
                            required :options="companyCodes" />
                    </div>
                </div>
                <div class="flex gap-[24px]">
                    <div class="w-[50%] flex-1 p-[16px]">
                        <UiInput label="WF Name" placeholder="" row required />
                    </div>
                    <div class="w-[50%] flex-1 p-[16px]">
                        <UiSelect label="Company Code" placeholder="Company Code" row valueKey="value" textKey="text"
                            required :options="companyCodes" />
                    </div>
                </div>
                <div class="flex gap-[24px]">
                    <div class="w-[50%] flex-1 p-[16px]">
                        <UiInput type="number" label="WF Step" placeholder="" row required />
                    </div>
                    <div class="w-[50%] flex-1 p-[16px]">
                        <UiSelect label="Company Code" placeholder="Company Code" row valueKey="value" textKey="text"
                            required :options="companyCodes" />
                    </div>
                </div>
                <div class="action-button flex justify-end">
                    <UiButton variant="primary">
                        Generate WF Step
                        <UiIcon name="arrows-circle" variant="duotone" />
                    </UiButton>
                </div>
            </div>

        </div>
    </section>
    <section id="create-form">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    PG001 - WF Profile Group and Step
                </h3>
            </div>
            <div class="card-body">
                <table class="table align-middle text-gray-700 font-medium text-sm">
                    <thead>
                        <tr>
                            <th>Step</th>
                            <th>Category</th>
                            <th>Bracket Amount</th>
                            <th>Step Name</th>
                            <th>Profile ID</th>
                            <th>Profile Name</th>
                            <th>Approve Group ID</th>
                            <th>Notification Group ID</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="!isDataEmpty">
                            <td> Customer 1</td>
                            <td> Customer 1</td>
                            <td> Customer 1</td>
                            <td> Customer 1</td>
                            <td> Customer 1</td>
                            <td> Customer 1</td>
                            <td> Customer 1</td>
                            <td> Customer 1</td>
                            <td> Customer 1</td>
                        </tr>
                        <tr v-else>
                            <td colspan="9" class="text-center">
                                <div class="flex items-center justify-center min-h-[150px]">
                                    <h1>Data Will appear after generate WF Step</h1>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

        <!-- <UiAccordion /> -->

    </section>
</template>
<script setup lang="ts">

import { ref } from 'vue';
import BreadcrumbView from '@/components/BreadcrumbView.vue';
import UiButton from '@/components/ui/atoms/button/UiButton.vue';
import UiInput from '@/components/ui/atoms/input/UiInput.vue';
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue';
// import UiRadio from '@/components/ui/atoms/radio/UiRadio.vue';
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue';
// import UiAccordion from '@/components/ui/atoms/accordion/UiAccordion.vue';

const isDataEmpty = ref(true)

const companyCodes = ref([
    {
        text: 'AX756',
        value: '1'
    }
])

// const barcketAmount = [
//     {
//         text: 'Yes',
//         value: '1'
//     },
//     {
//         text: 'No',
//         value: '2'
//     }
// ]
</script>