<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import AdministrativeCard from '@/components/vendor/cards/AdministrativeCard.vue'
</script>
<template>
  <div class="space-y-5">
    <AdministrativeCard :allow-export="true" />
    <div class="flex gap-3 justify-end">
      <UiButton :outline="true" @click="$router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span> Back </span>
      </UiButton>
    </div>
  </div>
</template>
