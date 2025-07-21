<script lang="ts" setup>
import UiButton from '../ui/atoms/button/UiButton.vue'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'

defineProps<{ id: string | number }>()
</script>

<template>
  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
    <UiButton :outline="true" :icon="true" variant="secondary" class="dropdown-toggle">
      <UiIcon variant="outline" name="dots-vertical" />
    </UiButton>
    <div class="dropdown-content w-full max-w-60 space-y-5">
      <ul class="menu menu-default flex flex-col gap-2" data-dropdown-dismiss="true">
        <li class="menu-item">
          <RouterLink class="menu-link" :to="`/vendor/master/${id}`">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="eye" />
            </span>
            <span class="menu-title"> Detail </span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink class="menu-link" :to="`/vendor/master/${id}`">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="pencil" />
            </span>
            <span class="menu-title"> Edit </span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink class="menu-link" :to="`/vendor/master/${id}`">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="cross-circle" class="text-red-600" />
            </span>
            <span class="menu-title"> Delete </span>
          </RouterLink>
        </li>
        <!-- <div class="border-b border-b-gray-200"></div> -->
      </ul>
    </div>
  </div>
</template>
