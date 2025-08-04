export interface ISelectProps {
  label?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  row?: boolean
  options: { [key: string]: any }[]
  valueKey?: string
  textKey?: string
  required?: boolean
  error?: boolean
  hintText?: string
}
