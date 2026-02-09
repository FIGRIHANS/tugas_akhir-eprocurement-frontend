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
          <!-- <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                WF Step <span class="text-red-500">*</span>
              </label>
              <UiInput v-model="wfHeader.wfStep" type="number" placeholder="" row required :disabled="isReadOnly"
                class="flex-1 max-w-[400px]" />
            </div>
          </div> -->
        </div>

        <!-- RIGHT COLUMN -->
        <div class="flex flex-col gap-2">

          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Organization Structure <span class="text-red-500">*</span>
              </label>

              <div class="flex-1 max-w-[400px]">
                <UiSelect v-model="wfHeader.organizationStructure" placeholder="Select" row valueKey="code"
                  textKey="name" required :options="organizationStructureList" :disabled="isReadOnly"
                  class="flex-1 max-w-[400px]" />
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Department <span class="text-red-500">*</span>
              </label>

              <div class="flex-1 max-w-[400px]">
                <UiSelect v-model="wfHeader.organizationStructure" placeholder="Select" row valueKey="code"
                  textKey="name" required :options="organizationStructureList" :disabled="isReadOnly"
                  class="flex-1 max-w-[400px]" />
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Cost Center <span class="text-red-500">*</span>
              </label>

              <div class="flex-1 max-w-[400px]">
                <UiSelect v-model="wfHeader.organizationStructure" placeholder="Select" row valueKey="code"
                  textKey="name" required :options="organizationStructureList" :disabled="isReadOnly"
                  class="flex-1 max-w-[400px]" />
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Requisioner <span class="text-red-500">*</span>
              </label>

              <div class="flex-1 max-w-[400px]">
                <UiSelect v-model="wfHeader.organizationStructure" placeholder="Select" row valueKey="code"
                  textKey="name" required :options="organizationStructureList" :disabled="isReadOnly"
                  class="flex-1 max-w-[400px]" />
              </div>
            </div>
          </div>

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
        </div>
      </div>

      <!-- Generate button (restored under Auth Object ID) -->
      <div v-if="!isReadOnly" class="flex justify-end mt-6 pr-4">
        <UiButton
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded h-12 px-5 shadow-sm flex items-center gap-2"
          @click="showAddWorkflowModal = true">
          <span>Add New Workflow List</span>
          <!-- <UiIcon name="plus" variant="duotone" class="w-4 h-1" /> -->
        </UiButton>
      </div>
    </div>
  </div>

  <div v-if="isGenerated">
    <WorkflowProfileTable :isDataEmpty="isDataEmpty" :workflowData="workflowData" @edit-row="openEditRowModal" />

    <!-- Table -->
    <!-- <WorkflowConfig :isDataEmpty="isDataEmpty" :data="workflowData" /> -->
  </div>

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
      class="bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white h-10 px-3 flex items-center gap-2 shadow-sm"
      @click="goBack">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M19 12H6" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      <span class="text-sm font-medium">Back</span>
    </UiButton>

    <UiButton v-if="!isReadOnly"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 px-5 shadow-lg flex items-center gap-2"
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

  <!-- <AddProfileModal v-if="showProfileModal" @close="showProfileModal = false" @submit="handleProfileSubmit" />

  <AddAuthModal v-if="showAuthModal" @close="showAuthModal = false" @submit="handleAuthSubmit" /> -->

  <!-- Add Workflow Modal -->
  <UiModal v-model="showAddWorkflowModal" size="md" hide-header hide-close>
    <div class="relative w-full max-w-2xl mx-auto">
      <div class="flex items-center justify-between px-4 py-3 border-b">
        <h3 class="text-sm font-semibold text-gray-700">Pop Up Button</h3>
        <button class="text-gray-400 hover:text-gray-600" @click="closeAddWorkflowModal">✕</button>
      </div>

      <div class="p-4 space-y-4">
        <div class="flex items-center gap-4">
          <label class="w-48 text-sm font-medium text-gray-700">Workflow Step</label>
          <UiInput v-model="addWorkflowStep" type="number" min="1" class="" />
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 px-4 py-3 border-t">
        <UiButton class="" @click="closeAddWorkflowModal">
          Cancel
        </UiButton>
        <UiButton class="" @click="generateWorkflowSteps">
          Generate Step
        </UiButton>
      </div>
    </div>
  </UiModal>

  <!-- Edit Row Modal -->
  <UiModal v-model="showEditRowModal" size="lg" title="Edit Workflow Step">
    <div v-if="editRowDraft" class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-xs text-gray-500">Step</label>
        <UiInput v-model="editRowDraft.step" type="text" class="h-9 w-full   px-2 text-sm" disabled />
      </div>
      <div>
        <label class="text-xs text-gray-500">Category</label>
        <UiInput v-model="editRowDraft.category" type="text" class="h-9 w-full   px-2 text-sm" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Bracket Amount</label>
        <UiInput v-model="editRowDraft.bracketAmount" type="text" class="h-9 w-full  px-2 text-sm" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Step Name</label>
        <UiInput v-model="editRowDraft.stepName" type="text" class="h-9 w-full   px-2 text-sm" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Profile ID</label>
        <UiInput v-model="editRowDraft.profileId" type="text" class="h-9 w-full brder  px-2 text-sm" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Profile Name</label>
        <UiInput v-model="editRowDraft.profileName" type="text" class="h-9 w-full   px-2 text-sm" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Approve Group ID</label>
        <UiInput v-model="editRowDraft.approverGroupId" type="text" class="h-9 w-full   px-2 text-sm" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Notification Group ID</label>
        <UiInput v-model="editRowDraft.notificationGroupId" type="text" class="h-9 w-full   px-2 text-sm" />
      </div>
      <div class="col-span-2">
        <label class="text-xs text-gray-500">Remarks</label>
        <UiInput v-model="editRowDraft.remarks" type="text" class="h-9 w-full px-2 text-sm" />
      </div>
    </div>

    <div class="flex items-center justify-end gap-2 border-t mt-4 pt-3">
      <UiButton class="btn btn-outline btn-light" @click="closeEditRowModal">
        Cancel
      </UiButton>
      <UiButton class="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700" @click="saveEditRow">
        Save
      </UiButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { BracketForm, AuthForm, ProfileForm } from '@/views/workflowConfiguration/types/Workflow'
