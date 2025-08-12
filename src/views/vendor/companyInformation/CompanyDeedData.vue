<script setup lang="ts">
import CompanyDeedSection from '@/components/vendor/companyDeedData/CompanyDeedSection.vue'
import LatestAmendmentSection from '@/components/vendor/companyDeedData/LatestAmendmentSection.vue'
import RatificationKemhumhamSection from '@/components/vendor/companyDeedData/RatificationKemhumhamSection.vue'
import ShareholdersSection from '@/components/vendor/companyDeedData/ShareholdersSection.vue'
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-lg font-semibold text-slate-800">Company Deed Data</h3>
    </div>
    <div class="card-body space-y-4">
      <ShareholdersSection />
      <CompanyDeedSection />
      <LatestAmendmentSection />
      <RatificationKemhumhamSection />
    </div>
  </div>
</template>
