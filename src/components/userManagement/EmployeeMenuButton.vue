<template>
  <div class="flex items-center space-x-3">
    <div
      class="dropdown"
      data-dropdown="true"
      data-dropdown-trigger="click"
      data-dropdown-placement="bottom-end"
    >
      <UiButton class="dropdown-toggle" variant="light" :outline="true" :icon="true" size="sm">
        <UiIcon name="dots-vertical" />
      </UiButton>
      <div class="dropdown-content w-auto p-4 space-y-5">
        <div class="flex flex-col space-y-2">
          <UiButton
            variant="light"
            class="border-none"
            :outline="true"
            size="md"
            @click="handleDetailEmployee(props.employeeData)"
          >
            <UiIcon variant="duotone" name="eye" />
            Detail Employee
          </UiButton>
          <UiButton variant="light" class="border-none" :outline="true" size="md">
            <UiIcon variant="duotone" name="pencil" />

            Edit Employee
          </UiButton>
          <UiButton
            variant="light"
            class="border-none text-red-500 hover:text-red-600"
            :outline="true"
            size="md"
            @click="openDeleteModal(props.employeeData)"
          >
            <UiIcon variant="duotone" name="trash" style="color: red" />

            Delete Employee
          </UiButton>
        </div>
      </div>
    </div>
  </div>

  <!-- modal confirm delete -->
  <UiModal v-model="showDeleteModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">Are you sure to delete this employee?</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      This action will permanently deactivate
      <strong v-if="employeeToDelete">{{ employeeToDelete.employeeName }}</strong
      >.
    </p>
    <div class="flex gap-3 px-8 mb-3">
      <UiButton
        outline
        @click="showDeleteModal = false"
        class="flex-1 flex items-center justify-center"
      >
        <UiIcon name="black-left-line" />
        <span>Cancel</span>
      </UiButton>
      <UiButton
        variant="danger"
        class="flex-1 flex items-center justify-center"
        @click="handleProcessDelete"
        :disabled="isDeleting"
      >
        <UiLoading v-if="isDeleting" variant="white" />
        <template v-else>
          <UiIcon name="cross-circle" variant="duotone" />
          <span>Delete</span>
        </template>
      </UiButton>
    </div>
  </UiModal>

  <!-- modal success -->
  <UiModal v-model="showModalSuccess" size="sm">
    <div class="text-center mb-6">
      <ModalSuccessLogo class="mx-auto" />
      <h3 class="text-center text-lg font-medium">Yeayyy</h3>
      <p class="text-center text-base text-gray-600 mb-5">Employee successfully created</p>
    </div>
  </UiModal>

  <!-- modal error -->
  <UiModal v-model="showErrorModal" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">Oppss!!</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ employeeStore.errorEmployee }}
    </p>
  </UiModal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import UiButton from '../ui/atoms/button/UiButton.vue'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'
import type { IEmployee } from '@/stores/user-management/types/employee'
import UiModal from '../modal/UiModal.vue'
import { ref } from 'vue'
import { useEmployeeStore } from '@/stores/user-management/employee'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

const router = useRouter()
const employeeStore = useEmployeeStore()

const props = defineProps<{
  employeeData: IEmployee
}>()

const showModalSuccess = ref(false)
const showDeleteModal = ref(false)
const showErrorModal = ref(false)
const employeeToDelete = ref<IEmployee>(null)
const isDeleting = ref(false)

const handleDetailEmployee = (employee: IEmployee) => {
  router.push({
    name: 'user-management-master-employee-detail',
    params: {
      id: employee.employeeId,
    },
  })
}

const openDeleteModal = (employee: IEmployee) => {
  closeAnyOpenDropdown()
  employeeToDelete.value = employee
  showDeleteModal.value = true
}

const handleProcessDelete = async () => {
  if (!employeeToDelete.value) return
  isDeleting.value = true
  try {
    const { statusCode } = await employeeStore.storeEmployee({
      employeeId: employeeToDelete.value.employeeId,
      EmployeeName: employeeToDelete.value.employeeName,
      EmployeeEmail: employeeToDelete.value.employeeEmail,
      PositionName: employeeToDelete.value.positionName,
      CompanyCode: employeeToDelete.value.companyCode,
      CostCenter: employeeToDelete.value.costCenter,
      isActive: false,
    })

    if (statusCode === 200) {
      showDeleteModal.value = false
      showModalSuccess.value = true
    }
  } catch (error: unknown) {
    showErrorModal.value = true
    console.log(error)
  } finally {
    isDeleting.value = false
    showDeleteModal.value = false
  }
}

const closeAnyOpenDropdown = () => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
  document.body.dispatchEvent(event)
}
</script>

<style scoped></style>
