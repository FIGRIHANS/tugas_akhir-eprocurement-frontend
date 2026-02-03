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
            <table class="min-w-[1800px] w-full border-collapse" aria-label="Workflow profile table">
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
                  <tr v-for="(row, idx) in workflowData" :key="idx" class="hover:bg-gray-50 border-b">
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

        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, toRefs } from 'vue'
import type { PropType } from 'vue'

type WorkflowRow = {
  step: string | number
  category: string
  bracketAmount: string
  stepName: string
  profileId: string
  profileName: string
  approverGroupId: string
  notificationGroupId: string
  poType: string
  dpOption: string
  remarks: string
}

const props = defineProps({
  isDataEmpty: {
    type: Boolean,
    default: true,
  },
  workflowData: {
    type: Array as PropType<WorkflowRow[]>,
    default: () => [],
  },
})

const { isDataEmpty, workflowData } = toRefs(props)
const tableWrapper = ref<HTMLDivElement | null>(null)
const tableScrollWidth = ref(1200)
const showTable = ref(true)

onMounted(async () => {
  await nextTick()
  if (tableWrapper.value) {
    tableScrollWidth.value = tableWrapper.value.scrollWidth
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

.table-wrapper::-webkit-scrollbar {
  height: 10px;
}

.table-wrapper {
  scrollbar-width: thin;
  scrollbar-color: #e8e9ef #ffffff;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #e8e9ef;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
