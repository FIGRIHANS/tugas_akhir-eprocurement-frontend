export interface IInputTelProps {
  label?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  row?: boolean
  required?: boolean
  error?: boolean
  options: { [key: string]: any }[]
  valueKey?: string
  textKey?: string
}
