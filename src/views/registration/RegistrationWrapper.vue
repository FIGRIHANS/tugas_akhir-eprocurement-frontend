<template>
  <UiTab
    v-model="tab.active"
    :items="tab.items"
    class="justify-center bg-secondary-active mb-7.5"
    numbering
    step
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

      <div class="flex justify-between mb-[24px]">
        <UiButton outline>Save As Draft <UiIcon name="bookmark" variant="duotone" /></UiButton>
        <div class="flex gap-4">
          <UiButton v-if="showPrevious" outline @click="previous()">
            <UiIcon name="black-left" />
            Kembali
          </UiButton>
          <UiButton v-if="showNext" @click="next()">
            Lanjut <UiIcon name="black-right" />
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useNavbarUtilsStore } from '@/stores/navbar'
import { computed, onBeforeMount, onMounted, onUnmounted, reactive } from 'vue'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const route = useRoute()
const router = useRouter()

const tab = reactive({
  active: 'registration__information',
  items: [
    { label: 'Information', value: 'registration__information', disabled: true },
    { label: 'Contact', value: 'registration__contact', disabled: true },
    { label: 'Document & Legal', value: 'registration__document-and-legal', disabled: true },
    { label: 'Payment Detail', value: 'registration__payment-detail', disabled: true },
  ],
})

const tabPosition = computed(() => {
  return tab.items.findIndex((item) => item.value === tab.active)
})

const showPrevious = computed(() => {
  return tabPosition.value > 0
})

const showNext = computed(() => {
  return tabPosition.value < tab.items.length - 1
})

onMounted(() => {
  tab.active = route.name as string
})

const changeTab = (value: string) => {
  router.push({ name: value })
}

const previous = () => {
  const index = tabPosition.value - 1

  if (index < 0) return

  tab.active = tab.items[index].value
  router.push({ name: tab.items[index].value })
}

const next = () => {
  const index = tabPosition.value + 1

  if (index >= tab.items.length) return

  tab.active = tab.items[index].value
  router.push({ name: tab.items[index].value })
}

/**SECTION - Navbar utils */
const navbarUtils = useNavbarUtilsStore()

onBeforeMount(() => navbarUtils.setFull())
onUnmounted(() => navbarUtils.setNotFull())
/**!SECTION */
</script>
