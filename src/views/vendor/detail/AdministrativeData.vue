<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import AdministrativeCard from '@/components/vendor/cards/AdministrativeCard.vue'
const props = defineProps<{
  vendorId: string
}>()
</script>
<template>
  <div class="space-y-5">
    <AdministrativeCard :vendorId="props.vendorId" />
    <div class="flex gap-3 justify-end">
      <UiButton :outline="true" @click="$router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span> {{ $t('general.back') }}</span>
      </UiButton>
    </div>
  </div>
</template>
