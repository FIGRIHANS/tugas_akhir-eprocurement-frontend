<template>
  <div>
    <p class="mt-[24px] text-justify">
      {{ $t('login.setNewPassword.form.description') }}
    </p>

    <!-- Error Message Display -->
    <div
      v-if="forgotPasswordStore.error"
      class="mt-[16px] border bg-red-100 border-red-500 rounded-lg py-[12px] px-[14px]"
    >
      <p class="text-red-600 text-sm">{{ forgotPasswordStore.error }}</p>
    </div>

    <div class="mt-[24px]">
      <!-- New Password Input -->
      <div>
        <label class="font-normal text-[13px]">{{
          $t('login.setNewPassword.form.enterNewPassword')
        }}</label>
        <div class="input" data-toggle-password="true" :class="{ 'border-red-500': passwordError }">
          <input
            v-model="newPassword"
            :placeholder="$t('login.setNewPassword.form.passwordPlaceholder')"
            :type="showNewPassword ? 'text' : 'password'"
            @input="clearPasswordError"
          />
          <div class="btn btn-icon" @click="toggleNewPassword">
            <i class="ki-outline ki-eye" :class="{ hidden: showNewPassword }"></i>
            <i class="ki-outline ki-eye-slash" :class="{ hidden: !showNewPassword }"></i>
          </div>
        </div>
        <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
      </div>

      <!-- Confirm Password Input -->
      <div class="mt-[16px]">
        <label class="font-normal text-[13px]">{{
          $t('login.setNewPassword.form.confirmNewPassword')
        }}</label>
        <div
          class="input"
          data-toggle-password="true"
          :class="{ 'border-red-500': confirmPasswordError }"
        >
          <input
            v-model="confirmPassword"
            :placeholder="$t('login.setNewPassword.form.passwordPlaceholder')"
            :type="showConfirmPassword ? 'text' : 'password'"
            @input="clearConfirmPasswordError"
          />
          <div class="btn btn-icon" @click="toggleConfirmPassword">
            <i class="ki-outline ki-eye" :class="{ hidden: showConfirmPassword }"></i>
            <i class="ki-outline ki-eye-slash" :class="{ hidden: !showConfirmPassword }"></i>
          </div>
        </div>
        <p v-if="confirmPasswordError" class="text-red-500 text-xs mt-1">
          {{ confirmPasswordError }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        class="btn btn-primary mt-[24px] w-full justify-center"
        :disabled="forgotPasswordStore.loading"
        @click="handleResetPassword"
      >
        <span v-if="forgotPasswordStore.loading" class="indicator-progress">
          <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
        </span>
        <span v-else>{{ $t('login.setNewPassword.form.confirm') }}</span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useForgotPasswordStore } from '@/stores/views/forgot-password'
import { useLoginStore } from '@/stores/views/login'

const route = useRoute()
const forgotPasswordStore = useForgotPasswordStore()
const loginStore = useLoginStore()

const newPassword = ref<string>('')
const showNewPassword = ref<boolean>(false)
const confirmPassword = ref<string>('')
const showConfirmPassword = ref<boolean>(false)
const passwordError = ref<string>('')
const confirmPasswordError = ref<string>('')

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const clearPasswordError = () => {
  passwordError.value = ''
  forgotPasswordStore.clearError()
}

const clearConfirmPasswordError = () => {
  confirmPasswordError.value = ''
  forgotPasswordStore.clearError()
}

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  passwordError.value = ''
  confirmPasswordError.value = ''

  // Validate new password
  if (!newPassword.value) {
    passwordError.value = 'Password is required'
    isValid = false
  } else if (newPassword.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
    isValid = false
  }

  // Validate confirm password
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
    isValid = false
  } else if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleResetPassword = async () => {
  if (!validateForm()) {
    return
  }

  try {
    if (route.name === 'setUserNewPassword') {
      const resetToken = route.query.token as string
      const userEmail = route.query.userEmail as string

      if (!resetToken || !userEmail) {
        passwordError.value = 'Invalid reset link'
        return
      }
      await forgotPasswordStore.resetEmployeePasswordWithNewPassword({
        email: userEmail,
        newPassword: newPassword.value,
        resetToken,
      })
    } else {
      const resetToken = route.query.token as string
      const vendorEmail = route.query.vendorEmail as string

      if (!resetToken || !vendorEmail) {
        passwordError.value = 'Invalid reset link'
        return
      }
      await forgotPasswordStore.resetPasswordWithNewPassword({
        email: vendorEmail,
        newPassword: newPassword.value,
        resetToken,
      })
    }

    // Set success state in login store
    loginStore.isSendNewPassword = true
  } catch (error) {
    console.error('Reset password failed:', error)
  }
}
</script>
