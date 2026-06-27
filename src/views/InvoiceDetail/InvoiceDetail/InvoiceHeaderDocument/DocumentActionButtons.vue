<template>
  <div class="flex items-center gap-2">
    <button
      class="btn btn-icon btn-outline btn-primary"
      title="Lihat dokumen"
      :disabled="!path"
      @click="emit('preview', path, label)"
    >
      <i class="ki-filled ki-eye"></i>
    </button>
    <button
      class="btn btn-icon btn-outline btn-primary"
      title="Unduh dokumen"
      :disabled="!path || loadingPath !== null"
      @click="emit('download', path)"
    >
      <template v-if="loadingPath === path">
        <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </template>
      <template v-else>
        <i class="ki-duotone ki-file-down"></i>
      </template>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  path?: string
  label: string
  loadingPath?: string | null
}>()

const emit = defineEmits<{
  preview: [path: string | undefined, label: string]
  download: [path: string]
}>()
</script>
