import { computed } from 'vue'
import type { Ref } from 'vue'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function mysqlFormat(dateRef: Ref<Date | null>) {
  return computed(() => {
    if (!dateRef.value) return null

    const rawDate = dateRef.value instanceof Date ? dateRef.value : new Date(dateRef.value)

    const y = rawDate.getFullYear()
    const m = pad(rawDate.getMonth() + 1)
    const d = pad(rawDate.getDate())
    // const h = pad(rawDate.getHours())
    // const min = pad(rawDate.getMinutes())
    // const s = pad(rawDate.getSeconds())

    return `${y}-${m}-${d}`
  })
}

export const formatDate = (date: Date, local: 'us' | 'id' = 'id') => {
  return new Intl.DateTimeFormat(local, { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(
    date,
  )
}

export const formattoMySQL = (date: Date, withTime: boolean = true) => {
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())

  if (withTime) {
    const h = pad(date.getHours())
    const min = pad(date.getMinutes())
    const s = pad(date.getSeconds())
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  }

  return `${y}-${m}-${d}`
}
