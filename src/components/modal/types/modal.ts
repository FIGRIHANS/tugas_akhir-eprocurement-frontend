export interface IModalProps {
  title?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  static?: boolean
  center?: boolean
  hideHeader?: boolean
  hideClose?: boolean
}

export type ModalConfirmationType = {
  open: boolean
  id: string
  type: 'danger' | 'confirm' | 'success' | 'warning'
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
