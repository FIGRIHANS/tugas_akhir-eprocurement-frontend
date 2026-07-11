import type { BpuContent } from '@/services/bpu.service'
import type { Pph21Content } from '@/services/pph21.service'
import moment from 'moment'

export const PEMOTONG_NPWP = '1091031210969728'
export const PEMOTONG_NAME = 'PT EVOX'
export const PEMOTONG_ADDRESS = 'Jl. Sudirman No. 52, Jakarta Selatan 12190'
export const SIGNER_NAME = 'RADHITYA ARIE KENPRASOJO'

const COLOR_NAVY = '#1f3f67'
const SLATE_DARK = '#0f172a'
const SLATE_BORDER = '#cbd5e1'
const SLATE_LIGHT = '#f1f5f9'
const YELLOW_ACCENT = '#fde047'

export const escapeHtml = (value: unknown) =>
  String(value ?? '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const formatRpAmount = (val: number | string | undefined) => {
  const num = Number(val) || 0
  return new Intl.NumberFormat('id-ID').format(num)
}

const formatNpwpDisplay = (raw: string | undefined) => {
  const digits = String(raw || '').replace(/\D/g, '')
  if (digits.length === 15) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8, 9)}-${digits.slice(9, 12)}.${digits.slice(12)}`
  }
  if (digits.length === 16) return digits
  return raw || '-'
}

const formatTglPemotongan = (raw: string | undefined) => {
  if (!raw) return '-'
  if (raw.length === 8 && /^\d+$/.test(raw)) {
    return `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4, 8)}`
  }
  const m = moment(raw, ['DDMMYYYY', 'YYYY-MM-DD', moment.ISO_8601], true)
  return m.isValid() ? m.format('DD.MM.YYYY') : raw
}

const buildPeriode = (masa?: string, tahun?: string) => {
  const m = String(masa || '').padStart(2, '0')
  const y = String(tahun || '')
  if (!m || !y) return '-'
  const lastDay = moment(`${y}-${m}-01`, 'YYYY-MM-DD').endOf('month').format('DD')
  return `01-${m}-${y} s.d. ${lastDay}-${m}-${y}`
}

const proformaWatermark = (isDraft: boolean) =>
  isDraft
    ? `<div style="position:absolute;top:45%;left:50%;transform:translate(-50%,-50%) rotate(-25deg);font-size:68px;font-weight:900;color:rgba(30,64,175,0.08);border:6px solid rgba(30,64,175,0.08);border-radius:12px;padding:12px 28px;letter-spacing:8px;z-index:5;pointer-events:none;">PROFORMA</div>`
    : ''

const fontAndReset = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
    }
  </style>
`

const djpHeader = (title: string, formCode: string) => `
  <table style="width:100%;border-collapse:collapse;margin-bottom:10px;">
    <tr>
      <td style="width:20%;vertical-align:middle;padding:4px;">
        <div style="font-size:8px;font-weight:700;line-height:1.25;color:${COLOR_NAVY};text-transform:uppercase;">Kementerian Keuangan<br/>Republik Indonesia<br/>Direktorat Jenderal Pajak</div>
      </td>
      <td style="width:62%;text-align:center;vertical-align:middle;padding:4px 12px;border-left:1px solid ${SLATE_BORDER};border-right:1px solid ${SLATE_BORDER};">
        <div style="font-size:10px;font-weight:800;line-height:1.4;text-transform:uppercase;color:${COLOR_NAVY};letter-spacing:0.3px;">${title}</div>
      </td>
      <td style="width:18%;text-align:right;vertical-align:middle;padding:4px 0 4px 12px;">
        <div style="display:inline-block;background:${YELLOW_ACCENT};border:1.5px solid ${COLOR_NAVY};padding:6px 12px;font-size:16px;font-weight:800;color:${COLOR_NAVY};border-radius:4px;text-align:center;min-width:60px;">${formCode}</div>
      </td>
    </tr>
  </table>
`

