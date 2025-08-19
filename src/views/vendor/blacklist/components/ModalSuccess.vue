<script setup lang="ts">
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

type Props = {
  title?: string
  text?: string
  id: string
}

defineProps<Props>()
</script>

<template>
  <div class="modal" data-modal="true" :id="id">
    <div class="modal-content modal-center-y w-full md:w-[500px]">
      <div class="modal-body !py-5 flex flex-col items-center gap-2">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">
          {{ title }}
        </h3>
        <p class="text-center text-base text-gray-600 mb-5">
          {{ text }}
        </p>
      </div>
    </div>
  </div>
</template>
