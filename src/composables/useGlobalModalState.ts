import { onMounted, onUnmounted, ref } from 'vue'

const isAnyModalOpen = ref(false)

let observer: MutationObserver | null = null
let subscriberCount = 0

function isVisibleBackdrop(element: Element): boolean {
  const style = window.getComputedStyle(element as HTMLElement)
  return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden'
}

function detectAnyModalOpen(): boolean {
  const openModals = document.querySelectorAll('.modal.open')
  if (openModals.length > 0) {
    return true
  }

  const backdrops = document.querySelectorAll('.modal-backdrop')
  return Array.from(backdrops).some(isVisibleBackdrop)
}

function syncModalState() {
  isAnyModalOpen.value = detectAnyModalOpen()
}

function startObserver() {
  if (observer) return

  syncModalState()
  observer = new MutationObserver(syncModalState)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style'],
  })
}

function stopObserver() {
  if (subscriberCount > 0 || !observer) return

  observer.disconnect()
  observer = null
  isAnyModalOpen.value = false
}

export function useGlobalModalState() {
  onMounted(() => {
    subscriberCount += 1
    startObserver()
  })

  onUnmounted(() => {
    subscriberCount = Math.max(0, subscriberCount - 1)
    stopObserver()
  })

  return { isAnyModalOpen }
}
