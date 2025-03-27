<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

defineProps<{ id: string | number }>()
</script>
<template>
  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
    <UiButton :outline="true" :icon="true" variant="secondary" class="dropdown-toggle">
      <UiIcon variant="outline" name="dots-vertical" />
    </UiButton>
    <div class="dropdown-content w-full max-w-60 space-y-5">
      <ul class="menu menu-default flex flex-col gap-2">
        <li class="menu-item">
          <RouterLink class="menu-link" :to="`/vendor-master/${id}/verification`">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="eye" />
            </span>
            <span class="menu-title"> Detail Vendor </span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <div class="menu-link" href="#">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="data" />
            </span>
            <span class="menu-title"> Detail Verifikasi </span>
          </div>
        </li>
        <div class="border-b border-b-gray-200"></div>
        <li class="menu-item">
          <a class="menu-link" href="#">
            <span class="menu-icon">
              <UiIcon variant="duotone" name="cross-circle" class="!text-red-600" />
            </span>
            <span class="menu-title !text-red-600"> Blacklist </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
