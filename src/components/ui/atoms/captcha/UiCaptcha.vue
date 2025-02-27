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
      placeholder="Input catcha"
      @input="checkIsMatch()"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emits = defineEmits<{
  isMatch: [value: boolean]
}>()
const captchaImage = ref('')
const captchaValue = ref('')

const checkIsMatch = () => {
  emits('isMatch', captchaValue.value === captchaImage.value)
}

const generateCaptcha = () => {
  captchaImage.value = ''

  const randomChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#&'

  for (let i = 1; i < 5; i++) {
    captchaImage.value += randomChar.charAt(Math.random() * randomChar.length)
  }

  checkIsMatch()
}

onMounted(() => {
  generateCaptcha()
})
</script>
