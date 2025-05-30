<template>
  <div>
    <p class="mt-[24px] text-justify">
      Make sure your new password is strong and contains a combination of numbers, upper and lower case letters and a combination of characters!
    </p>
    <div class="mt-[24px]">
      <!-- input email -->
      <div>
        <label class="font-normal text-[13px]">Enter New Password</label>
        <div class="input" data-toggle-password="true">
          <input
            v-model="newPassword"
            placeholder="Password" 
            :type="showNewPassword ? 'text' : 'password'"
          />
          <div class="btn btn-icon" @click="toggleNewPassword">
            <i class="ki-outline ki-eye" :class="{ 'hidden': showNewPassword }"></i>
            <i class="ki-outline ki-eye-slash" :class="{ 'hidden': !showNewPassword }"></i>
          </div>
        </div>
      </div>
      <div class="mt-[16px]">
        <label class="font-normal text-[13px]">Confirm New Password</label>
        <div class="input" data-toggle-password="true">
          <input
            v-model="confirmPassword"
            placeholder="Password" 
            :type="showConfirmPassword ? 'text' : 'password'"
          />
          <div class="btn btn-icon" @click="toggleConfirmPassword">
            <i class="ki-outline ki-eye" :class="{ 'hidden': showConfirmPassword }"></i>
            <i class="ki-outline ki-eye-slash" :class="{ 'hidden': !showConfirmPassword }"></i>
          </div>
        </div>
      </div>
      <button class="btn btn-primary mt-[24px] w-full justify-center">
        Confirm
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const newPassword = ref<string>('')
const showNewPassword = ref<boolean>(false)
const confirmPassword = ref<string>('')
const showConfirmPassword = ref<boolean>(false)

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>
