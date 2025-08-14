
<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" @click.self="close">
    <div class="bg-white rounded-lg shadow-lg max-w-[500px] w-full p-[40px] flex flex-col items-center gap-[30px] relative">
      <LogoSuccess />
      <div>
        <p class="text-lg font-medium text-center">Price Negotiation Sent</p>
        <p class="text-[13px] mt-[14px] text-center">
          Price negotiation successfully sent to vendor
        </p>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import LogoSuccess from './successNegotiation/LogoSuccess.vue'

defineProps<{ show: boolean }>()
const emits = defineEmits(['afterClose'])

const close = () => {
  emits('afterClose')
}
</script>

<style scoped>

</style>
