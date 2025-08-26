<template>
  <section id="wf-step" class="mt-6 mb-12">
    <div class="card border border-gray-200 rounded-xl bg-white">
      <div class="card-header flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <h3 class="card-title text-gray-900 font-medium">
            PG001 - WF Profile Group and Step
          </h3>
        </div>
      </div>

      <div class="card-body p-0">
        <div v-show="showTable" class="px-4 py-4">
          <div ref="tableWrapper" class="table-wrapper overflow-x-auto">
            <table
              class="min-w-[1800px] w-full border-collapse"
              aria-label="Workflow profile table"
            >
              <thead>
                <tr class="bg-gray-50">
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Step</th>
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Category</th>
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Bracket Amount</th>
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Step Name</th>
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Profile ID</th>
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Profile Name</th>
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Approve Group ID</th>
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Notification Group ID</th>
                  <th class="py-4 px-6 text-sm font-medium text-left whitespace-nowrap">Remarks</th>
                </tr>
              </thead>

              <tbody>
                <template v-if="!isDataEmpty">
                  <tr
                    v-for="(row, idx) in workflowData"
                    :key="idx"
                    class="hover:bg-gray-50 border-b"
                  >
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.step }}</td>
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.category }}</td>
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.bracketAmount }}</td>
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.stepName }}</td>
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.profileId }}</td>
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.profileName }}</td>
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.approverGroupId }}</td>
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.notificationGroupId }}</td>
                    <td class="py-3 px-6 text-sm whitespace-nowrap">{{ row.remarks }}</td>
                  </tr>
                </template>

                <tr v-else>
                  <td colspan="9" class="text-center py-16">
                    <div class="text-gray-500 text-sm">
                      Data will display after generate WF Step
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            ref="customScrollbar"
            class="custom-scrollbar mt-3 overflow-x-auto"
          >
            <div :style="{ width: tableScrollWidth + 'px', height: '1px' }"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'

import type { WorkflowProfileTableRow } from '@/components/workflowConfigTable/types/WorkflowTable'

export default defineComponent({
  name: 'WorkflowProfileTable',
  setup() {
    const isDataEmpty = ref(false)
    const tableWrapper = ref<HTMLDivElement | null>(null)
    const customScrollbar = ref<HTMLDivElement | null>(null)
    const tableScrollWidth = ref(1200)
    const showTable = ref(true)

    const workflowData = ref<WorkflowProfileTableRow[]>([
      {
        step: 1,
        category: 'V',
        bracketAmount: 'B1',
        stepName: 'Invoice Verification 1',
        profileId: '3002',
        profileName: 'Finance AP Officer',
        approverGroupId: 'AG001',
        notificationGroupId: 'NG001',
        remarks: '-'
      },
      {
        step: 2,
        category: 'A',
        bracketAmount: 'B2',
        stepName: 'Approval Manager',
        profileId: '3003',
        profileName: 'Finance Manager',
        approverGroupId: 'AG002',
        notificationGroupId: 'NG002',
        remarks: '-'
      },
      {
        step: 3,
        category: 'A',
        bracketAmount: 'B3',
        stepName: 'Approval Director',
        profileId: '3004',
        profileName: 'Finance Director',
        approverGroupId: 'AG003',
        notificationGroupId: 'NG003',
        remarks: '-'
      }
    ])

    onMounted(async () => {
      await nextTick()
      if (tableWrapper.value && customScrollbar.value) {
        tableScrollWidth.value = tableWrapper.value.scrollWidth

        // sync scroll
        tableWrapper.value.addEventListener('scroll', () => {
          customScrollbar.value!.scrollLeft = tableWrapper.value!.scrollLeft
        })
        customScrollbar.value.addEventListener('scroll', () => {
          tableWrapper.value!.scrollLeft = customScrollbar.value!.scrollLeft
        })
      }
    })

    return {
      isDataEmpty,
      tableWrapper,
      customScrollbar,
      tableScrollWidth,
      workflowData,
      showTable,
      toggleTable: () => { showTable.value = !showTable.value }
    }
  }
})
</script>

<style scoped>
.table-wrapper {
  position: relative;
  margin: auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.custom-scrollbar {
  height: 16px;
  border-radius: 5px;
  background-color: #ffffff;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e8e9ef;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

.table-wrapper::-webkit-scrollbar {
  display: none;
}
.table-wrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
