import type { Pph21Content } from '@/services/pph21.service'
import { buildPph21OfficialHtml } from '@/core/utils/djpBupotFormHtml'

const loadHtml2Pdf = () =>
  new Promise<any>((resolve, reject) => {
    if ((window as any).html2pdf) {
      resolve((window as any).html2pdf)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.onload = () => resolve((window as any).html2pdf)
    script.onerror = () => reject(new Error('Failed to load html2pdf'))
    document.head.appendChild(script)
  })

export async function generatePph21PdfBlobUrl(item: Pph21Content): Promise<string> {
  const html2pdf = await loadHtml2Pdf()
  const wrapper = document.createElement('div')
  wrapper.style.position = 'fixed'
  wrapper.style.left = '-9999px'
  wrapper.style.top = '0'
  wrapper.innerHTML = buildPph21OfficialHtml(item)
  document.body.appendChild(wrapper)

  const element = wrapper.firstElementChild as HTMLElement

  try {
    const pdf = await html2pdf()
      .set({
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .toPdf()
      .get('pdf')

    const blob = pdf.output('blob') as Blob
    return URL.createObjectURL(blob)
  } finally {
    document.body.removeChild(wrapper)
  }
}
