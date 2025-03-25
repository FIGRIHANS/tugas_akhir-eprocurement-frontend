export interface ITabClosableProps {
  openedTabs: ITabClosable[]
  tabs: ITabClosable[]
}
export interface ITabClosable {
  id: string;
  label: string;
  isClosable?: boolean;
  isVerified?:boolean
}
