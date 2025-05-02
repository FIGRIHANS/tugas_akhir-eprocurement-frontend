import vendorAPI from '@/core/utils/vendorAPI'
import { defineStore } from 'pinia'

export const useVendorUploadStore = defineStore('vendor-upload', () => {
  const upload = async (formData: FormData) => {
    try {
      const response = await vendorAPI.postForm('/api/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }
  return { upload }
})
