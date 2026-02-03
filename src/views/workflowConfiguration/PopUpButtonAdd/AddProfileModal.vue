<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
    <div class="relative w-full max-w-6xl mx-auto px-8">
      <div class="bg-white rounded-lg shadow">

        <!-- HEADER -->
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-medium">Add WF Profile Group</h5>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="emit('close')">
            ✕
          </button>
        </div>

        <!-- FILTER FORM -->
        <div class="p-6">
          <div class="grid grid-cols-2 gap-x-20 gap-y-6">

            <!-- LEFT -->
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">
                  Profile Group ID
                </label>
                <div class="flex-1">
                  <UiInput v-model="form.profileGroupId" />
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">
                  Profile Name
                </label>
                <div class="flex-1">
                  <UiSelect v-model="form.profileName" :options="profileOptions" placeholder="Select" />
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">
                  Profile ID
                </label>
                <div class="flex-1">
                  <UiInput v-model="form.profileId" />
                </div>
              </div>
            </div>

            <!-- RIGHT -->
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <label class="w-36 text-sm font-medium text-gray-700">
                  Approver Group ID
                </label>
                <div class="flex-1">
                  <UiSelect v-model="form.approverGroupId" :options="approverOptions" placeholder="Select" />
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">
                  Category
                </label>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2">
                    <UiRadio v-model="form.category" name="category" value="Verification" />
                    <span class="text-sm text-gray-700">Verification</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <UiRadio v-model="form.category" name="category" value="Approval" />
                    <span class="text-sm text-gray-700">Approval</span>
                  </label>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium text-gray-700">
                  Step
                </label>
                <div class="flex-1">
                  <UiInput type="number" v-model="form.step" />
                </div>
              </div>
            </div>
          </div>

          <!-- FILTER BUTTON -->
          <div class="flex justify-end mt-6">
            <UiButton c @click="handleFilter">
              Filter
            </UiButton>
          </div>
        </div>

        <!-- TABLE -->
        <div class="p-6 border-t">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 w-10"></th>

                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Profile Group ID
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Profile Name
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Profile ID
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Approver Group ID
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Category
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Step
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in tableData" :key="rowKey(item)" class="hover:bg-blue-50 cursor-pointer"
                  @click="selectRow(item)">
                  <!-- CHECKBOX -->
                  <td class="px-4 py-2 text-center">
                    <UiCheckbox :model-value="selectedRow !== null && rowKey(selectedRow) === rowKey(item)"
                      @update:modelValue="selectRow(item)" @click.stop="selectRow(item)" />
                  </td>

                  <td class="px-6 py-3 text-sm">{{ item.profileGroupId }}</td>
                  <td class="px-6 py-3 text-sm">{{ item.profileName }}</td>
                  <td class="px-6 py-3 text-sm">{{ item.profileId }}</td>
                  <td class="px-6 py-3 text-sm">{{ item.approverGroupId }}</td>
                  <td class="px-6 py-3 text-sm">{{ item.category }}</td>
                  <td class="px-6 py-3 text-sm">{{ item.step }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="flex items-center justify-end gap-3 p-4 border-t">
          <UiButton variant="secondary" @click="emit('close')">
            Cancel
          </UiButton>

          <UiButton variant="primary" @click="handleSubmit">
            <SaveIcon class="w-4 h-4 mr-2" />
            Save
          </UiButton>
        </div>

      </div>
    </div>
  </div>
</template>




<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Save as SaveIcon } from 'lucide-vue-next'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import UiRadio from '@/components/ui/atoms/radio/UiRadio.vue'

const selectedRow = ref<ProfileData | null>(null)

/* =====================
   SELECT HANDLER
===================== */
const selectRow = (row: ProfileData) => {
  if (
    selectedRow.value?.profileGroupId === row.profileGroupId &&
    selectedRow.value?.profileId === row.profileId
  ) {
    selectedRow.value = null
  } else {
    selectedRow.value = row
  }
}

/* =====================
   TYPES
===================== */
interface ProfileData {
  profileGroupId: string
  approverGroupId: string
  profileName: string
  category: string
  profileId: string
  step: string
}

/* =====================
   EMITS
===================== */
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: ProfileData): void
}>()

/* =====================
   FORM (USER INPUT)
===================== */
const form = ref<ProfileData>({
  profileGroupId: '',
  approverGroupId: '',
  profileName: '',
  category: '',
  profileId: '',
  step: ''
})

/* =====================
   FILTER STATE
===================== */
const appliedFilter = ref<ProfileData | null>(null)
const hasFiltered = ref(false)

/* =====================
   DUMMY DATA (MASTER)
===================== */
const dummyData: ProfileData[] = [
  {
    profileGroupId: '3001',
    profileName: 'Sr. Management',
    profileId: 'GR001',
    approverGroupId: 'AG01',
    category: 'Verification',
    step: '1'
  },
  {
    profileGroupId: '3002',
    profileName: 'Sr. Management',
    profileId: 'GR002',
    approverGroupId: 'AG01',
    category: 'Approval',
    step: '2'
  },
  {
    profileGroupId: '3003',
    profileName: 'Finance Team',
    profileId: 'GR003',
    approverGroupId: 'AG01',
    category: 'Verification',
    step: '3'
  }
]

/* =====================
   FILTER ACTION
===================== */
const handleFilter = () => {
  appliedFilter.value = { ...form.value }
  hasFiltered.value = true
  selectedRow.value = null
}

/* =====================
   TABLE DATA (COMPUTED)
===================== */
const tableData = computed(() => {
  if (!hasFiltered.value || !appliedFilter.value) return dummyData

  const f = appliedFilter.value

  return dummyData.filter(item => {
    if (f.profileGroupId && !item.profileGroupId.includes(f.profileGroupId)) return false
    if (f.profileName && item.profileName !== f.profileName) return false
    if (f.profileId && item.profileId !== f.profileId) return false
    if (f.approverGroupId && item.approverGroupId !== f.approverGroupId) return false
    if (f.category && item.category !== f.category) return false
    if (f.step && item.step !== f.step) return false
    return true
  })
})

const rowKey = (row: ProfileData) => `${row.profileGroupId}-${row.profileId}`

/* =====================
   OPTIONS
===================== */
const approverOptions = [
  { value: 'AG01', text: 'AG01' }
]

const profileOptions = [
  { value: 'Sr. Management', text: 'Sr. Management' },
  { value: 'Finance Team', text: 'Finance Team' }
]

/* =====================
   FORM VALIDATION
===================== */
const isFormValid = computed(() =>
  Object.values(form.value).some(v => String(v).trim() !== '')
)

/* =====================
   SUBMIT (SAVE)
===================== */
const handleSubmit = () => {
  if (!selectedRow.value) {
    alert('Please select one data')
    return
  }

  emit('submit', selectedRow.value)
  emit('close')
}
</script>
