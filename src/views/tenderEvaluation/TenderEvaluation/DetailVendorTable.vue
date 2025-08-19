<template>
  <div>
    <div class="eva__table">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columnsParent"
              :key="index"
              class="eva__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
              :colspan="index > 5 ? 2 : 1"
              :class="{
                'eva__field-base--accordion': index === 0,
                'eva__field-base--weight': item === 'Weight',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="data of props.data" :key="data.id">
            <tr>
              <td>
                <button
                  class="btn btn-icon btn-outline btn-primary w-[21px] h-[21px]"
                  @click="data.isOpenChild = !data.isOpenChild"
                >
                  <i v-if="!data.isOpenChild" class="ki-filled ki-right !text-[9px]"></i>
                  <i v-else class="ki-filled ki-down !text-[9px]"></i>
                </button>
              </td>
              <td v-for="key in tableHeaderParent" :key="key">
                {{ data[key] }}{{ key.startsWith('totalScore') ? '%' : '' }}
              </td>
            </tr>
            <tr v-show="data.isOpenChild">
              <td></td>
              <td></td>
              <td :colspan="tableHeaderChild.length" class="!pt-[0px]">
                <table class="table table-bordered table-sm mb-0">
                  <thead>
                    <tr class="border-b">
                      <th
                        v-for="(item, index) in columnsChild"
                        :key="index"
                        class="eva__field-base-child"
                        :class="{
                          'eva__field-base-child--evaluation': item === 'Evaluation Item',
                          'eva__field-base-child--description': item === 'Description',
                        }"
                      >
                        {{ item }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(sub, index) in data.children" :key="index">
                      <tr>
                        <td>{{ sub.evaluationItem }}</td>
                        <td>{{ sub.weight }}</td>
                        <td>{{ sub.description }}</td>
                        <td>{{ sub.expectedSla }}</td>
                        <template v-for="key in tableHeaderChild" :key="key">
                          <td v-if="key.startsWith('rate')">
                            <input
                              v-model="sub[key]"
                              type="number"
                              class="input"
                              placeholder=""
                              :min="0"
                              @change="calculate(sub, key)"
                            />
                          </td>
                          <td v-if="key.startsWith('score')">{{ (typeof sub[key] === 'number' ? sub[key] : Number(sub[key])).toFixed(2) }}%</td>
                        </template>
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
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { DetailVendorParentTypes, DetailVendorChildTypes } from '../types/tenderEvaluation'

const props = defineProps<{
  columnsParent: string[]
  columnsChild: string[]
  data: DetailVendorParentTypes[]
}>()

const tableHeaderParent = computed(() => {
  if (!props.data.length) return []
  return Object.keys(props.data[0]).filter(
    (item) => item !== 'id' && item !== 'isOpenChild' && item !== 'children',
  )
})

const tableHeaderChild = computed(() => {
  if (!props.data.length) return []
  return Object.keys(props.data[0].children[0])
})

// const calculate = (data: DetailVendorChildTypes, name: string) => {
//   const getWeight = parseInt(data.weight)
//   const getRate = Number(data[name])
//   const vendorCode = name.split('_')[1]

//   data[`score_${vendorCode}`] = getRate * getWeight
// }

const calculate = (data: DetailVendorChildTypes, name: string) => {
  const weight = parseFloat(data.weight) / 100 // "20%" => 0.2
  const rate = Number(data[name]) // input rate 0–100
  const vendorCode = name.split('_')[1]

  // Score = rate (%) * weight (%)
  data[`score_${vendorCode}`] = (rate / 100) * (weight * 100)
}
</script>
