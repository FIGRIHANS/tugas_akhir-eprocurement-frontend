<template>
  <div>
    <BreadcrumbView
      title="Add New User"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'List User', to: '/user-management/user' },
        { name: 'Add New User', to: '#' },
      ]"
    />

    <UiTab
      v-model="tab.active"
      :items="tab.items"
      class="justify-center bg-secondary-active mb-7.5"
      numbering
      step
      @update:model-value="changeTab"
    />

    <div class="max-w-6xl mx-auto p-4">
      <UserDetailStep v-if="tab.active === 'registration__information'" />
      <UserProfileStep v-else-if="tab.active === 'registration__contact'" />
      <UserAuthorizationStep v-else-if="tab.active === 'registration__document-and-legal'" />
      <UserRoleStep v-else-if="tab.active === 'registration__payment-detail'" />

      <div class="flex justify-between items-center gap-3 mt-8">
        <UiButton outline @click="handleCancel">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_7618_2188)">
              <path
                opacity="0.3"
                d="M9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44365 13.5563 0.75 9 0.75C4.44365 0.75 0.75 4.44365 0.75 9C0.75 13.5563 4.44365 17.25 9 17.25Z"
                fill="#1B84FF"
              />
              <path
                d="M10.1632 9.00024L12.498 6.66549C12.5844 6.59153 12.6545 6.50052 12.704 6.39817C12.7535 6.29581 12.7814 6.18433 12.7857 6.07071C12.7901 5.95709 12.771 5.84379 12.7295 5.73792C12.688 5.63206 12.6251 5.5359 12.5447 5.4555C12.4643 5.3751 12.3682 5.31219 12.2623 5.27071C12.1564 5.22924 12.0431 5.21009 11.9295 5.21448C11.8159 5.21887 11.7044 5.2467 11.6021 5.29622C11.4997 5.34574 11.4087 5.41588 11.3347 5.50224L8.99999 7.83699L6.66524 5.50224C6.50742 5.36708 6.3044 5.29646 6.09677 5.30448C5.88914 5.3125 5.69218 5.39857 5.54525 5.5455C5.39832 5.69243 5.31225 5.88939 5.30423 6.09702C5.29621 6.30465 5.36683 6.50767 5.50199 6.66549L7.83674 9.00024L5.50199 11.335C5.34833 11.4896 5.26208 11.6987 5.26208 11.9166C5.26208 12.1346 5.34833 12.3437 5.50199 12.4982C5.65656 12.6519 5.86566 12.7381 6.08361 12.7381C6.30157 12.7381 6.51067 12.6519 6.66524 12.4982L8.99999 10.1635L11.3347 12.4982C11.4893 12.6519 11.6984 12.7381 11.9164 12.7381C12.1343 12.7381 12.3434 12.6519 12.498 12.4982C12.6516 12.3437 12.7379 12.1346 12.7379 11.9166C12.7379 11.6987 12.6516 11.4896 12.498 11.335L10.1632 9.00024Z"
                fill="#1B84FF"
              />
            </g>
            <defs>
              <clipPath id="clip0_7618_2188">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Cancel</UiButton
        >
        <div class="flex gap-3 items-center">
          <UiButton :disabled="isFirstStep" @click="handleBack" outline>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.3"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.0478 9.00495C17.0478 9.45209 16.6853 9.81458 16.2382 9.81458H2.18597C1.73883 9.81458 1.37634 9.45209 1.37634 9.00495C1.37634 8.5578 1.73883 8.19531 2.18598 8.19531L16.2382 8.19531C16.6853 8.19531 17.0478 8.5578 17.0478 9.00495Z"
                fill="#1B84FF"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.5875 2.18733C8.90369 2.50351 8.90369 3.01614 8.5875 3.33232L2.91459 9.00524L8.5875 14.6782C8.90369 14.9943 8.90369 15.507 8.5875 15.8232C8.27132 16.1393 7.75869 16.1393 7.44251 15.8232L1.1971 9.57774C0.880916 9.26156 0.880916 8.74893 1.1971 8.43275L7.44251 2.18733C7.75869 1.87115 8.27132 1.87115 8.5875 2.18733Z"
                fill="#1B84FF"
              />
            </svg>
            Back</UiButton
          >
          <UiButton variant="primary" @click="handleNext"
            >{{ isLastStep ? 'Submit' : 'Next' }}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.3"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.959961 9.00494C0.959961 8.5578 1.32245 8.19531 1.76959 8.19531H15.8218C16.2689 8.19531 16.6314 8.5578 16.6314 9.00494C16.6314 9.45209 16.2689 9.81458 15.8218 9.81458L1.76959 9.81458C1.32245 9.81458 0.959961 9.45209 0.959961 9.00494Z"
                fill="#EFF6FF"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.42024 15.8232C9.10406 15.507 9.10406 14.9943 9.42024 14.6782L15.0932 9.00524L9.42024 3.33232C9.10406 3.01614 9.10406 2.50351 9.42024 2.18733C9.73642 1.87115 10.2491 1.87115 10.5652 2.18733L16.8106 8.43275C17.1268 8.74893 17.1268 9.26156 16.8106 9.57774L10.5652 15.8232C10.2491 16.1393 9.73642 16.1393 9.42024 15.8232Z"
                fill="#EFF6FF"
              />
            </svg>
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue' // Import UiButton
import { reactive, computed } from 'vue' // Import computed
import { useRouter } from 'vue-router'
import UserDetailStep from './sections/UserDetailStep.vue'
import UserProfileStep from './sections/UserProfileStep.vue'
import UserAuthorizationStep from './sections/UserAuthorizationStep.vue'
import UserRoleStep from './sections/UserRoleStep.vue'

