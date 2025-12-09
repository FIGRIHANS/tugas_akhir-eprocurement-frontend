<template>
  <div class="space-y-5">
    <div class="card">
      <div class="card-body flex gap-5">
        <img :src="informationImg" alt="information" />
        <div>
          <h1 class="font-semibold text-2xl mb-3">What Is Invoice Type ?</h1>
          <p class="text-gray-600 text-sm">
            Specifies the category or classification of an invoice. It determines how the invoice is
            processed, recorded, and validated within the system.
          </p>
        </div>
      </div>
    </div>

    <div class="card bg-[#F9F9F933]">
      <div class="card-body">
        <h1 class="text-xl font-semibold mb-5">Select Invoice Type</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            class="card cursor-pointer hover:bg-white hover:shadow-md transition-all duration-300"
            v-for="data in vmData"
            :key="data.title"
          >
            <div class="card-body space-y-3">
              <div @click="navigateTo(data.to)">
                <UiIcon :name="data.icon" class="text-sky-600 text-2xl" variant="filled" />
                <h2 class="font-semibold text-base">{{ data.title }}</h2>
              </div>

              <div>
                <p class="text-gray-500 text-sm">
                  {{
                    expandedCards[data.title]
                      ? data.description
                      : truncateText(data.description, 100)
                  }}
                  <span
                    v-if="data.description.length > 100"
                    @click.stop="toggleExpand(data.title)"
                    class="text-sky-600 hover:text-sky-700 cursor-pointer font-medium ml-1"
                  >
                    {{ expandedCards[data.title] ? 'Less' : 'Details' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRouter } from 'vue-router'
import informationImg from '@/assets/svg/information.svg'

const router = useRouter()
const expandedCards = ref<Record<string, boolean>>({})

const navigateTo = (to: string) => {
  if (to !== '#') {
    router.push({ name: to })
  }
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const toggleExpand = (title: string) => {
  expandedCards.value[title] = !expandedCards.value[title]
}

const vmData = [
  {
    icon: 'user-square',
    title: 'Invoice With PO',
    description:
      'An invoice that is issued based on a previously created Purchase Order, ensuring that the billing matches the items, quantities, and prices approved in the procurement process.',
    to: '#',
  },
  {
    icon: 'subtitle',
    title: 'Expense Management',
    description:
      'The process of tracking, controlling, and approving business-related expenses to ensure accurate reporting, compliance with company policies, and efficient financial management.',
    to: '#',
  },
  {
    icon: 'subtitle',
    title: 'Invoice FTP Integration',
    description:
      'A system process that automatically transfers invoice files between platforms using FTP, enabling seamless data exchange, faster processing, and reduced manual handling.',
    to: '#',
  },
  {
    icon: 'subtitle',
    title: 'Invoice Email Integration',
    description:
      'A system feature that automatically receives, extracts, and processes invoice documents sent via email, enabling seamless intake, reduced manual effort, and faster invoice handling.',
    to: '#',
  },
  {
    icon: 'subtitle',
    title: 'Text Reconciliation',
    description:
      'The process of comparing and matching extracted text data against source documents or system records to ensure accuracy, consistency, and completeness.',
    to: '#',
  },
]
</script>