import AddBracketModal from '@/views/workflowConfiguration/PopUpButtonAdd/AddBracketModal.vue'
// import AddProfileModal from '@/views/workflowConfiguration/PopUpButtonAdd/AddProfileModal.vue'
// import AddAuthModal from '@/views/workflowConfiguration/PopUpButtonAdd/AddAuthModal.vue'
import UiModal from '@/components/modal/UiModal.vue'

import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
// import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiRadio from '@/components/ui/atoms/radio/UiRadio.vue'
import WorkflowProfileTable from '@/components/workflowConfigTable/WorkflowProfileTable.vue'
import WorkflowConfig from '@/components/workflowConfigTable/WorkflowConfig.vue'
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
// const showProfileModal = ref(false)
// const showAuthModal = ref(false)
const isGenerated = ref(false)
const showAddWorkflowModal = ref(false)
const addWorkflowStep = ref('1')
const showEditRowModal = ref(false)
const editRowIndex = ref<number | null>(null)
const editRowDraft = ref<any>(null)

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
  organizationStructure: ''
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

const organizationStructureList = ref([
  { name: 'Directorate', code: 'Directorate' },
  { name: 'Division', code: 'Division' },
  { name: 'Department', code: 'Department' },
  { name: 'Section', code: 'Section' },
  { name: 'Project', code: 'Project' },
  { name: 'Business Unit', code: 'Business Unit' },
  { name: 'Shared Service', code: 'Shared Service' },
])

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


// const handleProfileSubmit = (formData: ProfileForm) => {
//   selectedProfile.value = formData
//   isDataEmpty.value = false
//   showProfileModal.value = false
// }

// const handleAuthSubmit = (formData: AuthForm) => {
//   showAuthModal.value = false
// }

