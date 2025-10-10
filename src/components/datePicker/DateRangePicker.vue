<template>
  <div>
    <label v-if="label" class="form-label mb-2">{{ label }}</label>
    <div class="w-full">
      <!-- Reuse existing DatePicker component but enable range and show 2 months side-by-side -->
      <VueDatePicker
        v-model="internalRange"
        :enable-time="false"
        :format="format"
        :range="true"
        :months="2"
        :month-picker="false"
        :columns="2"
        :multi-calendars="2"
        :preview-format="format"
        :min-date="minDate"
        :max-date="maxDate"
        class="w-full"
        :teleport="teleport"
      >
        <template #dp-input="{ value }">
          <div class="input relative w-full" :class="{ 'border-danger': !!validationError }">
            <input
              :placeholder="placeholder"
              :value="value"
              readonly
              class="min-w-[0px] w-full"
            />
            <button class="btn btn-icon">
              <i class="ki-filled ki-calendar"></i>
            </button>
          </div>
        </template>
      </VueDatePicker>
    </div>
    <div class="mt-2 text-sm text-red-500" v-if="validationError">{{ validationError }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'

const props = defineProps({
  // Accept either a single date/string or an array [start, end] to match parent form types
  modelValue: {
    type: [Array, Date, String] as PropType<Date | string | Array<Date | string | null> | null>,
    default: () => [null, null]
  },
  minDate: {
    type: [Date, String] as PropType<Date | string | undefined>,
    default: undefined
  },
  maxDate: {
    type: [Date, String] as PropType<Date | string | undefined>,
    default: undefined
  },
  format: {
    type: String,
    default: 'yyyy/MM/dd'
  },
  placeholder: {
    type: String,
    default: 'Select'
  },
  label: {
    type: String,
    default: ''
  },
  teleport: {
    type: Boolean,
    default: true
  },
  minDays: {
    type: Number,
    default: 7
  }
})

const emits = defineEmits(['update:modelValue', 'change'])

// Get today's date at midnight for default start date
const getToday = (): Date => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// normalize modelValue to an array [start, end]
const toRange = (val: unknown) => {
  if (!val || val === '') {
    // Default: today as start date if nothing is provided
    return [getToday(), null]
  }
  if (Array.isArray(val)) {
    // If first value is missing, use today as default start date
    return [val[0] ?? getToday(), val[1] ?? null]
  }
  // single value -> treat as start with no end yet
  return [val as Date | string, null]
}

const internalRange = ref<Array<Date | string | null>>(toRange(props.modelValue))
const validationError = ref<string | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    internalRange.value = toRange(v)
  },
  { immediate: true }
)

// helper to compute inclusive days
// helper to convert input (Date|string) to a Date at start of day
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
  () => internalRange.value,
  (newVal) => {
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
      // partial selection
      validationError.value = null
      emits('update:modelValue', [start, end])
      emits('change', [start, end])
    }
  },
  { deep: true }
)

// Initialize with today's date if not already set
onMounted(() => {
  const [start, end] = internalRange.value
  if (!start) {
    internalRange.value = [getToday(), end || null]
    emits('update:modelValue', internalRange.value)
  }
})
</script>

<style lang="scss" scoped>
@use './styles/datepicker.scss';
/* small tweaks to align with existing styles */
.form-label { display: block }

/* Ensure the datepicker is wider and properly aligned */
:deep(.dp__main) {
  inline-size: 100%;
}

:deep(.dp__input_wrap) {
  inline-size: 100%;
}
</style>
