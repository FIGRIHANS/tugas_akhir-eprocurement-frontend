<template>
  <div>
    <div class="border rounded-md mt-[24px] flex flex-col gap-[24px] justify-center bg-white">
      <div class="card-header">
        <h1>Replace Document</h1>
      </div>
      <div class="card-body">
        <div>
          <p>
            Chose a document to replace the <b>Original Document</b>and enter a <b>Description</b> to
            explain why the document is being replaced
          </p>
  
          <div class="flex mt-[24px] gap-5">
            <div class="w-[33%] flex flex-col align-center gap-5">
              <div class="flex gap-2">
                <label class="form-label w-2/5"> Original Document :</label>
                <p><i class="ki-filled ki-document"></i> Original Contact Document.pdf</p>
              </div>
  
              <div class="flex gap-2">
                <label class="form-label w-2/5">Description :</label>
                <textarea
                  placeholder="Signed Copy Of Original"
                  class="w-[75%] h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>
  
              <div class="flex gap-2">
                <label class="form-label w-2/5">New Document :</label>
                <div class="flex flex-col gap-5">
                  <div>
                    <label class="form-label flex items-center gap-2.5">
                      <input :checked="true" class="radio" name="radio1" type="radio" value="2" />
                      Upload
                    </label>
                  </div>
                  <div class="w-[100%]">
                    <input class="file-input" type="file" />
                  </div>
                  <div>
                    <label class="form-label flex items-center gap-2.5">
                      <input :checked="true" class="radio" name="radio1" type="radio" value="2" />
                      Replace original document with a document from a
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-[33%] flex flex-col align-center gap-5">
              <div class="flex gap-2 w-full">
                <UiSelect
                  class="w-full"
                  :row="true"
                  label="Evaluation Object"
                  :options="[]"
                  required
                />
              </div>
              <div class="flex gap-2 w-full">
                <UiInput class="w-full" :row="true" label="Tender Period" type="date" required />
              </div>
              <div class="flex gap-2 w-full">
                <UiTextArea class="w-full" :row="true" label="Remarks" type="date" required />
              </div>
            </div>
            <div class="w-[33%] flex flex-col align-center gap-2">
              <div class="flex gap-2">
                <label class="form-label w-2/5"> LBMA Ref Date</label>
                <p>21.08.2025</p>
              </div>
              <div class="flex gap-2">
                <label class="form-label w-2/5"> LBMA Ref Price (Oz t)</label>
                <p>3,362.05 USD</p>
              </div>
              <div class="flex gap-2">
                <label class="form-label w-2/5"> LBMA Ref Price (gr)</label>
                <p>108.09 USD</p>
              </div>
              <div class="flex gap-2">
                <label class="form-label w-2/5"> BI Middle Exc Rate</label>
                <p>16.155 IDR</p>
              </div>
              <div class="flex gap-2">
                <label class="form-label w-2/5"> LBMA Ref Price (gr)</label>
                <p>1.746.233 IDR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border rounded-md mt-[24px] flex flex-col gap-[24px] justify-center bg-white">
      <div class="card-header">
        <h1>Version History</h1>
      </div>
      <div class="card-body">
        <div class="scrollable-x-auto">
          <table class="table text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th
                  v-for="(item, index) in columns"
                  :key="index"
                  class="report__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in dummyData" :key="data.id">
                <td>
                  <a
                    class="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
                    @click="openDocument(data.docUrl)"
                    ><i class="ki-filled ki-files"></i> {{ data.title }}</a
                  >
                  <p class="text-gray-500">{{ data.titleVersion }}</p>
                </td>
                <td>{{ data.version }}</td>
                <td>{{ data.status }}</td>
                <td>
                  <p class="text-blue-500">{{ data.modifiedBy }}</p>
                </td>
                <td>{{ data.lastModifiedDate }}</td>
                <td>{{ data.createddate }}</td>
                <td>{{ data.bottomPrice }}</td>
                <td>{{ data.currency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'

const columns = ref<string[]>([
  'Title',
  'Version',
  'Status',
  'Modifed By',
  'Last Modified',
  'Create Date',
  'Bottom Price (LBMA)',
  'Currency',
])

const dummyData = ref([
  {
    id: 1,
    title: 'Signed Contract',
    titleVersion: 'Signed copy of original',
    docUrl: 'https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf',
    version: 'V2 (Edited)',
    status: 'Draft',
    modifiedBy: ' Seonaid Macfarlane',
    lastModifiedDate: '19/08/2025 10:34',
    createddate: '02/08/2025 10:34',
    bottomPrice: '1.746.233',
    currency: 'IDR',
  },
  {
    id: 2,
    title: 'Original Contract',
    titleVersion: '',
    docUrl: 'https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf',
    version: 'V2',
    status: 'Published',
    modifiedBy: ' Seonaid Macfarlane',
    lastModifiedDate: '19/08/2025 10:34',
    createddate: '02/08/2025 10:34',
    bottomPrice: '1.746.233',
    currency: 'IDR',
  },
  {
    id: 3,
    title: 'Original Contract',
    titleVersion: 'Original Version',
    docUrl: 'https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf',
    version: 'V1',
    status: 'Draft',
    modifiedBy: ' Seonaid Macfarlane',
    lastModifiedDate: '19/08/2025 10:34',
    createddate: '02/08/2025 10:34',
    bottomPrice: '1.746.233',
    currency: 'IDR',
  },
])

const openDocument = (url: string) => {
  window.open(url, '_blank')
}
</script>
