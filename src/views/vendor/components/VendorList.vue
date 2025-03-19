<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <UiInputSearch model-value="" placeholder="Cari vendor" />
        <div class="flex items-center space-x-3">
          <div
            class="dropdown"
            data-dropdown="true"
            data-dropdown-trigger="click"
            data-dropdown-placement="bottom-end"
          >
            <UiButton class="dropdown-toggle">
              <UiIcon variant="outline" name="filter" />
              <span>Filter</span>
            </UiButton>
            <div class="dropdown-content w-full max-w-56 p-4">
              <div>tes</div>
            </div>
          </div>
          <UiButton :outline="true">
            <UiIcon variant="filled" name="printer" />
            Export Data Vendor
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
