<template>
  <label class="inline-flex items-center gap-3 cursor-pointer select-none"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }">
    <!-- Hidden Native Input -->
    <input type="radio" class="sr-only" :value="value" :name="name" :checked="modelValue === value" :disabled="disabled"
      @change="handleChange" />

    <!-- Custom Circle -->
    <span class="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center transition" :class="modelValue === value
      ? 'border-blue-600'
      : 'border-gray-300'">
      <span v-if="modelValue === value" class="w-2 h-2 bg-blue-600 rounded-full"></span>
    </span>

    <!-- Label -->
    <span class="text-sm text-gray-700">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue' // Import ref if you plan to use it for internal state, though not strictly needed here

const props = defineProps({
  /**
   * The current value of the radio button.
   * This is the value emitted when this radio is selected.
   */
  value: {
    type: [String, Number, Boolean, Object],
    required: true,
  },
  /**
   * The value of the currently selected radio in the group (used with v-model).
   */
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
  /**
   * The label text displayed next to the radio button.
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * The name attribute for the radio button group.
   * All radios in a group should have the same name.
   */
  name: {
    type: String,
    default: 'radio-group', // Default name to avoid issues if not provided
  },
  /**
   * Whether the radio button is disabled.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    // When this specific radio button is checked,
    // we emit its `value` back to the parent via `update:modelValue`.
    // This is what makes v-model work for custom components.
    emit('update:modelValue', props.value)
    emit('change', props.value) // Emit a generic change event as well, if needed by parent
  }
}
</script>

<style scoped>
/* Basic custom styling for `form-radio` class to override browser defaults */
.form-radio {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  /* Inherit color from parent for consistency */
  width: 1em;
  height: 1em;
  border: 0.15em solid currentColor;
  /* Use currentColor for border */
  border-radius: 50%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

.form-radio::before {
  content: '';
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 120ms ease-in-out;
  /* Use Tailwind color variable - adjust if your setup doesn't parse it here */
  box-shadow: inset 1em 1em var(--tw-text-blue-600, #2563eb);
  /* Fallback to a blue color */
  background-color: CanvasText;
  /* Fallback */
}

.form-radio:checked::before {
  transform: scale(1);
}

.form-radio:focus-visible {
  outline: max(2px, 0.15em) solid currentColor;
  /* Focus ring */
  outline-offset: max(2px, 0.15em);
}

.form-radio:disabled {
  color: #ccc;
  /* Lighter color for disabled state */
  cursor: not-allowed;
}
</style>
