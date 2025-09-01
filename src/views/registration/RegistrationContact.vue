<template>
  <div class="flex flex-col gap-12 mb-[24px]">
    <UiFormGroup :title="$t('registration.account')" :grid="2" body-class="px-4" hide-border>
      <UiInput
        v-model="contact.account.username"
        :label="$t('registration.username')"
        row
        required
        disabled
        :error="contact.account.usernameError"
      />
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
        <label class="form-label w-2/5 flex items-center gap-1">
          {{ $t('registration.password') }}
          <span class="text-danger"> * </span>
        </label>
        <div class="input" :class="{ 'border-danger': contact.account.passwordError }">
          <input
            v-model="contact.account.password"
            :placeholder="$t('general.input', { field: $t('registration.password') })"
            :type="showPassword ? 'text' : 'password'"
            @input="checkPasswordRules"
          />
          <div class="btn btn-icon" @click="togglePassword('password')">
            <i class="ki-outline" :class="showPassword ? 'ki-eye-slash' : 'ki-eye'"></i>
          </div>
        </div>
      </div>
      <UiInput
        v-model="contact.account.email"
        label="Email"
        :placeholder="$t('general.input', { field: 'email' })"
        row
        required
        :error="contact.account.emailError"
      />

      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
        <label class="form-label w-2/5 flex items-center gap-1">
          {{ $t('registration.confirmPassword') }}
          <span class="text-danger"> * </span>
        </label>
        <div class="input" :class="{ '!border-danger': contact.account.confirmPasswordError }">
          <input
            v-model="contact.account.confirmPassword"
            :placeholder="$t('registration.confirmPassword')"
            :type="showConfirmPassword ? 'text' : 'password'"
            @input="checkConfirmPassword"
          />
          <div class="btn btn-icon" @click="togglePassword('confirmPassword')">
            <i class="ki-outline" :class="showConfirmPassword ? 'ki-eye-slash' : 'ki-eye'"></i>
          </div>
        </div>
      </div>

      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <div class="w-2/5"></div>
        <div class="card bg-primary-light w-full">
          <div class="card-body px-3 py-4">
            <p class="text-xs text-primary">
              {{ $t('registration.duplicateEmail') }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 row-span-3">
        <div class="w-2/5"></div>
        <div class="card bg-gray-100 w-full">
          <div class="card-body px-3 py-4 text-sm">
            <span>
              {{ $t('registration.strongPassword') }} <br />
              {{ $t('registration.containPassword') }}
            </span>
            <ul class="list-disc list-inside">
              <div
                v-for="rule in passwordRules"
                :key="rule.id"
                class="flex flex-row justify-between items-center transition-all duration-300"
                :class="rule.status ? 'text-success' : 'text-danger'"
              >
                <li>
                  <span>{{ rule.text }}</span>
                </li>
                <UiIcon :name="rule.status ? 'check-circle' : 'cross-circle'" variant="duotone" />
              </div>
            </ul>
          </div>
        </div>
      </div>
      <UiInputTel
        v-model="contact.account.phone"
        :label="$t('registration.phone')"
        placeholder="000000"
        row
        required
        :error="contact.account.phoneError"
      />
      <UiInput
        v-model="contact.account.website"
        :label="$t('registration.website')"
        :placeholder="$t('general.input', { field: $t('registration.website') })"
        row
        class="col-start-1"
      />
    </UiFormGroup>

    <hr class="col-span-2 border-t-gray-200" />

    <UiFormGroup hide-border>
      <UiFormGroup
        :title="$t('registration.contactPerson')"
        :grid="2"
        body-class="px-4"
        hide-border
      >
        <UiInput
          v-model="contact.contactPerson.contactName"
          :label="$t('registration.name')"
          :placeholder="$t('registration.fullName')"
          row
          required
          :error="contact.contactPerson.contactNameError"
        />
        <UiInput
          v-model="contact.contactPerson.contactEmail"
          label="Email"
          placeholder="Email"
          row
          required
          :error="contact.contactPerson.contactEmailError"
        />
        <UiInputTel
          v-model="contact.contactPerson.contactPhone"
          :label="$t('registration.phone')"
          placeholder="000000"
          row
          required
          :error="contact.contactPerson.contactPhoneError"
        />
        <UiSelect
          v-model="contact.contactPerson.positionTypeId"
          :label="$t('registration.department')"
          :placeholder="$t('general.select')"
          :options="positionList"
          value-key="positionTypeId"
          text-key="positionName"
          row
          required
          :error="contact.contactPerson.positionError"
        />
      </UiFormGroup>

      <UiButton class="w-fit justify-self-end mx-4" outline @click="addContactPerson">
        <UiIcon variant="duotone" :name="isEdit ? 'file-added' : 'plus-circle'" />
        {{ isEdit ? $t('general.save') : $t('general.add') }}
      </UiButton>

      <div class="card min-w-full">
        <div class="card-table">
          <table
            class="table table-auto table-border align-middle text-gray-700 font-medium text-sm"
          >
            <thead>
              <tr>
                <th>{{ $t('registration.fullName') }}</th>
                <th>{{ $t('registration.phone') }}</th>
                <th>Email</th>
                <th>{{ $t('registration.department') }}</th>
                <th class="w-10">{{ $t('general.action') }}</th>
              </tr>
            </thead>
            <tbody v-if="contact.contactPerson.list.length === 0">
              <tr>
                <td class="text-center">{{ $t('general.noData') }}</td>
                <td class="text-center">{{ $t('general.noData') }}</td>
                <td class="text-center">{{ $t('general.noData') }}</td>
                <td class="text-center">{{ $t('general.noData') }}</td>
                <td></td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="(contactPerson, index) in contact.contactPerson.list" :key="index">
                <td>{{ contactPerson.contactName }}</td>
                <td>{{ contactPerson.contactPhone }}</td>
                <td>{{ contactPerson.contactEmail }}</td>
                <td>{{ displayPosition(contactPerson.positionTypeId) }}</td>
                <td class="flex flex-row items-center gap-4">
                  <UiButton variant="primary" outline icon @click="editContactPerson(index)">
                    <UiIcon variant="duotone" name="notepad-edit" />
                  </UiButton>
                  <UiButton variant="danger" outline icon @click="deleteContactPerson(index)">
                    <UiIcon variant="duotone" name="cross-circle" />
                  </UiButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UiFormGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputTel from '@/components/ui/atoms/input-telephone/UiInputTel.vue'

const { t, locale } = useI18n()

const isEdit = ref<boolean>(false)
const editIndex = ref<number | null>(null)

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()

const showPassword = ref<boolean>(false)
const showConfirmPassword = ref<boolean>(false)
const passwordRules = ref([
  {
    id: 'min8char',
    text: t('registration.minPassword'),
    status: false,
  },
  {
    id: 'uppercase',
    text: t('registration.capitalPassword'),
    status: false,
  },
  {
    id: '1symbol',
    text: t('registration.symbolPassword'),
    status: false,
  },
  {
    id: '1number',
    text: t('registration.numberPassword'),
    status: false,
  },
])

const contact = computed(() => registrationVendorStore.contact)
const positionList = computed(() => vendorMasterDataStore.posistionList)

const togglePassword = (type: 'password' | 'confirmPassword') => {
  if (type === 'password') {
    showPassword.value = !showPassword.value
  } else {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}

const checkPasswordRules = () => {
  const { password } = contact.value.account
  const numbers = /\d/
  const symbols = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

  const checks = {
    min8char: password.length >= 8,
    uppercase: password !== password.toLowerCase(),
    '1symbol': symbols.test(password),
    '1number': numbers.test(password),
  }

  passwordRules.value.forEach((item) => {
    item.status = checks[item.id as 'min8char' | 'uppercase' | '1symbol' | '1number'] || false
  })

  registrationVendorStore.contact.account.passwordError = !passwordRules.value.every(
    (value) => value.status === true,
  )
}

const checkConfirmPassword = () => {
  const { password, confirmPassword } = contact.value.account
  const isPasswordSame = confirmPassword === password

  if (isPasswordSame) {
    registrationVendorStore.contact.account.confirmPasswordError = false
  } else {
    registrationVendorStore.contact.account.confirmPasswordError = true
  }
}

const addContactPerson = () => {
  const {
    list,
    contactNameError,
    contactPhoneError,
    contactEmailError,
    positionError,
    ...clearObject
  } = contact.value.contactPerson

  const isObjectHasEmpty = Object.values(clearObject).some((value) => !value)

  if (isObjectHasEmpty) {
    registrationVendorStore.contact.contactPerson = {
      ...registrationVendorStore.contact.contactPerson,
      contactNameError: clearObject.contactName === '',
      contactPhoneError: clearObject.contactPhone === '',
      contactEmailError: clearObject.contactEmail === '',
      positionError: clearObject.positionTypeId === 0,
    }
  } else {
    if (isEdit.value) {
      registrationVendorStore.contact.contactPerson.list.splice(
        Number(editIndex.value),
        1,
        clearObject,
      )

      isEdit.value = false
      editIndex.value = null
    } else {
      registrationVendorStore.contact.contactPerson.list.push(clearObject)
    }

    registrationVendorStore.contact.contactPerson = {
      ...registrationVendorStore.contact.contactPerson,
      contactName: '',
      contactNameError: false,
      contactPhone: '',
      contactPhoneError: false,
      contactEmail: '',
      contactEmailError: false,
      positionTypeId: 0,
      positionError: false,
    }
  }
}

const editContactPerson = (index: number) => {
  isEdit.value = true
  editIndex.value = index
  registrationVendorStore.contact.contactPerson = {
    ...registrationVendorStore.contact.contactPerson,
    ...registrationVendorStore.contact.contactPerson.list[index],
  }
}

const deleteContactPerson = (index: number) => {
  registrationVendorStore.contact.contactPerson.list.splice(index, 1)
}

const displayPosition = (value: number) => {
  return positionList.value.find((item) => item.positionTypeId === value)?.positionName
}

onMounted(() => {
  if (contact.value.account.password) {
    checkPasswordRules()
  }
  vendorMasterDataStore.getVendorPosition()
})

watch(
  () => locale.value,
  () => {
    passwordRules.value = [
      {
        id: 'min8char',
        text: t('registration.minPassword'),
        status: false,
      },
      {
        id: 'uppercase',
        text: t('registration.capitalPassword'),
        status: false,
      },
      {
        id: '1symbol',
        text: t('registration.symbolPassword'),
        status: false,
      },
      {
        id: '1number',
        text: t('registration.numberPassword'),
        status: false,
      },
    ]
  },
)
</script>
