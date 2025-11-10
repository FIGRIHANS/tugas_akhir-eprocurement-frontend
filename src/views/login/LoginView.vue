<template>
  <div class="flex p-[20px] h-screen">
    <!-- Language Toggle -->
    <div class="absolute top-[20px] right-[20px] z-10">
      <div class="menu menu-default p-0" data-menu="true">
        <div
          class="menu-item"
          data-menu-item-placement="bottom-end"
          data-menu-item-toggle="dropdown"
          data-menu-item-trigger="click"
          data-menu-item-permanent="true"
        >
          <button class="menu-toggle btn btn-light text-gray-600 border-0 flex items-center">
            <span class="text-base font-semibold"> {{ selectedLanguage }} </span>
            <i class="ki-filled ki-down text-[20px]"></i>
          </button>
          <div class="menu-dropdown w-48 py-2">
            <div class="menu-item" @click="changeLocale('id')">
              <a class="menu-link" href="#">
                <span class="menu-icon">
                  <i class="ki-outline ki-profile-circle"> </i>
                </span>
                <span class="menu-title"> {{ $t('login.language.indonesia') }} </span>
              </a>
            </div>
            <div class="menu-item" @click="changeLocale('en')">
              <a class="menu-link" href="#">
                <span class="menu-icon">
                  <IconEN />
                </span>
                <span class="menu-title"> {{ $t('login.language.english') }} </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- left -->
    <div class="flex-1 flex flex-col gap-[8px] relative">
      <div
        v-if="checkSelected()"
        class="absolute flex items-center gap-[2px] cursor-pointer"
        @click="goBack"
      >
        <i class="ki-filled ki-left text-gray-500"></i>
        {{ $t('login.back') }}
      </div>
      <div class="flex justify-center items-center flex-1">
        <BranchLogin v-if="!checkSelected()" />
        <LoginPage v-if="checkLoginUserAdmin()" />
        <ForgotPasswordPage v-if="checkForgot()" />
      </div>
      <div class="flex gap-[6px] justify-center text-gray-600">
        <a href="#">{{ $t('login.legal') }}</a>
        <span class="rounded-full bg-gray-600 w-[4px] h-[4px] my-auto mx-[5px]">&nbsp;</span>
        <a href="#">{{ $t('login.contact') }}</a>
        <span class="rounded-full bg-gray-600 w-[4px] h-[4px] my-auto mx-[5px]">&nbsp;</span>
        <a href="#">{{ $t('login.term') }}</a>
      </div>
    </div>

    <!-- right -->
    <div class="flex-1">
      <div
        class="rounded-xl bg-primary-light h-full flex flex-col justify-between items-center gap-[8px]"
      >
        <logoLogin class="mt-[30px]" />
        <loginView />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoginStore } from '@/stores/views/login'
import loginView from '@/assets/svg/LoginImage.vue'
import logoLogin from '@/assets/svg/LogoLogin.vue'
import IconEN from '@/components/icons/IconEN.vue'

const BranchLogin = defineAsyncComponent(() => import('./LoginView/BranchLogin.vue'))
const LoginPage = defineAsyncComponent(() => import('./LoginView/LoginPage.vue'))
const ForgotPasswordPage = defineAsyncComponent(() => import('./LoginView/ForgotPassword.vue'))

const loginApi = useLoginStore()
const { locale } = useI18n({ useScope: 'global' })

const selectedLanguage = computed(() => locale.value.toUpperCase())

const changeLocale = (value: 'id' | 'en') => {
  locale.value = value
  localStorage.setItem('locale', value)
}

const checkSelected = () => {
  return loginApi.selectedLogin
}

const checkLoginUserAdmin = () => {
  return loginApi.selectedLogin === 'admin' || loginApi.selectedLogin === 'vendor'
}

const checkForgot = () => {
  return loginApi.selectedLogin === 'forgot'
}

const goBack = () => {
  if (loginApi.selectedLogin === 'forgot') {
    if (loginApi.loginRole === 'vendor') {
      return (loginApi.selectedLogin = 'vendor')
    } else {
      return (loginApi.selectedLogin = 'admin')
    }
  }
  loginApi.selectedLogin = ''
}

onUnmounted(() => {
  loginApi.selectedLogin = ''
})
</script>
