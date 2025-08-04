<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import useOtherDocStore from '@/stores/vendor/otherDocuments'
import { computed, ref } from 'vue'

type Props = {
  id: number
}

const props = defineProps<Props>()
const model = defineModel()
const emit = defineEmits(['onSuccess', 'onError'])

const otherDocStore = useOtherDocStore()
const loading = ref(false)

const selectedItem = computed(() => otherDocStore.data.find((item) => (item.id = props.id)))

const onDelete = async () => {
  loading.value = true

  try {
    await otherDocStore.update({
      id: props.id,
      isActive: false,
      remark: 'dihapus',
      documentName: selectedItem.value?.documentName,
      documentNo: selectedItem.value?.documentNo,
      documentUrl: selectedItem.value?.documentUrl,
      validDate: selectedItem.value?.issuedUTCDate,
      issuedDate: selectedItem.value?.issuedUTCDate,
      expiredUTCDate: selectedItem.value?.expiredUTCDate,
    })
    emit('onSuccess')
  } catch (error) {
    if (error instanceof Error) {
      emit('onError')
    }
  } finally {
    loading.value = false
    model.value = false
  }
}
</script>

<template>
  <UiModal v-model="model" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">Are You Sure You Want to Delete This Item?</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      This action will permanently remove the selected data from the list.
    </p>
    <div class="flex gap-3 px-8 mb-3">
      <UiButton outline @click="model = false" class="flex-1 flex items-center justify-center">
        <UiIcon name="black-left-line" />
        <span>Cancel</span>
      </UiButton>
      <UiButton
        variant="danger"
        class="flex-1 flex items-center justify-center"
        @click="onDelete"
        :disabled="loading"
      >
        <UiLoading variant="white" v-if="loading" />
        <UiIcon name="cross-circle" variant="duotone" v-else />
        <span>Delete</span>
      </UiButton>
    </div>
  </UiModal>
</template>
