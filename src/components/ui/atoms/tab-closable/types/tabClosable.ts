export interface ITabClosableProps {
  tabs: ITabClosable[]
}
export interface ITabClosable {
  id: string
  label: string
  isClosable?: boolean
  isVerified?: boolean
}
