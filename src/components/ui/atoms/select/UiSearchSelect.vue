<template>
  <div ref="target" :class="[
    'relative',
    {
      'flex items-center flex-wrap lg:flex-nowrap gap-2.5': row,
    },
  ]">
    <label v-if="label && !row"
      class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-10">
      {{ label }}
      <span v-if="required" class="text-danger"> * </span>
    </label>
    <label v-else-if="label && row" class="form-label w-2/5" :class="{ 'flex items-center gap-1': required }">
      {{ label }}
      <span v-if="required" class="text-danger"> * </span>
    </label>

    <div class="relative w-full">
      <input ref="inputRef" type="text" :value="displayValue" @input="handleInput" @click="toggleDropdown"
        class="select w-full pr-8 truncate" :class="[
          { 'border-danger': error },
          // Jika tidak searchable, cursor jadi pointer (seperti select biasa)
          searchable ? 'cursor-text' : 'cursor-pointer',
        ]" :placeholder="placeholder" :readonly="readonly || !searchable" :disabled="disabled" autocomplete="off" />

      <div class="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer" @click="toggleDropdown">
        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isOpen }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <!-- <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path> -->
        </svg>
      </div>

      <ul v-show="isOpen && !disabled"
        class="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm rounded-md">
        <li v-if="filteredOptions.length === 0"
          class="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">
          Tidak ada data
        </li>

        <li v-for="option in filteredOptions" :key="option[valueKey]" @click="selectOption(option)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 text-gray-900">
          <span class="block truncate">
            {{ option[textKey] }}
          </span>

          <span v-if="model === option[valueKey]"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600" style="display: none">
            ✓
          </span>
        </li>
      </ul>
    </div>

    <span v-if="hintText" class="form-hint !text-danger">{{ hintText }}</span>
  </div>
</template>

<script lang="ts" setup>
import { defineModel, ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
// import type { ISelectProps } from './types/select'
// Pastikan interface ISelectProps diupdate juga dengan searchable?: boolean

interface ISelectProps {
  label?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  row?: boolean
  valueKey?: string
  textKey?: string
  error?: boolean
  required?: boolean
  hintText?: string
  options?: any[]
  searchable?: boolean // Property Baru
}

const props = withDefaults(defineProps<ISelectProps>(), {
  placeholder: 'Pilih...',
  readonly: false,
  disabled: false,
  row: false,
  valueKey: 'value',
  textKey: 'text',
  error: false,
  options: () => [],
  searchable: false, // Default false (seperti select biasa)
})

// Emits untuk mentrigger event search ke parent
const emit = defineEmits(['search'])

const model = defineModel<string | number | null>({ default: '' })

const isOpen = ref(false)
const searchQuery = ref('')
const target = ref(null)
const inputRef = ref<HTMLInputElement | null>(null)

// Logic Tampilan Input
const displayValue = computed(() => {
  // Jika sedang mengetik (searchable aktif & dropdown terbuka), tampilkan apa yang diketik
  if (props.searchable && isOpen.value) {
    return searchQuery.value
  }

  // Jika tidak, tampilkan Label dari opsi yang terpilih
  const selectedOption = props.options.find((opt) => opt[props.valueKey] === model.value)
  return selectedOption ? selectedOption[props.textKey] : ''
})

// Logic Filter
const filteredOptions = computed(() => {
  // Jika tidak searchable atau query kosong, tampilkan semua
  if (!props.searchable || !searchQuery.value) return props.options

  // Filter Client Side (jika parent tidak handle server side searching)
  return props.options.filter((option) => {
    const text = String(option[props.textKey]).toLowerCase()
    return text.includes(searchQuery.value.toLowerCase())
  })
})

// --- ACTIONS ---

const toggleDropdown = () => {
  if (props.disabled || props.readonly) return
  isOpen.value = !isOpen.value

  if (isOpen.value && props.searchable) {
    // Reset search query saat dibuka agar kosong dan user bisa ngetik baru
    // Atau biarkan kosong untuk menampilkan semua opsi dulu
    searchQuery.value = ''
    nextTick(() => inputRef.value?.focus())
  }
}

const handleInput = (e: Event) => {
  if (!props.searchable) return

  const val = (e.target as HTMLInputElement).value
  searchQuery.value = val
  isOpen.value = true

  // Trigger event search ke parent component
  // Berguna untuk Server Side Filtering (Fetch API)
  emit('search', val)
}

const selectOption = (option: any) => {
  model.value = option[props.valueKey]
  searchQuery.value = option[props.textKey] // Update tampilan
  isOpen.value = false
  emit('search', '') // Reset search event jika perlu
}

const handleClickOutside = (event: MouseEvent) => {
  if (target.value && !(target.value as HTMLElement).contains(event.target as Node)) {
    isOpen.value = false
    // Saat klik luar, kembalikan search query ke label item yang terpilih
    const selectedOption = props.options.find((opt) => opt[props.valueKey] === model.value)
    searchQuery.value = selectedOption ? selectedOption[props.textKey] : ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
