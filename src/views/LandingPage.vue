<script setup lang="ts">
import IconEfficient from '@/components/icons/IconEfficient.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconHeadOffice from '@/components/icons/IconHeadOffice.vue'
import IconPDF from '@/components/icons/iconPDF.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import moment from 'moment'
import IconPhone from '../components/icons/IconPhone.vue'
import IconEmail from '../components/icons/IconEmail.vue'
import IconUserFriendly from '@/components/icons/IconUserFriendly.vue'
import LogoEPOQ from '@/assets/svg/EvoxLogo.vue'

const year = moment().format('YYYY')

const features = [
  {
    icon: IconEye,
    title: 'Transparent',
    description:
      'Every registration, tender, and invoice step is recorded digitally for full visibility across teams and vendors.',
  },
  {
    icon: IconEfficient,
    title: 'Efficient',
    description:
      'Automated workflows reduce manual work, speed up approvals, and minimize errors throughout procurement.',
  },
  {
    icon: IconUserFriendly,
    title: 'User-Friendly',
    description:
      'An intuitive interface lets employees and vendors manage transactions anytime, from any device.',
  },
]

const eprocurementPoints = [
  'Vendor registration & qualification',
  'Purchase order management',
  'Digital invoicing & verification',
  'Approval workflow & audit trail',
]
</script>

