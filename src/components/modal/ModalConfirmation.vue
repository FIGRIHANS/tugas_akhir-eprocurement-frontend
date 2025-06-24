<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal z-50 block open"
      data-modal="true"
      :id="id"
      @click="clickBackground"
    >
      <!-- :data-modal-backdrop-static="`${static}`" -->
      <div class="modal-content modal-center-y max-w-lg" @click.stop>
        <div class="modal-body flex flex-col items-center gap-4 !p-10">
          <UiIcon
            v-if="type === 'danger'"
            name="cross-circle"
            variant="duotone"
            class="text-danger text-[135px]"
          />
          <img v-else-if="type === 'confirm'" :src="ConfirmLogo" alt="confirm logo" />
          <img v-else-if="type === 'success'" :src="SuccessLogo" alt="success logo" />

          <div class="flex flex-col gap-2">
            <h3 class="text-center text-lg text-gray-900 font-medium">{{ title }}</h3>
            <p class="text-center text-sm text-gray-700">{{ text }}</p>
          </div>

          <div class="flex flex-row items-center gap-4 w-full">
            <UiButton
              v-if="!noCancel"
              :variant="type === 'danger' ? 'danger' : 'primary'"
              outline
              class="w-full justify-center"
              @click="cancel"
            >
              <UiIcon v-if="cancelButtonIcon" :name="cancelButtonIcon" variant="duotone" />
              {{ cancelButtonText }}
            </UiButton>
            <UiButton
              v-if="!noSubmit"
              :variant="type === 'danger' ? 'danger' : 'primary'"
              class="w-full justify-center"
              @click="submit"
            >
              <UiIcon v-if="submitButtonIcon" :name="submitButtonIcon" variant="duotone" />
              {{ submitButtonText }}
            </UiButton>
          </div>
        </div>
      </div>
    </div>
    <div v-if="open" class="modal-backdrop transition-all duration-300 z-40"></div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ModalConfirmationType } from './types/modal'

import UiButton from '../ui/atoms/button/UiButton.vue'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'

import ConfirmLogo from '@/assets/question-alt.svg'
import SuccessLogo from '@/assets/success.svg'

const props = withDefaults(defineProps<ModalConfirmationType>(), {
  title: 'Title',
  text: 'lorem ipsum',
  cancelButtonText: 'Cancel',
  submitButtonText: 'Submit',
})

const clickBackground = () => {
  if (!props.static) {
    props.cancel?.()
  }
}
</script>
