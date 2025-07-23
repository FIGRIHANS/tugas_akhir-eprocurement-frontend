<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
</script>

<template>
  <div>
    <BreadcrumbView
      title="Company Information"
      :routes="[
        { name: 'Company Information', to: '/company-information' },
        { name: 'Business License Data', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <h2 class="text-lg font-semibold text-slate-800">Company Deed Data</h2>
      </div>
      <div class="card-body">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque corporis repudiandae
        quia amet inventore sequi recusandae harum magnam laborum saepe error tempora obcaecati,
        iste rerum laboriosam! Necessitatibus quo atque recusandae?
      </div>
    </div>
  </div>
</template>
