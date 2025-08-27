<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
    <div class="relative w-full max-w-6xl mx-auto">
      <div class="relative bg-white rounded-lg shadow">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-medium">Add Bracket List</h5>
          <button type="button" class="text-gray-400 hover:text-gray-500" @click="$emit('close')">
            <span class="sr-only">Close</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      <div class="p-6">
        <!-- Grid 2 kolom -->
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-6 pl-12">
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-32 text-left">Bracket Code <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <input
                  type="text"
                  v-model="form.bracketCode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-32 text-left">Company Code <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <select
                  v-model="form.companyCode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" class="text-gray-400">Select</option>
                  <option v-for="option in companyOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-32 text-left">Bracket Type <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <select
                  v-model="form.bracketType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" class="text-gray-400">Select</option>
                  <option v-for="option in bracketTypeOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-32 text-left">Level <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <input
                  type="number"
                  v-model.number="form.level"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div class="space-y-6 pr-12">
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-32 text-left">Amount From <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <input
                  type="number"
                  v-model.number="form.amountFrom"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-32 text-left">Amount To <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <input
                  type="number"
                  v-model.number="form.amountTo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-32 text-left">Currency <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <select
                  v-model="form.currency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" class="text-gray-400">Select</option>
                  <option v-for="option in currencyOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end p-4 border-t">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            <Save class="w-5 h-5 mr-2" />
            <span>Save</span>
          </button>
        </div>

        <!-- Table Contoh -->
        <div class="p-6 border-t">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Bracket Code</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Company Code</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Bracket Type</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Level</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Amount From</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Amount To</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in exampleData" :key="item.bracketCode">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.bracketCode }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.companyCode }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.bracketType }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.level }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.amountFrom }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.amountTo }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Save as SaveIcon } from 'lucide-vue-next'

type BracketForm = {
  bracketCode: string
  amountFrom: number | string
  companyCode: string
  amountTo: number | string
  bracketType: string
  currency: string
  level: number | string
}

type ExampleBracket = {
  bracketCode: string
  companyCode: string
  bracketType: string
  level: string | number
  amountFrom: string | number
  amountTo: string | number
  currency: string
}

export default defineComponent({
  name: 'AddBracketModal',
  components: { Save: SaveIcon },
  emits: ['close', 'submit'],
  setup(_, { emit }) {
    const form = ref<BracketForm>({
      bracketCode: '',
      amountFrom: '',
      companyCode: '',
      amountTo: '',
      bracketType: '',
      currency: '',
      level: '',
    })

    const companyOptions = [
      { value: 'GNRO', text: 'GNRO' }
    ]

    const bracketTypeOptions = [
      { value: 'PO Amount', text: 'PO Amount' }
    ]

    const currencyOptions = [
      { value: 'IDR', text: 'IDR' },
      { value: 'USD', text: 'USD' }
    ]

    const exampleData: ExampleBracket[] = [
      {
        bracketCode: 'BR001',
        companyCode: 'GNRO',
        bracketType: 'PO Amount',
        level: '1',
        amountFrom: '0',
        amountTo: '10000000',
        currency: 'IDR'
      },
      {
        bracketCode: 'BR002',
        companyCode: 'GNRO',
        bracketType: 'PO Amount',
        level: '2',
        amountFrom: '10000001',
        amountTo: '50000000',
        currency: 'IDR'
      },
      {
        bracketCode: 'BR003',
        companyCode: 'GNRO',
        bracketType: 'PO Amount',
        level: '3',
        amountFrom: '50000001',
        amountTo: '100000000',
        currency: 'IDR'
      }
    ]

    const isFormValid = computed(() => {
      return Object.values(form.value).every((val) => String(val).trim() !== '')
    })

    const handleSubmit = (): void => {
      if (isFormValid.value) {
        emit('submit', form.value)
        emit('close')
      }
    }

    const close = () => emit('close')

    return {
      form,
      companyOptions,
      bracketTypeOptions,
      currencyOptions,
      exampleData,
      isFormValid,
      handleSubmit,
      close
    }
  }
})
</script>
