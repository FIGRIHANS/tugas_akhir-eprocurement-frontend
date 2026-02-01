<template>
    <div>
        <BreadcrumbView title="Activity Expenses" :routes="[{ name: 'Activity Expenses', to: '#' }]" />

        <div class="card">
            <div class="card-header">
                <div class="flex w-full justify-between items-center">
                    <h2 class="text-lg font-bold text-slate-800">Activity Expenses</h2>
                    <div class="flex gap-2">
                        <UiInputSearch v-model="search" placeholder="Search Activity" />
                        <FilterList :data="filterForm" @setData="setDataFilter" ref="filterChild" />
                        <UiButton variant="primary" @click="openRoleModal()">
                            <UiIcon variant="duotone" name="plus" />
                            Add Activity
                        </UiButton>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <table v-if="paginatedActivityList.length > 0" class="table align-middle text-gray-700">
                    <thead>
                        <tr>
                            <th></th>
                            <th class="text-nowrap">Activity Code</th>
                            <th class="text-nowrap">Activity Name</th>
                            <th class="text-nowrap">Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="activity in paginatedActivityList" :key="activity.id">
                            <td>
                                <div class="flex items-center space-x-3">
                                    <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click"
                                        data-dropdown-placement="bottom-end">
                                        <UiButton class="dropdown-toggle" variant="light" :outline="true" :icon="true"
                                            size="sm">
                                            <UiIcon name="dots-vertical" />
                                        </UiButton>

                                        <div class="dropdown-content w-auto p-4 space-y-2">
                                            <div class="flex flex-col space-y-2">
                                                <UiButton variant="light" class="border-none" :outline="true" size="md"
                                                    @click="openRoleModal(activity)">
                                                    <UiIcon name="pencil" class="mr-2" />
                                                    Edit Activity
                                                </UiButton>

                                                <UiButton variant="light"
                                                    class="border-none text-red-500 hover:text-red-600" :outline="true"
                                                    size="md" @click="openDeleteModal(activity)">
                                                    <UiIcon name="trash" class="mr-2" />
                                                    Delete Activity
                                                </UiButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ activity.code }}</td>
                            <td>{{ activity.name }}</td>
                            <td>{{ new Date('12-04-2024').toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>

                <div v-else class="text-center py-4">No roles found.</div>

                <!-- PAGINATION ACTIVITY -->
                <LPagination :totalItems="totalActivity" :pageSize="activityPageSize" :currentPage="activityPage"
                    @page-change="handleActivityPageChange" />
            </div>
        </div>

        <!-- ADD / EDIT MODAL -->
        <UiModal :title="modalTitle" v-model="isModalOpen" @update:model-value="closeRoleModal" size="sm">
            <UiInput label="Activity Name" placeholder="Enter activity name" row required v-model="activityPayload.name"
                :error="roleNameError !== ''" :hint-text="roleNameError" @input="validateRoleName()" />
            <div class="mt-4 w-full gap-2 justify-end items-center flex">
                <UiButton outline @click="closeRoleModal">Cancel</UiButton>
                <UiButton variant="primary" @click="saveRole" :disabled="isSaving">
                    <span v-if="isSaving">Saving...</span>
                    <span v-else>Save</span>
                </UiButton>
            </div>
        </UiModal>

        <!-- SUCCESS MODAL -->
        <UiModal v-model="showModalSuccess" size="sm">
            <img :src="successImg" alt="success" class="mx-auto mb-3" />
            <h3 class="font-medium text-lg text-gray-800 text-center">
                Role successfully {{ activityPayload.id === '' ? 'Created' : 'Updated' }}
            </h3>
        </UiModal>

        <!-- DELETE MODAL -->
        <UiModal v-model="showDeleteModal" size="sm">
            <div class="text-center mb-6">
                <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
            </div>
            <h3 class="text-center text-lg font-medium">
                Are you sure to delete this activity?
            </h3>
            <p class="text-center text-base text-gray-600 mb-5">
                This action will permanently deactivate
                <strong v-if="roleToDelete">
                    {{ roleToDelete.roleName }}
                </strong>.
            </p>
            <div class="flex gap-3 px-8 mb-3">
                <UiButton outline @click="showDeleteModal = false" class="flex-1">
                    Cancel
                </UiButton>
                <UiButton variant="danger" class="flex-1" @click="handleProcessDelete" :disabled="isDeleting">
                    <span v-if="isDeleting">Deleting...</span>
                    <span v-else>Delete</span>
                </UiButton>
            </div>
        </UiModal>
    </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useUserRoleStore } from '@/stores/user-management/role'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import type { IRole } from '@/stores/user-management/types/role'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import successImg from '@/assets/success.svg'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterList from './filter/filterList.vue'
import type { filterListTypes } from '../types/activity'




const search = ref('')
// const userRoleStore = useUserRoleStore()
const invoiceMasterData = useInvoiceMasterDataStore()

const isModalOpen = ref(false)
const showModalSuccess = ref(false)
const showDeleteModal = ref(false)
const roleToDelete = ref<IRole | null>(null)
const isDeleting = ref(false)

const activityList = ref([])

const filterForm = ref<filterListTypes>({
    companyCode: ''
}
)

/* ================= PAGINATION ACTIVITY (ADDED) ================= */
const activityPage = ref(1)
const activityPageSize = ref(10)

const filteredActivityList = computed(() => {
    const q = search.value.toLowerCase().trim()
    if (!q) return activityList.value
    return activityList.value.filter(
        (a) =>
            a.code.toLowerCase().includes(q) ||
            a.name.toLowerCase().includes(q)
    )
})

const totalActivity = computed(() => filteredActivityList.value.length)

const paginatedActivityList = computed(() => {
    const start = (activityPage.value - 1) * activityPageSize.value
    return filteredActivityList.value.slice(
        start,
        start + activityPageSize.value
    )
})

const handleActivityPageChange = (page: number) => {
    activityPage.value = page
}

watch([search, activityList], () => {
    activityPage.value = 1
})
/* =============================================================== */

const activityPayload = reactive<{
    id: string
    name: string
    isActive: boolean
}>({
    id: '',
    name: '',
    isActive: true,
})

interface Iactivity {
    id: string
    code: string
    name: string
    isActive: boolean
}

const roleNameError = ref('')
const isSaving = ref(false)

const modalTitle = computed(() =>
    activityPayload.id === '' ? 'Add New Activity' : 'Edit Activity'
)

// const filteredRoles = computed(() => {
//     const items = userRoleStore.roles?.items ?? []
//     const q = search.value.toLowerCase().trim()
//     if (!q) return items
//     return items.filter((r) => r.roleName.toLowerCase().includes(q))
// })

const closeAnyOpenDropdown = () => {
    const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true })
    document.body.dispatchEvent(event)
}

