<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
    <div class="relative w-full max-w-4xl mx-auto">
      <div class="relative bg-white rounded-lg shadow">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-medium">Add Auth Object Group</h5>
          <button type="button" class="text-gray-400 hover:text-gray-500" @click="close()">
            <span class="sr-only">Close</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-8 flex justify-center">
          <div class="grid grid-cols-1 gap-6">
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-40 text-left">Auth Object Group <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <input
                  type="text"
                  v-model="form.authObjectGroup"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-40 text-left">Auth Object Code <span class="text-red-500">*</span></label>
              <div class="flex-1">
                <input
                  type="text"
                  v-model="form.authObjectCode"
                  class="w-30 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 w-40 text-left">Auth Object Name</label>
              <div class="flex-1">
                <input
                  type="text"
                  v-model="form.authObjectName"
                  class="w-30 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
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

        <!-- Table Contoh-->
        <div class="p-6 border-t">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Auth Object Group</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Auth Object Code</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Auth Object Name</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in exampleData" :key="item.authObjectGroup">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.authObjectGroup }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.authObjectCode }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.authObjectName }}</td>
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

interface FormType {
  authObjectGroup: string
  authObjectCode: string
  authObjectName: string
}

type ExampleRow = {
  authObjectGroup: string
  authObjectCode: string
  authObjectName: string
}

export default defineComponent({
  name: 'AddAuthModal',
  components: { Save: SaveIcon },
  emits: ['close', 'submit'],
  setup(_, { emit }) {
    const form = ref<FormType>({
      authObjectGroup: '',
      authObjectCode: '',
      authObjectName: '',
    })

    const exampleData: ExampleRow[] = [
      {
        authObjectGroup: 'CC001',
        authObjectCode: 'GN03020001',
        authObjectName: 'GR001'
      },
      {
        authObjectGroup: 'CC001',
        authObjectCode: 'GN03020001',
        authObjectName: 'GR001'
      },
      {
        authObjectGroup: 'CC001',
        authObjectCode: 'GN03020001',
        authObjectName: 'GR001'
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

    const close = (): void => emit('close')

    return {
      form,
      exampleData,
      isFormValid,
      handleSubmit,
      close
    }
  }
})
</script>
