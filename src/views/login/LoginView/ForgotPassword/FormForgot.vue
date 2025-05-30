<template>
  <div>
    <p class="mt-[24px] text-justify">
      To reset your password, please enter the email used during registration, make sure the email is active and we will send you a link to change your new password!
    </p>
    <div class="mt-[24px]">
      <!-- input email -->
      <div>
        <label class="font-normal text-[13px]">Email</label>
        <input
          v-model="email"
          class="input mt-[8px]"
          placeholder="email@email.com"
          type="email"
          :class="{
            'forgot__error': emailError
          }"
        />
        <p v-if="emailError" class="mt-[8px] text-red-500 text-[13px]">
          We did not find the email you entered, please check the email you used for your first registration.
        </p>
      </div>
      <button class="btn btn-primary mt-[20px] w-full justify-center">
        Reset Password
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const email = ref<string>('')
const emailError = ref<boolean>(false)
</script>
