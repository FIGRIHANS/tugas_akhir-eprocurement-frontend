<template>
  <div>
    <div class="eva__table mt-[24px] overflow-auto">
      <table class="table text-gray-700 font-medium text-sm w-full !rounded-none">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="eva__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
              :class="{ 'eva__field-base--accordion': index === 0 }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="row in rows" :key="row.materialCode">
            <tr>
              <td class="align-top">
                <button
                  class="btn btn-icon btn-outline btn-primary w-[21px] h-[21px]"
                  @click="row.isOpenChild = !row.isOpenChild"
                >
                  <i v-if="!row.isOpenChild" class="ki-filled ki-right !text-[9px]"></i>
                  <i v-else class="ki-filled ki-down !text-[9px]"></i>
                </button>
              </td>

              <td v-for="key in parentKeys" :key="key" class="align-top">
                <template v-if="['simulationAmount'].includes(key)">
                  {{ formatNumber(sumNegotiationAmount(row)) }}
                </template>
                <template v-else-if="key === 'variance'">
                  {{ formatPercentage(calculateVariance(row)) }}
                </template>
                <template v-else-if="['bottomPriceLBMA', 'unitPriceLBMA'].includes(key)">
                  {{ formatNumber(row[key as keyof typeof row]) }}
                </template>
                <template v-else-if="['simulationStatus'].includes(key)">
                  <span
                    v-if="row[key as keyof typeof row] === 'Error'"
                    class="badge badge-outline badge-pill badge-danger"
                  >
                    {{ row[key as keyof typeof row] }}
                  </span>
                  <span v-else class="badge badge-outline badge-pill badge-success">
                    {{ row[key as keyof typeof row] }}
                  </span>
                </template>
                <template v-else>
                  {{ row[key as keyof typeof row] ?? '-' }}
                </template>
              </td>
            </tr>

            <tr v-show="row.isOpenChild">
              <td></td>
              <td :colspan="parentKeys.length" class="!pt-[0px]">
                <table class="table !rounded-none">
                  <thead>
                    <tr class="border-b">
                      <th
                        v-for="(c, i) in childColumns"
                        :key="i"
                        class="eva__field-base-child !radius-0 !bg-blue-100 !text-blue-500"
                      >
                        {{ c }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(bid, i) in row.bids" :key="i">
                      <td>
                        <span
                          class="badge badge-outline badge-pill"
                          :class="{
                            'badge-success': bid.rank === 1,
                            'badge-primary': bid.rank === 2,
                            'badge-warning': bid.rank >= 3,
                          }"
                        >
                          {{ bid.rank }}</span
                        >
                      </td>
                      <td>{{ bid.vendor }}</td>
                      <td>
                        <UiInput
                          v-model="bid.negoQty"
                          type="number"
                          :max-length="row.quantity"
                          @update:model-value="onChangeNegoQty(row, bid)"
                          :class="{
                            'border-red-500 focus:border-red-500 focus:ring-red-500':
                              sumNego(row) > row.quantity,
                          }"
                        />
                      </td>
                      <td>{{ bid.uom }}</td>
                      <td>{{ formatNumber(calculateChildBottomPrice(row, bid)) }}</td>
                      <td>{{ formatNumber(bid.unitPrice) }}</td>
                      <td>
                        {{
                          bid.negotiationAmount == null ? '-' : formatNumber(bid.negotiationAmount)
                        }}
                      </td>
                      <td>{{ bid.var }}</td>
                      <td>{{ bid.currency }}</td>
                      <td>
                        <div v-if="bid.negoQty != 0">🏅</div>
                        <div v-else></div>
                      </td>
                    </tr>
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
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import { ref } from 'vue'

defineEmits(['updateCount'])

const props = defineProps<{
  data: any
}>()

