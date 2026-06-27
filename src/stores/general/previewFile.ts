import { defineStore } from 'pinia'
import { resolveDocumentPreviewUrl } from '@/composables/documentPreview'

export const usePreviewFileStore = defineStore('previewFile', () => {
  const getPreview = async (path: string) => {
    const previewUrl = await resolveDocumentPreviewUrl(path)
    if (!previewUrl) {
      throw new Error('Preview URL could not be resolved')
    }

    return {
      data: previewUrl,
      isDirectUrl: true,
    }
  }

  return {
    getPreview,
  }
})
