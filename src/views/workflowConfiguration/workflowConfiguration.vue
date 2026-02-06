<template>
  <BreadcrumbView :routes="[
    { name: 'Workflow Configuration', to: '/workflow-configuration' },
    { name: isReadOnly ? 'View Workflow' : 'Add New Workflow', to: '#' }
  ]" :title="isReadOnly ? 'View Workflow' : 'Add New Workflow'" />

  <!-- Back button removed from top; moved below PG001 card -->

  <!-- WF Header Configuration -->
  <!-- Table -->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">WF Header Configuration</h3>
    </div>

    <div class="card-body">
      <div class="grid grid-cols-2 gap-6">
        <!-- LEFT COLUMN -->
        <div class="flex flex-col gap-1">
          <!-- Company Code -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Company Code <span class="text-red-500">*</span>
              </label>
              <UiSelect v-model="wfHeader.companyCode" placeholder="Select" row valueKey="code" textKey="name" required
                :options="companyCodeList" :disabled="isReadOnly" class="flex-1 max-w-[400px]" />
            </div>
          </div>

          <!-- Invoice Type -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Invoice Type <span class="text-red-500">*</span>
              </label>
              <UiSelect v-model="wfHeader.invoiceType" placeholder="Select" row valueKey="code" textKey="name" required
                :options="invoiceTypeList" :disabled="isReadOnly" class="flex-1 max-w-[400px]" />
            </div>
          </div>

          <!-- Po Type -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                PO Type <span class="text-red-500">*</span>
              </label>
              <UiSelect v-model="wfHeader.poType" placeholder="Select" row valueKey="code" textKey="name" required
                :options="poOptions" :disabled="isReadOnly" class="flex-1 max-w-[400px]" />
            </div>
          </div>

          <!-- DP Option (only visible for PO) -->
          <div v-if="wfHeader.poType === 'PO'" class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                DP Option <span class="text-red-500">*</span>
              </label>
              <UiSelect v-model="wfHeader.dpOption" placeholder="Select" row valueKey="code" textKey="name" required
                :options="dpOptionList" :disabled="isReadOnly" class="flex-1 max-w-[400px]" />
            </div>
          </div>

          <!-- WF Name -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                WF Name <span class="text-red-500">*</span>
              </label>
              <UiInput v-model="wfHeader.wfName" placeholder="" row required :disabled="isReadOnly"
                class="flex-1 max-w-[400px]" />
            </div>
          </div>

          <!-- WF Step -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                WF Step <span class="text-red-500">*</span>
              </label>
              <UiInput v-model="wfHeader.wfStep" type="number" placeholder="" row required :disabled="isReadOnly"
                class="flex-1 max-w-[400px]" />
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="flex flex-col gap-2">
          <!-- Bracket Amount -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Bracket Amount <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center gap-6 ml-4">
                <label class="flex items-center gap-2">
                  <UiRadio v-model="bracketAmount" name="bracketAmount" :value="'yes'" :disabled="isReadOnly" />
                  <span class="text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center gap-2">
                  <UiRadio v-model="bracketAmount" name="bracketAmount" :value="'no'" :disabled="isReadOnly" />
                  <span class="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Bracket Code -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Baracket Code <span class="text-red-500">*</span>
              </label>

              <div class="flex-1 max-w-[400px]">
                <div class="relative flex items-center border border-gray-300 rounded-md bg-white">
                  <div
                    class="flex items-center justify-center w-10 h-10 bg-gray-300 border-r border-gray-300 rounded-l-md overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"
                      style="width:20px;height:20px;display:block;">
                      <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                    </svg>
                  </div>
                  <input type="text" class="flex-1 h-10 px-3 text-sm border-0 bg-white focus:outline-none focus:ring-0"
                    placeholder="Bracket Code" :value="selectedBracket?.bracketCode ?? ''" readonly />
                </div>
              </div>

              <UiButton
                class="w-[160px] flex items-center pl-4 gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-xs font-medium rounded h-10 px-3 hover:bg-blue-100 flex-shrink-0"
                @click="showBracketModal = true">
                <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-100">
                  <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                Add Bracket Code
              </UiButton>
            </div>
          </div>

          <!-- WF Profile Group -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Profile Group Id <span class="text-red-500">*</span>
              </label>

              <div class="flex-1 max-w-[400px]">
                <div class="relative flex items-center border border-gray-300 rounded-md bg-white">
                  <div
                    class="flex items-center justify-center w-10 h-10 bg-gray-300 border-r border-gray-300 rounded-l-md overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"
                      style="width:20px;height:20px;display:block;">
                      <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                    </svg>
                  </div>
                  <input type="text" class="flex-1 h-10 px-3 text-sm border-0 bg-white focus:outline-none focus:ring-0"
                    placeholder="Search Profile Group Id" :value="selectedProfile?.profileGroupId ?? ''" readonly />
                </div>
              </div>

              <UiButton
                class="w-[160px] flex items-center pl-4 gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-xs font-medium rounded h-10 px-3 hover:bg-blue-100 flex-shrink-0"
                @click="showProfileModal = true">
                <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-100">
                  <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                Add Profile Group
              </UiButton>
            </div>
          </div>

          <!-- Auth Object ID -->
          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                AuthObject Group <span class="text-red-500">*</span>
              </label>

              <div class="flex-1 max-w-[400px]">
                <div class="relative flex items-center border border-gray-300 rounded-md bg-white">
                  <div
                    class="flex items-center justify-center w-10 h-10 bg-gray-300 border-r border-gray-300 rounded-l-md overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"
                      style="width:20px;height:20px;display:block;">
                      <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                    </svg>
                  </div>
                  <input type="text" class="flex-1 h-10 px-3 text-sm border-0 bg-white focus:outline-none focus:ring-0"
                    placeholder="Search AuthObject Group" />
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
                Add AuthObject Id
              </UiButton>
            </div>
          </div>



          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Notification Group <span class="text-red-500">*</span>
              </label>

              <div class="flex-1 max-w-[400px]">
                <UiInput v-model="wfHeader.notificationGroup" placeholder="Notification Group" row
                  :disabled="isReadOnly" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate button (restored under Auth Object ID) -->
      <div v-if="!isReadOnly" class="flex justify-end mt-6 pr-4">
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
    <WorkflowProfileTable :isDataEmpty="isDataEmpty" :workflowData="workflowData" />

    <!-- Add New Table Components -->
    <!-- <div v-for="(table, index) in tables" :key="index">
      <AddNewTable :profileGroupName="table.profileGroupName" :approveProfileId="table.approveProfileId"
        @add-approver="handleAddApprover" @add-notification="handleAddNotification" @cancel="() => handleCancel(index)"
        @back="() => handleBack(index)" @save="() => handleSave(index)" />
    </div> -->

    <!-- Table -->
    <WorkflowConfig :isDataEmpty="isDataEmpty" :data="workflowData" />
  </div>

  <!-- Back/Submit placeholder removed (will be rendered inside PG001 v-else) -->

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

  <!-- Persistent Back and Submit buttons (outside v-if/v-else, always visible) -->
  <div class="mt-6 flex justify-between items-center px-2">
    <UiButton
      class="bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg h-10 px-3 flex items-center gap-2 shadow-sm"
      @click="goBack">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M19 12H6" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      <span class="text-sm font-medium">Back</span>
    </UiButton>

    <UiButton v-if="!isReadOnly"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-12 px-5 shadow-lg flex items-center gap-2"
      @click="saveWorkflow">
      <span>Submit</span>
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M22 2L11 13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </UiButton>
  </div>

  <!-- Modals -->
  <AddBracketModal v-if="showBracketModal" @close="showBracketModal = false" @select="handleBracketSelect" />

  <AddProfileModal v-if="showProfileModal" @close="showProfileModal = false" @submit="handleProfileSubmit" />

  <AddAuthModal v-if="showAuthModal" @close="showAuthModal = false" @submit="handleAuthSubmit" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
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
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useWorkflowConfigurationStore } from '@/stores/workflow-configurantion/wokrflowConfiguration'
import router from '@/router'

