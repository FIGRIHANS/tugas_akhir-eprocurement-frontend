<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { tableCols } from './static'
import { onMounted, ref } from 'vue'
import ModalForm from './ModalForm.vue'
import useOtherDocStore from '@/stores/vendor/otherDocuments'
import UiActions from '../experienceData/UiActions.vue'
import { formatDate } from '@/composables/date-format'
import { useRoute } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'
import ModalDelete from './ModalDelete.vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

type Mode = 'add' | 'view' | 'edit' | 'delete'

const route = useRoute()
const otherDocStore = useOtherDocStore()

const modalForm = ref(false)
const modalSuccess = ref(false)
const modalError = ref(false)
const modalDelete = ref(false)
const mode = ref<Mode>('add')
const selectedId = ref<number>(0)

const onOpenForm = (newMode: Mode, id?: number) => {
  modalForm.value = true
  mode.value = newMode
  selectedId.value = 0

  if (newMode === 'edit' && id) {
    selectedId.value = id
  }
}

const onModalDelete = (id: number) => {
  selectedId.value = id
  mode.value = 'delete'
  modalDelete.value = true
}

const onSuccess = () => {
  otherDocStore.get(Number(route.params.id))
}

onMounted(() => {
  otherDocStore.get(Number(route.params.id))
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">Other Documents</div>
      <UiButton @click="onOpenForm('add')">
        <UiIcon name="plus-circle" variant="duotone" />
        <span>Add</span>
      </UiButton>
    </div>
    <div class="card-table scrollable-x-auto">
      <table class="table align-middle">
        <thead class="text-nowrap">
          <tr>
            <th v-for="col in tableCols" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- loading -->
          <tr v-if="otherDocStore.loading">
            <td :colspan="tableCols.length" class="text-center">
              <UiLoading size="md" variant="primary" />
            </td>
          </tr>

          <!-- error -->
          <tr v-else-if="otherDocStore.error">
            <td :colspan="tableCols.length" class="text-center text-danger">
              {{ otherDocStore.error }}
            </td>
          </tr>

          <!-- No data -->
          <tr v-else-if="!otherDocStore.data.length">
            <td :colspan="tableCols.length - 1" class="text-center text-danger">No data</td>
          </tr>

          <tr v-else v-for="item in otherDocStore.data" :key="item.id">
            <td>
              <UiActions
                :id="item.id"
                @on-delete="onModalDelete(item.id)"
                @on-edit="onOpenForm('edit', item.id)"
              />
            </td>
            <td>{{ item.documentName }}</td>
            <td>{{ item.documentNo }}</td>
            <td>{{ formatDate(item.expiredUTCDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="flex justify-end mt-3">
    <UiButton :outline="true" @click="$router.go(-1)">
      <UiIcon name="black-left" variant="duotone" />
      <span>Back</span>
    </UiButton>
  </div>

  <ModalForm
    v-if="modalForm"
    v-model="modalForm"
    :vendor-id="Number($route.params.id)"
    :id="selectedId"
    @on-success="() => (modalSuccess = true)"
    @on-error="() => (modalError = true)"
  />

  <ModalDelete
    v-if="modalDelete"
    v-model="modalDelete"
    :id="selectedId"
    @on-error="() => (modalError = true)"
    @on-success="() => (modalSuccess = true)"
  />

  <!-- Error modal -->
  <UiModal v-model="modalError" size="sm" v-if="modalError">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">
      Failed to {{ mode == 'delete' ? 'Delete' : mode === 'edit' ? 'Change' : 'Add' }} Other
      document!
    </h3>
    <p class="text-center text-base text-gray-600 mb-5">
      Please try again later or contact support if the problem persists.
    </p>
  </UiModal>

  <!-- Success Modal -->
  <UiModal v-model="modalSuccess" size="sm" @update:model-value="onSuccess" v-if="modalSuccess">
    <ModalSuccessLogo class="mx-auto" />
    <h3 class="text-center text-lg font-medium">Hooray!</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      The data has been successfully updated in the admin system.
    </p>
  </UiModal>
</template>
