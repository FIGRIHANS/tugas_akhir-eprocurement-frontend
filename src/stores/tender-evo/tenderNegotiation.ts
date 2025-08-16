import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ParticipatingVendorTypes } from '../types/participatingVendor'

export const useTenderEvoStore = defineStore('tenderNegotiationEvo', () => {
  const dummyVendor = ref<ParticipatingVendorTypes[]>([
    {
      id: '1',
      status: 'invited',
      vendorCode: '1060',
      rank: '1',
      vendorName: 'PT Walldorf Grosshandel Tbk',
      totalScore: '80',
      productQuality: '80',
      leadTimeQuality: '80',
      afterSalesWarranty: '80',
      orderAbsorption: '80',
      totalPo: '1000',
    },
    {
      id: '2',
      status: 'invited',
      vendorCode: '2983',
      rank: '2',
      vendorName: 'PT Sommer GmbHTbk',
      totalScore: '80',
      productQuality: '80',
      leadTimeQuality: '80',
      afterSalesWarranty: '80',
      orderAbsorption: '80',
      totalPo: '1000',
    },
    {
      id: '3',
      status: 'invited',
      vendorCode: '8765',
      rank: '3',
      vendorName: 'PT Kreutzschmid KgaA Tbk',
      totalScore: '80',
      productQuality: '80',
      leadTimeQuality: '80',
      afterSalesWarranty: '80',
      orderAbsorption: '80',
      totalPo: '1000',
    },
    {
      id: '4',
      status: 'invited',
      vendorCode: '3546',
      rank: '4',
      vendorName: 'PT Hamberger u. CO.Tbk',
      totalScore: '80',
      productQuality: '80',
      leadTimeQuality: '80',
      afterSalesWarranty: '80',
      orderAbsorption: '80',
      totalPo: '1000',
    },
  ])

  const dummyData = ref([
    {
      materialCode: 'CH-1062',
      materialDesc: 'Macro Fertilizer Urea',
      quantity: 30,
      uom: 'TON',
      bottomPriceLBMA: 100861.5,
      unitPriceLBMA: 3362.0,
      simulationAmount: 93000.0,
      variance: '-8%',
      currency: 'USD',
      awardDraft: '1 winner',
      simulationStatus: 'Error',
      simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
      bids: [
        {
          id: 1,
          rank: 1,
          vendor: 'PT Walldorf Tbk',
          negoQty: 30,
          uom: 'TON',
          bottomPrice: 100861.5,
          unitPrice: 3100.0,
          negotiationAmount: 93000.0,
          var: '-8%',
          currency: 'USD',
          awardStatus: '🏅',
        },
        {
          id: 2,
          rank: 2,
          vendor: 'PT Somper GmbH Tbk',
          negoQty: 0,
          uom: 'TON',
          bottomPrice: null,
          unitPrice: 3200.0,
          negotiationAmount: null,
          var: '0%',
          currency: 'USD',
          awardStatus: '',
        },
        {
          id: 3,
          rank: 3,
          vendor: 'PT Kreuzschmid Kgaa Tbk',
          negoQty: 0,
          uom: 'TON',
          bottomPrice: null,
          unitPrice: 3250.0,
          negotiationAmount: null,
          var: '0%',
          currency: 'USD',
          awardStatus: '',
        },
      ],
    },
    {
      materialCode: 'CH-1064',
      materialDesc: 'Macro Fertilizer NPK',
      quantity: 33,
      uom: 'TON',
      bottomPriceLBMA: 110947.65,
      unitPriceLBMA: 3362.05,
      simulationAmount: 103300.0,
      variance: '-7%',
      currency: 'USD',
      awardDraft: '2 winner',
      simulationStatus: 'Completed',
      simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
      bids: [
        {
          id: 1,
          rank: 1,
          vendor: 'PT Walldorf Tbk',
          negoQty: 23,
          uom: 'TON',
          bottomPrice: 77327.15,
          unitPrice: 3100.0,
          negotiationAmount: 71300.0,
          var: '-8%',
          currency: 'USD',
          awardStatus: '🏅',
        },
        {
          id: 2,
          rank: 2,
          vendor: 'PT Somper GmbH Tbk',
          negoQty: 10,
          uom: 'TON',
          bottomPrice: 33620.5,
          unitPrice: 3200.0,
          negotiationAmount: 32000.0,
          var: '-5%',
          currency: 'USD',
          awardStatus: '🏅',
        },
        {
          id: 3,
          rank: 3,
          vendor: 'PT Kreuzschmid Kgaa Tbk',
          negoQty: 0,
          uom: 'TON',
          bottomPrice: null,
          unitPrice: 3250.0,
          negotiationAmount: null,
          var: '0%',
          currency: 'USD',
          awardStatus: '',
        },
      ],
    },
    {
      materialCode: 'CH-1066',
      materialDesc: 'Macro Fertilizer CaCO3',
      quantity: 25,
      uom: 'TON',
      bottomPriceLBMA: 84051.25,
      unitPriceLBMA: 3362.0,
      simulationAmount: 79250.0,
      variance: '-6%',
      currency: 'USD',
      awardDraft: '3 winner',
      simulationStatus: 'Completed',
      simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
      bids: [
        {
          id: 1,
          rank: 1,
          vendor: 'PT Walldorf Tbk',
          negoQty: 10,
          uom: 'TON',
          bottomPrice: 33620.5,
          unitPrice: 3100.0,
          negotiationAmount: 31000.0,
          var: '-8%',
          currency: 'USD',
          awardStatus: '🏅',
        },
        {
          id: 2,
          rank: 2,
          vendor: 'PT Somper GmbH Tbk',
          negoQty: 10,
          uom: 'TON',
          bottomPrice: 33620.5,
          unitPrice: 3200.0,
          negotiationAmount: 32000.0,
          var: '-5%',
          currency: 'USD',
          awardStatus: '🏅',
        },
        {
          id: 3,
          rank: 3,
          vendor: 'PT Kreuzschmid Kgaa Tbk',
          negoQty: 5,
          uom: 'TON',
          bottomPrice: 16810.25,
          unitPrice: 3250.0,
          negotiationAmount: 16250.0,
          var: '3%',
          currency: 'USD',
          awardStatus: '🏅',
        },
      ],
    },
  ])

  const updateQty = (row: any, bid: any) => {
    let qty = Number(bid.negoQty || 0)
    if (qty < 0) qty = 0
    if (qty > row.quantity) qty = row.quantity

    const totalOthers = row.bids
      .filter((b: any) => b !== bid)
      .reduce((s: number, b: any) => s + Number(b.negoQty || 0), 0)

    const allowedForThis = Math.max(0, row.quantity - totalOthers)
    if (qty > allowedForThis) qty = allowedForThis

    bid.negoQty = qty

    if (bid.unitPrice != null) {
      bid.negotiationAmount = qty > 0 ? qty * Number(bid.unitPrice) : 0
    }

    // // Calculate total count and emit
    // const totalCount = row.bids.reduce((sum, b) => sum + (b.negoQty || 0), 0)
  }

  return {
    dummyVendor,
    dummyData,
    updateQty,
  }
})