// Interface for workflow data
interface Workflow {
  wfCode: string
  wfName: string
  companyCode: string
  invoiceType: string
  poType: string
  dpOption: string
  wfStep: string
  bracketAmount: string
  status: string
  lastChange: string
  workflow?: Array<{
    step: string
    category: string
    bracketAmount: string
    stepName: string
    profileId: string
    profileName: string
    approverGroupId: string
    notificationGroupId: string
    remarks: string
  }>
}

// API Store
const invoiceMasterApi = useInvoiceMasterDataStore()
const workflowStore = useWorkflowConfigurationStore()
const route = useRoute()

const selectedBracket = ref<BracketForm | null>(null)
const selectedProfile = ref<ProfileForm | null>(null)

// Mode: 'add', 'edit', or 'view'
const mode = ref<'add' | 'edit' | 'view'>('add')
const isReadOnly = ref(false)
const editingWfCode = ref<string | null>(null)

// Reactive state
const bracketAmount = ref<'yes' | 'no' | undefined>(undefined)
const showBracketModal = ref(false)
const showProfileModal = ref(false)
const showAuthModal = ref(false)
const isGenerated = ref(false)

// Header form values for saving dummy workflow
const wfHeader = ref({
  wfCode: '',
  bracketCode: '', // ⬅️ tambahkan ini
  companyCode: '',
  invoiceType: '',
  poType: '',
  dpOption: '',
  wfName: '',
  wfStep: '',
  notificationGroup: '',
})

