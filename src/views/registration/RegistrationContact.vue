<template>
  <div class="grid grid-cols-2 gap-12 mb-[24px]">
    <UiFormGroup title="Account" body-class="px-4" hide-border>
      <UiInput
        v-model="contact.account.username"
        label="Username"
        placeholder="Masukkan Username"
        row
        required
        :error="contact.account.usernameError"
      />
      <UiInput
        v-model="contact.account.email"
        label="Email"
        placeholder="Masukkan Email"
        row
        required
        :error="contact.account.emailError"
      />
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
        <label class="form-label w-2/5 flex items-center gap-1">
          Password
          <span class="text-danger"> * </span>
        </label>
        <div class="input" :class="{ 'border-danger': contact.account.passwordError }">
          <input
            v-model="contact.account.password"
            placeholder="Masukkan Password"
            :type="showPassword ? 'text' : 'password'"
          />
          <div class="btn btn-icon" @click="togglePassword('password')">
            <i class="ki-outline" :class="showPassword ? 'ki-eye-slash' : 'ki-eye'"></i>
          </div>
        </div>
      </div>
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
        <label class="form-label w-2/5 flex items-center gap-1">
          Ulangi Password
          <span class="text-danger"> * </span>
        </label>
        <div class="input" :class="{ 'border-danger': contact.account.confirmPasswordError }">
          <input
            v-model="contact.account.confirmPassword"
            placeholder="Ulangi Password"
            :type="showConfirmPassword ? 'text' : 'password'"
            @input="checkConfirmPassword"
          />
          <div class="btn btn-icon" @click="togglePassword('confirmPassword')">
            <i class="ki-outline" :class="showConfirmPassword ? 'ki-eye-slash' : 'ki-eye'"></i>
          </div>
        </div>
      </div>
      <UiInput
        v-model="contact.account.website"
        label="Website"
        placeholder="Masukkan website"
        row
      />
      <UiInputTel
        v-model="contact.account.noTel"
        label="No Telephone"
        placeholder="Masukkan no telephone"
        row
        required
        :error="contact.account.noTelError"
        :options="[
          { value: '+62', text: '+62' },
          { value: '+80', text: '+80' },
        ]"
      />
    </UiFormGroup>

    <UiFormGroup hide-border>
      <UiFormGroup title="Contact Person" body-class="px-4" hide-border>
        <UiInput
          v-model="contact.contactPerson.fullName"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          row
          required
          :error="contact.contactPerson.fullNameError"
        />
        <UiInputTel
          v-model="contact.contactPerson.noTel"
          label="No Telephone"
          placeholder="Masukkan no telephone"
          row
          required
          :error="contact.contactPerson.noTelError"
          :options="[
            { value: '+62', text: '+62' },
            { value: '+80', text: '+80' },
          ]"
        />
        <UiInput
          v-model="contact.contactPerson.email"
          label="Email"
          placeholder="Masukkan email"
          row
          required
          :error="contact.contactPerson.emailError"
        />
        <UiSelect
          v-model="contact.contactPerson.position"
          label="Bagian"
          placeholder="Pilih"
          :options="positionList"
          value-key="positionTypeId"
          text-key="positionName"
          row
          required
          :error="contact.contactPerson.positionError"
        />
      </UiFormGroup>

      <UiButton class="w-fit justify-self-end mx-4" outline @click="addContactPerson">
        <UiIcon variant="duotone" name="plus-circle" />
        Tambah
      </UiButton>
    </UiFormGroup>

    <div class="card min-w-full col-span-2">
      <div class="card-table">
        <table class="table table-auto table-border align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th>Nama Lengkap</th>
              <th>No Telephone</th>
              <th>Email</th>
              <th>Bagian</th>
              <th class="w-10">Action</th>
            </tr>
          </thead>
          <tbody v-if="contact.contactPerson.list.length === 0">
            <tr>
              <td class="text-center">No Data</td>
              <td class="text-center">No Data</td>
              <td class="text-center">No Data</td>
              <td class="text-center">No Data</td>
              <td></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(contactPerson, index) in contact.contactPerson.list" :key="index">
              <td>{{ contactPerson.fullName }}</td>
              <td>{{ contactPerson.noTel }}</td>
              <td>{{ contactPerson.email }}</td>
              <td>{{ displayPosition(contactPerson.position) }}</td>
              <td>
                <UiButton variant="danger" outline icon @click="deleteContactPerson(index)">
                  <UiIcon variant="duotone" name="cross-circle" />
                </UiButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputTel from '@/components/ui/atoms/input-telephone/UiInputTel.vue'

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()

const showPassword = ref<boolean>(false)
const showConfirmPassword = ref<boolean>(false)

const contact = computed(() => registrationVendorStore.contact)
const positionList = computed(() => vendorMasterDataStore.posistionList)

const togglePassword = (type: 'password' | 'confirmPassword') => {
  if (type === 'password') {
    showPassword.value = !showPassword.value
  } else {
    showConfirmPassword.value = !showConfirmPassword.value
  }
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
  const { list, fullNameError, noTelError, emailError, positionError, ...clearObject } =
    contact.value.contactPerson

  const isObjectHasEmpty = Object.values(clearObject).some((value) => !value)

  if (isObjectHasEmpty) {
    registrationVendorStore.contact.contactPerson = {
      ...registrationVendorStore.contact.contactPerson,
      fullNameError: clearObject.fullName === '',
      noTelError: clearObject.noTel === '',
      emailError: clearObject.email === '',
      positionError: clearObject.position === 0,
    }
  } else {
    registrationVendorStore.contact.contactPerson.list.push(clearObject)

    registrationVendorStore.contact.contactPerson = {
      ...registrationVendorStore.contact.contactPerson,
      fullName: '',
      fullNameError: false,
      noTel: '',
      noTelError: false,
      email: '',
      emailError: false,
      position: 0,
      positionError: false,
    }
  }
}

const deleteContactPerson = (index: number) => {
  registrationVendorStore.contact.contactPerson.list.splice(index, 1)
}

const displayPosition = (value: number) => {
  return positionList.value.find((item) => item.positionTypeId === value)?.positionName
}

onMounted(async () => {
  await vendorMasterDataStore.getVendorPosition()
})
</script>
