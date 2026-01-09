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
          Enter the 6-digit verification code
        </p>

        <!-- Verification Code Input -->
        <div class="flex gap-3 mb-6 justify-center">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            :ref="
              (el) => {
                if (el) codeInputs[index] = el as HTMLInputElement
              }
            "
            v-model="verificationCode[index]"
            type="password"
            maxlength="1"
            class="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
            @input="handleCodeInput(index, $event)"
            @keydown="handleKeyDown(index, $event)"
            @paste="handlePaste"
          />
        </div>

        <!-- Verify Button (Full Width) -->
        <button
          class="btn btn-primary w-full font-inter"
          @click="handleVerify"
          :disabled="!isCodeComplete"
          :class="{ 'opacity-50 cursor-not-allowed': !isCodeComplete }"
        >
          Verify
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'verify', code: string): void
}>()

const verificationCode = ref<string[]>(['', '', '', '', '', ''])
const codeInputs = ref<HTMLInputElement[]>([])

const isCodeComplete = computed(() => {
  return verificationCode.value.every((digit) => digit !== '')
})

const handleClose = () => {
  verificationCode.value = ['', '', '', '', '', '']
  emit('close')
}

const handleCodeInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^0-9]/g, '')

  verificationCode.value[index] = value

  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData
    ?.getData('text')
    .replace(/[^0-9]/g, '')
    .slice(0, 6)

  if (pastedData) {
    const digits = pastedData.split('')
    digits.forEach((digit, index) => {
      if (index < 6) {
        verificationCode.value[index] = digit
      }
    })

    const nextEmptyIndex = digits.length < 6 ? digits.length : 5
    codeInputs.value[nextEmptyIndex]?.focus()
  }
}

const handleVerify = () => {
  if (isCodeComplete.value) {
    const code = verificationCode.value.join('')
    emit('verify', code)
    verificationCode.value = ['', '', '', '', '', '']
  }
}

// Reset code when modal is opened
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      verificationCode.value = ['', '', '', '', '', '']
    }
  },
)
</script>
