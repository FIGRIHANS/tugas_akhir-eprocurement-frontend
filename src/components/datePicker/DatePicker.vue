<template>
  <div
    :class="[
      'relative',
      {
        'min-w-[0px] w-full flex items-center flex-wrap lg:flex-nowrap gap-2.5': !labelTop,
      },
    ]"
  >
    <label
      v-if="label"
      :class="{
        'text-[11px] px-[3px] text-gray-500 bg-white absolute z-50 -top-[6px] left-[7px] leading-[12px]':
          label && labelTop,
        'form-label flex items-center gap-1 w-2/5': label && !labelTop,
      }"
    >
      {{ label }}
      <span v-if="required" class="text-danger"> * </span>
    </label>
    <VueDatePicker
      v-model="date"
      :enable-time="false"
      :format="format"
      :range="range"
      :months="range ? 2 : undefined"
      :columns="range ? 2 : undefined"
      :multi-calendars="range ? 2 : undefined"
      :months-to-show="props.monthsToShow"
      :preview-format="format"
      :min-date="minDate"
      :max-date="maxDate"
      class="w-full"
      :teleport="teleport"
    >
      <template #dp-input="{ value }">
        <div class="input relative" :class="{ 'border-danger': error || !!validationError }">
          <input
            :placeholder="placeholder"
            :value="value"
            readonly
            class="min-w-[0px]"
            :disabled="disabled"
          />
          <button class="btn btn-icon">
            <i class="ki-filled ki-calendar"></i>
          </button>
        </div>
      </template>
    </VueDatePicker>
    <div class="mt-2 text-sm text-red-500" v-if="validationError">{{ validationError }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: Date | string | Array<string | Date> | null
    error?: boolean
    label?: string
    required?: boolean
    placeholder?: string
    format?: string
    disabled?: boolean
    minDate?: Date | string
    labelTop?: boolean
    maxDate?: Date | string
    range?: boolean
    monthsToShow?: number
    teleport?: boolean
    minDays?: number
  }>(),
  {
    placeholder: 'Select',
    minDays: 0
  }
)

const emits = defineEmits(['update:modelValue', 'change'])

const date = ref<Date | string | Array<string | Date> | null>('')
const validationError = ref<string | null>(null)

const getToday = (): Date => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const toRange = (val: unknown): [Date | null, Date | null] => {
  if (!val || val === '') {
    return [getToday(), null]
  }
  if (Array.isArray(val)) {
    const start = val[0] ? (val[0] instanceof Date ? val[0] : new Date(String(val[0]))) : getToday()
    const end = val[1] ? (val[1] instanceof Date ? val[1] : new Date(String(val[1]))) : null
    return [start, end]
  }
  const singleDate = val instanceof Date ? val : new Date(String(val))
  return [singleDate, null]
}

function toMidnightDate(input: Date | string | null): Date | null {
  if (!input) return null
  const d = input instanceof Date ? input : new Date(String(input))
  if (isNaN(d.getTime())) return null
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysInclusive(start: Date | string | null, end: Date | string | null) {
  const s = toMidnightDate(start)
  const e = toMidnightDate(end)
  if (!s || !e) return 0
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((e.getTime() - s.getTime()) / msPerDay) + 1
}

watch(
  () => props.modelValue,
  () => {
    if (props.range && props.minDays > 0) {
      date.value = toRange(props.modelValue)
    } else {
      date.value = props.modelValue
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => date.value,
  (newVal) => {
    // Validasi untuk range dengan minDays
    if (props.range && props.minDays > 0 && Array.isArray(newVal)) {
      const [start, end] = newVal || [null, null]
      if (start && end) {
        const len = daysInclusive(start, end)
        if (len < props.minDays) {
          validationError.value = `Durasi minimal ${props.minDays} hari`
        } else {
          validationError.value = null
          emits('update:modelValue', [start, end])
          emits('change', [start, end])
        }
      } else {
        validationError.value = null
        emits('update:modelValue', [start, end])
        emits('change', [start, end])
      }
    } else {
      validationError.value = null
      emits('update:modelValue', date.value)
      emits('change', date.value)
    }
  },
)

onMounted(() => {
  if (props.range && props.minDays > 0) {
    const rangeVal = Array.isArray(date.value) ? date.value : toRange(date.value)
    const [start, end] = rangeVal
    if (!start) {
      date.value = [getToday(), end || null]
      emits('update:modelValue', date.value)
    }
  }
})
</script>

<style lang="scss" scoped>
@use './styles/datepicker.scss';
</style>
