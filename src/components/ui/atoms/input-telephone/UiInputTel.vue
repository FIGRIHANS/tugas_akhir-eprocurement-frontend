<template>
  <div
    :class="[
      'relative',
      {
        'flex items-center flex-wrap lg:flex-nowrap gap-2.5': row,
      },
    ]"
  >
    <label
      v-if="label && !row"
      class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]"
    >
      {{ label }}
    </label>
    <label
      v-else-if="label && row"
      class="form-label w-2/5"
      :class="{ 'flex items-center gap-1': required }"
    >
      {{ label }}
      <span v-if="required" class="text-danger"> * </span>
    </label>
    <div class="input-group w-full">
      <div class="dropdown flex-col relative">
        <button
          class="dropdown-toggle btn btn-light w-32 justify-between flex"
          @click="() => (dropdownOpen = !dropdownOpen)"
        >
          {{ `+${countryPhonePrefix}` }}
          <i class="ki-outline !text-sm" :class="dropdownOpen ? 'ki-up' : 'ki-down'"> </i>
        </button>
        <div
          v-if="dropdownOpen"
          class="dropdown-content flex scrollable-y h-60 w-72 absolute top-12 z-10"
        >
          <div
            v-for="option in countryList"
            :key="option.countryID"
            class="p-2 text-sm cursor-pointer hover:bg-primary-light"
            :class="
              countryPhonePrefix === option.countryPhonePrefix ? 'bg-primary hover:bg-primary' : ''
            "
            @click="selectPhonePrefix(option.countryPhonePrefix)"
          >
            {{ `${option.countryName} (+${option.countryPhonePrefix})` }}
          </div>
        </div>
      </div>
      <input
        v-model="noTel"
        class="input border-l-0 rounded-l-none"
        :class="{ 'border-danger': error }"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        type="number"
      />
    </div>
    <span v-if="hintText" class="form-hint !text-danger">{{ hintText }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineModel, ref, watch, onMounted } from 'vue'
import type { IInputTelProps } from './types/input-tel'

import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

withDefaults(defineProps<IInputTelProps>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
  row: false,
  required: false,
  error: false,
})
const model = defineModel<string>()
const vendorMasterDataStore = useVendorMasterDataStore()

const dropdownOpen = ref<boolean>(false)
const countryPhonePrefix = ref('')
const noTel = ref('')

const countryList = computed(() => vendorMasterDataStore.countryList)

const selectPhonePrefix = (phonePrefix: string) => {
  countryPhonePrefix.value = phonePrefix
  dropdownOpen.value = false
}

watch(
  () => model.value,
  (newModel) => {
    if (newModel) {
      const splitNoTel = newModel?.split(' ')
      const splitPhonePrefix = splitNoTel?.[0]?.split('+')

      countryPhonePrefix.value = splitPhonePrefix[1]
      noTel.value = splitNoTel[1]
    } else {
      noTel.value = ''
    }
  },
  {
    immediate: true,
  },
)

watch([countryPhonePrefix, noTel], () => {
  if (noTel.value) {
    model.value = `+${countryPhonePrefix.value} ${noTel.value}`
  } else {
    noTel.value = ''
  }
})

onMounted(async () => {
  if (countryList.value.length === 0) {
    await vendorMasterDataStore.getVendorCountries()
  }

  countryPhonePrefix.value = '62'
})
</script>
