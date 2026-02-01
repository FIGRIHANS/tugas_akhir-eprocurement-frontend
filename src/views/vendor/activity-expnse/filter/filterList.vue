<template>
    <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
        <button class="dropdown-toggle btn btn-primary">
            <i class="ki-filled ki-filter"></i>
            Filter
        </button>

        <div class="dropdown-content w-full max-w-[305px] p-[16px]">
            <p class="text-lg font-semibold mb-[8px]">Filter</p>

            <div class="flex flex-col gap-[24px] py-[16px]">
                <!-- Company Code ONLY -->
                <div class="relative">
                    <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
                        Company Code
                    </label>

                    <select v-model="companyCode" class="select" name="select">
                        <option value="">All</option>
                        <option v-for="item of companyCodeList" :key="item.code" :value="item.code">
                            {{ item.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="flex align-center justify-between gap-[16px]">
                <button class="btn btn-outline btn-primary btn-lg" @click="resetFilter">
                    <i class="ki-duotone ki-arrows-circle"></i>
                    Reset
                </button>

                <button class="btn btn-primary btn-lg" data-dropdown-dismiss="true" @click="goFilter">
                    <i class="ki-filled ki-check-circle"></i>
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { filterListTypes } from '../../types/activity'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const props = defineProps<{
    data: filterListTypes
}>()

const emits = defineEmits(['setData'])

const invoiceMasterApi = useInvoiceMasterDataStore()

/* ===== STATE ===== */
const companyCode = ref<string>('')

/* ===== OPTIONS ===== */
const companyCodeList = computed(() => invoiceMasterApi.companyCode)

/* ===== ACTIONS ===== */
const resetFilter = () => {
    companyCode.value = ''
}

const resetCompanyCode = () => {
    companyCode.value = ''
}

const goFilter = () => {
    emits('setData', {
        companyCode: companyCode.value,
    })
}

/* ===== SYNC FROM PARENT ===== */
watch(
    () => props.data,
    () => {
        companyCode.value = props.data.companyCode
    },
    {
        deep: true,
        immediate: true,
    }
)

defineExpose({
    resetFilter,
    resetCompanyCode,
    goFilter,
})
</script>