<template>
  <div>
    <div class="w-full border-b border-slate-200 py-4">
      <h2 class="text-xl font-bold text-gray-800">User Authorization</h2>
    </div>

    <div class="grid grid-cols-[1fr_auto_1fr] gap-6 mt-4 items-start">
      <div class="card">
        <div class="card-header">
          <div class="w-full justify-between items-center flex">
            <p>Auth Object Code</p>
            <UiInputSearch placeholder="Search Code" v-model="searchCodeKeyword" />
          </div>
        </div>
        <div class="card-body">
          <table class="table align-middle text-gray-700 w-full">
            <thead>
              <tr>
                <th class="text-nowrap">Auth Object Code</th>
                <th class="text-nowrap">Auth Object Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredAvailableAuths.length === 0">
                <td colspan="2" class="text-center text-gray-500 py-4">No available authorization objects.</td>
              </tr>
              <tr
                v-for="auth in filteredAvailableAuths"
                :key="auth.code"
                @click="toggleAvailableSelection(auth.code)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-blue-100': isAvailableSelected(auth.code) }"
              >
                <td>{{ auth.code }}</td>
                <td>{{ auth.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex flex-col gap-4 justify-center items-center h-full pt-10">
        <UiButton variant="primary" @click="addSelectedAuths" :disabled="selectedAvailableAuths.length === 0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.7929 11.2071C14.1834 10.8166 14.8166 10.8166 15.2071 11.2071C15.5976 11.5976 15.5976 12.2309 15.2071 12.6213L10.2071 17.6213C9.81658 18.0118 9.18342 18.0118 8.79289 17.6213C8.40237 17.2309 8.40237 16.5976 8.79289 16.2071L12.9858 12L8.79289 7.79289C8.40237 7.40237 8.40237 6.76921 8.79289 6.37868C9.18342 5.98815 9.81658 5.98815 10.2071 6.37868L15.2071 11.3787L13.7929 11.2071Z"
              fill="white"
            />
          </svg>
        </UiButton>
        <UiButton variant="primary" @click="removeSelectedAuths" :disabled="selectedAssignedAuths.length === 0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.2071 11.2071C9.81658 10.8166 9.18342 10.8166 8.79289 11.2071C8.40237 11.5976 8.40237 12.2309 8.79289 12.6213L13.7929 17.6213C14.1834 18.0118 14.8166 18.0118 15.2071 17.6213C15.5976 17.2309 15.5976 16.5976 15.2071 16.2071L11.0142 12L15.2071 7.79289C15.5976 7.40237 15.5976 6.76921 15.2071 6.37868C14.8166 5.98815 14.1834 5.98815 13.7929 6.37868L8.79289 11.3787L10.2071 11.2071Z"
              fill="white"
            />
          </svg>
        </UiButton>
      </div>

      <div class="card">
        <div class="card-header">
          <p>Auth Object Code Selected</p>
        </div>
        <div class="card-body">
          <table class="table align-middle text-gray-700 w-full">
            <thead>
              <tr>
                <th class="text-nowrap">Auth Object Code</th>
                <th class="text-nowrap">Auth Object Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="assignedAuths.length === 0">
                <td colspan="2" class="text-center text-gray-500 py-4">No authorization objects selected.</td>
              </tr>
              <tr
                v-for="auth in assignedAuths"
                :key="auth.code"
                @click="toggleAssignedSelection(auth.code)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-blue-100': isAssignedSelected(auth.code) }"
              >
                <td>{{ auth.code }}</td>
                <td>{{ auth.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <p v-if="errors.assignedAuths" class="text-red-500 text-sm mt-4 text-center">
        {{ errors.assignedAuths }}
    </p>
  </div>
</template>

<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue';
import UiButton from '@/components/ui/atoms/button/UiButton.vue';
import { ref, reactive, computed, watch, inject, type Ref } from 'vue';

interface AuthObject {
  code: string;
  name: string;
}

const availableAuths = ref<AuthObject[]>([
  { code: 'CC001', name: 'General Category' },
  { code: 'CC002', name: 'Customer Data Access' },
  { code: 'CC003', name: 'Product Management' },
  { code: 'CC004', name: 'Order Processing' },
  { code: 'CC005', name: 'Reporting Access' },
  { code: 'CC006', name: 'Admin Tools' },
  { code: 'CC010', name: 'Company Code' },
  { code: 'CC007', name: 'User Management' },
  { code: 'CC008', name: 'Financial Records' },
]);

const assignedAuths = reactive<AuthObject[]>([]);

const searchCodeKeyword = ref('');

const filteredAvailableAuths = computed(() => {
  if (!searchCodeKeyword.value) {
    return availableAuths.value;
  }
  const lowerCaseKeyword = searchCodeKeyword.value.toLowerCase();
  return availableAuths.value.filter(
    (auth) =>
      auth.code.toLowerCase().includes(lowerCaseKeyword) ||
      auth.name.toLowerCase().includes(lowerCaseKeyword)
  );
});

const selectedAvailableAuths = ref<string[]>([]);
const selectedAssignedAuths = ref<string[]>([]);

const toggleAvailableSelection = (code: string) => {
  const index = selectedAvailableAuths.value.indexOf(code);
  if (index === -1) {
    selectedAvailableAuths.value.push(code);
  } else {
    selectedAvailableAuths.value.splice(index, 1);
  }
};

const toggleAssignedSelection = (code: string) => {
  const index = selectedAssignedAuths.value.indexOf(code);
  if (index === -1) {
    selectedAssignedAuths.value.push(code);
  } else {
    selectedAssignedAuths.value.splice(index, 1);
  }
};

const isAvailableSelected = (code: string) => {
  return selectedAvailableAuths.value.includes(code);
};

const isAssignedSelected = (code: string) => {
  return selectedAssignedAuths.value.includes(code);
};


const addSelectedAuths = () => {
  const itemsToAdd = availableAuths.value.filter((auth) =>
    selectedAvailableAuths.value.includes(auth.code)
  );

  itemsToAdd.forEach((item) => {
    if (!assignedAuths.some((auth) => auth.code === item.code)) {
      assignedAuths.push(item);
    }
  });

  availableAuths.value = availableAuths.value.filter(
    (auth) => !selectedAvailableAuths.value.includes(auth.code)
  );

  selectedAvailableAuths.value = [];
};

const removeSelectedAuths = () => {
  const itemsToRemove = assignedAuths.filter((auth) =>
    selectedAssignedAuths.value.includes(auth.code)
  );

  itemsToRemove.forEach((item) => {
    if (!availableAuths.value.some((auth) => auth.code === item.code)) {
      availableAuths.value.push(item);
    }
  });

  const currentAssignedAuths = [...assignedAuths];
  assignedAuths.splice(0, assignedAuths.length, ...currentAssignedAuths.filter(
    (auth) => !selectedAssignedAuths.value.includes(auth.code)
  ));
  availableAuths.value.sort((a, b) => a.code.localeCompare(b.code));

  selectedAssignedAuths.value = [];
};

const errors = reactive({
  assignedAuths: '',
});

const validateForm = () => {
  let isValid = true;
  errors.assignedAuths = '';

  if (assignedAuths.length === 0) {
    errors.assignedAuths = 'Please select at least one authorization object.';
    isValid = false;
  }
  return isValid;
};

const validationTrigger = inject<Ref<number>>('validationTrigger', ref(0));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allFormData = inject<Record<string, any>>('allFormData');

const emit = defineEmits(['validation-result']);

watch(validationTrigger, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    const isValid = validateForm();
    if (allFormData) {
        allFormData['authorization-step'] = { selectedAuthObjects: assignedAuths.map(auth => auth.code) };
    }
    emit('validation-result', { isValid: isValid, formData: { selectedAuthObjects: assignedAuths.map(auth => auth.code) } });
  }
});
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.card-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

.table {
  min-width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.table thead th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

.bg-blue-100 {
  background-color: #ebf8ff;
}
</style>
