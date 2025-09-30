export const getTableCols = (t: (key: string) => string): { key: string; label: string }[] => [
  {
    key: 'actions',
    label: '',
  },
  {
    key: 'documentName',
    label: t('otherDocumentData.table.headers.documentName'),
  },
  {
    key: 'documentNo',
    label: t('otherDocumentData.table.headers.documentNo'),
  },
  {
    key: 'availabelUntil',
    label: t('otherDocumentData.table.headers.availableUntil'),
  },
]
