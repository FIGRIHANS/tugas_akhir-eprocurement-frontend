<script setup lang="ts">
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

type Props = {
  mode: string
}

defineProps<Props>()
</script>

<template>
  <div class="modal" data-modal="true" id="modal-success">
    <div class="modal-content modal-center-y w-full md:w-[500px]">
      <div class="modal-body !py-5 flex flex-col items-center gap-2">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">
          Blacklist Vendor Request <span class="capitalize">{{ mode }}</span
          >ed
        </h3>
        <p class="text-center text-base text-gray-600 mb-5">
          Blacklist Vendor request has been successfully {{ mode }}ed.
        </p>
      </div>
    </div>
  </div>
</template>
