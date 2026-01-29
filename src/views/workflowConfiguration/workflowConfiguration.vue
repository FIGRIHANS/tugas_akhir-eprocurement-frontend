<template>
  <BreadcrumbView :routes="[
    { name: 'Workflow Configuration', to: '/workflow-configuration' },
    { name: 'Add New Workflow', to: '#' }
  ]" title="Add New Workflow" />

  <!-- WF Header Configuration -->
  <!-- Table -->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">WF Header Configuration</h3>
    </div>

    <div class="card-body">
      <!-- Row 1 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Company Code -->
        <div class="p-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
              Company Code <span class="text-red-500">*</span>
            </label>
            <UiSelect placeholder="Select" row valueKey="value" textKey="text" required :options="companyCodes"
              class="flex-1 max-w-[400px]" />
          </div>
        </div>

        <!-- Bracket Amount -->
        <div class="p-4 flex items-center gap-3">
          <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
            Bracket Amount <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center gap-6 ml-4">
            <label class="flex items-center gap-2">
              <UiRadio v-model="bracketAmount" name="bracketAmount" :value="'yes'" />
              <span class="text-sm text-gray-700">Yes</span>
            </label>
            <label class="flex items-center gap-2">
              <UiRadio v-model="bracketAmount" name="bracketAmount" :value="'no'" />
              <span class="text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Process Type -->
        <div class="p-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
              Process Type <span class="text-red-500">*</span>
            </label>
            <UiSelect placeholder="Select" row valueKey="value" textKey="text" required :options="companyCodes"
              class="flex-1 max-w-[400px]" />
          </div>
        </div>

        <!-- Bracket Code -->
        <div class="p-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
              Bracket Code <span class="text-red-500">*</span>
            </label>

            <!-- SEARCH BOX - responsive width -->
            <div class="flex-1 max-w-[400px]">
              <div class="relative flex items-center border border-gray-300 rounded-md bg-white">
                <!-- Icon box -->
                <div
                  class="flex items-center justify-center w-10 h-10 bg-gray-300 border-r border-gray-300 rounded-l-md overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"
                    style="width:20px;height:20px;display:block;">
                    <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                  </svg>
                </div>
                <input type="text" class="flex-1 h-10 px-3 text-sm border-0 bg-white focus:outline-none focus:ring-0"
                  placeholder="Search Bracket Code" />
              </div>
            </div>

            <!-- Button Add New - fixed width -->
            <UiButton
              class="w-[160px] flex items-center pl-4 gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-xs font-medium rounded h-10 px-3 hover:bg-blue-100 flex-shrink-0"
              @click="showBracketModal = true">
              <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-100">
                <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              Add New Bracket
            </UiButton>
          </div>
        </div>
      </div>

      <!-- Row 3 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- WF Name -->
        <div class="p-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
              WF Name <span class="text-red-500">*</span>
            </label>
            <UiInput placeholder="" row required class="flex-1 max-w-[400px]" />
          </div>
        </div>

        <!-- WF Profile Group -->
        <div class="p-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
              WF Profile Group <span class="text-red-500">*</span>
            </label>

            <!-- SEARCH BOX - responsive width -->
            <div class="flex-1 max-w-[400px]">
              <div class="relative flex items-center border border-gray-300 rounded-md bg-white">
                <!-- Icon box -->
                <div
                  class="flex items-center justify-center w-10 h-10 bg-gray-300 border-r border-gray-300 rounded-l-md overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"
                    style="width:20px;height:20px;display:block;">
                    <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                  </svg>
                </div>
                <input type="text" class="flex-1 h-10 px-3 text-sm border-0 bg-white focus:outline-none focus:ring-0"
                  placeholder="Search WF Profile" />
              </div>
            </div>

            <!-- Button Add New - fixed width -->
            <UiButton
              class="w-[160px] flex items-center pl-4 gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-xs font-medium rounded h-10 px-3 hover:bg-blue-100 flex-shrink-0"
              @click="showProfileModal = true">
              <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-100">
                <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              Add New Profile
            </UiButton>
          </div>
        </div>
      </div>

      <!-- Row 4 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- WF Step -->
        <div class="p-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
              WF Step <span class="text-red-500">*</span>
            </label>
            <UiInput type="number" placeholder="" row required class="flex-1 max-w-[400px]" />
          </div>
        </div>

        <!-- Auth Object ID -->
        <div class="p-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
              Auth Object ID <span class="text-red-500">*</span>
            </label>

            <!-- SEARCH BOX - responsive width -->
            <div class="flex-1 max-w-[400px]">
              <div class="relative flex items-center border border-gray-300 rounded-md bg-white">
                <!-- Icon box -->
                <div
                  class="flex items-center justify-center w-10 h-10 bg-gray-300 border-r border-gray-300 rounded-l-md overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"
                    style="width:20px;height:20px;display:block;">
                    <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                  </svg>
                </div>
                <input type="text" class="flex-1 h-10 px-3 text-sm border-0 bg-white focus:outline-none focus:ring-0"
                  placeholder="Search Auth Object" />
              </div>
            </div>

            <UiButton
              class="w-[160px] flex items-center pl-4 gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-xs font-medium rounded h-10 px-3 hover:bg-blue-100 flex-shrink-0"
              @click="showAuthModal = true">
              <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-100">
                <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              Add New Auth
            </UiButton>
          </div>
        </div>
      </div>

      <!-- Generate -->
      <div class="flex justify-end mt-6 pr-4">
        <UiButton
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded h-12 px-5 shadow-sm flex items-center gap-2"
          @click="handleGenerateWFStep">
          <span>Generate WF Step</span>
          <UiIcon name="arrows-circle" variant="duotone" class="w-4 h-1" />
        </UiButton>
      </div>
    </div>
  </div>

  <!-- Render kondisional berdasarkan apakah tombol “Generate WF Step” telah diklik -->
  <div v-if="isGenerated">
    <WorkflowProfileTable />

    <!-- Add New Table Components -->
    <div v-for="(table, index) in tables" :key="index">
      <AddNewTable :profileGroupName="table.profileGroupName" :approveProfileId="table.approveProfileId"
        @add-approver="handleAddApprover" @add-notification="handleAddNotification" @cancel="() => handleCancel(index)"
        @back="() => handleBack(index)" @save="() => handleSave(index)" />
    </div>

    <!-- Table -->
    <WorkflowConfig :isDataEmpty="isDataEmpty" :data="workflowData" />
  </div>

  <!-- Display when Generate WF Step hasn't been clicked -->
  <div v-else class="mt-6">
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bracket Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approve</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td colspan="7" class="px-6 py-6 text-center font-mediumt text-gray-500">
                Data will display after generate WF Step
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <AddBracketModal v-if="showBracketModal" @close="showBracketModal = false" @submit="handleBracketSubmit" />

  <AddProfileModal v-if="showProfileModal" @close="showProfileModal = false" @submit="handleProfileSubmit" />

  <AddAuthModal v-if="showAuthModal" @close="showAuthModal = false" @submit="handleAuthSubmit" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BracketForm, AuthForm, ProfileForm } from '@/views/workflowConfiguration/types/Workflow'
