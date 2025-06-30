<script lang="ts" setup>
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
import { useApprovalStore } from '@/stores/vendor/approval'
import moment from 'moment'
import { ref } from 'vue'

const props = defineProps<{ id: string | number; nama: string }>()
const modal = ref(false)

const approvalStore = useApprovalStore()

const loading = ref(false)
const error = ref<string | null>(null)

const getMatrix = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await approvalStore.getMatrix({
      vendorId: Number(props.id),
    })

    if (response.result.isError) {
      error.value = response.result.message ?? 'Unknown error occurred'
      return
    }
  } catch (err) {
    error.value = 'Failed to load approval matrix'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleClick = () => {
  modal.value = !modal.value
  getMatrix()
}
</script>
<template>
  <UiButton size="sm" :icon="true" variant="primary" :outline="true" @click="handleClick">
    <UiIcon name="data" variant="duotone" />
  </UiButton>

  <UiModal title="Vendor Verification Approval" v-model="modal" size="xl">
    <h3 class="font-semibold text-lg text-gray-800 text-center mb-5">{{ nama }}</h3>
    <div class="scrollable-x-auto">
      <table class="table align-middle">
        <thead>
          <tr class="text-nowrap border-b border-primary">
            <th>No</th>
            <th>Approver Name</th>
            <th>Position</th>
            <th>Approval Date</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="text-center">
              <UiLoading />
            </td>
          </tr>

          <tr v-else-if="error">
            <td colspan="7" class="text-center text-red-500">
              {{ error }}
            </td>
          </tr>

          <tr v-else-if="!approvalStore.matrixData.length">
            <td colspan="7" class="text-center">No data found.</td>
          </tr>

          <tr
            v-else
            v-for="(item, index) in approvalStore.matrixData"
            :key="index"
            class="text-nowrap"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.approvalByName }}</td>
            <td>{{ item.approvalByPosition }}</td>
            <td>{{ moment(item.createdUtcDate).format('LLL') }}</td>
            <td>
              <span
                class="badge badge-outline"
                :class="{
                  'badge-success': Number(item.approvalStatus) === 1,
                  'badge-danger': Number(item.approvalStatus) === 2,
                  'badge-primary': Number(item.approvalStatus) === 3,
                }"
              >
                {{ item.approvalName }}
              </span>
            </td>
            <td>{{ item.approvalNote }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </UiModal>
</template>
