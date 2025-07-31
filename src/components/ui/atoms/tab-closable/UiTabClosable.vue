<script setup lang="ts">
import { computed, ref } from 'vue'
import UiButton from '../button/UiButton.vue'
import UiIcon from '../icon/UiIcon.vue'
import { type ITabClosable, type ITabClosableProps } from './types/tabClosable'

const props = defineProps<ITabClosableProps>()
defineEmits(['closeTab', 'addTab'])
const currentTab = defineModel()

const openedTabs = ref<ITabClosable[]>([props.tabs.find((tab) => tab.id === currentTab.value)!])
const filteredTabs = computed(() =>
  props.tabs.filter((tab) => !openedTabs.value.some((opened) => opened.id === tab.id)),
)

const handleOpen = (tab: ITabClosable) => {
  openedTabs.value = [...openedTabs.value, tab]
  currentTab.value = tab.id
}

const handleClose = (id: string) => {
  openedTabs.value = openedTabs.value.filter((current) => current.id !== id)
  currentTab.value = openedTabs.value[openedTabs.value.length - 1].id
}
</script>
<template>
  <div class="flex items-center gap-3 mb-5 overflow-x-auto">
    <div class="tabs">
      <div
        v-for="tab in openedTabs"
        :key="tab.id"
        class="tab !py-0"
        :class="{ active: tab.id === currentTab }"
      >
        <button @click="currentTab = tab.id" class="py-4 text-nowrap">
          {{ tab.label }}
        </button>

        <UiIcon v-if="tab.isVerified" variant="duotone" name="check-circle" class="!text-success" />

        <button v-if="tab.isClosable" @click="handleClose(tab.id)">
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
      <div class="dropdown-content w-full max-w-fit">
        <div class="flex items-center justify-between p-4 pb-0">
          <h3 class="text-lg font-semibold">Open</h3>
          <UiButton
            variant="light"
            :icon="true"
            class="btn-clear"
            data-dropdown-dismiss="true"
            size="sm"
          >
            <UiIcon class="text-xl" name="cross" variant="outline" />
          </UiButton>
        </div>
        <div class="menu menu-default flex flex-col w-full">
          <div v-for="tab in filteredTabs" :key="tab.id" class="menu-item" @click="handleOpen(tab)">
            <div class="menu-link gap-2" data-dropdown-dismiss="true">
              <span class="menu-title">{{ tab.label }}</span>
              <UiIcon
                v-if="tab.isVerified"
                variant="duotone"
                name="check-circle"
                class="!text-success ml-auto"
              />
            </div>
          </div>
          <div v-if="!filteredTabs.length" class="text-gray-500 px-4">No tabs</div>
        </div>
      </div>
    </div>
  </div>
</template>
