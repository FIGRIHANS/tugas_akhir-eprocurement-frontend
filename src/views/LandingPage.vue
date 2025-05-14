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

  <section id="advantages" class="py-20">
    <div class="max-w-[1440px] lg:px-[40px] px-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <span class="rounded-full py-1 px-3 bg-gray-200 text-base text-gray-900">
            Our Advantages
          </span>
          <h1 class="font-semibold text-4xl text-[#283841] mt-4">Tender Process</h1>
        </div>
        <div class="text-base font-normal text-[#656565] self-end">
          Every step—from registration to tender selection—is designed to be transparent, efficient,
          and easy to use.
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card bg-secondary shadow-none">
          <div class="card-body p-4 space-y-4">
            <div class="inline-flex items-center gap-4">
              <div class="bg-gray-200 rounded-lg p-2">
                <svg
                  width="30"
                  height="31"
                  viewBox="0 0 30 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 2C22.4558 2 28.5 8.04416 28.5 15.5C28.5 22.9558 22.4558 29 15 29C7.54416 29 1.5 22.9558 1.5 15.5C1.5 8.04416 7.54416 2 15 2ZM15 4C8.64873 4 3.5 9.14873 3.5 15.5C3.5 21.8513 8.64873 27 15 27C21.3513 27 26.5 21.8513 26.5 15.5C26.5 9.14873 21.3513 4 15 4ZM15 9.8125C17.8414 9.8125 20.6218 11.2169 22.6318 13.9033L22.7568 14.085C23.2988 14.9493 23.2988 16.0507 22.7568 16.915L22.6318 17.0967C20.6218 19.7831 17.8414 21.1875 15 21.1875C12.1586 21.1875 9.37821 19.7831 7.36816 17.0967C6.6599 16.1501 6.6599 14.8499 7.36816 13.9033C9.37821 11.2169 12.1586 9.8125 15 9.8125ZM15 11.8125C12.8508 11.8125 10.6408 12.8682 8.96973 15.1016C8.79298 15.3378 8.79298 15.6622 8.96973 15.8984C10.6408 18.1318 12.8508 19.1875 15 19.1875C17.1492 19.1875 19.3592 18.1318 21.0303 15.8984L21.0889 15.8066C21.1885 15.6148 21.1885 15.3852 21.0889 15.1934L21.0303 15.1016C19.3592 12.8682 17.1492 11.8125 15 11.8125ZM15 13C16.3807 13 17.5 14.1193 17.5 15.5C17.5 16.8807 16.3807 18 15 18C13.6193 18 12.5 16.8807 12.5 15.5C12.5 15.3589 12.5117 15.2206 12.5342 15.0859C12.5531 14.9724 12.7109 14.9551 12.7842 15.0439C13.0134 15.3225 13.3611 15.5 13.75 15.5C14.4404 15.5 15 14.9404 15 14.25C15 13.8611 14.8225 13.5134 14.5439 13.2842C14.4551 13.2109 14.4724 13.0531 14.5859 13.0342C14.7206 13.0117 14.8589 13 15 13Z"
                    fill="#071437"
                  />
                </svg>
              </div>
              <span class="text-xl text-gray-900 font-semibold"> Transparent </span>
            </div>
            <div class="font-light text-gray-800 text-lg">
              Enhances transparency in the registration and tender submission process.
            </div>
          </div>
        </div>

        <div class="card bg-secondary shadow-none">
          <div class="card-body p-4 space-y-4">
            <div class="inline-flex items-center gap-4">
              <div class="bg-gray-200 rounded-lg p-2">
                <svg
                  width="30"
                  height="31"
                  viewBox="0 0 30 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.2 16.4L16.25 3L15 13H23C23.824 13 24.2944 13.9408 23.8 14.6L13.75 28L15 18H7C6.17595 18 5.70557 17.0592 6.2 16.4Z"
                    stroke="#071437"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span class="text-xl text-gray-900 font-semibold"> Efficient </span>
            </div>
            <div class="font-light text-gray-800 text-lg">
              Improves data accuracy while minimizing the risk of human error during the tender
              process.
            </div>
          </div>
        </div>

        <div class="card bg-secondary shadow-none">
          <div class="card-body p-4 space-y-4">
            <div class="inline-flex items-center gap-4">
              <div class="bg-gray-200 rounded-lg p-2">
                <svg
                  width="30"
                  height="31"
                  viewBox="0 0 30 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.625 13L13.75 16.125L20 9.875M8.75 3H21.25C23.3211 3 25 4.67893 25 6.75V28L16.9875 22.9922C15.7715 22.2322 14.2285 22.2322 13.0125 22.9922L5 28V6.75C5 4.67893 6.67893 3 8.75 3Z"
                    stroke="#071437"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span class="text-xl font-semibold text-gray-900"> User-Friendly </span>
            </div>
            <div class="font-light text-gray-800 text-lg">
              Simplifies the tender process through an intuitive, user-friendly application
              accessible anytime, anywhere from your computer.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
