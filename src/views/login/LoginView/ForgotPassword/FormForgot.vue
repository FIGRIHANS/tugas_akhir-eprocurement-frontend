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
            forgot__error: emailError,
          }"
        />
        <p v-if="emailError" class="mt-[8px] text-red-500 text-[13px]">
          {{ $t('login.forgot.form.emailError') }}
        </p>
      </div>
      <button class="btn btn-primary mt-[20px] w-full justify-center">
        {{ $t('login.forgot.form.resetButton') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const email = ref<string>('')
const emailError = ref<boolean>(false)
</script>
