export type CountryListType = {
  countryID: number
  countryName: string
}[]

export type CityListType = {
  cityID: number
  cityName: string
  provinceID: number
}[]

export type DistrictListType = {
  districtID: number
  districtName: string
  cityID: number
}[]
