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
      <select
        v-model="countryPhonePrefix"
        class="select rounded-r-none w-1/3"
        :class="{ 'border-danger': error }"
        :readonly="readonly"
        :disabled="disabled"
      >
        <!-- <option hidden :value="countryPhonePrefix">
          {{ countryPhonePrefix ? `+${countryPhonePrefix}` : 'code' }}
        </option> -->
        <option
          v-for="option in countryList"
          :key="option.countryID"
          :value="option.countryPhonePrefix"
        >
          {{
            countryPhonePrefix === option.countryPhonePrefix
              ? `+${countryPhonePrefix}`
              : `${option.countryName} (+${option.countryPhonePrefix})`
          }}
        </option>
      </select>
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
  </div>
</template>

<script lang="ts" setup>
import { computed, defineModel, ref, watch, onMounted, type ModelRef } from 'vue'
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
const model = defineModel()
const vendorMasterDataStore = useVendorMasterDataStore()

const countryPhonePrefix = ref('')
const noTel = ref('')

const countryList = computed(() => vendorMasterDataStore.countryList)

watch([countryPhonePrefix, noTel], () => {
  if (noTel.value) {
    model.value = `+${countryPhonePrefix.value} ${noTel.value}`
  } else {
    model.value = ''
  }
})

watch(model, (newModel) => {
  if (newModel) {
    const splitNoTel = newModel?.split(' ')
    const splitPhonePrefix = splitNoTel?.[0]?.split('+')

    countryPhonePrefix.value = splitPhonePrefix[1]
    noTel.value = splitNoTel[1]
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
