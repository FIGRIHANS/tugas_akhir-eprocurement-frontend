<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative w-full max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow">

        <!-- HEADER -->
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-medium">Add Bracket List</h5>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="$emit('close')">
            ✕
          </button>
        </div>

        <!-- FILTER FORM (STYLING LAMA) -->
        <div class="p-6">
          <div class="grid grid-cols-2 gap-6">

            <!-- LEFT -->
            <div class="space-y-6 pl-12">
              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">Bracket Code</label>
                <div class="flex-1">
                  <UiInput v-model="form.bracketCode" />
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">Company Code</label>
                <div class="flex-1">
                  <UiSelect v-model="form.companyCode" :options="companyOptions" />
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">Bracket Type</label>
                <div class="flex-1">
                  <UiSelect v-model="form.bracketType" :options="bracketTypeOptions" />
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">Level</label>
                <div class="flex-1">
                  <UiInput type="number" v-model="form.level" />
                </div>
              </div>
            </div>

            <!-- RIGHT -->
            <div class="space-y-6 pr-12">
              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">Amount From</label>
                <div class="flex-1">
                  <UiInput type="number" v-model="form.amountFrom" />
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">Amount To</label>
                <div class="flex-1">
                  <UiInput type="number" v-model="form.amountTo" />
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">Currency</label>
                <div class="flex-1">
                  <UiSelect v-model="form.currency" :options="currencyOptions" />
                </div>
              </div>
            </div>

          </div>
          <div class="flex justify-end">
            <UiButton class="btn btn-primary" @click="handleFilter()">Filter</UiButton>
          </div>
        </div>

        <!-- TABLE -->
        <div class="p-6 border-t">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 w-10"></th>
                  <th v-for="header in headers" :key="header"
                    class="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {{ header }}
                  </th>
                </tr>
              </thead>

              <tbody class="bg-white divide-y divide-gray-200">

                <!-- EMPTY STATE -->


                <!-- DATA ROW -->
                <tr v-for="item in filteredExampleData" :key="item.bracketCode" class="hover:bg-blue-50 transition">
                  <td class="px-4 py-2 text-center">
                    <UiCheckbox label="" :checked="selectedBracket?.bracketCode === item.bracketCode"
                      @change="selectedBracket = item" />
                  </td>
                  <td class="px-4 py-2 text-sm">{{ item.bracketCode }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.companyCode }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.bracketType }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.level }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.amountFrom }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.amountTo }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.currency }}</td>
                </tr>

                <!-- NO RESULT -->
                <tr v-if="hasFilter && filteredExampleData.length === 0">
                  <td colspan="8" class="py-6 text-center text-gray-400">
                    No data found
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="flex items-center justify-end gap-3 p-4 border-t">
          <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" @click="$emit('close')">
            Cancel
          </button>

          <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md
                   hover:bg-blue-700 disabled:opacity-50" :disabled="!selectedBracket"
            @click="handleSelect(selectedBracket!)">
            Save
          </button>
        </div>

      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

/* =======================
   TYPES
======================= */
type BracketForm = {
  bracketCode: string
  companyCode: string
  bracketType: string
  currency: string
  level: string | number
  amountFrom: string | number
  amountTo: string | number
}

type ExampleBracket = BracketForm

/* =======================
   EMITS
======================= */
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', payload: ExampleBracket): void
}>()

/* =======================
   STORE
======================= */
const invoiceMasterApi = useInvoiceMasterDataStore()

/* =======================
   STATE
======================= */
const form = ref<BracketForm>({
  bracketCode: '',
  companyCode: '',
  bracketType: '',
  currency: '',
  level: '',
  amountFrom: '',
  amountTo: ''
})

/** filter yang SUDAH di-apply */
const appliedFilter = ref<BracketForm | null>(null)
const hasFiltered = ref(false)

const selectedBracket = ref<ExampleBracket | null>(null)

/* =======================
   DUMMY DATA
======================= */
const exampleData: ExampleBracket[] = [
  { bracketCode: 'BR001', companyCode: 'MF00', bracketType: 'PO Amount', level: 1, amountFrom: 0, amountTo: 10000000, currency: 'IDR' },
  { bracketCode: 'BR002', companyCode: 'MF00', bracketType: 'PO Amount', level: 2, amountFrom: 10000001, amountTo: 50000000, currency: 'IDR' },
  { bracketCode: 'BR003', companyCode: 'MF00', bracketType: 'PO Amount', level: 3, amountFrom: 50000001, amountTo: 100000000, currency: 'IDR' },
  { bracketCode: 'BR004', companyCode: 'MF00', bracketType: 'Non PO Amount', level: 1, amountFrom: 0, amountTo: 15000, currency: 'USD' },
  { bracketCode: 'BR005', companyCode: 'MF00', bracketType: 'Non PO Amount', level: 2, amountFrom: 15001, amountTo: 60000, currency: 'USD' }
]

/* =======================
   HELPERS
======================= */
const toNumber = (v: string | number) =>
  v === '' || v === null ? null : Number(v)

/* =======================
   ACTIONS
======================= */
const handleFilter = () => {
  appliedFilter.value = { ...form.value }
  hasFiltered.value = true
  selectedBracket.value = null
}

const handleSelect = (item: ExampleBracket) => {
  emit('select', item)
  emit('close')
}

/* =======================
   COMPUTED (TABLE DATA)
======================= */
const filteredExampleData = computed(() => {
  if (!hasFiltered.value || !appliedFilter.value) return []

  const f = appliedFilter.value

  return exampleData.filter(item => {
    if (f.bracketCode && !item.bracketCode.toLowerCase().includes(f.bracketCode.toLowerCase())) return false
    if (f.companyCode && item.companyCode !== f.companyCode) return false
    if (f.bracketType && item.bracketType !== f.bracketType) return false
    if (f.currency && item.currency !== f.currency) return false
    if (toNumber(f.level) !== null && item.level !== toNumber(f.level)) return false
    if (toNumber(f.amountFrom) !== null && item.amountFrom < toNumber(f.amountFrom)) return false
    if (toNumber(f.amountTo) !== null && item.amountTo > toNumber(f.amountTo)) return false
    return true
  })
})

/* =======================
   OPTIONS
======================= */
const companyOptions = computed(() =>
  invoiceMasterApi.companyCode.map(c => ({ value: c.code, text: c.name }))
)

const bracketTypeOptions = [
  { value: 'PO Amount', text: 'PO Amount' },
  { value: 'Non PO Amount', text: 'Non PO Amount' },
  { value: 'GR Amount', text: 'GR Amount' }
]

const currencyOptions = [
  { value: 'IDR', text: 'IDR' },
  { value: 'USD', text: 'USD' }
]

const headers = [
  'Bracket Code',
  'Company Code',
  'Bracket Type',
  'Level',
  'Amount From',
  'Amount To',
  'Currency'
]

/* =======================
   LIFECYCLE
======================= */
onMounted(() => {
  invoiceMasterApi.getCompanyCode()
})
</script>
