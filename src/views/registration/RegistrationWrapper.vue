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
          <UiIcon name="black-right" />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useNavbarUtilsStore } from '@/stores/navbar'
import { computed, onBeforeMount, onMounted, onUnmounted, reactive } from 'vue'
import { useCheckEmpty } from '@/composables/validation'

import { useRegistrationVendorStore } from '@/stores/views/registration'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const route = useRoute()
const router = useRouter()

const registrationVendorStore = useRegistrationVendorStore()

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

  return regis.acceptTermCondition && regis.captcha
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
    payment: ['noRekening', 'namaPemilikAkun', 'suratPernyataan', 'mataUang', 'alamatBank'],
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
      registrationVendorStore.contact.contactPerson = {
        ...registrationVendorStore.contact.contactPerson,
        contactNameError: !hasContactPersons,
        contactPhoneError: !hasContactPersons,
        contactEmailError: !hasContactPersons,
        positionError: !hasContactPersons,
      }

      return (
        !Object.values(registrationVendorStore.contact)
          .flatMap((section) => Object.values(section))
          .some((value) => value === true) && hasContactPersons
      )

    case 'registration__document-and-legal':
      const checkingField = registrationVendorStore.documentAndLegal.fields.map(
        (item) => !Object.values(item).some((value) => value === true),
      )
      registrationVendorStore.documentAndLegal.fields =
        registrationVendorStore.documentAndLegal.fields.map((item, index) => ({
          ...item,
          ...(registrationVendorStore.requiredDocumentFields[
            registrationVendorStore.documentAndLegal.kategori
          ].includes(item.licenseId) &&
            checkErrors(registrationVendorStore.documentAndLegal.fields[index], fields.document)),
        }))

      return checkingField.some((value) => value === true)

    case 'registration__payment-detail':
      const section = registrationVendorStore.paymentDetail

      if (registrationVendorStore.paymentDetailFlagging.isNotSameAsCompany) {
        fields.payment.push('perbedaanRekening', 'halamanPertama')
      }

      if (registrationVendorStore.paymentDetailFlagging.bankNotRegistered) {
        fields.payment.push('namaBank', 'cabangBank', 'swiftCode')
      } else {
        fields.payment.push('bankKey')
      }

      registrationVendorStore.paymentDetail = {
        ...section,
        ...checkErrors(section, fields.payment),
      }

      if (!registrationVendorStore.paymentDetailFlagging.isNotSameAsCompany) {
        registrationVendorStore.paymentDetail.perbedaanRekeningError = false
        registrationVendorStore.paymentDetail.halamanPertamaError = false
      }

      if (registrationVendorStore.paymentDetailFlagging.bankNotRegistered) {
        registrationVendorStore.paymentDetail.bankKeyError = false
      } else {
        registrationVendorStore.paymentDetail.namaBankError = false
        registrationVendorStore.paymentDetail.cabangBankError = false
        registrationVendorStore.paymentDetail.swiftCodeError = false
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

const previous = () => {
  const index = tabPosition.value - 1

  if (index < 0) return

  tab.active = tab.items[index].value
  router.push({ name: tab.items[index].value })
}

const next = () => {
  const index = tabPosition.value + 1

  const information = registrationVendorStore.information
  const contact = registrationVendorStore.contact
  const documentAndLegal = registrationVendorStore.documentAndLegal

  const payload = {
    account: {
      userName: contact.account.username,
      email: contact.account.email,
      password: contact.account.password,
    },
    vendor: {
      ...removeErrorFields(information.vendor),
      categoryId: 0,
      vendorEmail: contact.account.email,
      vendorPhone: contact.account.phone,
      vendorWebsite: contact.account.website,
    },
    companyLocation: removeErrorFields(information.companyLocation),
    vendorLocation: removeErrorFields(information.vendorLocation),
    vendorCommodities: information.vendorCommodities.list.map((item) => ({
      subBusinessFieldId: item.subBusinessFieldId,
    })),
    vendorResponsibleContacts: contact.contactPerson.list,
    vendorLicenses: removeErrorFields(documentAndLegal.fields),
    otherDocuments: removeErrorFields(documentAndLegal.anotherDocuments),
  }

  console.log(payload)
  if (checkFieldNotEmpty()) {
    if (index >= tab.items.length) {
      console.log('end')
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
