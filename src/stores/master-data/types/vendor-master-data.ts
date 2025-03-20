export type CountryListType = {
  countryID: number
  currencyId: number
  countryCode: string
  countryName: string
  countryPhonePrefix: string
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

export type BusinessType = {
  businessFieldID: number
  businessFieldName: string
}

export type SubBusinessType = {
  subBusinessFieldID: number
  subBusinessFieldName: string
}

export type BusinessFieldListType = (BusinessType & {
  subBusiness: SubBusinessType[]
})[]

export type BusinessFieldReducerType = BusinessType & {
  subBusiness: SubBusinessType[]
}

export type BusinessFieldResponse = (BusinessType & SubBusinessType)[]
