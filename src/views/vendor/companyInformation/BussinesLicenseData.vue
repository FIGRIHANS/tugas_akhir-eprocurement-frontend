<template>
  <div>
    <PKPTableView :data="vendorLicenseData.data" />
    <OtherDocTableView />

    <!-- alert info start -->
    <div
      class="w-full p-4 rounded-lg bg-primary-light border border-primary flex items-center gap-3"
    >
      <div>
        <img :src="informationIcon" alt="" />
      </div>
      <div>
        <ul class="list-disc list-inside text-sm text-primary font-medium">
          <li>Make sure to click the upload button after selecting the document.</li>
          <li>Fields marked(*) with an asterisk are required</li>
        </ul>
      </div>
    </div>
    <!-- alert info end -->

    <!-- button action -->
    <div class="flex items-center justify-end mt-4 gap-2">
      <UiButton outline>
        <UiIcon variant="duotone" name="black-left" />
        Back</UiButton
      >
      <UiButton variant="primary"
        >Save
        <UiIcon variant="duotone" name="arrow-right" />
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import OtherDocTableView from '@/components/vendor/businessLicenseData/OtherDocTableView.vue'
import PKPTableView from '@/components/vendor/businessLicenseData/PKPTableView.vue'
import { useVendorIzinUsahaStore } from '@/stores/vendor/vendor'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import informationIcon from '@/assets/svg/ic_info_alert.svg'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const vendorLicenseData = useVendorIzinUsahaStore()

console.log(vendorLicenseData)

const route = useRoute()

onMounted(() => {
  vendorLicenseData.getData(route.params.id as string)
})
</script>
