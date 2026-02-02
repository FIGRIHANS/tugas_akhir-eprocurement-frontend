import moment from 'moment'

export const parseIndoDate = (dateStr: string) => {
  if (!dateStr) return null

  const monthMap: Record<string, string> = {
    januari: '01',
    februari: '02',
    maret: '03',
    april: '04',
    mei: '05',
    juni: '06',
    juli: '07',
    agustus: '08',
    september: '09',
    oktober: '10',
    november: '11',
    desember: '12',
    january: '01',
    february: '02',
    march: '03',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    october: '10',
    december: '12',
  }

  const cleanedDateStr = dateStr.replace(/\n/g, ' ').trim()
  const parts = cleanedDateStr.split(/\s+/) // Split by any whitespace including multiple spaces
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0')
    const month = monthMap[parts[1].toLowerCase()] || '01'
    const year = parts[2]
    return moment(`${year}-${month}-${day}`).format('YYYY-MM-DD')
  }

  return moment(dateStr).format('YYYY-MM-DD')
}
