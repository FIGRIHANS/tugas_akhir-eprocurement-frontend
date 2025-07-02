<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { ref } from 'vue'

const search = ref('')

const modalProfile = ref(false)

const handleCancel = () => {
  modalProfile.value = false
}

const handleOpenModal = () => {
  modalProfile.value = true
}
</script>

<template>
  <div>
    <BreadcrumbView
      title="Master Profile"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Master Profile', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">Master Profile</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search Profile" />
            <UiButton variant="primary" @click="handleOpenModal">
              <UiIcon variant="duotone" name="plus" />
              Add Profile</UiButton
            >
          </div>
        </div>
      </div>
      <div class="card-body">
        <table class="table align-middle text-gray-700">
          <thead class="">
            <tr>
              <th></th>
              <th class="text-nowrap">Profile ID</th>
              <th class="text-nowrap">Profile Name</th>
              <th class="text-nowrap">Created Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="flex items-center space-x-3">
                  <div
                    class="dropdown"
                    data-dropdown="true"
                    data-dropdown-trigger="click"
                    data-dropdown-placement="bottom-end"
                  >
                    <UiButton
                      class="dropdown-toggle"
                      variant="light"
                      :outline="true"
                      :icon="true"
                      size="sm"
                    >
                      <UiIcon name="dots-vertical" />
                    </UiButton>
                    <div class="dropdown-content w-auto p-4 space-y-5">
                      <div class="flex flex-col space-y-2">
                        <UiButton variant="light" class="border-none" :outline="true" size="md">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_7548_45782)">
                              <path
                                opacity="0.3"
                                d="M12.8861 17.0625H1.74375C1.52992 17.0625 1.32485 16.9776 1.17365 16.8264C1.02244 16.6752 0.9375 16.4701 0.9375 16.2562V5.11387C0.9375 4.00623 1.37751 2.94395 2.16073 2.16073C2.94395 1.37751 4.00623 0.9375 5.11387 0.9375H12.8861C13.4346 0.9375 13.9777 1.04553 14.4844 1.25541C14.9911 1.46529 15.4515 1.77292 15.8393 2.16073C16.2271 2.54854 16.5347 3.00894 16.7446 3.51565C16.9545 4.02235 17.0625 4.56543 17.0625 5.11387V12.8861C17.0625 13.4346 16.9545 13.9777 16.7446 14.4844C16.5347 14.9911 16.2271 15.4515 15.8393 15.8393C15.4515 16.2271 14.9911 16.5347 14.4844 16.7446C13.9777 16.9545 13.4346 17.0625 12.8861 17.0625Z"
                                fill="#78829D"
                              />
                              <path
                                d="M8.37929 5.56533L8.97591 4.75908C9.09379 4.59571 9.24338 4.45778 9.41574 4.3535C9.58811 4.24922 9.77971 4.18074 9.97913 4.15215C10.1785 4.12355 10.3817 4.13543 10.5764 4.18707C10.7711 4.23871 10.9534 4.32905 11.1125 4.4527L12.4589 5.49276C12.7768 5.75098 12.9845 6.12048 13.0399 6.52627C13.0953 6.93206 12.9943 7.34372 12.7572 7.6777L12.1606 8.48395C11.7213 8.57285 11.2679 8.5648 10.832 8.46036C10.3962 8.35592 9.98834 8.15761 9.63704 7.87926C9.27638 7.60378 8.97792 7.25528 8.76119 6.85654C8.54445 6.4578 8.41432 6.01781 8.37929 5.56533ZM8.96785 8.79033C8.29674 8.26854 7.78782 7.56669 7.50047 6.76664L5.24297 9.8062C5.06805 10.0542 4.97247 10.3493 4.96885 10.6528V12.6845C4.96206 12.8625 4.99691 13.0396 5.07061 13.2018C5.14432 13.364 5.25485 13.5067 5.39341 13.6187C5.53197 13.7306 5.69474 13.8087 5.86878 13.8467C6.04281 13.8846 6.22331 13.8815 6.39591 13.8375L8.29866 13.257C8.5893 13.171 8.84402 12.9927 9.02429 12.749L11.2737 9.70139C10.4431 9.62054 9.65355 9.30136 9.0001 8.78226L8.96785 8.79033Z"
                                fill="#78829D"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_7548_45782">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          Edit Profile
                        </UiButton>
                        <UiButton
                          variant="light"
                          class="border-none text-red-500 hover:text-red-600"
                          :outline="true"
                          size="md"
                        >
                          <svg
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              opacity="0.3"
                              d="M9 17.5833C13.5563 17.5833 17.25 13.8896 17.25 9.33325C17.25 4.7769 13.5563 1.08325 9 1.08325C4.44365 1.08325 0.75 4.7769 0.75 9.33325C0.75 13.8896 4.44365 17.5833 9 17.5833Z"
                              fill="#F8285A"
                            />
                            <path
                              d="M10.1632 9.33349L12.498 6.99874C12.5844 6.92478 12.6545 6.83377 12.704 6.73142C12.7535 6.62906 12.7814 6.51758 12.7857 6.40396C12.7901 6.29034 12.771 6.17704 12.7295 6.07118C12.688 5.96531 12.6251 5.86916 12.5447 5.78876C12.4643 5.70836 12.3682 5.64544 12.2623 5.60397C12.1564 5.56249 12.0431 5.54335 11.9295 5.54773C11.8159 5.55212 11.7044 5.57995 11.6021 5.62947C11.4997 5.67899 11.4087 5.74913 11.3347 5.83549L8.99999 8.17024L6.66524 5.83549C6.50742 5.70034 6.3044 5.62971 6.09677 5.63773C5.88914 5.64575 5.69218 5.73182 5.54525 5.87875C5.39832 6.02568 5.31225 6.22264 5.30423 6.43027C5.29621 6.63791 5.36683 6.84092 5.50199 6.99874L7.83674 9.33349L5.50199 11.6682C5.34833 11.8228 5.26208 12.0319 5.26208 12.2499C5.26208 12.4678 5.34833 12.6769 5.50199 12.8315C5.65656 12.9852 5.86566 13.0714 6.08361 13.0714C6.30157 13.0714 6.51067 12.9852 6.66524 12.8315L8.99999 10.4967L11.3347 12.8315C11.4893 12.9852 11.6984 13.0714 11.9164 13.0714C12.1343 13.0714 12.3434 12.9852 12.498 12.8315C12.6516 12.6769 12.7379 12.4678 12.7379 12.2499C12.7379 12.0319 12.6516 11.8228 12.498 11.6682L10.1632 9.33349Z"
                              fill="#F8285A"
                            />
                          </svg>

                          Delete Profile
                        </UiButton>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>7372572</td>
              <td>Sales Manager</td>
              <td>Fri 19 Jun, 2020 09:35 am</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal form -->
    <UiModal
      title="Add New Profile"
      v-model="modalProfile"
      v-if="modalProfile"
      @update:model-value="handleCancel"
      size="sm"
    >
      <UiInput label="Profile Name" placeholder="Enter profile name" row required />
      <div class="mt-4 w-full gap-2 justify-end items-center flex">
        <UiButton outline>Cancel</UiButton>
        <UiButton variant="primary">Save</UiButton>
      </div>
    </UiModal>
  </div>
</template>

<style scoped></style>
