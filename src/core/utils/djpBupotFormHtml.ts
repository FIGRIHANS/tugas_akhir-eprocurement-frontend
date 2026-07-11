import type { BpuContent } from '@/services/bpu.service'
import type { Pph21Content } from '@/services/pph21.service'
import moment from 'moment'

export const PEMOTONG_NPWP = '1091031210969728'
export const PEMOTONG_NAME = 'PT EVOX'
export const PEMOTONG_ADDRESS = 'Jl. Sudirman No. 52, Jakarta Selatan 12190'
export const SIGNER_NAME = 'RADHITYA ARIE KENPRASOJO'

const NAVY = '#1f3f67'
const GREY = '#d9d9d9'
const YELLOW = '#f4e04d'

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
    ? `<div style="position:absolute;top:42%;left:50%;transform:translate(-50%,-50%) rotate(-25deg);font-size:64px;font-weight:800;color:rgba(160,174,192,0.12);border:6px solid rgba(160,174,192,0.12);padding:6px 20px;letter-spacing:5px;z-index:5;">PROFORMA</div>`
    : ''

const djpHeader = (title: string, formCode: string) => `
  <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
    <tr>
      <td style="width:18%;vertical-align:top;padding:4px;">
        <div style="font-size:9px;font-weight:700;line-height:1.2;">KEMENTERIAN KEUANGAN<br/>REPUBLIK INDONESIA<br/>DIREKTORAT JENDERAL PAJAK</div>
      </td>
      <td style="width:64%;text-align:center;vertical-align:middle;padding:4px 8px;">
        <div style="font-size:11px;font-weight:700;line-height:1.35;text-transform:uppercase;">${title}</div>
      </td>
      <td style="width:18%;text-align:right;vertical-align:top;padding:4px;">
        <div style="display:inline-block;background:${YELLOW};border:1px solid #000;padding:10px 14px;font-size:22px;font-weight:800;">${formCode}</div>
      </td>
    </tr>
  </table>
`

const metaRow = (cells: { label: string; value: string }[]) => `
  <table style="width:100%;border-collapse:collapse;margin-bottom:8px;font-size:10px;">
    <tr>
      ${cells
        .map(
          (c) => `
        <td style="border:1px solid #000;width:${100 / cells.length}%;vertical-align:top;">
          <div style="background:${GREY};padding:4px 6px;font-weight:700;text-align:center;">${escapeHtml(c.label)}</div>
          <div style="padding:6px;text-align:center;min-height:28px;">${escapeHtml(c.value)}</div>
        </td>`,
        )
        .join('')}
    </tr>
  </table>
`

const sectionHeader = (label: string) => `
  <div style="background:${NAVY};color:#fff;font-weight:700;font-size:10px;padding:5px 8px;border:1px solid #000;">${label}</div>
`

const fieldRow = (code: string, label: string, value: string, width = '50%') => `
  <td style="width:${width};border:1px solid #000;padding:3px 6px;font-size:10px;vertical-align:top;">
    <span style="display:inline-block;width:22px;">${code}</span>
    <span style="display:inline-block;width:120px;">${label}</span>
    <span>: ${escapeHtml(value)}</span>
  </td>
`

const amountCell = (value: number | string | undefined, bold = false) => `
  <td style="border:1px solid #000;padding:3px 6px;text-align:right;font-size:10px;${bold ? 'font-weight:700;background:#f3f4f6;' : ''}">
    ${escapeHtml(formatRpAmount(value))}
  </td>
`

const calcRow = (no: string, label: string, amount: number | string | undefined, bold = false, bg = false) => `
  <tr>
    <td style="border:1px solid #000;padding:3px 6px;text-align:center;font-size:10px;width:6%;${bg ? 'background:#f3f4f6;font-weight:700;' : ''}">${no}</td>
    <td style="border:1px solid #000;padding:3px 6px;font-size:10px;${bold || bg ? 'font-weight:700;' : ''}${bg ? 'background:#f3f4f6;' : ''}">${label}</td>
    ${amountCell(amount, bold || bg)}
  </tr>
`

