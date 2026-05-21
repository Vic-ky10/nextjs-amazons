'use client'
import { useCartSidebarControls } from '@/create hooks/use-cart-sidebar'
import { ToastProvider } from '@/components/ui/toast-provider'
import React from 'react'
import CartSidebar from './cart-sidebar'
import SideCartToggle from './side-cart/side-cart-toggle'


export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const { canShowCartSidebar, isCartSidebarOpen } = useCartSidebarControls()

  return (
    <ToastProvider>
      {canShowCartSidebar ? (
        <div className='flex min-h-screen'>
          <div className='flex-1 overflow-hidden'>{children}</div>
          {isCartSidebarOpen ? <CartSidebar /> : <SideCartToggle />}
        </div>
      ) : (
        <div>{children}</div>
      )}
    </ToastProvider>
  )
}
