import generalApi from '@/core/utils/generalApi'
import invoiceApi from '@/core/utils/invoiceApi'

const SAS_QUERY_KEYS = new Set(['sv', 'st', 'se', 'sp', 'spr', 'sr', 'sig'])

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

/** Remove stale SAS params so preview API can issue a fresh token. */
export const stripBlobSasQuery = (url: string): string => {
  try {
    const parsed = new URL(url)
    if (!parsed.search) return url

    const kept = new URLSearchParams()
    parsed.searchParams.forEach((value, key) => {
      if (!SAS_QUERY_KEYS.has(key.toLowerCase())) {
        kept.set(key, value)
      }
    })

    parsed.search = kept.toString()
    return parsed.toString()
  } catch {
    return url
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
  const cleanUrl = stripBlobSasQuery(blobUrl)
  const response = await invoiceApi.get<{ url?: string }>('/file/preview-url', {
    params: { fullFilePath: cleanUrl },
  })

  const signedUrl = response.data?.url?.trim()
  if (!signedUrl) {
    throw new Error('Signed preview URL is empty')
  }

  return signedUrl
}

/** Resolve URL untuk preview browser: fresh SAS via invoice API, atau general local file API. */
export const resolveDocumentPreviewUrl = async (
  source: string | null | undefined,
): Promise<string> => {
  const path = (source || '').trim()
  if (!path) return ''

  if (isAzureBlobUrl(path)) {
    try {
      // Avoid browser-side fetch to Azure (CORS); use signed URL directly in iframe/open.
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

/** Kandidat URL untuk OCR/QR API — urutan sama seperti flow lama (previewPath dulu). */
export const getOcrApiUrlCandidates = (
  doc: { path?: string; previewPath?: string } | null | undefined,
): string[] => {
  const previewPath = (doc?.previewPath || '').trim()
  const path = (doc?.path || '').trim()
  const out: string[] = []

  const push = (value?: string) => {
    const normalized = value?.trim()
    if (!normalized || normalized.startsWith('blob:') || out.includes(normalized)) return
    out.push(normalized)
  }

  push(previewPath)
  push(path)
  if (previewPath && isAzureBlobUrl(previewPath)) push(stripBlobSasQuery(previewPath))
  if (path && isAzureBlobUrl(path)) push(stripBlobSasQuery(path))

  return out
}

export const getOcrApiUrlCandidatesAsync = async (
  doc: { path?: string; previewPath?: string } | null | undefined,
): Promise<string[]> => {
  const candidates = getOcrApiUrlCandidates(doc)
  const blob = [doc?.previewPath, doc?.path].find((value) => {
    const url = value?.trim()
    return url && isAzureBlobUrl(url)
  })

  if (blob && !candidates.some((url) => hasBlobSasToken(url))) {
    try {
      const signed = await fetchSignedBlobPreviewUrl(stripBlobSasQuery(blob.trim()))
      if (signed && !candidates.includes(signed)) candidates.push(signed)
    } catch {
      // OCR API akan coba kandidat lain.
    }
  }

  return candidates
}

/** URL pertama untuk pengecekan cepat (tanpa network). */
export const resolveDocumentUrlForApi = (
  doc: { path?: string; previewPath?: string } | null | undefined,
): string => getOcrApiUrlCandidates(doc)[0] || ''

/** @deprecated gunakan getOcrApiUrlCandidatesAsync — tetap ada untuk kompatibilitas. */
export const resolveDocumentUrlForApiAsync = async (
  doc: { path?: string; previewPath?: string } | null | undefined,
): Promise<string> => {
  const candidates = await getOcrApiUrlCandidatesAsync(doc)
  return candidates[0] || ''
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
