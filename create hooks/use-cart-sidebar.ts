import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import useDeviceType from './use-device-type'
import useCartStore from '@/hooks/use-cart-store'

const cartSidebarStorageKey = 'cart-sidebar-collapsed'
const cartSidebarUpdatedEvent = 'cart-sidebar-updated'

const isNotInPaths = (s: string) =>
  !/^\/$|^\/cart$|^\/checkout$|^\/sign-in$|^\/sign-up$|^\/order(\/.*)?$|^\/account(\/.*)?$|^\/admin(\/.*)?$/.test(
    s
  )

function readCollapsedState() {
  if (typeof window === 'undefined') return false

  return window.localStorage.getItem(cartSidebarStorageKey) === 'true'
}

function writeCollapsedState(isCollapsed: boolean) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(cartSidebarStorageKey, String(isCollapsed))
  window.dispatchEvent(new Event(cartSidebarUpdatedEvent))
}

export function useCartSidebarControls() {
  const {
    cart: { items },
  } = useCartStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const deviceType = useDeviceType()
  const currentPath = usePathname()
  const canShowCartSidebar =
    items.length > 0 && deviceType === 'desktop' && isNotInPaths(currentPath)

  useEffect(() => {
    const syncCollapsedState = () => setIsCollapsed(readCollapsedState())

    syncCollapsedState()
    window.addEventListener('storage', syncCollapsedState)
    window.addEventListener(cartSidebarUpdatedEvent, syncCollapsedState)

    return () => {
      window.removeEventListener('storage', syncCollapsedState)
      window.removeEventListener(cartSidebarUpdatedEvent, syncCollapsedState)
    }
  }, [])

  const openCartSidebar = () => writeCollapsedState(false)
  const closeCartSidebar = () => writeCollapsedState(true)
  const toggleCartSidebar = () => writeCollapsedState(!readCollapsedState())

  return {
    canShowCartSidebar,
    isCartSidebarOpen: canShowCartSidebar && !isCollapsed,
    isCollapsed,
    openCartSidebar,
    closeCartSidebar,
    toggleCartSidebar,
  }
}

function useCartSidebar() {
  const { isCartSidebarOpen } = useCartSidebarControls()

  return isCartSidebarOpen
}

export default useCartSidebar
