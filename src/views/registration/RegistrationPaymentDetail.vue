<template>
  <div class="flex flex-rows justify-center gap-[24px] mb-[24px]">
    <div class="w-2/3">
      <UiFormGroup class="mb-[24px]">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              Payment Detail
            </h3>
          </div>

          <div class="card-body flex flex-col gap-[24px]">
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                Example Label
                </label>
                <input class="input" name="email" placeholder="Enter email address" type="text" value="jason@studio.io"/>
              </div>
            </div>

            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                Example Label
                </label>
                <input class="input" name="email" placeholder="Enter email address" type="text" value="jason@studio.io"/>
              </div>
            </div>

            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                Example Label
                </label>
                <input class="input" name="email" placeholder="Enter email address" type="text" value="jason@studio.io"/>
              </div>
            </div>
          </div>
        </div>
      </UiFormGroup>

      <UiCheckbox label="Baca dan setuju terhadap syarat dan ketentuan tender - eProcurement PT Datesea" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
</script>
