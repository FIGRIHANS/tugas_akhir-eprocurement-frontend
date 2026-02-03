<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/user-management/menu'

const router = useRouter()
const store = useMenuStore()
const showModalSuccess = ref(false)

// Form Data
const formData = ref({
  menuName: '',
  menuIcon: '',
  menuUrl: '',
  parentId: 0,
  sequential: 0,
  tier: '',
})

const isSaving = ref(false)

const handleFileUpload = (file: File) => {
  formData.value.menuIcon = file.name
}

const handleSave = () => {
  isSaving.value = true
  setTimeout(() => {
    store.addMenu(formData.value)
    isSaving.value = false
    showModalSuccess.value = true

    // Auto redirect after 1.5s
    setTimeout(() => {
      router.push({ name: 'user-management-master-menu' })
    }, 1500)
  }, 1000)
}
</script>

<template>
  <div>
    <BreadcrumbView
      title="Add New Menu"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Master Menu', to: '/user-management/master-menu' },
        { name: 'Add New Menu', to: '#' },
      ]"
    />

    <div class="max-w-6xl mx-auto p-4">
      <div class="card">
        <div class="card-header">
          <div class="flex w-full justify-between items-center">
            <h2 class="text-lg font-bold text-slate-800">Detail Menu</h2>
          </div>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UiInput
              label="Menu Name"
              placeholder="Enter menu name"
              v-model="formData.menuName"
              required
              :row="true"
            />

            <UiInput
              label="Parent ID"
              placeholder="0"
              type="number"
              v-model="formData.parentId"
              :row="true"
            />

            <UiFileUpload
              name="menuIcon"
              label="Menu Icon"
              placeholder="Upload icon"
              required
              @added-file="handleFileUpload"
            />

            <UiInput
              label="Sequential"
              placeholder="0"
              type="number"
              v-model="formData.sequential"
              :row="true"
            />

            <UiInput
              label="Menu URL"
              placeholder="url (page.master.user)"
              v-model="formData.menuUrl"
              required
              :row="true"
            />

            <UiInput
              label="Tier"
              placeholder="Enter Tier"
              v-model="formData.tier"
              required
              :row="true"
            />
          </div>
        </div>
      </div>

      <div class="mt-8 w-full flex justify-between items-center">
        <UiButton outline @click="router.back()">
          <UiIcon name="cross-circle" variant="duotone" />
          Cancel
        </UiButton>
        <UiButton variant="primary" @click="handleSave" :disabled="isSaving">
          <template v-if="isSaving">
            <span>Saving...</span>
          </template>
          <template v-else>
            <span>Save</span>
            <UiIcon name="save-2" variant="duotone" />
          </template>
        </UiButton>
      </div>
    </div>

    <!-- modal success -->
    <UiModal v-model="showModalSuccess" size="sm">
      <div class="text-center mb-6">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">Yeayyy</h3>
        <p class="text-center text-base text-gray-600 mb-5">Menu successfully created</p>
      </div>
    </UiModal>
  </div>
</template>
