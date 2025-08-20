<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

type Props = {
  id: string
  title?: string
  text?: string
}
defineProps<Props>()
</script>

<template>
  <div class="modal" data-modal="true" id="modal-error">
    <div class="modal-content modal-center-y w-full md:w-[500px]">
      <div class="modal-body !py-10 flex flex-col items-center gap-2">
        <div class="text-center mb-6">
          <UiIcon
            name="cross-circle"
            variant="duotone"
            class="text-[150px] text-danger text-center"
          />
        </div>
        <h3 class="text-center text-lg font-medium">
          {{ title ?? 'Oops!' }}
        </h3>
        <p class="text-center text-base text-gray-600">
          {{ text ?? 'Please try again later or contact support if the problem persists.' }}
        </p>
      </div>
    </div>
  </div>
</template>
