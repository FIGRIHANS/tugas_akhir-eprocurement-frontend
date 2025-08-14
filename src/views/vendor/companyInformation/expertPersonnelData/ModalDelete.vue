<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
</script>

<template>
  <div class="modal" data-modal="true" id="modal-delete">
    <div class="modal-content modal-center-y w-full md:w-[500px]">
      <div class="modal-body !py-5 flex flex-col items-center gap-2">
        <div class="text-center mb-6">
          <UiIcon
            name="cross-circle"
            variant="duotone"
            class="text-[150px] text-danger text-center"
          />
        </div>
        <h3 class="text-center text-lg font-medium">Are You Sure You Want to Delete This Item?</h3>
        <p class="text-center text-base text-gray-600 mb-5">
          This action will permanently remove the selected data from the list.
        </p>
        <div class="flex gap-3 px-8 mb-3">
          <UiButton outline class="flex-1 flex items-center justify-center">
            <UiIcon name="black-left-line" />
            <span>Cancel</span>
          </UiButton>
          <UiButton variant="danger" class="flex-1 flex items-center justify-center">
            <UiLoading variant="white" />
            <UiIcon name="cross-circle" variant="duotone" />
            <span>Delete</span>
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
