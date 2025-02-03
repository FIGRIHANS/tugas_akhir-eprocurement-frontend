<template>
  <aside class="w-[280px] bg-white border border-gray-200 border-t-0 h-full -mt-[80px] fixed">
    <div class="h-[80px] flex items-center mb-5 px-[40px]">
      <RouterLink to="/">
        <UiLogo />
      </RouterLink>
    </div>

    <div
      class="menu menu-default flex flex-col border-0 rounded-lg w-full py-0 px-1.5"
      data-menu="true"
    >
      <div class="menu-item">
        <RouterLink class="menu-link" to="/">
          <span class="menu-icon">
            <i class="ki-duotone ki-element-11"></i>
          </span>
          <span class="menu-title"> Beranda </span>
        </RouterLink>
      </div>

      <div
        class="menu-item"
        data-menu-item-placement=""
        data-menu-item-toggle="accordion"
        data-menu-item-trigger="click"
      >
        <a class="menu-link" href="#">
          <span class="menu-icon">
            <i class="ki-duotone ki-rocket"> </i>
          </span>
          <span class="menu-title"> Proses Tender </span>
          <span class="menu-arrow">
            <i class="ki-outline ki-plus menu-item-show:hidden"> </i>
            <i class="ki-outline ki-minus hidden menu-item-show:block"> </i>
          </span>
        </a>
        <div class="menu-accordion">
          <div class="menu-item">
            <a class="menu-link" href="#">
              <span class="menu-title"> Submenu item 1 </span>
            </a>
          </div>
          <div class="menu-item">
            <a class="menu-link" href="#">
              <span class="menu-title"> Submenu item 2 </span>
            </a>
          </div>
          <div class="menu-item">
            <a class="menu-link" href="#">
              <span class="menu-title"> Submenu item 3 </span>
            </a>
          </div>
        </div>
      </div>

      <div
        class="menu-item"
        data-menu-item-placement=""
        data-menu-item-toggle="accordion"
        data-menu-item-trigger="click"
      >
        <a class="menu-link" href="#">
          <span class="menu-icon">
            <i class="ki-duotone ki-users"> </i>
          </span>
          <span class="menu-title"> Vendor Management </span>
          <span class="menu-arrow">
            <i class="ki-outline ki-plus menu-item-show:hidden"> </i>
            <i class="ki-outline ki-minus hidden menu-item-show:block"> </i>
          </span>
        </a>
        <div class="menu-accordion">
          <div class="menu-item">
            <RouterLink class="menu-link" to="/vendor-master">
              <span class="menu-title"> Vendor Master </span>
            </RouterLink>
          </div>
          <div class="menu-item">
            <a class="menu-link" href="#">
              <span class="menu-title"> Vendor Blacklist </span>
            </a>
          </div>
        </div>
      </div>

      <div
        v-for="i in 5"
        :key="i"
        class="menu-item"
        data-menu-item-placement=""
        data-menu-item-toggle="accordion"
        data-menu-item-trigger="click"
      >
        <a class="menu-link" href="#">
          <span class="menu-icon">
            <i class="ki-duotone ki-rocket"> </i>
          </span>
          <span class="menu-title"> Accordion submenu </span>
          <span class="menu-arrow">
            <i class="ki-outline ki-plus menu-item-show:hidden"> </i>
            <i class="ki-outline ki-minus hidden menu-item-show:block"> </i>
          </span>
        </a>
        <div class="menu-accordion">
          <div class="menu-item">
            <a class="menu-link" href="#">
              <span class="menu-title"> Submenu item 1 </span>
            </a>
          </div>
          <div class="menu-item">
            <a class="menu-link" href="#">
              <span class="menu-title"> Submenu item 2 </span>
            </a>
          </div>
          <div class="menu-item">
            <a class="menu-link" href="#">
              <span class="menu-title"> Submenu item 3 </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import UiLogo from '../ui/atoms/logo/UiLogo.vue'
</script>

<style scoped>
.menu-default .menu-link {
  @apply py-[12px] mb-2.5;
}

.menu-icon i {
  @apply text-[20px] mr-3;
}
</style>
