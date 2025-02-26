export interface ITabProps {
  modelValue: string
  items: ITabItem[]
  itemClass?: string
  numbering?: boolean
  step?: boolean
}

export interface ITabItem {
  label: string
  value: string
  disabled?: boolean
  itemClass?: string
}
