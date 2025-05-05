<template>
  <div class="modal" data-modal="true" id="reject_approval_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-header">
        <h3 class="modal-title text-lg font-semibold">
          Reject Invoice INV0000123 
        </h3>
      </div>
      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[16px]">
        <UiTextArea v-model="reason" label="Reason" placeholder="Enter reason" />
        <div class="flex gap-[16px] w-full">
          <button class="btn btn-outline btn-primary btn-lg w-full justify-center" data-modal-dismiss="true">
            <i class="ki-duotone ki-black-left-line"></i>
            Cancel
          </button>
          <button class="btn btn-danger btn-lg w-full justify-center" @click="goApprove">
            <i class="ki-duotone ki-cross-circle"></i>
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'

const emits = defineEmits(['approve'])

const reason = ref<string>('')

const goApprove = () => {
  emits('approve')
}
</script>