const openEditRowModal = (index: number, row: any) => {
  editRowIndex.value = index
  editRowDraft.value = { ...row }
  showEditRowModal.value = true
}

const closeEditRowModal = () => {
  showEditRowModal.value = false
  editRowIndex.value = null
  editRowDraft.value = null
}

const saveEditRow = () => {
  if (editRowIndex.value === null || !editRowDraft.value) return
  workflowData.value[editRowIndex.value] = {
    ...workflowData.value[editRowIndex.value],
    ...editRowDraft.value,
  }
  closeEditRowModal()
}

const closeAddWorkflowModal = () => {
  showAddWorkflowModal.value = false
  addWorkflowStep.value = '1'
}

const generateWorkflowSteps = () => {
  const steps = Math.max(1, Number(addWorkflowStep.value || 1))
  if (Number.isFinite(steps)) {
    wfHeader.value.wfStep = String(steps)
  }
  if (!selectedBracket.value?.bracketCode) {
    alert('Please select Bracket Code first')
    return
  }
  const wfId = `WF${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const profileTemplates = [
    { category: 'Verification', stepName: 'Sr. Management', profileId: 'GR001', profileName: 'Sr. Management' },
    { category: 'Approval', stepName: 'Sr. Management', profileId: 'GR002', profileName: 'Sr. Management' },
    { category: 'Verification', stepName: 'Finance Team', profileId: 'GR003', profileName: 'Finance Team' },
  ]

  workflowData.value = Array.from({ length: steps }, (_, idx) => {
    const template = profileTemplates[idx % profileTemplates.length]
    return {
      step: String(idx + 1),
      category: template.category,
      bracketAmount: selectedBracket.value?.bracketCode || '-',
      stepName: template.stepName,
      profileId: template.profileId,
      profileName: template.profileName,
      approverGroupId: 'AG01',
      notificationGroupId: `NG-${wfId}`,
      poType: wfHeader.value.poType || '-',
      dpOption: wfHeader.value.poType === 'PO' ? wfHeader.value.dpOption || '-' : '-',
      remarks: '-',
    }
  })
  isDataEmpty.value = workflowData.value.length === 0
  isGenerated.value = workflowData.value.length > 0
  closeAddWorkflowModal()
}

// Handlers for AddNewTable actions

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
  console.log('masuk');

  await invoiceMasterApi.getCompanyCode()
  await invoiceMasterApi.getInvoicePoType()
  await invoiceMasterApi.getDpTypes()

  // Check if editing or viewing existing workflow
  const wfCode = String(route.params.id || '')
  const viewMode = String(route.query.mode || '')

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

    const resolvedWorkflow = workflowStore.getByCode(wfCode)
    if (resolvedWorkflow) {
      wfHeader.value.wfCode = resolvedWorkflow.wfCode
      wfHeader.value.wfName = resolvedWorkflow.wfName
      wfHeader.value.companyCode = resolvedWorkflow.companyCode
      wfHeader.value.invoiceType = resolvedWorkflow.invoiceType
      wfHeader.value.poType = resolvedWorkflow.poType
      wfHeader.value.dpOption = resolvedWorkflow.dpOption
      wfHeader.value.wfStep = resolvedWorkflow.wfStep
      bracketAmount.value = resolvedWorkflow.bracketAmount === 'Yes' ? 'yes' : 'no'

      const profileRows = resolvedWorkflow.workflow?.map((row) => ({
        step: row.step,
        category: row.category || '-',
        bracketAmount: row.bracketAmount,
        stepName: row.stepName || '-',
        profileId: row.profileId,
        profileName: row.profileName,
        approverGroupId: row.approverGroupId,
        notificationGroupId: row.notificationGroupId,
        poType: wfHeader.value.poType || '-',
        dpOption: wfHeader.value.poType === 'PO' ? wfHeader.value.dpOption || '-' : '-',
        remarks: row.remarks || '-',
      })) || []

      workflowData.value = profileRows
      isDataEmpty.value = workflowData.value.length === 0
      isGenerated.value = workflowData.value.length > 0
    }

  }
})
</script>
