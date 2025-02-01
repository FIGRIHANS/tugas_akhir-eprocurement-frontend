interface KTLayoutType {
  // Constants
  readonly sidebarEl: HTMLElement
  readonly sidebarWrapperEl: HTMLElement
  readonly headerEl: HTMLElement
  readonly sidebarToggleEl: HTMLElement

  // Methods
  _isSidebarCollapse(): boolean
  _handleMegaMenu(megaMenuElement?: HTMLElement): void
  _handleSidebar(): void
  _handleSidebarMenu(): void
  init(): void

  isSidebarCollapse(): boolean
}

export declare const KTLayout: KTLayoutType
export function init() {
  throw new Error('Function not implemented.')
}

