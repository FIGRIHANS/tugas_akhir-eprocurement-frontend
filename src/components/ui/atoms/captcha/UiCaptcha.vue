<template>
  <div class="flex flex-row items-center gap-6">
    <button class="btn btn-icon rounded-full btn-outline btn-primary" @click="generateCaptcha()">
      <i class="ki-outline ki-arrows-circle"> </i>
    </button>

    <span class="select-none font-semibold text-2xl text-gray-900">
      {{ captchaImage }}
    </span>

    <input
      v-model="captchaValue"
      type="text"
      class="input"
      :placeholder="$t('general.input', { field: 'captcha' })"
      @input="emits('update:modelValue', captchaValue === captchaImage)"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
const captchaImage = ref('')
const captchaValue = ref('')

const generateCaptcha = () => {
  captchaImage.value = ''

  const randomChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#&'

  for (let i = 1; i < 5; i++) {
    captchaImage.value += randomChar.charAt(Math.random() * randomChar.length)
  }

  emits('update:modelValue', false)
}

onMounted(() => {
  generateCaptcha()
})
</script>
