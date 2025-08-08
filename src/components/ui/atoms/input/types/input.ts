export interface IInputProps {
  label?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  row?: boolean
  required?: boolean
  error?: boolean
  type?: 'text' | 'number' | 'password' | 'date'
  hintText?: string
  maxLength?: number
}
