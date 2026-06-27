import generalApi from '@/core/utils/generalApi'
import invoiceApi from '@/core/utils/invoiceApi'

export const hasBlobSasToken = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.searchParams.has('sig') || parsed.searchParams.has('sv')
  } catch {
    return false
  }
}

export const isAzureBlobUrl = (url: string): boolean => {
  try {
    return new URL(url).host.toLowerCase().includes('.blob.core.windows.net')
  } catch {
    return false
  }
}

export const warnUnsignedDocumentUrl = (url: string, label = 'Document') => {
  if (!url || hasBlobSasToken(url)) return
  console.warn(
    `[${label}] URL blob tanpa SAS token — preview akan dimuat lewat invoice file API.`,
    url,
  )
}

const fetchSignedBlobPreviewUrl = async (blobUrl: string): Promise<string> => {
  const response = await invoiceApi.get<{ url?: string }>('/file/preview-url', {
    params: { fullFilePath: blobUrl },
  })

  const signedUrl = response.data?.url?.trim()
  if (!signedUrl) {
    throw new Error('Signed preview URL is empty')
  }

  return signedUrl
}

/** Resolve URL untuk preview browser: pakai SAS langsung, invoice blob API, atau general local file API. */
export const resolveDocumentPreviewUrl = async (
  source: string | null | undefined,
): Promise<string> => {
  const path = (source || '').trim()
  if (!path) return ''

  if (hasBlobSasToken(path)) return path

  if (isAzureBlobUrl(path)) {
    try {
      return await fetchSignedBlobPreviewUrl(path)
    } catch (error) {
      console.error('Failed to resolve Azure blob preview URL:', error)
      return ''
    }
  }

  try {
    const response = await generalApi.get('/api/file/preview', {
      params: { fullFilePath: path },
      responseType: 'blob',
    })

    if (response.status !== 200 || !(response.data instanceof Blob)) {
      return ''
    }

    return URL.createObjectURL(response.data)
  } catch (error) {
    console.error('Failed to resolve document preview URL:', error)
    return ''
  }
}

export const openPdfPreview = async (source: string | null | undefined, label = 'Document') => {
  const path = (source || '').trim()
  if (!path) return

  warnUnsignedDocumentUrl(path, label)
  const url = await resolveDocumentPreviewUrl(path)
  if (!url) return

  window.open(url, '_blank')

  if (!hasBlobSasToken(path)) {
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }
}
