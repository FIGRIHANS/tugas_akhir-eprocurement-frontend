<template>
    <div class="card">
      <h3 class="card-title">{{ name }}</h3>
      <div class="card-content">
        <template v-if="loading">
          <p>Loading...</p>
        </template>
        <template v-else-if="error">
          <p class="error-message">{{ error }}</p>
        </template>
        <template v-else>
          <p class="total-label">Total</p>
          <p class="total-count">{{ total }}</p>
  
          <div class="progress-bar-container">
            <div
              v-for="item in processedData"
              :key="item.label"
              :class="['progress-segment', item.color]"
              :style="{ width: item.percentage + '%' }"
              :title="`${item.count} items (${item.percentage.toFixed(1)}%)`"
            ></div>
          </div>
  
          <ul class="legend">
            <li v-for="item in processedData" :key="item.label">
              <span :class="['dot', item.color]"></span>
              {{ item.label }} ({{ item.count }})
            </li>
          </ul>
        </template>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  
  // --- State Management ---
  const total = ref(0);
  const rawData = ref<{ count: number, label: string, color: string }[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  
  // --- Computed Properties ---
  const processedData = computed(() => {
    if (total.value === 0) return [];
    return rawData.value.map((item: { count: number, label: string, color: string }) => ({
      ...item,
      percentage: (item.count / total.value) * 100
    }));
  });

 
  
  // --- API Fetching ---
  const fetchData = async () => {
    try {

      
      total.value = props.data?.total;
      rawData.value = props.data?.data;
    } catch (err) {
      error.value = 'Failed to load data. Please try again later.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => {
    fetchData();
  });

  const props = defineProps<{
    name: string
    data: {
        total: number
        data: {
            label: string
            count: number
            color: string
        }[]
    }
  }>()

  </script>
  
  <style lang="scss" scoped>
  @use '../styles/chartCard.scss';
  </style>