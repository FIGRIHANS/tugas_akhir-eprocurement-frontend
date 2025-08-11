<template>
  <div class="stepper-status-wrapper">
    <div class="d-flex align-items-center justify-content-center">
      <!-- Stepper items -->
      <div v-for="(step, index) in steps" :key="step.stepNumber" class="d-flex align-items-center">
        <!-- Step Circle -->
        <div class="stepper-item">
          <div class="stepper-circle" :class="{
              'completed': step.isCompleted,
              'active': step.isActive,
              'pending': !step.isCompleted && !step.isActive
            }">
            <i v-if="step.isCompleted" class="ki-duotone ki-check text-white">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <span v-else class="step-number">{{ step.stepNumber }}</span>
          </div>
          <div class="stepper-label">
            <div class="step-name" :class="{ 'active': step.isActive || step.isCompleted }">
              {{ step.stepName }}
            </div>
            <div v-if="step.completedDate" class="step-date">
              {{ formatDate(step.completedDate) }}
            </div>
          </div>
        </div>

        <!-- Connector Line -->
        <div v-if="index < steps.length - 1" class="stepper-line" :class="{
            'completed': steps[index + 1].isCompleted || steps[index + 1].isActive
          }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    computed
  } from 'vue'
  import type {
    AwardingStep
  } from '../types/awarding'

  interface Props {
    currentStep ? : number
  }

  const props = defineProps < Props > ()

  const steps = computed((): AwardingStep[] => [{
      stepNumber: 1,
      stepName: 'Vendor Submission',
      isCompleted: true,
      isActive: false,
      completedDate: '2024-10-24'
    },
    {
      stepNumber: 2,
      stepName: 'Vendor Negotiation',
      isCompleted: true,
      isActive: false,
      completedDate: '2024-10-25'
    },
    {
      stepNumber: 3,
      stepName: 'Vendor Awarding',
      isCompleted: false,
      isActive: props.currentStep === 3,
      completedDate: undefined
    },
    {
      stepNumber: 4,
      stepName: 'Contract Signing',
      isCompleted: false,
      isActive: props.currentStep === 4,
      completedDate: undefined
    }
  ])

  const formatDate = (date: string): string => {
    if (!date) return ''
    try {
      const parsedDate = new Date(date)
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).replace(/,/g, '')
      }
    } catch (error) {
      console.warn('Date parsing error:', error)
    }
    return date
  }
</script>