// Interface for table data
const isDataEmpty = ref(true)
const workflowData = ref<
  Array<{
    step: string | number
    category: string
    bracketAmount: string
    stepName: string
    profileId: string
    profileName: string
    approverGroupId: string
    notificationGroupId: string
    remarks: string
  }>
>([])

// Computed properties from store
const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const dpOptionList = computed(() => invoiceMasterApi.dpType)

// Invoice Type options (static)
const invoiceTypeList = computed(() => [
  { name: 'Invoice PO', code: 'Invoice PO' },
  { name: 'Invoice Non PO', code: 'Invoice Non PO' },
])

// PO Type options dependent on selected invoice type
const poOptions = computed(() => {
  let options: Array<{ name: string; code: string }> = []
  const t = wfHeader.value.invoiceType
  if (t === 'Invoice PO') {
    options = [
      { name: 'PO', code: 'PO' },
      { name: 'PO-PIB', code: 'PO-PIB' },
      { name: 'PO-CC', code: 'PO-CC' },
    ]
  }
  if (t === 'Invoice Non PO') {
    options = [
      { name: 'Reimbursement', code: 'Reimbursement' },
      { name: 'Credit Card', code: 'Credit Card' },
      { name: 'CAS', code: 'CAS' },
      { name: 'CAS Realization', code: 'CAS Realization' },
      { name: 'Petty Cash', code: 'Petty Cash' },
    ]
  }
  if (wfHeader.value.poType && !options.some((item) => item.code === wfHeader.value.poType)) {
    options = [...options, { name: wfHeader.value.poType, code: wfHeader.value.poType }]
  }
  return options
})

// Submit handlers for modals
const handleBracketSelect = (bracket: BracketForm) => {
  selectedBracket.value = bracket

  // isi ke header workflow
  wfHeader.value.wfCode = bracket.bracketCode

  // optional: auto-set bracketAmount
  if (!bracketAmount.value) {
    bracketAmount.value = 'yes'
  }

  showBracketModal.value = false
}

const handleProfileSubmit = (formData: ProfileForm) => {
  selectedProfile.value = formData
  isDataEmpty.value = false
  showProfileModal.value = false
}

const handleAuthSubmit = (formData: AuthForm) => {
  showAuthModal.value = false
}

