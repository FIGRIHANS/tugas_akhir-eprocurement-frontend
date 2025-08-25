<template>
  <div class="space-y-6">
    <div class="card">
      <div class="card-header bg-white flex justify-between items-center">
        <div class="flex items-center gap-2">
          <button
            @click="toggleApproversTable"
            class="w-6 h-6 bg-gray-300 rounded flex items-center justify-center hover:bg-blue-200 transition-colors"
          >
            <ChevronDown
              :class="['w-4 h-4 text-gray-600 transition-transform', { 'rotate-180': !showApproversTable }]"
            />
          </button>
          <h3 class="card-title text-black-700">{{ approveProfileId }} - List of approver</h3>
        </div>
        <button
          v-show="showApproversTable"
          class="flex items-center gap-2 bg-blue-500 text-white text-sm font-medium rounded h-10 px-3 hover:bg-blue-700 transition-colors"
          @click="$emit('add-approver')"
        >
          <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-400">
            <Plus class="w-2.5 h-2.5 text-white" />
          </div>
          Add New Approver
        </button>
      </div>
      <div v-show="showApproversTable" class="card-body p-0">
        <div class="overflow-hidden rounded-b-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-white">
              <tr>
                <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap text-gray-600">Approve Profile ID</th>
                <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap text-gray-600">Profile ID</th>
                <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap text-gray-600">Employee ID</th>
                <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap text-gray-600">Employee Name</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(approver, index) in approvers" :key="index" class="hover:bg-gray-50">
                <td class="py-3 px-6 text-sm whitespace-nowrap">{{ approver.approveProfileId }}</td>
                <td class="py-3 px-6 text-sm whitespace-nowrap">{{ approver.profileId }}</td>
                <td class="py-3 px-6 text-sm whitespace-nowrap">{{ approver.employeeId }}</td>
                <td class="py-3 px-6 text-sm whitespace-nowrap">{{ approver.employeeName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header bg-white flex justify-between items-center">
        <div class="flex items-center gap-2">
          <button
            @click="toggleNotificationsTable"
            class="w-6 h-6 bg-gray-300 rounded flex items-center justify-center hover:bg-blue-200 transition-colors"
          >
            <ChevronDown
              :class="['w-4 h-4 text-gray-600 transition-transform', { 'rotate-180': !showNotificationsTable }]"
            />
          </button>
          <h3 class="card-title text-black-700">{{ approveProfileId }} - List of email notification</h3>
        </div>
        <button
          v-show="showNotificationsTable"
          class="flex items-center gap-2 bg-blue-500 text-white text-sm font-medium rounded h-10 px-3 hover:bg-blue-700 transition-colors"
          @click="$emit('add-notification')"
        >
          <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-400">
            <Plus class="w-2.5 h-2.5 text-white" />
          </div>
          Add New Notif Receiver
        </button>
      </div>
      <div v-show="showNotificationsTable" class="card-body p-0">
        <div class="overflow-hidden rounded-b-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-white">
              <tr>
                <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap text-gray-600">Approve Profile ID</th>
                <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap text-gray-600">Profile ID</th>
                <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap text-gray-600">Employee ID</th>
                <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap text-gray-600">Employee Name</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(notification, index) in emailNotifications" :key="index" class="hover:bg-gray-50">
                <td class="py-3 px-6 text-sm whitespace-nowrap">{{ notification.approveProfileId }}</td>
                <td class="py-3 px-6 text-sm whitespace-nowrap">{{ notification.profileId }}</td>
                <td class="py-3 px-6 text-sm whitespace-nowrap">{{ notification.employeeId }}</td>
                <td class="py-3 px-6 text-sm whitespace-nowrap">{{ notification.employeeName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card card-actions">
      <div class="flex justify-between items-center">
        <button type="button" class="btn btn-outline-blue" @click="$emit('cancel')">
          <i class="ki-duotone ki-cross-circle text-[#3699FF]"></i>
          <span>Cancel</span>
        </button>

        <div class="flex gap-3">
          <button
            type="button"
            class="flex items-center gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-sm font-medium rounded h-10 px-4 hover:bg-blue-100"
            @click="$emit('back')"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-2 bg-blue-500 text-white text-sm font-medium rounded h-10 px-4 hover:bg-blue-700"
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            <Save class="w-5 h-5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { Save, ChevronDown, Plus, ArrowLeft } from 'lucide-vue-next'

export default defineComponent({
  name: 'AddNewTable',
  components: { Save, ChevronDown, Plus, ArrowLeft },
  props: {
    profileGroupName: { type: String as () => string, required: false },
    approveProfileId: { type: String as () => string, required: false },
    profileSteps: { type: Array as object as PropType<Array<{ step: string; category: string; bracketAmount: string; stepName: string; profileId: string; profileName: string; approveProfileId: string }>>, required: false }
  },
  emits: ['add-approver', 'add-notification', 'cancel', 'back', 'save'],
  setup(_, { emit }) {
    const isFormValid = ref(true)
    const showApproversTable = ref(true)
    const showNotificationsTable = ref(true)

    // Toggle
    const toggleApproversTable = () => {
      showApproversTable.value = !showApproversTable.value
    }
    const toggleNotificationsTable = () => {
      showNotificationsTable.value = !showNotificationsTable.value
    }

    // Submit
    const handleSubmit = () => {
      if (isFormValid.value) {
        // Kirimkan data yang disimpan agar parent dapat menangani penyimpanan tabel
        emit('save')
      }
    }

    // Sample data
    const approvers = ref([
      { approveProfileId: 'AG001', profileId: '62001', employeeId: '001', employeeName: 'Andra Wijaya' },
      { approveProfileId: 'AG001', profileId: '62001', employeeId: '001', employeeName: 'Andre Alma' },
      { approveProfileId: 'AG001', profileId: '62001', employeeId: '001', employeeName: 'Susi Winda' }
    ])

    const emailNotifications = ref([
      { approveProfileId: 'AG001', profileId: '62001', employeeId: '001', employeeName: 'Andra Wijaya' },
      { approveProfileId: 'AG001', profileId: '62001', employeeId: '001', employeeName: 'Andre Alma' },
      { approveProfileId: 'AG001', profileId: '62001', employeeId: '001', employeeName: 'Susi Winda' }
    ])

    return {
      isFormValid,
      showApproversTable,
      showNotificationsTable,
      toggleApproversTable,
      toggleNotificationsTable,
      handleSubmit,
      approvers,
      emailNotifications,
      Save,
      ChevronDown,
      Plus,
      ArrowLeft,
    }
  }
})
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.card-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid #ffffff;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.card-actions {
  border-color: #ffffff;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-outline-blue {
  background-color: transparent;
  border: 1px solid #3699FF;
  color: #2893fd;
  height: 2.5rem;
}

.btn-outline-blue:hover {
  background-color: rgba(54, 153, 255, 0.1);
}

.ki-duotone {
  margin-right: 0.5rem;
}
</style>
