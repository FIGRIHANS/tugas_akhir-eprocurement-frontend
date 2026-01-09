<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-xl shadow-2xl w-[450px]">
      <!-- Modal Body -->
      <div class="px-10 py-10 flex flex-col items-center">
        <!-- Success Icon -->
        <div class="mb-6">
          <ModalSuccessLogo />
        </div>

        <!-- Title -->
        <h3 class="text-xl font-semibold text-gray-800 mb-4 font-inter text-center">
          Successfully Credited
        </h3>
        <p class="text-gray-600 text-sm text-center mb-8 font-inter">
          The FP with number
          <span class="font-semibold text-gray-800">{{ fpNumber }}</span>
          successfully credited
        </p>

        <!-- Continue Button -->
        <button class="btn btn-primary w-full font-inter" @click="handleClose">Continue</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

defineProps<{
  show: boolean
  fpNumber: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}
</script>
