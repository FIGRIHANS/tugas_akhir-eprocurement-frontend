// Route untuk modul Tax Reconciliation (VAT In, VAT Out, WHT Unifikasi, WHT Pasal 21)
export default [

  // === VAT IN (Pajak Masukan / PPN Pembelian) ===
  {
    path: '/vat-in-reconciliation',
    name: 'vatInReconciliation',
    component: () => import('@/views/taxReconciliation/VatInReconciliation.vue'), // List faktur pajak masukan
  },
  {
    path: '/vat-in-reconciliation/pj-submit',
    name: 'vatPjSubmitFromInvoice',
    component: () => import('@/views/taxReconciliation/VatPjSubmitFromInvoice.vue'), // Submit konfirmasi pengkreditan dari Invoice
  },
  {
    path: '/vat-in-reconciliation/:id',
    name: 'vatInReconciliationDetail',
    component: () => import('@/views/taxReconciliation/VatInReconciliationDetail.vue'), // Detail faktur pajak masukan
  },

  // === VAT OUT (Pajak Keluaran / e-Faktur) ===
  {
    path: '/vat-out-reconciliation',
    name: 'vatOutReconciliation',
    component: () => import('@/views/taxReconciliation/VatOutReconciliation.vue'), // List faktur pajak keluaran
  },
  {
    path: '/vat-out-reconciliation/create',
    name: 'vatOutReconciliationCreate',
    component: () => import('@/views/taxReconciliation/VatOutCreate.vue'), // Form buat faktur pajak keluaran baru
  },
  {
    path: '/vat-out-reconciliation/detail/:id',
    name: 'vatOutReconciliationDetail',
    component: () => import('@/views/taxReconciliation/VatOutDetail.vue'), // Detail & download PDF e-Faktur
    props: true,
  },

  // === WHT UNIFIKASI (BPU — Bukti Pemotongan Unifikasi PPh 23/22/15/4(2)) ===
  {
    path: '/wht-reconciliation',
    name: 'whtReconciliation',
    component: () => import('@/views/taxReconciliation/WhtReconciliation.vue'),
  },
  {
    path: '/wht-unifikasi',
    name: 'whtUnifikasi',
    component: () => import('@/views/taxReconciliation/WhtReconciliation.vue'), // List BPU
  },
  {
    path: '/wht-unifikasi/create',
    name: 'whtUnifikasiCreate',
    component: () => import('@/views/taxReconciliation/BpuCreate.vue'), // Form buat BPU baru → simpan ke DB → kirim ke DJP
  },
  {
    path: '/wht-unifikasi/detail/:id',
    name: 'whtUnifikasiDetail',
    component: () => import('@/views/taxReconciliation/BpuDetail.vue'), // Detail BPU
    props: true,
  },

  // === WHT PASAL 21 (Bukti Pemotongan PPh Pasal 21) ===
  {
    path: '/wht-pasal-21',
    name: 'whtPasal21',
    component: () => import('@/views/taxReconciliation/WhtReconciliation.vue'), // List PPh 21
  },
  {
    path: '/wht-pasal-21/create',
    name: 'whtPasal21Create',
    component: () => import('@/views/taxReconciliation/Pph21Create.vue'), // Form buat PPh 21 baru → simpan ke DB → kirim ke DJP
  },
  {
    path: '/wht-pasal-21/detail/:id',
    name: 'whtPasal21Detail',
    component: () => import('@/views/taxReconciliation/Pph21Detail.vue'), // Detail PPh 21
    props: true,
  },
]