// Handlers for AddNewTable actions
const handleGenerateWFStep = () => {
  if (bracketAmount.value === 'yes' && !selectedBracket.value) {
    alert('Please select Bracket Code first')
    return
  }

  workflowData.value = [
    {
      step: wfHeader.value.wfStep || selectedProfile.value?.step || '1',
      category: selectedProfile.value?.category || '-',
      bracketAmount: selectedBracket.value?.bracketCode || '-',
      stepName: wfHeader.value.wfStep || '-',
      profileId: selectedProfile.value?.profileId || '-',
      profileName: selectedProfile.value?.profileName || '-',
      approverGroupId: selectedProfile.value?.approverGroupId || '-',
      notificationGroupId: wfHeader.value.notificationGroup || '-',
      poType: wfHeader.value.poType || '-',
      dpOption: wfHeader.value.poType === 'PO' ? wfHeader.value.dpOption || '-' : '-',
      remarks: '-',
    },
  ]
  isDataEmpty.value = false
  isGenerated.value = true
}

const saveWorkflow = () => {
  const resolvedPoType = wfHeader.value.poType || (poOptions.value?.[0]?.code ?? '')
  const resolvedDpOption =
    resolvedPoType === 'PO' ? wfHeader.value.dpOption || (dpOptionList.value?.[0]?.code ?? '') : '-'

  const resolvedBracketAmount =
    bracketAmount.value === 'yes'
      ? selectedBracket.value?.bracketCode || wfHeader.value.bracketCode || '-'
      : '-'

  const newItem: Workflow = {
    wfCode: editingWfCode.value || `WF${Date.now()}`,
    wfName: wfHeader.value.wfName || 'New Workflow',
    companyCode: wfHeader.value.companyCode || (companyCodeList.value[0]?.code ?? ''),
    invoiceType: wfHeader.value.invoiceType || (invoiceTypeList.value[0]?.code ?? ''),
    poType: resolvedPoType,
    dpOption: resolvedDpOption,
    wfStep: wfHeader.value.wfStep || '1',
    bracketAmount: resolvedBracketAmount,
    status: 'Active',
    lastChange: new Date().toLocaleString(),
    workflow: workflowData.value.map((row) => ({
      step: String(row.step),
      category: row.category,
      bracketAmount: row.bracketAmount,
      stepName: row.stepName,
      profileId: row.profileId,
      profileName: row.profileName,
      approverGroupId: row.approverGroupId,
      notificationGroupId: row.notificationGroupId,
      remarks: row.remarks,
    })),
  }

  if (mode.value === 'edit' && editingWfCode.value) {
    workflowStore.updateWorkflow(editingWfCode.value, newItem)
  } else {
    const added = workflowStore.addWorkflow(newItem)
    if (!added) {
      alert('WF Code sudah digunakan. Silakan gunakan kode lain.')
      return
    }
  }
  router.push({ name: 'workflow-list' })
}

const goBack = () => {
  router.push({ name: 'workflow-list' })
}

// Watcher: Clear DP Option when PO Type changes to non-PO
watch(() => wfHeader.value.poType, (newPoType) => {
  if (newPoType !== 'PO') {
    wfHeader.value.dpOption = ''
    bracketAmount.value = undefined
  }
})

