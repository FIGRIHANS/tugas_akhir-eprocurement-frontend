<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-xl shadow-2xl w-[400px] relative">
      <!-- Close Button -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <i class="ki-filled ki-cross text-xl"></i>
      </button>

      <!-- Modal Body -->
      <div class="p-8 flex flex-col items-center">
        <!-- Shield Icon -->
        <div class="mb-6">
          <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 1L3.5 5V11C3.5 16.55 7.36 21.74 12 23C16.64 21.74 20.5 16.55 20.5 11V5L12 1Z"
                stroke="#6B7280"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="#6B7280"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-semibold text-gray-800 mb-2 font-inter">Authentication Required</h3>
        <p class="text-gray-500 text-sm mb-6 font-inter text-center">
          Enter your password to verify
        </p>

        <!-- Password Input -->
        <div class="relative w-full mb-6">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="input w-full pr-10 border-gray-300 focus:border-primary px-4 py-3 rounded-lg border-2"
            placeholder="Password"
            autocomplete="new-password"
            @keyup.enter="handleVerify"
          />
          <button
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
            @click="showPassword = !showPassword"
            tabindex="-1"
          >
            <UiIcon :name="showPassword ? 'eye' : 'eye-slash'" variant="duotone" class="text-2xl" />
          </button>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 w-full">
          <UiButton variant="light" class="w-full justify-center font-inter" @click="handleClose">
            Cancel
          </UiButton>
          <UiButton
            variant="primary"
            class="w-full justify-center font-inter"
            @click="handleVerify"
            :disabled="!isCodeComplete"
          >
            Verify
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'verify', code: string): void
}>()

const password = ref<string>('')
const showPassword = ref<boolean>(false)

const isCodeComplete = computed(() => {
  return password.value.length > 0
})

const handleClose = () => {
  password.value = ''
  showPassword.value = false
  emit('close')
}

const handleVerify = () => {
  if (isCodeComplete.value) {
    emit('verify', password.value)
    password.value = ''
  }
}

// Reset code when modal is opened
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      password.value = ''
      showPassword.value = false
    }
  },
)
</script>
