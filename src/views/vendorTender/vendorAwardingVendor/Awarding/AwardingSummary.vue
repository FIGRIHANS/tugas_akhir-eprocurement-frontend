<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        Awarding Summary
      </h3>
    </div>

    <div class="card-body">
      <!-- Vendor Awards Summary -->
      <div class="mb-6">
        <h5 class="mb-4">Awarded Vendors</h5>
        <div class="row">
          <div v-for="vendor in awardedVendors" :key="vendor.vendorCode" class="col-md-6 mb-4">
            <div class="card border border-success">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 class="card-title mb-1">{{ vendor.vendorName }}</h6>
                    <span class="text-muted small">{{ vendor.vendorCode }}</span>
                  </div>
                  <span class="badge badge-success">Awarded</span>
                </div>

                <div class="row text-center">
                  <div class="col-4">
                    <div class="border-end pe-3">
                      <div class="fw-bold text-primary">{{ vendor.itemCount }}</div>
                      <div class="small text-muted">Items</div>
                    </div>
                  </div>
                  <div class="col-8">
                    <div class="ps-3">
                      <div class="fw-bold text-success">
                        {{ formatCurrency(parseFloat(vendor.totalValue)) }}</div>
                      <div class="small text-muted">Total Value</div>
                    </div>
                  </div>
                </div>

                <hr class="my-3">

                <div class="small">
                  <div class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Contact:</span>
                    <span>{{ vendor.contactPerson }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Email:</span>
                    <span class="small">{{ vendor.email }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="text-muted">Phone:</span>
                    <span>{{ vendor.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Statistics -->
      <div class="row">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <div class="fs-2 fw-bold">{{ totalItems }}</div>
              <div class="small">Total Items</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <div class="fs-2 fw-bold">{{ awardedItems }}</div>
              <div class="small">Awarded Items</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body text-center">
              <div class="fs-2 fw-bold">{{ pendingItems }}</div>
              <div class="small">Pending Items</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body text-center">
              <div class="fs-2 fw-bold">{{ awardedVendors.length }}</div>
              <div class="small">Awarded Vendors</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Value Summary -->
      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card border-primary">
            <div class="card-body">
              <h6 class="card-title text-primary">Estimated Budget</h6>
              <div class="fs-3 fw-bold">{{ formatCurrency(estimatedTotal) }}</div>
              <small class="text-muted">Based on highest vendor prices</small>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-success">
            <div class="card-body">
              <h6 class="card-title text-success">Awarded Value</h6>
              <div class="fs-3 fw-bold text-success">{{ formatCurrency(awardedTotal) }}</div>
              <small class="text-success">
                Savings: {{ formatCurrency(savings) }} ({{ savingsPercentage }}%)
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mt-6">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold">Awarding Progress</span>
          <span class="text-muted">{{ awardedItems }}/{{ totalItems }} items
            ({{ progressPercentage }}%)</span>
        </div>
        <div class="progress" style="block-size: 10px;">
          <div class="progress-bar bg-success" role="progressbar"
            :style="{ inlineSize: progressPercentage + '%' }" :aria-valuenow="progressPercentage"
            aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    computed,
    inject
  } from 'vue'
  import type {
    VendorAwardingInfo,
    AwardingComparison
  } from '../types/awarding'

  const awardingComparisons = inject < AwardingComparison[] > ('awardingComparisons', [])

  const awardedVendors = computed((): VendorAwardingInfo[] => {
    const vendorMap = new Map < string,
      VendorAwardingInfo > ()

    awardingComparisons.forEach(item => {
      const selectedVendor = item.vendors.find(v => v.isSelected)
      if (selectedVendor) {
        const vendorCode = selectedVendor.vendorCode

        if (vendorMap.has(vendorCode)) {
          const existing = vendorMap.get(vendorCode) !
            existing.itemCount += 1
          existing.totalValue = (parseFloat(existing.totalValue) +
              (parseFloat(selectedVendor.finalPrice) * parseFloat(item.quantity)))
            .toString()
        } else {
          vendorMap.set(vendorCode, {
            vendorCode: selectedVendor.vendorCode,
            vendorName: selectedVendor.vendorName,
            totalValue: (parseFloat(selectedVendor.finalPrice) * parseFloat(item
              .quantity)).toString(),
            itemCount: 1,
            contactPerson: 'John Doe',
            email: 'contact@vendor.com',
            phone: '+62 21 1234567'
          })
        }
      }
    })

    return Array.from(vendorMap.values())
  })

  const totalItems = computed(() => awardingComparisons.length)

  const awardedItems = computed(() => {
    return awardingComparisons.filter(item =>
      item.vendors.some(vendor => vendor.isSelected)
    ).length
  })

  const pendingItems = computed(() => totalItems.value - awardedItems.value)

  const estimatedTotal = computed(() => {
    return awardingComparisons.reduce((total, item) => {
      const maxPrice = Math.max(...item.vendors.map(v => parseFloat(v.offeredPrice) || 0))
      return total + (maxPrice * parseFloat(item.quantity))
    }, 0)
  })

  const awardedTotal = computed(() => {
    return awardingComparisons.reduce((total, item) => {
      const selectedVendor = item.vendors.find(v => v.isSelected)
      if (selectedVendor) {
        return total + (parseFloat(selectedVendor.finalPrice) * parseFloat(item.quantity))
      }
      return total
    }, 0)
  })

  const savings = computed(() => estimatedTotal.value - awardedTotal.value)

  const savingsPercentage = computed(() => {
    if (estimatedTotal.value === 0) return 0
    return Math.round((savings.value / estimatedTotal.value) * 100)
  })

  const progressPercentage = computed(() => {
    if (totalItems.value === 0) return 0
    return Math.round((awardedItems.value / totalItems.value) * 100)
  })

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }
</script>
