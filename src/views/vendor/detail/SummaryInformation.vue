<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRoute, useRouter } from 'vue-router'
import AdministrativeCard from '@/components/vendor/cards/AdministrativeCard.vue'
import LicenseCard from '@/components/vendor/cards/LicenseCard.vue'
import PaymentCard from '@/components/vendor/cards/PaymentCard.vue'
import { computed, onMounted, ref } from 'vue'
import { useVendorStore, useVerificationDetailStore } from '@/stores/vendor/vendor'
import { useLoginStore } from '@/stores/views/login'
import axios from 'axios'
import successImg from '@/assets/success.svg'
import UiModal from '@/components/modal/UiModal.vue'

const route = useRoute()
const router = useRouter()

const vendorStore = useVendorStore()
const userStore = useLoginStore()
const verifStore = useVerificationDetailStore()

const modalReject = ref<boolean>(false)
const modalRejectSuccess = ref<boolean>(false)
const modalVerify = ref<boolean>(false)
const modalVerifySuccess = ref<boolean>(false)
const modalError = ref<boolean>(false)

const reason = ref<string>('')
const notes = ref<string>('')
const inputError = ref<string[]>([])

const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const isVerified = computed(() => vendorStore.vendors?.items[0]?.isVerified === 1)

const isRejected = computed(() => vendorStore.vendors?.items[0]?.isVerified === 2)

const props = defineProps<{
  vendorId: string
}>()

const handleVerify = async () => {
  if (!notes.value) {
    inputError.value.push('notes')
    return
  }

  loading.value = true
  error.value = ''

  try {
    await vendorStore.verifyLegal({
      vendorId: Number(props.vendorId),
      isVerified: true,
      verifiedNote: notes.value,
      isReject: false,
      rejectedNote: '',
      position: userStore.userData?.profile.positionName,
      verificatorName: userStore.userData?.profile.employeeName,
    })

    modalVerify.value = false
    modalVerifySuccess.value = true
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.result?.message ?? 'Failed to verify vendor'
      }
    }

    handleError()
  } finally {
    loading.value = false
  }
}

const handleReject = async () => {
  // call api here

  if (!reason.value) {
    inputError.value.push('reason')
    return
  }

  loading.value = true
  error.value = ''

  try {
    await vendorStore.verifyLegal({
      vendorId: Number(props.vendorId),
      isVerified: false,
      verifiedNote: '',
      isReject: true,
      rejectedNote: reason.value,
      createdBy: userStore.userData?.profile.employeeName,
      position: userStore.userData?.profile.positionName,
      verificatorName: userStore.userData?.profile.employeeName,
    })

    modalReject.value = false
    modalRejectSuccess.value = true
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.result?.message ?? 'Failed to reject vendor'
      }
    }

    handleError()
  } finally {
    loading.value = false
  }
}

const handleError = () => {
  modalReject.value = false
  modalVerify.value = false
  modalError.value = true
}

onMounted(() => {
  verifStore.getData(Number(props.vendorId))
  vendorStore.getVendors({ vendorId: props.vendorId })
})
</script>
<template>
  <div class="space-y-5">
    <!-- Card administrasi -->
    <AdministrativeCard :vendorId="props.vendorId" />

    <!-- card data izin usaha -->
    <LicenseCard :vendorId="props.vendorId" />

    <!-- card payment information -->
    <PaymentCard :vendorId="props.vendorId" />

    <div class="flex justify-end space-x-3">
      <UiButton :outline="true" @click="router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span> {{ $t('general.back') }} </span>
      </UiButton>

      <div v-if="route.name === 'vendor-verification-detail' && !isRejected" class="space-x-3 flex-1 flex justify-end">
        <UiButton :outline="true" variant="danger" class="ml-auto" @click="modalReject = true" :disabled="isVerified">
          <UiIcon name="cross-circle" variant="duotone" />
          <span> {{ $t('general.reject') }} </span>
        </UiButton>
        <UiButton @click="modalVerify = true" :disabled="isVerified">
          <UiIcon name="check-squared" variant="duotone" />
          <span> {{ $t('general.verify') }} </span>
        </UiButton>
      </div>
    </div>
  </div>

  <UiModal v-if="modalReject" v-model="modalReject" title="Reject Vendor" size="sm">
    <form @submit.prevent="handleReject">
      <div class="relative mb-3">
        <label for="reason" class="absolute bg-white top-0 left-0 ml-2 -mt-2 text-sm text-gray-600 px-1">
          Reason <span class="text-danger">*</span>
        </label>
        <textarea id="reason" class="textarea" rows="6" v-model="reason" required></textarea>
      </div>
      <div v-if="inputError.includes('reason')" class="text-xs text-danger">Reason is required</div>

      <div class="my-3 text-danger text-xs italic">
        * Rejecting this section will automatically reject all other submitted data from the vendor.
        Do you wish to proceed?
      </div>

      <div class="flex gap-3">
        <UiButton class="flex-1 justify-center" :outline="true" type="button" @click="modalReject = !modalReject">
          <UiIcon name="black-left-line" variant="duotone" />
          <span>{{ $t('general.cancle') }}</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="danger" :disabled="loading">
          <span v-if="loading"> Progress </span>
          <template v-else>
            <UiIcon name="cross-circle" variant="duotone" />
            <span>{{ $t('general.reject') }}</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <UiModal v-if="modalVerify" v-model="modalVerify" title="Verify Vendor" size="sm">
    <form @submit.prevent="handleVerify">
      <div class="relative mb-3">
        <label for="notes" class="absolute bg-white top-0 left-0 ml-2 -mt-2 text-sm text-gray-600 px-1">
          Notes <span class="text-danger">*</span>
        </label>
        <textarea id="notes" class="textarea" rows="6" v-model="notes"></textarea>
        <div v-if="inputError.includes('notes')" class="text-xs text-danger">Notes is required</div>
      </div>
      <div class="flex gap-3">
        <UiButton class="flex-1 justify-center" :outline="true" type="button" @click="modalVerify = !modalVerify">
          <UiIcon name="black-left-line" variant="duotone" />
          <span>{{ $t('general.cancel') }}</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="primary" :disabled="loading">
          <span v-if="loading"> Progress </span>
          <template v-else>
            <UiIcon name="check-circle" variant="duotone" />
            <span>{{ $t('general.verify') }}</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <UiModal v-if="modalRejectSuccess" v-model="modalRejectSuccess" size="sm" @update:model-value="$router.go(-1)">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Data Rejected</h3>
    <p class="text-gray-600 text-center mb-3">Vendor Data has been successfully rejected.</p>
  </UiModal>

  <UiModal v-if="modalVerifySuccess" v-model="modalVerifySuccess" size="sm" @update:model-value="$router.go(-1)">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Verification Completed</h3>
    <p class="text-gray-600 text-center mb-3">
      All vendor data has been successfully verified and is ready for approval.
    </p>
  </UiModal>

  <UiModal v-model="modalError" size="sm">
    <div class="text-center mb-6">
      <UiIcon name="cross-circle" variant="duotone" class="text-[150px] text-danger text-center" />
    </div>
    <h3 class="text-center text-lg font-medium">An Error Accured!</h3>
    <p class="text-center text-base text-gray-600 mb-5">
      {{ error }}
    </p>
  </UiModal>
</template>
