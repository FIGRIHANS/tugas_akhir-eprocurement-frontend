<template>
  <div>
    <BreadcrumbView
      title="Payment Information"
      :routes="[
        { name: 'Company Information', to: '/company-information' },
        { name: 'Payment Information Data', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <h2 class="text-md font-bold text-slate-800">Payment Information</h2>
        <div class="flex">
          <UiButton variant="primary" outline>
            <UiIcon variant="duotone" name="plus-circle" />
            Add Data</UiButton
          >
        </div>
      </div>
      <div class="card-body">
        <table class="table align-middle text-gray-700">
          <thead class="border-b-2 border-b-primary">
            <tr>
              <th></th>
              <th class="text-nowrap">No</th>
              <th class="text-nowrap">Account No.</th>
              <th class="text-nowrap">Account Holder Name</th>
              <th class="text-nowrap">SwiftCode</th>
              <th class="text-nowrap">Account Discrepancy Statement</th>
              <th class="text-nowrap">Account Cover</th>
              <th class="text-nowrap">Currentcy</th>
              <th class="text-nowrap">Bank Key</th>
              <th class="text-nowrap">Bank Name</th>
              <th class="text-nowrap">Bank Branch</th>
              <th class="text-nowrap">Bank Address</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>

    <!-- action button -->
    <div class="w-full flex justify-end items-center">
      <div class="flex items-center gap-4">
        <UiButton variant="primary" outline>
          <UiIcon variant="duotone" name="black-left" />
          Back</UiButton
        >
        <UiButton variant="primary">
          <UiIcon variant="duotone" name="plus" />
          Save</UiButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
</script>

<style scoped></style>