<template>
  <!-- Hero -->
  <section id="hero" class="landing-hero relative overflow-hidden">
    <div class="landing-hero__glow landing-hero__glow--left" />
    <div class="landing-hero__glow landing-hero__glow--right" />

    <div class="relative max-w-[1440px] mx-auto px-5 lg:px-[40px] py-24 lg:py-32">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div class="space-y-8">
          <span class="landing-badge">Digital Procurement Platform</span>

          <div class="space-y-5">
            <h1 class="text-4xl lg:text-[44px] font-bold text-gray-800 leading-[1.15] tracking-tight">
              Empowering Sustainable Partnerships Through Reliable Procurement Processes
            </h1>
            <p class="text-lg text-gray-500 leading-relaxed max-w-xl">
              Streamline your procurement lifecycle with a transparent, standardized, and
              value-driven e-Procurement platform built for organizations and vendors alike.
            </p>
          </div>

          <UiButton variant="primary" size="lg" class="!rounded-xl flex items-center gap-2 shadow-sm">
            <span class="text-white">Download Manual Book</span>
            <IconPDF class="text-white" />
          </UiButton>
        </div>

        <div class="flex justify-center lg:justify-end -translate-y-8">
          <LogoEPOQ width="480px" height="auto" />
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section id="advantages" class="py-20 lg:py-24 bg-white">
    <div class="max-w-[1440px] lg:px-[40px] px-5 mx-auto">
      <div class="text-center mb-12 max-w-2xl mx-auto">
        <span class="landing-badge">Why EVOX</span>
        <h2 class="text-3xl font-bold text-gray-800 mt-4 tracking-tight">
          Built for modern procurement teams
        </h2>
        <p class="text-gray-500 mt-3 text-lg">
          Three core principles that make every transaction faster, clearer, and more reliable.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="landing-feature-card group"
        >
          <div class="landing-feature-card__icon">
            <component :is="feature.icon" class="text-primary w-6 h-6" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mt-5">{{ feature.title }}</h3>
          <p class="text-gray-500 mt-3 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- About / What is E-Procurement -->
  <section id="about" class="py-20 lg:py-24 landing-about">
    <div class="max-w-[1440px] lg:px-[40px] px-5 mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div class="space-y-6">
          <span class="landing-badge">About E-Procurement</span>
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight leading-tight">
            What is E-Procurement?
          </h2>
          <p class="text-lg text-gray-500 leading-relaxed">
            <strong class="text-gray-700 font-medium">E-Procurement</strong> (electronic procurement)
            is the use of digital platforms to manage the entire purchasing process online — from
            vendor onboarding and tendering to purchase orders, invoicing, and payment tracking.
          </p>
          <p class="text-lg text-gray-500 leading-relaxed">
            It replaces manual, paper-based workflows with a centralized system that improves
            transparency, reduces processing time, and ensures every transaction is traceable and
            compliant.
          </p>

          <ul class="space-y-3 pt-2">
            <li
              v-for="point in eprocurementPoints"
              :key="point"
              class="flex items-center gap-3 text-gray-600"
            >
              <span class="landing-check-icon">
                <i class="ki-filled ki-check text-[10px] text-primary" />
              </span>
              {{ point }}
            </li>
          </ul>
        </div>

        <div class="landing-about-card">
          <div class="flex items-center gap-3 mb-6">
            <LogoEPOQ height="36px" />
            <span class="text-sm font-medium text-gray-400 uppercase tracking-widest">EVOX Platform</span>
          </div>
          <p class="text-gray-600 leading-relaxed text-lg">
            EVOX e-Procurement connects organizations and vendors in one integrated environment.
            Vendors register once, submit documents digitally, and track invoice status in real time
            — while internal teams gain full control over approvals, compliance, and reporting.
          </p>
          <div class="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-6">
            <div>
              <p class="text-3xl font-bold text-primary">100%</p>
              <p class="text-sm text-gray-500 mt-1">Digital workflow</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-primary">24/7</p>
              <p class="text-sm text-gray-500 mt-1">Platform access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 bg-white border-t border-gray-100">
    <div class="max-w-[1440px] lg:px-[40px] px-5 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div class="landing-footer-card">
          <div class="flex items-center gap-2 mb-4">
            <IconHeadOffice class="text-primary" />
            <h3 class="font-medium text-gray-700">Head Office</h3>
          </div>
          <p class="text-gray-600 leading-relaxed">
            Treasury Office Tower, 36-37th floor, SCBD Lot 28, Senayan, Kebayoran Baru, South Jakarta
            City, Jakarta 12190
          </p>
          <div class="flex items-center gap-2 mt-5">
            <IconPhone class="text-primary" />
            <p class="font-medium text-gray-800">(021) 50200581</p>
          </div>
        </div>

        <div class="landing-footer-card">
          <div class="flex items-center gap-2 mb-4">
            <IconEmail class="text-primary" />
            <h3 class="font-medium text-gray-700">Contact</h3>
          </div>
          <p class="text-gray-600">support@evox-procurement.com</p>
          <p class="text-gray-600 mt-2">helpdesk@evox-procurement.com</p>
        </div>
      </div>

      <div class="landing-footer-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <LogoEPOQ width="81px" height="auto" />
          <div class="flex gap-6">
            <a href="#" class="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
              Terms & Conditions
            </a>
            <a href="#" class="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-4 text-sm text-gray-400 text-right">
          © {{ year }} EVOX e-Procurement. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.landing-hero {
  background: linear-gradient(160deg, #f8fafb 0%, #eef6f5 45%, #f4f7f8 100%);
}

.landing-hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.landing-hero__glow--left {
  width: 420px;
  height: 420px;
  background: rgba(38, 180, 154, 0.12);
  top: -120px;
  left: -100px;
}

.landing-hero__glow--right {
  width: 360px;
  height: 360px;
  background: rgba(38, 180, 154, 0.08);
  bottom: -80px;
  right: -60px;
}

.landing-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(38, 180, 154, 0.1);
  color: var(--tw-primary, #26b49a);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.landing-feature-card {
  padding: 28px;
  background: #fff;
  border: 1px solid #f0f2f4;
  border-radius: 20px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.landing-feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(38, 180, 154, 0.2);
  box-shadow: 0 16px 40px rgba(38, 180, 154, 0.1);
}

.landing-feature-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(38, 180, 154, 0.1);
  transition: background 0.25s ease;
}

.landing-feature-card:hover .landing-feature-card__icon {
  background: rgba(38, 180, 154, 0.18);
}

.landing-about {
  background: linear-gradient(180deg, #fafbfc 0%, #f5f8f7 100%);
}

.landing-about-card {
  padding: 36px;
  background: #fff;
  border: 1px solid #eef1f3;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}

.landing-check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(38, 180, 154, 0.12);
  flex-shrink: 0;
}

.landing-footer-card {
  padding: 24px 28px;
  background: #fafbfc;
  border: 1px solid #f0f2f4;
  border-radius: 16px;
}
</style>
