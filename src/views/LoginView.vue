<template>
  <div class="flex p-[20px] h-screen">
    <!-- left -->
    <div class="flex-1 flex flex-col gap-[8px]">
      <div class="flex justify-center items-center flex-1">
        <div class="w-[343px] border border-grey-200 rounded-xl p-[40px] h-fit">
          <p class="m-0 text-center text-lg font-medium">Sign in</p>
          <div class="mt-[30px] flex flex-col gap-[20px]">
            <!-- input email -->
             <div>
               <label class="font-normal text-[13px]">Email</label>
               <input v-model="email" class="input mt-[8px]" placeholder="email@email.com" type="text" />
             </div>
  
            <!-- input password -->
             <div>
               <div class="flex justify-between gap-[8px]">
                <label class="font-normal text-[13px]">Password</label>
                <a href="#" class="text-primary text-[13px]">Forgot Password?</a>
               </div>
               <div class="input max-w-72">
                <input
                  v-model="password"
                  placeholder="Password" 
                  :type="showPassword ? 'text' : 'password'"
                />
                <div class="btn btn-icon" @click="togglePassword">
                  <i class="ki-outline ki-eye" :class="{ 'hidden': showPassword }"></i>
                  <i class="ki-outline ki-eye-slash" :class="{ 'hidden': !showPassword }"></i>
                </div>
               </div>
             </div>
  
             <!-- remember -->
              <div class="flex flex-col items-start gap-[4px]">
                <label class="form-label flex items-center gap-2.5">
                  <input v-model="rememberMe" class="checkbox" name="check" type="checkbox" value="1"/>
                  Remember me
                </label>
              </div>
  
            <!-- button footer -->
             <div class="flex flex-col gap-[8px]">
              <button class="btn btn-primary w-full justify-center" :disabled="isLoading" @click="goLogin">
                Sign In
              </button>
              <button v-if="!isAdmin" class="btn btn-secondary w-full justify-center" :disabled="isLoading" @click="goRegister">
                Register
              </button>
             </div>
          </div>
        </div>
      </div>
      <div class="flex gap-[6px] justify-center text-gray-600">
        <a href="#">Legal</a>
        <span class="rounded-full bg-gray-600 w-[4px] h-[4px] my-auto mx-[5px]">&nbsp;</span>
        <a href="#">Contact</a>
        <span class="rounded-full bg-gray-600 w-[4px] h-[4px] my-auto mx-[5px]">&nbsp;</span>
        <a href="#">Term</a>
      </div>
    </div>

    <!-- right -->
    <div class="flex-1">
      <div class="rounded-xl bg-primary-light h-full flex flex-col justify-between items-center gap-[8px]">
        <logoLogin class="mt-[30px]" />
        <loginView />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'
import { type ApiResponseData, type ApiResponseDataResult } from '@/core/type/api'
import loginView from '@/assets/svg/LoginImage.vue'
import logoLogin from '@/assets/svg/LogoLogin.vue'
import moment from 'moment'

const login = useLoginStore()
const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')
const rememberMe = ref<boolean>(false)
const isAdmin = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const showPassword = ref<boolean>(false)

const goLogin = () => {
  isLoading.value = true
  if (!email.value && !password.value) return isLoading.value = false
  saveAccount()
  login.callLogin(email.value, password.value)
    .then((response: ApiResponseData<string>) => {
      if (response.statusCode === 200) {
        setToken(response.result)
        // login.callUser(email.value)
        router.push({
          name: 'dashboard'
        })
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

const setToken = (result: ApiResponseDataResult<string>) => {
  const expired = moment().add(7, 'days').toDate().toUTCString()
  document.cookie = `token_dts=${'Bearer ' + result.content}; path=/; expires=${expired}; Secure; SameSite=Strict`
}

const saveAccount = () => {
  if (rememberMe.value) {
    localStorage.setItem('account_dts', `username=${email.value}; password=${password.value}`)
  }
}

const goRegister = () => {
  router.push({
    name: 'registration'
  })
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

onMounted(() => {
  const savedAccount = localStorage.getItem('account_dts') || ''
  
  const account = savedAccount.split('; ')
  for (const item of account) {
    const [key, value] = item.split('=')
    if (key === 'username') email.value = value
    if (key === 'password') password.value = value
  }
  if (email.value && password.value) rememberMe.value = true
})
</script>