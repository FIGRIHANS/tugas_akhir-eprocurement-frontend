<template>
  <div class="invoice-content-skeleton flex flex-col gap-[24px]" aria-hidden="true">
    <div class="flex flex-col gap-[24px] lg:flex-row animate-pulse">
      <div class="flex w-full flex-col gap-[24px] lg:w-[60%]">
        <div class="rounded-xl border border-gray-200 p-[24px]">
          <div class="mb-4 h-5 w-40 rounded bg-gray-200"></div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="i in 6" :key="`header-left-${i}`" class="space-y-2">
              <div class="h-3 w-24 rounded bg-gray-200"></div>
              <div class="h-10 w-full rounded bg-gray-100"></div>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 p-[24px]">
          <div class="mb-4 h-5 w-36 rounded bg-gray-200"></div>
          <div class="space-y-3">
            <div v-for="i in 4" :key="`calc-${i}`" class="flex items-center justify-between gap-4">
              <div class="h-4 w-32 rounded bg-gray-200"></div>
              <div class="h-4 w-28 rounded bg-gray-100"></div>
            </div>
            <div class="mt-2 h-12 w-full rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-[20px] rounded-xl bg-gray-100 p-[24px] animate-pulse">
        <div v-for="i in 4" :key="`side-${i}`" class="space-y-2">
          <div class="h-3 w-28 rounded bg-gray-200"></div>
          <div class="h-10 w-full rounded bg-gray-200/70"></div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 p-[24px]">
      <div class="mb-4 h-5 w-44 rounded bg-gray-200 animate-pulse"></div>
      <div class="overflow-x-auto">
        <table class="table align-middle w-full text-sm">
          <thead class="animate-pulse">
            <tr>
              <th v-for="i in 10" :key="`pogr-head-${i}`" class="py-3">
                <div class="h-4 rounded bg-gray-200"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <TableListSkeleton :columns="10" :rows="3" />
          </tbody>
        </table>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 p-[24px]">
      <div class="mb-4 h-5 w-36 rounded bg-gray-200 animate-pulse"></div>
      <div class="overflow-x-auto">
        <table class="table align-middle w-full text-sm">
          <thead class="animate-pulse">
            <tr>
              <th v-for="i in 7" :key="`cost-head-${i}`" class="py-3">
                <div class="h-4 rounded bg-gray-200"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <TableListSkeleton :columns="7" :rows="2" />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TableListSkeleton from '@/components/skeleton/TableListSkeleton.vue'
</script>
