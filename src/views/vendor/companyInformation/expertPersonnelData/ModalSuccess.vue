<script setup lang="ts">
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="modal" data-modal="true" id="modal-success">
    <div class="modal-content modal-center-y w-full md:w-[500px]">
      <div class="modal-body !py-5 flex flex-col items-center gap-2">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">
          {{ t('expertPersonnelData.modal.success.title') }}
        </h3>
        <p class="text-center text-base text-gray-600 mb-5">
          {{ t('expertPersonnelData.modal.success.message') }}
        </p>
      </div>
    </div>
  </div>
</template>