const metaRow = (cells: { label: string; value: string }[]) => `
  <table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:9px;">
    <tr>
      ${cells
        .map(
          (c) => `
        <td style="border:1px solid ${SLATE_BORDER};width:${100 / cells.length}%;vertical-align:top;background:#f8fafc;">
          <div style="background:#e2e8f0;padding:4px 6px;font-weight:700;text-align:center;color:#475569;border-bottom:1px solid ${SLATE_BORDER};text-transform:uppercase;font-size:8px;letter-spacing:0.3px;">${escapeHtml(c.label)}</div>
          <div style="padding:6px;text-align:center;font-weight:700;color:${SLATE_DARK};min-height:22px;display:flex;align-items:center;justify-content:center;">${escapeHtml(c.value)}</div>
        </td>`,
        )
        .join('')}
    </tr>
  </table>
`

const sectionHeader = (label: string) => `
  <div style="background:${COLOR_NAVY};color:#fff;font-weight:700;font-size:9px;padding:5px 10px;border:1px solid ${SLATE_BORDER};border-bottom:0;text-transform:uppercase;letter-spacing:0.5px;">${label}</div>
`

const fieldRow = (code: string, label: string, value: string, width = '50%', colspan = 1) => `
  <td ${colspan > 1 ? `colspan="${colspan}"` : ''} style="width:${width};border:1px solid ${SLATE_BORDER};padding:4px 8px;font-size:9px;vertical-align:top;">
    <div style="display:flex;align-items:flex-start;line-height:1.3;">
      <span style="display:inline-block;width:24px;font-weight:700;color:${COLOR_NAVY};flex-shrink:0;">${code}</span>
      <span style="display:inline-block;width:125px;color:#475569;flex-shrink:0;">${label}</span>
      <span style="color:${SLATE_DARK};font-weight:600;word-break:break-word;margin-left:4px;">: ${escapeHtml(value)}</span>
    </div>
  </td>
`

const amountCell = (value: number | string | undefined, bold = false) => `
  <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;text-align:right;font-size:9px;color:${SLATE_DARK};${bold ? 'font-weight:700;background:#f8fafc;' : ''}">
    ${escapeHtml(formatRpAmount(value))}
  </td>
`

const calcRow = (no: string, label: string, amount: number | string | undefined, bold = false, bg = false) => `
  <tr style="${bg ? 'background:#f8fafc;' : ''}">
    <td style="border:1px solid ${SLATE_BORDER};padding:4px 6px;text-align:center;font-size:9px;width:6%;color:#64748b;font-weight:600;">${no}</td>
    <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;font-size:9px;color:${SLATE_DARK};${bold || bg ? 'font-weight:700;' : ''}">${label}</td>
    ${amountCell(amount, bold || bg)}
  </tr>
`

const footerBlock = () => `
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <tr>
      <td style="width:18%;border:1px solid ${SLATE_BORDER};padding:6px;text-align:center;vertical-align:middle;background:#f8fafc;">
        <div style="width:56px;height:56px;border:1px dashed #cbd5e1;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:7px;color:#64748b;font-weight:700;border-radius:4px;">
          <span style="font-size:10px;margin-bottom:1px;color:${COLOR_NAVY};">QR</span>
          <span>CODE</span>
        </div>
      </td>
      <td style="border:1px solid ${SLATE_BORDER};padding:8px 12px;font-size:8px;vertical-align:top;line-height:1.45;color:#475569;background:#f8fafc;">
        <div style="font-weight:800;margin-bottom:3px;color:${COLOR_NAVY};display:flex;align-items:center;gap:4px;font-size:8.5px;">
          <span style="display:inline-block;width:5px;height:5px;background:#10b981;border-radius:50%;"></span>
          Ditandatangani secara elektronik
        </div>
        <div>Dokumen ini merupakan Bukti Pemotongan yang ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Direktorat Jenderal Pajak.</div>
      </td>
    </tr>
  </table>
`

