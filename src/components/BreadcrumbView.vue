<template>
  <div class="py-[16px] border-b border-gray-200 mb-[24px]">
    <p class="mt-0 mb-[16px] text-[22px] font-semibold">{{ title }}</p>
    <div class="flex items-center gap-[2px]">
      <router-link to="/" class="text-decoration-none">
        <i class="ki-filled ki-home"></i>
      </router-link>
      <div v-for="(item, index) in routes" :key="index" class="flex items-center gap-[2px]">
        <i class="ki-filled ki-right text-gray-500"></i>
        <span v-if="index === routes.length - 1">{{ item.name }}</span>
        <router-link v-else :to="item.to" class="text-decoration-none">
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */
import { type routeTypes } from '@/core/type/components/breadcrumb'

defineProps<{
  title: string,
  routes: routeTypes[]
}>()
</script>
