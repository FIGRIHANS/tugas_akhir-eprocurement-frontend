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
               <div class="input mt-[8px]" data-toggle-password="true">
                <input v-model="password" placeholder="Enter Password" type="password"/>
                <div class="btn btn-icon" data-toggle-password-trigger="true">
                  <i class="ki-outline ki-eye toggle-password-active:hidden">
                  </i>
                  <i class="ki-outline ki-eye-slash hidden toggle-password-active:block">
                  </i>
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
              <button class="btn btn-primary w-full justify-center" @click="goLogin">
                Sign In
              </button>
              <button v-if="!isAdmin" class="btn btn-secondary w-full justify-center" @click="goRegister">
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
        <logoTelkomsel class="mt-[30px]" />
        <loginView />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import loginView from '@/assets/svg/LoginImage.vue'
import logoTelkomsel from '@/assets/svg/LogoTekomsel.vue'

const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')
const rememberMe = ref<boolean>(false)
const isAdmin = ref<boolean>(false)

const goLogin = () => {
  // localStorage.setItem('token_datasea', '1')
  router.push({
    name: 'home'
  })
}

const goRegister = () => {
  router.push({
    name: 'registration'
  })
}
</script>