export const buildPph21OfficialHtml = (item: Pph21Content) => {
  const status = (item.status || item.fgStatus || 'NO STATUS').toUpperCase()
  const isDraft = status === 'DRAFT'
  const noBupot = item.nomorBupot || item.nomorBuktiPotong || item.noBupot || '-'
  const recipientName = item.namaPenerima || item.nama || '-'
  const recipientNpwp = formatNpwpDisplay(item.npwpPenerima || item.npwp)
  const sifat = item.feature === 'final' ? 'FINAL' : 'TIDAK FINAL'
  const bruto = Number(item.penghasilanKotor) || 0
  const brutoPrev = Number(item.penghasilanKotorSebelumnya) || 0
  const pph = Number(item.pphDipotong) || 0
  const neto = Math.max(bruto - brutoPrev, 0)

  return `
    <div style="width:794px;height:1040px;background:#fff;padding:20px;box-sizing:border-box;font-family:'Inter', -apple-system, Arial, sans-serif;color:${SLATE_DARK};position:relative;font-size:9px;page-break-inside:avoid;break-inside:avoid;overflow:hidden;">
      ${fontAndReset}
      ${proformaWatermark(isDraft)}
      ${djpHeader(
        'BUKTI PEMOTONGAN PAJAK PENGHASILAN PASAL 21 BAGI PEGAWAI TETAP ATAU PENSIUNAN YANG MENERIMA UANG TERKAIT PENSIUN SECARA BERKALA',
        'BPA1',
      )}
      ${metaRow([
        { label: 'NOMOR BUKTI PEMOTONGAN', value: noBupot },
        { label: 'PERIODE PENGHASILAN', value: buildPeriode(item.masaPajak, item.tahunPajak) },
        { label: 'SIFAT PEMOTONGAN', value: sifat },
        { label: 'STATUS BUKTI PEMOTONGAN', value: status },
      ])}

      ${sectionHeader('A. IDENTITAS PENERIMA PENGHASILAN')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;table-layout:fixed;">
        <tr>
          ${fieldRow('A.1', 'Status PTKP', '-', '50%')}
          ${fieldRow('A.6', 'Nomor Paspor', '-', '50%')}
        </tr>
        <tr>
          ${fieldRow('A.2', 'NPWP/NIK', recipientNpwp, '50%')}
          ${fieldRow('A.7', 'Status Bukti Potong', status, '50%')}
        </tr>
        <tr>
          ${fieldRow('A.3', 'Nama', recipientName, '50%')}
          ${fieldRow('A.8', 'Kode Negara Domisili', 'IDN', '50%')}
        </tr>
        <tr>
          ${fieldRow('A.4', 'Alamat', '-', '100%', 2)}
        </tr>
        <tr>
          ${fieldRow('A.5', 'Jenis Kelamin', '-', '50%')}
          ${fieldRow('A.9', 'Kode Objek Pajak', item.kodeObjekPajak || '-', '50%')}
        </tr>
        <tr>
          ${fieldRow('A.10', 'NPWP Pemotong', formatNpwpDisplay(PEMOTONG_NPWP), '100%', 2)}
        </tr>
      </table>

      ${sectionHeader('B. RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:4px;table-layout:fixed;">
        <tr>
          <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;font-size:9px;width:50%;color:${SLATE_DARK};font-weight:600;">Kode Objek Pajak : ${escapeHtml(item.kodeObjekPajak || '-')}</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;font-size:9px;color:${SLATE_DARK};font-weight:600;">Jenis Pemotongan : ${escapeHtml(item.pasalPPh || 'Pasal 21')}</td>
        </tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr style="background:${SLATE_LIGHT};font-weight:700;color:#334155;">
          <td style="border:1px solid ${SLATE_BORDER};padding:4px;text-align:center;width:6%;font-size:8.5px;">NO</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;font-size:8.5px;">PENGHASILAN BRUTO</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;text-align:center;width:22%;font-size:8.5px;">JUMLAH (Rp)</td>
        </tr>
        ${calcRow('1', 'Gaji/Pensiun', bruto)}
        ${calcRow('2', 'Tunjangan PPh', 0)}
        ${calcRow('3', 'Tunjangan Lainnya, Uang Lembur, dan sebagainya', 0)}
        ${calcRow('4', 'Honorarium dan Imbalan Lainnya Sejenisnya', 0)}
        ${calcRow('5', 'Premi Asuransi yang Dibayar Pemberi Kerja', 0)}
        ${calcRow('6', 'I. JUMLAH (1+2+3+4+5)', bruto, true, true)}
        ${calcRow('7', 'Biaya Jabatan/Biaya Pensiun', 0)}
        ${calcRow('8', 'Iuran Terkait Pensiun atau Hari Tua', 0)}
        ${calcRow('9', 'II. JUMLAH PENGURANGAN (7+8)', 0, true, true)}
        ${calcRow('10', 'III. PENGHASILAN NETO (6-9)', neto, true, true)}
        ${calcRow('11', 'Penghasilan Neto Masa Sebelumnya', brutoPrev)}
        ${calcRow('12', 'IV. JUMLAH PENGHASILAN NETO', neto + brutoPrev, true, true)}
        ${calcRow('13', 'PTKP', 0)}
        ${calcRow('14', 'V. PENGHASILAN KENA PAJAK', neto, true, true)}
        ${calcRow('15', 'PPh Pasal 21 Atas Penghasilan Kena Pajak', pph)}
        ${calcRow('16', 'PPh Pasal 21 Dipotong Masa Sebelumnya', 0)}
        ${calcRow('17', 'VI. PPh PASAL 21 TERUTANG', pph, true, true)}
        ${calcRow('18', 'VII. KEKURANGAN / KELEBIHAN PEMOTONGAN PPh PASAL 21', pph, true, true)}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>
          <td style="border:1px solid ${SLATE_BORDER};background:${SLATE_LIGHT};padding:4px 8px;font-weight:700;font-size:9px;width:70%;color:#475569;">
            B.B. JENIS FASILITAS PADA MASA PAJAK DESEMBER/MASA PAJAK TERAKHIR
          </td>
          <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;font-size:9px;color:${SLATE_DARK};font-weight:600;">${escapeHtml(item.statusPPh || '-')}</td>
        </tr>
      </table>

      ${sectionHeader('C. IDENTITAS PEMOTONG PPh')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>${fieldRow('C.1', 'NPWP/NIK', formatNpwpDisplay(PEMOTONG_NPWP), '100%')}</tr>
        <tr>${fieldRow('C.2', 'Nama Pemotong', PEMOTONG_NAME, '100%')}</tr>
        <tr>${fieldRow('C.3', 'Tanggal', formatTglPemotongan(item.tglPemotongan), '100%')}</tr>
        <tr>${fieldRow('C.4', 'Nama Penandatangan', SIGNER_NAME, '100%')}</tr>
        <tr>${fieldRow('C.5', 'Tempat', 'Jakarta', '100%')}</tr>
      </table>

      ${footerBlock()}
    </div>
  `
}

