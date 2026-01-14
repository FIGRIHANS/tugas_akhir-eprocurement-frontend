export default [
  {
    path: '/delivery-notes',
    name: 'deliveryNotes',
    component: () => import('@/views/deliveryNotes/DeliveryNotes.vue'),
  },
  {
    path: '/delivery-notes-list',
    name: 'deliveryNotesList',
    component: () => import('@/views/deliveryNotes/DeliveryNotesList.vue'),
  },
  {
    path: '/delivery-notes/create',
    name: 'deliveryNotesCreate',
    component: () => import('@/views/deliveryNotes/DeliveryNotesCreate.vue'),
  },
  {
    path: '/delivery-notes/detail/:id',
    name: 'deliveryNotesDetail',
    component: () => import('@/views/deliveryNotes/DeliveryNotesDetail.vue'),
  },
]
