import type { LocationQueryValue } from "vue-router"

export interface IFilterButtonProps{
  filter: IFilterButton
}

export interface IFilterButton {
  key: string
  value: LocationQueryValue | LocationQueryValue[]
}
