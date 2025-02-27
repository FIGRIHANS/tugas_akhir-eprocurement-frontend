<template>
  <div class="grid grid-cols-2 gap-12 mb-[24px]">
    <UiFormGroup title="Account" body-class="px-4" hide-border>
      <UiInput
        v-model="contact.account.username"
        label="Username"
        placeholder="Masukkan Username"
        row
      />
      <UiInput v-model="contact.account.email" label="Email" placeholder="Masukkan Email" row />
      <UiInput
        v-model="contact.account.password"
        label="Password"
        placeholder="Masukkan Password"
        row
      />
      <UiInput
        v-model="contact.account.confirmPassword"
        label="Ulangi Password"
        placeholder="Ulangi Password"
        row
      />

      <UiInput
        v-model="contact.account.website"
        label="Website"
        placeholder="Masukkan website"
        row
      />
      <UiInput
        v-model="contact.account.noTel"
        label="No Telephone"
        placeholder="Masukkan no telephone"
        row
      />
      <UiInput v-model="contact.account.noFax" label="No Fax" placeholder="Masukkan no fax" row />
    </UiFormGroup>

    <UiFormGroup hide-border>
      <UiFormGroup title="Contact Person" body-class="px-4" hide-border>
        <UiInput
          v-model="contact.contactPerson.fullName"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          row
        />
        <UiInput
          v-model="contact.contactPerson.noTel"
          label="No Telephone"
          placeholder="Masukkan no telephone"
          row
        />
        <UiInput
          v-model="contact.contactPerson.email"
          label="Email"
          placeholder="Masukkan email"
          row
        />
        <UiSelect v-model="contact.contactPerson.partOf" label="Bagian" placeholder="Pilih" row />
      </UiFormGroup>

      <UiButton class="w-fit justify-self-end mx-4" outline>
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
            <tr v-for="i in 4" :key="i">
              <td>Name lengkap</td>
              <td>No tel</td>
              <td>Email</td>
              <td>Bagian</td>
              <td>
                <UiButton variant="danger" outline icon>
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
import { computed } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const registrationVendorStore = useRegistrationVendorStore()
const contact = computed(() => registrationVendorStore.contact)
</script>
