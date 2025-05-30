<template>
  <UiTab
    v-model="tab.active"
    :items="tab.items"
    class="justify-center bg-secondary-active mb-7.5"
    numbering
    step
    @update:model-value="changeTab"
  />
  <h1 class="text-center text-[22px] font-semibold pb-7.5 mb-6 border-b border-gray-300">
    eProcurement - Registration
  </h1>

  <div class="flex justify-center">
    <div class="w-[1440px] xl:px-[150px] sm:px-[40px]">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>

      <div class="flex justify-end gap-4 w-full mb-[24px]">
        <UiButton v-if="showPrevious" outline @click="previous()">
          <UiIcon name="black-left" />
          Kembali
        </UiButton>
        <UiButton
          @click="next()"
          :disabled="tab.active === 'registration__payment-detail' ? !disabledRegistration : false"
        >
          {{ tab.active === 'registration__payment-detail' ? 'Registration' : 'Lanjut' }}
          <UiIcon
            :name="isLoading ? 'loading' : 'black-right'"
            :class="{ 'animate-spin': isLoading }"
          />
        </UiButton>
      </div>
    </div>
  </div>

  <ModalConfirmation
    :open="modalTrigger.error"
    id="registration-error"
    type="danger"
    title="Vendor Registration Failed"
    text="Yout registration could not be submitted. Please check the required data and try again"
    no-submit
    static
    :cancel="() => (modalTrigger.error = false)"
  />
  <ModalConfirmation
    :open="modalTrigger.success"
    id="registration-success"
    type="success"
    title="Vendor Registration Submitted"
    text="Yout registration has been successfully submitted to the e-Procurement system."
    no-cancel
    static
    submit-button-text="Ok"
    :submit="
      () => {
        modalTrigger.success = false
        router.push('/')
      }
    "
  />
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useNavbarUtilsStore } from '@/stores/navbar'
import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue'

import { useCheckEmpty } from '@/composables/validation'
import { formatDatePayload } from '@/composables/date-format'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import type { VendorRegistrationPayloadType } from '@/stores/master-data/types/vendor-master-data'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

const route = useRoute()
const router = useRouter()

const modalTrigger = ref({
  error: false,
  success: false,
})
const isLoading = ref<boolean>(false)

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()

const information = computed(() => registrationVendorStore.information)
const contact = computed(() => registrationVendorStore.contact)
const documentAndLegal = computed(() => registrationVendorStore.documentAndLegal)
const paymentDetail = computed(() => registrationVendorStore.paymentDetail)
const isBankNotRegistered = computed(
  () => registrationVendorStore.paymentDetailFlagging.bankNotRegistered,
)

const tab = reactive({
  active: 'registration__information',
  items: [
    { label: 'Information', value: 'registration__information', disabled: true },
    { label: 'Contact', value: 'registration__contact', disabled: true },
    { label: 'Document & Legal', value: 'registration__document-and-legal', disabled: true },
    { label: 'Payment Detail', value: 'registration__payment-detail', disabled: true },
  ],
})

const tabPosition = computed(() => {
  return tab.items.findIndex((item) => item.value === tab.active)
})

const showPrevious = computed(() => {
  return tabPosition.value > 0
})

const disabledRegistration = computed(() => {
  const regis = registrationVendorStore.paymentDetailFlagging

  return regis.acceptTermCondition && regis.captcha && !isLoading.value
})

onMounted(() => {
  tab.active = route.name as string
})

const changeTab = (value: string) => {
  router.push({ name: value })
}

