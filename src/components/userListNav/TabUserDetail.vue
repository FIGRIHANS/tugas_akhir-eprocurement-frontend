<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button class="tab pl-[4px]" :class="[activeTab === 'detail' ? 'active' : '']" :disabled="!canClickDetail" @click="activeTab = 'detail'">
      Detail User
    </button>

    <i class="ki-duotone ki-right"></i>

    <button class="tab pl-[4px]" :class="[activeTab === 'role' ? 'active' : '']" :disabled="!canClickRole" @click="activeTab = 'role'">
      Role
    </button>

    <i class="ki-duotone ki-right"></i>

    <button class="tab pl-[4px]" :class="[activeTab === 'authorization' ? 'active' : '']" :disabled="!canClickAuthorization" @click="activeTab = 'authorization'">
      Auth
    </button>

    <i class="ki-duotone ki-right"></i>

    <button class="tab pl-[4px]" :class="[activeTab === 'profile' ? 'active' : '']" :disabled="!canClickProfile" @click="activeTab = 'profile'">
      Menu
    </button>

    <i class="ki-duotone ki-right"></i>

    <button class="tab pl-[4px]" :class="[activeTab === 'summary' ? 'active' : '']" :disabled="!canClickSummary" @click="activeTab = 'summary'">
      Summary
    </button>
  </div>
</template>

<script lang="ts" setup>
const activeTab = defineModel<string>('activeTab')

withDefaults(
  defineProps<{
    canClickDetail?: boolean
    canClickRole?: boolean
    canClickAuthorization?: boolean
    canClickProfile?: boolean
    canClickSummary?: boolean
  }>(),
  {
    canClickDetail: true,
    canClickRole: false,
    canClickAuthorization: false,
    canClickProfile: false,
    canClickSummary: false,
  },
)
</script>
