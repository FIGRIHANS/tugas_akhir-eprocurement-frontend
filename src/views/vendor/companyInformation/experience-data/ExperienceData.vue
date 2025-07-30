<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRoute, useRouter } from 'vue-router'
import UiActions from './UiActions.vue'
import { computed, onMounted, ref } from 'vue'
import ModalForm from './ModalForm.vue'
import { tableCols } from './static'
import useExperienceStore from '@/stores/vendor/experience'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import { formatDate } from '@/composables/date-format'

const router = useRouter()
const route = useRoute()
const experienceStore = useExperienceStore()

const mode = ref<'add' | 'view' | 'edit' | 'delete'>('add')
const selectedId = ref<number>(0)

const modalForm = ref<boolean>(false)
const errorModal = ref<boolean>(false)
const successModal = ref<boolean>(false)

const completedExp = computed(() =>
  experienceStore.data.filter((item) => item.value === 'COMPLETED'),
)
const onGoingExp = computed(() => experienceStore.data.filter((item) => item.value === 'ON GOING'))

const openModalForm = (newMode: 'add' | 'view' | 'edit', id?: number) => {
  modalForm.value = true
  mode.value = newMode

  if (id) {
    selectedId.value = id
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
              <tbody class="text-nowrap">
                <tr v-for="item in completedExp" :key="item.id">
                  <td>
                    <UiActions
                      :id="item.id"
                      @on-view="openModalForm('view')"
                      @on-edit="openModalForm('edit')"
                    />
                  </td>
                  <td>{{ item.contractName }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ item.agency }}</td>
                  <td>{{ item.contractValue }}</td>
                  <td>{{ item.businessFieldName }}</td>
                  <td>{{}}</td>
                  <td>{{ formatDate(item.startDate) }}</td>
                  <td>{{ formatDate(item.endDate) }}</td>
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
              <tbody class="text-nowrap">
                <tr v-for="item in onGoingExp" :key="item.id">
                  <td>
                    <UiActions
                      :id="item.id"
                      @on-view="openModalForm('view')"
                      @on-edit="openModalForm('edit')"
                    />
                  </td>
                  <td>{{ item.contractName }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ item.agency }}</td>
                  <td>{{ item.contractValue }}</td>
                  <td>{{ item.businessFieldName }}</td>
                  <td>{{}}</td>
                  <td>{{ formatDate(item.startDate) }}</td>
                  <td>{{ formatDate(item.endDate) }}</td>
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
        <span>Back</span>
      </UiButton>
    </div>
  </div>

  <!-- modal add experience data -->
  <ModalForm
    v-model="modalForm"
    :vendor-id="Number($route.params.id)"
    @on-error="() => (errorModal = true)"
    @on-success="() => (successModal = true)"
  />

  <!-- Error modal -->
  <UiModal v-model="errorModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">
      Failed to {{ mode == 'delete' ? 'Delete' : mode === 'edit' ? 'Change' : 'Add' }} Experience
      data!
    </h3>
    <p class="text-center text-base text-gray-600 mb-5">
      Please try again later or contact support if the problem persists.
    </p>
  </UiModal>

  <!-- Success Modal -->
  <UiModal v-model="successModal" size="sm" @update:model-value="onSuccess">
    <ModalSuccessLogo class="mx-auto" />
    <h3 class="text-center text-lg font-medium">Hooray!</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      The data has been successfully updated in the admin system.
    </p>
  </UiModal>
</template>
