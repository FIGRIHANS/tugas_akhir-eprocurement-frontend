<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRoute, useRouter } from 'vue-router'
import UiActions from './UiActions.vue'
import { onMounted, ref } from 'vue'
import ModalForm from './ModalForm.vue'
import { tableCols } from './static'
import useExperienceStore from '@/stores/vendor/experience'

const router = useRouter()
const route = useRoute()
const experienceStore = useExperienceStore()

const mode = ref<'add' | 'view' | 'edit'>('add')
const selectedId = ref<number>(0)

const modalForm = ref<boolean>(false)

const openModalForm = (newMode: 'add' | 'view' | 'edit', id?: number) => {
  modalForm.value = true
  mode.value = newMode

  if (id) {
    selectedId.value = id
  }
}

onMounted(() => {
  experienceStore.getData(Number(route.params.id))
})
</script>

<template>
  <div class="space-y-5">
    <div class="card">
      <div class="card-header">
        <div class="card-title">Experience Projects</div>
        <div>
          <UiButton @click="openModalForm('add')">
            <UiIcon name="plus-circle" variant="duotone" />
            <span>Add</span>
          </UiButton>
        </div>
      </div>
      <div class="card-body space-y-3">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Completed Projects</div>
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
              <tbody>
                <tr>
                  <td>
                    <UiActions
                      :id="1"
                      @on-view="openModalForm('view')"
                      @on-edit="openModalForm('edit')"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Ongoing Projects</div>
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
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <UiButton :outline="true" @click="router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span>Back</span>
      </UiButton>
    </div>
  </div>

  <!-- modal add experience data -->
  <ModalForm v-model="modalForm" />
</template>
