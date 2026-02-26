<template>
  <div class="space-y-5">
    <div class="card">
      <div class="card-body flex gap-5">
        <img :src="informationImg" alt="information" />
        <div>
          <h1 class="font-semibold text-2xl mb-3">What Is Vendor Management?</h1>
          <p class="text-gray-600 text-sm">
            A system or software used by companies to manage suppliers or vendors efficiently. This
            system helps in the process of selecting, contracting, monitoring performance, and
            paying vendors.
          </p>
        </div>
      </div>
    </div>

    <div class="card bg-[#F9F9F933]">
      <div class="card-body">
        <h1 class="text-xl font-semibold mb-5">Vendor Management Information Detail</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="card" v-for="data in vmData" :key="data.title">
            <div class="card-body space-y-3">
              <UiIcon :name="data.icon" class="text-primary text-2xl" variant="filled" />
              <h2 class="font-semibold text-base">{{ data.title }}</h2>
              <p class="text-gray-500 text-sm">
                {{ data.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-[#F9F9F933]">
      <div class="card-body">
        <h1 class="text-xl font-semibold mb-5">Vendor Management Process</h1>
        <div class="flex items-start relative" v-for="(step, index) in stepAct" :key="step.title">
          <div
            v-show="index < stepAct.length - 1"
            class="w-9 start-0 top-9 absolute bottom-0 rtl:-translate-x-1/2 translate-x-1/2 border-s border-s-gray-300"
          ></div>
          <div
            class="flex items-center justify-center shrink-0 rounded-full bg-gray-100 border border-gray-300 size-9 text-gray-600"
          >
            <UiIcon variant="filled" :name="step.icon" class="text-base" />
          </div>
          <div class="ps-2.5 mb-7 text-md grow">
            <div class="flex flex-col">
              <div class="text-sm text-gray-800" v-html="step.title"></div>
              <span class="text-xs text-gray-600">{{ step.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import informationImg from '@/assets/svg/information.svg'

const vmData = [
  {
    icon: 'user-square',
    title: 'Vendor Registration',
    description: 'Easily create and submit your vendor data to start the registration process.',
  },
  {
    icon: 'subtitle',
    title: 'Vendor List',
    description:
      'This menu lets you view detailed vendor information after completing registration.',
  },
  {
    icon: 'subtitle',
    title: 'Vendor Verification',
    description:
      'This page explains the verification process after the vendor completes registration.',
  },
  {
    icon: 'subtitle',
    title: 'Vendor Approval',
    description:
      'On the Approval page, approvers can approve the data that has been previously verified.',
  },
  {
    icon: 'subtitle',
    title: 'Vendor Change Data',
    description:
      'Vendors can edit and add data such as Deed of Establishment, Experience, and other information.',
  },
]

const stepAct = [
  {
    icon: 'people',
    title: 'Vendor Registration',
    date: '3 weeks ago, 4:07 PM',
  },
  {
    icon: 'verify',
    title: 'Vendor verification',
    date: '5 days ago, 4:07 PM ',
  },
  {
    icon: 'check-circle',
    title: 'Vendor Approval',
    date: '3 days ago, 4:07 PM',
  },
  {
    icon: 'entrance-left',
    title: 'Login Vendor',
    date: '2 days ago, 4:07 PM',
  },
  {
    icon: 'files',
    title: 'Vendor completes data',
    date: 'Today, 9:00 AM',
  },
]
</script>
