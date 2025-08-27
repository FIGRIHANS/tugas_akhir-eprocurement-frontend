<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UiModal from '../modal/UiModal.vue'
import UiButton from '../ui/atoms/button/UiButton.vue'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'
import successImg from '@/assets/success.svg'
import { useVendorStore } from '@/stores/vendor/vendor'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'
import LogoQuestionWhite from '@/assets/svg/LogoQuestionWhite.vue'
import UiLoading from '../UiLoading.vue'

const route = useRoute()
// store
const vendorStore = useVendorStore()
const userStore = useLoginStore()

const props = defineProps<{ id: string | number; status: boolean; name: string }>()
const modalDeactive = ref(false)
const modalActivate = ref<boolean>(false)
const modalSuccess = ref(false)
const modalError = ref(false)

// refs
const reason = ref<string>('')
const isChecked = ref<boolean>(props.status)
const inputError = ref<string[]>([])
const loading = ref<boolean>(false)
const error = ref<string>('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    await vendorStore.deactiveVendor({
      vendorId: Number(props.id),
      reason: 'deactivated',
      employeeId: userStore.userData?.profile.employeeId.toString() as string,
    })
    isChecked.value = false
    modalSuccess.value = true
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.result.message || 'Failed to deactive vendor'
      }
      modalError.value = true
    }
  } finally {
    modalDeactive.value = false
    loading.value = false
  }
}

const handleSubmitActivate = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await vendorStore.activateVendor({
      vendorId: Number(props.id),
      reason: '',
      employeeId: userStore.userData?.profile.employeeId.toString() as string,
    })

    if (response.result.isError) {
      error.value = response.result.message || 'Failed to activate vendor'
      return
    }

    isChecked.value = true
    modalSuccess.value = true
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.result.message || 'Failed to activate vendor'
      }
      modalError.value = true
    }
  } finally {
    modalActivate.value = false
    loading.value = false
  }
}

const handleCancel = () => {
  modalDeactive.value = false
  modalActivate.value = false
  isChecked.value = props.status
}

const handleChange = () => {
  if (!props.status) {
    modalActivate.value = true
    isChecked.value = !isChecked.value
    return
  }

  modalDeactive.value = true
  isChecked.value = !isChecked.value
}

const handleSuccess = () => {
  vendorStore.getVendors(route.query)
}

onMounted(() => {
  reason.value = ''
  inputError.value = []
  loading.value = false
  error.value = ''
})
</script>
<template>
  <label class="switch">
    <input
      name="check"
      type="checkbox"
      class="switch-on:checked:!bg-success"
      :checked="isChecked"
      @change="handleChange"
    />
    <span class="switch-label text-nowrap">{{ status ? 'Active' : 'Not Active' }}</span>
  </label>

  <!-- deactivate modal -->
  <UiModal
    v-if="modalDeactive"
    v-model="modalDeactive"
    size="sm"
    @update:model-value="handleCancel"
  >
    <form action="" @submit.prevent="handleSubmit" class="space-y-4">
      <LogoQuestionWhite class="mx-auto" />
      <h3 class="font-medium text-lg text-gray-800 text-center">
        Do you want to Deactivate this vendor?
      </h3>
      <div class="flex gap-3">
        <UiButton class="flex-1 justify-center" :outline="true" type="button" @click="handleCancel">
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="danger" :disabled="loading">
          <UiLoading variant="white" v-if="loading" />
          <UiIcon name="cross-circle" variant="duotone" v-else />
          <span>Deactivate</span>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <!-- activate modal -->
  <UiModal
    v-if="modalActivate"
    v-model="modalActivate"
    @update:model-value="handleCancel"
    size="sm"
  >
    <div class="space-y-5">
      <LogoQuestionWhite class="mx-auto" />
      <h3 class="font-medium text-lg text-gray-800 text-center">
        Do you want to Activate this vendor?
      </h3>
      <div class="flex gap-3">
        <UiButton class="flex-1 justify-center" :outline="true" type="button" @click="handleCancel">
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton
          class="flex-1 justify-center"
          variant="primary"
          :disabled="loading"
          @click="handleSubmitActivate"
        >
          <UiLoading variant="white" v-if="loading" />
          <UiIcon name="cross-circle" variant="duotone" v-else />
          <span>Activate</span>
        </UiButton>
      </div>
      <div class="badge badge-outline badge-lg badge-danger" v-if="error">{{ error }}</div>
    </div>
  </UiModal>

  <!-- success modal -->
  <UiModal v-if="modalSuccess" v-model="modalSuccess" size="sm" @update:model-value="handleSuccess">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">
      Vendor Successfully {{ props.status ? 'Deactivated' : 'Activated' }}
    </h3>
    <p class="text-gray-600 text-center mb-3">
      Vendor has been successfully {{ props.status ? 'Deactivated' : 'Activated' }}.
    </p>
  </UiModal>

  <!-- error modal -->
  <UiModal v-if="modalError" v-model="modalError" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">
      Failed to {{ props.status ? 'Deactivated' : 'Activated' }} vendor!
    </h3>
    <p class="text-center text-base text-gray-600">
      Please try again later or contact support if the problem persists.
    </p>
  </UiModal>
</template>
