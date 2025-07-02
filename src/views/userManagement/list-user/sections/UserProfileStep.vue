<template>
  <div class="card">
    <div class="card-header">
      <div class="w-full flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Select Profile</h2>
        <UiInputSearch placeholder="Search" v-model="searchKeyword" />
      </div>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-2 gap-12 mb-[24px]">
        <UiFormGroup hide-border>
          <div class="form-check form-check-custom form-check-solid">
            <input class="form-check-input mr-2" type="radio" value="Finance" id="Finance" />
            <label class="form-check-label" for="Finance">Finance</label>
          </div>
          <div class="form-check form-check-custom form-check-solid">
            <input class="form-check-input mr-2" type="radio" value="DS Viewer" id="DS Viewer" />
            <label class="form-check-label" for="DS Viewer">DS Viewer</label>
          </div>
          <div class="form-check form-check-custom form-check-solid">
            <input class="form-check-input mr-2" type="radio" value="Legal" id="Legal" />
            <label class="form-check-label" for="Legal">Legal</label>
          </div>
          <div class="form-check form-check-custom form-check-solid">
            <input
              class="form-check-input mr-2"
              type="radio"
              value="Engineering"
              id="Engineering"
            />
            <label class="form-check-label" for="Engineering">Engineering</label>
          </div>
          <div class="form-check form-check-custom form-check-solid">
            <input class="form-check-input mr-2" type="radio" value="Director" id="Director" />
            <label class="form-check-label" for="Director">Director</label>
          </div>
        </UiFormGroup>
        <UiFormGroup>
          <div class="form-check form-check-custom form-check-solid">
            <input class="form-check-input mr-2" type="radio" value="DS Sender" id="DS Sender" />
            <label class="form-check-label" for="DS Sender">DS Sender</label>
          </div>
          <div class="form-check form-check-custom form-check-solid">
            <input class="form-check-input mr-2" type="radio" value="Marketing" id="Marketing" />
            <label class="form-check-label" for="Marketing">Marketing</label>
          </div>
          <div class="form-check form-check-custom form-check-solid">
            <input class="form-check-input mr-2" type="radio" value="DS Admin" id="DS Admin" />
            <label class="form-check-label" for="DS Admin">DS Admin</label>
          </div>
          <div class="form-check form-check-custom form-check-solid">
            <input class="form-check-input mr-2" type="radio" value="HR" id="HR" />
            <label class="form-check-label" for="HR">HR</label>
          </div>
          <div class="form-check form-check-custom form-check-solid">
            <input
              class="form-check-input mr-2"
              type="radio"
              value="Administrator"
              id="Administrator"
            />
            <label class="form-check-label" for="Administrator">Administrator</label>
          </div>
        </UiFormGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { ref } from 'vue'

const searchKeyword = ref('')
</script>

<style scoped></style>
