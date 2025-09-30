<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
          {{ t('expertPersonnelData.modal.error.title') }}
        </h3>
        <p class="text-center text-base text-gray-600">
          {{ t('expertPersonnelData.modal.error.message') }}
        </p>
      </div>
    </div>
  </div>
</template>
