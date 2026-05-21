'use client'

import { Button } from '@/components/ui/button'
import { useCartSidebarControls } from '@/create hooks/use-cart-sidebar'
import useCartStore from '@/hooks/use-cart-store'
import { ChevronLeft, ShoppingCart } from 'lucide-react'

export default function SideCartToggle() {
  const { openCartSidebar } = useCartSidebarControls()
  const {
    cart: { items },
  } = useCartStore()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button
      type='button'
      onClick={openCartSidebar}
      className='fixed right-0 top-1/2 z-40 h-auto -translate-y-1/2 rounded-l-full rounded-r-none px-3 py-3 shadow-lg'
      aria-label='Open side cart'
      title='Open side cart'
    >
      <div className='flex flex-col items-center gap-1'>
        <ChevronLeft className='h-4 w-4' />
        <ShoppingCart className='h-5 w-5' />
        <span className='min-w-5 rounded-full bg-white px-1.5 text-xs font-bold text-pink-600'>
          {itemCount}
        </span>
      </div>
    </Button>
  )
}
