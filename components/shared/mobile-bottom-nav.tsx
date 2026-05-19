'use client'

import Link from 'next/link'
import { Heart, Home, Search, ShoppingCart, User } from 'lucide-react'

import useCartStore from '@/hooks/use-cart-store'
import useIsMounted from '@/hooks/use-is-mounted'
import { useWishlistStore } from '@/hooks/use-wishlist-store'

function Badge({ count }: { count: number }) {
  if (count <= 0) return null

  return (
    <span className='absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold leading-4 text-white'>
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function MobileBottomNav() {
  const isMounted = useIsMounted()
  const cartCount = useCartStore((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  )
  const wishlistCount = useWishlistStore((state) => state.items.length)

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, count: cartCount },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, count: wishlistCount },
    { label: 'Account', href: '/account', icon: User },
  ]

  return (
    <nav className='fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 shadow-[0_-6px_18px_rgba(0,0,0,0.08)] backdrop-blur md:hidden'>
      <div className='grid h-16 grid-cols-5'>
        {items.map((item) => {
          const Icon = item.icon
          const count = isMounted ? item.count ?? 0 : 0

          return (
            <Link
              key={item.href}
              href={item.href}
              className='flex min-w-0 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-pink-600'
            >
              <span className='relative'>
                <Icon className='size-5' />
                <Badge count={count} />
              </span>
              <span className='max-w-full truncate'>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