const footerBlock = () => `
  <table style="width:100%;border-collapse:collapse;margin-top:12px;">
    <tr>
      <td style="width:18%;border:1px solid #000;padding:10px;text-align:center;vertical-align:middle;">
        <div style="width:72px;height:72px;border:1px solid #999;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:8px;color:#666;">QR CODE</div>
      </td>
      <td style="border:1px solid #000;padding:10px;font-size:9px;vertical-align:top;line-height:1.4;">
        <div style="font-weight:700;margin-bottom:6px;">Ditandatangani secara elektronik</div>
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
    <div style="width:794px;min-height:1122px;background:#fff;padding:18px;box-sizing:border-box;font-family:Arial,sans-serif;color:#111;position:relative;font-size:10px;">
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
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>
          ${fieldRow('A.1', 'Status PTKP', '-')}
          ${fieldRow('A.6', 'Nomor Paspor', '-')}
        </tr>
        <tr>
          ${fieldRow('A.2', 'NPWP/NIK', recipientNpwp)}
          ${fieldRow('A.7', 'Status Bukti Potong', status)}
        </tr>
        <tr>
          ${fieldRow('A.3', 'Nama', recipientName)}
          ${fieldRow('A.8', 'Kode Negara Domisili', 'IDN')}
        </tr>
        <tr>
          ${fieldRow('A.4', 'Alamat', '-', '100%')}
        </tr>
        <tr>
          ${fieldRow('A.5', 'Jenis Kelamin', '-')}
          ${fieldRow('A.9', 'Kode Objek Pajak', item.kodeObjekPajak || '-')}
        </tr>
        <tr>
          ${fieldRow('A.10', 'NPWP Pemotong', formatNpwpDisplay(PEMOTONG_NPWP), '100%')}
        </tr>
      </table>

      ${sectionHeader('B. RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
        <tr>
          <td style="border:1px solid #000;padding:4px 6px;font-size:10px;width:50%;">Kode Objek Pajak : ${escapeHtml(item.kodeObjekPajak || '-')}</td>
          <td style="border:1px solid #000;padding:4px 6px;font-size:10px;">Jenis Pemotongan : ${escapeHtml(item.pasalPPh || 'Pasal 21')}</td>
        </tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr style="background:${GREY};font-weight:700;">
          <td style="border:1px solid #000;padding:4px;text-align:center;width:6%;">NO</td>
          <td style="border:1px solid #000;padding:4px;">PENGHASILAN BRUTO</td>
          <td style="border:1px solid #000;padding:4px;text-align:center;width:22%;">JUMLAH (Rp)</td>
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
          <td style="border:1px solid #000;background:${GREY};padding:4px 6px;font-weight:700;font-size:10px;width:70%;">
            B.B. JENIS FASILITAS PADA MASA PAJAK DESEMBER/MASA PAJAK TERAKHIR
          </td>
          <td style="border:1px solid #000;padding:4px 6px;font-size:10px;">${escapeHtml(item.statusPPh || '-')}</td>
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
    <div style="width:794px;min-height:1122px;background:#fff;padding:18px;box-sizing:border-box;font-family:Arial,sans-serif;color:#111;position:relative;font-size:10px;">
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
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>
          ${fieldRow('A.1', 'NPWP/NIK', recipientNpwp)}
          ${fieldRow('A.4', 'Kode Objek Pajak', item.kodeObjekPajak || '-')}
        </tr>
        <tr>
          ${fieldRow('A.2', 'Nama', recipientName)}
          ${fieldRow('A.5', 'Pasal PPh', item.pasalPPh || '-')}
        </tr>
        <tr>
          ${fieldRow('A.3', 'Alamat', item.alamatPenerima || '-', '100%')}
        </tr>
      </table>

      ${sectionHeader('B. RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
        <tr>
          <td style="border:1px solid #000;padding:4px 6px;font-size:10px;width:50%;">KAP : ${escapeHtml(item.kap || '-')}</td>
          <td style="border:1px solid #000;padding:4px 6px;font-size:10px;">KJS : ${escapeHtml(item.kjs || '-')}</td>
        </tr>
        <tr>
          <td style="border:1px solid #000;padding:4px 6px;font-size:10px;">Status PPh : ${escapeHtml(item.statusPPh || '-')}</td>
          <td style="border:1px solid #000;padding:4px 6px;font-size:10px;">Tarif (%) : ${escapeHtml(tarif)}%</td>
        </tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr style="background:${GREY};font-weight:700;">
          <td style="border:1px solid #000;padding:4px;text-align:center;width:6%;">NO</td>
          <td style="border:1px solid #000;padding:4px;">URAIAN</td>
          <td style="border:1px solid #000;padding:4px;text-align:center;width:22%;">JUMLAH (Rp)</td>
        </tr>
        ${calcRow('1', 'Dasar Pengenaan Pajak (DPP)', dpp)}
        <tr>
          <td style="border:1px solid #000;padding:3px 6px;text-align:center;font-size:10px;width:6%;">2</td>
          <td style="border:1px solid #000;padding:3px 6px;font-size:10px;">Tarif PPh (%)</td>
          <td style="border:1px solid #000;padding:3px 6px;text-align:right;font-size:10px;">${escapeHtml(tarif)}%</td>
        </tr>
        ${calcRow('3', 'PPh Dipotong', pph, true, true)}
      </table>

      ${sectionHeader('C. IDENTITAS PEMOTONG PPh')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
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
