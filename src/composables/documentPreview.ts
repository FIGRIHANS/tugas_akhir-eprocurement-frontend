import generalApi from '@/core/utils/generalApi'

export const hasBlobSasToken = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.searchParams.has('sig') || parsed.searchParams.has('sv')
  } catch {
    return false
  }
}

export const warnUnsignedDocumentUrl = (url: string, label = 'Document') => {
  if (!url || hasBlobSasToken(url)) return
  console.warn(
    `[${label}] URL blob tanpa SAS token — preview akan dimuat lewat /api/file/preview.`,
    url,
  )
}

/** Resolve URL untuk preview browser: pakai SAS langsung, atau fetch blob lewat API. */
export const resolveDocumentPreviewUrl = async (
  source: string | null | undefined,
): Promise<string> => {
  const path = (source || '').trim()
  if (!path) return ''

  if (hasBlobSasToken(path)) return path

  try {
    const response = await generalApi.get('/api/file/preview', {
      params: { fullFilePath: path },
      responseType: 'blob',
    })
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
