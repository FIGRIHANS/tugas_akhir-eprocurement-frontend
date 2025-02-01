<template>
  <header class="w-full bg-white border border-gray-200">
    <div class="">
      <nav class="flex justify-between items-center py-[20px] px-[40px]">
        <div class="logo">
          <RouterLink to="/">
            <img src="/logo.png" alt="DataSea Logo" />
          </RouterLink>
        </div>

        <div class="flex items-center gap-3.5">
          <a href="#" class="px-2.5 py-1.5 flex items-center gap-1.5 text-primary">
            <i class="ki-duotone ki-calendar text-xl"> </i>
            {{ today }}
          </a>
          <a href="#" class="px-2.5 py-1.5 flex items-center gap-1.5 text-primary">
            <i class="ki-duotone ki-book-open text-xl"> </i>
            Download Manual Book
          </a>
          <a href="#" class="px-2.5 py-1.5">
            <i class="ki-outline ki-notification text-xl"> </i>
          </a>

          <div class="menu menu-default" data-menu="true">
            <div
              class="menu-item"
              data-menu-item-placement="bottom-start"
              data-menu-item-toggle="dropdown"
              data-menu-item-trigger="click"
              data-menu-item-permanent="true"
            >
              <button class="menu-toggle btn btn-light text-gray-600 border-0 flex items-center">
                <span class="text-base font-semibold"> ID </span>
                <i class="ki-filled ki-down text-xl"></i>
              </button>
              <div class="menu-dropdown w-48 py-2">
                <div class="menu-item">
                  <a class="menu-link" href="#">
                    <span class="menu-icon">
                      <i class="ki-outline ki-profile-circle"> </i>
                    </span>
                    <span class="menu-title"> Indonesia (ID) </span>
                  </a>
                </div>
                <div class="menu-item">
                  <a class="menu-link" href="#">
                    <span class="menu-icon">
                      <i class="ki-outline ki-coffee"> </i>
                    </span>
                    <span class="menu-title"> English (EN) </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            class="size-10 rounded-full inline-flex items-center justify-center text-[11px] font-semibold border border-primary-clarity bg-primary text-white"
          >
            Aa
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import moment from 'moment'

const today = moment().format('MMM D, YYYY | HH:mm:ss') + ' GMT+7'
</script>

<style scoped>
.menu-default {
  @apply p-0;
}
</style>
