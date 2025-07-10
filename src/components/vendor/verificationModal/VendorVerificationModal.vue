<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import UiLoading from '@/components/UiLoading.vue'
import { formatDateTime } from '@/composables/date-format'
import { useVerificationDetailStore } from '@/stores/vendor/vendor'
import { onMounted } from 'vue'

const verificationStore = useVerificationDetailStore()
const props = defineProps<{ id: string | number; name: string }>()
const open = defineModel()
defineEmits(['close'])

onMounted(() => {
  verificationStore.getData(props.id as number)
})
</script>
<template>
  <UiModal v-model="open" title="Verification Detail" size="lg">
    <div class="space-y-5 mb-5">
      <h3 class="text-center text-lg">Vendor: {{ name }}</h3>
      <div class="modal-table scrollable-auto">
        <table class="table align-middle">
          <thead>
            <tr class="border-b-2 border-b-primary text-nowrap">
              <th>No</th>
              <th>Verificator Name</th>
              <th>Position</th>
              <th>Verification Date</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="verificationStore.loading">
              <td colspan="7" class="text-center">
                <UiLoading />
              </td>
            </tr>
            <tr v-else-if="verificationStore.error">
              <td colspan="7" class="text-center text-danger">{{ verificationStore.error }}</td>
            </tr>
            <tr v-else-if="!verificationStore.data.length">
              <td colspan="7" class="text-center">No data</td>
            </tr>

            <tr v-else v-for="(item, index) in verificationStore.data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.verificatorName }}</td>
              <td>{{ item.position }}</td>
              <td>{{ formatDateTime(item.createdDate) }}</td>
              <td>
                <span
                  class="badge badge-outline"
                  :class="{
                    'badge-success': item.status === 'Verified',
                    'badge-danger': item.status === 'Reject',
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
              <td>{{ item.keterangan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </UiModal>
</template>
