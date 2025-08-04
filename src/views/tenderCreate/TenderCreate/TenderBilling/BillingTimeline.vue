<template>
  <div class="border rounded-xl">
    <div v-if="!props.isManual" class="py-[10px] px-[24px] flex align-items-center">
      <label class="form-label max-w-fit h-fit self-center mr-[24px] text-xs">
        Select Automatic timeline workflow
      </label>
      <select v-model="selectedTemplate" class="select w-[227px]">
        <option v-for="item of dummyOption" :key="item.id" :value="item.id">
          {{ item.name }}
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
              <DatePicker v-model="data.startDate" format="yyyyMMdd" />
            </td>
            <td>
              <!-- <span v-if="!data.isEdit">{{ data.endDate }}</span> -->
              <DatePicker v-model="data.endDate" format="yyyyMMdd" />
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
    id: '1',
    name: 'test',
    children: [
      {
        id: '10000',
        group: 'MRP',
        step: '1',
        process: 'Created',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      },
      {
        id: '10000',
        group: 'MRP',
        step: '2',
        process: 'Created',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      },
      {
        id: '10000',
        group: 'MRP',
        step: '3',
        process: 'Created',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      }
    ]
  },
  {
    id: '2',
    name: 'test2',
    children: [
      {
        id: '10000',
        group: 'MRP',
        step: '1',
        process: 'Published',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      },
      {
        id: '10000',
        group: 'MRP',
        step: '2',
        process: 'Published',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      },
      {
        id: '10000',
        group: 'MRP',
        step: '3',
        process: 'Published',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      }
    ]
  },
  {
    id: '3',
    name: 'test3',
    children: [
      {
        id: '10000',
        group: 'MRP',
        step: '1',
        process: 'Vendor Negotiation',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      },
      {
        id: '10000',
        group: 'MRP',
        step: '2',
        process: 'Vendor Negotiation',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      },
      {
        id: '10000',
        group: 'MRP',
        step: '3',
        process: 'Vendor Negotiation',
        startDate: '',
        endDate: '',
        workingDays: 'Working Days',
        pic: 'Tender Admin'
      }
    ]
  }
])

const columns = ref<string[]>([
  'Tender Request ID',
  'Group',
  'Step',
  'Process',
  'Start Date',
  'End Date',
  'Working Days',
  'PIC'
])

const addNewLine = () => {
  const data = {
    id: '10000000',
    group: 'MRP',
    step: (result.value.length + 1).toString(),
    process: '',
    startDate: '',
    endDate: '',
    workingDays: 'Working Days',
    pic: 'Tender Admin',
    isEdit: true
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
    immediate: true
  }
)

watch(
  () => result.value,
  () => {
    emits('update:modelValue', result.value)
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => selectedTemplate.value,
  () => {
    const index = dummyOption.value.findIndex((item) => item.id === selectedTemplate.value)
    if (index !== -1) {
      result.value = dummyOption.value[index].children
    }
  },
  {
    immediate: true
  }
)
</script>
