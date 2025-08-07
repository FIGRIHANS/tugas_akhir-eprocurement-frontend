<template>
  <div class="border rounded-xl">
    <div v-if="!props.isManual" class="py-[10px] px-[24px] flex align-items-center">
      <label class="form-label max-w-fit h-fit self-center mr-[24px] text-xs">
        Select Automatic Criteria
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
              :class="{
                'criteria__field-base--description': item === 'Item Description'
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
            <td>
              <span v-if="!data.isEdit">{{ data.evaluationObject }}</span>
              <select v-else v-model="data.evaluationObject" class="select">
                <option value="a">
                  option 1
                </option>
                <option value="b">
                  option 2
                </option>
              </select>
            </td>
            <td>
              <span v-if="!data.isEdit">{{ data.type }}</span>
              <select v-else v-model="data.type" class="select">
                <option value="a">
                  option 1
                </option>
                <option value="b">
                  option 2
                </option>
              </select>
            </td>
            <td>
              <span v-if="!data.isEdit">{{ data.evaluationItem }}</span>
              <select v-else v-model="data.evaluationItem" class="select">
                <option value="a">
                  option 1
                </option>
                <option value="b">
                  option 2
                </option>
              </select>
            </td>
            <td>
              <span v-if="!data.isEdit">{{ data.itemDescription }}</span>
              <input v-else v-model="data.itemDescription" type="text" class="input" />
            </td>
            <td>
              <span v-if="!data.isEdit">{{ data.weight }}</span>
              <input v-else v-model="data.weight" type="text" class="input" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <button v-if="props.isManual" class="btn btn-primary my-[10px] mx-[24px]" @click="addNewLine">
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

const addNewLine = () => {
  const data = {
    id: (result.value.length + 1).toString(),
    group: 'MRP',
    evaluationObject: '',
    type: '',
    evaluationItem: '',
    itemDescription: '',
    weight: '',
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
