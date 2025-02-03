<template>
  <div
    v-if="isLoggedin"
    class="size-10 rounded-full inline-flex items-center justify-center text-[11px] font-semibold border border-primary-clarity bg-primary text-white"
  >
    Aa
  </div>

  <template v-else>
    <UiButton outline variant="primary" size="lg" @click="router.push('/registration')">
      Daftar
      <UiIcon variant="duotone" name="menu" />
    </UiButton>
    <UiButton variant="primary" size="lg">
      Masuk
      <UiIcon variant="duotone" name="entrance-left" />
    </UiButton>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const router = useRouter()

const isLoggedin = ref(false)
</script>