const router = useRouter()

const tab = reactive({
  active: 'registration__information', // Set initial active tab
  items: [
    { label: 'Detail User', value: 'registration__information', disabled: false }, // Set to false for now, we'll manage disabled state programmatically if needed
    { label: 'Profile', value: 'registration__contact', disabled: false },
    { label: 'Authorization', value: 'registration__document-and-legal', disabled: false },
    { label: 'Role', value: 'registration__payment-detail', disabled: false },
  ],
})

// Computed properties untuk navigasi
const currentStepIndex = computed(() => {
  return tab.items.findIndex((item) => item.value === tab.active)
})

const isFirstStep = computed(() => currentStepIndex.value === 0)
const isLastStep = computed(() => currentStepIndex.value === tab.items.length - 1)

// --- Event Handlers ---

const changeTab = (value: string) => {
  // Hanya ubah tab jika tidak dinonaktifkan (jika Anda memiliki logika disabled)
  // Untuk stepper, kita mungkin ingin mengontrol perubahan tab melalui tombol Next/Back
  // Tapi jika UiTab Anda sudah memiliki mekanisme klik untuk mengubah, ini tetap penting.
  // router.push({ name: value }); // Ini akan mengarahkan ke rute yang berbeda, mungkin tidak diinginkan untuk stepper
  tab.active = value // Hanya ubah tab aktif
}

const handleCancel = () => {
  // Logika untuk membatalkan proses
  // Misalnya, kembali ke halaman daftar user
  router.push('/user-management/user')
}

const handleBack = () => {
  if (!isFirstStep.value) {
    const prevStep = tab.items[currentStepIndex.value - 1]
    tab.active = prevStep.value
  }
}

const handleNext = () => {
  if (!isLastStep.value) {
    const nextStep = tab.items[currentStepIndex.value + 1]
    tab.active = nextStep.value
  } else {
    // Ini adalah langkah terakhir, lakukan submit form
    alert('Formulir disubmit!')
    // Di sini Anda akan menambahkan logika untuk mengirim data form
    // Misalnya, memanggil API atau melakukan validasi akhir
    // router.push('/user-management/user'); // Kembali ke daftar setelah submit
  }
}

// Opsional: Sinkronkan tab aktif dengan route query jika Anda ingin state bertahan di URL
// import { useRoute } from 'vue-router';
// const route = useRoute();

// watch(() => route.query.step, (newStep) => {
//   if (newStep && typeof newStep === 'string' && tab.items.some(item => item.value === newStep)) {
//     tab.active = newStep;
//   }
// }, { immediate: true });

// watch(() => tab.active, (newActiveTab) => {
//   router.replace({ query: { step: newActiveTab } });
// });
</script>

<style scoped></style>
