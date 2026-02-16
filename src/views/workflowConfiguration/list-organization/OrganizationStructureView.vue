<template>
  <div>
    <BreadcrumbView
      title="Organization Structure"
      :routes="[
        { name: 'Workflow Configuration', to: '/workflow-list' },
        { name: 'List Organization', to: '/list-organization' },
        { name: 'Organization Structure', to: '#' },
      ]"
    />
    <div class="card">
      <div class="card-header border-b border-gray-200 p-4">
        <h2 class="text-lg font-bold text-slate-800">Organization Header</h2>
      </div>

      <div class="card-body p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Left Column: Hierarchy -->
          <div class="space-y-6">
            <h3 class="font-semibold text-gray-900 border-b pb-2 mb-4">Structure Definition</h3>

            <!-- Company Code -->
            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-semibold text-gray-600">Company Code</label>
              <div class="col-span-8 flex items-center gap-2">
                <div
                  class="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-50 text-gray-800 font-medium"
                >
                  {{ companyCode }}
                </div>
                <!-- Add Button -->
                <UiButton
                  class="w-[160px] flex items-center pl-4 gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-xs font-medium rounded h-10 px-3 hover:bg-blue-100 flex-shrink-0"
                  @click="addHierarchy('Company Code')"
                >
                  <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-100">
                    <UiIcon name="plus" class="text-blue-600" size="xs" />
                  </div>
                  Add New
                </UiButton>
              </div>
            </div>

            <!-- Hierarchy Levels -->
            <div
              v-for="level in ['Directorate', 'Division', 'Department', 'Section']"
              :key="level"
              class="grid grid-cols-12 gap-4 items-center"
            >
              <label class="col-span-4 text-sm font-semibold text-gray-600">{{ level }}</label>
              <div class="col-span-8 flex items-center gap-2">
                <!-- Field for the value -->
                <div
                  class="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-50 text-gray-400 font-medium italic"
                >
                  Not Assigned
                </div>
                <!-- Add Button -->
                <UiButton
                  class="w-[160px] flex items-center pl-4 gap-2 bg-primary-light border border-primary-clarity text-primary text-xs font-medium rounded h-10 px-3 hover:bg-teal-50 flex-shrink-0"
                  @click="addHierarchy('1')"
                >
                  <div class="w-4 h-4 flex items-center justify-center rounded-full bg-teal-100">
                    <UiIcon name="plus" class="text-primary" size="xs" />
                  </div>
                  Add New
                </UiButton>
              </div>
            </div>

            <!-- Organization Unit Matrix Link/Section -->
            <div class="pt-4 mt-6 border-t border-gray-100">
              <div class="flex justify-between items-center">
                <h4 class="font-semibold text-gray-700">Organization Unit Matrix</h4>
                <UiButton variant="light" size="sm">View Matrix</UiButton>
              </div>
            </div>
          </div>

          <!-- Right Column: Status & Info -->
          <div class="space-y-6">
            <h3 class="font-semibold text-gray-900 border-b pb-2 mb-4">Replication Status</h3>

            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-semibold text-gray-600"
                >ERP/HRIS Data Synch</label
              >
              <div class="col-span-8">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  Active
                </span>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4 items-center">
              <label class="col-span-4 text-sm font-semibold text-gray-600">Last Synch</label>
              <div class="col-span-8">
                <div class="text-sm text-gray-800 font-medium">10.10.2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Auth Modal -->
    <AddAuthModal v-if="showAuthModal" @close="showAuthModal = false" @submit="handleAuthSubmit" />

    <!-- Add Company Code Modal -->
    <AddCompanyCodeModal
      v-if="showCompanyModal"
      @close="showCompanyModal = false"
      @submit="handleCompanySubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import AddAuthModal from '@/views/workflowConfiguration/PopUpButtonAdd/AddAuthModal.vue'
import AddCompanyCodeModal from '@/views/workflowConfiguration/PopUpButtonAdd/AddCompanyCodeModal.vue'

const route = useRoute()
const companyCode = ref('MF00') // Mock initial value
const showAuthModal = ref(false)
const showCompanyModal = ref(false)

onMounted(() => {
  if (route.params.code) {
    companyCode.value = route.params.code as string
  }
})

const addHierarchy = (level: string) => {
  if (level === 'Company Code') {
    showCompanyModal.value = true
  } else {
    // In a real app, we might pass the level to the modal
    console.log('Adding hierarchy for level:', level)
    showAuthModal.value = true
  }
}

const handleAuthSubmit = (data: unknown) => {
  console.log('Auth Data Submitted:', data)
  // Handle submission (e.g., API call)
  showAuthModal.value = false
}

const handleCompanySubmit = (data: unknown) => {
  console.log('Company Data Submitted:', data)
  showCompanyModal.value = false
}
</script>

<style scoped>
/* Reuse card styles if global, otherwise define basic ones */
</style>
