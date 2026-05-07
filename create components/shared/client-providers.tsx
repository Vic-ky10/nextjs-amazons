'use client'
import useCartSidebar from '@/create hooks/use-cart-sidebar'
import { ToastProvider } from '@/components/ui/toast-provider'
import React from 'react'
import CartSidebar from './cart-sidebar'



export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const isCartSidebarOpen = useCartSidebar()

  return (
    <ToastProvider>
      {isCartSidebarOpen ? (
        <div className='flex min-h-screen'>
          <div className='flex-1 overflow-hidden'>{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <div>{children}</div>
      )}
    </ToastProvider>
  )
}
