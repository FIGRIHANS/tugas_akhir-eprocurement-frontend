<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
    <div class="relative w-full max-w-6xl mx-auto px-8">
      <div class="relative bg-white rounded-lg shadow">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-medium">Add WF Profile Group</h5>
          <button type="button" class="text-gray-400 hover:text-gray-500" @click="$emit('close')">
            <span class="sr-only">Close</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-x-20 gap-y-6">
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700 w-32 text-left">Profile Group ID <span class="text-red-500">*</span></label>
                <div class="flex-1">
                  <input
                    type="text"
                    v-model="form.profileGroupId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700 w-32 text-left">Profile Name <span class="text-red-500">*</span></label>
                <div class="flex-1">
                  <select
                    v-model="form.profileName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select</option>
                    <option v-for="option in profileOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700 w-32 text-left">Profile ID <span class="text-red-500">*</span></label>
                <div class="flex-1">
                  <input
                    type="number"
                    v-model.number="form.profileId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700 w-36 text-left">Approver Group ID <span class="text-red-500">*</span></label>
                <div class="flex-1">
                  <select
                    v-model="form.approverGroupId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select</option>
                    <option v-for="option in approverOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700 w-32 text-left">Category <span class="text-red-500">*</span></label>
                <div class="flex-1 flex gap-4">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.category"
                      value="Verification"
                      class="mr-2"
                    />
                    <span class="text-sm">Verification</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.category"
                      value="Approval"
                      class="mr-2"
                    />
                    <span class="text-sm">Approval</span>
                  </label>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700 w-32 text-left">Step <span class="text-red-500">*</span></label>
                <div class="flex-1">
                  <input
                    type="number"
                    v-model.number="form.step"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
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
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Profile Group ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Profile Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Profile ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Approver Group ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                  <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-600">Step</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in tableData" :key="item.profileGroupId">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.profileGroupId }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.profileName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.profileId }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.approverGroupId }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.category }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.step }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

tableData.value = [
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Save as SaveIcon } from 'lucide-vue-next'

interface ProfileData {
  profileGroupId: string;
  approverGroupId: string;
  profileName: string;
  category: string;
  profileId: string;
  step: string;
}

export default defineComponent({
  name: 'AddProfileModal',
  components: { Save: SaveIcon },
  emits: ['close', 'submit'],
  setup(_, { emit }) {
    const tableData = ref<ProfileData[]>([])

    const form = ref({
      profileGroupId: '',
      approverGroupId: '',
      profileName: '',
      category: '',
      profileId: '',
      step: ''
    })

    const approverOptions = [
      { value: 'AG01', text: 'AG01' }
    ]

    const profileOptions = [
      { value: 'Sr. Management', text: 'Sr. Management' }
    ]

    // Inisialisasi tabel dengan data contoh
    tableData.value = [
      {
        profileGroupId: '3002',
        profileName: 'Sr. Management',
        profileId: 'GR001',
        approverGroupId: 'AG01',
        category: 'Verification',
        step: '3'
      },
      {
        profileGroupId: '3002',
        profileName: 'Sr. Management',
        profileId: 'GR001',
        approverGroupId: 'AG01',
        category: 'Verification',
        step: '3'
      },
      {
        profileGroupId: '3002',
        profileName: 'Sr. Management',
        profileId: 'GR001',
        approverGroupId: 'AG01',
        category: 'Verification',
        step: '3'
      }
    ]

    const isFormValid = computed(() => {
      return Object.values(form.value).every(val => String(val).trim() !== '')
    })

    const handleSubmit = () => {
      if (isFormValid.value) {
        tableData.value.push({ ...form.value } as ProfileData)
        emit('submit', form.value)
        // Jangan tutup modal secara langsung untuk menampilkan tabel yang diperbarui
        // Reset formulir
        form.value = {
          profileGroupId: '',
          approverGroupId: '',
          profileName: '',
          category: '',
          profileId: '',
          step: ''
        }
      }
    }

    const close = () => emit('close')

    return {
      tableData,
      form,
      approverOptions,
      profileOptions,
      isFormValid,
      handleSubmit,
      close
    }
  }
})
</script>
