<template>
  <div class="max-w-[343px] border border-grey-200 rounded-xl p-[40px] h-fit">
    <p class="m-0 text-center text-lg font-medium">
      {{ $t('login.form.signIn') }}
      <span v-if="!checkVendor()"> {{ $t('login.form.admin') }}</span>
    </p>
    <div class="mt-[30px] flex flex-col gap-[20px]">
      <!-- input email -->
      <div v-if="!checkVendor()">
        <label class="font-normal text-[13px]">{{ $t('login.form.email') }}</label>
        <input
          v-model="email"
          class="input mt-[8px]"
          :placeholder="$t('login.form.emailPlaceholder')"
          type="email"
          :class="{ 'border-danger text-danger': isError }"
        />
      </div>

      <!-- input username -->
      <div v-else>
        <label class="font-normal text-[13px]">{{ $t('login.form.username') }}</label>
        <input
          v-model="username"
          class="input mt-[8px]"
          :placeholder="$t('login.form.usernamePlaceholder')"
          type="text"
          :class="{ 'border-danger text-danger': isError }"
        />
      </div>

      <!-- input password -->
      <div>
        <div class="flex justify-between gap-[8px]">
          <label class="font-normal text-[13px]">{{ $t('login.form.password') }}</label>
          <a
            v-if="checkVendor() || checkAdmin()"
            href="#"
            class="text-primary text-[13px]"
            @click="goToForgot"
            >{{ $t('login.form.forgotPassword') }}</a
          >
        </div>
        <div class="input max-w-72" :class="{ 'border-danger': isError }">
          <input
            v-model="password"
            :placeholder="$t('login.form.passwordPlaceholder')"
            :type="showPassword ? 'text' : 'password'"
            :class="{ '!text-danger': isError }"
          />
          <div class="btn btn-icon" @click="togglePassword">
            <i class="ki-outline ki-eye" :class="{ hidden: showPassword }"></i>
            <i class="ki-outline ki-eye-slash" :class="{ hidden: !showPassword }"></i>
          </div>
        </div>
      </div>

      <div v-if="isError" class="radius-lg bg-red-100 text-danger p-[8px] text-[11px]">
        {{ $t('login.form.errorMessage') }}
      </div>

      <!-- remember -->
      <div class="flex flex-col items-start gap-[4px]">
        <label class="form-label flex items-center gap-2.5">
          <input v-model="rememberMe" class="checkbox" name="check" type="checkbox" value="1" />
          {{ $t('login.form.rememberMe') }}
        </label>
      </div>

      <!-- button footer -->
      <div class="flex flex-col gap-[8px]">
        <button
          class="btn btn-primary w-full justify-center"
          :disabled="isLoading"
          @click="goLogin"
        >
          {{ $t('login.form.signInButton') }}
        </button>
        <button
          v-if="checkVendor()"
          class="btn btn-secondary w-full justify-center"
          :disabled="isLoading"
          @click="goRegister"
        >
          {{ $t('login.form.registerButton') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import { useLoginStore } from '@/stores/views/login'
import type { ApiResponseData, ApiResponseDataResult } from '@/core/type/api'

const loginApi = useLoginStore()
const router = useRouter()
const email = ref<string>('')
const username = ref<string>('')
const password = ref<string>('')
const rememberMe = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isError = ref<boolean>(false)

const selectedLogin = computed(() => loginApi.selectedLogin)

const checkVendor = () => {
  return selectedLogin.value === 'vendor'
}

const checkAdmin = () => {
  return selectedLogin.value === 'admin'
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const goRegister = () => {
  router.push({
    name: 'registration',
  })
}

const goToForgot = () => {
  if (selectedLogin.value === 'admin') {
    loginApi.loginRole = 'employee'
  } else {
    loginApi.loginRole = 'vendor'
  }

  loginApi.selectedLogin = 'forgot'
}

const saveAccount = () => {
  if (rememberMe.value) {
    if (checkVendor()) {
      localStorage.setItem(
        'account_dts_vendor',
        `username=${username.value}; password=${password.value}`,
      )
    } else {
      localStorage.setItem('account_dts', `username=${email.value}; password=${password.value}`)
    }
  }
}

const setToken = (result: ApiResponseDataResult<string>) => {
  const expired = moment().add(2, 'hours').utc().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT'
  const getUsernameEmail = checkVendor() ? username.value : email.value
  document.cookie = `session_data=token_dts=${'Bearer ' + result.content}&isAdmin=${!checkVendor()}&username=${getUsernameEmail}; path=/; expires=${expired}; Secure; SameSite=Strict`
}

const nextStepLogin = (response: ApiResponseData<string>) => {
  if (response.statusCode === 200) {
    loginApi.isVendor = checkVendor()
    setToken(response.result)
    router.replace({
      name: 'dashboard',
    })
  } else {
    isError.value = true
  }
}

const goLogin = () => {
  isLoading.value = true
  if (!email.value && !password.value) return (isLoading.value = false)
  saveAccount()
  if (checkVendor()) {
    loginApi
      .callLoginVendor(username.value, password.value)
      .then((response: ApiResponseData<string>) => {
        nextStepLogin(response)
      })
      .finally(() => {
        isLoading.value = false
      })
  } else {
    loginApi
      .callLogin(email.value, password.value)
      .then((response: ApiResponseData<string>) => {
        nextStepLogin(response)
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}

const getUsernameEmailPassword = (itemLocalStorage: string) => {
  let username = ''
  let email = ''
  let password = ''

  const account = itemLocalStorage.split('; ')
  for (const item of account) {
    const [key, value] = item.split('=')
    if (key === 'username') {
      if (checkVendor()) {
        username = value
      } else {
        email = value
      }
    }
    if (key === 'password') password = value
  }

  return {
    username,
    email,
    password,
  }
}

onMounted(() => {
  const savedAccount = localStorage.getItem('account_dts') || ''
  const savedAccountVendor = localStorage.getItem('account_dts_vendor') || ''

  const result = getUsernameEmailPassword(checkVendor() ? savedAccountVendor : savedAccount)
  username.value = result.username
  email.value = result.email
  password.value = result.password

  if (email.value && password.value) rememberMe.value = true
})
</script>
