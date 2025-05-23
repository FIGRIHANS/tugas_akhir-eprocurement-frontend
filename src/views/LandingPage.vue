<script setup lang="ts">
import HeroImage from '@/assets/svg/HeroImage.vue'
import LogoAN from '@/assets/svg/LogoAN.vue'
import IconEfficient from '@/components/icons/IconEfficient.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconHeadOffice from '@/components/icons/IconHeadOffice.vue'
import IconPDF from '@/components/icons/iconPDF.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import moment from 'moment'
import IconPhone from '../components/icons/IconPhone.vue'
import IconEmail from '../components/icons/IconEmail.vue'
import IconUserFriendly from '@/components/icons/IconUserFriendly.vue'

const year = moment().format('YYYY')
</script>

<template>
  <section id="hero" class="bg-gray-200 py-[111px] flex flex-col items-center">
    <div class="max-w-[1440px] grid grid-cols-1 md:grid-cols-2 gap-6 lg:px-[40px] px-5">
      <div class="flex flex-col justify-center">
        <h1 class="text-[40px] font-bold text-gray-700 mb-4 lg:w-3/4">
          Empowering Sustainable Partnerships Through Reliable Procurement Processes
        </h1>
        <p class="text-lg font-light text-gray-800 mb-8">
          We support long-term business sustainability through transparent, standardized, and
          value-oriented e-Procurement designed to deliver mutual benefits for all stakeholders.
        </p>
        <UiButton variant="light" size="lg" class="self-start">
          <span class="text-gray-900">Download Manual Book</span>
          <IconPDF />
        </UiButton>
      </div>
      <HeroImage class="w-full h-auto" />
    </div>
  </section>

  <section id="advantages" class="py-16">
    <div class="max-w-[1440px] lg:px-[40px] px-5 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card bg-secondary shadow-none">
          <div class="card-body p-4 space-y-4">
            <div class="inline-flex items-center gap-4">
              <div class="bg-gray-200 rounded-lg p-2">
                <IconEye />
              </div>
              <span class="text-xl text-gray-900 font-semibold"> Transparent </span>
            </div>
            <div class="font-light text-gray-800 text-lg">
              Enhances transparency in the registration and invoice submission process.
            </div>
          </div>
        </div>

        <div class="card bg-secondary shadow-none">
          <div class="card-body p-4 space-y-4">
            <div class="inline-flex items-center gap-4">
              <div class="bg-gray-200 rounded-lg p-2">
                <IconEfficient />
              </div>
              <span class="text-xl text-gray-900 font-semibold"> Efficient </span>
            </div>
            <div class="font-light text-gray-800 text-lg">
              Improves data accuracy while minimizing the risk of human error during the invoice
              process.
            </div>
          </div>
        </div>

        <div class="card bg-secondary shadow-none">
          <div class="card-body p-4 space-y-4">
            <div class="inline-flex items-center gap-4">
              <div class="bg-gray-200 rounded-lg p-2">
                <IconUserFriendly />
              </div>
              <span class="text-xl font-semibold text-gray-900"> User-Friendly </span>
            </div>
            <div class="font-light text-gray-800 text-lg">
              Simplifies the invoice process through an intuitive, user-friendly application
              accessible anytime, anywhere from your computer.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="about" class="py-16">
    <div class="max-w-[1440px] lg:px-[40px] px-5 mx-auto">
      <div class="mb-6">
        <span class="rounded-full py-1 px-3 bg-gray-200 text-base text-gray-900"> About Us </span>
        <h1 class="font-semibold text-4xl text-[#283841] mt-4">About Us</h1>
      </div>
      <div class="flex flex-col lg:flex-row gap-6 lg:items-center">
        <LogoAN class="w-full" />
        <div class="col-span-2 card bg-secondary shadow-none">
          <div class="card-body p-4">
            <p class="font-light text-lg text-gray-800">
              At Arya Noble, we believe that strong partnerships with vendors are key to our
              operational excellence and sustainable growth. To support this, we implement a
              standardized and transparent Vendor Management System (VMS) that simplifies vendor
              registration and ensures efficient pre-qualification.
            </p>
            <p class="font-light text-lg text-gray-800">
              Through our digital invoice management process, we ensure every transaction is smooth,
              accurate, and high-quality delivering real value for both parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="py-9">
    <div class="max-w-[1440px] lg:px-[40px] px-5 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="card bg-secondary shadow-none">
          <div class="card-body p-6 space-y-2">
            <div class="inline-flex gap-2 items-center">
              <IconHeadOffice />
              <h3 class="font-medium text-base text-gray-700">Head Office</h3>
            </div>
            <p class="text-base font-semibold text-gray-800">
              Treasury Office Tower, 36-37th floor, SCBD Lot 28, RT.5/RW.3, Senayan, Kebayoran Baru,
              South Jakarta City, Jakarta 12190
            </p>
          </div>
          <div class="card-body p-6 space-y-2">
            <div class="inline-flex gap-2 items-center">
              <IconPhone />

              <h3 class="font-medium text-base text-gray-700">Phone</h3>
            </div>
            <p class="text-base font-semibold text-gray-800">(021) 50200581</p>
          </div>
        </div>
        <div class="card bg-secondary shadow-none">
          <div class="card-body p-6 space-y-2">
            <div class="inline-flex gap-2 items-center">
              <IconEmail />

              <h3 class="font-medium text-base text-gray-700">Email</h3>
            </div>
            <p class="text-base font-semibold text-gray-800">marcellino.fauzan@aryanoble.co.id</p>
          </div>
          <div class="card-body p-6 space-y-2">
            <div class="inline-flex gap-2 items-center">
              <IconEmail />

              <h3 class="font-medium text-base text-gray-700">Email SSC SM</h3>
            </div>
            <p class="text-base font-semibold text-gray-800">ssc.sm@aryanoble.co.id</p>
          </div>
        </div>
      </div>

      <div class="card bg-secondary shadow-none">
        <div class="card-body p-6">
          <div class="flex items-center justify-between mb-8">
            <LogoAN class="w-[81px] h-auto" />
            <div class="space-x-6">
              <a href="#" class="text-lg font-semibold text-gray-900">Terms & Conditions</a>
              <a href="#" class="text-lg font-semibold text-gray-900">Privacy Policy</a>
            </div>
          </div>

          <div class="border-t border-gray-200 text-base font-medium text-gray-600 pt-4 text-right">
            © {{ year }} e-Procurement Arya Noble Content Copyright
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
