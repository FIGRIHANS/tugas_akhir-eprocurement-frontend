<template>
  <div class="pagination">
    <!-- Tombol Prev -->
    <button
      v-if="!numberOnly"
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="btn btn-light"
    >
      <UiIcon name="left" variant="outline" />
    </button>

    <!-- Nomor Halaman -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      class="btn"
      :class="{
        '!btn-primary !text-white': currentPage === page,
        '!btn-light': currentPage !== page,
      }"
    >
      {{ page }}
    </button>

    <!-- Tombol Next -->
    <button
      v-if="!numberOnly"
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="btn btn-light"
    >
      <UiIcon name="right" variant="outline" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { paginationPropsTypes } from './types/pagination'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'

const props = defineProps<paginationPropsTypes>()
const emit = defineEmits(['pageChange'])

// Hitung total halaman
const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

// Fungsi untuk mengubah halaman
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('pageChange', page)
  }
}

// Hitung halaman yang akan ditampilkan
const visiblePages = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  let startPage = Math.max(1, props.currentPage - Math.floor(maxPagesToShow / 2))
  const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1)

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})
</script>
