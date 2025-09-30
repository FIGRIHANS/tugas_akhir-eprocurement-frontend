<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { getTableCols } from './static'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalForm from './ModalForm.vue'
import useOtherDocStore from '@/stores/vendor/otherDocuments'
import UiActions from '../experienceData/UiActions.vue'
import { formatDate } from '@/composables/date-format'
import { useRoute } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'
import ModalDelete from './ModalDelete.vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import { useVendorUploadStore } from '@/stores/vendor/upload'

type Mode = 'add' | 'view' | 'edit' | 'delete'

const route = useRoute()
const otherDocStore = useOtherDocStore()
const uploadStore = useVendorUploadStore()
const { t } = useI18n()

const tableCols = computed(() => getTableCols(t))

const modalForm = ref(false)
const modalSuccess = ref(false)
const modalError = ref(false)
const modalDelete = ref(false)
const mode = ref<Mode>('add')
const selectedId = ref<number>(0)
const downloadLoading = ref(false)

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

const onDownload = async (path: string) => {
  downloadLoading.value = true

  try {
    const file = await uploadStore.preview(path)
    const link = URL.createObjectURL(file)
    window.open(link, '_blank')
    setTimeout(() => URL.revokeObjectURL(link), 1000)
  } catch (err) {
    if (err instanceof Error) {
      alert(t('otherDocumentData.error.downloadFailed'))
    }
  } finally {
    downloadLoading.value = false
  }
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
      <div class="card-title">{{ t('otherDocumentData.pageTitle') }}</div>
      <UiButton @click="onOpenForm('add')">
        <UiIcon name="plus-circle" variant="duotone" />
        <span>{{ t('otherDocumentData.buttons.add') }}</span>
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
            <td :colspan="tableCols.length" class="text-center text-gray-800">
              {{ t('otherDocumentData.table.noData') }}
            </td>
          </tr>

          <tr v-else v-for="item in otherDocStore.data" :key="item.id">
            <td>
              <UiActions
                :id="item.id"
                @on-delete="onModalDelete(item.id)"
                @on-edit="onOpenForm('edit', item.id)"
                @on-view="onDownload(item.documentUrl)"
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
      <span>{{ t('otherDocumentData.buttons.back') }}</span>
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
      {{
        t('otherDocumentData.modal.error.title', {
          action:
            mode === 'delete'
              ? t('otherDocumentData.modal.error.actions.delete')
              : mode === 'edit'
                ? t('otherDocumentData.modal.error.actions.change')
                : t('otherDocumentData.modal.error.actions.add'),
        })
      }}
    </h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ t('otherDocumentData.modal.error.message') }}
    </p>
  </UiModal>

  <!-- Success Modal -->
  <UiModal v-model="modalSuccess" size="sm" @update:model-value="onSuccess" v-if="modalSuccess">
    <ModalSuccessLogo class="mx-auto" />
    <h3 class="text-center text-lg font-medium">
      {{ t('otherDocumentData.modal.success.title') }}
    </h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ t('otherDocumentData.modal.success.message') }}
    </p>
  </UiModal>
</template>
