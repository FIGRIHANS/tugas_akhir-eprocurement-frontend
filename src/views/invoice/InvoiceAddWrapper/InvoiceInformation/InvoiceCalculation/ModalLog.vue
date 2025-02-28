<template>
  <div class="modal" data-modal="true" id="calculation_log_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-header">
        <h3 class="modal-title text-lg font-semibold py-[20px] px-[16px]">
          Log Information
        </h3>
        <button class="btn btn-xs btn-clear btn-light" data-modal-dismiss="true">
          <i class="ki-outline ki-cross">
          </i>
        </button>
      </div>
      <div class="modal-body py-[16px] px-[30px] flex flex-col gap-[20px]">
        <div class="flex gap-[10px]">
          <span class="text-sm text-gray-600 flex-1">Type</span>
          <span class="text-sm flex-1">Information Message</span>
        </div>
        <div class="flex gap-[10px]">
          <span class="text-sm text-gray-600 flex-1">Warning</span>
          <div class="flex-1">
            <span class="badge badge-outline badge-warning">
              Warning
            </span>
          </div>
        </div>
        <div class="flex gap-[10px] mb-[30px]">
          <span class="text-sm text-gray-600 flex-1">Error</span>
          <span class="text-sm text-red-600 flex-1">Error Message</span>
        </div>
      </div>
    </div>
  </div>
</template>