export interface IModalProps {
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export type ModalConfirmationType = {
  open: boolean
  id: string
  type: 'danger' | 'confirm' | 'success'
  title?: string
  text?: string
  static?: boolean
  cancelButtonText?: string
  submitButtonText?: string
  cancelButtonIcon?: string
  submitButtonIcon?: string
  noCancel?: boolean
  noSubmit?: boolean
  cancel?: (...args: any[]) => void
  submit?: (...args: any[]) => void
  loading?: boolean
}
