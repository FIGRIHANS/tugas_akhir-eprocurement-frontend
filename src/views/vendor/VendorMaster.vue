<template>
  <h1>Vendor Master Page</h1>

  <button class="btn btn-primary" data-modal-toggle="#modal_1">Show Modal</button>
  <div class="modal" data-modal="true" id="modal_1">
    <div class="modal-content max-w-[600px] top-[20%]">
      <div class="modal-header">
        <h3 class="modal-title">Modal Title</h3>
        <button class="btn btn-xs btn-icon btn-light" data-modal-dismiss="true">
          <i class="ki-outline ki-cross"> </i>
        </button>
      </div>
      <div class="modal-body">
        Modal components are commonly used for various purposes such as displaying login forms,
        confirming actions, presenting multimedia content, or showing detailed information. They
        provide a non-intrusive way to engage users and guide them through specific tasks or actions
        while maintaining the context of the underlying webpage.
      </div>
    </div>
  </div>
</template>
