<script setup lang="ts">
import LogoSAP from '@/assets/svg/LogoSAP.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { ref } from 'vue'

const modalSuccess = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const handleSend = async () => {
  loading.value = true
  error.value = null

  setTimeout(() => {
    loading.value = false
    modalSuccess.value = true
  }, 2000)
}
</script>

<template>
  <UiButton @click="handleSend" :disabled="loading">
    <span v-if="loading">Progress</span>
    <template v-else>
      <UiIcon name="paper-plane" variant="duotone" />
      <span class="text-nowrap">Send to SAP</span>
    </template>
  </UiButton>

  <UiModal
    v-model="modalSuccess"
    size="sm"
    @update:model-value="$router.replace({ name: $route.name })"
  >
    <LogoSAP class="mx-auto mb-5" />
    <h3 class="text-center text-lg font-medium">Vendor Successfully Send to SAP</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      Vendor information has been submitted to SAP.
    </p>
  </UiModal>
</template>
