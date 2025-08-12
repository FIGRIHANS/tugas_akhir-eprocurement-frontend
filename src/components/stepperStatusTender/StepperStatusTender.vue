<template>
  <div class="flex items-center justify-center pb-[24px] ml-[50px]">
    <div v-for="(step, index) in steps" :key="index" class="text-center">
      <div class="flex items-center mb-[8px]">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-full border-2"
          :class="
            step.active
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-gray-200 text-gray-500 border-gray-300'
          "
        >
          <i :class="step.icon"></i>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="w-[120px] h-[5px]"
          :class="steps[index + 1].active ? 'bg-blue-500' : 'bg-gray-300'"
        ></div>
      </div>

      <div
        :class="{
          '-ml-[120px]': index !== steps.length - 1,
          '-ml-[20px]': index === steps.length - 1,
        }"
      >
        <p class="text-[13px] font-medium mb-[8px]">{{ step.label }}</p>
        <p class="text-xs mb-[8px]">{{ moment(step.time).format('DD MMM YYYY') }}</p>
        <p class="text-xs font-bold text-primary">{{ step.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import moment from 'moment'

interface ListStep {
  label: string
  time: string
  name: string
  icon: string
  active: boolean
}

const props = withDefaults(
  defineProps<{
    activeName: string
    role: 'admin' | 'vendor'
  }>(),
  {
    role: 'admin',
  },
)

/* ========= Base steps (tidak diubah) ========= */
const BASE_ADMIN_STEPS: Omit<ListStep, 'active'>[] = [
  {
    label: 'Create Tender Request',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-document',
  },
  { label: 'Published', time: '2025-10-22', name: 'Joko Anwar', icon: 'ki-duotone ki-file-up' },
  {
    label: 'Vendor Submission',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-paper-plane',
  },
  {
    label: 'Vendor Negotiation',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-book-open',
  },
  {
    label: 'Vendor Evaluation',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-shield-search',
  },
  {
    label: 'Vendor Awarding',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-ranking',
  },
  {
    label: 'Tender Close',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-file-deleted',
  },
]

const BASE_VENDOR_STEPS: Omit<ListStep, 'active'>[] = [
  {
    label: 'Vendor Submission',
    time: '2025-10-22',
    name: 'Admin',
    icon: 'ki-duotone ki-paper-plane',
  },
  {
    label: 'Vendor Negotiation',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-book-open',
  },
  {
    label: 'Vendor Evaluation',
    time: '2025-10-22',
    name: 'Admin',
    icon: 'ki-duotone ki-shield-search',
  },
  { label: 'Vendor Awarding', time: '2025-10-22', name: 'Admin', icon: 'ki-duotone ki-ranking' },
]

/* ========= Helpers ========= */
const decodePlus = (v: string) => v.replace(/\+/g, ' ')
const norm = (v: unknown) =>
  decodePlus(String(v ?? ''))
    .toLowerCase()
    .trim()

// Alias agar input aktif dari URL tetap cocok dengan label step di atas
const ADMIN_ALIASES: Record<string, string> = {
  // Create
  created: 'Create Tender Request',
  create: 'Create Tender Request',
  open: 'Create Tender Request',

  // Publish
  publish: 'Published',

  // Submission/Negotiation/Evaluation/Awarding
  submission: 'Vendor Submission',
  'vendor submission': 'Vendor Submission',
  negotiation: 'Vendor Negotiation',
  'vendor negotiation': 'Vendor Negotiation',
  'negotiation & submission': 'Vendor Negotiation', // gabungan → posisikan di negotiation
  evaluation: 'Vendor Evaluation',
  'vendor evaluation': 'Vendor Evaluation',
  awarding: 'Vendor Awarding',
  'vendor awarding': 'Vendor Awarding',
  award: 'Vendor Awarding',

  // Close
  closed: 'Tender Close',
  close: 'Tender Close',
  'tender close': 'Tender Close',

  // Kadang ada status SAP Completed di sistem lain → anggap menuju selesai
  'sap completed': 'Tender Close',
  sap: 'Tender Close',
  completed: 'Tender Close',
}

const VENDOR_ALIASES: Record<string, string> = {
  submission: 'Vendor Submission',
  'vendor submission': 'Vendor Submission',
  negotiation: 'Vendor Negotiation',
  'vendor negotiation': 'Vendor Negotiation',
  evaluation: 'Vendor Evaluation',
  'vendor evaluation': 'Vendor Evaluation',
  awarding: 'Vendor Awarding',
  'vendor awarding': 'Vendor Awarding',
  award: 'Vendor Awarding',
}

/** Ambil base steps berdasar role */
const baseSteps = computed(() => (props.role === 'vendor' ? BASE_VENDOR_STEPS : BASE_ADMIN_STEPS))

/** Resolusi label kanonik dari props.activeName (handle +, alias, fallback) */
const canonicalLabel = computed<string>(() => {
  const n = norm(props.activeName)
  const base = baseSteps.value

  // 1) Cocok langsung dengan label yang ada
  const direct = base.find((s) => norm(s.label) === n)?.label
  if (direct) return direct

  // 2) Cek alias
  const map = props.role === 'vendor' ? VENDOR_ALIASES : ADMIN_ALIASES
  const alias = map[n]
  if (alias && base.some((s) => s.label === alias)) return alias

  // 3) Fallback ke step pertama
  return base[0]?.label ?? ''
})

/** Index step aktif */
const activeIndex = computed<number>(() => {
  const base = baseSteps.value
  const idx = base.findIndex((s) => s.label === canonicalLabel.value)
  return idx >= 0 ? idx : 0
})

/** Steps final dengan flag active tanpa memutasi base */
const steps = computed<ListStep[]>(() => {
  const base = baseSteps.value
  const idx = activeIndex.value
  return base.map((s, i) => ({
    ...s,
    active: i <= idx,
  }))
})
</script>
