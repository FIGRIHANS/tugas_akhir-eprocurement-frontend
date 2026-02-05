<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal z-50 block open"
      data-modal="true"
      :id="id"
      @click="clickBackground"
    >
      <div class="modal-content modal-center-y max-w-lg" @click.stop>
        <div class="modal-body flex flex-col items-center gap-4 !p-10">
          <!-- Icon based on type -->
          <UiIcon
            v-if="type === 'error'"
            name="cross-circle"
            variant="duotone"
            class="text-danger text-[135px]"
          />
          <UiIcon
            v-else-if="type === 'warning'"
            name="information-circle"
            variant="duotone"
            class="text-warning text-[135px]"
          />
          <UiIcon
            v-else-if="type === 'info'"
            name="information-circle"
            variant="duotone"
            class="text-info text-[135px]"
          />
          <img v-else-if="type === 'success'" :src="SuccessLogo" alt="success logo" />

          <div class="flex flex-col gap-2">
            <h3 class="text-center text-lg text-gray-900 font-medium">{{ title }}</h3>
            <p class="text-center text-sm text-gray-700 whitespace-pre-line">{{ text }}</p>
          </div>

          <div class="flex flex-row items-center gap-4 w-full">
            <UiButton
              :variant="type === 'error' ? 'danger' : 'primary'"
              class="w-full justify-center"
              @click="close"
            >
              {{ buttonText }}
            </UiButton>
          </div>
        </div>
      </div>
    </div>
    <div v-if="open" class="modal-backdrop transition-all duration-300 z-40"></div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ModalNotificationType } from './types/modal'

import UiButton from '../ui/atoms/button/UiButton.vue'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'

import SuccessLogo from '@/assets/success.svg'

const props = withDefaults(defineProps<ModalNotificationType>(), {
  title: 'Notification',
  text: '',
  buttonText: 'OK',
})

const clickBackground = () => {
  if (!props.static) {
    close()
  }
}

const close = () => {
  if (props.onClose) {
    props.onClose()
  }
}
</script>
