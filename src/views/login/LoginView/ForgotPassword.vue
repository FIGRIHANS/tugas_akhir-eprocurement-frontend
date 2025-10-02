<template>
  <div class="max-w-[343px] border border-grey-200 rounded-xl p-[40px] h-fit">
    <p class="m-0 text-center text-lg font-medium">
      {{ $t('login.forgot.title') }}
    </p>
    <FormForgot v-if="!forgotPasswordStore.isEmailSent" />
    <SuccessForgot v-else />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useForgotPasswordStore } from '@/stores/views/forgot-password'

const FormForgot = defineAsyncComponent(() => import('./ForgotPassword/FormForgot.vue'))
const SuccessForgot = defineAsyncComponent(() => import('./ForgotPassword/SuccessForgot.vue'))

const forgotPasswordStore = useForgotPasswordStore()
</script>

<style lang="scss" scoped>
@use '../style/forgot-password.scss';
</style>
