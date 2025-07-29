<template>
  <div class="flex flex-col gap-1">
    <label class="text-[11px] px-[3px] text-gray-500 leading-[12px]"
      >{{ label }}<span v-if="required" class="text-danger"> * </span></label
    >
    <div
      class="flex"
      :class="inline ? 'flex-row items-center gap-4 justify-between' : 'flex-col items-start gap-4'"
    >
      <label
        v-for="(item, index) in options"
        :key="index"
        class="form-label flex items-center gap-2.5"
      >
        <input
          v-model="model"
          type="radio"
          class="radio"
          :class="{
            'radio-sm': size === 'sm',
            'radio-lg': size === 'lg',
            '!border-danger': error,
          }"
          :name="name"
          :value="item[valueKey]"
          :disabled="item?.disabled"
        />
        {{ item[textKey] }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
type UiRadioType = {
  label: string
  name: string
  inline?: boolean
  required?: boolean
  options: { [key: string]: any }[]
  valueKey?: string
  textKey?: string
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

withDefaults(defineProps<UiRadioType>(), {
  textKey: 'text',
  valueKey: 'value',
  size: 'md',
})
const model = defineModel()
</script>
