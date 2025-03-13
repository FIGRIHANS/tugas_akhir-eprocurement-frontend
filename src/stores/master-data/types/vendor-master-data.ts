export type CountryListType = {
  countryID: number
  countryName: string
}[]

export type ProvinceListType = {
  provinceID: number
  provinceName: string
  countryID: number
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

export type PositionListType = {
  positionTypeId: number
  positionName: string
}[]

export type BankListType = {
  bankCountryCode: string
  bankCode: string
  bankName: string
}[]

export type BusinessFieldListType = {
  businessFieldID: number
  businessFieldName: string
}[]
