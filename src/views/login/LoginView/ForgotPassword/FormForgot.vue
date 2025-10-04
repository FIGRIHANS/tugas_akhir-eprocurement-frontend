<template>
  <div>
    <p class="mt-[24px] text-justify">
      {{ $t('login.forgot.form.description') }}
    </p>
    <div class="mt-[24px]">
      <!-- input email -->
      <div>
        <label class="font-normal text-[13px]">{{ $t('login.forgot.form.email') }}</label>
        <input
          v-model="email"
          class="input mt-[8px]"
          :placeholder="$t('login.forgot.form.emailPlaceholder')"
          type="email"
          :class="{
            forgot__error: emailError || forgotPasswordStore.error,
          }"
          :disabled="forgotPasswordStore.loading"
        />
        <p v-if="emailError" class="mt-[8px] text-red-500 text-[13px]">
          {{ $t('login.forgot.form.emailError') }}
        </p>
        <p v-if="forgotPasswordStore.error" class="mt-[8px] text-red-500 text-[13px]">
          {{ forgotPasswordStore.error }}
        </p>
      </div>
      <button
        class="btn btn-primary mt-[20px] w-full justify-center"
        @click="handleSendResetEmail"
        :disabled="forgotPasswordStore.loading || !email"
      >
        <span v-if="forgotPasswordStore.loading" class="loading loading-spinner loading-sm"></span>
        {{
          forgotPasswordStore.loading
            ? $t('login.forgot.form.sending')
            : $t('login.forgot.form.resetButton')
        }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useForgotPasswordStore } from '@/stores/views/forgot-password'

const email = ref<string>('')
const emailError = ref<boolean>(false)
const forgotPasswordStore = useForgotPasswordStore()

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSendResetEmail = async () => {
  emailError.value = false
  forgotPasswordStore.clearError()

  if (!email.value) {
    emailError.value = true
    return
  }

  if (!validateEmail(email.value)) {
    emailError.value = true
    return
  }

  try {
    await forgotPasswordStore.sendResetPasswordEmail({
      vendorId: '',
      email: email.value,
      vendorName: '',
    })
  } catch (error) {
    console.error('Failed to send reset email:', error)
  }
}
</script>