const checkFieldNotEmpty = () => {
  const locationFields = ['countryId', 'stateId', 'cityId', 'postalCode', 'addressDetail']

  const fields = {
    information: {
      vendor: ['vendorName', 'foundedDate'],
      companyLocation: locationFields,
      vendorLocation: locationFields,
    },
    contact: {
      account: ['username', 'email', 'password', 'confirmPassword', 'phone'],
    },
    document: ['licenseNo', 'issuedDate', 'expiredDate', 'uploadUrl'],
    payment: ['accountNo', 'accountName', 'currencyId', 'bankAddress'],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkErrors = (obj: any, keys: string[]) =>
    Object.fromEntries(keys.map((key) => [`${key}Error`, useCheckEmpty(obj[key]).isError]))

  switch (tab.active) {
    case 'registration__information':
      Object.keys(fields.information).forEach((key) => {
        const section = registrationVendorStore.information[key]
        registrationVendorStore.information[key] = {
          ...section,
          ...checkErrors(section, fields.information[key]),
        }
      })

      const hasBidangUsahaItems =
        registrationVendorStore.information.vendorCommodities.list.length > 0
      registrationVendorStore.information.vendorCommodities = {
        ...registrationVendorStore.information.vendorCommodities,
        businessFieldError: !hasBidangUsahaItems,
        subBusinessFieldError: !hasBidangUsahaItems,
      }

      return (
        !Object.values(registrationVendorStore.information)
          .flatMap((section) => Object.values(section))
          .some((value) => value === true) && hasBidangUsahaItems
      )

    case 'registration__contact':
      Object.keys(fields.contact).forEach((key) => {
        const section = registrationVendorStore.contact[key]
        registrationVendorStore.contact[key] = {
          ...section,
          ...checkErrors(section, fields.contact[key]),
        }
      })

      const hasContactPersons = registrationVendorStore.contact.contactPerson.list.length > 0
      const contactPersonHasFinance = registrationVendorStore.contact.contactPerson.list.some(
        (item) => item.positionTypeId === 1,
      )
      const contactPersonHasMarketing = registrationVendorStore.contact.contactPerson.list.some(
        (item) => item.positionTypeId === 2,
      )

      const contactPersonValid =
        hasContactPersons && contactPersonHasFinance && contactPersonHasMarketing

      registrationVendorStore.contact.contactPerson = {
        ...registrationVendorStore.contact.contactPerson,
        contactNameError: !contactPersonValid,
        contactPhoneError: !contactPersonValid,
        contactEmailError: !contactPersonValid,
        positionError: !contactPersonValid,
      }

      return (
        !Object.values(registrationVendorStore.contact)
          .flatMap((section) => Object.values(section))
          .some((value) => value === true) && contactPersonValid
      )

    case 'registration__document-and-legal':
      registrationVendorStore.documentAndLegal.fields =
        registrationVendorStore.documentAndLegal.fields.map((item, index) => ({
          ...item,
          ...(registrationVendorStore.requiredDocumentFields[
            registrationVendorStore.documentAndLegal.kategori
          ].includes(item.licenseId) &&
            checkErrors(registrationVendorStore.documentAndLegal.fields[index], fields.document)),
        }))

      const checkingField = registrationVendorStore.documentAndLegal.fields.map((item) =>
        Object.values(item).some((value) => value === true),
      )

      return !checkingField.some((value) => value === true)

    case 'registration__payment-detail':
      const section = registrationVendorStore.paymentDetail

      if (registrationVendorStore.paymentDetailFlagging.isNotSameAsCompany) {
        fields.payment.push('urlAccountDifferences', 'urlFirstPage')
      }

      if (registrationVendorStore.paymentDetailFlagging.bankNotRegistered) {
        fields.payment.push('bankName', 'branch', 'swiftCode')
      } else {
        fields.payment.push('bankId')
      }

      registrationVendorStore.paymentDetail = {
        ...section,
        ...checkErrors(section, fields.payment),
      }

      if (!registrationVendorStore.paymentDetailFlagging.isNotSameAsCompany) {
        registrationVendorStore.paymentDetail = {
          ...registrationVendorStore.paymentDetail,
          urlAccountDifferences: '',
          urlAccountDifferencesError: false,
          urlFirstPage: '',
          urlFirstPageError: false,
        }
      }

      if (registrationVendorStore.paymentDetailFlagging.bankNotRegistered) {
        registrationVendorStore.paymentDetail.bankId = ''
        registrationVendorStore.paymentDetail.bankIdError = false
      } else {
        registrationVendorStore.paymentDetail = {
          ...registrationVendorStore.paymentDetail,
          bankKey: '',
          bankKeyError: false,
          bankName: '',
          bankNameError: false,
          branch: '',
          branchError: false,
          swiftCode: '',
          swiftCodeError: false,
        }
      }

      return !Object.values(registrationVendorStore.paymentDetail).some((value) => value === true)
  }
}

const removeErrorFields = <T extends Record<string, any>>(obj: T): T =>
  Array.isArray(obj)
    ? (obj.map(removeErrorFields) as any)
    : typeof obj === 'object' && obj !== null
      ? (Object.fromEntries(
          Object.entries(obj)
            .filter(([key]) => !key.endsWith('Error'))
            .map(([key, value]) => [key, removeErrorFields(value)]),
        ) as T)
      : obj

const submitData = async () => {
  try {
    isLoading.value = true

    const payload: VendorRegistrationPayloadType = {
      account: {
        userName: contact.value.account.username,
        email: contact.value.account.email,
        password: contact.value.account.password,
      },
      vendor: {
        ...removeErrorFields(information.value.vendor),
        categoryId: documentAndLegal.value.kategori,
        vendorEmail: contact.value.account.email,
        vendorPhone: contact.value.account.phone,
        vendorWebsite: contact.value.account.website,
        foundedDate: formatDatePayload(information.value.vendor.foundedDate),
      },
      companyLocation: {
        ...removeErrorFields(information.value.companyLocation),
        postalCode: String(information.value.companyLocation.postalCode),
        districtId: 0,
        district: '',
      },
      vendorLocation: {
        ...removeErrorFields(information.value.vendorLocation),
        postalCode: String(information.value.vendorLocation.postalCode),
        districtId: 0,
        district: '',
      },
      vendorCommodities: information.value.vendorCommodities.list.map((item) => ({
        subBusinessFieldId: item.subBusinessFieldId,
      })),
      vendorResponsibleContacts: contact.value.contactPerson.list,
      vendorLicenses: removeErrorFields(documentAndLegal.value.fields).map((item) => ({
        ...item,
        issuedDate: item.issuedDate === '' ? null : formatDatePayload(item.issuedDate),
        expiredDate: item.expiredDate === '' ? null : formatDatePayload(item.expiredDate),
      })),
      otherDocuments: removeErrorFields(documentAndLegal.value.anotherDocuments).map((item) => ({
        ...item,
        issuedDate: item.issuedDate === '' ? null : formatDatePayload(item.issuedDate),
        expiredDate: item.expiredDate === '' ? null : formatDatePayload(item.expiredDate),
      })),
      bankDetailDto: {
        bankKey: isBankNotRegistered.value ? paymentDetail.value.bankKey : '',
        bankName: isBankNotRegistered.value ? paymentDetail.value.bankName : '',
        branch: isBankNotRegistered.value ? paymentDetail.value.branch : '',
        swiftCode: isBankNotRegistered.value ? paymentDetail.value.swiftCode : '',
        address: isBankNotRegistered.value ? paymentDetail.value.bankAddress : '',
      },
      vendorBankDetail: {
        accountNo: paymentDetail.value.accountNo,
        accountName: paymentDetail.value.accountName,
        BankKey: isBankNotRegistered.value ? '' : paymentDetail.value.bankId,
        CurrencySymbol: paymentDetail.value.currencyId,
        urlDoc: '',
        urlAccountDifferences: paymentDetail.value.urlAccountDifferences,
        urlFirstPage: paymentDetail.value.urlFirstPage,
        bankAddress: paymentDetail.value.bankAddress,
        countryId: 0,
      },
    }

    await vendorMasterDataStore.postVendorRegistration(payload)

    modalTrigger.value.success = true
  } catch (error) {
    modalTrigger.value.error = true
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const previous = () => {
  const index = tabPosition.value - 1

  if (index < 0) return

  tab.active = tab.items[index].value
  router.push({ name: tab.items[index].value })
}

const next = async () => {
  const index = tabPosition.value + 1

  if (checkFieldNotEmpty()) {
    if (index >= tab.items.length) {
      await submitData()
    } else {
      tab.active = tab.items[index].value
      router.push({ name: tab.items[index].value })
    }
  }
}

/**SECTION - Navbar utils */
const navbarUtils = useNavbarUtilsStore()

onBeforeMount(() => navbarUtils.setFull())
onUnmounted(() => navbarUtils.setNotFull())
/**!SECTION */
</script>