import AddBracketModal from '@/views/workflowConfiguration/PopUpButtonAdd/AddBracketModal.vue'
import AddProfileModal from '@/views/workflowConfiguration/PopUpButtonAdd/AddProfileModal.vue'
import AddAuthModal from '@/views/workflowConfiguration/PopUpButtonAdd/AddAuthModal.vue'

import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiRadio from '@/components/ui/atoms/radio/UiRadio.vue'
import WorkflowProfileTable from '@/components/workflowConfigTable/WorkflowProfileTable.vue'
import AddNewTable from '@/components/workflowConfigTable/AddNewTable.vue'

// Reactive state
const bracketAmount = ref<'yes' | 'no' | undefined>(undefined)
const showBracketModal = ref(false)
const showProfileModal = ref(false)
const showAuthModal = ref(false)
const isGenerated = ref(false)

// Interface for table data
interface TableData {
  type: 'bracket' | 'profile' | 'auth'
  profileGroupName: string
  approveProfileId: string
  bracketData?: BracketForm
  profileData?: ProfileForm
  authData?: AuthForm
  steps: Array<{
    step: string
    category: string
    bracketAmount: string
    stepName: string
    profileId: string
    profileName: string
    approveProfileId: string
  }>
  approvers: Array<{
    approveProfileId: string
    profileId: string
    employeeId: string
    employeeName: string
  }>
  notifications: Array<{
    approveProfileId: string
    profileId: string
    employeeId: string
    employeeName: string
  }>
}

// State for tables
const tables = ref<TableData[]>([])
const companyCodes = ref([{ text: 'AX756', value: '1' }])
const isDataEmpty = ref(true)
const workflowData = ref([])

// Submit handlers for modals
const handleBracketSubmit = (formData: BracketForm) => {
  tables.value.push({
    type: 'bracket',
    profileGroupName: `Bracket ${formData.bracketCode}`,
    approveProfileId: formData.bracketCode,
    bracketData: formData,
    steps: [
      {
        step: '1',
        category: 'B',
        bracketAmount: formData.bracketCode,
        stepName: `Bracket ${formData.level}`,
        profileId: formData.bracketCode,
        profileName: `Amount ${formData.amountFrom} - ${formData.amountTo}`,
        approveProfileId: formData.bracketCode
      }
    ],
    approvers: [],
    notifications: []
  })
  showBracketModal.value = false
}

const handleProfileSubmit = (formData: ProfileForm) => {
  tables.value.push({
    type: 'profile',
    profileGroupName: formData.profileGroupId,
    approveProfileId: formData.approverGroupId,
    profileData: formData,
    steps: [
      {
        step: formData.step,
        category: formData.category,
        bracketAmount: formData.profileId,
        stepName: formData.profileName,
        profileId: formData.profileId,
        profileName: formData.profileName,
        approveProfileId: formData.approverGroupId
      }
    ],
    approvers: [],
    notifications: []
  })
  isDataEmpty.value = false
  showProfileModal.value = false
}

const handleAuthSubmit = (formData: AuthForm) => {
  tables.value.push({
    type: 'auth',
    profileGroupName: formData.authObjectGroup,
    approveProfileId: formData.authObjectCode,
    authData: formData,
    steps: [
      {
        step: '1',
        category: 'A',
        bracketAmount: formData.authObjectCode,
        stepName: formData.authObjectName,
        profileId: formData.authObjectCode,
        profileName: formData.authObjectName,
        approveProfileId: formData.authObjectGroup
      }
    ],
    approvers: [],
    notifications: []
  })
  showAuthModal.value = false
}

// Handlers for AddNewTable actions
const handleGenerateWFStep = () => {
  isGenerated.value = true
}

const handleAddApprover = () => {
}

const handleAddNotification = () => {
}

const handleCancel = (index: number) => {
  tables.value.splice(index, 1)
}

const handleBack = (index: number) => {
  tables.value.splice(index, 1)
}

const handleSave = (index: number) => {
  const tableData = tables.value[index]
  // implementasi save logic
  console.log('Saving table data:', tableData)
}
</script>
