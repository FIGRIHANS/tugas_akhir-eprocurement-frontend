<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue';
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue';
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue';
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue';
import UiInput from '@/components/ui/atoms/input/UiInput.vue';
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue';

</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="w-full flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-slate-800">Ratification by Kemkumham</h3>
          <p class="text-red-500 text-xs">Specifically for companies with PT legal entity status</p>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 mb-8">
        <UiFormGroup hide-border>
          <UiInput label="Number" placeholder="Number" row />
          <UiFileUpload name="file" label="File" placeholder="Upload file" />
        </UiFormGroup>
        <UiFormGroup hide-border>
          <UiSelect label="Letter Date" placeholder="Select" :options="[]" row />
          <div class="flex justify-end items-center">
            <UiButton variant="primary">
              <UiIcon variant="duotone" name="plus-circle" />
              Add
            </UiButton>
          </div>
        </UiFormGroup>
      </div>

      <table class="table align-middle">
        <thead>
          <tr>
            <th class="text-nowrap"></th>
            <th class="text-nowrap">Number</th>
            <th class="text-nowrap">Letter Date</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>
