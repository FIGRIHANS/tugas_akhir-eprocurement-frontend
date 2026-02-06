import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface WorkflowItem {
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
  workflow: WorkflowStepRow[]
}

export interface WorkflowStepRow {
  step: string
  category: string
  bracketAmount: string
  stepName: string
  profileId: string
  profileName: string
  approverGroupId: string
  notificationGroupId: string
  remarks: string
}

const baseWorkflowSeed: WorkflowItem[] = [
  {
    wfCode: 'WF001',
    wfName: 'Sr. Management',
    companyCode: 'MF00',
    invoiceType: 'Invoice PO',
    poType: 'PO',
    dpOption: '9011',
    wfStep: '1',
    bracketAmount: 'BR001',
    status: 'Active',
    lastChange: '03/06/2025 11/10/15',
    workflow: [
      {
        step: '1',
        category: 'Verification',
        bracketAmount: 'BR001',
        stepName: 'Sr. Management',
        profileId: 'GR001',
        profileName: 'Sr. Management',
        approverGroupId: 'AG01',
        notificationGroupId: 'NG-WF001',
        remarks: '-',
      },
    ],
  },
  {
    wfCode: 'WF002',
    wfName: 'Finance Team',
    companyCode: 'MF00',
    invoiceType: 'Invoice Non PO',
    poType: 'Reimbursement',
    dpOption: '9012',
    wfStep: '2',
    bracketAmount: 'BR002',
    status: 'Active',
    lastChange: '03/06/2025 11/10/15',
    workflow: [
      {
        step: '2',
        category: 'Approval',
        bracketAmount: 'BR002',
        stepName: 'Sr. Management',
        profileId: 'GR002',
        profileName: 'Sr. Management',
        approverGroupId: 'AG01',
        notificationGroupId: 'NG-WF002',
        remarks: '-',
      },
    ],
  },
  {
    wfCode: 'WF003',
    wfName: 'Finance Team',
    companyCode: 'GNLA',
    invoiceType: 'Invoice PO',
    poType: 'PO-PIB',
    dpOption: '9013',
    wfStep: '3',
    bracketAmount: 'BR003',
    status: 'Active',
    lastChange: '03/06/2025 11/10/15',
    workflow: [
      {
        step: '3',
        category: 'Verification',
        bracketAmount: 'BR003',
        stepName: 'Finance Team',
        profileId: 'GR003',
        profileName: 'Finance Team',
        approverGroupId: 'AG01',
        notificationGroupId: 'NG-WF003',
        remarks: '-',
      },
    ],
  },
  {
    wfCode: 'WF004',
    wfName: 'Sr. Management',
    companyCode: 'GNLA',
    invoiceType: 'Invoice PO',
    poType: 'PO-CC',
    dpOption: '9011',
    wfStep: '1',
    bracketAmount: 'BR001',
    status: 'Active',
    lastChange: '03/06/2025 11/10/15',
    workflow: [
      {
        step: '1',
        category: 'Verification',
        bracketAmount: 'BR001',
        stepName: 'Sr. Management',
        profileId: 'GR001',
        profileName: 'Sr. Management',
        approverGroupId: 'AG01',
        notificationGroupId: 'NG-WF004',
        remarks: '-',
      },
    ],
  },
  {
    wfCode: 'WF005',
    wfName: 'Finance Team',
    companyCode: 'GNOA',
    invoiceType: 'Invoice PO',
    poType: 'PO',
    dpOption: '9012',
    wfStep: '2',
    bracketAmount: 'BR002',
    status: 'Active',
    lastChange: '03/06/2025 11/10/15',
    workflow: [
      {
        step: '2',
        category: 'Approval',
        bracketAmount: 'BR002',
        stepName: 'Finance Team',
        profileId: 'GR002',
        profileName: 'Finance Team',
        approverGroupId: 'AG01',
        notificationGroupId: 'NG-WF005',
        remarks: '-',
      },
    ],
  },
  {
    wfCode: 'WF006',
    wfName: 'Sr. Management',
    companyCode: 'GNOA',
    invoiceType: 'Invoice PO',
    poType: 'PO-PIB',
    dpOption: '9013',
    wfStep: '3',
    bracketAmount: 'BR003',
    status: 'Active',
    lastChange: '03/06/2025 11/10/15',
    workflow: [
      {
        step: '3',
        category: 'Verification',
        bracketAmount: 'BR003',
        stepName: 'Sr. Management',
        profileId: 'GR003',
        profileName: 'Sr. Management',
        approverGroupId: 'AG01',
        notificationGroupId: 'NG-WF006',
        remarks: '-',
      },
    ],
  },
  {
    wfCode: 'WF007',
    wfName: 'Finance Team',
    companyCode: 'GNOA',
    invoiceType: 'Invoice PO',
    poType: 'PO-CC',
    dpOption: '9011',
    wfStep: '1',
    bracketAmount: 'BR001',
    status: 'Active',
    lastChange: '03/06/2025 11/10/15',
    workflow: [
      {
        step: '1',
        category: 'Verification',
        bracketAmount: 'BR001',
        stepName: 'Finance Team',
        profileId: 'GR001',
        profileName: 'Finance Team',
        approverGroupId: 'AG01',
        notificationGroupId: 'NG-WF007',
        remarks: '-',
      },
    ],
  },
]

