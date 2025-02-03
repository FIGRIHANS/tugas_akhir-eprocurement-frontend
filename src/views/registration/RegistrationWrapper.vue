<template>
  <UiTab
    v-model="tab.active"
    :items="tab.items"
    class="justify-center bg-secondary-active mb-7.5"
    numbering
    @update:model-value="changeTab"
  />
  <h1 class="text-center text-[22px] font-semibold pb-7.5 mb-6 border-b border-gray-300">
    eProcurement - Registration
  </h1>

  <div class="flex justify-center">
    <div class="w-[1440px] xl:px-[150px] sm:px-[40px]">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useNavbarUtilsStore } from '@/stores/navbar'
import { onBeforeMount, onUnmounted, reactive } from 'vue'

import UiTab from '@/components/ui/atoms/tab/UiTab.vue'

const router = useRouter()

const tab = reactive({
  active: 'registration__information',
  items: [
    {
      label: 'Information',
      value: 'registration__information',
      itemClass: 'font-bold',
      disabled: false,
    },
    { label: 'Contact', value: 'registration__contact', disabled: false },
    { label: 'Document & Legal', value: 'registration__document-and-legal', disabled: false },
    { label: 'Payment Detail', value: 'registration__payment-detail', disabled: false },
  ],
})

const changeTab = (value: string) => {
  router.push({ name: value })
}

/**SECTION - Navbar utils */
const navbarUtils = useNavbarUtilsStore()

onBeforeMount(() => navbarUtils.setFull())
onUnmounted(() => navbarUtils.setNotFull())
/**!SECTION */
</script>
