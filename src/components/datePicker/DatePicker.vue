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

let isSyncingFromModel = false

function deepEqualDates(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      const ai = a[i] as Date | string | null | undefined
      const bi = b[i] as Date | string | null | undefined
      if (ai == null && bi == null) continue
      if (ai == null || bi == null) return false
      const an = toMidnightDate(ai as Date | string | null)
      const bn = toMidnightDate(bi as Date | string | null)
      if (!an || !bn) {
        if (String(ai) !== String(bi)) return false
      } else if (an.getTime() !== bn.getTime()) return false
    }
    return true
  }
  const na = toMidnightDate(a as Date | string | null)
  const nb = toMidnightDate(b as Date | string | null)
  if (!na || !nb) return String(a) === String(b)
  return na.getTime() === nb.getTime()
}

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
  (newModel) => {
    isSyncingFromModel = true
    try {
      if (props.range && props.minDays > 0) {
        const converted = toRange(newModel)
        // only assign when different to avoid triggering the other watcher
        if (!deepEqualDates(date.value, converted)) {
          date.value = converted
        }
      } else {
        if (!deepEqualDates(date.value, newModel)) {
          date.value = newModel
        }
      }
    } finally {
      // small tick to ensure other watchers see the change; leave false immediately
      isSyncingFromModel = false
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => date.value,
  (newVal) => {
    // If this change originated from updating props.modelValue, don't re-emit
    if (isSyncingFromModel) return

    // Validasi untuk range dengan minDays
    if (props.range && props.minDays > 0 && Array.isArray(newVal)) {
      const [start, end] = newVal || [null, null]
      if (start && end) {
        const len = daysInclusive(start, end)
        if (len < props.minDays) {
          validationError.value = `Durasi minimal ${props.minDays} hari`
          // Still emit partial value so parent can react if desired, but avoid loops
          emits('update:modelValue', [start, end])
          emits('change', [start, end])
        } else {
          validationError.value = null
          // Only emit when different from props.modelValue
          if (!deepEqualDates(props.modelValue, [start, end])) {
            emits('update:modelValue', [start, end])
            emits('change', [start, end])
          }
        }
      } else {
        validationError.value = null
        if (!deepEqualDates(props.modelValue, [start, end])) {
          emits('update:modelValue', [start, end])
          emits('change', [start, end])
        }
      }
    } else {
      validationError.value = null
      if (!deepEqualDates(props.modelValue, newVal)) {
        emits('update:modelValue', date.value)
        emits('change', date.value)
      }
    }
  },
)

onMounted(() => {
  if (props.range && props.minDays > 0) {
    // ensure there's always a start date when range + minDays is required
    const rangeVal = Array.isArray(date.value) ? date.value : toRange(date.value)
    const [start, end] = rangeVal
    if (!start) {
      // set without triggering watcher emit loop
      isSyncingFromModel = true
      try {
        date.value = [getToday(), end || null]
      } finally {
        isSyncingFromModel = false
      }
      emits('update:modelValue', date.value)
    }
  }
})
</script>

<style lang="scss" scoped>
@use './styles/datepicker.scss';
</style>