export const useWorkflowConfigurationStore = defineStore('workflowConfiguration', () => {
  const baseWorkflowList = ref<WorkflowItem[]>([...baseWorkflowSeed])
  const workflowList = ref<WorkflowItem[]>([...baseWorkflowSeed])
  const currentWorkflow = ref<WorkflowItem | null>(null)

  const setCurrentWorkflow = (item: WorkflowItem | null) => {
    currentWorkflow.value = item
  }

  const getByCode = (wfCode: string) =>
    workflowList.value.find((item) => item.wfCode === wfCode) || null

  const isWfCodeUnique = (wfCode: string) =>
    !workflowList.value.some((item) => item.wfCode === wfCode)

  const addWorkflow = (item: WorkflowItem) => {
    if (!isWfCodeUnique(item.wfCode)) return false
    workflowList.value.unshift(item)
    baseWorkflowList.value.unshift(item)
    return true
  }

  const updateWorkflow = (wfCode: string, item: WorkflowItem) => {
    const index = workflowList.value.findIndex((i) => i.wfCode === wfCode)
    if (index > -1) {
      workflowList.value[index] = item
      const baseIndex = baseWorkflowList.value.findIndex((i) => i.wfCode === wfCode)
      if (baseIndex > -1) {
        baseWorkflowList.value[baseIndex] = item
      }
      return true
    }
    return false
  }

  const addOrUpdate = (item: WorkflowItem) => {
    const index = workflowList.value.findIndex((i) => i.wfCode === item.wfCode)
    if (index > -1) {
      workflowList.value[index] = item
      const baseIndex = baseWorkflowList.value.findIndex((i) => i.wfCode === item.wfCode)
      if (baseIndex > -1) {
        baseWorkflowList.value[baseIndex] = item
      }
    } else {
      if (!isWfCodeUnique(item.wfCode)) return false
      workflowList.value.unshift(item)
      baseWorkflowList.value.unshift(item)
    }
    return true
  }

  const removeByCode = (wfCode: string) => {
    const index = workflowList.value.findIndex((i) => i.wfCode === wfCode)
    if (index > -1) {
      workflowList.value.splice(index, 1)
    }
    const baseIndex = baseWorkflowList.value.findIndex((i) => i.wfCode === wfCode)
    if (baseIndex > -1) {
      baseWorkflowList.value.splice(baseIndex, 1)
    }
  }

  return {
    baseWorkflowList,
    workflowList,
    currentWorkflow,
    setCurrentWorkflow,
    getByCode,
    isWfCodeUnique,
    addWorkflow,
    updateWorkflow,
    addOrUpdate,
    removeByCode,
  }
})
