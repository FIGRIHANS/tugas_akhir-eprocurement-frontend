<template>
  <div class="border rounded-xl">
    <div v-if="!props.isManual" class="py-[10px] px-[24px] flex align-items-center">
      <label class="form-label max-w-fit h-fit self-center mr-[24px] text-xs">
        Select Automatic timeline workflow
      </label>
      <select v-model="selectedTemplate" class="select w-[227px]">
        <option
          v-for="item of dummyOption"
          :key="item.tenderWorkflowCode"
          :value="item.tenderWorkflowCode"
        >
          {{ item.wfDescription }}
        </option>
      </select>
    </div>
    <div class="criteria__table">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="criteria__field-base !border-b-blue-500"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data of result" :key="data.id">
            <td>{{ data.id }}</td>
            <td>{{ data.group }}</td>
            <td>{{ data.step }}</td>
            <td>
              <span v-if="!data.isEdit">{{ data.process }}</span>
              <input v-else v-model="data.process" type="text" class="input" />
            </td>
            <td>
              <!-- <span v-if="!data.isEdit">{{ data.startDate }}</span> -->
              <DatePicker v-model="data.startDate" format="dd MMM yyyy" />
            </td>
            <td>
              <!-- <span v-if="!data.isEdit">{{ data.endDate }}</span> -->
              <DatePicker v-model="data.endDate" format="dd MMM yyyy" />
            </td>
            <td>{{ data.workingDays }}</td>
            <td>{{ data.pic }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button v-if="props.isManual" class="btn btn-primary my-[10px] mx-[24px]" @click="addNewLine">
      Add Step
      <i class="ki-duotone ki-plus-circle"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import type { BillingTimelineTypes } from '../../types/tenderCreate'

const props = defineProps<{
  modelValue: BillingTimelineTypes[]
  isManual?: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const selectedTemplate = ref<string>('')
const result = ref<BillingTimelineTypes[]>([])

const dummyOption = ref([
  {
    tenderWorkflowCode: 'RAW-NORM-A1',
    wfDescription: 'Raw Material - Normal Tender',
    evaluationObject: 'Raw Material',
    tenderMethod: 'Normal Tender',
    children: [
      {
        id: '10000008',
        group: 'Supervisor Production Area 1',
        step: '1',
        process: 'Tender Request',
        startDate: '',
        endDate: '',
        workingDays: '3',
        pic: 'User Department/Requestor',
      },
      {
        id: '10000008',
        group: 'Supervisor Procurement Area 1',
        step: '2',
        process: 'Tender Creation',
        startDate: '',
        endDate: '',
        workingDays: '4',
        pic: 'Procurement Team',
      },
      {
        id: '10000008',
        group: 'Procurement Manager Area 1',
        step: '3',
        process: 'Tender Approval',
        startDate: '',
        endDate: '',
        workingDays: '2',
        pic: 'Procurement Manager/Management',
      },
      {
        id: '10000008',
        group: 'Supervisor Procurement Area 1',
        step: '4',
        process: 'Publish Tender',
        startDate: '',
        endDate: '',
        workingDays: '1',
        pic: 'Procurement Team',
      },
      {
        id: '10000008',
        group: 'Vendors',
        step: '5',
        process: 'Vendor Submission',
        startDate: '',
        endDate: '',
        workingDays: '10',
        pic: 'Vendors',
      },
      {
        id: '10000008',
        group: 'Committee Tender Area 1',
        step: '6',
        process: 'Beauty Contest',
        startDate: '',
        endDate: '',
        workingDays: '3',
        pic: 'Evaluation Committee/Procurement Team & Vendors',
      },
      {
        id: '10000008',
        group: 'Vendors',
        step: '7',
        process: 'Vendor Negotiation',
        startDate: '',
        endDate: '',
        workingDays: '5',
        pic: 'Procurement Team & Vendors',
      },
      {
        id: '10000008',
        group: 'Procurement Manager Area 1',
        step: '8',
        process: 'Vendor Evaluation',
        startDate: '',
        endDate: '',
        workingDays: '7',
        pic: 'Evaluation Committee/Procurement Team',
      },
      {
        id: '10000008',
        group: 'Procurement Manager Area 1',
        step: '9',
        process: 'Vendor Awarding',
        startDate: '',
        endDate: '',
        workingDays: '2',
        pic: 'Management/Procurement Manager',
      },
      {
        id: '10000008',
        group: 'Manager Legal',
        step: '10',
        process: 'Contract Signing',
        startDate: '',
        endDate: '',
        workingDays: '5',
        pic: 'Vendor & Legal Department',
      },
    ],
  },
  {
    tenderWorkflowCode: 'RAW-AUC-A1',
    wfDescription: 'Raw Material - Auction',
    evaluationObject: 'Raw Material',
    tenderMethod: 'Auction',
    children: [
      {
        id: '10000008',
        group: 'Supervisor Production Area 1',
        step: '1',
        process: 'Tender Request',
        startDate: '',
        endDate: '',
        workingDays: '3',
        pic: 'User Department/Requestor',
      },
      {
        id: '10000008',
        group: 'Supervisor Procurement Area 1',
        step: '2',
        process: 'Tender Creation',
        startDate: '',
        endDate: '',
        workingDays: '4',
        pic: 'Procurement Team',
      },
      {
        id: '10000008',
        group: 'Procurement Manager Area 1',
        step: '3',
        process: 'Tender Approval',
        startDate: '',
        endDate: '',
        workingDays: '2',
        pic: 'Procurement Manager/Management',
      },
      {
        id: '10000008',
        group: 'Supervisor Procurement Area 1',
        step: '4',
        process: 'Publish Tender',
        startDate: '',
        endDate: '',
        workingDays: '1',
        pic: 'Procurement Team',
      },
      {
        id: '10000008',
        group: 'Vendors',
        step: '5',
        process: 'Vendor Submission',
        startDate: '',
        endDate: '',
        workingDays: '10',
        pic: 'Vendors',
      },
      {
        id: '10000008',
        group: 'Committee Tender Area 1',
        step: '6',
        process: 'Beauty Contest',
        startDate: '',
        endDate: '',
        workingDays: '3',
        pic: 'Evaluation Committee/Procurement Team & Vendors',
      },
      {
        id: '10000008',
        group: 'Vendors',
        step: '7',
        process: 'Auction Event',
        startDate: '',
        endDate: '',
        workingDays: '2',
        pic: 'Procurement Team & Vendors',
      },
      {
        id: '10000008',
        group: 'Vendors',
        step: '8',
        process: 'Vendor Negotiation',
        startDate: '',
        endDate: '',
        workingDays: '5',
        pic: 'Procurement Team & Vendors',
      },
      {
        id: '10000008',
        group: 'Procurement Manager Area 1',
        step: '9',
        process: 'Vendor Evaluation',
        startDate: '',
        endDate: '',
        workingDays: '7',
        pic: 'Evaluation Committee/Procurement Team',
      },
      {
        id: '10000008',
        group: 'Procurement Manager Area 1',
        step: '10',
        process: 'Vendor Awarding',
        startDate: '',
        endDate: '',
        workingDays: '2',
        pic: 'Management/Procurement Manager',
      },
      {
        id: '10000008',
        group: 'Manager Legal',
        step: '11',
        process: 'Contract Signing',
        startDate: '',
        endDate: '',
        workingDays: '5',
        pic: 'Vendor & Legal Department',
      },
    ],
  },
  {
    tenderWorkflowCode: 'RAW-RFQ-A1',
    wfDescription: 'Raw Material - Direct RFQ',
    evaluationObject: 'Raw Material',
    tenderMethod: 'Direct RFQ',
    children: [
      {
        id: '100000080008',
        group: 'Supervisor Production Area 1',
        step: '1',
        process: 'Tender Request',
        startDate: '',
        endDate: '',
        workingDays: '3',
        pic: 'User Department/Requestor',
      },
      {
        id: '100000080008',
        group: 'Supervisor Procurement Area 1',
        step: '2',
        process: 'Tender Creation',
        startDate: '',
        endDate: '',
        workingDays: '4',
        pic: 'Procurement Team',
      },
      {
        id: '100000080008',
        group: 'Procurement Manager Area 1',
        step: '3',
        process: 'Tender Approval',
        startDate: '',
        endDate: '',
        workingDays: '2',
        pic: 'Procurement Manager/Management',
      },
      {
        id: '100000080008',
        group: 'Supervisor Procurement Area 1',
        step: '4',
        process: 'Publish Tender',
        startDate: '',
        endDate: '',
        workingDays: '1',
        pic: 'Procurement Team',
      },
      {
        id: '100000080008',
        group: 'Vendors',
        step: '5',
        process: 'Vendor Submission',
        startDate: '',
        endDate: '',
        workingDays: '10',
        pic: 'Vendors',
      },
      {
        id: '100000080008',
        group: 'Vendors',
        step: '6',
        process: 'Vendor Negotiation',
        startDate: '',
        endDate: '',
        workingDays: '5',
        pic: 'Procurement Team & Vendors',
      },
      {
        id: '100000080008',
        group: 'Procurement Manager Area 1',
        step: '7',
        process: 'Vendor Evaluation',
        startDate: '',
        endDate: '',
        workingDays: '7',
        pic: 'Evaluation Committee/Procurement Team',
      },
      {
        id: '100000080008',
        group: 'Procurement Manager Area 1',
        step: '8',
        process: 'Vendor Awarding',
        startDate: '',
        endDate: '',
        workingDays: '2',
        pic: 'Management/Procurement Manager',
      },
      {
        id: '100000080008',
        group: 'Manager Legal',
        step: '9',
        process: 'Contract Signing',
        startDate: '',
        endDate: '',
        workingDays: '5',
        pic: 'Vendor & Legal Department',
      },
    ],
  },
])

const columns = ref<string[]>([
  'Tender Request ID',
  'Group',
  'Step',
  'Process',
  'Start Date',
  'End Date',
  'Working Days',
  'PIC',
])

const addNewLine = () => {
  const data = {
    id: '10000008000',
    group: 'MRP',
    step: (result.value.length + 1).toString(),
    process: '',
    startDate: '',
    endDate: '',
    workingDays: 'Working Days',
    pic: 'Tender Admin',
    isEdit: true,
  }
  result.value.push(data)
}

watch(
  () => props.modelValue,
  () => {
    result.value = props.modelValue
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => result.value,
  () => {
    emits('update:modelValue', result.value)
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => selectedTemplate.value,
  () => {
    const index = dummyOption.value.findIndex(
      (item) => item.tenderWorkflowCode === selectedTemplate.value,
    )
    if (index !== -1) {
      result.value = dummyOption.value[index].children
    }
  },
  {
    immediate: true,
  },
)
</script>
