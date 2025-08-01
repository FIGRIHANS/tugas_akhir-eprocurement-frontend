<template>
  <div class="border rounded-xl">
    <div v-if="!props.isManual" class="py-[10px] px-[24px] flex align-items-center">
      <label class="form-label max-w-32 h-fit self-center">
        Evaluation Object
      </label>
      <select v-model="selectedTemplate" class="select w-[227px]">
        <option v-for="item of dummyOption" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="table-item__table">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="table-item__field-base !border-b-blue-500"
              :class="{
                'table-item__field-base--action': index === 0,
                'table-item__field-base--description': item === 'Material Desc'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data of result" :key="data.id">
            <td>{{ data.id }}</td>
            <td>{{ data.group }}</td>
            <td>{{ data.evaluationObject }}</td>
            <td>{{ data.type }}</td>
            <td>{{ data.evaluationItem }}</td>
            <td>{{ data.itemDescription }}</td>
            <td>{{ data.weight }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <button v-if="props.isManual" class="btn btn-primary py-[10px] px-[24px]">
      Add Criteria
      <i class="ki-duotone ki-plus-circle"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { CriteriaTypes } from '../../types/tenderCreate'

const props = defineProps<{
  modelValue: CriteriaTypes[]
  isManual?: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const selectedTemplate = ref<string>('')
const result = ref<CriteriaTypes[]>([])

const dummyOption = ref([
  {
    id: '1',
    name: 'test',
    children: [
      {
        id: '1',
        group: 'MRP',
        evaluationObject: 'E1',
        type: 'Technical',
        evaluationItem:  '1',
        itemDescription: 'Product Quality',
        weight: '10'
      },
      {
        id: '2',
        group: 'MRP',
        evaluationObject: 'E2',
        type: 'Technical',
        evaluationItem:  '1',
        itemDescription: 'Lead Time Supply',
        weight: '30'
      },
      {
        id: '3',
        group: 'MRP',
        evaluationObject: 'E5',
        type: 'Technical',
        evaluationItem:  '1',
        itemDescription: 'Lead Time Supply',
        weight: '20'
      }
    ]
  },
  {
    id: '2',
    name: 'test2',
    children: [
      {
        id: '1',
        group: 'MRP',
        evaluationObject: 'E1',
        type: 'Commercial',
        evaluationItem:  '1',
        itemDescription: 'Product Quality',
        weight: '10'
      },
      {
        id: '2',
        group: 'MRP',
        evaluationObject: 'E2',
        type: 'Commercial',
        evaluationItem:  '1',
        itemDescription: 'Lead Time Supply',
        weight: '30'
      },
      {
        id: '3',
        group: 'MRP',
        evaluationObject: 'E5',
        type: 'Commercial',
        evaluationItem:  '1',
        itemDescription: 'Lead Time Supply',
        weight: '20'
      }
    ]
  },
  {
    id: '3',
    name: 'test3',
    children: [
      {
        id: '1',
        group: 'MRP',
        evaluationObject: 'E1',
        type: 'Commercial',
        evaluationItem:  '1',
        itemDescription: 'After Sales Warranty',
        weight: '10'
      },
      {
        id: '2',
        group: 'MRP',
        evaluationObject: 'E2',
        type: 'Commercial',
        evaluationItem:  '1',
        itemDescription: 'After Sales Warranty',
        weight: '30'
      },
      {
        id: '3',
        group: 'MRP',
        evaluationObject: 'E5',
        type: 'Commercial',
        evaluationItem:  '1',
        itemDescription: 'After Sales Warranty',
        weight: '20'
      }
    ]
  }
])

const columns = ref<string[]>([
  'Evaluation ID',
  'Group',
  'Evaluation Object',
  'Type',
  'Evaluation Item',
  'Item Description',
  'Weight'
])

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
</script>