const resetRolePayload = () => {
    activityPayload.id = ''
    activityPayload.name = ''
    activityPayload.isActive = true
    roleNameError.value = ''
}

const openRoleModal = (role?: Iactivity) => {
    closeAnyOpenDropdown()
    if (role) {
        activityPayload.id = role.id
        activityPayload.name = role.name
        activityPayload.isActive = role.isActive
    } else {
        resetRolePayload()
    }
    isModalOpen.value = true
}

const closeRoleModal = () => {
    isModalOpen.value = false
    resetRolePayload()
}

const validateRoleName = () => {
    if (!activityPayload.name.trim()) {
        roleNameError.value = 'Activity name cannot be empty!'
        return false
    }
    roleNameError.value = ''
    return true
}

const saveRole = async () => {
    if (!validateRoleName()) return
    isSaving.value = true
    // try {
    //     await userRoleStore.postUserRole(activityPayload)
    //     closeRoleModal()
    //     showModalSuccess.value = true
    //     await userRoleStore.getAllUserRoles({
    //         page: 1,
    //         pageSize: 10,
    //     })
    // } finally {
    //     isSaving.value = false
    // }

    isSaving.value = false
    isModalOpen.value = false
    activityPayload.id = ''
    activityPayload.name = ''
    activityPayload.isActive = true
    roleNameError.value = ''
    showModalSuccess.value = true
}

function openDeleteModal(role: IRole) {
    closeAnyOpenDropdown()
    roleToDelete.value = role
    showDeleteModal.value = true
}

async function handleProcessDelete() {
    if (!roleToDelete.value) return
    isDeleting.value = true
    // try {
    //     await userRoleStore.postUserRole({
    //         roleId: roleToDelete.value.roleId,
    //         roleName: roleToDelete.value.roleName,
    //         isActive: false,
    //     })
    //     showDeleteModal.value = false
    //     roleToDelete.value = null
    //     await userRoleStore.getAllUserRoles({
    //         page: 1,
    //         pageSize: 10,
    //     })
    // } finally {
    //     isDeleting.value = false
    // }

    isDeleting.value = false
    showDeleteModal.value = false
    roleToDelete.value = null
}

const setDataFilter = async (data: filterListTypes) => {
    filterForm.value = data

    // reset pagination
    activityPage.value = 1

    // panggil API pakai companyCode hasil filter
    const result = await invoiceMasterData.getActivity(data.companyCode)
    activityList.value = result.content ?? []
}



onMounted(async () => {
    const result = await invoiceMasterData.getActivity(filterForm.value.companyCode || 'MF00')
    activityList.value = result.content
})
</script>


<style scoped></style>
