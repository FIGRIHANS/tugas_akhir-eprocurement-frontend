import { nextTick } from 'vue'

const VIEWPORT_PADDING = 16

/** Shift vue-select dropdown (appendToBody) left when it overflows the viewport. */
export function repositionVueSelectDropdownLeft() {
  void nextTick(() => {
    requestAnimationFrame(() => {
      const menus = document.querySelectorAll<HTMLElement>('.vs__dropdown-menu')
      const menu = menus[menus.length - 1]
      if (!menu) return

      const rect = menu.getBoundingClientRect()
      const maxWidth = window.innerWidth - VIEWPORT_PADDING * 2
      menu.style.minWidth = '280px'
      menu.style.maxWidth = `${maxWidth}px`

      let left = parseFloat(menu.style.left)
      if (Number.isNaN(left)) left = rect.left

      if (rect.right > window.innerWidth - VIEWPORT_PADDING) {
        left -= rect.right - (window.innerWidth - VIEWPORT_PADDING)
      }

      if (left < VIEWPORT_PADDING) {
        left = VIEWPORT_PADDING
      }

      menu.style.left = `${left}px`
    })
  })
}
