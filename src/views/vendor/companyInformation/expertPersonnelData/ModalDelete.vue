<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
import { KTModal } from '@/metronic/core'
import { ref, watch } from 'vue'
import type { PayloadExportPersonnelDataType } from './types/expertPersonnelData'
import { cloneDeep } from 'lodash'
import { defaultPayload } from './static'
import { useExpertPersonnelDataStore } from '@/stores/vendor/vendor'
import { useRoute } from 'vue-router'

const props = defineProps<{ id: number }>()
const emit = defineEmits(['onSuccess', 'onError', 'onClose'])
const expertStore = useExpertPersonnelDataStore()
const payload = ref<PayloadExportPersonnelDataType>(cloneDeep(defaultPayload))
const route = useRoute()

const deleteLoading = ref(false)

const onDelete = async () => {
  deleteLoading.value = true

  payload.value = {
    ...payload.value,
    isActive: false,
  }

  try {
    await expertStore.update(payload.value)
    emit('onSuccess')
    // await expertStore.getData(Number(route.params.id))
  } catch (error) {
    if (error instanceof Error) {
      emit('onError')
    }
  } finally {
    deleteLoading.value = false
    onClose()
  }
}
const onClose = () => {
  const idModal = document.querySelector('#modal-delete')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emit('onClose')
}

watch(
  () => props.id,
  async (newId) => {
    const selectedItem = expertStore.data.items.find((data) => data.id === newId)

    if (selectedItem) {
      const certificates = await expertStore.getCertificates(selectedItem.id)
      payload.value = {
        ...payload.value,
        name: selectedItem.name,
        address: selectedItem.address,
        dateOfBirth: selectedItem.dateOfBirth,
        education: selectedItem.education,
        expertise: selectedItem.expertise,
        gender: selectedItem.gender.toLocaleLowerCase(),
        id: selectedItem.id,
        nationality: selectedItem.nationality,
        position: selectedItem.position,
        status: selectedItem.status,
        certificates: !certificates.result.isError
          ? certificates?.result.content.map((certi) => ({
              vendorExpertId: certi.vendorExpertsID,
              description: certi.description,
              docUrl: certi.docUrl,
              endDate: certi.endDate,
              id: certi.id,
              isActive: certi.isActive,
              startDate: certi.startDate,
              type: certi.type,
            }))
          : [],
      }
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <div class="modal" data-modal="true" id="modal-delete" data-modal-backdrop-static="true">
    <div class="modal-content modal-center-y w-full md:w-[500px]">
      <div class="modal-body !py-10 flex flex-col items-center gap-2">
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
        <div class="flex gap-3 px-8 w-full">
          <UiButton outline class="flex-1 flex items-center justify-center" @click="onClose">
            <UiIcon name="black-left-line" />
            <span>Cancel</span>
          </UiButton>
          <UiButton
            variant="danger"
            class="flex-1 flex items-center justify-center"
            @click="onDelete"
            :disabled="deleteLoading"
          >
            <UiLoading variant="white" v-if="deleteLoading" />
            <UiIcon name="cross-circle" variant="duotone" v-else />
            <span>Delete</span>
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
