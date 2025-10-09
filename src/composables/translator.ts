import { useDictionaryStore } from '@/stores/general/dictionary'

const tr = (key: string): string => {
  const dictionaryStore = useDictionaryStore()

  const locale = dictionaryStore.locale
  const dictionary = dictionaryStore.dictionary

  const dictionaryData = dictionary.find(
    (item) => item.code.toLowerCase().replace(/\s+/g, '') === key.toLowerCase().replace(/\s+/g, ''),
  )

  if (!dictionaryData) {
    return key
  }

  return locale === 'id' ? dictionaryData.idn : dictionaryData.eng
}

export default tr

// CARA PENGGUNAAN

// 1. Import tr dari composables/translator import tr from '@/composables/translator'
// 2. Gunakan tr untuk mengambil teks dari dictionary
// 3. Contoh: {{ tr('key') }}
// 4. Jika key tidak ditemukan, maka akan mengembalikan key itu sendiri
// 5. Jika key ditemukan, maka akan mengembalikan teks dari dictionary
// 6. Penggunaan untuk penggunaan dropdown cukup ganti label dengan value dari dictionary
// 7. contoh penggunaan untuk lookup bisa search global value const translatedBusinessFieldList