export const buildBpuOfficialHtml = (item: BpuContent) => {
  const status = (item.status || item.fgStatus || 'NO STATUS').toUpperCase()
  const isDraft = status === 'DRAFT'
  const noBupot = item.nomorBuktiPotong || item.noBupot || '-'
  const recipientName = item.namaPenerima || item.nama || item.name || '-'
  const recipientNpwp = formatNpwpDisplay(item.npwpPenerima || item.npwp)
  const dpp = Number(item.dpp) || 0
  const pph = Number(item.pphDipotong) || 0
  const tarif = Number(item.tarif) || 0

  return `
    <div style="width:794px;height:1040px;background:#fff;padding:20px;box-sizing:border-box;font-family:'Inter', -apple-system, Arial, sans-serif;color:${SLATE_DARK};position:relative;font-size:9px;page-break-inside:avoid;break-inside:avoid;overflow:hidden;">
      ${fontAndReset}
      ${proformaWatermark(isDraft)}
      ${djpHeader(
        'BUKTI PEMOTONGAN PAJAK PENGHASILAN UNIFIKASI (BPU)',
        'BPU',
      )}
      ${metaRow([
        { label: 'NOMOR BUKTI PEMOTONGAN', value: noBupot },
        { label: 'PERIODE PENGHASILAN', value: buildPeriode(item.masaPajak, item.tahunPajak) },
        { label: 'SIFAT PEMOTONGAN', value: 'TIDAK FINAL' },
        { label: 'STATUS BUKTI PEMOTONGAN', value: status },
      ])}

      ${sectionHeader('A. IDENTITAS PENERIMA PENGHASILAN')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;table-layout:fixed;">
        <tr>
          ${fieldRow('A.1', 'NPWP/NIK', recipientNpwp, '50%')}
          ${fieldRow('A.4', 'Kode Objek Pajak', item.kodeObjekPajak || '-', '50%')}
        </tr>
        <tr>
          ${fieldRow('A.2', 'Nama', recipientName, '50%')}
          ${fieldRow('A.5', 'Pasal PPh', item.pasalPPh || '-', '50%')}
        </tr>
        <tr>
          ${fieldRow('A.3', 'Alamat', item.alamatPenerima || '-', '100%', 2)}
        </tr>
      </table>

      ${sectionHeader('B. RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:6px;table-layout:fixed;">
        <tr>
          <td style="border:1px solid ${SLATE_BORDER};padding:5px 8px;font-size:9px;width:50%;color:${SLATE_DARK};font-weight:600;">KAP : ${escapeHtml(item.kap || '-')}</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:5px 8px;font-size:9px;color:${SLATE_DARK};font-weight:600;">KJS : ${escapeHtml(item.kjs || '-')}</td>
        </tr>
        <tr>
          <td style="border:1px solid ${SLATE_BORDER};padding:5px 8px;font-size:9px;color:${SLATE_DARK};font-weight:600;">Status PPh : ${escapeHtml(item.statusPPh || '-')}</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:5px 8px;font-size:9px;color:${SLATE_DARK};font-weight:600;">Tarif (%) : ${escapeHtml(tarif)}%</td>
        </tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr style="background:${SLATE_LIGHT};font-weight:700;color:#334155;">
          <td style="border:1px solid ${SLATE_BORDER};padding:5px;text-align:center;width:6%;font-size:8.5px;">NO</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:5px 8px;font-size:8.5px;">URAIAN</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:5px 8px;text-align:center;width:22%;font-size:8.5px;">JUMLAH (Rp)</td>
        </tr>
        ${calcRow('1', 'Dasar Pengenaan Pajak (DPP)', dpp)}
        <tr>
          <td style="border:1px solid ${SLATE_BORDER};padding:4px 6px;text-align:center;font-size:9px;width:6%;color:#64748b;font-weight:600;">2</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;font-size:9px;color:${SLATE_DARK};">Tarif PPh (%)</td>
          <td style="border:1px solid ${SLATE_BORDER};padding:4px 8px;text-align:right;font-size:9px;color:${SLATE_DARK};">${escapeHtml(tarif)}%</td>
        </tr>
        ${calcRow('3', 'PPh Dipotong', pph, true, true)}
      </table>

      ${sectionHeader('C. IDENTITAS PEMOTONG PPh')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr>${fieldRow('C.1', 'NPWP/NIK', formatNpwpDisplay(PEMOTONG_NPWP), '100%')}</tr>
        <tr>${fieldRow('C.2', 'Nama Pemotong', PEMOTONG_NAME, '100%')}</tr>
        <tr>${fieldRow('C.3', 'Alamat', PEMOTONG_ADDRESS, '100%')}</tr>
        <tr>${fieldRow('C.4', 'Tanggal', formatTglPemotongan(item.tglPemotongan), '100%')}</tr>
        <tr>${fieldRow('C.5', 'Nama Penandatangan', SIGNER_NAME, '100%')}</tr>
      </table>

      ${footerBlock()}
    </div>
  `
}
