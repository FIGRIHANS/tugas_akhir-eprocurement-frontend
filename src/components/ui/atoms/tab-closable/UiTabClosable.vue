<script setup lang="ts">
import { computed } from 'vue'
import UiButton from '../button/UiButton.vue'
import UiIcon from '../icon/UiIcon.vue'
import type { ITabClosableProps } from './types/tabClosable'

const props = defineProps<ITabClosableProps>()
defineEmits(['closeTab', 'addTab'])
const currentTab = defineModel('currentTab')

const filteredTabs = computed(() =>
  props.tabs.filter((tab) => !props.openedTabs.map((opened) => opened.id).includes(tab.id)),
)
</script>
<template>
  <div class="flex items-center gap-3">
    <div class="tabs">
      <div
        v-for="openedTab in openedTabs"
        :key="openedTab.id"
        class="tab !py-0"
        :class="{ active: openedTab.id === currentTab }"
      >
        <button @click="currentTab = openedTab.id" class="py-4">
          {{ openedTab.label }}
        </button>

        <UiIcon
          v-if="openedTab.isVerified"
          variant="duotone"
          name="check-circle"
          class="!text-success"
        />

        <button v-if="openedTab.isClosable" @click="$emit('closeTab', openedTab.id)">
          <UiIcon name="cross-circle" variant="duotone" class="text-primary" />
        </button>
      </div>
    </div>
    <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
      <UiButton
        :outline="true"
        :icon="true"
        variant="light"
        class="btn-clear dropdown-toggle"
        size="sm"
      >
        <UiIcon name="dots-vertical" />
      </UiButton>
      <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
        <div class="menu menu-default flex flex-col w-full">
          <div
            v-for="tab in filteredTabs"
            :key="tab.id"
            class="menu-item"
            @click="$emit('addTab', tab.id)"
          >
            <div class="menu-link gap-2">
              <span class="menu-title">{{ tab.label }}</span>
              <UiIcon
                v-if="tab.isVerified"
                variant="duotone"
                name="check-circle"
                class="!text-success ml-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
