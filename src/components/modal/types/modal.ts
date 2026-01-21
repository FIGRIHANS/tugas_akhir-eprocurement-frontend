export interface IModalProps {
  title?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  static?: boolean
  center?: boolean
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

export type ModalNotificationType = {
  open: boolean
  id: string
  type: 'info' | 'success' | 'error' | 'warning'
  title: string
  text: string
  buttonText?: string
  static?: boolean
  onClose?: () => void
}