// Initialize API data on component mount
onMounted(async () => {
  await invoiceMasterApi.getCompanyCode()
  await invoiceMasterApi.getInvoicePoType()
  await invoiceMasterApi.getDpTypes()

  // Check if editing or viewing existing workflow
  const wfCode = sessionStorage.getItem('wfCode') || ''
  const viewMode = sessionStorage.getItem('wfMode') || ''
  const detailParam = sessionStorage.getItem('wfDetail')
  let detailFromQuery: Workflow | null = null
  if (detailParam) {
    try {
      detailFromQuery = JSON.parse(detailParam) as Workflow
    } catch {
      detailFromQuery = null
    }
  }

  if (wfCode) {
    // Set mode based on query parameter
    if (viewMode === 'view') {
      mode.value = 'view'
      isReadOnly.value = true
    } else {
      mode.value = 'edit'
      isReadOnly.value = false
    }

    editingWfCode.value = wfCode

    const stored = localStorage.getItem('workflowDummyList')
    if (stored) {
      try {
        const list: Workflow[] = JSON.parse(stored)
        const workflow = list.find((item: Workflow) => item.wfCode === wfCode)
        const resolvedWorkflow = workflow || detailFromQuery
        if (resolvedWorkflow) {
          wfHeader.value.wfCode = resolvedWorkflow.wfCode
          wfHeader.value.wfName = resolvedWorkflow.wfName
          wfHeader.value.companyCode = resolvedWorkflow.companyCode
          wfHeader.value.invoiceType = resolvedWorkflow.invoiceType
          wfHeader.value.poType = resolvedWorkflow.poType
          wfHeader.value.dpOption = resolvedWorkflow.dpOption
          wfHeader.value.wfStep = resolvedWorkflow.wfStep
          bracketAmount.value = resolvedWorkflow.bracketAmount === 'Yes' ? 'yes' : 'no'
          // fill dummy selections based on list data (view/edit)
          const stepKey = resolvedWorkflow.wfStep || '1'
          const profileMap: Record<string, ProfileForm> = {
            '1': {
              profileGroupId: '3001',
              approverGroupId: 'AG01',
              profileName: 'Sr. Management',
              category: 'Verification',
              profileId: 'GR001',
              step: '1',
            },
            '2': {
              profileGroupId: '3002',
              approverGroupId: 'AG01',
              profileName: 'Sr. Management',
              category: 'Approval',
              profileId: 'GR002',
              step: '2',
            },
            '3': {
              profileGroupId: '3003',
              approverGroupId: 'AG01',
              profileName: 'Finance Team',
              category: 'Verification',
              profileId: 'GR003',
              step: '3',
            },
          }
          const bracketMap: Record<string, BracketForm> = {
            '1': {
              bracketCode: 'BR001',
              amountFrom: '0',
              companyCode: resolvedWorkflow.companyCode,
              amountTo: '10000000',
              bracketType: 'PO Amount',
              currency: 'IDR',
              level: '1',
            },
            '2': {
              bracketCode: 'BR002',
              amountFrom: '10000001',
              companyCode: resolvedWorkflow.companyCode,
              amountTo: '50000000',
              bracketType: 'PO Amount',
              currency: 'IDR',
              level: '2',
            },
            '3': {
              bracketCode: 'BR003',
              amountFrom: '50000001',
              companyCode: resolvedWorkflow.companyCode,
              amountTo: '100000000',
              bracketType: 'PO Amount',
              currency: 'IDR',
              level: '3',
            },
          }

          selectedProfile.value = profileMap[stepKey] || profileMap['1']
          selectedBracket.value = bracketMap[stepKey] || bracketMap['1']
          if (!wfHeader.value.notificationGroup) {
            wfHeader.value.notificationGroup = `NG-${resolvedWorkflow.wfCode}`
          }

          const profileRows = Object.values(profileMap).map((profileItem) => {
            const bracketItem = bracketMap[profileItem.step] || bracketMap['1']
            return {
              step: profileItem.step,
              category: profileItem.category || '-',
              bracketAmount: bracketItem.bracketCode,
              stepName: profileItem.profileName || '-',
              profileId: profileItem.profileId,
              profileName: profileItem.profileName,
              approverGroupId: profileItem.approverGroupId,
              notificationGroupId: wfHeader.value.notificationGroup || '-',
              poType: wfHeader.value.poType || '-',
              dpOption: wfHeader.value.poType === 'PO' ? wfHeader.value.dpOption || '-' : '-',
              remarks: '-',
            }
          })
          workflowData.value = profileRows
          isDataEmpty.value = false
          isGenerated.value = true
        }
      } catch {
        // ignore parse errors
      }
    }
    if (!stored && detailFromQuery) {
      wfHeader.value.wfCode = detailFromQuery.wfCode
      wfHeader.value.wfName = detailFromQuery.wfName
      wfHeader.value.companyCode = detailFromQuery.companyCode
      wfHeader.value.invoiceType = detailFromQuery.invoiceType
      wfHeader.value.poType = detailFromQuery.poType
      wfHeader.value.dpOption = detailFromQuery.dpOption
      wfHeader.value.wfStep = detailFromQuery.wfStep
      bracketAmount.value = detailFromQuery.bracketAmount === 'Yes' ? 'yes' : 'no'
    }
  }
})
</script>
