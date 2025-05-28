<template>
  <div
    class="modal z-50"
    :class="open ? 'block open' : ''"
    data-modal="true"
    :data-modal-backdrop-static="`${static}`"
    :id="id"
  >
    <div class="modal-content modal-center-y max-w-2xl">
      <UiIcon
        v-if="type === 'danger'"
        name="cross-circle"
        variant="duotone"
        class="text-danger size-32"
      />
      <img v-else-if="type === 'confirm'" :src="ConfirmLogo" alt="confirm logo" />
      <img v-else-if="type === 'success'" :src="SuccessLogo" alt="success logo" />

      <div class="modal-header">
        <h3 class="modal-title text-lg">{{ title }}</h3>
      </div>

      <p>{{ text }}</p>

      <div class="flex flex-row justify-end items-center gap-4 w-full">
        <UiButton
          v-if="!noCancel"
          :variant="type === 'danger' ? 'danger' : 'primary'"
          outline
          data-modal-dismiss="true"
          @click="cancel"
        >
          <UiIcon v-if="cancelButtonIcon" :name="cancelButtonIcon" variant="duotone" />
          {{ cancelButtonText }}
        </UiButton>
        <UiButton
          v-if="!noSubmit"
          :variant="type === 'danger' ? 'danger' : 'primary'"
          @click="submit"
        >
          <UiIcon v-if="submitButtonIcon" :name="submitButtonIcon" variant="duotone" />
          {{ submitButtonText }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModalConfirmationType } from './types/modal'

import UiButton from '../ui/atoms/button/UiButton.vue'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'

import ConfirmLogo from '@/assets/question-alt.svg'
import SuccessLogo from '@/assets/success.svg'

withDefaults(defineProps<ModalConfirmationType>(), {
  title: 'Title',
  text: 'lorem ipsum',
  cancelButtonText: 'Cancel',
  submitButtonText: 'Submit',
})
</script>
