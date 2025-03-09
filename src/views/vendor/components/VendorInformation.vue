<template>
  <div class="space-y-5">
    <div class="card">
      <div class="card-body flex gap-5">
        <img :src="informationImg" alt="information" />
        <div>
          <h1 class="font-semibold text-2xl mb-3">What Is Vendor Management ?</h1>
          <p class="text-gray-600 text-sm">
            Explore exciting collaboration opportunities with our blog. We're open to partnerships,
            guest posts, and more. Join us to share your insights and grow your audience.
          </p>
        </div>
      </div>
    </div>

    <div class="card bg-[#F9F9F933]">
      <div class="card-body">
        <h1 class="text-xl font-semibold mb-5">How to create vendor management?</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="card" v-for="data in vmData" :key="data.title">
            <div class="card-body space-y-3">
              <UiIcon :name="data.icon" class="text-sky-600 text-2xl" variant="filled" />
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
        <h1 class="text-xl font-semibold mb-5">How process vendor management?</h1>
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
    title: 'User Cards',
    description: 'A Broad Perspective on Our Comprehensive Security Features and Policies.',
  },
  {
    icon: 'subtitle',
    title: 'User Base',
    description: 'A Broad Perspective on Our Comprehensive Security Features and Policies.',
  },
  {
    icon: 'subtitle',
    title: 'Cooperators',
    description: 'A Broad Perspective on Our Comprehensive Security Features and Policies.',
  },
  {
    icon: 'subtitle',
    title: 'Community Engagement',
    description: 'A Broad Perspective on Our Comprehensive Security Features and Policies.',
  },
  {
    icon: 'subtitle',
    title: 'Donatiors',
    description: 'A Broad Perspective on Our Comprehensive Security Features and Policies.',
  },
]

const stepAct = [
  {
    icon: 'share',
    title: 'Posted a new article <a>Top 10 Tech Trends</a>',
    date: 'Today, 9:00 AM',
  },
  {
    icon: 'entrance-left',
    title: 'I had the privilege of interviewing an industry expert for an upcoming blog post ',
    date: 'Today, 9:00 AM',
  },
  {
    icon: 'share',
    title: "I couldn't resist sharing a sneak peek of our upcoming content",
    date: '5 days ago, 4:07 PM',
  },
  {
    icon: 'coffee',
    title: 'Reaching the milestone of 10,000 followers on the blog was a dream come true',
    date: '5 days ago, 4:07 PM',
  },
  {
    icon: 'rocket',
    title: "We recently celebrated the blog's 1-year anniversary",
    date: '3 weeks ago, 4:07 PM',
  },
]
</script>
