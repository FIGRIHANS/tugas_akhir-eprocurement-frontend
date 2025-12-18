<template>
    <div class="card flex-1 h-fit">
        <div class="card-header flex justify-between items-center gap-[10px] py-[16px] px-[20px]">
            <span class="font-semibold text-base whitespace-nowrap">Payment Status</span>
        </div>
        <div class="card-body p-[0px]">
            <div class="flex">
                <div class="flex flex-col flex-1">
                    <div v-for="(item, index) in listPaymentStatus" :key="index"
                        class="border-b border-gray-200 py-[22px] px-[20px] text-xs flex"
                        :class="index === listPaymentStatus.length - 1 ? 'calculation__last-field' : ''">
                        <div class="flex-1">{{ item.name }}</div>
                        <div class="flex-1">{{ form?.currency === 'IDR' ? useFormatIdr(item.amount) :
                            useFormatUsd(item.amount) }}</div>
                        <div>{{ item.currency }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const form = inject<formTypes>('form')

interface PaymentStatusItem {
    name: string
    amount: string
    currency: string
}

const listPaymentStatus = ref<PaymentStatusItem[]>([])

const setPaymentStatus = () => {
    // Mock data for payment status
    listPaymentStatus.value = [
        {
            name: 'Total Invoice',
            amount: '10000',
            currency: form?.currency || 'IDR'
        },
        {
            name: 'Payment Received',
            amount: '300',
            currency: form?.currency || 'IDR'
        },
        {
            name: 'Outstanding Payment',
            amount: '9700',
            currency: form?.currency || 'IDR'
        }
    ]
}

onMounted(() => {
    setPaymentStatus()
})
</script>

<style lang="scss" scoped>
.calculation__last-field {
    background-color: #f9fafb;
    font-weight: 600;
}
</style>
