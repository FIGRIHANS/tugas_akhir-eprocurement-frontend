<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRoute, useRouter } from 'vue-router'
import UiActions from './UiActions.vue'
import { computed, onMounted, ref } from 'vue'
import ModalForm from './ModalForm.vue'
import { getTableCols } from './static'
import useExperienceStore from '@/stores/vendor/experience'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
// import { formatDate } from '@/composables/date-format'
import ModalDelete from './ModalDelete.vue'
import UiLoading from '@/components/UiLoading.vue'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import moment from 'moment'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const experienceStore = useExperienceStore()
const uploadStore = useVendorUploadStore()

const mode = ref<'add' | 'view' | 'edit' | 'delete'>('add')
const selectedId = ref<number>(0)

const modalForm = ref<boolean>(false)
const errorModal = ref<boolean>(false)
const successModal = ref<boolean>(false)
const deleteModal = ref<boolean>(false)
const downloadLoading = ref(false)

const tableCols = computed(() => getTableCols(t))

const completedExp = computed(() =>
  experienceStore.data.filter((item) => item.experienceType === 3153 && item.isActive),
)
const onGoingExp = computed(() =>
  experienceStore.data.filter((item) => item.experienceType === 3154 && item.isActive),
)

const openModalForm = (newMode: 'add' | 'view' | 'edit', id?: number) => {
  modalForm.value = true
  mode.value = newMode

  if (id) {
    selectedId.value = id
  }
}

const onModalDelete = (id: number) => {
  selectedId.value = id
  mode.value = 'delete'
  deleteModal.value = true
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
      alert(t('experienceData.error.downloadFailed'))
    }
  } finally {
    downloadLoading.value = false
  }
}

const onSuccess = () => {
  experienceStore.getData(Number(route.params.id))
}

onMounted(() => {
  experienceStore.getData(Number(route.params.id))
})
</script>

<template>
  <div class="space-y-5">
    <div class="card">
      <div class="card-header">
        <div class="card-title">{{ t('experienceData.pageTitle') }}</div>
        <div>
          <UiButton @click="openModalForm('add')">
            <UiIcon name="plus-circle" variant="duotone" />
            <span>{{ t('experienceData.buttons.add') }}</span>
          </UiButton>
        </div>
      </div>
      <div class="card-body space-y-3">
        <div class="card">
          <div class="card-header">
            <div class="card-title">{{ t('experienceData.projectType.completed') }}</div>
          </div>
          <div class="card-table scrollable-x-auto">
            <table class="table align-middle text-gray-700">
              <thead>
                <tr>
                  <th v-for="col in tableCols" :key="col.key" class="text-nowrap">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="text-nowrap">
                <!-- loading -->
                <tr v-if="experienceStore.loading">
                  <td :colspan="tableCols.length - 1" class="text-center">
                    <UiLoading size="md" variant="primary" />
                  </td>
                </tr>

                <!-- error -->
                <tr v-else-if="experienceStore.error">
                  <td :colspan="tableCols.length - 1" class="text-center text-danger">
                    {{ experienceStore.error }}
                  </td>
                </tr>

                <!-- No data -->
                <tr v-else-if="!completedExp.length">
                  <td :colspan="tableCols.length" class="text-center text-danger">
                    {{ t('experienceData.table.noData') }}
                  </td>
                </tr>

                <!-- loop data -->
                <tr v-else v-for="item in completedExp" :key="item.id">
                  <td>
                    <UiActions
                      :id="item.id"
                      @on-view="onDownload(item.documentURL)"
                      @on-edit="openModalForm('edit', item.id)"
                      @on-delete="onModalDelete(item.id)"
                    />
                  </td>
                  <td>{{ item.contractName }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ item.agency }}</td>
                  <td>{{ item.contractValue }}</td>
                  <td>{{ item.businessField }}</td>
                  <td>{{ item.subBusiness }}</td>
                  <td>{{ moment(item.startDate).format('MMM DD, yyyy') }}</td>
                  <td>{{ moment(item.endDate).format('MMM DD, yyyy') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">{{ t('experienceData.projectType.ongoing') }}</div>
          </div>
          <div class="card-table scrollable-x-auto">
            <table class="table align-middle text-gray-700">
              <thead>
                <tr>
                  <th v-for="col in tableCols" :key="col.key" class="text-nowrap">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="text-nowrap">
                <!-- loading -->
                <tr v-if="experienceStore.loading">
                  <td :colspan="tableCols.length" class="text-center">
                    <UiLoading size="md" variant="primary" />
                  </td>
                </tr>

                <!-- error -->
                <tr v-else-if="experienceStore.error">
                  <td :colspan="tableCols.length" class="text-center text-danger">
                    {{ experienceStore.error }}
                  </td>
                </tr>

                <!-- No data -->
                <tr v-else-if="!onGoingExp.length">
                  <td :colspan="tableCols.length" class="text-center text-danger">
                    {{ t('experienceData.table.noData') }}
                  </td>
                </tr>

                <!-- loop -->
                <tr v-else v-for="item in onGoingExp" :key="item.id">
                  <td>
                    <UiActions
                      :id="item.id"
                      @on-view="onDownload(item.documentURL)"
                      @on-edit="openModalForm('edit', item.id)"
                      @on-delete="onModalDelete(item.id)"
                    />
                  </td>
                  <td>{{ item.contractName }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ item.agency }}</td>
                  <td>{{ item.contractValue }}</td>
                  <td>{{ item.businessField }}</td>
                  <td>{{ item.subBusiness }}</td>
                  <td>{{ moment(item.startDate).format('MMM DD, yyyy') }}</td>
                  <td>{{ moment(item.endDate).format('MMM DD, yyyy') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <UiButton :outline="true" @click="router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span>{{ t('experienceData.buttons.back') }}</span>
      </UiButton>
    </div>
  </div>

  <!-- modal add experience data -->
  <ModalForm
    v-model="modalForm"
    :mode="mode"
    :id="selectedId"
    :vendor-id="Number($route.params.id)"
    @on-error="() => (errorModal = true)"
    @on-success="() => (successModal = true)"
    v-if="modalForm"
  />

  <!-- delete modal -->
  <ModalDelete
    :id="selectedId"
    v-model="deleteModal"
    @on-error="() => (errorModal = true)"
    @on-success="successModal = true"
  />

  <!-- Error modal -->
  <UiModal v-model="errorModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">
      {{
        t('experienceData.modal.error.title', {
          action:
            mode === 'delete'
              ? t('experienceData.modal.error.actions.delete')
              : mode === 'edit'
                ? t('experienceData.modal.error.actions.change')
                : t('experienceData.modal.error.actions.add'),
        })
      }}
    </h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ t('experienceData.modal.error.message') }}
    </p>
  </UiModal>

  <!-- Success Modal -->
  <UiModal v-model="successModal" size="sm" @update:model-value="onSuccess">
    <ModalSuccessLogo class="mx-auto" />
    <h3 class="text-center text-lg font-medium">{{ t('experienceData.modal.success.title') }}</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ t('experienceData.modal.success.message') }}
    </p>
  </UiModal>
</template>
