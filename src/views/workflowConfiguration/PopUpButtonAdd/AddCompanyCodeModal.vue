<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50"
  >
    <div class="relative w-full max-w-4xl mx-auto">
      <div class="relative bg-white rounded-lg shadow">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-medium">Add Company Code</h5>
          <button type="button" class="btn btn-xs btn-icon btn-light" @click="close()">
            <i class="ki-outline ki-cross"> </i>
          </button>
        </div>
        <div class="p-8 flex justify-center">
          <div class="grid grid-cols-1 gap-6 w-full max-w-lg">
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-40 text-left"
                >Company Code <span class="text-red-500">*</span></label
              >
              <div class="flex-1">
                <input
                  type="text"
                  v-model="form.companyCode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-40 text-left"
                >Company Name <span class="text-red-500">*</span></label
              >
              <div class="flex-1">
                <input
                  type="text"
                  v-model="form.companyName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end p-4 mr-3 border-t">
          <UiButton
            variant="primary"
            class="flex items-center gap-2"
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            <Save class="w-5 h-5" />
            <span>Save</span>
          </UiButton>
        </div>

        <!-- List Table Company Code -->
        <div class="p-6">
          <h6 class="text-lg font-medium mb-4">List Table Company Code</h6>
          <div class="overflow-x-auto border rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-teal-100">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-primary-clarity"
                  >
                    Company Code
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-primary-clarity"
                  >
                    Company Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-primary-clarity"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-primary-clarity"
                  >
                    Created Date
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-blue-200"
                  >
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in exampleData" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.companyCode }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.companyName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.status }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.createdDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.createdBy }}
                  </td>
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
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

interface FormType {
  companyCode: string
  companyName: string
}

interface CompanyRow {
  companyCode: string
  companyName: string
  status: string
  createdDate: string
  createdBy: string
}

export default defineComponent({
  name: 'AddCompanyCodeModal',
  components: { Save: SaveIcon, UiButton },
  emits: ['close', 'submit'],
  setup(_, { emit }) {
    const form = ref<FormType>({
      companyCode: 'MF00',
      companyName: 'Petrosea',
    })

    // Mock data based on the screenshot/request
    const exampleData: CompanyRow[] = [
      {
        companyCode: 'MF00',
        companyName: 'Petrosea',
        status: 'Active',
        createdDate: '10.10.2025',
        createdBy: 'Joko',
      },
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

    const close = (): void => emit('close')

    return {
      form,
      exampleData,
      isFormValid,
      handleSubmit,
      close,
    }
  },
})
</script>
