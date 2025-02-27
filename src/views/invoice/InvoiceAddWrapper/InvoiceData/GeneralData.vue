<template>
  <div class="flex-1">
    <div class="border-b border-gray-200 gap-[8px] p-[10px] flex items-center">
      <i class="ki-duotone ki-document text-gray-600 text-xl"></i>
      <span class="font-medium">General Data</span>
    </div>
    <div class="py-[8px] px-[16px]">
      <!-- Select Company -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Select Company
        </label>
        <select class="select">
          <option value="1">
            Option 1
          </option>
          <option value="2">
            Option 2
          </option>
          <option value="3">
            Option 3
          </option>
        </select>
      </div>
      <!-- Select Vendor -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Select Vendor
        </label>
        <select class="select">
          <option value="1">
            Option 1
          </option>
          <option value="2">
            Option 2
          </option>
          <option value="3">
            Option 3
          </option>
        </select>
      </div>
      <!-- Bill To Company -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bill To Company
        </label>
        <input class="input" placeholder="" type="text"/>
      </div>
      <!-- Bill To Vendor -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bill To Vendor
        </label>
        <input class="input" placeholder="" type="text"/>
      </div>
      <!-- Vendor Tax ID -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Vendor Tax ID
        </label>
        <input class="input" placeholder="" type="text"/>
      </div>
      <!-- Address -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Address
        </label>
        <textarea class="textarea" placeholder="" rows="6"></textarea>
      </div>
    </div>
  </div>
</template>