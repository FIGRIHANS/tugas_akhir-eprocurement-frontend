<script setup lang="ts">
import HeroImage from '@/assets/svg/HeroImage.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.52844 0.833336H11.6579L16.8528 6.24813V16.78C16.8528 18.0993 15.7854 19.1667 14.4706 19.1667H5.52844C4.2091 19.1667 3.14172 18.0993 3.14172 16.78V3.22005C3.1417 1.90072 4.20908 0.833336 5.52844 0.833336Z"
              fill="#F8285A"
            />
            <path
              opacity="0.302"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.6533 0.833336V6.2069H16.8528L11.6533 0.833336Z"
              fill="white"
            />
            <path
              d="M5.79419 14.5123V11.1636H7.2189C7.57164 11.1636 7.85109 11.2598 8.06182 11.4568C8.27254 11.6492 8.37792 11.9103 8.37792 12.2356C8.37792 12.5608 8.27254 12.8219 8.06182 13.0143C7.85109 13.2113 7.57164 13.3075 7.2189 13.3075H6.65084V14.5123H5.79419ZM6.65084 12.5791H7.1227C7.25096 12.5791 7.35174 12.5517 7.42047 12.4875C7.48918 12.428 7.52585 12.3455 7.52585 12.2356C7.52585 12.1256 7.4892 12.0432 7.42047 11.9836C7.35177 11.9195 7.25098 11.892 7.1227 11.892H6.65084V12.5791ZM8.73064 14.5123V11.1636H9.91712C10.1508 11.1636 10.3707 11.1956 10.5768 11.2644C10.7829 11.3331 10.9708 11.4293 11.1357 11.5622C11.3006 11.6904 11.4334 11.8645 11.5296 12.0844C11.6213 12.3043 11.6717 12.5562 11.6717 12.8403C11.6717 13.1197 11.6213 13.3717 11.5296 13.5915C11.4334 13.8114 11.3006 13.9855 11.1357 14.1138C10.9707 14.2466 10.7829 14.3428 10.5768 14.4115C10.3707 14.4803 10.1508 14.5123 9.91712 14.5123H8.73064ZM9.56897 13.784H9.81634C9.94918 13.784 10.0729 13.7702 10.1874 13.7381C10.2973 13.7061 10.4027 13.6557 10.5035 13.587C10.5997 13.5183 10.6776 13.422 10.7325 13.2938C10.7875 13.1655 10.815 13.0143 10.815 12.8403C10.815 12.6616 10.7875 12.5104 10.7325 12.3822C10.6776 12.2539 10.5997 12.1577 10.5035 12.089C10.4027 12.0203 10.2974 11.9699 10.1874 11.9378C10.0729 11.9057 9.94918 11.892 9.81634 11.892H9.56897V13.784ZM12.1023 14.5123V11.1636H14.4844V11.892H12.9589V12.428H14.1775V13.1518H12.9589V14.5123H12.1023Z"
              fill="white"
            />
          </svg>
        </UiButton>
      </div>
      <HeroImage class="w-full h-auto" />
    </div>
  </section>
</template>
