<template>
  <div class="pb-20">
    <Breadcrumb title="Create Tax Invoice (VAT Out)" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="space-y-6">
      <div class="flex gap-[24px] items-start">

        <!-- LEFT COLUMN -->
        <div class="flex-1 space-y-6">

          <!-- Section 1: Transaction Document -->
          <div class="card p-[20px]">
            <h3 class="text-lg font-semibold mb-[16px]">Transaction Document</h3>
            <div class="flex flex-col gap-[8px]">

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Flags</label>
                <div class="flex gap-6 items-center flex-1">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="form.fgUangMuka" class="checkbox checkbox-primary checkbox-sm" id="uangMuka" />
                    <span class="text-sm">Down Payment</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="form.fgPelunasan" class="checkbox checkbox-primary checkbox-sm" id="pelunasan" />
                    <span class="text-sm">Settlement</span>
                  </label>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Transaction Code</label>
                <select class="select flex-1" v-model="form.detailTransaksi">
                  <option value="1">01 : Kepada pihak lain selain Pemungut PPN</option>
                  <option value="2">02 : kepada Pemungut PPN Instansi Pemerintah</option>
                  <option value="3">03 : kepada Pemungut PPN selain Instansi Pemerintah</option>
                  <option value="4">04 : penyerahan yang menggunakan Dasar Pengenaan Pajak (DPP) Nilai Lain</option>
                  <option value="5">05 : penyerahan yang PPN-nya dipungut dengan besaran tertentu</option>
                  <option value="6">06 : kepada pemegang paspor luar negeri dalam rangka VAT Refund for Tourist</option>
                  <option value="7">07 : penyerahan yang mendapat fasilitas PPN dan/atau PPnBM Tidak Dipungut atau Ditanggung Pemerintah</option>
                  <option value="8">08 : penyerahan yang mendapat fasilitas dibebaskan dari pengenaan PPN dan/atau PPnBM</option>
                  <option value="9">09 : penyerahan aktiva yang menurut tujuan semula tidak untuk diperjualbelikan</option>
                  <option value="10">10 : untuk penyerahan lainnya</option>
                </select>
              </div>

              <div v-if="['7', '8'].includes(form.detailTransaksi)" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Additional Info</label>
                <select class="select flex-1" v-model="form.idKeteranganTambahan">
                  <option value="1">1 - untuk Kawasan Bebas</option>
                  <option value="2">2 - untuk Tempat Penimbunan Berikat</option>
                  <option value="3">3 - untuk Hibah dan Bantuan Luar Negeri</option>
                  <option value="4">4 - untuk Avtur</option>
                  <option value="5">5 - untuk Lainnya</option>
                  <option value="6">6 - untuk Kontraktor Perjanjian Karya Pengusahaan Pertambangan Batubara Generasi I</option>
                  <option value="7">7 - untuk Penyerahan bahan bakar minyak untuk Kapal Angkutan Laut Luar Negeri</option>
                  <option value="8">8 - untuk Penyerahan jasa kena pajak terkait alat angkutan tertentu</option>
                  <option value="9">9 - untuk Penyerahan BKP Tertentu di KEK</option>
                  <option value="10">10 - untuk BKP tertentu yang bersifat strategis berupa anode slime</option>
                  <option value="11">11 - untuk Penyerahan alat angkutan tertentu dan/atau Jasa Kena Pajak terkait alat angkutan tertentu</option>
                </select>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Invoice Type</label>
                <select class="select flex-1" v-model="form.jenisFaktur">
                  <option value="0">0 : Faktur Pajak</option>
                  <option value="1">1 : Faktur Pajak Pengganti</option>
                </select>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Invoice Serial No.</label>
                <input type="text" class="input flex-1 bg-gray-50 text-gray-500 cursor-not-allowed" disabled placeholder="Auto-generated by system" />
              </div>

              <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Invoice Date <span class="text-danger">*</span></label>
                <div class="flex gap-4 flex-1 flex-wrap items-center">
                  <input type="date" class="input flex-1 min-w-[160px]" v-model="tanggalFakturInput" required />
                  <div class="flex gap-4 items-center">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500 font-medium">Tax Period</span>
                      <input type="text" class="input w-[64px] text-center bg-gray-50" v-model="form.masaPajak" readonly />
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500 font-medium">Tax Year</span>
                      <input type="text" class="input w-[80px] text-center bg-gray-50" v-model="form.tahunPajak" readonly />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Reference</label>
                <input type="text" class="input flex-1" v-model="form.referensi" placeholder="e.g. PO-2026-001234" />
              </div>

            </div>
          </div>

          <!-- Section 2: Buyer Information -->
          <div class="card p-[20px]">
            <h3 class="text-lg font-semibold mb-[16px]">Buyer Information</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">

              <!-- Left Col -->
              <div class="flex flex-col gap-1">
                <label class="form-label text-sm font-medium text-gray-600">Identity Type</label>
                <div class="flex gap-4 items-center h-10">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="identitasTipe" value="NPWP" class="radio radio-primary radio-xs" id="idNpwp" />
                    <span class="text-sm">NPWP</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="identitasTipe" value="NIK" class="radio radio-primary radio-xs" id="idNik" />
                    <span class="text-sm">NIK</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="identitasTipe" value="Passport" class="radio radio-primary radio-xs" id="idPassport" />
                    <span class="text-sm">Passport</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="identitasTipe" value="ID Lain" class="radio radio-primary radio-xs" id="idLain" />
                    <span class="text-sm">ID Lain</span>
                  </label>
                </div>
              </div>

              <!-- Right Col -->
              <div class="flex flex-col gap-1">
                <label class="form-label text-sm font-medium text-gray-600">Buyer NPWP <span class="text-danger">*</span></label>
                <div class="relative">
                  <input type="text" class="input w-full pr-10" v-model="form.npwpPembeli" placeholder="e.g. 1091031210969728" required />
                  <i v-if="isValidNpwp" class="ki-filled ki-check-circle text-success text-xl absolute right-3 top-1/2 -translate-y-1/2"></i>
                </div>
              </div>

              <!-- Left Col -->
              <div class="flex flex-col gap-1">
                <label class="form-label text-sm font-medium text-gray-600">Country</label>
                <select class="select w-full" v-model="form.kdNegaraPembeli">
                  <option value="IDN">Indonesia</option>
                  <option value="SGP">Singapore</option>
                  <option value="MYS">Malaysia</option>
                  <option value="USA">United States</option>
                </select>
              </div>

              <!-- Right Col -->
              <div class="flex flex-col gap-1">
                <label class="form-label text-sm font-medium text-gray-600">Buyer Name <span class="text-danger">*</span></label>
                <input type="text" class="input w-full" v-model="form.namaPembeli" placeholder="e.g. PT Maju Bersama Tbk" required />
              </div>

              <!-- Left Col -->
              <div class="flex flex-col gap-1">
                <label class="form-label text-sm font-medium text-gray-600">NITKU</label>
                <input type="text" class="input w-full" v-model="form.tkuPembeli" placeholder="e.g. 1091031210969728000000" />
              </div>

              <!-- Right Col -->
              <div class="flex flex-col gap-1">
                <label class="form-label text-sm font-medium text-gray-600">Email</label>
                <input type="email" class="input w-full" v-model="form.emailPembeli" placeholder="e.g. finance@company.co.id" />
              </div>

              <!-- Full Width -->
              <div class="flex flex-col gap-1 lg:col-span-2">
                <label class="form-label text-sm font-medium text-gray-600">Email CC</label>
                <input type="email" class="input w-full" v-model="form.emailCcPembeli" placeholder="e.g. tax@company.co.id" />
              </div>

              <!-- Full Width -->
              <div class="flex flex-col gap-1 lg:col-span-2">
                <label class="form-label text-sm font-medium text-gray-600">Address <span class="text-danger">*</span></label>
                <textarea class="textarea w-full min-h-[60px] resize-none" v-model="form.alamatPembeli" placeholder="e.g. Jl. Sudirman No. 52, Jakarta Selatan 12190" required></textarea>
              </div>

            </div>
          </div>

          <!-- Section 3: Goods / Services -->
          <div class="card p-[20px]">
            <div class="flex items-center justify-between mb-[16px]">
              <h3 class="text-lg font-semibold m-0">Goods / Services</h3>
              <button type="button" class="btn btn-primary" @click="openAddItemModal()">
                <i class="ki-filled ki-plus-circle !text-base"></i>
                Add Item
              </button>
            </div>
            <div class="overflow-x-auto -mx-[20px]">
              <table class="table align-middle text-sm w-full">
                <thead>
                  <tr>
                    <th class="!bg-gray-50 !text-gray-500 font-semibold text-center w-[40px]">#</th>
                    <th class="!bg-gray-50 !text-gray-500 font-semibold min-w-[180px]">Item Name</th>
                    <th class="!bg-gray-50 !text-gray-500 font-semibold min-w-[90px]">Code</th>
                    <th class="!bg-gray-50 !text-gray-500 font-semibold text-right min-w-[70px]">Qty</th>
                    <th class="!bg-gray-50 !text-gray-500 font-semibold text-right min-w-[120px]">Unit Price</th>
                    <th class="!bg-gray-50 !text-gray-500 font-semibold text-right min-w-[120px]">Total</th>
                    <th class="!bg-gray-50 !text-gray-500 font-semibold text-right min-w-[120px]">Tax Base (DPP)</th>
                    <th class="!bg-gray-50 !text-gray-500 font-semibold text-right min-w-[110px]">VAT (12%)</th>
                    <th class="!bg-gray-50 !text-gray-500 text-center w-[64px]"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="form.objekFaktur.length === 0">
                    <td colspan="9" class="text-center py-10 text-gray-400 italic text-sm">
                      No items added. Click "Add Item" to begin.
                    </td>
                  </tr>
                  <tr v-for="(obj, index) in form.objekFaktur" :key="index">
                    <td class="text-center text-gray-400 text-sm font-medium">{{ index + 1 }}</td>
                    <td class="text-gray-700 font-medium">{{ obj.namaBrgJasa || '-' }}</td>
                    <td class="text-gray-600">{{ obj.kdBrgJasa }}</td>
                    <td class="text-right text-gray-600">{{ obj.jmlBrgJasa }}</td>
                    <td class="text-right text-gray-600">{{ formatCurrency(obj.hargaSatuan) }}</td>
                    <td class="text-right text-gray-600 font-medium">{{ formatCurrency(obj.totalHarga) }}</td>
                    <td class="text-right text-gray-600 font-medium">{{ formatCurrency(obj.dpp) }}</td>
                    <td class="text-right text-primary font-semibold">{{ formatCurrency(obj.ppn) }}</td>
                    <td class="text-center">
                      <div class="flex items-center gap-1 justify-center">
                        <button type="button" class="btn btn-outline btn-icon btn-primary btn-sm tooltip tooltip-left" data-tip="Edit" @click="openAddItemModal(index)">
                          <i class="ki-filled ki-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline btn-icon btn-danger btn-sm tooltip tooltip-left" data-tip="Remove" @click="hapusBarang(index)">
                          <i class="ki-filled ki-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: Sticky Sidebar -->
        <div class="w-full lg:max-w-sm space-y-6 sticky top-0">

          <!-- Tax Summary -->
          <div class="card h-fit">
            <div class="card-header py-[16px] px-[20px] border-b border-gray-100 bg-white">
              <h3 class="text-base font-bold text-gray-800 mb-0">Transaction Summary</h3>
            </div>
            <div class="card-body p-0">
              <div class="flex flex-col">
                <div class="border-b border-gray-200 py-[16px] px-[20px] text-sm flex justify-between">
                  <span class="text-gray-500">Total Price</span>
                  <span class="font-medium">{{ formatCurrency(totalHargaKeseluruhan) }}</span>
                </div>
                <div class="border-b border-gray-200 py-[16px] px-[20px] text-sm flex justify-between">
                  <span class="text-gray-500">Total Discount</span>
                  <span class="font-medium text-gray-400">Rp 0</span>
                </div>
                <div class="border-b border-gray-200 py-[16px] px-[20px] text-sm flex justify-between">
                  <span class="text-gray-500">Tax Base (DPP)</span>
                  <span class="font-medium">{{ formatCurrency(form.totalDpp) }}</span>
                </div>
                <div class="border-b border-gray-200 py-[16px] px-[20px] text-sm flex justify-between">
                  <span class="text-gray-500">Other DPP</span>
                  <span class="font-medium">{{ formatCurrency(form.totalDppLain) }}</span>
                </div>
                <div class="summary__total py-[20px] px-[20px] text-sm flex justify-between items-center">
                  <span class="font-semibold">VAT / PPN (12%)</span>
                  <span class="text-lg font-bold text-primary">{{ formatCurrency(form.totalPpn) }}</span>
                </div>
                <div class="border-t border-gray-200 py-[16px] px-[20px] text-sm flex justify-between">
                  <span class="text-gray-500">PPnBM</span>
                  <span class="font-medium text-gray-400">{{ formatCurrency(form.totalPpnbm) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Declaration -->
          <div class="card p-[20px]">
            <div class="p-3 rounded-lg border border-amber-200 bg-amber-50">
              <label class="flex items-start gap-2.5 cursor-pointer">
                <input class="checkbox checkbox-sm checkbox-warning mt-0.5 shrink-0" type="checkbox" v-model="pernyataan" id="pernyataan" />
                <span class="text-xs text-amber-900 leading-relaxed">
                  I declare that this Tax Invoice has been filled in correctly, completely, and clearly.
                </span>
              </label>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer Actions — same pattern as BpuCreate -->
      <div class="pt-8 border-t border-gray-100 flex items-center justify-between">
        <router-link to="/vat-out-reconciliation" class="btn btn-outline btn-primary" :class="{ 'pointer-events-none opacity-50': isSubmitting }">
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </router-link>
        <button type="button" class="btn btn-primary px-12" :disabled="isSubmitting || !pernyataan" @click="submitForm">
          <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
          Save as Draft
          <i v-if="!isSubmitting" class="ki-duotone ki-paper-plane ml-2"></i>
        </button>
      </div>

    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddItemModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-800">Detail Penyerahan Barang/Jasa</h3>
          <button @click="showAddItemModal = false" class="btn btn-sm w-7 h-7 btn-icon rounded-full btn-danger border-none">
            <i class="ki-filled ki-cross text-sm"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-6">
          
          <!-- Section 1: Detail Transaksi -->
          <div>
            <div class="flex items-center gap-4 mb-4">
               <span class="font-bold text-sm bg-white pr-4">Detail Transaksi</span>
               <hr class="flex-1" />
            </div>
            
            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
              <!-- Type Radio -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Type</label>
                <div class="flex items-center gap-4 h-10">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="currentItem.brgJasa" value="GOODS" class="radio radio-primary radio-sm" />
                    <span class="text-sm">Barang</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="currentItem.brgJasa" value="SERVICE" class="radio radio-primary radio-sm" />
                    <span class="text-sm">Jasa</span>
                  </label>
                </div>
              </div>

              <!-- Kode Barang -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Kode Barang/Jasa</label>
                <select class="select w-full" v-model="currentItem.kdBrgJasa">
                  <option value="000000">000000-Barang</option>
                </select>
              </div>

              <!-- Nama Barang -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Nama Barang/Jasa</label>
                <input type="text" class="input w-full" v-model="currentItem.namaBrgJasa" placeholder="e.g. Jasa Konsultasi Teknologi" />
              </div>

              <!-- Satuan Barang -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Satuan Barang/Jasa</label>
                <select class="select w-full" v-model="currentItem.satuanBrgJasa">
                  <option value="UM.0001">UM.0001</option>
                  <option value="UM.0002">UM.0002</option>
                </select>
              </div>

              <!-- Jumlah -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Jumlah Barang/Jasa</label>
                <input type="number" class="input w-full text-right" v-model="currentItem.jmlBrgJasa" @input="calculateCurrentItem" min="0" />
              </div>

              <!-- Harga Satuan -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Harga Satuan (Rp)</label>
                <input type="number" class="input w-full text-right" v-model="currentItem.hargaSatuan" @input="calculateCurrentItem" min="0" />
              </div>

              <!-- Harga Total -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Harga Total (Rp)</label>
                <input type="text" class="input w-full text-right bg-gray-50" :value="currentItem.totalHarga" readonly />
              </div>

              <!-- Diskon -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Diskon (Rp)</label>
                <input type="number" class="input w-full text-right" v-model="currentItem.diskon" @input="calculateCurrentItem" min="0" />
              </div>

            </div>
          </div>

          <!-- Section 2: PPN & PPnBM -->
          <div class="mt-8">
            <div class="flex items-center gap-4 mb-4">
               <span class="font-bold text-sm bg-white pr-4">PPN & PPnBM</span>
               <hr class="flex-1" />
            </div>

            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
              <!-- DPP -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">DPP (Rp)</label>
                <input type="text" class="input w-full text-right bg-gray-50" :value="currentItem.dpp" readonly />
              </div>

              <!-- DPP Nilai Lain Radio -->
              <div class="flex flex-col gap-1 row-span-2">
                <label class="text-xs text-gray-500">DPP Nilai Lain</label>
                <div class="flex flex-col gap-3 mt-2">
                  <label class="flex items-start gap-2 cursor-pointer">
                    <input type="radio" v-model="currentItem.cekDppLain" :value="true" class="radio radio-primary mt-0.5" />
                    <span class="text-sm">Sesuai Ketentuan PMK 131 Ps. 3 (2)</span>
                  </label>
                  <label class="flex items-start gap-2 cursor-pointer">
                    <input type="radio" v-model="currentItem.cekDppLain" :value="false" class="radio radio-primary mt-0.5" />
                    <span class="text-sm">Selain yang diatur dalam PMK 131 Ps. 3 (2)</span>
                  </label>
                </div>
              </div>

              <!-- Tarif PPN -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Tarif PPN %</label>
                <input type="number" class="input w-full text-right" v-model="currentItem.tarifPpn" @input="calculateCurrentItem" min="0" />
              </div>

              <!-- PPN -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">PPN (Rp)</label>
                <input type="text" class="input w-full text-right bg-gray-50" :value="currentItem.ppn" readonly />
              </div>

              <!-- DPP Nilai Lain Rp -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">DPP Nilai Lain (Rp)</label>
                <input type="number" class="input w-full text-right bg-gray-50" v-model="currentItem.dppLain" readonly />
              </div>

              <!-- Tarif PPnBM -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">Tarif PPnBM %</label>
                <input type="number" class="input w-full text-right" v-model="currentItem.tarifPpnbm" @input="calculateCurrentItem" min="0" />
              </div>

              <!-- PPnBM -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-500">PPnBM (Rp)</label>
                <input type="text" class="input w-full text-right bg-gray-50" :value="currentItem.ppnbm" readonly />
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-slate-50">
          <button type="button" class="btn btn-primary rounded-lg px-8" @click="saveItem">Simpan</button>
        </div>
      </div>
    </div>

    <ModalNotification
      :open="showNotif"
      id="vat-out-create-notif"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="onNotifClose"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { postVatOutCreate } from '@/core/utils/vatPxInvoiceApi'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'

const router = useRouter()
const isSubmitting = ref(false)
const vendorNpwp = '1091031210969728'
const identitasTipe = ref('NPWP')
const pernyataan = ref(false)
const tanggalFakturInput = ref(new Date().toISOString().split('T')[0])
const isValidNpwp = ref(false)

const showNotif = ref(false)
const notifTitle = ref('')
const notifText = ref('')
const notifType = ref<'success' | 'error'>('success')

const routes = ref<routeTypes[]>([
  { name: 'Tax Reconciliation' },
  { name: 'VAT (Pajak Luaran)', to: 'vatOutReconciliation' },
  { name: 'Create Tax Invoice' },
])

const form = ref({
  fgUangMuka: false,
  fgPelunasan: false,
  nomorFaktur: '',
  nomorFakturDiganti: '',
  jenisFaktur: '0',
  detailTransaksi: '1',
  idKeteranganTambahan: '1',
  keteranganTambahan: '',
  masaPajak: new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString(),
  tahunPajak: new Date().getFullYear().toString(),
  refDoc: '',
  referensi: 'PO-2026-001234',
  npwpPenjual: vendorNpwp,
  namaTokoPenjual: vendorNpwp + '000000',
  npwpPembeli: '1091031210969728',
  idLainPembeli: '',
  kdNegaraPembeli: 'IDN',
  nikPaspPembeli: '',
  namaPembeli: 'PT Maju Bersama Tbk',
  tkuPembeli: '1091031210969728000000',
  alamatPembeli: 'Jl. Sudirman No. 52, Jakarta Selatan 12190',
  emailPembeli: 'finance@majubersama.co.id',
  emailCcPembeli: 'tax@majubersama.co.id',
  totalDpp: 0,
  totalDppLain: 0,
  jumlahUangMuka: 0,
  totalPpn: 0,
  totalPpnbm: 0,
  tanggalFaktur: '',
  userId: '3174061502560010',
  kanal: '14',
  revokeFlag: false,
  objekFaktur: [
    {
      brgJasa: 'GOODS',
      kdBrgJasa: '000000',
      namaBrgJasa: 'Sample Item',
      satuanBrgJasa: 'UM.0001',
      hargaSatuan: 100000,
      jmlBrgJasa: 10,
      totalHarga: 1000000,
      diskon: 0,
      cekDppLain: false,
      dpp: 1000000,
      dppLain: 1000000,
      tarifPpn: 12,
      ppn: 120000,
      tarifPpnbm: 0,
      ppnbm: 0,
      fgPmk: '',
    },
  ],
})

watch(tanggalFakturInput, (newVal) => {
  if (newVal) {
    const d = new Date(newVal)
    const month = d.getMonth() + 1
    form.value.masaPajak = month < 10 ? '0' + month : month.toString()
    form.value.tahunPajak = d.getFullYear().toString()
  }
})

watch(() => form.value.npwpPembeli, (newVal) => {
  if (newVal === '1091031210969728') {
    isValidNpwp.value = true
    form.value.tkuPembeli = '1091031210969728000000'
    form.value.kdNegaraPembeli = 'IDN'
  } else {
    isValidNpwp.value = false
    if (!newVal) {
      form.value.tkuPembeli = ''
    }
  }
})

const totalHargaKeseluruhan = computed(() =>
  form.value.objekFaktur.reduce((acc, curr) => acc + (curr.totalHarga || 0), 0),
)

const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

const showAddItemModal = ref(false)
const isEditing = ref(false)
const editIndex = ref(-1)

const currentItem = ref({
  brgJasa: 'GOODS',
  kdBrgJasa: '000000',
  namaBrgJasa: '',
  satuanBrgJasa: 'UM.0001',
  hargaSatuan: 0,
  jmlBrgJasa: 0,
  totalHarga: 0,
  diskon: 0,
  cekDppLain: false,
  dpp: 0,
  dppLain: 0,
  tarifPpn: 12,
  ppn: 0,
  tarifPpnbm: 0,
  ppnbm: 0,
  fgPmk: '',
})

const calculateCurrentItem = () => {
  currentItem.value.totalHarga = currentItem.value.jmlBrgJasa * currentItem.value.hargaSatuan
  currentItem.value.dpp = currentItem.value.totalHarga - currentItem.value.diskon
  currentItem.value.dppLain = currentItem.value.dpp
  currentItem.value.ppn = currentItem.value.dpp * (currentItem.value.tarifPpn / 100)
  currentItem.value.ppnbm = currentItem.value.dpp * (currentItem.value.tarifPpnbm / 100)
}

const openAddItemModal = (index?: number) => {
  if (index !== undefined && index >= 0) {
    currentItem.value = JSON.parse(JSON.stringify(form.value.objekFaktur[index]))
    isEditing.value = true
    editIndex.value = index
  } else {
    currentItem.value = {
      brgJasa: 'GOODS',
      kdBrgJasa: '000000',
      namaBrgJasa: '',
      satuanBrgJasa: 'UM.0001',
      hargaSatuan: 0,
      jmlBrgJasa: 0,
      totalHarga: 0,
      diskon: 0,
      cekDppLain: false,
      dpp: 0,
      dppLain: 0,
      tarifPpn: 12,
      ppn: 0,
      tarifPpnbm: 0,
      ppnbm: 0,
      fgPmk: '',
    }
    isEditing.value = false
    editIndex.value = -1
  }
  showAddItemModal.value = true
}

const saveItem = () => {
  calculateCurrentItem()
  if (isEditing.value && editIndex.value >= 0) {
    form.value.objekFaktur[editIndex.value] = { ...currentItem.value }
  } else {
    form.value.objekFaktur.push({ ...currentItem.value })
  }
  calculateDpp()
  showAddItemModal.value = false
}

const calculateDpp = () => {
  form.value.totalDpp = form.value.objekFaktur.reduce((acc, curr) => acc + curr.dpp, 0)
  form.value.totalDppLain = form.value.objekFaktur.reduce((acc, curr) => acc + curr.dppLain, 0)
  form.value.totalPpn = form.value.objekFaktur.reduce((acc, curr) => acc + curr.ppn, 0)
}

const hapusBarang = (index: number) => {
  form.value.objekFaktur.splice(index, 1)
  calculateDpp()
}

const submitForm = async () => {
  try {
    isSubmitting.value = true
    calculateDpp()
    if (tanggalFakturInput.value) {
      const parts = tanggalFakturInput.value.split('-')
      form.value.tanggalFaktur = `${parts[2]}${parts[1]}${parts[0]}`
    }
    
    const payload: any = { ...form.value }
    
    const dtCode = payload.detailTransaksi.padStart(2, '0')
    const formattedDetailTransaksi = `TD.003${dtCode}`
    payload.detailTransaksi = formattedDetailTransaksi
    
    if (!['07', '08', '7', '8'].includes(dtCode)) {
      payload.idKeteranganTambahan = ''
      payload.keteranganTambahan = ''
    }

    payload.masaTahunPajak = `${payload.tahunPajak}-${payload.masaPajak}`
    payload.fgPengganti = "0"
    payload.firstRenderer = true
    payload.totalJumlahBarang = payload.objekFaktur.reduce((acc: any, curr: any) => acc + Number(curr.jmlBrgJasa), 0)
    
    payload.uangMuka = payload.jumlahUangMuka || 0
    payload.uangMukaLain = payload.jumlahUangMuka || 0
    payload.uangMukaPpn = (payload.jumlahUangMuka || 0) * (payload.objekFaktur[0]?.tarifPpn || 12) / 100
    payload.uangMukaPpnbm = 0
    
    payload.totalHarga = payload.objekFaktur.reduce((acc: any, curr: any) => acc + Number(curr.totalHarga), 0)
    
    payload.objekFaktur = payload.objekFaktur.map((obj: any) => ({
      ...obj,
      jnsTransaksi: formattedDetailTransaksi,
      ppn: Number(obj.ppn),
      dppLain: Number(obj.dppLain),
      dpp: Number(obj.dpp),
      diskon: Number(obj.diskon),
      totalHarga: Number(obj.totalHarga),
      hargaSatuan: Number(obj.hargaSatuan),
      jmlBrgJasa: Number(obj.jmlBrgJasa),
      tarifPpnbm: Number(obj.tarifPpnbm),
      ppnbm: Number(obj.ppnbm)
    }))
    
    await postVatOutCreate(vendorNpwp, payload)
    notifTitle.value = 'Invoice Created'
    notifText.value = 'Draft invoice has been saved successfully.'
    notifType.value = 'success'
    showNotif.value = true
  } catch (error: any) {
    const msg =
      error.response?.data?.result?.content?.message ||
      error.response?.data?.message ||
      'Failed to save invoice.'
    notifTitle.value = 'Error'
    notifText.value = msg
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    isSubmitting.value = false
  }
}

const onNotifClose = () => {
  showNotif.value = false
  if (notifType.value === 'success') {
    router.push('/vat-out-reconciliation')
  }
}

// init calculation
calculateDpp()
</script>

<style lang="scss" scoped>
:deep() {
  .summary__total {
    background-color: #f0fdfa;
    color: #0d9488;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    font-weight: 700;
  }
}

.text-danger {
  color: #f1416c;
}

table {
  th, td {
    font-family: inherit !important;
    white-space: nowrap;
  }
}
</style>
