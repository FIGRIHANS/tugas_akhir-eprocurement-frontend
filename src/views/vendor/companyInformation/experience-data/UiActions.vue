<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
const emit = defineEmits(['onView', 'onEdit', 'onDelete'])
defineProps<{
  id: number
}>()
</script>

<template>
  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
    <UiButton outline icon size="sm" variant="secondary" class="dropdown-toggle">
      <UiIcon name="dots-vertical" />
    </UiButton>
    <div class="dropdown-content w-full max-w-60 space-y-5">
      <ul class="menu menu-default flex flex-col gap-2" data-dropdown-dismiss="true">
        <li class="menu-item">
          <button class="menu-link" @click="emit('onView', id)">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="eye" class="!text-primary" />
            </span>
            <span class="menu-title"> View Data </span>
          </button>
        </li>
        <li class="menu-item">
          <button class="menu-link" @click="emit('onEdit', id)">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="notepad-edit" class="!text-warning" />
            </span>
            <span class="menu-title"> Edit </span>
          </button>
        </li>
        <li class="menu-item">
          <button class="menu-link" @click="emit('onDelete', id)">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="cross-circle" class="!text-danger" />
            </span>
            <span class="menu-title"> Delete </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
