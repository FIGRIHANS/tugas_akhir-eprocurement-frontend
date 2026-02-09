<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">PG001 - WF Profile Group and Step</h3>
    </div>
    <div class="card-body">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bracket Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approve Group ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notification Group ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isDataEmpty">
            <td colspan="9" class="px-6 py-6 text-center font-medium text-gray-500">
              Data will display after generate WF Step
            </td>
          </tr>
          <tr v-else v-for="(row, index) in data" :key="index">
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.step }}</td>
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.category }}</td>
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.bracketAmount }}</td>
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.stepName }}</td>
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.profileId }}</td>
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.profileName }}</td>
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.approverGroupId }}</td>
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.notificationGroupId }}</td>
            <td class="px-6 py-3 text-sm text-gray-700">{{ row.remarks }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
type WorkflowRow = {
  step: string | number
  category: string
  bracketAmount: string
  stepName: string
  profileId: string
  profileName: string
  approverGroupId: string
  notificationGroupId: string
  remarks: string
}

defineProps<{
  isDataEmpty: boolean
  data: WorkflowRow[]
}>()
</script>