// dummy data
// const dummyData = [
//   {
//     materialCode: 'CH-1062',
//     materialDesc: '	Macro Fertilizer Urea',
//     quantity: 30,
//     uom: 'TON',
//     bottomPriceLBMA: 100861.5,
//     unitPriceLBMA: 3362.0,
//     simulationAmount: 93000.0,
//     variance: '-8%',
//     currency: 'USD',
//     awardDraft: '1 winner',
//     simulationStatus: 'Error',
//     simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
//     bids: [
//       {
//         rank: 1,
//         vendor: 'PT Walldorf Tbk',
//         negoQty: 30,
//         uom: 'TON',
//         bottomPrice: 100861.5,
//         unitPrice: 3100.0,
//         negotiationAmount: 93000.0,
//         var: '-8%',
//         currency: 'USD',
//         awardStatus: '🏅',
//       },
//       {
//         rank: 2,
//         vendor: 'PT Somper GmbH Tbk',
//         negoQty: 0,
//         uom: 'TON',
//         bottomPrice: null,
//         unitPrice: 3200.0,
//         negotiationAmount: null,
//         var: '0%',
//         currency: 'USD',
//         awardStatus: '',
//       },
//       {
//         rank: 3,
//         vendor: 'PT Kreuzschmid Kgaa Tbk',
//         negoQty: 0,
//         uom: 'TON',
//         bottomPrice: null,
//         unitPrice: 3250.0,
//         negotiationAmount: null,
//         var: '0%',
//         currency: 'USD',
//         awardStatus: '',
//       },
//     ],
//   },
//   {
//     materialCode: 'CH-1064',
//     materialDesc: 'Macro Fertilizer NPK',
//     quantity: 33,
//     uom: 'TON',
//     bottomPriceLBMA: 110947.65,
//     unitPriceLBMA: 3362.05,
//     simulationAmount: 103300.0,
//     variance: '-7%',
//     currency: 'USD',
//     awardDraft: '2 winner',
//     simulationStatus: 'Completed',
//     simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
//     bids: [
//       {
//         rank: 1,
//         vendor: 'PT Walldorf Tbk',
//         negoQty: 23,
//         uom: 'TON',
//         bottomPrice: 77327.15,
//         unitPrice: 3100.0,
//         negotiationAmount: 71300.0,
//         var: '-8%',
//         currency: 'USD',
//         awardStatus: '🏅',
//       },
//       {
//         rank: 2,
//         vendor: 'PT Somper GmbH Tbk',
//         negoQty: 10,
//         uom: 'TON',
//         bottomPrice: 33620.5,
//         unitPrice: 3200.0,
//         negotiationAmount: 32000.0,
//         var: '-5%',
//         currency: 'USD',
//         awardStatus: '🏅',
//       },
//       {
//         rank: 3,
//         vendor: 'PT Kreuzschmid Kgaa Tbk',
//         negoQty: 0,
//         uom: 'TON',
//         bottomPrice: null,
//         unitPrice: 3250.0,
//         negotiationAmount: null,
//         var: '0%',
//         currency: 'USD',
//         awardStatus: '',
//       },
//     ],
//   },
//   {
//     materialCode: '	CH-1066',
//     materialDesc: 'Macro Fertilizer CaCO3',
//     quantity: 25,
//     uom: 'TON',
//     bottomPriceLBMA: 84051.25,
//     unitPriceLBMA: 3362.0,
//     simulationAmount: 79250.0,
//     variance: '-6%',
//     currency: 'USD',
//     awardDraft: '3 winner',
//     simulationStatus: 'Completed',
//     simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
//     bids: [
//       {
//         rank: 1,
//         vendor: 'PT Walldorf Tbk',
//         negoQty: 10,
//         uom: 'TON',
//         bottomPrice: 33620.5,
//         unitPrice: 3100.0,
//         negotiationAmount: 31000.0,
//         var: '-8%',
//         currency: 'USD',
//         awardStatus: '🏅',
//       },
//       {
//         rank: 2,
//         vendor: 'PT Somper GmbH Tbk',
//         negoQty: 10,
//         uom: 'TON',
//         bottomPrice: 33620.5,
//         unitPrice: 3200.0,
//         negotiationAmount: 32000.0,
//         var: '-5%',
//         currency: 'USD',
//         awardStatus: '🏅',
//       },
//       {
//         rank: 3,
//         vendor: 'PT Kreuzschmid Kgaa Tbk',
//         negoQty: 5,
//         uom: 'TON',
//         bottomPrice: 16810.25,
//         unitPrice: 3250.0,
//         negotiationAmount: 16250.0,
//         var: '3%',
//         currency: 'USD',
//         awardStatus: '🏅',
//       },
//     ],
//   },
// ]

// table header
const columns = ref<string[]>([
  'Action',
  'Material',
  'Material Desc',
  'Quantity',
  'UOM',
  'Bottom Price(LBMA)',
  'Unit Price(LBMA)',
  'Simulation Amount',
  'Variance',
  'Currency',
  'Award Draft',
  'Simulation Status',
  'Simulation Message',
])

// mapping urutan kolom parent -> key data
const parentKeys = [
  'materialCode',
  'materialDesc',
  'quantity',
  'uom',
  'bottomPriceLBMA',
  'unitPriceLBMA',
  'simulationAmount',
  'variance',
  'currency',
  'awardDraft',
  'simulationStatus',
  'simulationMessage',
] as const

const childColumns = [
  'Rank',
  'Vendor',
  'Nego Qty',
  'UOM',
  'Bottom Price',
  'Unit Price',
  'Negotiation Amount',
  'Var',
  'Currency',
  'Award Status',
]

const rows = ref(
  ///TODO: change any to specific data type
  props.data.map((d: any) => ({
    ...d,
    isOpenChild: false, // default collapsed
  })),
)

///TODO: change any to spesific data type
const formatNumber = (val: string | number) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(val ?? 0))
}
const sumNego = (row: any) => {
  return row.bids.reduce((s: number, b: any) => s + Number(b.negoQty || 0), 0)
}

const sumNegotiationAmount = (row: any) => {
  return row.bids.reduce((s: number, b: any) => s + Number(b.negotiationAmount || 0), 0)
}

const formatPercentage = (val: number | null | undefined) => {
  if (val === null || Number.isNaN(val)) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(Number(val))
}

const calculateVariance = (row: any) => {
  const simulationAmount = sumNegotiationAmount(row)
  const base = Number(row.bottomPriceLBMA ?? 0)
  if (!base) return
  return (simulationAmount - base) / base
}

const calculateChildBottomPrice = (row: any, bid: any) => {
  const qty = Number(bid.negoQty || 0)
  const lbma = Number(row.unitPriceLBMA || 0)

  return qty * lbma
}

const onChangeNegoQty = (row: any, bid: any) => {
  let qty = Number(bid.negoQty || 0)
  if (qty < 0) qty = 0
  if (qty > row.quantity) qty = row.quantity

  const totalOthers = row.bids
    .filter((b: any) => b !== bid)
    .reduce((s: number, b: any) => s + Number(b.negoQty || 0), 0)

  const allowedForThis = Math.max(0, row.quantity - totalOthers)
  if (qty > allowedForThis) qty = allowedForThis

  bid.negoQty = qty

  if (bid.unitPrice != null) {
    bid.negotiationAmount = qty > 0 ? qty * Number(bid.unitPrice) : 0
  }

  let count = 0

  for (let i = 0; i < row.bids.length; i++) {
    if (row.bids[i].negoQty !== 0) {
      count++
    }
  }

  row.awardDraft = count + ' Winner'
}
</script>
