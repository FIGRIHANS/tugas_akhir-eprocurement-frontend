<template>
  <div
     v-if="route.name !== 'landing-page'"
    class="size-10 rounded-full inline-flex items-center justify-center text-[11px] font-semibold border border-primary-clarity bg-primary text-white"
  >
    Aa
  </div>

  <template v-else>
    <UiButton outline variant="dark" size="lg" @click="router.push('/registration')">
      Register
      <UiIcon variant="duotone" name="menu" />
    </UiButton>
    <button class="btn btn-lg btn-dark" @click="router.push('/login')">
      Sign In
      <UiIcon variant="duotone" name="entrance-left" />
    </button>
  </template>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const router = useRouter()
const route = useRoute()
</script>
